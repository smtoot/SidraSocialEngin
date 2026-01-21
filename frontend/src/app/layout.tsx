import type { Metadata } from "next";
import { Noto_Sans_Arabic } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const arabicFont = Noto_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-arabic",
});

export const metadata: Metadata = {
  title: "مصنع محتوى سدرة",
  description: "منصة إنتاج محتوى مدعومة بالذكاء الاصطناعي",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${arabicFont.variable} font-arabic antialiased rtl`}>
        {children}
        <Toaster 
          position="top-left"
          toastOptions={{
            style: {
              direction: 'rtl',
              fontFamily: 'Noto Sans Arabic, sans-serif',
            },
          }}
        />
      </body>
    </html>
  );
}
