"use client";
import { useState } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, Users, Maximize2, ToggleLeft, ToggleRight } from "lucide-react";
import { useStore, type Room } from "@/lib/store";
import ImageUploader from "@/components/admin/ImageUploader";

const EMPTY_FORM = {
  name: "", type: "Phòng đôi", price: 800000, capacity: 2, size: 25,
  image: "", amenities: "", description: "", available: true,
};

export default function RoomsAdmin() {
  const { rooms, addRoom, updateRoom, deleteRoom } = useStore();
  const [editing, setEditing] = useState<Room | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [imgTab, setImgTab] = useState<"upload" | "url">("upload");

  const openNew = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setImgTab("upload");
    setShowForm(true);
  };

  const openEdit = (room: Room) => {
    setEditing(room);
    setForm({
      name: room.name, type: room.type, price: room.price,
      capacity: room.capacity, size: room.size, image: room.image,
      amenities: room.amenities.join(", "), description: room.description,
      available: room.available,
    });
    setImgTab(room.image.startsWith("data:") ? "upload" : "url");
    setShowForm(true);
  };

  const handleSave = () => {
    const data = {
      ...form,
      amenities: form.amenities.split(",").map((a) => a.trim()).filter(Boolean),
      image: form.image || "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80",
    };
    if (editing) {
      updateRoom(editing.id, data);
    } else {
      addRoom(data);
    }
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-stone-800">Phòng nghỉ</h1>
          <p className="text-stone-500 mt-1">{rooms.length} phòng · {rooms.filter(r => r.available).length} đang hoạt động</p>
        </div>
        <button onClick={openNew} className="btn-primary text-sm">
          <Plus className="w-4 h-4" /> Thêm phòng
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <div key={room.id} className={`bg-white rounded-2xl overflow-hidden shadow-sm border transition-all ${room.available ? "border-stone-100" : "border-stone-200 opacity-60"}`}>
            <div className="relative h-44">
              <Image src={room.image} alt={room.name} fill className="object-cover" unoptimized={room.image.startsWith("data:")} />
              <span className="absolute top-3 left-3 bg-forest-600 text-white text-xs px-2.5 py-1 rounded-full">{room.type}</span>
              <span className={`absolute top-3 right-3 text-xs px-2.5 py-1 rounded-full font-medium ${room.available ? "bg-emerald-100 text-emerald-700" : "bg-stone-100 text-stone-500"}`}>
                {room.available ? "Hoạt động" : "Tạm đóng"}
              </span>
            </div>
            <div className="p-5">
              <h3 className="font-semibold text-stone-800 mb-1">{room.name}</h3>
              <div className="flex items-center gap-4 text-stone-400 text-xs mb-4">
                <span className="flex items-center gap-1"><Users className="w-3 h-3" />{room.capacity} khách</span>
                <span className="flex items-center gap-1"><Maximize2 className="w-3 h-3" />{room.size}m²</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-forest-700">{room.price.toLocaleString("vi-VN")}₫<span className="text-stone-400 font-normal text-xs">/đêm</span></span>
                <div className="flex gap-1">
                  <button
                    onClick={() => updateRoom(room.id, { available: !room.available })}
                    className="p-2 text-stone-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-colors"
                    title={room.available ? "Tạm đóng phòng" : "Mở phòng"}
                  >
                    {room.available ? <ToggleRight className="w-4 h-4 text-emerald-500" /> : <ToggleLeft className="w-4 h-4" />}
                  </button>
                  <button onClick={() => openEdit(room)} className="p-2 text-stone-400 hover:text-forest-600 hover:bg-forest-50 rounded-lg transition-colors" aria-label="Sửa">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => deleteRoom(room.id)} className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" aria-label="Xóa">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-lg my-8 shadow-2xl">
            <div className="flex items-center justify-between px-7 py-5 border-b border-stone-100">
              <h2 className="font-display text-xl font-bold text-stone-800">
                {editing ? "Chỉnh sửa phòng" : "Thêm phòng mới"}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-stone-400 hover:text-stone-600 text-2xl leading-none">×</button>
            </div>
            <div className="p-7 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">Tên phòng *</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full border border-stone-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-400"
                    placeholder="Phòng Đá Xám" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">Loại phòng</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full border border-stone-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-400">
                    {["Phòng đơn", "Phòng đôi", "Phòng gia đình", "Bungalow", "Suite"].map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">Giá/đêm (₫)</label>
                  <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: parseInt(e.target.value) })}
                    className="w-full border border-stone-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-400" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">Sức chứa (người)</label>
                  <input type="number" min={1} max={10} value={form.capacity} onChange={(e) => setForm({ ...form, capacity: parseInt(e.target.value) })}
                    className="w-full border border-stone-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-400" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">Diện tích (m²)</label>
                  <input type="number" value={form.size} onChange={(e) => setForm({ ...form, size: parseInt(e.target.value) })}
                    className="w-full border border-stone-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-400" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">Ảnh phòng</label>
                  <ImageUploader
                    value={form.image}
                    onImageChange={(src) => setForm({ ...form, image: src })}
                    tab={imgTab}
                    onTabChange={setImgTab}
                    height="h-44"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">Tiện nghi (cách nhau bởi dấu phẩy)</label>
                  <input value={form.amenities} onChange={(e) => setForm({ ...form, amenities: e.target.value })}
                    className="w-full border border-stone-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-400"
                    placeholder="Wifi, Điều hòa, Ban công view núi" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">Mô tả</label>
                  <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full border border-stone-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-400 resize-none" />
                </div>
                <div className="col-span-2 flex items-center gap-3">
                  <input type="checkbox" id="available" checked={form.available}
                    onChange={(e) => setForm({ ...form, available: e.target.checked })}
                    className="w-4 h-4 accent-forest-600" />
                  <label htmlFor="available" className="text-sm font-medium text-stone-700">Phòng đang hoạt động</label>
                </div>
              </div>
            </div>
            <div className="flex gap-3 px-7 py-5 border-t border-stone-100">
              <button onClick={handleSave} className="btn-primary flex-1 justify-center">
                {editing ? "Lưu thay đổi" : "Thêm phòng"}
              </button>
              <button onClick={() => setShowForm(false)}
                className="flex-1 border border-stone-200 text-stone-600 hover:bg-stone-50 font-medium px-4 py-2.5 rounded-lg text-sm transition-colors">
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
