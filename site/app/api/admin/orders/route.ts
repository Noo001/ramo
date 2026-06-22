import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const orders = await prisma.order.findMany({
      where: status ? { status: status as any } : undefined,
      orderBy: { createdAt: "desc" },
      include: {
        table: true,
        items: {
          include: { dish: true },
        },
      },
      take: 100,
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Admin orders error:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
