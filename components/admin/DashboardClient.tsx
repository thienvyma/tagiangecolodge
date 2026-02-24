"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { BedDouble, CalendarCheck, Star, TrendingUp, Clock, RefreshCw } from "lucide-react";
import { useStore, type Booking } from "@/lib/store";

export default function DashboardClient() {
  const { rooms } = useStore();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBookings() {
      try {
        const res = await fetch("/api/booking");
        if (!res.ok) throw new Error("Fetch failed");
        const data = await res.json();
        const mapped: Booking[] = (data || []).map((b: Record<string, unknown>) => ({
          id: b.id, guest: b.guest, email: b.email, phone: b.phone,
          roomId: b.room_id, roomName: b.room_name, checkin: b.checkin,
          checkout: b.checkout, guests: b.guests, message: b.message,
          total: Number(b.total), status: b.status as Booking["status"],
          createdAt: b.created_at,
        }));
        setBookings(mapped);
      } catch (err) {
        console.error("Lỗi tải bookings:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchBookings();
  }, []);

  const confirmed = bookings.filter((b) => b.status === "confirmed");
  const pending = bookings.filter((b) => b.status === "pending");
  const revenue = confirmed.reduce((s, b) => s + b.total, 0);

  const stats = [
    { label: "Tổng phòng", value: rooms.length.toString(), icon: BedDouble, color: "bg-forest-50 text-forest-600" },
    { label: "Đặt phòng tháng này", value: bookings.length.toString(), icon: CalendarCheck, color: "bg-blue-50 text-blue-600" },
    { label: "Chờ xác nhận", value: pending.length.toString(), icon: Star, color: "bg-amber-50 text-amber-600" },
    { label: "Doanh thu xác nhận", value: (revenue / 1_000_000).toFixed(1) + "M₫", icon: TrendingUp, color: "bg-emerald-50 text-emerald-600" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-stone-800">Dashboard</h1>
        <p className="text-stone-500 mt-1">Tổng quan hoạt động homestay</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-10">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${s.color}`}>
              <s.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-stone-800">{s.value}</p>
            <p className="text-stone-500 text-sm mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Rooms */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
          <h2 className="font-semibold text-stone-800">Danh sách phòng</h2>
          <Link href="/admin/rooms" className="text-sm text-forest-600 hover:underline">Quản lý</Link>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-stone-50 text-stone-500 text-xs uppercase">
            <tr>
              <th className="px-6 py-3 text-left">Phòng</th>
              <th className="px-6 py-3 text-left">Loại</th>
              <th className="px-6 py-3 text-left">Trạng thái</th>
              <th className="px-6 py-3 text-right">Giá/đêm</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {rooms.map((r) => (
              <tr key={r.id} className="hover:bg-stone-50 transition-colors">
                <td className="px-6 py-4 font-medium text-stone-800">{r.name}</td>
                <td className="px-6 py-4 text-stone-500">{r.type}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${r.available ? "bg-emerald-50 text-emerald-700" : "bg-stone-100 text-stone-500"}`}>
                    {r.available ? "Hoạt động" : "Tạm đóng"}
                  </span>
                </td>
                <td className="px-6 py-4 text-right font-semibold text-forest-700">
                  {r.price.toLocaleString("vi-VN")}₫
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Recent bookings */}
      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
          <h2 className="font-semibold text-stone-800">Đơn Đặt phòng gần đây</h2>
          <Link href="/admin/bookings" className="text-sm text-forest-600 hover:underline">Xem tất cả</Link>
        </div>
        {loading ? (
          <div className="px-6 py-10 text-center text-stone-400">
            <RefreshCw className="w-6 h-6 mx-auto mb-2 animate-spin text-stone-300" />
            <p className="text-sm">Đang tải...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="px-6 py-10 text-center text-stone-400">
            <Clock className="w-8 h-8 mx-auto mb-2 text-stone-300" />
            <p className="text-sm">Chưa có đơn Đặt phòng. Đơn từ landing page sẽ hiển thị ở đây.</p>
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {bookings.slice(0, 5).map((b) => (
              <div key={b.id} className="px-6 py-4 flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-stone-800 text-sm">{b.guest}</p>
                  <p className="text-stone-400 text-xs mt-0.5">{b.roomName} · {b.checkin} → {b.checkout}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-semibold text-stone-800 text-sm">{b.total.toLocaleString("vi-VN")}₫</p>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${b.status === "confirmed" ? "bg-emerald-50 text-emerald-700"
                    : b.status === "pending" ? "bg-amber-50 text-amber-700"
                      : "bg-red-50 text-red-500"
                    }`}>
                    {b.status === "confirmed" ? "Xác nhận" : b.status === "pending" ? "Chờ" : "Hủy"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
