import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin – Tà Giang Ecolog",
};

// Layout gốc của /admin – không có sidebar
// Sidebar được inject bởi (dashboard)/layout.tsx
// Login page dùng (auth)/layout.tsx
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
