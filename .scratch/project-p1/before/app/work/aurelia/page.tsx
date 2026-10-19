import { ArrowIcon } from "../../components/ui-icons";
import type { Metadata } from "next";
import { createPageMetadata } from "../../lib/metadata";
import { CaseMediaSequence, type CaseMediaPanel } from "../../components/case-media-sequence";
import Image from "next/image";
import { ProjectImageTransition } from "../../components/project-transition";
import { ReturnToWorkLink } from "../../components/return-to-work-link";
import { SiteHeader } from "../../components/site-header";
import { SiteFooter } from "../../components/site-footer";
import { PageTransition } from "../../components/page-transition";

export const metadata: Metadata = createPageMetadata(
  "Aurelia — Alan Sahlan",
  "A self-initiated hospitality concept for comparing Bali stays by the kind of trip visitors want.",
  { url: "/work/aurelia/opengraph-image.jpg", alt: "Aurelia live concept homepage showing a Bali stay and trip planning controls." },
);

const panels: readonly CaseMediaPanel[] = [
  { id: "filters", label: "Empty results", title: "Give empty results an exit", description: "Trip type and area narrow the catalog. When no stays match, Show all ten stays resets both filters.", width: 1440, height: 900, caption: "Live concept, 26 September 2026.", image: "/images/aurelia-filters.webp", alt: "Aurelia catalog with Work and stay longer and Uluwatu selected, no matching stays, and a Show all ten stays action", detail: { x: 48, y: 676, width: 660, height: 165, alt: "Aurelia no-matching-stays message and Show all ten stays recovery action", caption: "Empty-result detail: an explanation and a way to clear the filters." } },
  { id: "details", label: "Stay details", title: "Compare without starting over", description: "Photos, amenities and Wi-Fi stay in an overlay. Closing it returns to the same catalog, ready to compare another stay.", width: 1440, height: 900, caption: "Live concept, 26 September 2026.", image: "/images/aurelia-details.webp", alt: "Awan Cliff House detail overlay showing its Wi-Fi information beside the stay photograph", detail: { x: 756, y: 312, width: 560, height: 165, alt: "Aurelia Wi-Fi tab and connection guidance to confirm speed and coverage before working remotely", caption: "Stay-detail crop: connection guidance, with speed and coverage to confirm." } },
  { id: "request", label: "Stay request", title: "Keep the request honest", description: "A persistent summary keeps dates editable. The request clearly leaves availability and final pricing unconfirmed.", width: 1440, height: 900, caption: "Live concept, 26 September 2026.", image: "/images/aurelia-request.webp", alt: "Aurelia stay request at the Dates step with its request summary and confirmation notice", detail: { x: 345, y: 456, width: 288, height: 423, alt: "Aurelia persistent request summary and notice that planning does not hold dates or confirm final pricing", caption: "Request-summary detail: editable choices and the availability boundary." } },
];

export default function AureliaPage() {
  return (
    <PageTransition name="aurelia-page">
      <SiteHeader page="work" />
      <main id="main" className="case-study" tabIndex={-1}>
        <div className="page-width">
          <div className="case-topline">
            <ReturnToWorkLink />
          </div>
          <header className="case-intro">
            <h1 className="case-title" tabIndex={-1}>Aurelia</h1>
            <p className="case-lead">A Bali stay finder built around the trip you want.</p>
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
            <div><dt>Project</dt><dd>Self-initiated hospitality concept</dd></div>
            <div><dt>My role</dt><dd>Solo product design and frontend build</dd></div>
            <div><dt>Scope</dt><dd>Browse, compare and request a stay</dd></div>
          </dl>
          <a className="case-live-link" href="https://aurelia.alansahlanwork.workers.dev/" data-magnet="text"><span data-magnet-part>View the live Aurelia concept</span> <span data-magnet-part aria-hidden="true"><ArrowIcon /></span></a>
        </div>
        <CaseMediaSequence id="aurelia-media" title="Inside the concept" panels={panels} skipTo="aurelia-implementation" skipLabel="Skip to implementation notes" />
        <section className="case-support page-width" aria-label="Project scope and supporting detail">
          <p>The live concept demonstrates browsing and requests. It does not confirm real inventory or completed bookings.</p>
          <details className="case-notes">
            <summary id="aurelia-implementation">Build notes and recording</summary>
            <div><p>I separated browsing, stay details and requests. Filters recover from zero results, and Back preserves entered dates.</p>
            <p>The recording follows an empty result, Wi-Fi details and a request that returns to editable dates.</p>
            <video className="case-recording" controls preload="none" poster="/images/aurelia-details.webp" width={1440} height={900} aria-label="Recorded Aurelia filter, stay details, and request workflow">
              <source src="/media/aurelia-observed-flow.webm" type="video/webm" />
              <a href="/media/aurelia-observed-flow.webm" data-magnet="text"><span data-magnet-part>Open the Aurelia workflow recording</span></a>
            </video>
            <p className="case-recording-caption">Recorded from the live concept on 26 September 2026 with sample dates. No request was sent.</p>
            </div>
          </details>
          <ReturnToWorkLink className="case-return" />
        </section>
      </main>
      <SiteFooter />
    </PageTransition>
  );
}
