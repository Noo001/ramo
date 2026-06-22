import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendOrderToTelegram } from "@/lib/telegram";
import { getUserAuth } from "@/lib/auth-user";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tableId, items, comment, pointsToSpend, utmSource, utmMedium, utmCampaign } = body;

    if (!tableId || !items || items.length === 0) {
      return NextResponse.json({ error: "Некорректный заказ" }, { status: 400 });
    }

    const table = await prisma.table.findUnique({
      where: { id: Number(tableId) },
    });

    if (!table) {
      return NextResponse.json({ error: "Стол не найден" }, { status: 404 });
    }

    const dishIds = items.map((item: { dishId: number }) => item.dishId);
    const dishes = await prisma.dish.findMany({
      where: { id: { in: dishIds } },
    });

    const dishMap = new Map(dishes.map((d) => [d.id, d]));
    let total = 0;

    const orderItemsData = items.map((item: { dishId: number; quantity: number }) => {
      const dish = dishMap.get(item.dishId);
      if (!dish) throw new Error("Блюдо не найдено");
      const sum = dish.price * item.quantity;
      total += sum;
      return {
        dishId: item.dishId,
        quantity: item.quantity,
        price: dish.price,
      };
    });

    const auth = await getUserAuth(request);
    const user = auth ? await prisma.user.findUnique({ where: { id: auth.userId } }) : null;

    // Loyalty settings
    const earnSetting = await prisma.setting.findUnique({ where: { key: "loyaltyEarnPercent" } });
    const spendSetting = await prisma.setting.findUnique({ where: { key: "loyaltySpendPercent" } });
    const earnPercent = Math.max(0, Math.min(100, Number(earnSetting?.value || 5)));
    const spendPercent = Math.max(0, Math.min(100, Number(spendSetting?.value || 30)));

    let pointsEarned = 0;
    let pointsSpent = 0;
    let discount = 0;
    let finalTotal = total;

    if (user) {
      const maxSpend = Math.floor((total * spendPercent) / 100);
      const requested = Math.max(0, Number(pointsToSpend || 0));
      pointsSpent = Math.min(requested, user.points, maxSpend);
      discount = pointsSpent;
      finalTotal = total - discount;
      pointsEarned = Math.floor((finalTotal * earnPercent) / 100);
    }

    const order = await prisma.order.create({
      data: {
        tableId: Number(tableId),
        userId: user?.id || null,
        total,
        discount,
        finalTotal,
        pointsEarned,
        pointsSpent,
        comment: comment || null,
        utmSource: utmSource || null,
        utmMedium: utmMedium || null,
        utmCampaign: utmCampaign || null,
        items: {
          create: orderItemsData,
        },
      },
      include: {
        table: true,
        items: {
          include: {
            dish: true,
          },
        },
      },
    });

    // Update user points
    if (user) {
      const newPoints = user.points - pointsSpent + pointsEarned;
      await prisma.user.update({
        where: { id: user.id },
        data: { points: newPoints },
      });
    }

    // Send to Telegram without blocking response
    sendOrderToTelegram(order).catch(console.error);

    return NextResponse.json({
      success: true,
      orderId: order.id,
      finalTotal,
      pointsEarned,
      pointsSpent,
      remainingPoints: user ? user.points - pointsSpent + pointsEarned : 0,
    });
  } catch (error) {
    console.error("Order error:", error);
    return NextResponse.json({ error: "Ошибка оформления заказа" }, { status: 500 });
  }
}
