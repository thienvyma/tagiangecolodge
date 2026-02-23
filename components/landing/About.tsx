"use client";
import Image from "next/image";
import { useStore } from "@/lib/store";
import { useLang } from "@/lib/i18n/LanguageContext";

export default function About() {
  const about = useStore((s) => s.about);
  const { t } = useLang();
  const statsLabels = [t.about.statsLabels.guests, t.about.statsLabels.rooms, t.about.statsLabels.rating];

  return (
    <section id="about" className="py-24 bg-white">
      <div className="section-padding max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="relative h-[480px]">
          <div className="absolute top-0 left-0 w-3/4 h-3/4 rounded-2xl overflow-hidden shadow-xl">
            <Image src={about.image1} alt="Không gian nghỉ dưỡng" fill className="object-cover" />
          </div>
          <div className="absolute bottom-0 right-0 w-1/2 h-1/2 rounded-2xl overflow-hidden shadow-xl border-4 border-white">
            <Image src={about.image2} alt="Ẩm thực địa phương" fill className="object-cover" />
          </div>
          <div className="absolute top-1/2 right-4 -translate-y-1/2 bg-forest-600 text-white rounded-2xl p-5 shadow-lg text-center">
            <p className="text-3xl font-bold font-display">{about.badgeNumber}</p>
            <p className="text-xs mt-1 leading-tight">{t.about.yearsLabel}</p>
          </div>
        </div>
        <div>
          <span className="text-forest-600 text-sm font-semibold tracking-widest uppercase">{about.badge}</span>
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-stone-800 mt-3 mb-6 leading-tight">
            {about.heading} <br />
            <span className="text-forest-600 italic">{about.headingItalic}</span>
          </h2>
          <p className="text-stone-600 leading-relaxed mb-5">{about.body1}</p>
          <p className="text-stone-600 leading-relaxed mb-8">{about.body2}</p>
          <div className="grid grid-cols-3 gap-6 pt-6 border-t border-stone-100">
            {about.stats.map((s, i) => (
              <div key={i} className="text-center">
                <p className="text-2xl font-bold font-display text-forest-600">{s.num}</p>
                <p className="text-xs text-stone-500 mt-1">{statsLabels[i] ?? s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
