import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        dishes: {
          where: {
            isActive: true,
            isStopListed: false,
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Menu error:", error);
    return NextResponse.json({ error: "Ошибка загрузки меню" }, { status: 500 });
  }
}
