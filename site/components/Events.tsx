"use client";

import { useState } from "react";
import Image from "next/image";
import { SITE } from "@/lib/data";
import { CheckCircle } from "lucide-react";
import { getUtmBody } from "@/lib/utm";

export default function Events() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    eventType: "",
    guests: "",
    date: "",
    budget: "",
    name: "",
    phone: "",
    comment: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/event-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          ...getUtmBody(),
        }),
      });

      if (res.ok) {
        setSubmitted(true);
        return;
      }
    } catch {
      // fallback to WhatsApp
    }

    const text = `Заявка на мероприятие в RAMO%0AТип: ${form.eventType}%0AГостей: ${form.guests}%0AДата: ${form.date}%0AБюджет: ${form.budget || "—"}%0AИмя: ${form.name}%0AТелефон: ${form.phone}`;
    window.open(`${SITE.social.whatsapp}?text=${text}`, "_blank");
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <section id="events" className="py-20 sm:py-28 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
              Корпоративы и мероприятия
            </h2>
            <p className="mt-6 text-lg text-muted leading-relaxed">
              От камерного ужина до банкета — подстраиваемся под ваш формат. Арендуйте отдельный
              зал до 20 гостей или всё кафе целиком до 40 человек.
            </p>

            <div className="mt-8 relative aspect-video rounded-2xl overflow-hidden">
              <Image
                src="/images/food-1.jpg"
                alt="Мероприятие в RAMO"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            <div className="mt-8 grid sm:grid-cols-2 gap-4">
              {[
                "Проектор, звук, винил",
                "Помощь с декором и артистами",
                "Персональное банкетное меню",
                "Честный пробковый сбор",
                "Аренда отдельного зала или всего кафе",
                "Гибкий формат под ваш бюджет",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 text-foreground">
                  <CheckCircle className="w-5 h-5 text-accent shrink-0" />
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {submitted ? (
            <div className="rounded-2xl bg-background-alt p-8 sm:p-10 text-center">
              <CheckCircle className="mx-auto h-16 w-16 text-green-600" />
              <h3 className="mt-6 font-serif text-2xl font-bold text-foreground">Заявка отправлена</h3>
              <p className="mt-4 text-muted">
                Мы свяжемся с вами, чтобы обсудить детали мероприятия.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl bg-background-alt p-6 sm:p-8"
            >
              <h3 className="font-serif text-2xl font-semibold text-foreground">Рассчитать мероприятие</h3>

              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground">Тип мероприятия</label>
                  <select
                    required
                    value={form.eventType}
                    onChange={(e) => setForm({ ...form, eventType: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-border px-4 py-3 focus:border-accent focus:ring-1 focus:ring-accent outline-none"
                  >
                    <option value="">Выберите тип</option>
                    <option value="День рождения">День рождения</option>
                    <option value="Корпоратив">Корпоратив</option>
                    <option value="Свадьба/свадебный ужин">Свадьба/свадебный ужин</option>
                    <option value="Деловая встреча">Деловая встреча</option>
                    <option value="Семейный ужин">Семейный ужин</option>
                    <option value="Другое">Другое</option>
                  </select>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground">Количество гостей</label>
                    <input
                      type="number"
                      required
                      min="1"
                      placeholder="Например, 25"
                      value={form.guests}
                      onChange={(e) => setForm({ ...form, guests: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-border px-4 py-3 focus:border-accent focus:ring-1 focus:ring-accent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground">Планируемая дата</label>
                    <input
                      type="date"
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-border px-4 py-3 focus:border-accent focus:ring-1 focus:ring-accent outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground">Примерный бюджет</label>
                  <input
                    type="text"
                    placeholder="Например, 50 000 ₽"
                    value={form.budget}
                    onChange={(e) => setForm({ ...form, budget: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-border px-4 py-3 focus:border-accent focus:ring-1 focus:ring-accent outline-none"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground">Имя</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-border px-4 py-3 focus:border-accent focus:ring-1 focus:ring-accent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground">Телефон</label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-border px-4 py-3 focus:border-accent focus:ring-1 focus:ring-accent outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground">Комментарий</label>
                  <input
                    type="text"
                    placeholder="Пожелания по меню, декору, времени"
                    value={form.comment}
                    onChange={(e) => setForm({ ...form, comment: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-border px-4 py-3 focus:border-accent focus:ring-1 focus:ring-accent outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-6 w-full rounded-full bg-accent px-8 py-4 text-base font-medium text-white hover:bg-accent-dark transition-colors disabled:opacity-60"
              >
                {loading ? "Отправка..." : "Отправить заявку"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
