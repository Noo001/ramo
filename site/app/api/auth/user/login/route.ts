import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, signUserToken, setUserCookie } from "@/lib/auth-user";

export async function POST(request: Request) {
  try {
    const { phone, password } = await request.json();

    if (!phone || !password) {
      return NextResponse.json({ error: "Укажите телефон и пароль" }, { status: 400 });
    }

    const phoneClean = phone.replace(/\D/g, "");
    const user = await prisma.user.findUnique({ where: { phone: phoneClean } });
    if (!user) {
      return NextResponse.json({ error: "Неверный телефон или пароль" }, { status: 401 });
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Неверный телефон или пароль" }, { status: 401 });
    }

    const token = await signUserToken({ userId: user.id, phone: user.phone });
    await setUserCookie(token);

    return NextResponse.json({
      success: true,
      user: { id: user.id, phone: user.phone, name: user.name, points: user.points },
    });
  } catch (error) {
    console.error("User login error:", error);
    return NextResponse.json({ error: "Ошибка входа" }, { status: 500 });
  }
}
