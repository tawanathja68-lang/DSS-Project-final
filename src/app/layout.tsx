import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RetailDSS - ระบบสนับสนุนการตัดสินใจวิเคราะห์ยอดขายและวางแผนการเติมสินค้า",
  description:
    "ระบบสนับสนุนการตัดสินใจ (DSS) สำหรับธุรกิจค้าปลีก: ETL, Star Schema Data Warehouse, OLAP, Data Mining, และ Replenishment Simulation",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="th"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 font-sans antialiased selection:bg-blue-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
