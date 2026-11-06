"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type ProductOption = {
  id: number;
  name: string;
  price: number;
  image_url: string | null;
  is_active: boolean;
};

type Featured = {
  id: number;
  product_id: number;
  is_active: boolean;
  order_no: number;
  product?: ProductOption | ProductOption[] | null;
};

function one<T>(v: T | T[] | null | undefined): T | null {
  if (v == null) return null;
  return Array.isArray(v) ? v[0] ?? null : v;
}

export function AdminFeaturedManager({
  initialRows,
  products,
}: {
  initialRows: Featured[];
  products: ProductOption[];
}) {
  const router = useRouter();
  const [rows, setRows] = useState(initialRows);
  const [productId, setProductId] = useState("");
  const [orderNo, setOrderNo] = useState("1");
  const [saving, setSaving] = useState(false);

  const used = new Set(rows.map((r) => r.product_id));
  const available = products.filter((p) => p.is_active && !used.has(p.id));

  async function refetch() {
    const res = await fetch("/api/admin/featured");
    if (res.ok) setRows(await res.json());
    router.refresh();
  }

  async function add() {
    if (!productId) return;
    setSaving(true);
    const res = await fetch("/api/admin/featured", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        product_id: Number(productId),
        order_no: Number(orderNo),
        is_active: true,
      }),
    });
    setSaving(false);
    if (!res.ok) {
      alert((await res.json()).error || "Greška");
      return;
    }
    setProductId("");
    await refetch();
  }

  return (
    <div>
      <Link href="/admin" className="text-sm text-gray-600 hover:text-rose">
        ← Dashboard
      </Link>
      <h1 className="mt-4 text-2xl font-semibold text-gray-800">
        Istaknuti proizvodi
      </h1>
      <p className="mt-1 text-sm text-gray-600">
        Proizvod ostaje u svojoj originalnoj kategoriji. Ovde se samo dodatno
        prikazuje u sekciji „Izdvajamo“. Može biti slan ili sladak.
      </p>

      <div className="mt-4 flex flex-wrap items-end gap-3">
        <label className="text-xs font-medium text-gray-600">
          Proizvod
          <select
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            className="mt-1 block min-w-[220px] rounded-lg border px-3 py-2 text-sm"
          >
            <option value="">Izaberi…</option>
            {available.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({Number(p.price).toFixed(0)} RSD)
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs font-medium text-gray-600">
          OrderNo
          <input
            type="number"
            value={orderNo}
            onChange={(e) => setOrderNo(e.target.value)}
            className="mt-1 block w-24 rounded-lg border px-3 py-2 text-sm"
          />
        </label>
        <button
          type="button"
          onClick={add}
          disabled={saving || !productId}
          className="rounded-xl bg-rose px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          Dodaj u istaknuto
        </button>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border bg-white">
        <table className="min-w-[700px] text-left text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="px-4 py-3">OrderNo</th>
              <th className="px-4 py-3">Proizvod</th>
              <th className="px-4 py-3">Cena</th>
              <th className="px-4 py-3">Aktivan</th>
              <th className="px-4 py-3">Akcije</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const p = one(row.product);
              return (
                <tr key={row.id} className="border-b">
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      defaultValue={row.order_no}
                      className="w-20 rounded border px-2 py-1"
                      onBlur={async (e) => {
                        const v = Number(e.target.value);
                        if (v === row.order_no) return;
                        await fetch(`/api/admin/featured/${row.id}`, {
                          method: "PATCH",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ order_no: v }),
                        });
                        await refetch();
                      }}
                    />
                  </td>
                  <td className="px-4 py-3 font-medium">{p?.name ?? row.product_id}</td>
                  <td className="px-4 py-3">
                    {p ? `${Number(p.price).toFixed(0)} RSD` : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      className="text-rose hover:underline"
                      onClick={async () => {
                        await fetch(`/api/admin/featured/${row.id}`, {
                          method: "PATCH",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ is_active: !row.is_active }),
                        });
                        await refetch();
                      }}
                    >
                      {row.is_active ? "Da" : "Ne"}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      className="text-gray-500 hover:underline"
                      onClick={async () => {
                        await fetch(`/api/admin/featured/${row.id}`, {
                          method: "DELETE",
                        });
                        await refetch();
                      }}
                    >
                      Ukloni
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
