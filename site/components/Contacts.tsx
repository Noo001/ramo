import { SITE } from "@/lib/data";
import { MapPin, Phone, Clock, Share2 } from "lucide-react";

export default function Contacts() {
  return (
    <section id="contacts" className="py-20 sm:py-28 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          <div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">Контакты</h2>
            <p className="mt-6 text-lg text-muted">
              Ждём вас по адресу в самом центре Воронежа. По всем вопросам звоните или пишите в
              мессенджеры — ответим за пару минут.
            </p>

            <div className="mt-10 space-y-6">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-accent/10 p-3 text-accent">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Адрес</h3>
                  <p className="mt-1 text-muted">{SITE.address}</p>
                  <p className="text-sm text-muted/70">Первая линия, этаж 1</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="rounded-full bg-accent/10 p-3 text-accent">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Телефон</h3>
                  <a
                    href={`tel:${SITE.phone}`}
                    className="mt-1 block text-muted hover:text-accent transition-colors"
                  >
                    {SITE.phoneDisplay}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="rounded-full bg-accent/10 p-3 text-accent">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">График работы</h3>
                  <p className="mt-1 text-muted">Пн–Чт: {SITE.workHours.monThu}</p>
                  <p className="text-muted">Пт–Сб: {SITE.workHours.friSat}</p>
                  <p className="text-muted">Вс: {SITE.workHours.sun}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="rounded-full bg-accent/10 p-3 text-accent">
                  <Share2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Мы в соцсетях</h3>
                  <div className="mt-1 flex gap-4">
                    <a
                      href={SITE.social.vk}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted hover:text-accent transition-colors"
                    >
                      VK
                    </a>
                    <a
                      href={SITE.social.telegram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted hover:text-accent transition-colors"
                    >
                      Telegram
                    </a>
                    <a
                      href={SITE.social.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted hover:text-accent transition-colors"
                    >
                      WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden border border-border-light shadow-sm h-96 lg:h-auto min-h-[400px]">
            <iframe
              src="https://yandex.ru/map-widget/v1/org/93989286107"
              width="100%"
              height="100%"
              allowFullScreen
              className="w-full h-full border-0"
              title="RAMO на Яндекс Картах"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
