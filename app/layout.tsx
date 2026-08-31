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
  metadataBase: new URL("https://trycontractlens.com"),
  title: "Contract Lens | AI Contract Analysis",
  description: "Upload a contract and get structured data back: parties, deadlines, obligations, risks. Built for small German law firms.",
  keywords: [
    // English
    "Contract Management",
    "AI Contract Analysis",
    "Contract Deadlines",
    "Risk Detection",
    "Compliance",
    "Berlin",
    "Legal Tech",
    "Structured Data",
    // German
    "Vertragsmanagement",
    "Kanzleisoftware",
    "Künstliche Intelligenz",
    "Compliance Software",
    "Vertragsanalyse",
    "Fristenmanagement",
    "Risikomanagement",
    "Rechtssicherheit"
  ],
  authors: [{ name: "Santiago Paz" }],
  openGraph: {
    title: "Contract Lens | AI Contract Analysis",
    description: "Upload a contract and get structured data back: parties, deadlines, obligations, risks. Built for small German law firms.",
    type: "website",
    siteName: "Contract Lens",
    locale: "en_US",
    alternateLocale: ["de_DE"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contract Lens | AI Contract Analysis",
    description: "Upload a contract and get structured data back: parties, deadlines, obligations, risks. Built for small German law firms.",
  },
  robots: {
    index: true,
    follow: true,
  },
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
