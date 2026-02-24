"use client";
import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { Plus, Trash2, Pencil, Check, X, ExternalLink, Upload, Link, ImageIcon, Loader2 } from "lucide-react";
import { useStore, type GalleryItem } from "@/lib/store";

const CATEGORIES = ["Tổng hợp", "Phòng nghỉ", "Cảnh quan", "Ẩm thực", "Hoạt động", "Lễ hội"];

type UploadItem = {
  file?: File;
  src: string;
  alt: string;
  category: string;
  status: "pending" | "uploading" | "done" | "error";
};

function useParallelUpload(onProgress: (items: UploadItem[]) => void) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    if (!res.ok) throw new Error("Upload failed");
    const data = await res.json();
    return data.url;
  };

  const processFiles = useCallback(async (files: FileList | File[]) => {
    const validFiles = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (validFiles.length === 0) return;

    // Create preview items immediately
    const items: UploadItem[] = validFiles.map((file) => ({
      file,
      src: URL.createObjectURL(file),
      alt: "",
      category: CATEGORIES[0],
      status: "pending" as const,
    }));
    onProgress([...items]);

    // Upload in parallel (max 4 concurrent)
    const CONCURRENCY = 4;
    const queue = [...items];
    const results = [...items];

    const worker = async () => {
      while (queue.length > 0) {
        const item = queue.shift();
        if (!item) break;
        const idx = results.indexOf(item);
        results[idx] = { ...results[idx], status: "uploading" };
        onProgress([...results]);
        try {
          const url = await uploadFile(item.file!);
          results[idx] = { ...results[idx], src: url, status: "done" };
        } catch {
          results[idx] = { ...results[idx], status: "error" };
        }
        onProgress([...results]);
      }
    };

    await Promise.all(Array.from({ length: Math.min(CONCURRENCY, items.length) }, () => worker()));
  }, [onProgress]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files.length > 0) processFiles(e.dataTransfer.files);
  }, [processFiles]);

  const onDragOver = (e: React.DragEvent) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = () => setDragging(false);
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) processFiles(e.target.files);
    e.target.value = "";
  };

  return { inputRef, dragging, onDrop, onDragOver, onDragLeave, onFileChange };
}

export default function GalleryAdmin() {
  const { gallery, addGalleryItem, addBulkGalleryItems, updateGalleryItem, deleteGalleryItem } = useStore();
  const [filterCat, setFilterCat] = useState("Tất cả");
  const [showAdd, setShowAdd] = useState(false);
  const [addTab, setAddTab] = useState<"upload" | "url">("upload");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAlt, setEditAlt] = useState("");
  const [editCat, setEditCat] = useState("");
  const [uploadItems, setUploadItems] = useState<UploadItem[]>([]);
  const [bulkCategory, setBulkCategory] = useState(CATEGORIES[0]);
  const [bulkAlt, setBulkAlt] = useState("");
  const [newFormUrl, setNewFormUrl] = useState({ src: "", alt: "", category: CATEGORIES[0] });
  const [addError, setAddError] = useState("");

  const { inputRef, dragging, onDrop, onDragOver, onDragLeave, onFileChange } = useParallelUpload(
    useCallback((items: UploadItem[]) => {
      setUploadItems(items);
      setAddError("");
    }, [])
  );

  const filtered = filterCat === "Tất cả" ? gallery : gallery.filter((g) => g.category === filterCat);
  const doneCount = uploadItems.filter((i) => i.status === "done").length;
  const uploadingCount = uploadItems.filter((i) => i.status === "uploading").length;
  const isUploading = uploadingCount > 0 || uploadItems.some((i) => i.status === "pending");

  const handleAdd = () => {
    setAddError("");
    if (addTab === "upload") {
      const doneItems = uploadItems.filter((i) => i.status === "done");
      if (doneItems.length === 0) { setAddError("Vui lòng chọn và chờ upload xong"); return; }
      const mapped = doneItems.map((f) => ({
        src: f.src,
        alt: f.alt || bulkAlt || "Ảnh tại Tà Giang",
        category: f.category || bulkCategory,
      }));
      addBulkGalleryItems(mapped);
      setUploadItems([]);
      setBulkAlt("");
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
    setUploadItems([]);
    setBulkAlt("");
    setNewFormUrl({ src: "", alt: "", category: CATEGORIES[0] });
    setAddTab("upload");
  };

  const applyBulkCategory = (cat: string) => {
    setBulkCategory(cat);
    setUploadItems((prev) => prev.map((i) => ({ ...i, category: cat })));
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
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${filterCat === cat ? "bg-forest-600 text-white border-forest-600" : "bg-white text-stone-600 border-stone-200 hover:bg-stone-50"}`}>
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
            <Image src={img.src} alt={img.alt} fill className="object-cover" unoptimized={img.src.startsWith("data:") || img.src.includes("supabase")} />
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
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100 shrink-0">
              <h2 className="font-display text-xl font-bold text-stone-800">Thêm ảnh mới</h2>
              <button onClick={closeModal} className="text-stone-400 hover:text-stone-600 text-2xl leading-none">×</button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-stone-100 shrink-0">
              <button onClick={() => setAddTab("upload")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium border-b-2 transition-colors ${addTab === "upload" ? "border-forest-600 text-forest-700" : "border-transparent text-stone-400 hover:text-stone-600"}`}>
                <Upload className="w-4 h-4" /> Tải lên hàng loạt
              </button>
              <button onClick={() => setAddTab("url")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium border-b-2 transition-colors ${addTab === "url" ? "border-forest-600 text-forest-700" : "border-transparent text-stone-400 hover:text-stone-600"}`}>
                <Link className="w-4 h-4" /> Nhập URL
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              {addError && <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-lg">{addError}</div>}

              {addTab === "upload" ? (
                <div className="space-y-4">
                  <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={onFileChange} />

                  {/* Bulk settings */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-stone-500 mb-1">Danh mục chung</label>
                      <select value={bulkCategory} onChange={(e) => applyBulkCategory(e.target.value)}
                        className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-400">
                        {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-stone-500 mb-1">Mô tả chung (tùy chọn)</label>
                      <input value={bulkAlt} onChange={(e) => setBulkAlt(e.target.value)}
                        className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-400"
                        placeholder="Áp dụng cho ảnh chưa có mô tả" />
                    </div>
                  </div>

                  {uploadItems.length > 0 ? (
                    <div className="space-y-2">
                      {/* Progress summary */}
                      <div className="flex items-center justify-between text-xs text-stone-500 bg-stone-50 rounded-lg px-3 py-2">
                        <span>{doneCount}/{uploadItems.length} ảnh đã upload</span>
                        {isUploading && <span className="flex items-center gap-1 text-forest-600"><Loader2 className="w-3 h-3 animate-spin" /> Đang upload...</span>}
                        {!isUploading && uploadItems.some((i) => i.status === "error") && (
                          <span className="text-red-500">{uploadItems.filter((i) => i.status === "error").length} lỗi</span>
                        )}
                      </div>

                      {/* File list */}
                      <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                        {uploadItems.map((f, i) => (
                          <div key={i} className={`flex gap-3 p-2 rounded-xl border relative group ${f.status === "error" ? "bg-red-50 border-red-100" : "bg-stone-50 border-stone-100"}`}>
                            <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-stone-200">
                              <Image src={f.src} alt="preview" fill className="object-cover" unoptimized />
                              {f.status === "uploading" && (
                                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                  <Loader2 className="w-5 h-5 text-white animate-spin" />
                                </div>
                              )}
                              {f.status === "done" && (
                                <div className="absolute top-1 right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                                  <Check className="w-2.5 h-2.5 text-white" />
                                </div>
                              )}
                              {f.status === "error" && (
                                <div className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                                  <X className="w-2.5 h-2.5 text-white" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0 space-y-1.5">
                              <input value={f.alt} onChange={(e) => {
                                setUploadItems((prev) => prev.map((item, idx) => idx === i ? { ...item, alt: e.target.value } : item));
                              }}
                                className="w-full border-b border-stone-200 bg-transparent px-1 py-0.5 text-xs focus:outline-none focus:border-forest-400"
                                placeholder="Mô tả ảnh" />
                              <select value={f.category} onChange={(e) => {
                                setUploadItems((prev) => prev.map((item, idx) => idx === i ? { ...item, category: e.target.value } : item));
                              }}
                                className="w-full bg-white border border-stone-200 rounded px-1 py-0.5 text-xs focus:outline-none focus:border-forest-400">
                                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                              </select>
                            </div>
                            <button onClick={() => setUploadItems((prev) => prev.filter((_, idx) => idx !== i))}
                              className="absolute -top-1.5 -right-1.5 bg-white border border-stone-200 text-red-500 hover:bg-red-50 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-sm">
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>

                      <button onClick={() => inputRef.current?.click()}
                        className="w-full py-2.5 rounded-xl border-2 border-dashed border-stone-200 text-stone-500 hover:border-forest-400 hover:text-forest-600 bg-white transition-colors text-sm font-medium">
                        + Thêm ảnh khác
                      </button>
                    </div>
                  ) : (
                    <div
                      onDrop={onDrop} onDragOver={onDragOver} onDragLeave={onDragLeave}
                      onClick={() => inputRef.current?.click()}
                      className={`h-48 rounded-xl border-2 border-dashed cursor-pointer flex flex-col items-center justify-center gap-3 transition-colors ${dragging ? "border-forest-500 bg-forest-50" : "border-stone-200 hover:border-forest-400 hover:bg-stone-50"}`}>
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${dragging ? "bg-forest-100" : "bg-stone-100"}`}>
                        <ImageIcon className={`w-6 h-6 ${dragging ? "text-forest-600" : "text-stone-400"}`} />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-stone-600">Kéo thả ảnh vào đây</p>
                        <p className="text-xs text-stone-400 mt-0.5">hoặc click để chọn · Hỗ trợ chọn nhiều ảnh cùng lúc</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
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
                </div>
              )}
            </div>

            <div className="flex gap-3 px-6 py-5 border-t border-stone-100 shrink-0">
              <button onClick={handleAdd}
                disabled={addTab === "upload" ? (doneCount === 0 || isUploading) : !newFormUrl.src}
                className="btn-primary flex-1 justify-center disabled:opacity-50 disabled:cursor-not-allowed">
                {isUploading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Đang upload {doneCount}/{uploadItems.length}</>
                ) : (
                  <><Plus className="w-4 h-4" /> Thêm {doneCount > 0 ? `${doneCount} ảnh` : "vào thư viện"}</>
                )}
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
