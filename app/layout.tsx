import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import StoreInitializer from "@/components/StoreInitializer";
import GoogleAnalytics from "@/components/GoogleAnalytics";

export const metadata: Metadata = {
  title: "Tà Giang ecolodge – Homestay Sinh Thái tà giang",
  description:
    "Trải nghiệm thiên nhiên hoang sơ tại Tà Giang ecolodge – homestay sinh thái giữa lòng cao nguyên đá tà giang.",
  keywords: ["homestay tà giang", "tà giang ecolodge", "du lịch sinh thái", "cao nguyên đá"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body>
        <StoreInitializer />
        <GoogleAnalytics />
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
