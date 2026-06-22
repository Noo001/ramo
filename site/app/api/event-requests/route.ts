import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendTelegramMessage } from "@/lib/telegram";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventType, guests, date, budget, name, phone, comment, utmSource, utmMedium, utmCampaign } = body;

    if (!eventType || !guests || !name || !phone) {
      return NextResponse.json({ error: "Обязательные поля не заполнены" }, { status: 400 });
    }

    const eventRequest = await prisma.eventRequest.create({
      data: {
        eventType,
        guests: String(guests),
        date: date || null,
        budget: budget || null,
        name,
        phone,
        comment: comment || null,
        utmSource: utmSource || null,
        utmMedium: utmMedium || null,
        utmCampaign: utmCampaign || null,
      },
    });

    const text = [
      "🎉 <b>Новая заявка на мероприятие RAMO</b>",
      `Тип: ${eventType}`,
      `Гостей: ${guests}`,
      date ? `Дата: ${date}` : null,
      budget ? `Бюджет: ${budget}` : null,
      `Имя: ${name}`,
      `Телефон: ${phone}`,
      comment ? `Комментарий: ${comment}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    sendTelegramMessage(text).catch(console.error);

    return NextResponse.json({ success: true, id: eventRequest.id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Не удалось сохранить заявку" }, { status: 500 });
  }
}
