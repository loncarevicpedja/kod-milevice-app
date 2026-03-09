import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

type OrderRow = {
  id: number;
  order_number: string;
  customer_name: string;
  phone: string;
  address: string | null;
  delivery_type: string;
  note: string | null;
  total_price: number;
  status: string;
  created_at: string;
};

async function getOrders(): Promise<OrderRow[]> {
  const { data, error } = await supabase
    .from("order")
    .select(
      "id, order_number, customer_name, phone, address, delivery_type, note, total_price, status, created_at"
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Admin porudzbine error:", error);
    return [];
  }
  return (data ?? []) as OrderRow[];
}

function formatDate(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleString("sr-RS", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default async function AdminPorudzbinePage() {
  const orders = await getOrders();

  const today = new Date();
  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const todayOrders = orders.filter((o) =>
    isSameDay(new Date(o.created_at), today),
  );

  const groupedByDate = orders.reduce<Record<string, OrderRow[]>>(
    (acc, order) => {
      const d = new Date(order.created_at);
      const key = d.toLocaleDateString("sr-RS", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      if (!acc[key]) acc[key] = [];
      acc[key].push(order);
      return acc;
    },
    {},
  );

  const sortedDateKeys = Object.keys(groupedByDate).sort((a, b) => {
    const [da, ma, ya] = a.split(".").map((x) => Number(x.trim()) || 0);
    const [db, mb, yb] = b.split(".").map((x) => Number(x.trim()) || 0);
    const dateA = new Date(ya, ma - 1, da).getTime();
    const dateB = new Date(yb, mb - 1, db).getTime();
    return dateB - dateA;
  });

  return (
    <div>
      <Link href="/admin" className="text-sm text-gray-600 hover:text-rose">
        ← Dashboard
      </Link>
      <h1 className="mt-4 text-2xl font-semibold text-gray-800">
        Porudžbine
      </h1>
      <p className="mt-1 text-sm text-gray-600">
        Pregled svih porudžbina. Klik na red može kasnije otvoriti detalje.
      </p>

      {todayOrders.length > 0 && (
        <section className="mt-6">
          <h2 className="mb-2 text-sm font-semibold text-gray-800">
            Današnje porudžbine
          </h2>
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
            <table className="min-w-[800px] text-left text-sm">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-4 py-3 font-semibold text-gray-800">ID</th>
                  <th className="px-4 py-3 font-semibold text-gray-800">
                    Broj
                  </th>
                  <th className="px-4 py-3 font-semibold text-gray-800">
                    Kupac
                  </th>
                  <th className="px-4 py-3 font-semibold text-gray-800">
                    Telefon
                  </th>
                  <th className="px-4 py-3 font-semibold text-gray-800">
                    Način
                  </th>
                  <th className="px-4 py-3 font-semibold text-gray-800">
                    Ukupno
                  </th>
                  <th className="px-4 py-3 font-semibold text-gray-800">
                    Status
                  </th>
                  <th className="px-4 py-3 font-semibold text-gray-800">
                    Datum
                  </th>
                </tr>
              </thead>
              <tbody>
                {todayOrders.map((o) => (
                  <tr
                    key={o.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 text-gray-600">{o.id}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {o.order_number}
                    </td>
                    <td className="px-4 py-3 text-gray-800">
                      {o.customer_name}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{o.phone}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {o.delivery_type === "dostava" ? "Dostava" : "Lično"}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {Number(o.total_price).toFixed(0)} RSD
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          o.status === "pending"
                            ? "text-amber-600"
                            : "text-gray-600"
                        }
                      >
                        {o.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {formatDate(o.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <section className="mt-8">
        <h2 className="mb-2 text-sm font-semibold text-gray-800">
          Sve porudžbine po datumima
        </h2>
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="rounded-xl border border-gray-200 bg-white p-4 text-center text-sm text-gray-500 shadow-sm">
              Nema porudžbina.
            </div>
          ) : (
            sortedDateKeys.map((dateKey) => (
              <div
                key={dateKey}
                className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm"
              >
                <div className="border-b border-gray-100 bg-gray-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gray-600">
                  {dateKey}
                </div>
                <table className="min-w-[800px] text-left text-sm">
                  <thead className="border-b border-gray-200 bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 font-semibold text-gray-800">
                        ID
                      </th>
                      <th className="px-4 py-3 font-semibold text-gray-800">
                        Broj
                      </th>
                      <th className="px-4 py-3 font-semibold text-gray-800">
                        Kupac
                      </th>
                      <th className="px-4 py-3 font-semibold text-gray-800">
                        Telefon
                      </th>
                      <th className="px-4 py-3 font-semibold text-gray-800">
                        Način
                      </th>
                      <th className="px-4 py-3 font-semibold text-gray-800">
                        Ukupno
                      </th>
                      <th className="px-4 py-3 font-semibold text-gray-800">
                        Status
                      </th>
                      <th className="px-4 py-3 font-semibold text-gray-800">
                        Datum
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupedByDate[dateKey]?.map((o) => (
                      <tr
                        key={o.id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="px-4 py-3 text-gray-600">{o.id}</td>
                        <td className="px-4 py-3 font-medium text-gray-800">
                          {o.order_number}
                        </td>
                        <td className="px-4 py-3 text-gray-800">
                          {o.customer_name}
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {o.phone}
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {o.delivery_type === "dostava" ? "Dostava" : "Lično"}
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {Number(o.total_price).toFixed(0)} RSD
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={
                              o.status === "pending"
                                ? "text-amber-600"
                                : "text-gray-600"
                            }
                          >
                            {o.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-500">
                          {formatDate(o.created_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
