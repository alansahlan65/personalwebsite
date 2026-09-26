import { ArrowIcon } from "./ui-icons";
import Image from "next/image";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="contact" id="contact" tabIndex={-1} aria-labelledby="contact-title">
      <div className="page-width">
        <h2 id="contact-title">
          <a className="contact-action" href="mailto:alansahlanwork@gmail.com" data-magnet="control">
            <span data-magnet-part>Let’s work<br />together.</span>
            <span className="contact-arrow" aria-hidden="true" data-magnet-part><ArrowIcon /></span>
          </a>
        </h2>
        <p className="contact-note">For Product Designer opportunities and collaboration.</p>
        <a className="contact-email" href="mailto:alansahlanwork@gmail.com" data-magnet="text"><span data-magnet-part>alansahlanwork@gmail.com</span></a>
        <nav className="professional-links" aria-label="Professional profiles">
          <a href="https://www.linkedin.com/in/muhammadsahlanshadiq/" data-magnet="text"><span data-magnet-part>LinkedIn</span></a>
          <a href="https://github.com/alansahlan65" data-magnet="text"><span data-magnet-part>GitHub</span></a>
          <a href="https://www.behance.net/muhammadsahlanshadiq" data-magnet="text"><span data-magnet-part>Behance</span></a>
          <span className="resume-pending" aria-disabled="true">Resume coming soon</span>
        </nav>
        <div className="footer-bottom">
          <Link className="footer-home" href="/" aria-label="Alan Sahlan, home" data-magnet="text">
            <Image src="/images/alan-logo.png" alt="" width={64} height={64} data-magnet-part /><span data-magnet-part>Alan Sahlan</span>
          </Link>
          <p>© {new Date().getFullYear()} Alan Sahlan</p>
        </div>
        <p className="preview-note">Development preview. Resume, typography, and remaining interactions are in progress.</p>
      </div>
    </footer>
  );
}
