import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="border-b border-gray-200 bg-white px-4 py-3 shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link
            href="/admin"
            className="text-lg font-semibold text-gray-800 hover:text-rose"
          >
            Kod Milevice · Admin
          </Link>
          <Link
            href="/"
            className="text-sm text-gray-600 hover:text-rose"
          >
            ← Nazad na sajt
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
    </div>
  );
}
