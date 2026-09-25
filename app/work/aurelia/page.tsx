import type { Metadata } from "next";
import Image from "next/image";
import { ReturnToWorkLink } from "../../components/return-to-work-link";
import { SiteHeader } from "../../components/site-header";
import { SiteFooter } from "../../components/site-footer";

export const metadata: Metadata = {
  title: "Aurelia — Alan Sahlan",
  description: "A self-initiated hospitality concept for comparing Bali stays by the kind of trip visitors want.",
  openGraph: {
    title: "Aurelia — Alan Sahlan",
    description: "A self-initiated hospitality concept designed and built by Alan Sahlan.",
  },
};

export default function AureliaPage() {
  return (
    <>
      <SiteHeader page="work" />
      <main id="main" className="case-study" tabIndex={-1}>
        <div className="page-width">
          <div className="case-topline">
            <p className="section-label">01 / Hospitality / Self-initiated concept</p>
            <ReturnToWorkLink />
          </div>
          <header className="case-intro">
            <h1 tabIndex={-1}>Aurelia</h1>
            <p className="case-lead">A Bali stay can look right in photographs and still be wrong for the trip. Aurelia helps visitors compare stays by the days they want to have, then check practical details before making a request.</p>
          </header>
          <dl className="case-facts">
            <div><dt>Audience</dt><dd>People planning a Bali stay who need to weigh location, pace, and practical fit.</dd></div>
            <div><dt>My role</dt><dd>I designed and built this self-initiated concept independently.</dd></div>
            <div><dt>Collaborators</dt><dd>None.</dd></div>
            <div><dt>Status</dt><dd>Concept. A request on the live site is not a confirmed booking.</dd></div>
          </dl>
          <a className="case-live-link" href="https://aurelia.alansahlanwork.workers.dev/">View the live Aurelia concept <span aria-hidden="true">↗</span></a>
        </div>
        <figure className="case-hero page-width">
          <Image
            src="/images/aurelia-interface.webp"
            width={1440}
            height={900}
            alt="Aurelia concept homepage with a Bali villa photograph, stay search, and trip planning controls"
            preload
            sizes="(max-width: 768px) 92vw, (max-width: 1440px) 86vw, 1280px"
          />
          <figcaption>Live concept homepage, captured 25 September 2026.</figcaption>
        </figure>
        <section className="case-decisions page-width" aria-labelledby="case-decisions-title">
          <h2 id="case-decisions-title">Design decisions</h2>
          <div className="case-decision">
            <h3>Start with the kind of day</h3>
            <p>The concept groups stays by three trip intentions: resting in, exploring from the house, or working for longer. Visitors can then narrow the catalog by area.</p>
          </div>
          <div className="case-decision">
            <h3>Make the checks clear</h3>
            <p>Access, noise, Wi-Fi, privacy, and the limits of photographs sit alongside the visual appeal. The request flow states that availability and final pricing need confirmation before commitment.</p>
          </div>
          <ReturnToWorkLink className="case-return" />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
