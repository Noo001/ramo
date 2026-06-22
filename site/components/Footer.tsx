import { SITE, NAV } from "@/lib/data";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-white/80 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <span className="font-serif text-2xl font-bold text-white">{SITE.name}</span>
            <p className="mt-4 max-w-sm text-sm leading-relaxed">
              Букет вкусов и впечатлений в центре Воронежа. Доставка, бронь, банкеты и корпоративы.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white">Навигация</h4>
            <ul className="mt-4 space-y-2">
              {NAV.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="text-sm hover:text-white transition-colors">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white">Контакты</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a href={`tel:${SITE.phone}`} className="hover:text-white transition-colors">
                  {SITE.phoneDisplay}
                </a>
              </li>
              <li>{SITE.address}</li>
              <li>
                <a
                  href={SITE.social.vk}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  VK
                </a>
                {" · "}
                <a
                  href={SITE.social.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Telegram
                </a>
                {" · "}
                <a
                  href={SITE.social.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
          <p>© {currentYear} {SITE.name}. Все права защищены.</p>
          <a href="#" className="hover:text-white transition-colors">
            Политика конфиденциальности
          </a>
        </div>
      </div>
    </footer>
  );
}
