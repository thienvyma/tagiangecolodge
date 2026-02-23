"use client";
import Link from "next/link";
import { Leaf, Phone, Mail, MapPin, Facebook, Instagram } from "lucide-react";
import { useStore } from "@/lib/store";
import { useLang } from "@/lib/i18n/LanguageContext";

export default function Footer() {
  const site = useStore((s) => s.settings);
  const { t } = useLang();

  return (
    <footer className="bg-forest-900 text-stone-300">
      <div className="section-padding max-w-7xl mx-auto py-16 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <div className="flex items-center gap-2 font-display font-bold text-xl text-white mb-4">
            <Leaf className="w-5 h-5 text-forest-400" />
            {site.name}
          </div>
          <p className="text-sm leading-relaxed text-stone-400">{t.footer.tagline}</p>
          <div className="flex gap-4 mt-5">
            <a href={site.facebook} aria-label="Facebook" className="hover:text-forest-400 transition-colors">
              <Facebook className="w-5 h-5" />
            </a>
            <a href={site.instagram} aria-label="Instagram" className="hover:text-forest-400 transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4">{t.nav.about}</h3>
          <ul className="space-y-2 text-sm">
            {[
              { label: t.nav.about, href: "/#about" },
              { label: t.footer.links.rooms, href: "/#rooms" },
              { label: t.footer.links.amenities, href: "/#amenities" },
              { label: t.footer.links.gallery, href: "/#gallery" },
              { label: t.footer.links.blog, href: "/blog" },
              { label: t.footer.links.contact, href: "/#contact" },
            ].map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-forest-400 transition-colors">{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4">{t.contact.sectionBadge}</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <MapPin className="w-4 h-4 mt-0.5 text-forest-400 shrink-0" />
              {site.address}
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-forest-400 shrink-0" />
              <a href={`tel:${site.phone}`} className="hover:text-forest-400 transition-colors">{site.phone}</a>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-forest-400 shrink-0" />
              <a href={`mailto:${site.email}`} className="hover:text-forest-400 transition-colors">{site.email}</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-forest-800 section-padding max-w-7xl mx-auto py-5 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-stone-500">
        <p>© {new Date().getFullYear()} {t.footer.copyright}</p>
        <p>Thiết kế bởi team Kiro ✦</p>
      </div>
    </footer>
  );
}
