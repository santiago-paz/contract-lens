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
  title: "Paragraph+ | The Enterprise Asset OS",
  description: "The operating system for your corporate assets. Automate contract auditing, enforce compliance, and recover capital with our forensic ingestion and AI-driven analysis engine.",
  keywords: [
    // English
    "Enterprise Asset OS",
    "Contract Management",
    "Forensic Audit",
    "AI Contract Analysis",
    "Risk Detection",
    "Compliance",
    "Berlin",
    "Legal Tech",
    "Structured Data",
    "Capital Recovery",
    "Operational Supremacy",
    // German
    "Vertragsmanagement",
    "Digitale Akte",
    "Künstliche Intelligenz",
    "Compliance Software",
    "Vertragsanalyse",
    "Risikomanagement",
    "Rechtssicherheit"
  ],
  authors: [{ name: "Paragraph+ GmbH" }],
  openGraph: {
    title: "Paragraph+ | The Enterprise Asset OS",
    description: "The operating system for your corporate assets. Automate contract auditing, enforce compliance, and recover capital.",
    type: "website",
    siteName: "Paragraph+",
    locale: "en_US",
    alternateLocale: ["de_DE"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Paragraph+ | The Enterprise Asset OS",
    description: "The operating system for your corporate assets. Automate contract auditing, enforce compliance, and recover capital.",
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
