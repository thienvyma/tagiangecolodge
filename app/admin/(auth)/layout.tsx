// Auth pages (login) – không có sidebar, không wrap bởi AdminLayout
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
