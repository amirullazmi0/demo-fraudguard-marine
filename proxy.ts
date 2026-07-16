import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, SESSION_COOKIE } from "@/app/api/_server/auth/session";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  if (pathname === "/login" || pathname.startsWith("/_next") || pathname.startsWith("/api") || pathname === "/manifest.webmanifest" || pathname === "/favicon.ico") return NextResponse.next();
  const session = await verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value);
  if (!session) return NextResponse.redirect(new URL("/login", request.url));
  if (pathname.startsWith("/boss") && session.role !== "ADMIN") return NextResponse.redirect(new URL("/crew", request.url));
  return NextResponse.next();
}

export const config = { matcher: ["/((?!.*\\..*).*)"] };

