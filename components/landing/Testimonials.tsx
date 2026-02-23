"use client";
import Image from "next/image";
import { Star } from "lucide-react";
import { useStore } from "@/lib/store";
import { useLang } from "@/lib/i18n/LanguageContext";

export default function Testimonials() {
  const testimonials = useStore((s) => s.testimonials);
  const { t } = useLang();
  return (
    <section className="py-24 bg-earth-50">
      <div className="section-padding max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-forest-600 text-sm font-semibold tracking-widest uppercase">{t.testimonials.sectionBadge}</span>
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-stone-800 mt-3">
            {t.testimonials.sectionTitle} <span className="text-forest-600 italic">{t.testimonials.sectionTitleItalic}</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
              {/* Stars */}
              <div className="flex gap-1 mb-5">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-stone-600 leading-relaxed mb-6 italic">"{t.text}"</p>
              <div className="flex items-center gap-3 pt-5 border-t border-stone-100">
                <div className="relative w-11 h-11 rounded-full overflow-hidden shrink-0">
                  <Image src={t.avatar} alt={t.name} fill className="object-cover" />
                </div>
                <div>
                  <p className="font-semibold text-stone-800 text-sm">{t.name}</p>
                  <p className="text-stone-400 text-xs">{t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
