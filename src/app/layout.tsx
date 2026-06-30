import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CalcToaster } from "@/components/calc/CalcToaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OpenCalc — A premium open-source calculator",
  description:
    "OpenCalc is a modern, minimalistic calculator with Normal and Scientific modes, persistent history, step-by-step solving, and an elegant Material 3 interface.",
  keywords: [
    "OpenCalc",
    "calculator",
    "scientific calculator",
    "open source",
    "LaTeX",
    "Material 3",
    "step-by-step math",
  ],
  authors: [{ name: "OpenCalc Contributors" }],
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "OpenCalc",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "OpenCalc",
    description: "A premium open-source calculator with LaTeX & step-by-step solving.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f6f3" },
    { media: "(prefers-color-scheme: dark)", color: "#131816" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <CalcToaster />
      </body>
    </html>
  );
}
