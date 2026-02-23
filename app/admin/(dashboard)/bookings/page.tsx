"use client";
import { useState } from "react";
import { Search, CheckCircle, XCircle, Trash2, Clock } from "lucide-react";
import clsx from "clsx";
import { useStore, type Booking } from "@/lib/store";

const STATUS_STYLES: Record<Booking["status"], string> = {
  confirmed: "bg-emerald-50 text-emerald-700",
  pending: "bg-amber-50 text-amber-700",
  cancelled: "bg-red-50 text-red-500",
};
const STATUS_LABELS: Record<Booking["status"], string> = {
  confirmed: "Đã xác nhận",
  pending: "Chờ xác nhận",
  cancelled: "Đã hủy",
};

export default function bookingsAdmin() {
  const { bookings, updateBookingStatus, deleteBooking } = useStore();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Booking["status"] | "all">("all");

  const filtered = bookings.filter((b) => {
    const matchSearch =
      b.guest.toLowerCase().includes(search.toLowerCase()) ||
      b.roomName.toLowerCase().includes(search.toLowerCase()) ||
      b.id.toLowerCase().includes(search.toLowerCase()) ||
      b.phone.includes(search);
    const matchFilter = filter === "all" || b.status === filter;
    return matchSearch && matchFilter;
  });

  const stats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === "pending").length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    revenue: bookings.filter((b) => b.status === "confirmed").reduce((s, b) => s + b.total, 0),
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-stone-800">Đặt phòng</h1>
        <p className="text-stone-500 mt-1">{bookings.length} đơn tổng cộng</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Tổng đơn", value: stats.total, color: "text-stone-800" },
          { label: "Chờ xác nhận", value: stats.pending, color: "text-amber-600" },
          { label: "Đã xác nhận", value: stats.confirmed, color: "text-emerald-600" },
          { label: "Doanh thu", value: stats.revenue.toLocaleString("vi-VN") + "₫", color: "text-forest-700" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-stone-500 text-sm mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-48 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên, phòng, SĐT..."
            className="w-full pl-10 pr-4 py-2.5 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-400" />
        </div>
        <div className="flex gap-2">
          {(["all", "pending", "confirmed", "cancelled"] as const).map((s) => (
            <button key={s} onClick={() => setFilter(s)}
              className={clsx("px-4 py-2.5 rounded-lg text-sm font-medium transition-colors border",
                filter === s ? "bg-forest-600 text-white border-forest-600" : "bg-white text-stone-600 border-stone-200 hover:bg-stone-50"
              )}>
              {s === "all" ? "Tất cả" : STATUS_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-16 text-center">
          <Clock className="w-10 h-10 text-stone-300 mx-auto mb-3" />
          <p className="text-stone-500">
            {bookings.length === 0 ? "Chưa có đơn Đặt phòng nào. Đơn từ landing page sẽ hiển thị ở đây." : "Không tìm thấy đơn phù hợp."}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-stone-50 text-stone-500 text-xs uppercase">
                <tr>
                  <th className="px-5 py-3 text-left">Mã đơn</th>
                  <th className="px-5 py-3 text-left">Khách</th>
                  <th className="px-5 py-3 text-left">Phòng</th>
                  <th className="px-5 py-3 text-left">Check-in</th>
                  <th className="px-5 py-3 text-left">Check-out</th>
                  <th className="px-5 py-3 text-right">Tổng tiền</th>
                  <th className="px-5 py-3 text-center">Trạng thái</th>
                  <th className="px-5 py-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filtered.map((b) => (
                  <tr key={b.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-5 py-4 font-mono text-xs text-stone-400">{b.id}</td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-stone-800">{b.guest}</p>
                      <p className="text-xs text-stone-400">{b.phone}</p>
                    </td>
                    <td className="px-5 py-4 text-stone-600">{b.roomName}</td>
                    <td className="px-5 py-4 text-stone-500">{b.checkin}</td>
                    <td className="px-5 py-4 text-stone-500">{b.checkout}</td>
                    <td className="px-5 py-4 text-right font-semibold text-stone-800">
                      {b.total.toLocaleString("vi-VN")}₫
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className={clsx("text-xs font-medium px-2.5 py-1 rounded-full", STATUS_STYLES[b.status])}>
                        {STATUS_LABELS[b.status]}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        {b.status === "pending" && (
                          <>
                            <button onClick={() => updateBookingStatus(b.id, "confirmed")}
                              className="p-1.5 text-stone-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                              title="Xác nhận">
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button onClick={() => updateBookingStatus(b.id, "cancelled")}
                              className="p-1.5 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              title="Hủy">
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {b.status === "cancelled" && (
                          <button onClick={() => updateBookingStatus(b.id, "confirmed")}
                            className="p-1.5 text-stone-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Khôi phục">
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button onClick={() => deleteBooking(b.id)}
                          className="p-1.5 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Xóa">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
                }
              </tbody >
            </table >
          </div >
        </div >
      )}
    </div >
  );
}
