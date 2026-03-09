"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type ProductType = { id: number; name: string };
type Product = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  is_active: boolean;
  product_type_id: number;
  taste_type_id: number | null;
  product_category_id: number;
  product_type?: { name: string } | null;
  taste_type?: { name: string } | null;
  product_category?: { name: string } | null;
};

type Props = {
  initialProducts: Product[];
  productTypes: ProductType[];
  tasteTypes: ProductType[];
  productCategories: ProductType[];
};

export function AdminProductsManager({
  initialProducts,
  productTypes,
  tasteTypes,
  productCategories,
}: Props) {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState<"add" | "edit" | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const filtered = useMemo(() => {
    if (!search.trim()) return products;
    const q = search.toLowerCase().trim();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.product_type?.name ?? "").toLowerCase().includes(q) ||
        (p.product_category?.name ?? "").toLowerCase().includes(q)
    );
  }, [products, search]);

  async function refetch() {
    const res = await fetch("/api/admin/products");
    if (res.ok) {
      const data = await res.json();
      setProducts(data);
    }
    router.refresh();
  }

  function openAdd() {
    setEditingProduct(null);
    setModalOpen("add");
  }

  function openEdit(p: Product) {
    setEditingProduct(p);
    setModalOpen("edit");
  }

  async function handleDelete(id: number) {
    setSaving(true);
    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
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
      <h1 className="mt-4 text-2xl font-semibold text-gray-800">Proizvodi</h1>
      <p className="mt-1 text-sm text-gray-600">
        Pretraga, dodavanje, izmena i brisanje proizvoda.
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder="Pretraži po nazivu, tipu, kategoriji..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-rose focus:ring-1 focus:ring-rose/40"
        />
        <button
          type="button"
          onClick={openAdd}
          className="rounded-xl bg-rose px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-rose/90"
        >
          + Dodaj proizvod
        </button>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-[900px] text-left text-sm">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-4 py-3 font-semibold text-gray-800">ID</th>
              <th className="px-4 py-3 font-semibold text-gray-800">Naziv</th>
              <th className="px-4 py-3 font-semibold text-gray-800">Tip</th>
              <th className="px-4 py-3 font-semibold text-gray-800">Ukus</th>
              <th className="px-4 py-3 font-semibold text-gray-800">Kategorija</th>
              <th className="px-4 py-3 font-semibold text-gray-800">Cena</th>
              <th className="px-4 py-3 font-semibold text-gray-800">Aktivan</th>
              <th className="px-4 py-3 font-semibold text-gray-800">Akcije</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-6 text-center text-gray-500">
                  {search.trim() ? "Nema rezultata za pretragu." : "Nema proizvoda."}
                </td>
              </tr>
            ) : (
              filtered.map((p) => (
                <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-600">{p.id}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{p.name}</td>
                  <td className="px-4 py-3 text-gray-600">{p.product_type?.name ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-600">{p.taste_type?.name ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-600">{p.product_category?.name ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-600">{Number(p.price).toFixed(0)} RSD</td>
                  <td className="px-4 py-3">
                    {p.is_active ? (
                      <span className="text-green-600">Da</span>
                    ) : (
                      <span className="text-gray-400">Ne</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(p)}
                        className="text-rose hover:underline"
                      >
                        Izmeni
                      </button>
                      {deleteConfirm === p.id ? (
                        <>
                          <button
                            type="button"
                            onClick={() => handleDelete(p.id)}
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
                          onClick={() => setDeleteConfirm(p.id)}
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
        <ProductFormModal
          product={editingProduct}
          productTypes={productTypes}
          tasteTypes={tasteTypes}
          productCategories={productCategories}
          saving={saving}
          onClose={() => {
            setModalOpen(null);
            setEditingProduct(null);
          }}
          onSaved={() => {
            setModalOpen(null);
            setEditingProduct(null);
            refetch();
          }}
          setSaving={setSaving}
        />
      )}
    </div>
  );
}

function ProductFormModal({
  product,
  productTypes,
  tasteTypes,
  productCategories,
  saving,
  onClose,
  onSaved,
  setSaving,
}: {
  product: Product | null;
  productTypes: ProductType[];
  tasteTypes: ProductType[];
  productCategories: ProductType[];
  saving: boolean;
  onClose: () => void;
  onSaved: () => void;
  setSaving: (v: boolean) => void;
}) {
  const isEdit = !!product;
  const [name, setName] = useState(product?.name ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [price, setPrice] = useState(product?.price?.toString() ?? "");
  const [imageUrl, setImageUrl] = useState(product?.image_url ?? "");
  const [isActive, setIsActive] = useState(product?.is_active ?? true);
  const [productTypeId, setProductTypeId] = useState(
    product?.product_type_id?.toString() ?? (productTypes[0]?.id.toString() ?? "")
  );
  const [tasteTypeId, setTasteTypeId] = useState(
    product?.taste_type_id?.toString() ?? ""
  );
  const [productCategoryId, setProductCategoryId] = useState(
    product?.product_category_id?.toString() ?? (productCategories[0]?.id.toString() ?? "")
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !price.trim()) return;
    setSaving(true);
    const payload = {
      name: name.trim(),
      description: description.trim() || null,
      price: Number(price),
      image_url: imageUrl.trim() || null,
      is_active: isActive,
      product_type_id: Number(productTypeId),
      taste_type_id: tasteTypeId ? Number(tasteTypeId) : null,
      product_category_id: Number(productCategoryId),
    };
    const url = isEdit
      ? `/api/admin/products/${product.id}`
      : "/api/admin/products";
    const method = isEdit ? "PATCH" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (res.ok) onSaved();
    else alert((await res.json()).error || "Greška");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-gray-800">
          {isEdit ? "Izmeni proizvod" : "Dodaj proizvod"}
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
            <label className="block text-xs font-medium text-gray-600">Opis</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
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
            <label className="block text-xs font-medium text-gray-600">URL slike</label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="/images/..."
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600">Tip *</label>
              <select
                value={productTypeId}
                onChange={(e) => setProductTypeId(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                required
              >
                {productTypes.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
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
              <label className="block text-xs font-medium text-gray-600">Kategorija *</label>
              <select
                value={productCategoryId}
                onChange={(e) => setProductCategoryId(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                required
              >
                {productCategories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
            <span className="text-sm text-gray-700">Aktivan (prikazuje se na meniju)</span>
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
