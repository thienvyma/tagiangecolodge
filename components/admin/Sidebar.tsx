"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Leaf, LayoutDashboard, BedDouble, CalendarCheck, Images, Settings, LogOut, BookOpen, Bot, Layout } from "lucide-react";
import { SITE } from "@/lib/data";
import clsx from "clsx";

const NAV = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Phòng nghỉ", href: "/admin/rooms", icon: BedDouble },
  { label: "Đặt phòng", href: "/admin/bookings", icon: CalendarCheck },
  { label: "Thư viện ảnh", href: "/admin/gallery", icon: Images },
  { label: "Blog", href: "/admin/blog", icon: BookOpen },
  { label: "Blog Agent", href: "/admin/blog/agent", icon: Bot },
  { label: "Tùy chỉnh Landing", href: "/admin/landing", icon: Layout },
  { label: "Cài đặt", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar() {
  const path = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <aside className="w-64 bg-white border-r border-stone-200 flex flex-col min-h-screen shrink-0">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-stone-100">
        <Link href="/" className="flex items-center gap-2 font-display font-bold text-lg text-forest-700">
          <Leaf className="w-5 h-5 text-forest-500" />
          {SITE.name}
        </Link>
        <p className="text-xs text-stone-400 mt-0.5">Admin Panel</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={clsx(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              path === href
                ? "bg-forest-50 text-forest-700"
                : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"
            )}
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-stone-100 space-y-1">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-stone-500 hover:bg-stone-50 hover:text-stone-700 transition-colors"
        >
          <LogOut className="w-4 h-4 rotate-180" />
          Về trang chủ
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Đăng xuất
        </button>
      </div>
    </aside>
  );
}
