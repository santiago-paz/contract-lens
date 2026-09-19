import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// The dashboard's faces. They are not preloaded: a root-layout preload would
// fetch them on every route, the landing included, which never shows them.
// The landing loads its own faces in components/landing/fonts.ts.
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  preload: false,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  preload: false,
});

const description =
  "Upload a contract and get the facts and the deadlines back: parties, term, notice period, renewal, liability. Built for small law firms in Germany.";

export const metadata: Metadata = {
  metadataBase: new URL("https://trycontractlens.com"),
  title: "Contract Lens | Contract management for small law firms",
  description,
  keywords: [
    // English
    "Contract Management",
    "AI Contract Analysis",
    "Contract Deadlines",
    "Notice Periods",
    "Law Firm Software",
    "Berlin",
    "Legal Tech",
    // German
    "Vertragsmanagement",
    "Kanzleisoftware",
    "Vertragsanalyse",
    "Fristenmanagement",
    "Kündigungsfristen",
    "Rechtssicherheit"
  ],
  authors: [{ name: "Santiago Paz" }],
  openGraph: {
    title: "Contract Lens | Contract management for small law firms",
    description,
    type: "website",
    siteName: "Contract Lens",
    locale: "en_US",
    alternateLocale: ["de_DE"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contract Lens | Contract management for small law firms",
    description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
