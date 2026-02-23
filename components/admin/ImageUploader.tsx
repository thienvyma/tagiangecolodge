"use client";
import { Upload, Link, ImageIcon, X } from "lucide-react";
import { useImageUpload } from "@/lib/useImageUpload";

interface Props {
  value: string;
  onImageChange: (src: string) => void;
  showTabs?: boolean;
  tab?: "upload" | "url";
  onTabChange?: (tab: "upload" | "url") => void;
  height?: string;
}

export default function ImageUploader({ value, onImageChange, showTabs = true, tab = "upload", onTabChange, height = "h-40" }: Props) {
  const { inputRef, dragging, onDrop, onDragOver, onDragLeave, onFileChange } = useImageUpload(onImageChange);

  return (
    <div className="space-y-3">
      {showTabs && onTabChange && (
        <div className="flex rounded-lg border border-stone-200 overflow-hidden">
          <button type="button" onClick={() => onTabChange("upload")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium transition-colors ${tab === "upload" ? "bg-forest-600 text-white" : "text-stone-500 hover:bg-stone-50"}`}>
            <Upload className="w-3.5 h-3.5" /> Tải lên
          </button>
          <button type="button" onClick={() => onTabChange("url")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium transition-colors ${tab === "url" ? "bg-forest-600 text-white" : "text-stone-500 hover:bg-stone-50"}`}>
            <Link className="w-3.5 h-3.5" /> URL
          </button>
        </div>
      )}

      {tab === "url" && (
        <input
          value={value}
          onChange={(e) => onImageChange(e.target.value)}
          className="w-full border border-stone-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-400"
          placeholder="https://..."
        />
      )}

      {value ? (
        <div className={`relative ${height} rounded-xl overflow-hidden bg-stone-100 group`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="preview" className="w-full h-full object-cover" />
          <button type="button" onClick={() => onImageChange("")}
            className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
            <X className="w-4 h-4" />
          </button>
          {tab === "upload" && (
            <button type="button" onClick={() => inputRef.current?.click()}
              className="absolute bottom-2 right-2 bg-black/50 hover:bg-black/70 text-white px-3 py-1.5 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
              <Upload className="w-3 h-3" /> Đổi ảnh
            </button>
          )}
        </div>
      ) : tab === "upload" ? (
        <div
          onDrop={onDrop} onDragOver={onDragOver} onDragLeave={onDragLeave}
          onClick={() => inputRef.current?.click()}
          className={`${height} rounded-xl border-2 border-dashed cursor-pointer flex flex-col items-center justify-center gap-3 transition-colors ${
            dragging ? "border-forest-500 bg-forest-50" : "border-stone-200 hover:border-forest-400 hover:bg-stone-50"
          }`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${dragging ? "bg-forest-100" : "bg-stone-100"}`}>
            <ImageIcon className={`w-5 h-5 ${dragging ? "text-forest-600" : "text-stone-400"}`} />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-stone-600">Kéo thả hoặc click để chọn</p>
            <p className="text-xs text-stone-400 mt-0.5">JPG, PNG, WebP</p>
          </div>
        </div>
      ) : null}

      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onFileChange} />
    </div>
  );
}
