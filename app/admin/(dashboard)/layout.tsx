'use client';
import AdminSidebar from "@/components/admin/Sidebar";
import { StoreGate } from "@/components/StoreInitializer";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-stone-50">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-auto">
        <StoreGate>{children}</StoreGate>
      </main>
    </div>
  );
}
