import type { Metadata } from "next";
import Image from "next/image";
import { CaseMediaSequence, type CaseMediaPanel } from "../../components/case-media-sequence";
import { PageTransition } from "../../components/page-transition";
import { ProjectImageTransition } from "../../components/project-transition";
import { ReturnToWorkLink } from "../../components/return-to-work-link";
import { SiteFooter } from "../../components/site-footer";
import { SiteHeader } from "../../components/site-header";
import { ArrowIcon } from "../../components/ui-icons";

const liveUrl = "https://pawfriend-topaz.vercel.app/";
const description = "A self-initiated pet-adoption concept connecting resident browsing, saved favorites, and preparation for a first visit.";

export const metadata: Metadata = {
  title: "PawFriend | Alan Sahlan",
  description,
  openGraph: { title: "PawFriend | Alan Sahlan", description },
};

const panels: readonly CaseMediaPanel[] = [
  {
    id: "catalog",
    title: "Browse beyond the portrait",
    description: "The homepage features five pets. View all nine residents opens a grid with the same age, breed, personality, and meeting details for each sample profile. Comparison no longer depends on stepping through a carousel.",
    image: "/images/pawfriend-catalog.webp",
    alt: "PawFriend expanded resident grid with Milo, Luna, and Pepper, showing age, breed, personality descriptions, favorites, and meeting links",
    width: 1440, height: 900,
    caption: "Live concept, captured 27 September 2026. Expanded sample catalog.",
  },
  {
    id: "shortlist",
    title: "Keep a shortlist while considering the fit",
    description: "Saving a pet updates the count and confirms the choice. The drawer holds the shortlist with a remove action on each profile. In the recorded browser, Milo and Luna survived a reload; removing Milo left Luna saved.",
    image: "/images/pawfriend-shortlist.webp",
    alt: "PawFriend saved-pets drawer containing Milo and Luna, removal controls, a saved count of two, and confirmation that Luna was added",
    width: 1440, height: 900,
    caption: "Live concept, captured 27 September 2026. Two saved sample profiles.",
  },
  {
    id: "prepare",
    title: "Turn interest into preparation",
    description: "Plan a meeting opens preparation guidance and an FAQ. It asks people to think about routines and questions for a first visit. It does not submit an adoption request or book a time.",
    image: "/images/pawfriend-prepare.webp",
    alt: "PawFriend first-visit preparation section with saving favorites, comparing daily life, bringing questions, and adoption FAQ",
    width: 1440, height: 900,
    caption: "Live concept, captured 27 September 2026. First-visit guidance.",
  },
];

export default function PawFriendPage() {
  return (
    <PageTransition name="pawfriend-page">
      <SiteHeader page="work" />
      <main id="main" className="case-study case-study--pawfriend" tabIndex={-1}>
        <div className="page-width">
          <div className="case-topline">
            <p className="section-label">03 / Pet adoption / Self-initiated concept</p>
            <ReturnToWorkLink />
          </div>
          <header className="case-intro">
            <h1 className="case-title" tabIndex={-1}>PawFriend</h1>
            <p className="case-lead">A pet is more than a photograph. I directed PawFriend&apos;s design and built an AI-assisted concept for comparing residents, saving a shortlist, and preparing for a visit.</p>
          </header>
          <figure className="case-hero">
            <ProjectImageTransition slug="pawfriend">
              <Image src="/images/pawfriend-interface.webp" width={1440} height={900}
                alt="PawFriend live concept homepage with Milo, a tan and white dog, bold resident-browsing invitation, and saved-pets navigation"
                preload sizes="(max-width: 768px) 92vw, (max-width: 1440px) 86vw, 1280px" />
            </ProjectImageTransition>
            <figcaption>Live concept captured 27 September 2026. Sample profiles with generated pet imagery.</figcaption>
          </figure>
          <dl className="case-facts">
            <div><dt>Audience</dt><dd>Prospective adopters weighing personality, care, and household fit.</dd></div>
            <div><dt>My role and collaborators</dt><dd>Design direction and ChatGPT-assisted implementation. No other design or build collaborators.</dd></div>
            <div><dt>Status</dt><dd>Self-initiated concept</dd></div>
            <div><dt>Evidence</dt><dd>Observed live interface and recorded interactions. No actual shelter inventory or adoption outcomes are established.</dd></div>
          </dl>
          <a className="case-live-link" href={liveUrl} data-magnet="text"><span data-magnet-part>View the live PawFriend concept</span> <span data-magnet-part aria-hidden="true"><ArrowIcon /></span></a>
          <a className="case-live-link" href="https://github.com/alansahlan65/pawfriend" data-magnet="text"><span data-magnet-part>View PawFriend source code</span> <span data-magnet-part aria-hidden="true"><ArrowIcon /></span></a>
        </div>
        <section className="case-decisions page-width" aria-labelledby="pawfriend-decisions">
          <h2 id="pawfriend-decisions">Design decisions</h2>
          <div className="case-decision">
            <h3>Put personality beside practical details</h3>
            <p>I kept age, breed, personality, and daily-life traits beside the photo. The details help someone compare a sample pet with their routine; they are not verified animal assessments.</p>
          </div>
          <div className="case-decision">
            <h3>Make saving visible and reversible</h3>
            <p>The heart, header count, confirmation, and drawer all reflect one shortlist. Removal is just as easy as saving, and the interface says the list stays on this device.</p>
          </div>
          <div className="case-decision">
            <h3>Explain the next step before commitment</h3>
            <p>I routed meeting interest to a checklist and FAQ, not an instant booking form. A real visit needs confirmed pet details and a conversation first.</p>
          </div>
        </section>
        <CaseMediaSequence id="pawfriend-media" title="From browsing to a first visit" panels={panels} skipTo="pawfriend-implementation" skipLabel="Skip to implementation considerations" />
        <section className="case-reading page-width" aria-labelledby="pawfriend-implementation">
          <h2 id="pawfriend-implementation" tabIndex={-1}>Implementation considerations</h2>
          <div>
            <p>The source stores favorites locally, filters stale IDs against the current catalog, and keeps the current selection if a storage write fails. The recording confirms persistence after a reload in one browser.</p>
            <p>A real service would need a verified shelter feed, current availability, cross-device accounts if needed, and an explicit way to request, change, or cancel a meeting. This concept stops at preparation.</p>
          </div>
        </section>
        <section className="case-reading page-width" aria-labelledby="pawfriend-recording">
          <h2 id="pawfriend-recording">Observed live flow</h2>
          <div><p id="pawfriend-recording-description">The silent recording follows an empty shortlist through browsing, saving Milo and Luna, opening the drawer, and reading visit guidance. Both saves survive a reload; removing Milo leaves Luna.</p>
          <video className="case-recording" width={1440} height={900} controls playsInline preload="none" poster="/images/pawfriend-catalog.webp" aria-label="PawFriend live concept browsing and shortlist recording" aria-describedby="pawfriend-recording-description">
            <source src="/media/pawfriend-observed-flow.webm" type="video/webm" />
            <a href="/media/pawfriend-observed-flow.webm" data-magnet="text">Open the PawFriend live concept recording</a>
          </video>
          <a className="case-live-link" href="/media/pawfriend-observed-flow.webm" data-magnet="text"><span data-magnet-part>Open the PawFriend live concept recording</span> <span data-magnet-part aria-hidden="true"><ArrowIcon /></span></a></div>
        </section>
        <section className="case-reading page-width" aria-labelledby="pawfriend-evidence">
          <h2 id="pawfriend-evidence">What the evidence shows</h2>
          <div>
            <p>The screenshots and recording show the live concept. The repository explains its implementation. Profiles and pet images are generated sample content, not shelter records; no adoption or measured outcome is claimed.</p>
            <p>The lesson here is about pacing. Browsing leads to a reversible shortlist, then to preparation. It does not pretend that a saved heart means a meeting is booked.</p>
          </div>
          <ReturnToWorkLink className="case-return" />
        </section>
      </main>
      <SiteFooter />
    </PageTransition>
  );
}
