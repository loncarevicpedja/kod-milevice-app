import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_PATH = "/admin";
const ADMIN_COOKIE = "admin_session";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith(ADMIN_PATH)) {
    return NextResponse.next();
  }

  const secret = (process.env.ADMIN_SECRET ?? "").trim();
  if (!secret) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const cookieValue = request.cookies.get(ADMIN_COOKIE)?.value?.trim();
  const queryKey = request.nextUrl.searchParams.get("key")?.trim() ?? "";

  const isAuthorized = cookieValue === secret || queryKey === secret;

  if (isAuthorized) {
    if (queryKey === secret && cookieValue !== secret) {
      const url = request.nextUrl.clone();
      url.searchParams.delete("key");
      const redirectRes = NextResponse.redirect(url);
      redirectRes.cookies.set(ADMIN_COOKIE, secret, {
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
        httpOnly: true,
        sameSite: "lax",
      });
      return redirectRes;
    }
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/", request.url));
}

export const config = {
  matcher: ["/admin", "/admin/(.*)"],
};
