"use client";
import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { Plus, Trash2, Pencil, Check, X, ExternalLink, Upload, Link, ImageIcon } from "lucide-react";
import { useStore, type GalleryItem } from "@/lib/store";

const CATEGORIES = ["Tổng hợp", "Phòng nghỉ", "Cảnh quan", "Ẩm thực", "Hoạt động", "Lễ hội"];

function useImageUpload(onResult: (srcs: string[]) => void) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const processFiles = async (files: FileList | File[]) => {
    setIsProcessing(true);
    const validFiles = Array.from(files).filter(f => f.type.startsWith("image/"));
    const results: string[] = [];

    for (const file of validFiles) {
      const src = await new Promise<string>((resolve) => {
        const img = new window.Image();
        const objectUrl = URL.createObjectURL(file);
        img.onload = () => {
          URL.revokeObjectURL(objectUrl);
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;
          const MAX_SIZE = 800; // Resize to max 800px

          if (width > height && width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          } else if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);

          // Export as WebP with 0.7 quality
          resolve(canvas.toDataURL("image/webp", 0.7));
        };
        img.src = objectUrl;
      });
      results.push(src);
    }

    onResult(results);
    setIsProcessing(false);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files.length > 0) processFiles(e.dataTransfer.files);
  }, []);

  const onDragOver = (e: React.DragEvent) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = () => setDragging(false);
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) processFiles(e.target.files);
    e.target.value = "";
  };

  return { inputRef, dragging, isProcessing, onDrop, onDragOver, onDragLeave, onFileChange };
}

export default function GalleryAdmin() {
  const { gallery, addGalleryItem, addBulkGalleryItems, updateGalleryItem, deleteGalleryItem } = useStore();
  const [filterCat, setFilterCat] = useState("Tất cả");
  const [showAdd, setShowAdd] = useState(false);
  const [addTab, setAddTab] = useState<"upload" | "url">("upload");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAlt, setEditAlt] = useState("");
  const [editCat, setEditCat] = useState("");
  const [newFormFiles, setNewFormFiles] = useState<{ src: string, alt: string, category: string }[]>([]);
  const [newFormUrl, setNewFormUrl] = useState({ src: "", alt: "", category: CATEGORIES[0] });
  const [addError, setAddError] = useState("");

  const { inputRef, dragging, isProcessing, onDrop, onDragOver, onDragLeave, onFileChange } = useImageUpload(
    (srcs) => {
      const newItems = srcs.map(src => ({ src, alt: "", category: CATEGORIES[0] }));
      setNewFormFiles(prev => [...prev, ...newItems]);
      setAddError("");
    }
  );

  const filtered = filterCat === "Tất cả" ? gallery : gallery.filter((g) => g.category === filterCat);

  const handleAdd = () => {
    setAddError("");
    if (addTab === "upload") {
      if (newFormFiles.length === 0) { setAddError("Vui lòng chọn ảnh để tải lên"); return; }

      // Map global alt/category if users didn't enter one individually (UX improvement)
      const mappedItems = newFormFiles.map(f => ({
        src: f.src,
        alt: f.alt || newFormUrl.alt || "Ảnh tại Tà Giang",
        category: f.category || newFormUrl.category || CATEGORIES[0]
      }));

      addBulkGalleryItems(mappedItems);
      setNewFormFiles([]);
    } else {
      if (!newFormUrl.src.trim()) { setAddError("Vui lòng nhập URL ảnh"); return; }
      if (!newFormUrl.alt.trim()) { setAddError("Vui lòng nhập mô tả ảnh"); return; }
      addGalleryItem(newFormUrl);
      setNewFormUrl({ src: "", alt: "", category: CATEGORIES[0] });
    }

    setAddTab("upload");
    setShowAdd(false);
  };

  const closeModal = () => {
    setShowAdd(false);
    setAddError("");
    setNewFormFiles([]);
    setNewFormUrl({ src: "", alt: "", category: CATEGORIES[0] });
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
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${filterCat === cat ? "bg-forest-600 text-white border-forest-600" : "bg-white text-stone-600 border-stone-200 hover:bg-stone-50"
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
                  <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={onFileChange} />
                  {newFormFiles.length > 0 ? (
                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                      {newFormFiles.map((f, i) => (
                        <div key={i} className="flex gap-3 bg-stone-50 p-2 rounded-xl border border-stone-100 relative group animate-in slide-in-from-bottom-2">
                          <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-stone-200">
                            <Image src={f.src} alt="preview" fill className="object-cover" unoptimized />
                          </div>
                          <div className="flex-1 space-y-2">
                            <input value={f.alt} onChange={(e) => {
                              const updated = [...newFormFiles];
                              updated[i].alt = e.target.value;
                              setNewFormFiles(updated);
                            }}
                              className="w-full border-b border-stone-200 bg-transparent px-1 py-1 text-xs focus:outline-none focus:border-forest-400"
                              placeholder="Mô tả cho ảnh này" />

                            <select value={f.category} onChange={(e) => {
                              const updated = [...newFormFiles];
                              updated[i].category = e.target.value;
                              setNewFormFiles(updated);
                            }}
                              className="w-full bg-white border border-stone-200 rounded px-1 py-1 text-xs focus:outline-none focus:border-forest-400">
                              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                            </select>
                          </div>
                          <button onClick={() => setNewFormFiles(prev => prev.filter((_, idx) => idx !== i))}
                            className="absolute -top-2 -right-2 bg-white border border-stone-200 text-red-500 hover:bg-red-50 hover:border-red-200 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-sm">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}

                      {isProcessing && (
                        <div className="text-center text-xs text-stone-500 animate-pulse">Đang nén thêm ảnh...</div>
                      )}

                      <button onClick={() => inputRef.current?.click()} className="w-full py-3 rounded-xl border-2 border-dashed border-stone-200 text-stone-500 hover:border-forest-400 hover:text-forest-600 bg-white transition-colors text-sm font-medium">
                        + Thêm ảnh khác
                      </button>

                    </div>
                  ) : (
                    <div
                      onDrop={onDrop} onDragOver={onDragOver} onDragLeave={onDragLeave}
                      onClick={() => !isProcessing && inputRef.current?.click()}
                      className={`h-48 rounded-xl border-2 border-dashed cursor-pointer flex flex-col items-center justify-center gap-3 transition-colors ${dragging ? "border-forest-500 bg-forest-50" : "border-stone-200 hover:border-forest-400 hover:bg-stone-50"} ${isProcessing ? "opacity-50 cursor-wait" : ""}`}>
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${dragging ? "bg-forest-100" : "bg-stone-100"}`}>
                        <ImageIcon className={`w-6 h-6 ${dragging ? "text-forest-600" : "text-stone-400"}`} />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-stone-600">
                          {isProcessing ? "Đang xử lý và nén ảnh..." : "Kéo thả ảnh vào đây"}
                        </p>
                        <p className="text-xs text-stone-400 mt-0.5">hoặc click để chọn file · Có thể chọn nhiều ảnh</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">URL ảnh *</label>
                  <input value={newFormUrl.src} onChange={(e) => setNewFormUrl({ ...newFormUrl, src: e.target.value })}
                    className="w-full border border-stone-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-400"
                    placeholder="https://images.unsplash.com/..." />
                  {newFormUrl.src && (
                    <div className="relative h-40 rounded-xl overflow-hidden bg-stone-100 mt-3">
                      <Image src={newFormUrl.src} alt="preview" fill className="object-cover" onError={() => setAddError("URL ảnh không hợp lệ")} />
                    </div>
                  )}
                </div>
              )}

              {addTab === "url" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1.5">Mô tả ảnh *</label>
                    <input value={newFormUrl.alt} onChange={(e) => setNewFormUrl({ ...newFormUrl, alt: e.target.value })}
                      className="w-full border border-stone-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-400"
                      placeholder="Cảnh hoàng hôn cao nguyên đá" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1.5">Danh mục</label>
                    <select value={newFormUrl.category} onChange={(e) => setNewFormUrl({ ...newFormUrl, category: e.target.value })}
                      className="w-full border border-stone-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-400">
                      {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </>
              )}
            </div>

            <div className="flex gap-3 px-6 py-5 border-t border-stone-100">
              <button onClick={handleAdd} disabled={addTab === "upload" ? newFormFiles.length === 0 : !newFormUrl.src} className="btn-primary flex-1 justify-center disabled:opacity-50 disabled:cursor-not-allowed">
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
