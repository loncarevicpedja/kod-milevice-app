import { Resend } from "resend";
import type { CartItem } from "@/components/cart/CartContext";

type OrderPayload = {
  orderId: number;
  orderNumber: string;
  customerName: string;
  phone: string;
  address: string | null;
  deliveryType: string;
  noteForAddress: string | null;
  orderNote: string | null;
  totalPrice: number;
  items: CartItem[];
};

export async function notifyRestaurantOrder(
  payload: OrderPayload
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.RESTAURANT_EMAIL;

  if (!apiKey || !toEmail) {
    if (process.env.NODE_ENV === "development") {
      console.log(
        "[notifyOrder] Email nije poslat: u .env.local dodaj RESTAURANT_EMAIL i RESEND_API_KEY (resend.com)"
      );
    }
    return;
  }

  const resend = new Resend(apiKey);

  const deliveryLabel =
    payload.deliveryType === "dostava" ? "Dostava" : "Lično preuzimanje";
  const addressLine = payload.address
    ? `Adresa: ${payload.address}${
        payload.noteForAddress ? ` (${payload.noteForAddress})` : ""
      }`
    : "Lično preuzimanje – bez adrese.";

  const itemsList = payload.items
    .map((item) => {
      const addons =
        item.addons.length > 0
          ? ` (+ ${item.addons.map((a) => `${a.name}`).join(", ")})`
          : "";
      const lineTotal =
        (item.basePrice +
          item.addons.reduce((s, a) => s + a.price, 0)) *
        item.quantity;
      const noteLine = item.note ? `\n   Napomena: ${item.note}` : "";
      return `• ${item.name} × ${item.quantity} – ${lineTotal.toFixed(
        0,
      )} RSD${addons}${noteLine}`;
    })
    .join("\n");

  const orderNoteBlock = payload.orderNote
    ? `<h3>Napomena</h3><p>${payload.orderNote}</p>`
    : "";

  const html = `
    <h2>Nova porudžbina #${payload.orderId}</h2>
    <p><strong>Broj porudžbine:</strong> ${payload.orderNumber}</p>
    <p><strong>Način:</strong> ${deliveryLabel}</p>
    <p><strong>Ime i prezime:</strong> ${payload.customerName}</p>
    <p><strong>Telefon:</strong> <a href="tel:${payload.phone}">${payload.phone}</a></p>
    <p><strong>${addressLine}</strong></p>
    <h3>Stavke</h3>
    <pre style="font-family: sans-serif; white-space: pre-wrap;">${itemsList}</pre>
    ${orderNoteBlock}
    <p><strong>Ukupno: ${payload.totalPrice.toFixed(0)} RSD</strong></p>
  `;

  await resend.emails.send({
    from: process.env.RESEND_FROM ?? "Kod Milevice <onboarding@resend.dev>",
    to: toEmail,
    subject: `Nova porudžbina #${payload.orderId} – ${payload.customerName}`,
    html,
  });
}
