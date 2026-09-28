import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { RouteFocus } from "./components/route-focus";
import { PointerEnhancements } from "./components/pointer-enhancements";
import { NavigationTransition } from "./components/navigation-transition";

const plusJakarta = localFont({
  src: "./fonts/PlusJakartaSans-Variable.woff2",
  weight: "200 800",
  style: "normal",
  display: "swap",
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  metadataBase: process.env.SITE_ORIGIN ? new URL(process.env.SITE_ORIGIN) : undefined,
  title: "Alan Sahlan — Product Designer",
  description: "Alan Sahlan is a UI/UX Designer based in Indonesia, bringing product design and frontend craft closer together.",
  openGraph: {
    type: "website",
    title: "Alan Sahlan — Product Designer",
    description: "A product design portfolio connecting design decisions with working interfaces.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Alan Sahlan — Product Designer",
    description: "A product design portfolio connecting design decisions with working interfaces.",
  },
  robots: { index: false, follow: false },
  icons: { icon: "/images/alan-logo.png" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={plusJakarta.variable}><body><NavigationTransition><RouteFocus /><PointerEnhancements />{children}</NavigationTransition></body></html>;
}
