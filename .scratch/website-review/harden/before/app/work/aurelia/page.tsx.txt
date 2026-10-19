import { ArrowIcon } from "../../components/ui-icons";
import type { Metadata } from "next";
import { CaseMediaSequence, type CaseMediaPanel } from "../../components/case-media-sequence";
import Image from "next/image";
import { ProjectImageTransition } from "../../components/project-transition";
import { ReturnToWorkLink } from "../../components/return-to-work-link";
import { SiteHeader } from "../../components/site-header";
import { SiteFooter } from "../../components/site-footer";
import { PageTransition } from "../../components/page-transition";

export const metadata: Metadata = {
  title: "Aurelia — Alan Sahlan",
  description: "A self-initiated hospitality concept for comparing Bali stays by the kind of trip visitors want.",
  openGraph: {
    title: "Aurelia — Alan Sahlan",
    description: "A self-initiated hospitality concept designed and built by Alan Sahlan.",
  },
};

const panels: readonly CaseMediaPanel[] = [
  { id: "filters", title: "Give empty results an exit", description: "Visitors can combine trip intention and area. If nothing matches, the page explains the result and Show all ten stays clears both filters. The search never ends at a dead end.", width: 1440, height: 900, caption: "Live concept, 26 September 2026.", image: "/images/aurelia-filters.webp", alt: "Aurelia catalog with Work and stay longer and Uluwatu selected, no matching stays, and a Show all ten stays action" },
  { id: "details", title: "Check a stay without losing the catalog", description: "A detail overlay holds photographs, amenities, area, and Wi-Fi information. Closing it returns to the catalog, so visitors can compare another stay without starting over.", width: 1440, height: 900, caption: "Live concept, 26 September 2026.", image: "/images/aurelia-details.webp", alt: "Awan Cliff House detail overlay showing its Wi-Fi information beside the stay photograph" },
  { id: "request", title: "Make the request honest", description: "Dates, Stay, and Contact form one request flow with a persistent summary. Back keeps the dates editable. The interface says plainly that a request does not hold a stay or confirm its final price.", width: 1440, height: 900, caption: "Live concept, 26 September 2026.", image: "/images/aurelia-request.webp", alt: "Aurelia stay request at the Dates step with its request summary and confirmation notice" },
];

export default function AureliaPage() {
  return (
    <PageTransition name="aurelia-page">
      <SiteHeader page="work" />
      <main id="main" className="case-study" tabIndex={-1}>
        <div className="page-width">
          <div className="case-topline">
            <p className="section-label">01 / Hospitality / Self-initiated concept</p>
            <ReturnToWorkLink />
          </div>
          <header className="case-intro">
            <h1 className="case-title" tabIndex={-1}>Aurelia</h1>
            <p className="case-lead">A beautiful villa can still be wrong for the trip. I designed and built Aurelia to help visitors find a Bali stay that fits their plans.</p>
          </header>
          <figure className="case-hero">
            <ProjectImageTransition slug="aurelia">
              <Image
                src="/images/aurelia-interface.webp"
                width={1440}
                height={900}
                alt="Aurelia concept homepage with a Bali villa photograph, stay search, and trip planning controls"
                preload
                sizes="(max-width: 768px) 92vw, (max-width: 1440px) 86vw, 1280px"
              />
            </ProjectImageTransition>
            <figcaption>Live concept homepage, captured 25 September 2026.</figcaption>
          </figure>
          <dl className="case-facts">
            <div><dt>Audience</dt><dd>People comparing Bali stays by location, pace, and practical fit.</dd></div>
            <div><dt>My role</dt><dd>Independent product design and frontend build.</dd></div>
            <div><dt>Collaborators</dt><dd>None.</dd></div>
            <div><dt>Status</dt><dd>Concept. A request on the live site is not a confirmed booking.</dd></div>
          </dl>
          <a className="case-live-link" href="https://aurelia.alansahlanwork.workers.dev/" data-magnet="text"><span data-magnet-part>View the live Aurelia concept</span> <span data-magnet-part aria-hidden="true"><ArrowIcon /></span></a>
        </div>
        <section className="case-decisions page-width" aria-labelledby="case-decisions-title">
          <h2 id="case-decisions-title">Design decisions</h2>
          <div className="case-decision">
            <h3>Start with the kind of day</h3>
            <p>Most stay sites start with a destination. I put the trip first: rest, explore, or work for longer. Area then narrows the list without replacing that intent.</p>
          </div>
          <div className="case-decision">
            <h3>Make the checks clear</h3>
            <p>Photos earn attention; access, noise, Wi-Fi, and privacy help decide. I kept those checks close to the stay and made the unconfirmed price and availability clear in the request.</p>
          </div>
        </section>
        <CaseMediaSequence id="aurelia-media" title="Inside the concept" panels={panels} skipTo="aurelia-implementation" skipLabel="Skip to implementation notes" />
        <section className="case-reading page-width" aria-labelledby="aurelia-implementation">
          <h2 id="aurelia-implementation" tabIndex={-1}>Implementation notes</h2>
          <div><p>I separated browsing, stay details, and the request so each step has one job. Filters recover from zero results, the detail overlay preserves comparison context, and Back keeps entered dates available for editing.</p>
            <p>The live concept demonstrates those interactions. It does not confirm real inventory or completed bookings.</p>
          </div>
        </section>
        <section className="case-reading page-width" aria-labelledby="aurelia-recording">
          <h2 id="aurelia-recording">Observed live flow</h2>
          <div><p>The recording shows the full loop: clear an empty result, inspect Wi-Fi, close the stay, advance the request, then return to edit the dates.</p>
            <video className="case-recording" controls preload="none" poster="/images/aurelia-details.webp" width={1440} height={900} aria-label="Recorded Aurelia filter, stay details, and request workflow">
              <source src="/media/aurelia-observed-flow.webm" type="video/webm" />
              <a href="/media/aurelia-observed-flow.webm" data-magnet="text"><span data-magnet-part>Open the Aurelia workflow recording</span></a>
            </video>
            <p className="case-recording-caption">Recorded from the live concept on 26 September 2026 with sample dates. No request was sent.</p>
          </div>
          <ReturnToWorkLink className="case-return" />
        </section>
      </main>
      <SiteFooter />
    </PageTransition>
  );
}
