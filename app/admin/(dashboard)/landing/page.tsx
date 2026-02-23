"use client";
import { useState } from "react";
import { Plus, Trash2, Pencil, Check, X, Save, MessageCircle } from "lucide-react";
import { useStore, type AmenityItem, type TestimonialItem, type FloatingCTA, type FloatingCTAButton } from "@/lib/store";
import { BtnIcon } from "@/components/landing/FloatingCTA";
import ImageUploader from "@/components/admin/ImageUploader";

type Tab = "hero" | "about" | "amenities" | "testimonials" | "contact" | "floating";

export default function LandingAdmin() {
  const [tab, setTab] = useState<Tab>("hero");

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-stone-800">Tùy chỉnh Landing</h1>
        <p className="text-stone-500 mt-1">Chỉnh sửa nội dung hiển thị trực tiếp trên trang chủ</p>
      </div>

      <div className="flex gap-2 mb-8 border-b border-stone-200 overflow-x-auto">
        {(["hero", "about", "amenities", "testimonials", "contact", "floating"] as Tab[]).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap ${tab === t ? "border-forest-600 text-forest-700" : "border-transparent text-stone-500 hover:text-stone-700"
              }`}>
            {t === "hero" ? "Hero" : t === "about" ? "Về chúng tôi" : t === "amenities" ? "Tiện ích" : t === "testimonials" ? "Đánh giá" : t === "contact" ? "Liên hệ" : "Nút nổi"}
          </button>
        ))}
      </div>

      {tab === "hero" && <HeroTab />}
      {tab === "about" && <AboutTab />}
      {tab === "amenities" && <AmenitiesTab />}
      {tab === "testimonials" && <TestimonialsTab />}
      {tab === "contact" && <ContactTab />}
      {tab === "floating" && <FloatingTab />}
    </div>
  );
}

// ─── Hero Tab ─────────────────────────────────────────────────────────────────
function HeroTab() {
  const { hero, updateHero } = useStore();
  const [form, setForm] = useState({ ...hero });
  const [saved, setSaved] = useState(false);
  const [imgTab, setImgTab] = useState<"upload" | "url">("upload");
  const handleSave = () => { updateHero(form); setSaved(true); setTimeout(() => setSaved(false), 2000); };
  return (
    <div className="max-w-2xl space-y-5">
      <Field label="Badge"><input value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} className="input" /></Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Tiêu đề chính"><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input" /></Field>
        <Field label="Tiêu đề in nghiêng"><input value={form.titleItalic} onChange={(e) => setForm({ ...form, titleItalic: e.target.value })} className="input" /></Field>
      </div>
      <Field label="Mô tả ngắn"><textarea rows={3} value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} className="input resize-none" /></Field>
      <Field label="Ảnh nền">
        <ImageUploader
          value={form.bgImage}
          onImageChange={(src) => setForm({ ...form, bgImage: src })}
          tab={imgTab}
          onTabChange={setImgTab}
          height="h-44"
        />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Nút CTA chính"><input value={form.ctaPrimary} onChange={(e) => setForm({ ...form, ctaPrimary: e.target.value })} className="input" /></Field>
        <Field label="Nút CTA phụ"><input value={form.ctaSecondary} onChange={(e) => setForm({ ...form, ctaSecondary: e.target.value })} className="input" /></Field>
      </div>
      <SaveBtn onSave={handleSave} saved={saved} />
    </div>
  );
}

// ─── About Tab ────────────────────────────────────────────────────────────────
function AboutTab() {
  const { about, updateAbout } = useStore();
  const [form, setForm] = useState({ ...about, stats: [...about.stats] });
  const [saved, setSaved] = useState(false);
  const handleSave = () => { updateAbout(form); setSaved(true); setTimeout(() => setSaved(false), 2000); };
  return (
    <div className="max-w-2xl space-y-5">
      <Field label="Badge"><input value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} className="input" /></Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Tiêu đề"><input value={form.heading} onChange={(e) => setForm({ ...form, heading: e.target.value })} className="input" /></Field>
        <Field label="Tiêu đề in nghiêng"><input value={form.headingItalic} onChange={(e) => setForm({ ...form, headingItalic: e.target.value })} className="input" /></Field>
      </div>
      <Field label="Đoạn văn 1"><textarea rows={3} value={form.body1} onChange={(e) => setForm({ ...form, body1: e.target.value })} className="input resize-none" /></Field>
      <Field label="Đoạn văn 2"><textarea rows={3} value={form.body2} onChange={(e) => setForm({ ...form, body2: e.target.value })} className="input resize-none" /></Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="URL ảnh 1"><input value={form.image1} onChange={(e) => setForm({ ...form, image1: e.target.value })} className="input" placeholder="https://..." /></Field>
        <Field label="URL ảnh 2"><input value={form.image2} onChange={(e) => setForm({ ...form, image2: e.target.value })} className="input" placeholder="https://..." /></Field>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Badge số (vd: 5+)"><input value={form.badgeNumber} onChange={(e) => setForm({ ...form, badgeNumber: e.target.value })} className="input" /></Field>
        <Field label="Badge nhãn"><input value={form.badgeLabel} onChange={(e) => setForm({ ...form, badgeLabel: e.target.value })} className="input" /></Field>
      </div>
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-2">Thống kê (3 mục)</label>
        <div className="space-y-2">
          {form.stats.map((stat: { num: string; label: string }, i: number) => (
            <div key={i} className="grid grid-cols-2 gap-3">
              <input value={stat.num} onChange={(e) => { const s = [...form.stats]; s[i] = { ...s[i], num: e.target.value }; setForm({ ...form, stats: s }); }} className="input" placeholder="500+" />
              <input value={stat.label} onChange={(e) => { const s = [...form.stats]; s[i] = { ...s[i], label: e.target.value }; setForm({ ...form, stats: s }); }} className="input" placeholder="Lượt khách" />
            </div>
          ))}
        </div>
      </div>
      <SaveBtn onSave={handleSave} saved={saved} />
    </div>
  );
}

// ─── Amenities Tab ────────────────────────────────────────────────────────────
function AmenitiesTab() {
  const { amenities, addAmenity, updateAmenity, deleteAmenity } = useStore();
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ icon: "", title: "", desc: "" });
  const [showAdd, setShowAdd] = useState(false);
  const [newForm, setNewForm] = useState({ icon: "", title: "", desc: "" });
  const startEdit = (a: AmenityItem) => { setEditId(a.id); setEditForm({ icon: a.icon, title: a.title, desc: a.desc }); };
  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-5">
        <p className="text-stone-500 text-sm">{amenities.length} tiện ích</p>
        <button onClick={() => setShowAdd(true)} className="btn-primary text-sm"><Plus className="w-4 h-4" /> Thêm tiện ích</button>
      </div>
      <div className="space-y-3">
        {amenities.map((a: AmenityItem) => (
          <div key={a.id} className="bg-white rounded-xl border border-stone-100 p-4 shadow-sm">
            {editId === a.id ? (
              <div className="space-y-3">
                <div className="grid grid-cols-4 gap-3">
                  <input value={editForm.icon} onChange={(e) => setEditForm({ ...editForm, icon: e.target.value })} className="input text-center text-xl" placeholder="🌿" />
                  <input value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} className="input col-span-3" placeholder="Tên tiện ích" />
                </div>
                <input value={editForm.desc} onChange={(e) => setEditForm({ ...editForm, desc: e.target.value })} className="input w-full" placeholder="Mô tả" />
                <div className="flex gap-2">
                  <button onClick={() => { updateAmenity(a.id, editForm); setEditId(null); }} className="flex items-center gap-1.5 px-4 py-2 bg-forest-600 text-white rounded-lg text-sm font-medium"><Check className="w-3.5 h-3.5" /> Lưu</button>
                  <button onClick={() => setEditId(null)} className="flex items-center gap-1.5 px-4 py-2 border border-stone-200 text-stone-600 rounded-lg text-sm"><X className="w-3.5 h-3.5" /> Hủy</button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <span className="text-2xl">{a.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-stone-800 text-sm">{a.title}</p>
                  <p className="text-stone-400 text-xs truncate">{a.desc}</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => startEdit(a)} className="p-2 text-stone-400 hover:text-forest-600 hover:bg-forest-50 rounded-lg transition-colors"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => deleteAmenity(a.id)} className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      {showAdd && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-7">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-xl font-bold text-stone-800">Thêm tiện ích</h2>
              <button onClick={() => setShowAdd(false)} className="text-stone-400 hover:text-stone-600 text-2xl leading-none">×</button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-3">
                <Field label="Icon (emoji)"><input value={newForm.icon} onChange={(e) => setNewForm({ ...newForm, icon: e.target.value })} className="input text-center text-xl" placeholder="🌿" /></Field>
                <div className="col-span-3"><Field label="Tên tiện ích"><input value={newForm.title} onChange={(e) => setNewForm({ ...newForm, title: e.target.value })} className="input" placeholder="Vườn sinh thái" /></Field></div>
              </div>
              <Field label="Mô tả"><input value={newForm.desc} onChange={(e) => setNewForm({ ...newForm, desc: e.target.value })} className="input" placeholder="Rau sạch tự trồng..." /></Field>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => { addAmenity(newForm); setNewForm({ icon: "", title: "", desc: "" }); setShowAdd(false); }} className="btn-primary flex-1 justify-center"><Plus className="w-4 h-4" /> Thêm</button>
              <button onClick={() => setShowAdd(false)} className="flex-1 border border-stone-200 text-stone-600 hover:bg-stone-50 font-medium px-4 py-2.5 rounded-lg text-sm transition-colors">Hủy</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Testimonials Tab ─────────────────────────────────────────────────────────
function TestimonialsTab() {
  const { testimonials, addTestimonial, updateTestimonial, deleteTestimonial } = useStore();
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: "", location: "", rating: 5, text: "", avatar: "" });
  const [showAdd, setShowAdd] = useState(false);
  const [newForm, setNewForm] = useState({ name: "", location: "", rating: 5, text: "", avatar: "" });
  const startEdit = (t: TestimonialItem) => { setEditId(t.id); setEditForm({ name: t.name, location: t.location, rating: t.rating, text: t.text, avatar: t.avatar }); };
  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-5">
        <p className="text-stone-500 text-sm">{testimonials.length} đánh giá</p>
        <button onClick={() => setShowAdd(true)} className="btn-primary text-sm"><Plus className="w-4 h-4" /> Thêm đánh giá</button>
      </div>
      <div className="space-y-3">
        {testimonials.map((t: TestimonialItem) => (
          <div key={t.id} className="bg-white rounded-xl border border-stone-100 p-4 shadow-sm">
            {editId === t.id ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="input" placeholder="Tên khách" />
                  <input value={editForm.location} onChange={(e) => setEditForm({ ...editForm, location: e.target.value })} className="input" placeholder="Địa điểm" />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-stone-600">Sao:</label>
                  {[1, 2, 3, 4, 5].map((n) => <button key={n} onClick={() => setEditForm({ ...editForm, rating: n })} className={`text-xl ${n <= editForm.rating ? "text-amber-400" : "text-stone-200"}`}>★</button>)}
                </div>
                <textarea rows={3} value={editForm.text} onChange={(e) => setEditForm({ ...editForm, text: e.target.value })} className="input w-full resize-none" placeholder="Nội dung đánh giá" />
                <input value={editForm.avatar} onChange={(e) => setEditForm({ ...editForm, avatar: e.target.value })} className="input w-full" placeholder="URL avatar (https://...)" />
                <div className="flex gap-2">
                  <button onClick={() => { updateTestimonial(t.id, editForm); setEditId(null); }} className="flex items-center gap-1.5 px-4 py-2 bg-forest-600 text-white rounded-lg text-sm font-medium"><Check className="w-3.5 h-3.5" /> Lưu</button>
                  <button onClick={() => setEditId(null)} className="flex items-center gap-1.5 px-4 py-2 border border-stone-200 text-stone-600 rounded-lg text-sm"><X className="w-3.5 h-3.5" /> Hủy</button>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-4">
                {t.avatar && <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover shrink-0" />}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-stone-800 text-sm">{t.name}</p>
                    <span className="text-stone-400 text-xs">· {t.location}</span>
                    <span className="text-amber-400 text-xs">{"★".repeat(t.rating)}</span>
                  </div>
                  <p className="text-stone-500 text-xs line-clamp-2">{t.text}</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => startEdit(t)} className="p-2 text-stone-400 hover:text-forest-600 hover:bg-forest-50 rounded-lg transition-colors"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => deleteTestimonial(t.id)} className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      {showAdd && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-7">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-xl font-bold text-stone-800">Thêm đánh giá</h2>
              <button onClick={() => setShowAdd(false)} className="text-stone-400 hover:text-stone-600 text-2xl leading-none">×</button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Tên khách"><input value={newForm.name} onChange={(e) => setNewForm({ ...newForm, name: e.target.value })} className="input" /></Field>
                <Field label="Địa điểm"><input value={newForm.location} onChange={(e) => setNewForm({ ...newForm, location: e.target.value })} className="input" /></Field>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-stone-600">Đánh giá:</label>
                {[1, 2, 3, 4, 5].map((n) => <button key={n} onClick={() => setNewForm({ ...newForm, rating: n })} className={`text-2xl ${n <= newForm.rating ? "text-amber-400" : "text-stone-200"}`}>★</button>)}
              </div>
              <Field label="Nội dung"><textarea rows={3} value={newForm.text} onChange={(e) => setNewForm({ ...newForm, text: e.target.value })} className="input resize-none" /></Field>
              <Field label="URL avatar"><input value={newForm.avatar} onChange={(e) => setNewForm({ ...newForm, avatar: e.target.value })} className="input" placeholder="https://..." /></Field>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => { addTestimonial(newForm); setNewForm({ name: "", location: "", rating: 5, text: "", avatar: "" }); setShowAdd(false); }} className="btn-primary flex-1 justify-center"><Plus className="w-4 h-4" /> Thêm</button>
              <button onClick={() => setShowAdd(false)} className="flex-1 border border-stone-200 text-stone-600 hover:bg-stone-50 font-medium px-4 py-2.5 rounded-lg text-sm transition-colors">Hủy</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Contact Tab ──────────────────────────────────────────────────────────────
function ContactTab() {
  const { settings, updateSettings } = useStore();
  const [form, setForm] = useState({ ...settings });
  const [saved, setSaved] = useState(false);
  const handleSave = () => { updateSettings(form); setSaved(true); setTimeout(() => setSaved(false), 2000); };
  return (
    <div className="max-w-2xl space-y-5">
      <p className="text-stone-500 text-sm bg-stone-50 rounded-lg px-4 py-3 border border-stone-100">Thông tin liên hệ hiển thị trong section Liên hệ trên landing page.</p>
      <Field label="Tên homestay"><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" /></Field>
      <Field label="Tagline"><input value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} className="input" /></Field>
      <Field label="Số điện thoại"><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input" placeholder="+84 xxx xxx xxx" /></Field>
      <Field label="Email"><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input" /></Field>
      <Field label="Địa chỉ"><textarea rows={2} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="input resize-none" /></Field>
      <Field label="URL Google Maps"><input value={form.mapUrl} onChange={(e) => setForm({ ...form, mapUrl: e.target.value })} className="input" placeholder="https://maps.google.com/..." /></Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="FaceBook "><input value={form.facebook} onChange={(e) => setForm({ ...form, facebook: e.target.value })} className="input" /></Field>
        <Field label="Instagram"><input value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })} className="input" /></Field>
      </div>
      <SaveBtn onSave={handleSave} saved={saved} />
    </div>
  );
}

// ─── Floating CTA Tab ─────────────────────────────────────────────────────────
const BUTTON_TYPES = [
  { value: "phone", label: "Gọi điện", hint: "Số điện thoại" },
  { value: "zalo", label: "Zalo", hint: "Link Zalo (https://zalo.me/...)" },
  { value: "facebook", label: "FaceBook ", hint: "Link FaceBook  page" },
  { value: "scroll", label: "Cuộn đến section", hint: "ID section (vd: contact)" },
  { value: "link", label: "Link khác", hint: "URL bất kỳ" },
] as const;

const BUTTON_COLORS = [
  { value: "bg-emerald-500", hex: "#10b981" },
  { value: "bg-blue-500", hex: "#3b82f6" },
  { value: "bg-blue-700", hex: "#1d4ed8" },
  { value: "bg-forest-600", hex: "#4a7c59" },
  { value: "bg-amber-500", hex: "#f59e0b" },
  { value: "bg-red-500", hex: "#ef4444" },
  { value: "bg-purple-500", hex: "#a855f7" },
  { value: "bg-stone-700", hex: "#44403c" },
  { value: "bg-pink-500", hex: "#ec4899" },
  { value: "bg-cyan-500", hex: "#06b6d4" },
];

const SECTIONS_LIST = [
  { value: "hero", label: "Hero" }, { value: "about", label: "Về chúng tôi" },
  { value: "rooms", label: "Phòng nghỉ" }, { value: "amenities", label: "Tiện ích" },
  { value: "gallery", label: "Thư viện ảnh" }, { value: "contact", label: "Liên hệ" },
];

const TYPE_BADGE: Record<string, string> = {
  phone: "bg-emerald-50 text-emerald-700", zalo: "bg-blue-50 text-blue-700",
  facebook: "bg-blue-50 text-blue-800", scroll: "bg-amber-50 text-amber-700", link: "bg-stone-100 text-stone-600",
};

function FloatingTab() {
  const { floatingCTA, updateFloatingCTA } = useStore();
  const [form, setForm] = useState<FloatingCTA>({ ...floatingCTA, buttons: [...floatingCTA.buttons] });
  const [editId, setEditId] = useState<string | null>(null);
  const [editBtn, setEditBtn] = useState<FloatingCTAButton | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newBtn, setNewBtn] = useState<Omit<FloatingCTAButton, "id">>({
    label: "", icon: "📞", type: "phone", value: "", color: "bg-emerald-500", enabled: true,
  });

  const push = (next: FloatingCTA) => { setForm(next); updateFloatingCTA(next); };
  const updateBtn = (id: string, data: Partial<FloatingCTAButton>) =>
    push({ ...form, buttons: form.buttons.map((b) => b.id === id ? { ...b, ...data } : b) });
  const deleteBtn = (id: string) =>
    push({ ...form, buttons: form.buttons.filter((b) => b.id !== id) });
  const addBtn = () => {
    if (!newBtn.label.trim()) return;
    push({ ...form, buttons: [...form.buttons, { ...newBtn, id: `btn_${Date.now()}` }] });
    setNewBtn({ label: "", icon: "📞", type: "phone", value: "", color: "bg-emerald-500", enabled: true });
    setShowAdd(false);
  };
  const typeHint = (type: FloatingCTAButton["type"]) => BUTTON_TYPES.find(t => t.value === type)?.hint ?? "";

  return (
    <div className="max-w-2xl space-y-6">

      {/* Settings */}
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm divide-y divide-stone-100">
        <div className="flex items-center justify-between px-5 py-4">
          <div>
            <p className="font-medium text-stone-800 text-sm">Hiển thị nút nổi</p>
            <p className="text-stone-400 text-xs mt-0.5">Speed-dial cố định góc phải màn hình</p>
          </div>
          <button onClick={() => push({ ...form, enabled: !form.enabled })}
            className={`relative w-11 h-6 rounded-full transition-colors ${form.enabled ? "bg-forest-600" : "bg-stone-200"}`}>
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.enabled ? "translate-x-[22px]" : "translate-x-0"}`} />
          </button>
        </div>
        <div className="flex items-center justify-between px-5 py-4">
          <div>
            <p className="font-medium text-stone-800 text-sm">Hiện sau khi cuộn</p>
            <p className="text-stone-400 text-xs mt-0.5">Nút xuất hiện khi cuộn qua ngưỡng này</p>
          </div>
          <div className="flex items-center gap-2">
            <input type="number" min={0} step={50} value={form.showAfterScroll}
              onChange={(e) => push({ ...form, showAfterScroll: parseInt(e.target.value) || 0 })}
              className="w-24 border border-stone-200 rounded-lg px-3 py-1.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-forest-400" />
            <span className="text-stone-400 text-sm">px</span>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-stone-50 rounded-2xl border border-stone-100 p-5 overflow-hidden">
        <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-4">Xem trước</p>
        <div className="flex items-end justify-end gap-3 min-w-0">
          <div className="flex flex-col items-end gap-2 min-w-0 overflow-hidden">
            {form.buttons.filter(b => b.enabled).length === 0 && (
              <p className="text-stone-300 text-xs italic">Chưa có nút nào được bật</p>
            )}
            {form.buttons.filter(b => b.enabled).map((btn) => (
              <div key={btn.id} className={`flex items-center gap-2 ${btn.color} text-white pl-3 pr-4 py-2 rounded-full shadow-md text-sm font-medium max-w-full`}>
                <span className="w-4 h-4 flex items-center justify-center shrink-0">
                  <BtnIcon type={btn.type} className="w-4 h-4" />
                </span>
                <span className="truncate">{btn.label}</span>
              </div>
            ))}
          </div>
          <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-xl shrink-0 ${form.enabled ? "bg-forest-600" : "bg-stone-300"}`}>
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      {/* Buttons list */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="font-semibold text-stone-800">Danh sách nút <span className="text-stone-400 font-normal text-sm">({form.buttons.length})</span></p>
          <button onClick={() => setShowAdd(true)} className="btn-primary text-xs py-2 px-3"><Plus className="w-3.5 h-3.5" /> Thêm nút</button>
        </div>
        {form.buttons.length === 0 && (
          <div className="text-center py-10 text-stone-300 border-2 border-dashed border-stone-200 rounded-2xl">
            <p className="text-sm">Chưa có nút nào. Nhấn "Thêm nút" để bắt đầu.</p>
          </div>
        )}
        <div className="space-y-2">
          {form.buttons.map((btn) => (
            <div key={btn.id} className={`bg-white rounded-xl border shadow-sm transition-all overflow-hidden ${editId === btn.id ? "border-forest-300 ring-1 ring-forest-200" : "border-stone-100"}`}>
              {editId === btn.id && editBtn ? (
                <div className="p-4 space-y-4">
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="block text-xs text-stone-500 mb-1.5">Tên hiển thị</label>
                      <input value={editBtn.label} onChange={(e) => setEditBtn({ ...editBtn, label: e.target.value })} className="input" placeholder="Gọi ngay" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-stone-500 mb-1.5">Loại hành động</label>
                      <select value={editBtn.type} onChange={(e) => setEditBtn({ ...editBtn, type: e.target.value as FloatingCTAButton["type"] })} className="input">
                        {BUTTON_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-stone-500 mb-1.5">Màu nền</label>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {BUTTON_COLORS.map(c => (
                          <button key={c.value} onClick={() => setEditBtn({ ...editBtn, color: c.value })}
                            style={{ backgroundColor: c.hex }}
                            className={`w-6 h-6 rounded-full transition-transform hover:scale-110 ${editBtn.color === c.value ? "ring-2 ring-offset-1 ring-stone-500 scale-110" : ""}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                  {/* Preview mini */}
                  <div className={`flex items-center gap-2.5 ${editBtn.color} text-white pl-3 pr-4 py-2 rounded-full w-fit shadow-sm`}>
                    <BtnIcon type={editBtn.type} className="w-4 h-4" />
                    <span className="text-sm font-medium">{editBtn.label || "Tên nút"}</span>
                  </div>
                  <div>
                    <label className="block text-xs text-stone-500 mb-1.5">{typeHint(editBtn.type)}</label>
                    {editBtn.type === "scroll" ? (
                      <select value={editBtn.value} onChange={(e) => setEditBtn({ ...editBtn, value: e.target.value })} className="input">
                        {SECTIONS_LIST.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                      </select>
                    ) : (
                      <input value={editBtn.value} onChange={(e) => setEditBtn({ ...editBtn, value: e.target.value })} className="input" placeholder={typeHint(editBtn.type)} />
                    )}
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button onClick={() => { updateBtn(btn.id, editBtn); setEditId(null); setEditBtn(null); }}
                      className="flex items-center gap-1.5 px-4 py-2 bg-forest-600 text-white rounded-lg text-sm font-medium hover:bg-forest-700 transition-colors">
                      <Check className="w-3.5 h-3.5" /> Lưu
                    </button>
                    <button onClick={() => { setEditId(null); setEditBtn(null); }}
                      className="flex items-center gap-1.5 px-4 py-2 border border-stone-200 text-stone-600 rounded-lg text-sm hover:bg-stone-50 transition-colors">
                      <X className="w-3.5 h-3.5" /> Hủy
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 px-4 py-3">
                  <div className={`w-9 h-9 rounded-full ${btn.color} flex items-center justify-center shrink-0 shadow-sm`}>
                    <BtnIcon type={btn.type} className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-stone-800 text-sm">{btn.label}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TYPE_BADGE[btn.type] ?? "bg-stone-100 text-stone-500"}`}>
                        {BUTTON_TYPES.find(t => t.value === btn.type)?.label}
                      </span>
                    </div>
                    <p className="text-stone-400 text-xs truncate mt-0.5">{btn.value || "—"}</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button onClick={() => updateBtn(btn.id, { enabled: !btn.enabled })}
                      className={`relative w-9 h-5 rounded-full transition-colors shrink-0 ${btn.enabled ? "bg-forest-600" : "bg-stone-200"}`}>
                      <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${btn.enabled ? "translate-x-[18px]" : "translate-x-0"}`} />
                    </button>
                    <button onClick={() => { setEditId(btn.id); setEditBtn({ ...btn }); }}
                      className="p-1.5 text-stone-400 hover:text-forest-600 hover:bg-forest-50 rounded-lg transition-colors">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => deleteBtn(btn.id)}
                      className="p-1.5 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Add modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100">
              <h2 className="font-display text-lg font-bold text-stone-800">Thêm nút liên hệ</h2>
              <button onClick={() => setShowAdd(false)} className="text-stone-400 hover:text-stone-600 text-2xl leading-none">×</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-xs text-stone-500 mb-1.5">Tên hiển thị *</label>
                  <input value={newBtn.label} onChange={(e) => setNewBtn({ ...newBtn, label: e.target.value })} className="input" placeholder="Gọi ngay" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-stone-500 mb-1.5">Loại hành động</label>
                  <select value={newBtn.type} onChange={(e) => setNewBtn({ ...newBtn, type: e.target.value as FloatingCTAButton["type"] })} className="input">
                    {BUTTON_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-stone-500 mb-1.5">Màu nền</label>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {BUTTON_COLORS.map(c => (
                      <button key={c.value} onClick={() => setNewBtn({ ...newBtn, color: c.value })}
                        style={{ backgroundColor: c.hex }}
                        className={`w-6 h-6 rounded-full transition-transform hover:scale-110 ${newBtn.color === c.value ? "ring-2 ring-offset-1 ring-stone-500 scale-110" : ""}`} />
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs text-stone-500 mb-1.5">{typeHint(newBtn.type)}</label>
                {newBtn.type === "scroll" ? (
                  <select value={newBtn.value} onChange={(e) => setNewBtn({ ...newBtn, value: e.target.value })} className="input">
                    <option value="">-- Chọn section --</option>
                    {SECTIONS_LIST.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                ) : (
                  <input value={newBtn.value} onChange={(e) => setNewBtn({ ...newBtn, value: e.target.value })} className="input" placeholder={typeHint(newBtn.type)} />
                )}
              </div>
              {/* Preview mini */}
              {newBtn.label && (
                <div className={`flex items-center gap-2.5 ${newBtn.color} text-white pl-3 pr-4 py-2 rounded-full w-fit shadow-sm`}>
                  <BtnIcon type={newBtn.type} className="w-4 h-4" />
                  <span className="text-sm font-medium">{newBtn.label}</span>
                </div>
              )}
            </div>
            <div className="flex gap-3 px-6 py-5 border-t border-stone-100">
              <button onClick={addBtn} disabled={!newBtn.label.trim()}
                className="btn-primary flex-1 justify-center disabled:opacity-50 disabled:cursor-not-allowed">
                <Plus className="w-4 h-4" /> Thêm nút
              </button>
              <button onClick={() => setShowAdd(false)}
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

// ─── Shared helpers ───────────────────────────────────────────────────────────
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-stone-700 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function SaveBtn({ onSave, saved }: { onSave: () => void; saved: boolean }) {
  return (
    <button onClick={onSave}
      className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium text-sm transition-all ${saved ? "bg-emerald-600 text-white" : "bg-forest-600 hover:bg-forest-700 text-white"
        }`}>
      {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
      {saved ? "Đã lưu!" : "Lưu thay đổi"}
    </button>
  );
}
