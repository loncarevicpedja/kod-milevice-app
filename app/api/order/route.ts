import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import type { CartItem } from "@/components/cart/CartContext";
import { notifyRestaurantOrder } from "@/lib/notifyOrder";
import { getRestaurantSettingsFromDb } from "@/lib/restaurantSettingsDb";
import {
  closedReasonMessage,
  getOrderingClosedReason,
} from "@/lib/restaurantHours";

type Body = {
  mode: "delivery" | "pickup";
  name: string;
  address: string | null;
  apartment: string | null;
  phone: string;
  deliveryFee: number;
  totalPrice: number;
  items: CartItem[];
  orderNote: string | null;
};

export async function POST(request: Request) {
  const body = (await request.json()) as Body;

  if (!body.items?.length) {
    return NextResponse.json(
      { error: "Cart is empty" },
      { status: 400 },
    );
  }

  const settings = await getRestaurantSettingsFromDb();
  const closed = getOrderingClosedReason(new Date(), settings);
  if (closed) {
    return NextResponse.json(
      {
        error: closedReasonMessage(closed, new Date(), settings),
        code: "ORDERING_CLOSED",
        reason: closed,
      },
      { status: 403 },
    );
  }

  let itemsSubtotal = 0;
  for (const item of body.items) {
    const addonsTotal = item.addons.reduce((s, a) => s + a.price, 0);
    itemsSubtotal += (item.basePrice + addonsTotal) * item.quantity;
  }

  const expectedDeliveryFee =
    body.mode === "delivery" ? settings.delivery_fee_rsd : 0;
  const expectedTotal = itemsSubtotal + expectedDeliveryFee;

  if (Math.round(expectedTotal) !== Math.round(body.totalPrice)) {
    return NextResponse.json(
      {
        error: "Ukupan iznos se ne poklapa sa trenutnim cenama. Osveži stranicu i pokušaj ponovo.",
        code: "PRICE_MISMATCH",
      },
      { status: 400 },
    );
  }

  if (body.mode === "delivery" && body.deliveryFee !== expectedDeliveryFee) {
    return NextResponse.json(
      { error: "Cena dostave nije ispravna.", code: "DELIVERY_FEE_MISMATCH" },
      { status: 400 },
    );
  }

  const orderNumber = `KM-${Date.now()}`;

  const { data: orderData, error: orderError } = await supabase
    .from("order")
    .insert({
      order_number: orderNumber,
      customer_name: body.name,
      phone: body.phone,
      address: body.mode === "delivery" ? body.address : null,
      delivery_type: body.mode === "delivery" ? "dostava" : "licno_preuzimanje",
      note_for_address:
        body.mode === "delivery" && body.apartment
          ? `Stan: ${body.apartment}`
          : null,
      order_note: body.orderNote,
      total_price: body.totalPrice,
      status: "pending",
    })
    .select("id")
    .single();

  if (orderError || !orderData) {
    console.error(orderError);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 },
    );
  }

  const orderId = orderData.id as number;

  const orderItemsPayload = body.items.map((item) => {
    const addonsTotal = item.addons.reduce(
      (sum, addon) => sum + addon.price,
      0,
    );
    const unitPrice = item.basePrice + addonsTotal;

    return {
      order_id: orderId,
      product_id: item.productId,
      quantity: item.quantity,
      price_per_unit: unitPrice,
      note: item.note ?? null,
    };
  });

  const { data: orderItemsData, error: orderItemsError } = await supabase
    .from("order_item")
    .insert(orderItemsPayload)
    .select("id");

  if (orderItemsError || !orderItemsData) {
    console.error(orderItemsError);
    return NextResponse.json(
      { error: "Failed to create order items" },
      { status: 500 },
    );
  }

  const addonsPayload = body.items.flatMap((item, index) => {
    const orderItemId = orderItemsData[index]?.id as number | undefined;
    if (!orderItemId) return [];

    return item.addons.map((addon) => ({
      order_item_id: orderItemId,
      addon_id: addon.id,
      price: addon.price,
    }));
  });

  if (addonsPayload.length > 0) {
    const { error: addonsError } = await supabase
      .from("order_item_addon")
      .insert(addonsPayload);
    if (addonsError) {
      console.error(addonsError);
      return NextResponse.json(
        { error: "Failed to create addons" },
        { status: 500 },
      );
    }
  }

  if (settings.order_email_enabled) {
    try {
      await notifyRestaurantOrder({
        orderId,
        orderNumber,
        customerName: body.name,
        phone: body.phone,
        address: body.mode === "delivery" ? body.address : null,
        deliveryType:
          body.mode === "delivery" ? "dostava" : "licno_preuzimanje",
        noteForAddress:
          body.mode === "delivery" && body.apartment
            ? `Stan: ${body.apartment}`
            : null,
        orderNote: body.orderNote,
        itemsSubtotal,
        deliveryFee: expectedDeliveryFee,
        totalPrice: body.totalPrice,
        items: body.items,
      });
    } catch (err) {
      console.error("Failed to send order notification email:", err);
    }
  } else if (process.env.NODE_ENV === "development") {
    console.log(
      `[order] Email rezerva isključena (order_email_enabled=false) – samo baza/POS; porudžbina #${orderId}`,
    );
  }

  return NextResponse.json({ orderId }, { status: 201 });
}

