"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type ProductOption = {
  id: number;
  name: string;
  price: number;
  image_url: string | null;
  description: string | null;
  is_active: boolean;
  taste_type?: { name: string } | null;
};

type Highlight = {
  id: number;
  product_id: number;
  is_active: boolean;
  order_no: number;
  badge: string | null;
  promo_title: string | null;
  promo_description: string | null;
  image_url: string | null;
  product?: unknown;
};

export function AdminHighlightsManager({
  initialRows,
  products,
}: {
  initialRows: Highlight[];
  products: ProductOption[];
}) {
  const router = useRouter();
  const [rows, setRows] = useState(initialRows);
  const [editing, setEditing] = useState<Highlight | null | "new">(null);
  const [saving, setSaving] = useState(false);

  async function refetch() {
    const res = await fetch("/api/admin/highlights");
    if (res.ok) setRows(await res.json());
    router.refresh();
  }

  return (
    <div>
      <Link href="/admin" className="text-sm text-gray-600 hover:text-rose">
        ← Dashboard
      </Link>
      <h1 className="mt-4 text-2xl font-semibold text-gray-800">
        Novitet kartice
      </h1>
      <p className="mt-1 text-sm text-gray-600">
        Kartice se prikazuju kao slider na vrhu <strong>Slane</strong> ili{" "}
        <strong>Slatke</strong> sekcije, prema ukusu proizvoda i OrderNo. Proizvod
        ostaje u originalnoj kategoriji.
      </p>
      <button
        type="button"
        onClick={() => setEditing("new")}
        className="mt-4 rounded-xl bg-rose px-4 py-2 text-sm font-semibold text-white"
      >
        + Dodaj novitet
      </button>

      <div className="mt-6 overflow-x-auto rounded-xl border bg-white">
        <table className="min-w-[800px] text-left text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="px-4 py-3">OrderNo</th>
              <th className="px-4 py-3">Naslov</th>
              <th className="px-4 py-3">Proizvod</th>
              <th className="px-4 py-3">Aktivan</th>
              <th className="px-4 py-3">Akcije</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b">
                <td className="px-4 py-3">{row.order_no}</td>
                <td className="px-4 py-3 font-medium">
                  {row.promo_title || row.badge || "Novitet"}
                </td>
                <td className="px-4 py-3">
                  {products.find((p) => p.id === row.product_id)?.name ??
                    row.product_id}
                </td>
                <td className="px-4 py-3">{row.is_active ? "Da" : "Ne"}</td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    className="text-rose hover:underline"
                    onClick={() => setEditing(row)}
                  >
                    Izmeni
                  </button>
                  <button
                    type="button"
                    className="ml-3 text-gray-500 hover:underline"
                    onClick={async () => {
                      await fetch(`/api/admin/highlights/${row.id}`, {
                        method: "DELETE",
                      });
                      await refetch();
                    }}
                  >
                    Obriši
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <HighlightForm
          row={editing === "new" ? null : editing}
          products={products}
          saving={saving}
          setSaving={setSaving}
          onClose={() => setEditing(null)}
          onSaved={async () => {
            setEditing(null);
            await refetch();
          }}
        />
      )}
    </div>
  );
}

function HighlightForm({
  row,
  products,
  saving,
  setSaving,
  onClose,
  onSaved,
}: {
  row: Highlight | null;
  products: ProductOption[];
  saving: boolean;
  setSaving: (v: boolean) => void;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [productId, setProductId] = useState(row?.product_id?.toString() ?? "");
  const [badge, setBadge] = useState(row?.badge ?? "NOVO U PONUDI");
  const [promoTitle, setPromoTitle] = useState(row?.promo_title ?? "");
  const [promoDescription, setPromoDescription] = useState(
    row?.promo_description ?? "",
  );
  const [imageUrl, setImageUrl] = useState(row?.image_url ?? "");
  const [orderNo, setOrderNo] = useState(String(row?.order_no ?? 1));
  const [isActive, setIsActive] = useState(row?.is_active ?? true);

  const selected = useMemo(
    () => products.find((p) => String(p.id) === productId) ?? null,
    [products, productId],
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!productId) return;
    setSaving(true);
    const payload = {
      product_id: Number(productId),
      badge: badge.trim() || "NOVO U PONUDI",
      promo_title: promoTitle.trim() || null,
      promo_description: promoDescription.trim() || null,
      image_url: imageUrl.trim() || null,
      order_no: Number(orderNo),
      is_active: isActive,
    };
    const url = row ? `/api/admin/highlights/${row.id}` : "/api/admin/highlights";
    const res = await fetch(url, {
      method: row ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (res.ok) onSaved();
    else alert((await res.json()).error || "Greška");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6">
        <h2 className="text-lg font-semibold">
          {row ? "Izmeni novitet" : "Novi novitet"}
        </h2>
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <label className="block text-xs font-medium text-gray-600">
            Proizvod *
            <select
              required
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
            >
              <option value="">Izaberi…</option>
              {products
                .filter((p) => p.is_active)
                .map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                    {p.taste_type?.name ? ` (${p.taste_type.name})` : ""}
                  </option>
                ))}
            </select>
          </label>
          {selected && (
            <p className="text-xs text-gray-500">
              Prikaz: {selected.taste_type?.name ?? "prema ukusu proizvoda"} ·{" "}
              {Number(selected.price).toFixed(0)} RSD
            </p>
          )}
          <label className="block text-xs font-medium text-gray-600">
            Oznaka
            <input
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
            />
          </label>
          <label className="block text-xs font-medium text-gray-600">
            Promotivni naslov
            <input
              value={promoTitle}
              onChange={(e) => setPromoTitle(e.target.value)}
              placeholder={selected?.name ?? ""}
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
            />
          </label>
          <label className="block text-xs font-medium text-gray-600">
            Promotivni opis
            <textarea
              value={promoDescription}
              onChange={(e) => setPromoDescription(e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
            />
          </label>
          <label className="block text-xs font-medium text-gray-600">
            Posebna fotografija (URL)
            <input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder={selected?.image_url ?? "/images/..."}
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
            />
          </label>
          <label className="block text-xs font-medium text-gray-600">
            OrderNo
            <input
              type="number"
              value={orderNo}
              onChange={(e) => setOrderNo(e.target.value)}
              className="mt-1 w-24 rounded-lg border px-3 py-2 text-sm"
            />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
            Aktivan
          </label>
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border px-4 py-2 text-sm"
            >
              Otkaži
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-rose px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              {saving ? "Čuvanje..." : "Sačuvaj"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
