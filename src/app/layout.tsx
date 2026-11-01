import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono-metrics",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vectorr — Optimize SVG files without losing a curve",
  description:
    "Upload an SVG, see exactly where the bytes went, and download a smaller file. Path precision, metadata stripping and redundant groups — with a report no other tool gives you.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  openGraph: {
    title: "Vectorr — Your SVG is 2.4 MB. Find the 1 MB you can cut.",
    description:
      "Vector-to-vector optimization with a real savings report. No signup to preview.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Reveal animations are JS-gated so content stays visible without JS. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add('js')`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
