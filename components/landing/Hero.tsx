"use client";
import { ChevronDown } from "lucide-react";
import { useStore } from "@/lib/store";
import type { Store } from "@/lib/store";
import { useLang } from "@/lib/i18n/LanguageContext";

export default function Hero() {
  const hero = useStore((s: Store) => s.hero);
  const { t } = useLang();

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('${hero.bgImage}')` }} />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
      <div className="relative z-10 text-center text-white section-padding max-w-4xl mx-auto">
        <span className="inline-block text-forest-300 text-sm font-medium tracking-widest uppercase mb-4">
          {t.hero.badge}
        </span>
        <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6">
          {hero.title} <br />
          <span className="italic text-forest-300">{hero.titleItalic}</span>
        </h1>
        <p className="text-lg sm:text-xl text-stone-200 max-w-2xl mx-auto mb-10 leading-relaxed">
          {hero.subtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="#rooms" className="btn-primary text-base px-8 py-4">{t.hero.cta1}</a>
          <a href="#about" className="border-2 border-white text-white hover:bg-white hover:text-forest-700 font-medium px-8 py-4 rounded-lg transition-all duration-200 inline-flex items-center gap-2">
            {t.hero.cta2}
          </a>
        </div>
      </div>
      <a href="#about" className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/70 hover:text-white transition-colors animate-bounce" aria-label="Scroll down">
        <ChevronDown className="w-8 h-8" />
      </a>
    </section>
  );
}
