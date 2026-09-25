import type { Metadata } from "next";
import "./globals.css";
import { RouteFocus } from "./components/route-focus";

export const metadata: Metadata = {
  title: "Alan Sahlan — Product Designer",
  description: "Alan Sahlan is a UI/UX Designer based in Indonesia, bringing product design and frontend craft closer together.",
  robots: { index: false, follow: false },
  icons: { icon: "/images/alan-logo.png" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><RouteFocus />{children}</body></html>;
}
