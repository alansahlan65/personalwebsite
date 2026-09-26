import { ArrowIcon } from "../../components/ui-icons";
import type { Metadata } from "next";
import { CaseMediaSequence, type CaseMediaPanel } from "../../components/case-media-sequence";
import Image from "next/image";
import { ProjectImageTransition } from "../../components/project-transition";
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

const panels: readonly CaseMediaPanel[] = [
  { id: "filters", title: "Filters need a way back", description: "Starting from the catalog, combine a trip intention with an area. When that combination has no matches, the interface explains the empty result and offers Show all ten stays. Clearing the filters restores the catalog.", image: "/images/aurelia-filters.webp", alt: "Aurelia catalog with Work and stay longer and Uluwatu selected, no matching stays, and a Show all ten stays action" },
  { id: "details", title: "Check the fit without losing the shortlist", description: "View stay opens a detail overlay with photographs and Overview, Amenities, Area, and Wi-Fi tabs. Switching tabs changes the supporting information. Closing the overlay returns to the catalog so another stay can be compared.", image: "/images/aurelia-details.webp", alt: "Awan Cliff House detail overlay showing its Wi-Fi information beside the stay photograph" },
  { id: "request", title: "Keep commitment explicit", description: "Plan your stay opens a request with Dates, Stay, and Contact steps. The summary stays beside the form. Dates can be changed before review, and the interface states that planning does not hold them. Availability and final pricing need confirmation.", image: "/images/aurelia-request.webp", alt: "Aurelia stay request at the Dates step with its request summary and confirmation notice" },
];

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
            <h1 className="case-title" tabIndex={-1}>Aurelia</h1>
            <p className="case-lead">A Bali stay can look right in photographs and still be wrong for the trip. Aurelia helps visitors compare stays by the days they want to have, then check practical details before making a request.</p>
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
            <div><dt>Audience</dt><dd>People planning a Bali stay who need to weigh location, pace, and practical fit.</dd></div>
            <div><dt>My role</dt><dd>I designed and built this self-initiated concept independently.</dd></div>
            <div><dt>Collaborators</dt><dd>None.</dd></div>
            <div><dt>Status</dt><dd>Concept. A request on the live site is not a confirmed booking.</dd></div>
          </dl>
          <a className="case-live-link" href="https://aurelia.alansahlanwork.workers.dev/" data-magnet="text"><span data-magnet-part>View the live Aurelia concept</span> <span data-magnet-part aria-hidden="true"><ArrowIcon /></span></a>
        </div>
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
        </section>
        <CaseMediaSequence id="aurelia-media" title="Inside the concept" panels={panels} skipTo="aurelia-implementation" skipLabel="Skip to implementation notes" />
        <section className="case-reading page-width" aria-labelledby="aurelia-implementation">
          <h2 id="aurelia-implementation" tabIndex={-1}>Implementation notes</h2>
          <div><p>The live concept keeps browsing, stay details, and the request as distinct steps. Filters provide a route out of an empty result. The stay overlay keeps comparison close to the catalog, while the request makes its unconfirmed status explicit.</p>
            <p>I designed and built Aurelia independently. The screens here document the live concept; they do not establish confirmed inventory or booking outcomes.</p>
          </div>
        </section>
        <section className="case-reading page-width" aria-labelledby="aurelia-recording">
          <h2 id="aurelia-recording">Observed live flow</h2>
          <div><p>The recording follows an empty filter result back to the catalog, opens the Wi-Fi details, closes the stay, and moves from Dates to Stay before returning to edit the dates.</p>
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
    </>
  );
}
