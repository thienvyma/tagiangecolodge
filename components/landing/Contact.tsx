"use client";
import { useState } from "react";
import { Phone, Mail, MapPin, Send } from "lucide-react";
import { useStore } from "@/lib/store";
import type { Room } from "@/lib/store";
import { useLang } from "@/lib/i18n/LanguageContext";

export default function Contact() {
  const { rooms, addBooking, settings } = useStore();
  const { t } = useLang();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    roomId: "",
    checkin: "",
    checkout: "",
    guests: "2",
    message: "",
  });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.checkin || !form.checkout) {
      setError(t.contact.errors.selectDates);
      return;
    }
    if (new Date(form.checkout) <= new Date(form.checkin)) {
      setError(t.contact.errors.checkoutAfterCheckin);
      return;
    }

    const selectedRoom = form.roomId
      ? rooms.find((r: Room) => r.id === parseInt(form.roomId))
      : rooms[0];

    if (!selectedRoom) {
      setError(t.contact.errors.selectRoom);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guest: form.name,
          email: form.email,
          phone: form.phone,
          roomId: selectedRoom.id,
          roomName: selectedRoom.name,
          checkin: form.checkin,
          checkout: form.checkout,
          guests: parseInt(form.guests),
          message: form.message,
          roomPrice: selectedRoom.price,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? t.contact.errors.serverError);
        return;
      }

      addBooking({
        guest: form.name,
        email: form.email,
        phone: form.phone,
        roomId: selectedRoom.id,
        roomName: selectedRoom.name,
        checkin: form.checkin,
        checkout: form.checkout,
        guests: parseInt(form.guests),
        message: form.message,
      });

      setSent(true);
    } catch {
      setError(t.contact.errors.networkError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-cream">
      <div className="section-padding max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Info */}
        <div>
          <span className="text-forest-600 text-sm font-semibold tracking-widest uppercase">{t.contact.sectionBadge}</span>
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-stone-800 mt-3 mb-6">
            {t.contact.sectionTitle} <br />
            <span className="text-forest-600 italic">{t.contact.sectionTitleItalic}</span>
          </h2>
          <p className="text-stone-500 leading-relaxed mb-10">{t.contact.subtitle}</p>
          <ul className="space-y-5">
            <li className="flex items-start gap-4">
              <div className="w-10 h-10 bg-forest-100 rounded-xl flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-forest-600" />
              </div>
              <div>
                <p className="font-medium text-stone-700">{t.contact.address}</p>
                <p className="text-stone-500 text-sm mt-0.5">{settings.address}</p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <div className="w-10 h-10 bg-forest-100 rounded-xl flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5 text-forest-600" />
              </div>
              <div>
                <p className="font-medium text-stone-700">{t.contact.phone}</p>
                <a href={`tel:${settings.phone}`} className="text-forest-600 text-sm mt-0.5 hover:underline">{settings.phone}</a>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <div className="w-10 h-10 bg-forest-100 rounded-xl flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-forest-600" />
              </div>
              <div>
                <p className="font-medium text-stone-700">{t.contact.email}</p>
                <a href={`mailto:${settings.email}`} className="text-forest-600 text-sm mt-0.5 hover:underline">{settings.email}</a>
              </div>
            </li>
          </ul>
          {settings.mapUrl && (
            <div className="mt-10 rounded-2xl overflow-hidden shadow-sm border border-stone-100 h-64 relative">
              <iframe
                src={settings.mapUrl.includes("<iframe") ? settings.mapUrl.match(/src="([^"]+)"/)?.[1] : settings.mapUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0"
              />
            </div>
          )}
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          {sent ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-10">
              <div className="text-5xl mb-4">🌿</div>
              <h3 className="font-display text-2xl font-bold text-stone-800 mb-2">{t.contact.success.title}</h3>
              <p className="text-stone-500 mb-6">{t.contact.success.message}</p>
              <button
                onClick={() => { setSent(false); setForm({ name: "", email: "", phone: "", roomId: "", checkin: "", checkout: "", guests: "2", message: "" }); }}
                className="btn-outline text-sm"
              >
                {t.contact.success.again}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-lg">{error}</div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">{t.contact.form.name} *</label>
                  <input required type="text" value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full border border-stone-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-400"
                    placeholder={t.contact.form.namePlaceholder} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">{t.contact.form.phone} *</label>
                  <input required type="tel" value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full border border-stone-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-400"
                    placeholder={t.contact.form.phonePlaceholder} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">{t.contact.form.email}</label>
                <input type="email" value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full border border-stone-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-400"
                  placeholder={t.contact.form.emailPlaceholder} />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">{t.contact.form.room} *</label>
                <select required value={form.roomId}
                  onChange={(e) => setForm({ ...form, roomId: e.target.value })}
                  className="w-full border border-stone-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-400">
                  <option value="">{t.contact.form.roomDefault}</option>
                  {rooms.filter((r: Room) => r.available).map((r: Room) => (
                    <option key={r.id} value={r.id}>
                      {r.name} – {r.price.toLocaleString("vi-VN")}₫{t.rooms.perNight}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">{t.contact.form.checkin} *</label>
                  <input required type="date" value={form.checkin}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setForm({ ...form, checkin: e.target.value })}
                    className="w-full border border-stone-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-400" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">{t.contact.form.checkout} *</label>
                  <input required type="date" value={form.checkout}
                    min={form.checkin || new Date().toISOString().split("T")[0]}
                    onChange={(e) => setForm({ ...form, checkout: e.target.value })}
                    className="w-full border border-stone-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">{t.contact.form.guests}</label>
                <select value={form.guests} onChange={(e) => setForm({ ...form, guests: e.target.value })}
                  className="w-full border border-stone-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-400">
                  {[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n} {t.contact.form.guestUnit}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">{t.contact.form.note}</label>
                <textarea rows={3} value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full border border-stone-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-400 resize-none"
                  placeholder={t.contact.form.notePlaceholder} />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    {t.contact.form.submitting}
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    {t.contact.form.submit}
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
