"use client";
import { useStore } from "@/lib/store";
import { useLang } from "@/lib/i18n/LanguageContext";

export default function Amenities() {
  const amenities = useStore((s) => s.amenities);
  const { t } = useLang();

  return (
    <section id="amenities" className="py-24 bg-forest-700 text-white">
      <div className="section-padding max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-forest-300 text-sm font-semibold tracking-widest uppercase">{t.amenities.sectionBadge}</span>
          <h2 className="font-display text-4xl lg:text-5xl font-bold mt-3">{t.amenities.sectionTitle} <span className="italic text-forest-300">{t.amenities.sectionTitleItalic}</span></h2>
          <p className="text-forest-200 mt-4 max-w-xl mx-auto">
            Từ ẩm thực đến phiêu lưu – chúng tôi chuẩn bị mọi thứ để chuyến đi của bạn thật đáng nhớ.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {amenities.map((item) => (
            <div key={item.id} className="bg-forest-600/50 hover:bg-forest-600 border border-forest-500/30 rounded-2xl p-7 transition-colors duration-200">
              <span className="text-4xl mb-4 block">{item.icon}</span>
              <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-forest-200 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
