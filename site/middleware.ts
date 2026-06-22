import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { COOKIE_NAME } from "./lib/auth";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-in-production";
const secret = new TextEncoder().encode(JWT_SECRET);

async function verifyAdminToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as { login: string };
  } catch {
    return null;
  }
}

async function verifyUserToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as { userId: number };
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const adminToken = request.cookies.get(COOKIE_NAME)?.value;
  const userToken = request.cookies.get("user_token")?.value;

  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  const isApiAdminRoute = request.nextUrl.pathname.startsWith("/api/admin");
  const isProfileRoute = request.nextUrl.pathname.startsWith("/profile");

  if ((isAdminRoute || isApiAdminRoute) && !(await verifyAdminToken(adminToken || ""))) {
    if (request.nextUrl.pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isProfileRoute && !(await verifyUserToken(userToken || ""))) {
    return NextResponse.redirect(new URL("/auth-user", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/profile/:path*"],
};
