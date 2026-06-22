import { REVIEWS, SITE } from "@/lib/data";
import { Star, Quote } from "lucide-react";

export default function Reviews() {
  return (
    <section className="py-20 sm:py-28 bg-background-alt">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">Что говорят гости</h2>
          <p className="mt-4 text-lg text-muted">
            Рейтинг {SITE.rating.value} на {SITE.rating.source} на основе {SITE.rating.reviews} отзывов
          </p>
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {REVIEWS.map((review, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-surface p-6 sm:p-8 shadow-sm border border-border-light flex flex-col"
            >
              <Quote className="w-8 h-8 text-accent/40" />
              <p className="mt-4 flex-1 text-foreground leading-relaxed">{review.text}</p>
              <div className="mt-6 flex items-center justify-between">
                <span className="font-medium text-foreground">{review.author}</span>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>
              </div>
              <p className="mt-1 text-xs text-muted/70">{review.source}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <a
            href={SITE.social.yandexMaps}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-accent hover:text-accent-dark font-medium transition-colors"
          >
            Читать все отзывы на Яндекс Картах
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
