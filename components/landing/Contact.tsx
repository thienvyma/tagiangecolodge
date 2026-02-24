"use client";
import { useState, useEffect, useCallback } from "react";
import { Phone, Mail, MapPin, Send, AlertCircle } from "lucide-react";
import { useStore } from "@/lib/store";
import type { Room } from "@/lib/store";
import { useLang } from "@/lib/i18n/LanguageContext";
import BookingCalendar from "./BookingCalendar";

type BookedRange = { checkin: string; checkout: string };

function hasOverlap(checkin: string, checkout: string, ranges: BookedRange[]): boolean {
  return ranges.some((r) => checkin < r.checkout && checkout > r.checkin);
}

export default function Contact() {
  const { rooms, settings } = useStore();
  const { t } = useLang();
  const [form, setForm] = useState({
    name: "", email: "", phone: "", roomId: "", checkin: "", checkout: "", guests: "2", message: "",
  });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [bookedRanges, setBookedRanges] = useState<BookedRange[]>([]);
  const [loadingAvail, setLoadingAvail] = useState(false);

  const fetchAvailability = useCallback(async (roomId: string) => {
    if (!roomId) { setBookedRanges([]); return; }
    setLoadingAvail(true);
    try {
      const res = await fetch(`/api/booking/availability?roomId=${roomId}`);
      if (res.ok) {
        const data = await res.json();
        setBookedRanges(Array.isArray(data) ? data : []);
      }
    } catch { /* ignore */ }
    finally { setLoadingAvail(false); }
  }, []);

  useEffect(() => {
    if (form.roomId) fetchAvailability(form.roomId);
  }, [form.roomId, fetchAvailability]);

  const overlapWarning = form.checkin && form.checkout && bookedRanges.length > 0 && hasOverlap(form.checkin, form.checkout, bookedRanges)
    ? "Ngày bạn chọn trùng với lịch đã đặt. Vui lòng chọn ngày khác." : "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.checkin || !form.checkout) { setError(t.contact.errors.selectDates); return; }
    if (new Date(form.checkout) <= new Date(form.checkin)) { setError(t.contact.errors.checkoutAfterCheckin); return; }
    if (overlapWarning) { setError(overlapWarning); return; }

    const selectedRoom = form.roomId ? rooms.find((r: Room) => r.id === parseInt(form.roomId)) : rooms[0];
    if (!selectedRoom) { setError(t.contact.errors.selectRoom); return; }

    setLoading(true);
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guest: form.name, email: form.email, phone: form.phone,
          roomId: selectedRoom.id, roomName: selectedRoom.name,
          checkin: form.checkin, checkout: form.checkout,
          guests: parseInt(form.guests), message: form.message, roomPrice: selectedRoom.price,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? t.contact.errors.serverError);
        return;
      }
      setSent(true);
    } catch { setError(t.contact.errors.networkError); }
    finally { setLoading(false); }
  };

  // Calculate nights & price for display
  const selectedRoom = form.roomId ? rooms.find((r: Room) => r.id === parseInt(form.roomId)) : null;
  const nights = form.checkin && form.checkout
    ? Math.max(1, Math.round((new Date(form.checkout).getTime() - new Date(form.checkin).getTime()) / 86400000))
    : 0;
  const estimatedTotal = selectedRoom && nights > 0 ? selectedRoom.price * nights : 0;

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
              <div className="w-10 h-10 bg-forest-100 rounded-xl flex items-center justify-center shrink-0"><MapPin className="w-5 h-5 text-forest-600" /></div>
              <div><p className="font-medium text-stone-700">{t.contact.address}</p><p className="text-stone-500 text-sm mt-0.5">{settings.address}</p></div>
            </li>
            <li className="flex items-start gap-4">
              <div className="w-10 h-10 bg-forest-100 rounded-xl flex items-center justify-center shrink-0"><Phone className="w-5 h-5 text-forest-600" /></div>
              <div><p className="font-medium text-stone-700">{t.contact.phone}</p><a href={`tel:${settings.phone}`} className="text-forest-600 text-sm mt-0.5 hover:underline">{settings.phone}</a></div>
            </li>
            <li className="flex items-start gap-4">
              <div className="w-10 h-10 bg-forest-100 rounded-xl flex items-center justify-center shrink-0"><Mail className="w-5 h-5 text-forest-600" /></div>
              <div><p className="font-medium text-stone-700">{t.contact.email}</p><a href={`mailto:${settings.email}`} className="text-forest-600 text-sm mt-0.5 hover:underline">{settings.email}</a></div>
            </li>
          </ul>
          {settings.mapUrl && (
            <div className="mt-10 rounded-2xl overflow-hidden shadow-sm border border-stone-100 h-64 relative">
              <iframe src={settings.mapUrl.includes("<iframe") ? settings.mapUrl.match(/src="([^"]+)"/)?.[1] : settings.mapUrl}
                width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="absolute inset-0" />
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
              <button onClick={() => { setSent(false); setForm({ name: "", email: "", phone: "", roomId: "", checkin: "", checkout: "", guests: "2", message: "" }); setBookedRanges([]); }}
                className="btn-outline text-sm">{t.contact.success.again}</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-lg">{error}</div>}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">{t.contact.form.name} *</label>
                  <input required type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full border border-stone-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-400" placeholder={t.contact.form.namePlaceholder} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">{t.contact.form.phone} *</label>
                  <input required type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full border border-stone-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-400" placeholder={t.contact.form.phonePlaceholder} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">{t.contact.form.email}</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full border border-stone-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-400" placeholder={t.contact.form.emailPlaceholder} />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">{t.contact.form.room} *</label>
                <select required value={form.roomId} onChange={(e) => setForm({ ...form, roomId: e.target.value, checkin: "", checkout: "" })}
                  className="w-full border border-stone-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-400">
                  <option value="">{t.contact.form.roomDefault}</option>
                  {rooms.filter((r: Room) => r.available).map((r: Room) => (
                    <option key={r.id} value={r.id}>{r.name} – {r.price.toLocaleString("vi-VN")}₫{t.rooms.perNight}</option>
                  ))}
                </select>
              </div>

              {/* Calendar picker */}
              {form.roomId && (
                <div className="border border-stone-100 rounded-xl p-4 bg-stone-50/50">
                  <label className="block text-sm font-medium text-stone-700 mb-3">Chọn ngày nhận / trả phòng *</label>
                  {loadingAvail ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="w-6 h-6 border-2 border-stone-200 border-t-forest-600 rounded-full animate-spin" />
                      <span className="ml-2 text-sm text-stone-400">Đang tải lịch...</span>
                    </div>
                  ) : (
                    <BookingCalendar
                      bookedRanges={bookedRanges}
                      checkin={form.checkin}
                      checkout={form.checkout}
                      onSelect={(ci, co) => setForm({ ...form, checkin: ci, checkout: co })}
                    />
                  )}

                  {/* Selected dates summary */}
                  {(form.checkin || form.checkout) && (
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                      {form.checkin && (
                        <span className="bg-forest-50 text-forest-700 px-3 py-1.5 rounded-lg border border-forest-100">
                          Nhận: <span className="font-semibold">{new Date(form.checkin + "T00:00").toLocaleDateString("vi-VN")}</span>
                        </span>
                      )}
                      {form.checkout && (
                        <span className="bg-forest-50 text-forest-700 px-3 py-1.5 rounded-lg border border-forest-100">
                          Trả: <span className="font-semibold">{new Date(form.checkout + "T00:00").toLocaleDateString("vi-VN")}</span>
                        </span>
                      )}
                      {nights > 0 && selectedRoom && (
                        <span className="bg-amber-50 text-amber-700 px-3 py-1.5 rounded-lg border border-amber-100 font-semibold">
                          {nights} đêm · {estimatedTotal.toLocaleString("vi-VN")}₫
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )}

              {overlapWarning && (
                <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" /> {overlapWarning}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">{t.contact.form.guests}</label>
                <select value={form.guests} onChange={(e) => setForm({ ...form, guests: e.target.value })}
                  className="w-full border border-stone-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-400">
                  {[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n} {t.contact.form.guestUnit}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">{t.contact.form.note}</label>
                <textarea rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full border border-stone-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-400 resize-none" placeholder={t.contact.form.notePlaceholder} />
              </div>

              <button type="submit" disabled={loading || !!overlapWarning || !form.checkin || !form.checkout}
                className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed">
                {loading ? (
                  <><svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg> {t.contact.form.submitting}</>
                ) : (
                  <><Send className="w-4 h-4" /> {t.contact.form.submit}</>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
