import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/lib/data";
import { QrCode, UtensilsCrossed, Map, Phone, Clock, MapPin, Star, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/interior-1.jpg"
            alt="Интерьер кафе RAMO"
            fill
            priority
            className="object-cover scale-105"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-4 py-2 text-sm text-white/90 border border-white/10 animate-fade-in-up">
              <Star className="w-4 h-4 fill-accent text-accent" />
              <span>5,0 на Яндекс Картах · 137 отзывов</span>
            </div>

            <div className="mt-8 relative w-56 sm:w-72 lg:w-96 h-20 sm:h-24 lg:h-32 animate-fade-in-up">
              <Image
                src="/images/logo-white.png"
                alt="RAMO"
                fill
                priority
                className="object-contain object-left"
                sizes="(max-width: 640px) 14rem, (max-width: 1024px) 18rem, 24rem"
              />
            </div>
            <p className="mt-6 text-2xl sm:text-3xl font-light text-white/90 animate-fade-in-up">
              Букет вкусов и впечатлений
            </p>
            <p className="mt-6 text-lg text-white/70 leading-relaxed max-w-xl animate-fade-in-up">
              Современное кафе в центре Воронежа. Сканируйте QR-код на столе, заказывайте
              любимые блюда и наслаждайтесь атмосферой.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 animate-fade-in-up">
              <Link
                href="/menu"
                className="group inline-flex items-center justify-center gap-3 rounded-full bg-accent px-8 py-4 text-base font-medium text-white shadow-lg hover:bg-accent-dark transition-all"
              >
                <UtensilsCrossed className="w-5 h-5" />
                Открыть меню
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/map"
                className="inline-flex items-center justify-center gap-3 rounded-full border border-white/30 bg-white/5 backdrop-blur-sm px-8 py-4 text-base font-medium text-white hover:bg-white/10 transition-all"
              >
                <Map className="w-5 h-5" />
                Карта зала
              </Link>
            </div>

            <div className="mt-12 flex flex-wrap items-center gap-6 text-white/60 text-sm animate-fade-in-up">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {SITE.address}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Пн–Чт {SITE.workHours.monThu}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-accent font-medium tracking-wider uppercase text-sm">Как это работает</p>
            <h2 className="mt-4 font-display text-4xl sm:text-5xl font-normal">QR-меню за три шага</h2>
          </div>

          <div className="mt-16 grid md:grid-cols-3 gap-8">
            {[
              {
                icon: QrCode,
                title: "Отсканируйте код",
                text: "Наведите камеру телефона на QR-код, который находится на вашем столе",
              },
              {
                icon: UtensilsCrossed,
                title: "Выберите блюда",
                text: "Просмотрите меню с фото, описанием и составом, добавьте всё в корзину",
              },
              {
                icon: Phone,
                title: "Закажите за стол",
                text: "Заказ мгновенно уходит на кухню, официант принесёт всё к вам",
              },
            ].map((step, idx) => (
              <div
                key={step.title}
                className="group rounded-2xl bg-surface p-8 shadow-sm border border-border-light hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                    <step.icon className="w-7 h-7" />
                  </div>
                  <span className="font-display text-5xl text-border group-hover:text-accent/20 transition-colors">
                    0{idx + 1}
                  </span>
                </div>
                <h3 className="mt-6 font-display text-2xl">{step.title}</h3>
                <p className="mt-3 text-muted leading-relaxed">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="py-24 sm:py-32 bg-background-alt">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
              <Image
                src="/images/interior-2.jpg"
                alt="Интерьер RAMO"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div>
              <p className="text-accent font-medium tracking-wider uppercase text-sm">О кафе</p>
              <h2 className="mt-4 font-display text-4xl sm:text-5xl font-normal leading-tight">
                Место, где хочется остаться
              </h2>
              <p className="mt-6 text-lg text-muted leading-relaxed">
                RAMO — это современное кафе в центре Воронежа с продуманным интерьером,
                внимательным сервисом и меню, в котором каждое блюдо готовится с вниманием
                к деталям.
              </p>
              <div className="mt-10 grid sm:grid-cols-2 gap-6">
                {[
                  "Авторская кухня",
                  "Банкеты и корпоративы",
                  "Летняя веранда",
                  "Dog-friendly",
                  "Честный пробковый сбор",
                  "Центр города",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-foreground text-white p-10 sm:p-16 text-center">
            <h2 className="font-display text-4xl sm:text-5xl font-normal">Забронируйте стол</h2>
            <p className="mt-4 text-white/70 max-w-xl mx-auto text-lg">
              Выберите подходящий стол на интерактивной карте зала и забронируйте по телефону.
            </p>
            <Link
              href="/map"
              className="mt-8 inline-flex items-center gap-3 rounded-full bg-accent px-8 py-4 text-base font-medium hover:bg-accent-dark transition-colors"
            >
              <Map className="w-5 h-5" />
              Выбрать стол на карте
            </Link>
          </div>
        </div>
      </section>

      {/* Contacts */}
      <section className="py-24 sm:py-32 bg-background-alt">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-accent font-medium tracking-wider uppercase text-sm">Контакты</p>
            <h2 className="mt-4 font-display text-4xl sm:text-5xl font-normal">Приходите в гости</h2>
          </div>

          <div className="mt-16 grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { icon: MapPin, title: "Адрес", text: SITE.address },
              { icon: Phone, title: "Телефон", text: SITE.phoneDisplay, href: `tel:${SITE.phone}` },
              {
                icon: Clock,
                title: "Режим работы",
                text: `Пн–Чт ${SITE.workHours.monThu}\nПт–Сб ${SITE.workHours.friSat}\nВс ${SITE.workHours.sun}`,
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl bg-surface p-8 shadow-sm border border-border-light text-center"
              >
                <div className="mx-auto w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="mt-5 font-display text-xl">{item.title}</h3>
                {item.href ? (
                  <a
                    href={item.href}
                    className="mt-3 block text-muted hover:text-accent transition-colors whitespace-pre-line"
                  >
                    {item.text}
                  </a>
                ) : (
                  <p className="mt-3 text-muted whitespace-pre-line">{item.text}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-white/70 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <div className="relative w-28 h-10">
                <Image src="/images/logo-white.png" alt="RAMO" fill className="object-contain object-left" sizes="7rem" />
              </div>
              <p className="mt-1 text-sm">{SITE.address}</p>
            </div>
            <div className="flex gap-6 text-sm">
              <a href={SITE.social.vk} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">VK</a>
              <a href={SITE.social.telegram} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Telegram</a>
              <a href={SITE.social.whatsapp} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">WhatsApp</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-white/10 text-center text-xs">
            © {new Date().getFullYear()} RAMO. Все права защищены.
          </div>
        </div>
      </footer>
    </div>
  );
}
