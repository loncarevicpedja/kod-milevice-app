"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ADDON_KIND_LABELS, ADDON_KIND_VALUES } from "@/lib/addonKinds";

type Addon = {
  id: number;
  name: string;
  price: number | string;
  is_active: boolean;
  taste_type_id: number | null;
  addon_kind: string | null;
  taste_type?: { name: string } | null;
};

type ProductType = { id: number; name: string };

type Props = {
  initialAddons: Addon[];
  tasteTypes: ProductType[];
};

export function AdminAddonsManager({
  initialAddons,
  tasteTypes,
}: Props) {
  const router = useRouter();
  const [addons, setAddons] = useState<Addon[]>(initialAddons);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState<"add" | "edit" | null>(null);
  const [editingAddon, setEditingAddon] = useState<Addon | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const filtered = useMemo(() => {
    if (!search.trim()) return addons;
    const q = search.toLowerCase().trim();
    return addons.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        (a.taste_type?.name ?? "").toLowerCase().includes(q)
    );
  }, [addons, search]);

  async function refetch() {
    const res = await fetch("/api/admin/addons");
    if (res.ok) {
      const data = await res.json();
      setAddons(data);
    }
    router.refresh();
  }

  function openAdd() {
    setEditingAddon(null);
    setModalOpen("add");
  }

  function openEdit(a: Addon) {
    setEditingAddon(a);
    setModalOpen("edit");
  }

  async function handleDelete(id: number) {
    setSaving(true);
    const res = await fetch(`/api/admin/addons/${id}`, { method: "DELETE" });
    setSaving(false);
    setDeleteConfirm(null);
    if (res.ok) await refetch();
    else alert((await res.json()).error || "Greška pri brisanju");
  }

  return (
    <div>
      <Link href="/admin" className="text-sm text-gray-600 hover:text-rose">
        ← Dashboard
      </Link>
      <h1 className="mt-4 text-2xl font-semibold text-gray-800">Dodaci</h1>
      <p className="mt-1 text-sm text-gray-600">
        Pretraga, dodavanje, izmena i brisanje dodataka.
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder="Pretraži po nazivu ili ukusu..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-rose focus:ring-1 focus:ring-rose/40"
        />
        <button
          type="button"
          onClick={openAdd}
          className="rounded-xl bg-rose px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-rose/90"
        >
          + Dodaj dodatak
        </button>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-[700px] text-left text-sm">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-4 py-3 font-semibold text-gray-800">ID</th>
              <th className="px-4 py-3 font-semibold text-gray-800">Naziv</th>
              <th className="px-4 py-3 font-semibold text-gray-800">Ukus</th>
              <th className="px-4 py-3 font-semibold text-gray-800">Tip dodatka</th>
              <th className="px-4 py-3 font-semibold text-gray-800">Cena</th>
              <th className="px-4 py-3 font-semibold text-gray-800">Aktivan</th>
              <th className="px-4 py-3 font-semibold text-gray-800">Akcije</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                  {search.trim() ? "Nema rezultata." : "Nema dodataka."}
                </td>
              </tr>
            ) : (
              filtered.map((a) => (
                <tr key={a.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-600">{a.id}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{a.name}</td>
                  <td className="px-4 py-3 text-gray-600">{a.taste_type?.name ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {a.addon_kind
                      ? (ADDON_KIND_LABELS[a.addon_kind] ?? a.addon_kind)
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{Number(a.price).toFixed(0)} RSD</td>
                  <td className="px-4 py-3">
                    {a.is_active ? (
                      <span className="text-green-600">Da</span>
                    ) : (
                      <span className="text-gray-400">Ne</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(a)}
                        className="text-rose hover:underline"
                      >
                        Izmeni
                      </button>
                      {deleteConfirm === a.id ? (
                        <>
                          <button
                            type="button"
                            onClick={() => handleDelete(a.id)}
                            className="text-red-600 hover:underline"
                          >
                            Da, obriši
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirm(null)}
                            className="text-gray-500 hover:underline"
                          >
                            Otkaži
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setDeleteConfirm(a.id)}
                          className="text-gray-500 hover:underline"
                        >
                          Obriši
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <AddonFormModal
          addon={editingAddon}
          tasteTypes={tasteTypes}
          saving={saving}
          onClose={() => {
            setModalOpen(null);
            setEditingAddon(null);
          }}
          onSaved={() => {
            setModalOpen(null);
            setEditingAddon(null);
            refetch();
          }}
          setSaving={setSaving}
        />
      )}
    </div>
  );
}

function AddonFormModal({
  addon,
  tasteTypes,
  saving,
  onClose,
  onSaved,
  setSaving,
}: {
  addon: Addon | null;
  tasteTypes: ProductType[];
  saving: boolean;
  onClose: () => void;
  onSaved: () => void;
  setSaving: (v: boolean) => void;
}) {
  const isEdit = !!addon;
  const [name, setName] = useState(addon?.name ?? "");
  const [price, setPrice] = useState(
    addon?.price != null ? String(addon.price) : ""
  );
  const [isActive, setIsActive] = useState(addon?.is_active ?? true);
  const [tasteTypeId, setTasteTypeId] = useState(
    addon?.taste_type_id?.toString() ?? ""
  );
  const [addonKind, setAddonKind] = useState(addon?.addon_kind ?? "");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !price.trim()) return;
    setSaving(true);
    const payload = {
      name: name.trim(),
      price: Number(price),
      is_active: isActive,
      taste_type_id: tasteTypeId ? Number(tasteTypeId) : null,
      addon_kind: addonKind || null,
    };
    const url = isEdit
      ? `/api/admin/addons/${addon.id}`
      : "/api/admin/addons";
    const method = isEdit ? "PATCH" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (res.ok) {
      onSaved();
      return;
    }
    const text = await res.text();
    let message = "Greška";
    if (text) {
      try {
        const j = JSON.parse(text) as { error?: string };
        if (j.error) message = j.error;
      } catch {
        message = text.slice(0, 200);
      }
    }
    alert(message);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-gray-800">
          {isEdit ? "Izmeni dodatak" : "Dodaj dodatak"}
        </h2>
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-600">Naziv *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600">Cena (RSD) *</label>
            <input
              type="number"
              min={0}
              step={1}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600">Ukus</label>
            <select
              value={tasteTypeId}
              onChange={(e) => setTasteTypeId(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            >
              <option value="">—</option>
              {tasteTypes.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600">
              Tip dodatka (tortilje / grupisanje)
            </label>
            <select
              value={addonKind}
              onChange={(e) => setAddonKind(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            >
              {ADDON_KIND_VALUES.map((v) => (
                <option key={v || "empty"} value={v}>
                  {ADDON_KIND_LABELS[v] ?? v}
                </option>
              ))}
            </select>
          </div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
            <span className="text-sm text-gray-700">Aktivan</span>
          </label>
          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700"
            >
              Otkaži
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-rose px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              {saving ? "Čuvanje..." : isEdit ? "Sačuvaj" : "Dodaj"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
