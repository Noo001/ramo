"use client";

import { useState } from "react";
import Image from "next/image";
import { NAV, SITE } from "@/lib/data";
import { Phone, Menu, X } from "lucide-react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-18 items-center justify-between">
          <a href="#" className="flex items-center gap-2">
            <span className="font-serif text-2xl font-bold tracking-tight">{SITE.name}</span>
          </a>

          <nav className="hidden md:flex items-center gap-8">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-muted hover:text-accent transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <a
              href={`tel:${SITE.phone}`}
              className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-accent transition-colors"
            >
              <Phone className="w-4 h-4" />
              {SITE.phoneDisplay}
            </a>
            <a
              href={SITE.social.yandexEats}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent-dark transition-colors"
            >
              Заказать
            </a>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-foreground"
            aria-label="Открыть меню"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden border-t border-border/60 bg-background">
          <nav className="flex flex-col px-4 py-4 gap-2">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="py-2 text-base font-medium text-foreground hover:text-accent"
              >
                {item.label}
              </a>
            ))}
            <a
              href={`tel:${SITE.phone}`}
              className="flex items-center gap-2 py-3 text-base font-medium text-foreground"
            >
              <Phone className="w-4 h-4" />
              {SITE.phoneDisplay}
            </a>
            <a
              href={SITE.social.yandexEats}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 rounded-full bg-accent px-5 py-3 text-center text-base font-medium text-white hover:bg-accent-dark"
            >
              Заказать на Яндекс Еде
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
