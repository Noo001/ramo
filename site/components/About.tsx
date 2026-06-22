import Image from "next/image";
import { FEATURES } from "@/lib/data";

export default function About() {
  return (
    <section id="about" className="py-20 sm:py-28 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
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
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
              Место, где каждый визит — маленький праздник
            </h2>
            <p className="mt-6 text-lg text-muted leading-relaxed">
              RAMO — это уютное и стильное кафе в центре Воронежа. Современный интерьер с тёплыми
              акцентами, внимательный сервис и меню, собранное с любовью к деталям. Здесь приятно
              проводить время в компании друзей, наедине с собой или отмечать важные события.
            </p>

            <div className="mt-10 grid sm:grid-cols-2 gap-6">
              {FEATURES.map((feature) => (
                <div key={feature.title} className="rounded-xl bg-surface p-5 shadow-sm border border-border-light">
                  <h3 className="font-semibold text-foreground">{feature.title}</h3>
                  <p className="mt-2 text-sm text-muted">{feature.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
