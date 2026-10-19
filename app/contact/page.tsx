import type { Metadata } from "next";
import { createPageMetadata } from "../lib/metadata";
import { PageTransition } from "../components/page-transition";
import { SiteHeader } from "../components/site-header";
import { SiteFooter } from "../components/site-footer";
import { ArrowIcon } from "../components/ui-icons";
import { CONTACT_EMAIL } from "../lib/portfolio-links";
import { ContactForm } from "./contact-form";
import styles from "./contact.module.css";

export const metadata: Metadata = createPageMetadata(
  "Contact Alan Sahlan | Product Designer",
  "Contact Alan Sahlan about a design role, project or collaboration.",
);

export default function Contact() {
  return (
    <PageTransition name="contact-page">
      <SiteHeader page="contact" />
      <main id="main" tabIndex={-1} className={`page-width ${styles.page}`}>
        <div className={styles.intro}>
          <h1 tabIndex={-1}>Let’s work<br />together<span className={styles.accent}>.</span></h1>
          <p className={styles.lead}>Have a role, project, or idea in mind? Tell me a little about it.</p>
          <div className={styles.directContact}>
            <p>Prefer email?</p>
            <a href={`mailto:${CONTACT_EMAIL}`} data-magnet="text">
              <span data-magnet-part>{CONTACT_EMAIL}</span>
              <span aria-hidden="true" data-magnet-part><ArrowIcon /></span>
            </a>
          </div>
          <p className={`location ${styles.location}`}><span className="location-id" aria-hidden="true">ID</span>Based in Indonesia</p>
        </div>
        <ContactForm />
      </main>
      <SiteFooter compact />
    </PageTransition>
  );
}
