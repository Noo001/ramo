import { MENU_CATEGORIES, SITE } from "@/lib/data";
import { ExternalLink } from "lucide-react";

export default function Menu() {
  return (
    <section id="menu" className="py-20 sm:py-28 bg-background-alt">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">Меню</h2>
          <p className="mt-4 text-lg text-muted">
            Авторские блюда, приготовленные с вниманием к деталям. Полное меню с актуальными ценами — на Яндекс Еде.
          </p>
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-8">
          {MENU_CATEGORIES.map((category) => (
            <div
              key={category.name}
              className="rounded-2xl bg-surface p-6 sm:p-8 shadow-sm border border-border-light"
            >
              <h3 className="font-serif text-2xl font-semibold text-foreground">{category.name}</h3>
              <ul className="mt-6 space-y-5">
                {category.items.map((item) => (
                  <li key={item.name} className="flex items-end justify-between gap-4">
                    <div>
                      <p className="font-medium text-foreground">{item.name}</p>
                      <p className="text-sm text-muted">{item.weight}</p>
                    </div>
                    <span className="whitespace-nowrap font-semibold text-accent">{item.price} ₽</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a
            href={SITE.social.yandexEats}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-8 py-4 text-base font-medium text-background hover:bg-accent-dark transition-colors"
          >
            Смотреть полное меню
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
