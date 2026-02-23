"use client";
import Image from "next/image";
import { Users, Maximize2, Wifi } from "lucide-react";
import { useStore } from "@/lib/store";
import { useLang } from "@/lib/i18n/LanguageContext";

export default function Rooms() {
  const rooms = useStore((s) => s.rooms);
  const { t } = useLang();

  return (
    <section id="rooms" className="py-24 bg-cream">
      <div className="section-padding max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-forest-600 text-sm font-semibold tracking-widest uppercase">{t.rooms.sectionBadge}</span>
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-stone-800 mt-3">
            {t.rooms.sectionTitle} <span className="text-forest-600 italic">{t.rooms.sectionTitleItalic}</span>
          </h2>
          <p className="text-stone-500 mt-4 max-w-xl mx-auto">
            Mỗi phòng là một câu chuyện riêng – được thiết kế để bạn cảm nhận trọn vẹn vẻ đẹp của Hà Giang.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.filter((r) => r.available).map((room) => (
            <div key={room.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 group">
              <div className="relative h-56 overflow-hidden">
                <Image src={room.image} alt={room.name} fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500" />
                <span className="absolute top-4 left-4 bg-forest-600 text-white text-xs font-medium px-3 py-1 rounded-full">
                  {room.type}
                </span>
              </div>
              <div className="p-6">
                <h3 className="font-display text-xl font-bold text-stone-800 mb-2">{room.name}</h3>
                <p className="text-stone-500 text-sm leading-relaxed mb-4">{room.description}</p>
                <div className="flex items-center gap-4 text-stone-500 text-sm mb-5">
                  <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> {room.capacity} {t.rooms.guests}</span>
                  <span className="flex items-center gap-1.5"><Maximize2 className="w-4 h-4" /> {room.size}{t.rooms.sqm}</span>
                  <span className="flex items-center gap-1.5"><Wifi className="w-4 h-4" /> Wifi</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-5">
                  {room.amenities.slice(0, 3).map((a) => (
                    <span key={a} className="text-xs bg-forest-50 text-forest-700 px-2.5 py-1 rounded-full">{a}</span>
                  ))}
                  {room.amenities.length > 3 && (
                    <span className="text-xs bg-stone-100 text-stone-500 px-2.5 py-1 rounded-full">
                      +{room.amenities.length - 3}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                  <div>
                    <span className="text-2xl font-bold text-forest-700">
                      {room.price.toLocaleString("vi-VN")}₫
                    </span>
                    <span className="text-stone-400 text-sm">{t.rooms.perNight}</span>
                  </div>
                  <a href="#contact" className="btn-primary text-sm px-4 py-2">{t.rooms.bookButton}</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
