"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Leaf } from "lucide-react";
import { useStore } from "@/lib/store";
import type { Store } from "@/lib/store";
import { useLang } from "@/lib/i18n/LanguageContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const siteName = useStore((s: Store) => s.settings.name);
  const isHome = pathname === "/";
  const { lang, setLang, t } = useLang();

  const SECTIONS = [
    { label: t.nav.home, hash: "hero" },
    { label: t.nav.about, hash: "about" },
    { label: t.nav.rooms, hash: "rooms" },
    { label: t.nav.amenities, hash: "amenities" },
    { label: t.nav.gallery, hash: "gallery" },
    { label: t.nav.contact, hash: "contact" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    if (!isHome) { setScrolled(true); return; }
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  const handleSectionClick = (hash: string) => {
    setOpen(false);
    if (isHome) {
      document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push(`/#${hash}`);
    }
  };

  const handleBookingClick = () => {
    setOpen(false);
    if (isHome) {
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push("/#contact");
    }
  };

  // Language switcher button styles
  const langBtnBase = "text-xs font-bold px-2 py-1 rounded transition-all";
  const langActive = scrolled
    ? "bg-forest-600 text-white"
    : "bg-white/30 text-white backdrop-blur-sm";
  const langInactive = scrolled
    ? "text-stone-500 hover:text-forest-600"
    : "text-white/70 hover:text-white";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white shadow-md" : "bg-gradient-to-b from-black/60 to-transparent"
        }`}
    >
      <nav className="section-padding max-w-7xl mx-auto flex items-center justify-between h-16 lg:h-20">
        {/* Logo */}
        <Link
          href="/"
          className={`flex items-center gap-2 font-display font-bold text-xl transition-colors ${scrolled ? "text-forest-700" : "text-white"
            }`}
        >
          <Leaf className={`w-6 h-6 ${scrolled ? "text-forest-500" : "text-forest-300"}`} />
          {siteName}
        </Link>

        {/* Desktop links */}
        <ul className="hidden lg:flex items-center gap-8">
          {SECTIONS.map((s) => (
            <li key={s.hash}>
              <button
                onClick={() => handleSectionClick(s.hash)}
                className={`text-sm font-medium transition-colors ${scrolled ? "text-stone-700 hover:text-forest-600" : "text-white/90 hover:text-white"
                  }`}
              >
                {s.label}
              </button>
            </li>
          ))}
          <li>
            <Link
              href="/blog"
              className={`text-sm font-medium transition-colors ${pathname === "/blog" || pathname.startsWith("/blog/")
                ? "text-forest-600"
                : scrolled ? "text-stone-700 hover:text-forest-600" : "text-white/90 hover:text-white"
                }`}
            >
              {t.nav.blog}
            </Link>
          </li>
        </ul>

        {/* Right side: Lang switcher + CTA */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Language switcher */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setLang("vi")}
              className={`${langBtnBase} ${lang === "vi" ? langActive : langInactive}`}
            >
              VI
            </button>
            <span className={`text-xs ${scrolled ? "text-stone-300" : "text-white/40"}`}>|</span>
            <button
              onClick={() => setLang("en")}
              className={`${langBtnBase} ${lang === "en" ? langActive : langInactive}`}
            >
              EN
            </button>
          </div>

          <button
            onClick={handleBookingClick}
            className={`inline-flex font-medium px-6 py-2.5 rounded-lg transition-all duration-200 items-center gap-2 text-sm ${scrolled
              ? "bg-forest-600 hover:bg-forest-700 text-white"
              : "bg-white/20 hover:bg-white/30 text-white border border-white/40 backdrop-blur-sm"
              }`}
          >
            {t.nav.bookNow}
          </button>
        </div>

        {/* Mobile toggle */}
        <button
          className={`lg:hidden p-2 transition-colors ${scrolled ? "text-stone-700" : "text-white"}`}
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {
        open && (
          <div className="lg:hidden bg-white border-t border-stone-100 shadow-lg">
            <ul className="flex flex-col py-4">
              {SECTIONS.map((s) => (
                <li key={s.hash}>
                  <button
                    onClick={() => handleSectionClick(s.hash)}
                    className="w-full text-left block px-6 py-3 text-stone-700 hover:bg-forest-50 hover:text-forest-600 transition-colors"
                  >
                    {s.label}
                  </button>
                </li>
              ))}
              <li>
                <Link href="/blog" onClick={() => setOpen(false)}
                  className="block px-6 py-3 text-stone-700 hover:bg-forest-50 hover:text-forest-600 transition-colors">
                  {t.nav.blog}
                </Link>
              </li>
              {/* Mobile language switcher */}
              <li className="px-6 py-3 flex items-center gap-2">
                <span className="text-sm text-stone-500 mr-1">Language:</span>
                <button
                  onClick={() => setLang("vi")}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${lang === "vi" ? "bg-forest-600 text-white" : "bg-stone-100 text-stone-500"
                    }`}
                >
                  VI
                </button>
                <button
                  onClick={() => setLang("en")}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${lang === "en" ? "bg-forest-600 text-white" : "bg-stone-100 text-stone-500"
                    }`}
                >
                  EN
                </button>
              </li>
              <li className="px-6 pt-1">
                <button onClick={handleBookingClick} className="btn-primary w-full justify-center text-sm">
                  {t.nav.bookNow}
                </button>
              </li>
            </ul>
          </div >
        )
      }
    </header >
  );
}
