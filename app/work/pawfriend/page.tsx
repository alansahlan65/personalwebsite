import type { Metadata } from "next";
import { createPageMetadata } from "../../lib/metadata";
import Image from "next/image";
import { CaseMediaSequence, type CaseMediaPanel } from "../../components/case-media-sequence";
import { PageTransition } from "../../components/page-transition";
import { ProjectImageTransition } from "../../components/project-transition";
import { ReturnToWorkLink } from "../../components/return-to-work-link";
import { SiteFooter } from "../../components/site-footer";
import { SiteHeader } from "../../components/site-header";
import { ArrowIcon } from "../../components/ui-icons";

const liveUrl = "https://pawfriend-topaz.vercel.app/";
const description = "A pet-adoption concept for comparing profiles, saving a shortlist and preparing for a first visit.";

export const metadata: Metadata = createPageMetadata(
  "PawFriend | Alan Sahlan", description,
  { url: "/work/pawfriend/opengraph-image.jpg", alt: "PawFriend live pet-adoption concept with Milo and resident browsing." },
);

const panels: readonly CaseMediaPanel[] = [
  {
    id: "catalog",
    title: "Browse beyond the portrait",
    description: "Profiles pair personality with age and breed. Five featured pets introduce the catalog, with a nine-profile grid for comparing more animals.",
    image: "/images/pawfriend-catalog.webp",
    alt: "PawFriend expanded resident grid with Milo, Luna, and Pepper, showing age, breed, personality descriptions, favorites, and meeting links",
    width: 1440, height: 900,
    label: "Pet profiles",
    detail: { x: 57, y: 592, width: 421, height: 210, alt: "Milo sample pet profile with age, personality, meeting action and save control" },
  },
  {
    id: "shortlist",
    title: "Make saving reversible",
    description: "Saved pets stay in the same browser after a reload. Each has a remove control, so visitors can revise their shortlist without creating an account.",
    image: "/images/pawfriend-shortlist.webp",
    alt: "PawFriend saved-pets drawer containing Milo and Luna, removal controls, a saved count of two, and confirmation that Luna was added",
    width: 1440, height: 900,
    label: "Saved pets",
    detail: { x: 1001, y: 216, width: 439, height: 252, alt: "Saved Milo and Luna sample profiles with an individual remove control beside each" },
  },
  {
    id: "prepare",
    title: "Turn interest into preparation",
    description: "Meeting links lead to first-visit guidance. Visitors can compare the pet's needs with their household routines and prepare questions about care.",
    image: "/images/pawfriend-prepare.webp",
    alt: "PawFriend first-visit preparation section with saving favorites, comparing daily life, bringing questions, and adoption FAQ",
    width: 1440, height: 900,
    label: "First visit",
    detail: { x: 873, y: 163, width: 267, height: 280, alt: "Compare daily life guidance covering energy, routines, space, other pets and everyone at home" },
  },
];

export default function PawFriendPage() {
  return (
    <PageTransition name="pawfriend-page">
      <SiteHeader page="work" />
      <main id="main" className="case-study case-study--pawfriend" tabIndex={-1}>
        <div className="page-width">
          <div className="case-topline">
            <ReturnToWorkLink />
          </div>
          <header className="case-intro">
            <h1 className="case-title" tabIndex={-1}>PawFriend</h1>
            <p className="case-lead">Compare pets, save a shortlist, and prepare for a first visit.</p>
          </header>
          <figure className="case-hero">
            <ProjectImageTransition slug="pawfriend">
              <Image src="/images/pawfriend-interface.webp" width={1440} height={900}
                alt="PawFriend live concept homepage with Milo, a tan and white dog, bold resident-browsing invitation, and saved-pets navigation"
                preload sizes="(max-width: 768px) 92vw, (max-width: 1440px) 86vw, 1280px" />
            </ProjectImageTransition>
          </figure>
          <dl className="case-facts">
            <div><dt>Project</dt><dd>Self-initiated adoption concept</dd></div>
            <div><dt>My role</dt><dd>Solo design direction and ChatGPT-assisted build</dd></div>
            <div><dt>Scope</dt><dd>Browsing, saved pets and visit preparation</dd></div>
          </dl>
          <p className="case-brief">I designed sample pet profiles around personality and daily routines, with a shortlist to help visitors compare pets before a first visit.</p>
          <a className="case-live-link" href={liveUrl} data-magnet="text"><span data-magnet-part>View the live PawFriend concept</span> <span data-magnet-part aria-hidden="true"><ArrowIcon /></span></a>
        </div>
        <CaseMediaSequence id="pawfriend-media" title="From browsing to a first visit" panels={panels} skipTo="pawfriend-implementation" skipLabel="Skip to build notes" />
        <section className="case-support page-width" aria-label="Project scope and supporting detail">
          <details className="case-notes">
            <summary id="pawfriend-implementation">Build notes and recording</summary>
            <div>
          <p>The concept uses sample pets and AI-generated imagery. Favorites stay in the same browser through local storage.</p>
          <a className="case-live-link" href="https://github.com/alansahlan65/pawfriend" data-magnet="text"><span data-magnet-part>View PawFriend source code</span> <span data-magnet-part aria-hidden="true"><ArrowIcon /></span></a>
          <p id="pawfriend-recording-description">The recording follows browsing, saving Milo and Luna, editing the shortlist and preparing for a visit.</p>
          <video className="case-recording" width={1440} height={900} controls playsInline preload="none" poster="/images/pawfriend-catalog.webp" aria-label="PawFriend live concept browsing and shortlist recording" aria-describedby="pawfriend-recording-description">
            <source src="/media/pawfriend-observed-flow.webm" type="video/webm" />
            <a href="/media/pawfriend-observed-flow.webm" data-magnet="text">Open the PawFriend live concept recording</a>
          </video>
          <a className="case-live-link" href="/media/pawfriend-observed-flow.webm" data-magnet="text"><span data-magnet-part>Open the PawFriend live concept recording</span> <span data-magnet-part aria-hidden="true"><ArrowIcon /></span></a>
            </div>
          </details>
          <ReturnToWorkLink className="case-return" />
        </section>
      </main>
      <SiteFooter />
    </PageTransition>
  );
}
