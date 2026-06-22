import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const dishes = await prisma.dish.findMany({
      orderBy: { createdAt: "desc" },
      include: { category: true },
    });
    return NextResponse.json(dishes);
  } catch (error) {
    console.error("Admin dishes error:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, price, weight, categoryId, image, isActive, isStopListed } = body;

    const dish = await prisma.dish.create({
      data: {
        name,
        description: description || null,
        price: Number(price),
        weight: weight || null,
        categoryId: Number(categoryId),
        image: image || null,
        isActive: isActive ?? true,
        isStopListed: isStopListed ?? false,
      },
    });

    return NextResponse.json(dish);
  } catch (error) {
    console.error("Create dish error:", error);
    return NextResponse.json({ error: "Ошибка создания блюда" }, { status: 500 });
  }
}
