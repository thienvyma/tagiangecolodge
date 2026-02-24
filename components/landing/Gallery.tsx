"use client";
import { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useStore } from "@/lib/store";
import { useLang } from "@/lib/i18n/LanguageContext";

const PAGE_SIZE = 6;

export default function Gallery() {
  const gallery = useStore((s) => s.gallery);
  const { t } = useLang();
  const [selected, setSelected] = useState<number | null>(null);
  const [page, setPage] = useState(0);

  // Category filter
  const categories = ["Tất cả", ...Array.from(new Set(gallery.map((g) => g.category)))];
  const [activeCat, setActiveCat] = useState("Tất cả");

  const filtered = activeCat === "Tất cả" ? gallery : gallery.filter((g) => g.category === activeCat);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const visible = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const openLightbox = (filteredIndex: number) => {
    const globalIndex = gallery.findIndex((g) => g.id === filtered[filteredIndex].id);
    setSelected(globalIndex);
  };

  return (
    <section id="gallery" className="py-24 bg-white">
      <div className="section-padding max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-forest-600 text-sm font-semibold tracking-widest uppercase">{t.gallery.sectionBadge}</span>
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-stone-800 mt-3">
            {t.gallery.sectionTitle} <span className="text-forest-600 italic">{t.gallery.sectionTitleItalic}</span>
          </h2>
        </div>

        {/* Category filter tabs */}
        {categories.length > 2 && (
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => { setActiveCat(cat); setPage(0); }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCat === cat
                    ? "bg-forest-600 text-white"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {visible.map((img, i) => (
            <button
              key={img.id}
              onClick={() => openLightbox(i)}
              className="relative overflow-hidden rounded-xl cursor-pointer group aspect-[4/3]"
              aria-label={`Xem ảnh: ${img.alt}`}
            >
              <Image src={img.src} alt={img.alt} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              {img.category && img.category !== "Tổng hợp" && (
                <span className="absolute bottom-3 left-3 bg-white/90 text-stone-700 text-xs font-medium px-2.5 py-1 rounded-full backdrop-blur-sm">
                  {img.category}
                </span>
              )}
            </button>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}
              className="p-2 rounded-lg border border-stone-200 text-stone-500 hover:bg-stone-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed" aria-label="Trang trước">
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i} onClick={() => setPage(i)}
                className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${page === i ? "bg-forest-600 text-white" : "border border-stone-200 text-stone-600 hover:bg-stone-50"}`}>
                {i + 1}
              </button>
            ))}
            <button onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1}
              className="p-2 rounded-lg border border-stone-200 text-stone-500 hover:bg-stone-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed" aria-label="Trang sau">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {selected !== null && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <button className="absolute top-5 right-5 text-white hover:text-stone-300 transition-colors z-10" onClick={() => setSelected(null)} aria-label="Đóng">
            <X className="w-8 h-8" />
          </button>
          {/* Prev */}
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors z-10"
            onClick={(e) => { e.stopPropagation(); setSelected((s) => (s! > 0 ? s! - 1 : gallery.length - 1)); }}
            aria-label="Ảnh trước"
          >
            <ChevronLeft className="w-10 h-10" />
          </button>
          {/* Next */}
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors z-10"
            onClick={(e) => { e.stopPropagation(); setSelected((s) => (s! < gallery.length - 1 ? s! + 1 : 0)); }}
            aria-label="Ảnh tiếp"
          >
            <ChevronRight className="w-10 h-10" />
          </button>
          <div className="relative w-full max-w-4xl h-[80vh]" onClick={(e) => e.stopPropagation()}>
            <Image src={gallery[selected].src} alt={gallery[selected].alt} fill className="object-contain" />
          </div>
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/60 text-sm">
            {selected + 1} / {gallery.length}
          </div>
        </div>
      )}
    </section>
  );
}
