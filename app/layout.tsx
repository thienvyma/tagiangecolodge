import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import StoreInitializer from "@/components/StoreInitializer";

export const metadata: Metadata = {
  title: "Tà Giang Ecolog – Homestay Sinh Thái Hà Giang",
  description:
    "Trải nghiệm thiên nhiên hoang sơ tại Tà Giang Ecolog – homestay sinh thái giữa lòng cao nguyên đá Hà Giang.",
  keywords: ["homestay hà giang", "tà giang ecolog", "du lịch sinh thái", "cao nguyên đá"],
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
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
