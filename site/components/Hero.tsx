"use client";

import Image from "next/image";
import { SITE } from "@/lib/data";
import { MapPin, Star, Clock, UtensilsCrossed, CalendarCheck } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-20">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/interior-1.jpg"
          alt="Интерьер кафе RAMO"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-2xl text-white">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-4 py-2 text-sm font-medium">
            <Star className="w-4 h-4 fill-accent text-accent" />
            <span>
              {SITE.rating.value} на {SITE.rating.source} · {SITE.rating.reviews} отзывов
            </span>
          </div>

          <div className="mt-6 relative w-48 sm:w-64 lg:w-80 h-16 sm:h-20 lg:h-24">
            <Image
              src="/images/logo-white.png"
              alt="RAMO"
              fill
              priority
              className="object-contain object-left"
              sizes="(max-width: 640px) 12rem, (max-width: 1024px) 16rem, 20rem"
            />
          </div>
          <p className="mt-4 text-xl sm:text-2xl font-light text-white/90">
            {SITE.tagline}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4 text-white/80">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <span className="text-sm sm:text-base">{SITE.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span className="text-sm sm:text-base">
                Пн–Чт {SITE.workHours.monThu}, Пт–Сб {SITE.workHours.friSat}, Вс {SITE.workHours.sun}
              </span>
            </div>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <a
              href={SITE.social.yandexEats}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-3 rounded-full bg-accent px-8 py-4 text-base font-medium text-white shadow-lg hover:bg-accent-dark transition-all"
            >
              <UtensilsCrossed className="w-5 h-5" />
              Заказать доставку / самовывоз
            </a>
            <a
              href="#booking"
              className="inline-flex items-center justify-center gap-3 rounded-full border-2 border-white/40 bg-white/10 backdrop-blur-sm px-8 py-4 text-base font-medium text-white hover:bg-white/20 transition-all"
            >
              <CalendarCheck className="w-5 h-5" />
              Забронировать стол
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
