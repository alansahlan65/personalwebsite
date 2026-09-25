import Image from "next/image";
import Link from "next/link";

export function SiteHeader({ page }: { page: "home" | "about" }) {
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="site-header page-width">
        <Link className="brand" href="/" aria-label="Alan Sahlan, home">
          <Image src="/images/alan-logo.png" width={52} height={52} alt="" />
          <span>Alan Sahlan</span>
        </Link>
        <nav className="primary-nav" aria-label="Primary">
          <Link href="/#work">Work</Link>
          <Link href="/about" aria-current={page === "about" ? "page" : undefined}>About</Link>
          <Link href="/#contact">Contact</Link>
          <span className="unavailable" aria-disabled="true" title="Resume will be added after verification">Resume</span>
        </nav>
      </header>
    </>
  );
}
