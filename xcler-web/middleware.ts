import { NextResponse, type NextRequest } from "next/server";

function hasSupabaseSession(request: NextRequest) {
  return request.cookies
    .getAll()
    .some((cookie) => cookie.name.includes("sb-") && cookie.name.includes("auth-token") && Boolean(cookie.value));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const isLoginPage = pathname === "/admin/login";
  const authenticated = hasSupabaseSession(request);

  if (!authenticated && !isLoginPage) {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (authenticated && isLoginPage) {
    const adminUrl = new URL("/admin", request.url);
    return NextResponse.redirect(adminUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
