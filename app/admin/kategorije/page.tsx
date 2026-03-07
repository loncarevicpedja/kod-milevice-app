import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

async function getProductTypes() {
  const { data, error } = await supabase
    .from("product_type")
    .select("id, name, is_active")
    .order("name", { ascending: true });
  if (error) {
    console.error("product_type error:", error);
    return [];
  }
  return data ?? [];
}

async function getTasteTypes() {
  const { data, error } = await supabase
    .from("taste_type")
    .select("id, name, is_active")
    .order("name", { ascending: true });
  if (error) {
    console.error("taste_type error:", error);
    return [];
  }
  return data ?? [];
}

async function getProductCategories() {
  const { data, error } = await supabase
    .from("product_category")
    .select("id, name, is_active")
    .order("name", { ascending: true });
  if (error) {
    console.error("product_category error:", error);
    return [];
  }
  return data ?? [];
}

export default async function AdminKategorijePage() {
  const [productTypes, tasteTypes, categories] = await Promise.all([
    getProductTypes(),
    getTasteTypes(),
    getProductCategories(),
  ]);

  const table = (
    title: string,
    rows: { id: number; name: string; is_active: boolean }[]
  ) => (
    <div className="mb-8">
      <h2 className="mb-3 text-lg font-semibold text-gray-800">{title}</h2>
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

      {table("Product type (npr. Palačinke, Tortilje)", productTypes)}
      {table("Taste type (npr. Slane, Slatke)", tasteTypes)}
      {table(
        "Product category (npr. Classic palačinke, Mega, Naš mix)",
        categories
      )}
    </div>
  );
}
