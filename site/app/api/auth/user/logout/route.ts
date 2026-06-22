import { NextResponse } from "next/server";
import { clearUserCookie } from "@/lib/auth-user";

export async function POST() {
  await clearUserCookie();
  return NextResponse.json({ success: true });
}
