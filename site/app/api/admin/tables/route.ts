import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { TableZone } from "@prisma/client";

export async function GET() {
  try {
    const tables = await prisma.table.findMany({
      orderBy: [{ zone: "asc" }, { id: "asc" }],
    });
    return NextResponse.json(tables);
  } catch (error) {
    console.error("Tables error:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, number, zone, seats, isActive } = body;

    const tableId = id !== undefined ? Number(id) : Number(number);

    const table = await prisma.table.create({
      data: {
        id: tableId,
        zone: zone as TableZone,
        seats: Number(seats) || 4,
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json(table);
  } catch (error) {
    console.error("Create table error:", error);
    return NextResponse.json({ error: "Ошибка создания стола" }, { status: 500 });
  }
}
