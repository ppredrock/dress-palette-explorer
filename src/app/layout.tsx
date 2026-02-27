import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: {
    default: "DressPaletteExplorer — Neha's Digital Studio & Boutique",
    template: "%s | DressPaletteExplorer",
  },
  description:
    "Explore curated dress collections, book makeup appointments, and discover Neha's lifestyle world. Your cozy creative destination.",
  keywords: [
    "dress rental",
    "makeup artist",
    "fashion",
    "lifestyle",
    "boutique",
    "bridal makeup",
  ],
  openGraph: {
    title: "DressPaletteExplorer",
    description: "Neha's digital studio — dresses, makeup, and lifestyle",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>{children}</body>
    </html>
  );
}
