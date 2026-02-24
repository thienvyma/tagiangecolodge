import { useRef, useState, useCallback } from "react";

export function useImageUpload(onResult: (src: string) => void) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const processFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) return;

    // Opt-in for a simpler visual fallback in extreme cases, but here we just upload directly:
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Upload failed');
      }

      const data = await res.json();
      onResult(data.url);
    } catch (err) {
      console.error("Image upload failed:", err);
      alert("Có lỗi xảy ra khi tải ảnh lên. Vui lòng thử lại.");
    }
  }, [onResult]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [processFile]);

  const onDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); setDragging(true); }, []);
  const onDragLeave = useCallback(() => setDragging(false), []);
  const onFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = "";
  }, [processFile]);

  return { inputRef, dragging, onDrop, onDragOver, onDragLeave, onFileChange };
}
