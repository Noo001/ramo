import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const tables = await prisma.table.findMany({
      where: { isActive: true },
      orderBy: [{ zone: "asc" }, { id: "asc" }],
    });
    return NextResponse.json(tables);
  } catch (error) {
    console.error("Tables error:", error);
    return NextResponse.json({ error: "Ошибка загрузки столов" }, { status: 500 });
  }
}
