import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { RouteFocus } from "./components/route-focus";
import { PointerEnhancements } from "./components/pointer-enhancements";
import { NavigationTransition } from "./components/navigation-transition";
import { createPageMetadata } from "./lib/metadata";
import { THEME_INIT_SCRIPT } from "./lib/theme";

const plusJakarta = localFont({
  src: "./fonts/PlusJakartaSans-Variable.woff2",
  weight: "200 800",
  style: "normal",
  display: "swap",
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  metadataBase: process.env.SITE_ORIGIN ? new URL(process.env.SITE_ORIGIN) : undefined,
  ...createPageMetadata(
    "Alan Sahlan | Product Designer",
    "Product Designer in Indonesia and UI/UX Designer at CADIT. Selected work in hospitality, finance, pet adoption and food sharing.",
  ),
  robots: { index: false, follow: false },
  icons: { icon: "/images/alan-logo.png" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={plusJakarta.variable} data-theme="light" suppressHydrationWarning>
    <head><script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} /></head>
    <body><NavigationTransition><RouteFocus /><PointerEnhancements />{children}</NavigationTransition></body>
  </html>;
}
