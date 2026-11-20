import type { Metadata } from "next";
import { Fraunces, Sniglet } from "next/font/google";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { brand } from "@/lib/brand";
import "./globals.css";

// Brand fonts. The logo uses TAN Headline (headings) and Sniglet (text).
// TAN Headline isn't a free Google Font, so Fraunces stands in for it.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["SOFT", "opsz"],
});

const sniglet = Sniglet({
  variable: "--font-sniglet",
  subsets: ["latin"],
  weight: ["400", "800"],
});

export const metadata: Metadata = {
  title: {
    default: `${brand.name} · Worksheet maker`,
    template: `%s · ${brand.name}`,
  },
  description: "Make custom worksheets for any Ontario curriculum topic, Kindergarten to Grade 8.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${fraunces.variable} ${sniglet.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans" suppressHydrationWarning>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
