import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { content } from "@/data/content";
import { assetPath } from "@/lib/asset-path";

const geist = localFont({
  src: "../node_modules/@fontsource-variable/geist/files/geist-latin-wght-normal.woff2",
  variable: "--font-geist",
  display: "swap",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: content.meta.title,
  description: content.meta.description,
  icons: { icon: assetPath("/favicon.svg") },
  openGraph: {
    title: content.meta.title,
    description: content.meta.description,
    locale: "nl_NL",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: content.meta.title,
    description: content.meta.description,
  },
};

// Voor de eerste paint uitvoeren, zodat een opgeslagen licht thema niet flitst.
const themeScript = `try{document.documentElement.dataset.theme=localStorage.getItem('portfolio-theme')==='light'?'light':'dark'}catch{document.documentElement.dataset.theme='dark'}`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="nl" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={geist.variable}>{children}</body>
    </html>
  );
}
