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
  /** Zbir stavki (bez dostave) */
  itemsSubtotal: number;
  /** 0 ako je lično preuzimanje */
  deliveryFee: number;
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

  const isDelivery = payload.deliveryType === "dostava";
  const deliveryLabel = isDelivery ? "Dostava" : "Lično preuzimanje";
  const addressLine = payload.address
    ? `Adresa: ${payload.address}${
        payload.noteForAddress ? ` (${payload.noteForAddress})` : ""
      }`
    : "Lično preuzimanje – bez adrese.";

  const itemsList = payload.items
    .map((item) => {
      const addons =
        item.addons.length > 0
          ? ` + ${item.addons.map((a) => a.name).join(", ")}`
          : "";
      const lineTotal =
        (item.basePrice +
          item.addons.reduce((s, a) => s + a.price, 0)) *
        item.quantity;
      const noteLine = item.note ? `\n   Napomena: ${item.note}` : "";
      return `•  ${item.quantity} x ${item.name}${addons} – ${lineTotal.toFixed(
        0,
      )} RSD${noteLine}`;
    })
    .join("\n");

  const orderNoteBlock = payload.orderNote
    ? `
    <div style="margin-top:16px;padding:12px;border-radius:8px;border:1px solid #e11d48;background:#fff7fb;">
      <h3 style="margin:0 0 8px 0;font-size:14px;color:#b91c1c;">Napomena</h3>
      <p style="margin:0;font-size:13px;white-space:pre-wrap;">${payload.orderNote}</p>
    </div>
  `
    : "";

  const html = `
    <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size:14px; color:#1f2933;">
      <h2 style="margin:0 0 8px 0;">Nova porudžbina #${payload.orderId}</h2>
      <p style="margin:4px 0;"><strong>Broj porudžbine:</strong> ${payload.orderNumber}</p>
      <p style="margin:4px 0;"><strong>Način:</strong> ${deliveryLabel}</p>
      <p style="margin:4px 0;"><strong>Ime i prezime:</strong> ${payload.customerName}</p>
      <p style="margin:4px 0;">
        <strong>Telefon:</strong>
        <a href="tel:${payload.phone}" style="color:#e11d48;text-decoration:none;">${payload.phone}</a>
      </p>
      <p style="margin:4px 0;"><strong>${addressLine}</strong></p>

      <hr style="margin:16px 0;border:none;border-top:1px solid #e5e7eb;" />

      <h3 style="margin:0 0 8px 0;">Stavke</h3>
      <pre style="margin:0;padding:8px 10px;border-radius:8px;border:1px solid #e5e7eb;background:#f9fafb;font-family:system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; white-space:pre-wrap;">${itemsList}</pre>

      ${orderNoteBlock}

      <hr style="margin:16px 0;border:none;border-top:1px solid #e5e7eb;" />

      <h3 style="margin:0 0 8px 0;">Plaćanje</h3>
      <table style="width:100%;max-width:360px;border-collapse:collapse;font-size:14px;">
        <tr>
          <td style="padding:6px 0;border-bottom:1px solid #e5e7eb;">Cena narudžbine</td>
          <td style="padding:6px 0;border-bottom:1px solid #e5e7eb;text-align:right;">${payload.itemsSubtotal.toFixed(0)} RSD</td>
        </tr>
        ${
          isDelivery && payload.deliveryFee > 0
            ? `<tr>
          <td style="padding:6px 0;border-bottom:1px solid #e5e7eb;">Dostava <span style="color:#6b7280;font-size:12px;"></span></td>
          <td style="padding:6px 0;border-bottom:1px solid #e5e7eb;text-align:right;">${payload.deliveryFee.toFixed(0)} RSD</td>
        </tr>`
            : `<tr>
          <td colspan="2" style="padding:6px 0;border-bottom:1px solid #e5e7eb;color:#6b7280;font-size:12px;">Lično preuzimanje – bez naknade za dostavu.</td>
        </tr>`
        }
        <tr>
          <td style="padding:10px 0 0 0;"><strong>Ukupno za naplatu</strong></td>
          <td style="padding:10px 0 0 0;text-align:right;"><strong>${payload.totalPrice.toFixed(0)} RSD</strong></td>
        </tr>
      </table>
    </div>
  `;

  await resend.emails.send({
    from: process.env.RESEND_FROM ?? "Kod Milevice <onboarding@resend.dev>",
    to: toEmail,
    subject: `Nova porudžbina #${payload.orderId} – ${payload.customerName}`,
    html,
  });
}
