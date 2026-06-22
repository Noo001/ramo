import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserAuth } from "@/lib/auth-user";

export async function GET(request: Request) {
  try {
    const auth = await getUserAuth(request as unknown as import("next/server").NextRequest);
    if (!auth) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: auth.userId },
      select: { id: true, phone: true, name: true, points: true, createdAt: true },
    });

    if (!user) {
      return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("User me error:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
