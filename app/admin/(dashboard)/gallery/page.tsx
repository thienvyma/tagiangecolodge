"use client";
import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { Plus, Trash2, Pencil, Check, X, ExternalLink, Upload, Link, ImageIcon } from "lucide-react";
import { useStore, type GalleryItem } from "@/lib/store";

const CATEGORIES = ["Tổng hợp", "Phòng nghỉ", "Cảnh quan", "Ẩm thực", "Hoạt động", "Lễ hội"];

function useImageUpload(onResult: (src: string) => void) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => onResult(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, []);

  const onDragOver = (e: React.DragEvent) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = () => setDragging(false);
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = "";
  };

  return { inputRef, dragging, onDrop, onDragOver, onDragLeave, onFileChange };
}

export default function GalleryAdmin() {
  const { gallery, addGalleryItem, updateGalleryItem, deleteGalleryItem } = useStore();
  const [filterCat, setFilterCat] = useState("Tất cả");
  const [showAdd, setShowAdd] = useState(false);
  const [addTab, setAddTab] = useState<"upload" | "url">("upload");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAlt, setEditAlt] = useState("");
  const [editCat, setEditCat] = useState("");
  const [newForm, setNewForm] = useState({ src: "", alt: "", category: CATEGORIES[0] });
  const [addError, setAddError] = useState("");

  const { inputRef, dragging, onDrop, onDragOver, onDragLeave, onFileChange } = useImageUpload(
    (src) => { setNewForm((f) => ({ ...f, src })); setAddError(""); }
  );

  const filtered = filterCat === "Tất cả" ? gallery : gallery.filter((g) => g.category === filterCat);

  const handleAdd = () => {
    setAddError("");
    if (!newForm.src.trim()) { setAddError("Vui lòng chọn hoặc nhập URL ảnh"); return; }
    if (!newForm.alt.trim()) { setAddError("Vui lòng nhập mô tả ảnh"); return; }
    addGalleryItem(newForm);
    setNewForm({ src: "", alt: "", category: CATEGORIES[0] });
    setAddTab("upload");
    setShowAdd(false);
  };

  const closeModal = () => {
    setShowAdd(false);
    setAddError("");
    setNewForm({ src: "", alt: "", category: CATEGORIES[0] });
    setAddTab("upload");
  };

  const startEdit = (item: GalleryItem) => { setEditingId(item.id); setEditAlt(item.alt); setEditCat(item.category); };
  const saveEdit = (id: string) => { updateGalleryItem(id, { alt: editAlt, category: editCat }); setEditingId(null); };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-stone-800">Thư viện ảnh</h1>
          <p className="text-stone-500 mt-1">{gallery.length} ảnh · hiển thị trực tiếp trên landing</p>
        </div>
        <div className="flex gap-3">
          <a href="/#gallery" target="_blank"
            className="flex items-center gap-2 px-4 py-2.5 border border-stone-200 rounded-lg text-sm text-stone-600 hover:bg-stone-50 transition-colors">
            <ExternalLink className="w-4 h-4" /> Xem landing
          </a>
          <button onClick={() => setShowAdd(true)} className="btn-primary text-sm">
            <Plus className="w-4 h-4" /> Thêm ảnh
          </button>
        </div>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {["Tất cả", ...CATEGORIES].map((cat) => (
          <button key={cat} onClick={() => setFilterCat(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
              filterCat === cat ? "bg-forest-600 text-white border-forest-600" : "bg-white text-stone-600 border-stone-200 hover:bg-stone-50"
            }`}>
            {cat}
            {cat !== "Tất cả" && (
              <span className="ml-1.5 text-xs opacity-70">({gallery.filter((g) => g.category === cat).length})</span>
            )}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        <button onClick={() => setShowAdd(true)}
          className="aspect-square rounded-2xl border-2 border-dashed border-stone-200 hover:border-forest-400 hover:bg-forest-50 transition-colors flex flex-col items-center justify-center gap-2 text-stone-400 hover:text-forest-600">
          <Plus className="w-8 h-8" />
          <span className="text-sm font-medium">Thêm ảnh</span>
        </button>

        {filtered.map((img) => (
          <div key={img.id} className="relative aspect-square rounded-2xl overflow-hidden group shadow-sm border border-stone-100">
            <Image src={img.src} alt={img.alt} fill className="object-cover" unoptimized={img.src.startsWith("data:")} />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-200" />
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => startEdit(img)} className="bg-white/90 hover:bg-white text-stone-700 p-1.5 rounded-lg transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
              <button onClick={() => deleteGalleryItem(img.id)} className="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-lg transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
            {editingId === img.id ? (
              <div className="absolute bottom-0 left-0 right-0 bg-white p-2 space-y-1.5">
                <input value={editAlt} onChange={(e) => setEditAlt(e.target.value)} className="w-full border border-stone-200 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-forest-400" placeholder="Mô tả ảnh" />
                <select value={editCat} onChange={(e) => setEditCat(e.target.value)} className="w-full border border-stone-200 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-forest-400">
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
                <div className="flex gap-1">
                  <button onClick={() => saveEdit(img.id)} className="flex-1 bg-forest-600 text-white rounded py-1 text-xs flex items-center justify-center gap-1"><Check className="w-3 h-3" /> Lưu</button>
                  <button onClick={() => setEditingId(null)} className="flex-1 bg-stone-100 text-stone-600 rounded py-1 text-xs flex items-center justify-center gap-1"><X className="w-3 h-3" /> Hủy</button>
                </div>
              </div>
            ) : (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-200">
                <p className="text-white text-xs truncate">{img.alt}</p>
                <span className="text-white/60 text-xs">{img.category}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && filterCat !== "Tất cả" && (
        <div className="text-center py-16 text-stone-400"><p>Chưa có ảnh trong danh mục này.</p></div>
      )}

      {/* Add modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100">
              <h2 className="font-display text-xl font-bold text-stone-800">Thêm ảnh mới</h2>
              <button onClick={closeModal} className="text-stone-400 hover:text-stone-600 text-2xl leading-none">×</button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-stone-100">
              <button onClick={() => setAddTab("upload")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium border-b-2 transition-colors ${addTab === "upload" ? "border-forest-600 text-forest-700" : "border-transparent text-stone-400 hover:text-stone-600"}`}>
                <Upload className="w-4 h-4" /> Tải lên từ máy
              </button>
              <button onClick={() => setAddTab("url")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium border-b-2 transition-colors ${addTab === "url" ? "border-forest-600 text-forest-700" : "border-transparent text-stone-400 hover:text-stone-600"}`}>
                <Link className="w-4 h-4" /> Nhập URL
              </button>
            </div>

            <div className="p-6 space-y-4">
              {addError && <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-lg">{addError}</div>}

              {addTab === "upload" ? (
                <div>
                  <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onFileChange} />
                  {newForm.src ? (
                    <div className="relative h-48 rounded-xl overflow-hidden bg-stone-100 group">
                      <Image src={newForm.src} alt="preview" fill className="object-cover" unoptimized />
                      <button onClick={() => setNewForm((f) => ({ ...f, src: "" }))}
                        className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onDrop={onDrop} onDragOver={onDragOver} onDragLeave={onDragLeave}
                      onClick={() => inputRef.current?.click()}
                      className={`h-48 rounded-xl border-2 border-dashed cursor-pointer flex flex-col items-center justify-center gap-3 transition-colors ${
                        dragging ? "border-forest-500 bg-forest-50" : "border-stone-200 hover:border-forest-400 hover:bg-stone-50"
                      }`}>
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${dragging ? "bg-forest-100" : "bg-stone-100"}`}>
                        <ImageIcon className={`w-6 h-6 ${dragging ? "text-forest-600" : "text-stone-400"}`} />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-stone-600">Kéo thả ảnh vào đây</p>
                        <p className="text-xs text-stone-400 mt-0.5">hoặc click để chọn file · JPG, PNG, WebP</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">URL ảnh *</label>
                  <input value={newForm.src} onChange={(e) => setNewForm({ ...newForm, src: e.target.value })}
                    className="w-full border border-stone-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-400"
                    placeholder="https://images.unsplash.com/..." />
                  {newForm.src && (
                    <div className="relative h-40 rounded-xl overflow-hidden bg-stone-100 mt-3">
                      <Image src={newForm.src} alt="preview" fill className="object-cover" onError={() => setAddError("URL ảnh không hợp lệ")} />
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Mô tả ảnh *</label>
                <input value={newForm.alt} onChange={(e) => setNewForm({ ...newForm, alt: e.target.value })}
                  className="w-full border border-stone-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-400"
                  placeholder="Cảnh hoàng hôn cao nguyên đá" />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">Danh mục</label>
                <select value={newForm.category} onChange={(e) => setNewForm({ ...newForm, category: e.target.value })}
                  className="w-full border border-stone-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-400">
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="flex gap-3 px-6 py-5 border-t border-stone-100">
              <button onClick={handleAdd} disabled={!newForm.src} className="btn-primary flex-1 justify-center disabled:opacity-50 disabled:cursor-not-allowed">
                <Plus className="w-4 h-4" /> Thêm vào thư viện
              </button>
              <button onClick={closeModal} className="flex-1 border border-stone-200 text-stone-600 hover:bg-stone-50 font-medium px-4 py-2.5 rounded-lg text-sm transition-colors">
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
