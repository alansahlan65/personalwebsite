import { ContactAction } from "./contact-action";
import { CONTACT_EMAIL, RESUME_HREF } from "../lib/portfolio-links";
import Image from "next/image";
import { TransitionLink as Link } from "./navigation-transition";

export function SiteFooter({ compact = false }: { compact?: boolean }) {
  return (
    <footer className={`contact${compact ? " contact--compact" : ""}`} id="contact" tabIndex={-1} aria-labelledby={compact ? undefined : "contact-title"}>
      <div className="page-width">
        {!compact && <>
          <h2 id="contact-title"><ContactAction /></h2>
          <a className="contact-email" href={`mailto:${CONTACT_EMAIL}`} data-magnet="text"><span data-magnet-part>{CONTACT_EMAIL}</span></a>
        </>}
        <nav className="professional-links" aria-label="Professional profiles">
          <a href="https://www.linkedin.com/in/muhammadsahlanshadiq/" data-magnet="text"><span data-magnet-part>LinkedIn</span></a>
          <a href="https://github.com/alansahlan65" data-magnet="text"><span data-magnet-part>GitHub</span></a>
          <a href="https://www.behance.net/muhammadsahlanshadiq" data-magnet="text"><span data-magnet-part>Behance</span></a>
          <a href={RESUME_HREF} download="Alan-Sahlan-Resume.pdf" aria-label="Download resume, PDF" data-magnet="text"><span data-magnet-part>Download resume <span className="nav-file-type">PDF</span></span></a>
        </nav>
        <div className="footer-bottom">
          <Link className="footer-home" href="/" aria-label="Alan Sahlan, home" data-magnet="text">
            <Image src="/images/alan-logo.png" alt="" width={64} height={64} data-magnet-part /><span data-magnet-part>Alan Sahlan</span>
          </Link>
          <p>© {new Date().getFullYear()} Alan Sahlan</p>
        </div>
        <p className="icon-credit"><a href="https://streamlinehq.com" data-magnet="text"><span data-magnet-part>Icons by Streamline</span></a></p>
      </div>
    </footer>
  );
}
