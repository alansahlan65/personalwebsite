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
    description: "The featured carousel introduces five pets. View all nine residents opens a grid with consistent age, breed, personality, and meeting actions. The expanded view makes the same details available across the sample catalog without requiring visitors to move through one card at a time.",
    image: "/images/pawfriend-catalog.webp",
    alt: "PawFriend expanded resident grid with Milo, Luna, and Pepper, showing age, breed, personality descriptions, favorites, and meeting links",
    width: 1440, height: 900,
    caption: "Live concept, captured 27 September 2026. Expanded sample catalog.",
  },
  {
    id: "shortlist",
    title: "Keep a shortlist while considering the fit",
    description: "Saving Milo and Luna updates the header count and confirms the latest addition. The saved-pets drawer brings both profiles together with individual removal controls. In the observed flow, the shortlist survived a reload in the same browser; removing Milo left Luna saved.",
    image: "/images/pawfriend-shortlist.webp",
    alt: "PawFriend saved-pets drawer containing Milo and Luna, removal controls, a saved count of two, and confirmation that Luna was added",
    width: 1440, height: 900,
    caption: "Live concept, captured 27 September 2026. Two saved sample profiles.",
  },
  {
    id: "prepare",
    title: "Turn interest into preparation",
    description: "Plan a meeting leads to guidance about saving favorites, comparing daily life, and bringing questions. The nearby FAQ covers visits and practical decisions. This action opens preparation content; it does not book a meeting or submit an adoption request.",
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
            <p className="case-lead">Choosing a pet involves more than liking a photograph. PawFriend is a self-initiated pet-adoption concept that connects short profiles, saved favorites, and first-visit preparation. The aim is to help prospective adopters consider their home and daily routine before planning a meeting.</p>
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
            <div><dt>Audience</dt><dd>Prospective adopters considering a pet&apos;s personality, care needs, and fit with their household.</dd></div>
            <div><dt>Design focus</dt><dd>Resident browsing, a saved shortlist, and preparation for a first visit.</dd></div>
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
            <p>A photograph draws attention, while age, breed, and a short personality description give each profile context. The separate personality section brings energy, independence, and other daily-life traits into the decision. These are concept descriptions, rather than verified animal assessments.</p>
          </div>
          <div className="case-decision">
            <h3>Make saving visible and reversible</h3>
            <p>Each resident has a heart action. The header count, saved confirmation, and drawer reflect the same shortlist. Individual removal lets visitors reconsider a choice, and the interface states that saved pets stay on the device.</p>
          </div>
          <div className="case-decision">
            <h3>Explain the next step before commitment</h3>
            <p>Meeting links lead to preparation instead of an immediate adoption form. The checklist and FAQ prompt questions about routines, care, and introductions. The interface also asks visitors to confirm pet details before a visit.</p>
          </div>
        </section>
        <CaseMediaSequence id="pawfriend-media" title="From browsing to a first visit" panels={panels} skipTo="pawfriend-implementation" skipLabel="Skip to implementation considerations" />
        <section className="case-reading page-width" aria-labelledby="pawfriend-implementation">
          <h2 id="pawfriend-implementation" tabIndex={-1}>Implementation considerations</h2>
          <div>
            <p>The source keeps favorites in local storage, checks saved IDs against the current catalog, and retains the session&apos;s selection when storage writes fail. The recording confirms same-browser reload persistence. Profiles are local sample content; cross-device syncing and a verified shelter feed are separate requirements.</p>
            <p>Saving, removing, and dismissing a drawer need clear feedback and reachable controls. A real meeting flow would also need confirmed availability, an explicit submission step, and a way to change or cancel a request. The current meeting action leads to preparation content.</p>
          </div>
        </section>
        <section className="case-reading page-width" aria-labelledby="pawfriend-recording">
          <h2 id="pawfriend-recording">Observed live flow</h2>
          <div><p id="pawfriend-recording-description">This silent recording starts with an empty shortlist, opens the full catalog, saves Milo and Luna, and opens and closes the saved-pets drawer. Plan a meeting opens preparation guidance. A reload retains the saved profiles, then removing Milo leaves Luna. These are live concept interactions with sample content.</p>
          <video className="case-recording" width={1440} height={900} controls playsInline preload="none" poster="/images/pawfriend-catalog.webp" aria-label="PawFriend live concept browsing and shortlist recording" aria-describedby="pawfriend-recording-description">
            <source src="/media/pawfriend-observed-flow.webm" type="video/webm" />
            <a href="/media/pawfriend-observed-flow.webm" data-magnet="text">Open the PawFriend live concept recording</a>
          </video>
          <a className="case-live-link" href="/media/pawfriend-observed-flow.webm" data-magnet="text"><span data-magnet-part>Open the PawFriend live concept recording</span> <span data-magnet-part aria-hidden="true"><ArrowIcon /></span></a></div>
        </section>
        <section className="case-reading page-width" aria-labelledby="pawfriend-evidence">
          <h2 id="pawfriend-evidence">What the evidence shows</h2>
          <div>
            <p>The screenshots and recording come directly from the live concept. The public project brief and source explain its goals and implementation. These establish current interface behavior, not user-research findings, real pet availability, completed adoptions, or measured outcomes.</p>
            <p>The source records generated pet imagery and local sample profiles. They represent the concept, rather than verified shelter residents. Gallery concept artwork is separate from these captured live screens. No later reconstructed interaction demo was needed for this case study.</p>
          </div>
          <ReturnToWorkLink className="case-return" />
        </section>
      </main>
      <SiteFooter />
    </PageTransition>
  );
}
