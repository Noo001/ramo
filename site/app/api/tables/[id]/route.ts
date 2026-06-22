import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const table = await prisma.table.findUnique({
      where: { id: Number(id) },
    });

    if (!table) {
      return NextResponse.json({ error: "Стол не найден" }, { status: 404 });
    }

    return NextResponse.json(table);
  } catch (error) {
    console.error("Table error:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
