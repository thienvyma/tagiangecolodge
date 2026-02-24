"use client";
import { useState, useEffect } from "react";
import { Save, KeyRound, Eye, EyeOff, RotateCcw, BarChart3, Code } from "lucide-react";
import { useStore } from "@/lib/store";
import { SITE } from "@/lib/data";
import type { TrackingPixels } from "@/lib/store";

export default function SettingsAdmin() {
  const { settings, updateSettings, trackingPixels, updateTrackingPixels } = useStore();
  const [form, setForm] = useState({ ...settings });
  const [tpForm, setTpForm] = useState<TrackingPixels>({ ...trackingPixels });
  const [saved, setSaved] = useState(false);

  useEffect(() => { setTpForm({ ...trackingPixels }); }, [trackingPixels]);

  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [showPw, setShowPw] = useState({ current: false, next: false, confirm: false });
  const [pwError, setPwError] = useState("");
  const [pwSaved, setPwSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = () => {
    if (confirm("Khôi phục về thông tin mặc định?")) {
      setForm({ ...SITE });
      updateSettings({ ...SITE });
    }
  };

  const [tpSaved, setTpSaved] = useState(false);
  const handleTpSave = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = Object.fromEntries(
      Object.entries(tpForm).map(([k, v]) => [k, typeof v === 'string' ? v.trim() : v])
    ) as TrackingPixels;
    updateTrackingPixels(trimmed);
    setTpSaved(true);
    setTimeout(() => setTpSaved(false), 2500);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPwError("");
    if (pwForm.next.length < 8) { setPwError("Mật khẩu mới phải có ít nhất 8 ký tự"); return; }
    if (pwForm.next !== pwForm.confirm) { setPwError("Mật khẩu xác nhận không khớp"); return; }
    setPwSaved(true);
    setPwForm({ current: "", next: "", confirm: "" });
    setTimeout(() => setPwSaved(false), 3000);
  };

  const toggleShow = (field: keyof typeof showPw) =>
    setShowPw((s) => ({ ...s, [field]: !s[field] }));

  const PwInput = ({ field, label, placeholder }: { field: keyof typeof pwForm; label: string; placeholder: string }) => (
    <div>
      <label className="block text-sm font-medium text-stone-700 mb-1.5">{label}</label>
      <div className="relative">
        <input required type={showPw[field] ? "text" : "password"} value={pwForm[field]}
          onChange={(e) => setPwForm({ ...pwForm, [field]: e.target.value })}
          className="w-full border border-stone-200 rounded-lg px-4 py-2.5 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-forest-400"
          placeholder={placeholder} />
        <button type="button" onClick={() => toggleShow(field)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
          aria-label={showPw[field] ? "Ẩn" : "Hiện"}>
          {showPw[field] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-stone-800">Cài đặt</h1>
        <p className="text-stone-500 mt-1">Thông tin hiển thị trên toàn bộ website</p>
      </div>

      <form onSubmit={handleSave} className="max-w-2xl space-y-6">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-stone-100 space-y-5">
          <h2 className="font-semibold text-stone-800 pb-3 border-b border-stone-100">Thông tin cơ bản</h2>
          {([
            { key: "name", label: "Tên homestay" },
            { key: "tagline", label: "Slogan" },
            { key: "phone", label: "Số điện thoại" },
            { key: "email", label: "Email" },
            { key: "address", label: "Địa chỉ" },
          ] as const).map(({ key, label }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">{label}</label>
              <input value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="w-full border border-stone-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-400" />
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-stone-100 space-y-5">
          <h2 className="font-semibold text-stone-800 pb-3 border-b border-stone-100">Mạng xã hội</h2>
          {([
            { key: "facebook", label: "FaceBook  URL" },
            { key: "instagram", label: "Instagram URL" },
          ] as const).map(({ key, label }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">{label}</label>
              <input value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="w-full border border-stone-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-400" />
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button type="submit" className="btn-primary">
            <Save className="w-4 h-4" />
            {saved ? "Đã lưu!" : "Lưu thay đổi"}
          </button>
          <button type="button" onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2.5 border border-stone-200 text-stone-600 hover:bg-stone-50 rounded-lg text-sm font-medium transition-colors">
            <RotateCcw className="w-4 h-4" /> Khôi phục mặc định
          </button>
        </div>
      </form>

      {/* Tracking Pixels & Analytics */}
      <form onSubmit={handleTpSave} className="max-w-2xl mt-8">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-stone-100 space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-stone-100">
            <div className="w-8 h-8 bg-forest-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-forest-600" />
            </div>
            <div>
              <h2 className="font-semibold text-stone-800">Tracking & Analytics</h2>
              <p className="text-xs text-stone-400">Quản lý mã theo dõi cho tất cả nền tảng</p>
            </div>
          </div>
          {tpSaved && <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm px-4 py-3 rounded-lg">Đã lưu cấu hình tracking!</div>}

          {([
            { key: "gaId" as const, label: "Google Analytics (GA4)", placeholder: "G-XXXXXXXXXX", hint: "Analytics → Admin → Data Streams → Measurement ID" },
            { key: "gtmId" as const, label: "Google Tag Manager", placeholder: "GTM-XXXXXXX", hint: "Tag Manager → Container ID" },
            { key: "gadsId" as const, label: "Google Ads", placeholder: "AW-XXXXXXXXXX", hint: "Google Ads → Tools → Conversions → Tag ID" },
            { key: "fbPixelId" as const, label: "Facebook Pixel", placeholder: "123456789012345", hint: "Meta Events Manager → Data Sources → Pixel ID" },
            { key: "tiktokPixelId" as const, label: "TikTok Pixel", placeholder: "CXXXXXXXXXXXXXXXXX", hint: "TikTok Ads → Assets → Events → Pixel ID" },
          ]).map(({ key, label, placeholder, hint }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">{label}</label>
              <input value={tpForm[key]} onChange={(e) => setTpForm({ ...tpForm, [key]: e.target.value })}
                className="w-full border border-stone-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-400 font-mono"
                placeholder={placeholder} />
              <p className="text-xs text-stone-400 mt-1">{hint}</p>
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5 flex items-center gap-1.5">
              <Code className="w-3.5 h-3.5" /> Mã tùy chỉnh (Head)
            </label>
            <textarea value={tpForm.customHeadCode} onChange={(e) => setTpForm({ ...tpForm, customHeadCode: e.target.value })}
              className="w-full border border-stone-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-400 font-mono h-28 resize-y"
              placeholder="Dán mã JavaScript tùy chỉnh vào đây..." />
            <p className="text-xs text-stone-400 mt-1">Mã sẽ được chèn vào tất cả các trang. Chỉ dán code từ nguồn tin cậy.</p>
          </div>

          <button type="submit" className="btn-primary text-sm">
            <Save className="w-4 h-4" />
            {tpSaved ? "Đã lưu!" : "Lưu cấu hình"}
          </button>
        </div>
      </form>

      {/* Đổi mật khẩu */}
      <form onSubmit={handlePasswordChange} className="max-w-2xl mt-8">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-stone-100 space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-stone-100">
            <div className="w-8 h-8 bg-forest-100 rounded-lg flex items-center justify-center">
              <KeyRound className="w-4 h-4 text-forest-600" />
            </div>
            <h2 className="font-semibold text-stone-800">Đổi mật khẩu Admin</h2>
          </div>
          {pwError && <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-lg">{pwError}</div>}
          {pwSaved && <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm px-4 py-3 rounded-lg">Đổi mật khẩu thành công! Cập nhật file .env.local để áp dụng.</div>}
          <PwInput field="current" label="Mật khẩu hiện tại" placeholder="••••••••" />
          <PwInput field="next" label="Mật khẩu mới" placeholder="Tối thiểu 8 ký tự" />
          <PwInput field="confirm" label="Xác nhận mật khẩu mới" placeholder="Nhập lại mật khẩu mới" />
          <button type="submit" className="btn-outline text-sm">
            <KeyRound className="w-4 h-4" /> Cập nhật mật khẩu
          </button>
        </div>
      </form>
    </div>
  );
}
