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
};

type Slide = {
  id: number;
  is_active: boolean;
  order_no: number;
  starts_at: string | null;
  ends_at: string | null;
  badge: string | null;
  title: string;
  subtitle: string | null;
  description: string | null;
  image_url: string | null;
  price_label: string | null;
  product_id: number | null;
};

export function AdminSlidesManager({
  initialSlides,
  products,
}: {
  initialSlides: Slide[];
  products: ProductOption[];
}) {
  const router = useRouter();
  const [slides, setSlides] = useState(initialSlides);
  const [editing, setEditing] = useState<Slide | null | "new">(null);
  const [saving, setSaving] = useState(false);

  async function refetch() {
    const res = await fetch("/api/admin/slides");
    if (res.ok) setSlides(await res.json());
    router.refresh();
  }

  return (
    <div>
      <Link href="/admin" className="text-sm text-gray-600 hover:text-rose">
        ← Dashboard
      </Link>
      <h1 className="mt-4 text-2xl font-semibold text-gray-800">
        Slider početne
      </h1>
      <p className="mt-1 text-sm text-gray-600">
        Dugmad „Naruči odmah“ i „Pogledaj meni“ ostaju ispod slidera i ne menjaju
        se sa slajdom.
      </p>
      <button
        type="button"
        onClick={() => setEditing("new")}
        className="mt-4 rounded-xl bg-rose px-4 py-2 text-sm font-semibold text-white"
      >
        + Dodaj slajd
      </button>

      <div className="mt-6 overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table className="min-w-[800px] text-left text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="px-4 py-3">OrderNo</th>
              <th className="px-4 py-3">Naslov</th>
              <th className="px-4 py-3">Aktivan</th>
              <th className="px-4 py-3">Proizvod</th>
              <th className="px-4 py-3">Akcije</th>
            </tr>
          </thead>
          <tbody>
            {slides.map((s) => (
              <tr key={s.id} className="border-b">
                <td className="px-4 py-3">{s.order_no}</td>
                <td className="px-4 py-3 font-medium">{s.title}</td>
                <td className="px-4 py-3">{s.is_active ? "Da" : "Ne"}</td>
                <td className="px-4 py-3 text-gray-600">
                  {products.find((p) => p.id === s.product_id)?.name ?? "—"}
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    className="text-rose hover:underline"
                    onClick={() => setEditing(s)}
                  >
                    Izmeni
                  </button>
                  <button
                    type="button"
                    className="ml-3 text-gray-500 hover:underline"
                    onClick={async () => {
                      if (!confirm("Obrisati slajd?")) return;
                      await fetch(`/api/admin/slides/${s.id}`, {
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
        <SlideForm
          slide={editing === "new" ? null : editing}
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

function toLocalInput(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function SlideForm({
  slide,
  products,
  saving,
  setSaving,
  onClose,
  onSaved,
}: {
  slide: Slide | null;
  products: ProductOption[];
  saving: boolean;
  setSaving: (v: boolean) => void;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [title, setTitle] = useState(slide?.title ?? "");
  const [badge, setBadge] = useState(slide?.badge ?? "");
  const [subtitle, setSubtitle] = useState(slide?.subtitle ?? "");
  const [description, setDescription] = useState(slide?.description ?? "");
  const [imageUrl, setImageUrl] = useState(slide?.image_url ?? "");
  const [priceLabel, setPriceLabel] = useState(slide?.price_label ?? "");
  const [productId, setProductId] = useState(slide?.product_id?.toString() ?? "");
  const [orderNo, setOrderNo] = useState(String(slide?.order_no ?? 1));
  const [isActive, setIsActive] = useState(slide?.is_active ?? true);
  const [startsAt, setStartsAt] = useState(toLocalInput(slide?.starts_at ?? null));
  const [endsAt, setEndsAt] = useState(toLocalInput(slide?.ends_at ?? null));

  const selected = useMemo(
    () => products.find((p) => String(p.id) === productId) ?? null,
    [products, productId],
  );

  function fillFromProduct() {
    if (!selected) return;
    if (!title.trim()) setTitle(selected.name);
    if (!description.trim()) setDescription(selected.description ?? "");
    if (!imageUrl.trim()) setImageUrl(selected.image_url ?? "");
    if (!priceLabel.trim()) setPriceLabel(`${Number(selected.price).toFixed(0)} RSD`);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const payload = {
      title: title.trim(),
      badge: badge.trim() || null,
      subtitle: subtitle.trim() || null,
      description: description.trim() || null,
      image_url: imageUrl.trim() || null,
      price_label: priceLabel.trim() || null,
      product_id: productId ? Number(productId) : null,
      order_no: Number(orderNo),
      is_active: isActive,
      starts_at: startsAt ? new Date(startsAt).toISOString() : null,
      ends_at: endsAt ? new Date(endsAt).toISOString() : null,
    };
    const url = slide ? `/api/admin/slides/${slide.id}` : "/api/admin/slides";
    const res = await fetch(url, {
      method: slide ? "PATCH" : "POST",
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
          {slide ? "Izmeni slajd" : "Novi slajd"}
        </h2>
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <label className="block text-xs font-medium text-gray-600">
            Poveži sa proizvodom (opciono)
            <select
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
            >
              <option value="">— bez proizvoda —</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>
          {selected && (
            <button
              type="button"
              onClick={fillFromProduct}
              className="text-xs text-rose hover:underline"
            >
              Popuni naslov, sliku i cenu iz proizvoda
            </button>
          )}
          <Field label="Oznaka (badge)" value={badge} onChange={setBadge} />
          <Field label="Naslov *" value={title} onChange={setTitle} required />
          <Field label="Slogan" value={subtitle} onChange={setSubtitle} />
          <label className="block text-xs font-medium text-gray-600">
            Opis
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
            />
          </label>
          <Field label="URL slike" value={imageUrl} onChange={setImageUrl} />
          <Field label="Cena / info" value={priceLabel} onChange={setPriceLabel} />
          <Field label="OrderNo" value={orderNo} onChange={setOrderNo} type="number" />
          <div className="grid grid-cols-2 gap-3">
            <label className="block text-xs font-medium text-gray-600">
              Početak promocije
              <input
                type="datetime-local"
                value={startsAt}
                onChange={(e) => setStartsAt(e.target.value)}
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
              />
            </label>
            <label className="block text-xs font-medium text-gray-600">
              Kraj promocije
              <input
                type="datetime-local"
                value={endsAt}
                onChange={(e) => setEndsAt(e.target.value)}
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
              />
            </label>
          </div>
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

function Field({
  label,
  value,
  onChange,
  required,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  type?: string;
}) {
  return (
    <label className="block text-xs font-medium text-gray-600">
      {label}
      <input
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
      />
    </label>
  );
}
