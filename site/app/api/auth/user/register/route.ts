import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, signUserToken, setUserCookie } from "@/lib/auth-user";

export async function POST(request: Request) {
  try {
    const { phone, password, name } = await request.json();

    if (!phone || !password) {
      return NextResponse.json({ error: "Укажите телефон и пароль" }, { status: 400 });
    }

    const phoneClean = phone.replace(/\D/g, "");
    if (phoneClean.length < 10) {
      return NextResponse.json({ error: "Некорректный номер телефона" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { phone: phoneClean } });
    if (existing) {
      return NextResponse.json({ error: "Пользователь с таким телефоном уже существует" }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: { phone: phoneClean, passwordHash, name: name || null },
    });

    const token = await signUserToken({ userId: user.id, phone: user.phone });
    await setUserCookie(token);

    return NextResponse.json({
      success: true,
      user: { id: user.id, phone: user.phone, name: user.name, points: user.points },
    });
  } catch (error) {
    console.error("User register error:", error);
    return NextResponse.json({ error: "Ошибка регистрации" }, { status: 500 });
  }
}
