import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, description, price, weight, categoryId, image, isActive, isStopListed } = body;

    const dish = await prisma.dish.update({
      where: { id: Number(id) },
      data: {
        name,
        description: description || null,
        price: Number(price),
        weight: weight || null,
        categoryId: Number(categoryId),
        image: image || null,
        isActive,
        isStopListed,
      },
    });

    return NextResponse.json(dish);
  } catch (error) {
    console.error("Update dish error:", error);
    return NextResponse.json({ error: "Ошибка обновления блюда" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.dish.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete dish error:", error);
    return NextResponse.json({ error: "Ошибка удаления блюда" }, { status: 500 });
  }
}
