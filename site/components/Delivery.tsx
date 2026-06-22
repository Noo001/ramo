import { SITE } from "@/lib/data";
import { Bike, Package, Clock, MapPin } from "lucide-react";

export default function Delivery() {
  return (
    <section id="delivery" className="py-20 sm:py-28 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
              Доставка и самовывоз
            </h2>
            <p className="mt-6 text-lg text-muted leading-relaxed">
              Любимые блюда RAMO теперь можно заказать домой или в офис. А если хотите сэкономить
              время — соберём заказ к вашему приходу. Агрегаторы дают заказы, а собственный канал
              помогает строить базу гостей и повторные продажи.
            </p>

            <div className="mt-10 grid sm:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-accent/10 p-3 text-accent">
                  <Bike className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Доставка</h3>
                  <p className="mt-1 text-sm text-muted">Привезём тёплые блюда по Воронежу</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-accent/10 p-3 text-accent">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Самовывоз</h3>
                  <p className="mt-1 text-sm text-muted">Заказ будет готов к назначенному времени</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-accent/10 p-3 text-accent">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Время работы</h3>
                  <p className="mt-1 text-sm text-muted">Пн–Чт 10–22, Пт–Сб 10–00, Вс 10–22</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-accent/10 p-3 text-accent">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Адрес</h3>
                  <p className="mt-1 text-sm text-muted">{SITE.address}</p>
                </div>
              </div>
            </div>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <a
                href={SITE.social.yandexEats}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-8 py-4 text-base font-medium text-white hover:bg-accent-dark transition-colors"
              >
                Заказать доставку
              </a>
              <a
                href={SITE.social.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-border px-8 py-4 text-base font-medium text-foreground hover:border-accent hover:text-accent transition-colors"
              >
                Оформить самовывоз
              </a>
            </div>
          </div>

          <div className="rounded-2xl bg-background-alt p-8 sm:p-10">
            <h3 className="font-serif text-2xl font-semibold text-foreground">Почему заказывать у нас</h3>
            <ul className="mt-6 space-y-4">
              {[
                "Актуальное меню и цены",
                "Быстрая сборка заказа",
                "Упаковка, которая сохраняет температуру",
                "Персональные предложения для постоянных гостей",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-foreground">
                  <span className="w-2 h-2 rounded-full bg-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
