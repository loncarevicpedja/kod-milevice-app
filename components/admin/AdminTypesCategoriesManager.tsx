"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { ProductCategory, ProductType, TasteType } from "@/lib/dbTypes";

type RefRow = ProductType | TasteType | ProductCategory;

type ReferenceKind = "product_type" | "taste_type" | "product_category";

type Props = {
  initialProductTypes: ProductType[];
  initialTasteTypes: TasteType[];
  initialCategories: ProductCategory[];
};

const SECTIONS: {
  kind: ReferenceKind;
  title: string;
  addLabel: string;
}[] = [
  {
    kind: "product_type",
    title: "Product type (npr. Palačinke, Tortilje)",
    addLabel: "Product type",
  },
  {
    kind: "taste_type",
    title: "Taste type (npr. Slane, Slatke)",
    addLabel: "Taste type",
  },
  {
    kind: "product_category",
    title: "Product category (npr. Classic palačinke, Mega, Naš mix)",
    addLabel: "Product category",
  },
];

export function AdminTypesCategoriesManager({
  initialProductTypes,
  initialTasteTypes,
  initialCategories,
}: Props) {
  const router = useRouter();
  const [productTypes, setProductTypes] = useState(initialProductTypes);
  const [tasteTypes, setTasteTypes] = useState(initialTasteTypes);
  const [categories, setCategories] = useState(initialCategories);
  const [addingKind, setAddingKind] = useState<ReferenceKind | null>(null);
  const [saving, setSaving] = useState(false);

  const rowsByKind: Record<ReferenceKind, RefRow[]> = {
    product_type: productTypes,
    taste_type: tasteTypes,
    product_category: categories,
  };

  async function refetch() {
    const res = await fetch("/api/admin/reference");
    if (res.ok) {
      const data = await res.json();
      setProductTypes(data.productTypes ?? []);
      setTasteTypes(data.tasteTypes ?? []);
      setCategories(data.productCategories ?? []);
    }
    router.refresh();
  }

  return (
    <div>
      <Link href="/admin" className="text-sm text-gray-600 hover:text-rose">
        ← Dashboard
      </Link>
      <h1 className="mt-4 text-2xl font-semibold text-gray-800">
        Tipovi i kategorije
      </h1>
      <p className="mt-1 text-sm text-gray-600">
        Product type, Taste type i Product category – referentni podaci za meni.
      </p>

      {SECTIONS.map((section) => (
        <ReferenceTable
          key={section.kind}
          title={section.title}
          addLabel={section.addLabel}
          rows={rowsByKind[section.kind]}
          onAdd={() => setAddingKind(section.kind)}
        />
      ))}

      {addingKind && (
        <AddReferenceModal
          kind={addingKind}
          saving={saving}
          setSaving={setSaving}
          onClose={() => setAddingKind(null)}
          onSaved={() => {
            setAddingKind(null);
            refetch();
          }}
        />
      )}
    </div>
  );
}

function ReferenceTable({
  title,
  addLabel,
  rows,
  onAdd,
}: {
  title: string;
  addLabel: string;
  rows: RefRow[];
  onAdd: () => void;
}) {
  return (
    <div className="mb-8 mt-8">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        <button
          type="button"
          onClick={onAdd}
          className="rounded-xl bg-rose px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-rose/90"
        >
          + Dodaj {addLabel}
        </button>
      </div>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-4 py-3 font-semibold text-gray-800">ID</th>
              <th className="px-4 py-3 font-semibold text-gray-800">Naziv</th>
              <th className="px-4 py-3 font-semibold text-gray-800">Aktivan</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-gray-500">
                  Nema zapisa.
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr
                  key={r.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="px-4 py-3 text-gray-600">{r.id}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {r.name}
                  </td>
                  <td className="px-4 py-3">
                    {r.is_active ? (
                      <span className="text-green-600">Da</span>
                    ) : (
                      <span className="text-gray-400">Ne</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AddReferenceModal({
  kind,
  saving,
  setSaving,
  onClose,
  onSaved,
}: {
  kind: ReferenceKind;
  saving: boolean;
  setSaving: (v: boolean) => void;
  onClose: () => void;
  onSaved: () => void;
}) {
  const section = SECTIONS.find((s) => s.kind === kind);
  const [name, setName] = useState("");
  const [isActive, setIsActive] = useState(true);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    const res = await fetch("/api/admin/reference", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kind,
        name: name.trim(),
        is_active: isActive,
      }),
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
          Dodaj {section?.addLabel ?? "zapis"}
        </h2>
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-600">
              Naziv *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              required
              autoFocus
            />
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
              {saving ? "Čuvanje..." : "Dodaj"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
