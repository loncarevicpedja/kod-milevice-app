export const MISSING_ORDER_NO = 9999;
export const DEFAULT_ORDER_NO = 1000;

export function orderNoValue(n: number | null | undefined): number {
  if (n == null) return MISSING_ORDER_NO;
  const v = Number(n);
  return Number.isFinite(v) ? v : MISSING_ORDER_NO;
}

export function parseOrderNo(raw: unknown, fallback = DEFAULT_ORDER_NO): number {
  if (raw == null || raw === "") return fallback;
  const v = Number(raw);
  if (!Number.isFinite(v)) return fallback;
  return Math.trunc(v);
}

export function compareByOrderNo(
  a: { order_no?: number | null; name?: string | null; id: number },
  b: { order_no?: number | null; name?: string | null; id: number },
): number {
  const d = orderNoValue(a.order_no) - orderNoValue(b.order_no);
  if (d !== 0) return d;
  const names = (a.name ?? "").localeCompare(b.name ?? "", "sr");
  if (names !== 0) return names;
  return a.id - b.id;
}
