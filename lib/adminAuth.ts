import { cookies } from "next/headers";

const ADMIN_COOKIE = "admin_session";

export async function requireAdmin(): Promise<boolean> {
  const secret = (process.env.ADMIN_SECRET ?? "").trim();
  if (!secret) return false;

  const cookieStore = await cookies();
  const value = cookieStore.get(ADMIN_COOKIE)?.value?.trim();
  return value === secret;
}

export function unauthorizedResponse() {
  return new Response(JSON.stringify({ error: "Unauthorized" }), {
    status: 401,
    headers: { "Content-Type": "application/json" },
  });
}
