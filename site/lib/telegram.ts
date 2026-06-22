import { prisma } from "./prisma";

interface OrderWithItems {
  id: number;
  total: number;
  finalTotal: number;
  discount: number;
  pointsEarned: number;
  pointsSpent: number;
  comment: string | null;
  createdAt: Date;
  table: {
    zone: string;
    id: number;
  };
  items: {
    quantity: number;
    price: number;
    dish: {
      name: string;
    };
  }[];
}

export async function sendOrderToTelegram(order: OrderWithItems) {
  const tokenSetting = await prisma.setting.findUnique({ where: { key: "telegramBotToken" } });
  const chatIdSetting = await prisma.setting.findUnique({ where: { key: "telegramChatId" } });

  if (!tokenSetting?.value || !chatIdSetting?.value) {
    console.warn("Telegram settings not configured");
    return;
  }

  const zoneNames: Record<string, string> = {
    HALL1: "Зал 1",
    HALL2: "Зал 2",
    TERRACE: "Летняя веранда",
  };

  const tableText = `${zoneNames[order.table.zone] || order.table.zone}, стол ${order.table.id}`;

  let itemsText = "";
  order.items.forEach((item, index) => {
    itemsText += `${index + 1}. ${item.dish.name} x${item.quantity} — ${item.price * item.quantity} ₽\n`;
  });

  const loyaltyText = order.pointsSpent > 0 || order.pointsEarned > 0
    ? `\n🎁 <b>Списано баллов:</b> ${order.pointsSpent}\n⭐ <b>Начислено баллов:</b> ${order.pointsEarned}`
    : "";

  const totalText = order.discount > 0
    ? `\n💰 <b>Сумма:</b> ${order.total} ₽\n🏷 <b>Скидка:</b> ${order.discount} ₽\n💳 <b>К оплате:</b> ${order.finalTotal} ₽`
    : `\n💰 <b>Итого:</b> ${order.total} ₽`;

  const text = `
🍽 <b>Новый заказ #${order.id}</b>

📍 <b>Стол:</b> ${tableText}

${itemsText}${totalText}${loyaltyText}
${order.comment ? `\n💬 <b>Комментарий:</b> ${order.comment}` : ""}
  `.trim();

  const url = `https://api.telegram.org/bot${tokenSetting.value}/sendMessage`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatIdSetting.value,
        text,
        parse_mode: "HTML",
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Telegram API error:", error);
    }
  } catch (error) {
    console.error("Telegram send error:", error);
  }
}
