import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import type { CartItem } from "@/components/cart/CartContext";
import { notifyRestaurantOrder } from "@/lib/notifyOrder";

type Body = {
  mode: "delivery" | "pickup";
  name: string;
  address: string | null;
  apartment: string | null;
  phone: string;
  deliveryFee: number;
  totalPrice: number;
  items: CartItem[];
};

export async function POST(request: Request) {
  const body = (await request.json()) as Body;

  if (!body.items?.length) {
    return NextResponse.json(
      { error: "Cart is empty" },
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
      note:
        body.mode === "delivery" && body.apartment
          ? `Stan: ${body.apartment}`
          : null,
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

  try {
    await notifyRestaurantOrder({
      orderId,
      orderNumber,
      customerName: body.name,
      phone: body.phone,
      address: body.mode === "delivery" ? body.address : null,
      deliveryType:
        body.mode === "delivery" ? "dostava" : "licno_preuzimanje",
      note:
        body.mode === "delivery" && body.apartment
          ? `Stan: ${body.apartment}`
          : null,
      totalPrice: body.totalPrice,
      items: body.items,
    });
  } catch (err) {
    console.error("Failed to send order notification email:", err);
  }

  return NextResponse.json({ orderId }, { status: 201 });
}

