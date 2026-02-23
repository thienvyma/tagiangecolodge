"use client";
import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { useStore } from "@/lib/store";
import { useLang } from "@/lib/i18n/LanguageContext";

export default function Gallery() {
  const gallery = useStore((s) => s.gallery);
  const [selected, setSelected] = useState<number | null>(null);
  const { t } = useLang();

  return (
    <section id="gallery" className="py-24 bg-white">
      <div className="section-padding max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-forest-600 text-sm font-semibold tracking-widest uppercase">{t.gallery.sectionBadge}</span>
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-stone-800 mt-3">
            {t.gallery.sectionTitle} <span className="text-forest-600 italic">{t.gallery.sectionTitleItalic}</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {gallery.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setSelected(i)}
              className={`relative overflow-hidden rounded-xl cursor-pointer group ${i === 0 ? "row-span-2" : ""}`}
              style={{ height: i === 0 ? "480px" : "224px" }}
              aria-label={`Xem ảnh: ${img.alt}`}
            >
              <Image src={img.src} alt={img.alt} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
            </button>
          ))}
        </div>
      </div>

      {selected !== null && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <button className="absolute top-5 right-5 text-white hover:text-stone-300 transition-colors" onClick={() => setSelected(null)} aria-label="Đóng">
            <X className="w-8 h-8" />
          </button>
          <div className="relative w-full max-w-4xl h-[80vh]" onClick={(e) => e.stopPropagation()}>
            <Image src={gallery[selected].src} alt={gallery[selected].alt} fill className="object-contain" />
          </div>
        </div>
      )}
    </section>
  );
}
