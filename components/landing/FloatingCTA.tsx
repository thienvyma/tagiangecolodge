"use client";
import { useState, useEffect } from "react";
import { MessageCircle, X, Phone, ArrowUp, Link } from "lucide-react";
import { useStore } from "@/lib/store";
import type { Store, FloatingCTAButton } from "@/lib/store";

// ─── Platform Icons ───────────────────────────────────────────────────────────
export function BtnIcon({ type, className = "w-5 h-5" }: { type: FloatingCTAButton["type"]; className?: string }) {
  if (type === "phone") return <Phone className={className} />;
  if (type === "scroll") return <ArrowUp className={className} />;
  if (type === "link") return <Link className={className} />;
  if (type === "zalo") return (
    <svg viewBox="0 0 48 48" className={className} fill="none">
      <rect width="48" height="48" rx="10" fill="white" fillOpacity="0.2" />
      <path d="M24 6C14.06 6 6 13.16 6 22c0 5.04 2.6 9.54 6.68 12.52L11.5 40l5.8-2.9C19.3 37.68 21.6 38 24 38c9.94 0 18-7.16 18-16S33.94 6 24 6z" fill="white" />
      <path d="M16 20h4M16 24h8M28 20v8l4-4" stroke="#0068FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
  if (type === "facebook") return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
  return <MessageCircle className={className} />;
}

export default function FloatingCTA() {
  const floatingCTA = useStore((s: Store) => s.floatingCTA);
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > floatingCTA.showAfterScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [floatingCTA.showAfterScroll]);

  if (!floatingCTA.enabled) return null;

  const activeButtons = floatingCTA.buttons.filter((b) => b.enabled);

  const handleButtonClick = (btn: FloatingCTAButton) => {
    setOpen(false);
    if (btn.type === "phone") {
      window.location.href = `tel:${btn.value.replace(/\s/g, "")}`;
    } else if (btn.type === "scroll") {
      document.getElementById(btn.value)?.scrollIntoView({ behavior: "smooth" });
    } else {
      window.open(btn.value, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className={`fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 transition-all duration-300 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}>
      {/* Child buttons */}
      <div className={`flex flex-col items-end gap-2.5 transition-all duration-200 ${open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none"}`}>
        {activeButtons.map((btn, i) => (
          <button
            key={btn.id}
            onClick={() => handleButtonClick(btn)}
            style={{ transitionDelay: open ? `${i * 40}ms` : "0ms" }}
            className={`flex items-center gap-2.5 ${btn.color} hover:brightness-110 text-white pl-3 pr-4 py-2.5 rounded-full shadow-lg transition-all duration-200 whitespace-nowrap`}
          >
            <span className="w-5 h-5 flex items-center justify-center shrink-0">
              <BtnIcon type={btn.type} className="w-4 h-4" />
            </span>
            <span className="text-sm font-medium">{btn.label}</span>
          </button>
        ))}
      </div>

      {/* Main toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className={`w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 ${open ? "bg-stone-700 hover:bg-stone-800" : "bg-forest-600 hover:bg-forest-700"
          }`}
        aria-label={open ? "Đóng" : "Liên hệ"}
      >
        {open ? <X className="w-6 h-6 text-white" /> : <MessageCircle className="w-6 h-6 text-white" />}
      </button>

      {open && <div className="fixed inset-0 -z-10" onClick={() => setOpen(false)} />}
    </div>
  );
}
