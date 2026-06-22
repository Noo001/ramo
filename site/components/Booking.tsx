"use client";

import { useState } from "react";
import { SITE } from "@/lib/data";
import { Calendar, Clock, Users, Phone, CheckCircle } from "lucide-react";

export default function Booking() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    date: "",
    time: "",
    guests: "2",
    name: "",
    phone: "",
    comment: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Новая бронь в RAMO%0AИмя: ${form.name}%0AТелефон: ${form.phone}%0AДата: ${form.date}%0AВремя: ${form.time}%0AГостей: ${form.guests}%0AКомментарий: ${form.comment || "—"}`;
    window.open(`${SITE.social.whatsapp}?text=${text}`, "_blank");
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <section id="booking" className="py-20 sm:py-28 bg-background-alt">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-green-600" />
          <h2 className="mt-6 font-serif text-3xl font-bold text-foreground">Заявка отправлена</h2>
          <p className="mt-4 text-lg text-muted">
            Мы получили вашу заявку и свяжемся с вами в ближайшее время для подтверждения брони.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="mt-8 rounded-full bg-accent px-8 py-3 text-white font-medium hover:bg-accent-dark transition-colors"
          >
            Забронировать ещё
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="booking" className="py-20 sm:py-28 bg-background-alt">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">Забронировать стол</h2>
            <p className="mt-6 text-lg text-muted leading-relaxed">
              Оставьте заявку, и мы подтвердим бронь в течение 15 минут. Для срочных вопросов
              звоните по номеру {" "}
              <a href={`tel:${SITE.phone}`} className="text-accent hover:underline">
                {SITE.phoneDisplay}
              </a>
              .
            </p>

            <div className="mt-10 space-y-4">
              <div className="flex items-center gap-4 text-foreground">
                <Calendar className="w-5 h-5 text-accent" />
                <span>Выберите удобную дату</span>
              </div>
              <div className="flex items-center gap-4 text-foreground">
                <Clock className="w-5 h-5 text-accent" />
                <span>Укажите время визита</span>
              </div>
              <div className="flex items-center gap-4 text-foreground">
                <Users className="w-5 h-5 text-accent" />
                <span>Количество гостей</span>
              </div>
              <div className="flex items-center gap-4 text-foreground">
                <Phone className="w-5 h-5 text-accent" />
                <span>Подтверждение по телефону или в мессенджере</span>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-2xl bg-surface p-6 sm:p-8 shadow-sm border border-border-light"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground">Дата</label>
                <input
                  type="date"
                  required
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-border px-4 py-3 focus:border-accent focus:ring-1 focus:ring-accent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground">Время</label>
                <input
                  type="time"
                  required
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-border px-4 py-3 focus:border-accent focus:ring-1 focus:ring-accent outline-none"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-foreground">Количество гостей</label>
              <select
                value={form.guests}
                onChange={(e) => setForm({ ...form, guests: e.target.value })}
                className="mt-1 w-full rounded-xl border border-border px-4 py-3 focus:border-accent focus:ring-1 focus:ring-accent outline-none"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? "гость" : n < 5 ? "гостя" : "гостей"}
                  </option>
                ))}
                <option value="8+">Более 8</option>
              </select>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-foreground">Имя</label>
              <input
                type="text"
                required
                placeholder="Как к вам обращаться"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-1 w-full rounded-xl border border-border px-4 py-3 focus:border-accent focus:ring-1 focus:ring-accent outline-none"
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-foreground">Телефон</label>
              <input
                type="tel"
                required
                placeholder="+7 (___) ___-__-__"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="mt-1 w-full rounded-xl border border-border px-4 py-3 focus:border-accent focus:ring-1 focus:ring-accent outline-none"
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-foreground">Комментарий</label>
              <textarea
                rows={3}
                placeholder="Особые пожелания, повод для визита"
                value={form.comment}
                onChange={(e) => setForm({ ...form, comment: e.target.value })}
                className="mt-1 w-full rounded-xl border border-border px-4 py-3 focus:border-accent focus:ring-1 focus:ring-accent outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              className="mt-6 w-full rounded-full bg-accent px-8 py-4 text-base font-medium text-white hover:bg-accent-dark transition-colors"
            >
              Отправить заявку на бронь
            </button>

            <p className="mt-4 text-xs text-muted text-center">
              Нажимая кнопку, вы соглашаетесь на обработку персональных данных
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
