import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");

    if (!date) {
      return NextResponse.json({ error: "Укажите дату" }, { status: 400 });
    }

    const reservations = await prisma.reservation.findMany({
      where: { date, status: "CONFIRMED" },
      include: { table: true },
    });

    return NextResponse.json(reservations);
  } catch (error) {
    console.error("Reservations error:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tableId, name, phone, guests, date, time, comment, utmSource, utmMedium, utmCampaign } = body;

    if (!tableId || !name || !phone || !guests || !date || !time) {
      return NextResponse.json({ error: "Заполните все обязательные поля" }, { status: 400 });
    }

    const reservation = await prisma.reservation.create({
      data: {
        tableId: Number(tableId),
        name,
        phone,
        guests: Number(guests),
        date,
        time,
        comment: comment || null,
        utmSource: utmSource || null,
        utmMedium: utmMedium || null,
        utmCampaign: utmCampaign || null,
      },
      include: { table: true },
    });

    return NextResponse.json(reservation);
  } catch (error) {
    console.error("Create reservation error:", error);
    return NextResponse.json({ error: "Ошибка создания бронирования" }, { status: 500 });
  }
}
