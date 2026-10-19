import type { Metadata } from "next";
import { ArrowIcon } from "../../components/ui-icons";
import { createPageMetadata } from "../../lib/metadata";
import { AureliaOpener } from "./aurelia-opener";
import { ProjectScreen } from "../project-screen";
import { ReturnToWorkLink } from "../../components/return-to-work-link";
import { SiteHeader } from "../../components/site-header";
import { SiteFooter } from "../../components/site-footer";
import { PageTransition } from "../../components/page-transition";
import detail from "../project-detail.module.css";
import styles from "./aurelia.module.css";

const live = "https://aurelia.alansahlanwork.workers.dev/";
const figma = "https://www.figma.com/design/nzrjEnmrDqfXUPLawnxmEn/Dump?node-id=274-7511";
const assets = "/images/figma/aurelia";

export const metadata: Metadata = createPageMetadata(
  "Aurelia | Alan Sahlan",
  "A Bali hospitality concept for exploring ten stays, comparing areas and practical details, and preparing an editable stay plan.",
  { url: "/work/aurelia/opengraph-image.jpg", alt: "Aurelia Bali hospitality concept with stay discovery and planning controls." },
);

const journey = [
  { href: "#aurelia-discovery", title: "Find a setting", body: "Choose a holiday rhythm and area." },
  { href: "#aurelia-collection", title: "Browse the stays", body: "Narrow the ten-house collection." },
  { href: "#aurelia-details", title: "Compare the details", body: "Explore the house and practical checks." },
  { href: "#aurelia-request", title: "Prepare a stay plan", body: "Set dates, preferences and contact details." },
] as const;

const requestScreens = [
  { file: "request-dates", label: "1. Dates and guests", caption: "Choose arrival, departure and party size. Completed steps remain editable.", alt: "Complete Aurelia Dates form with check-in, check-out, adults, children and Continue action" },
  { file: "request-preferences", label: "2. Stay preferences", caption: "Choose a holiday rhythm. Area, house and nightly budget can stay open.", alt: "Complete Aurelia Stay form with holiday rhythm, optional preferred stay, area and nightly budget" },
  { file: "request-contact", label: "3. Contact and summary", caption: "Add contact details and special requests, then check the dates and selected stay.", alt: "Complete Aurelia Contact form with name, email, optional phone, special requests and request summary" },
  { file: "request-review", label: "Stay-plan review", caption: "See a local reference and suggested stays, with an option to compare them in Ask Aurelia.", alt: "Complete Aurelia stay-plan review with a plan reference, three suggested stays and Ask Aurelia action" },
] as const;

export default function AureliaPage() {
  return (
    <PageTransition name="aurelia-page">
      <SiteHeader page="work" />
      <main id="main" className={`case-study case-study--aurelia ${detail.case}`} tabIndex={-1}>
        <div className="page-width">
          <div className={`case-topline ${detail.topline}`}><ReturnToWorkLink /></div>
          <header className={`case-intro ${detail.intro}`}>
            <h1 className="case-title" tabIndex={-1}>Aurelia</h1>
            <div>
              <p className="case-lead">A Bali stay finder built around the trip you want.</p>
              <div className={detail.sourceLinks}>
                <a href={live} data-pointer-feedback="local">View the live Aurelia concept <ArrowIcon /></a>
                <a href={figma} data-pointer-feedback="local">Explore the Aurelia designs <ArrowIcon /></a>
              </div>
            </div>
          </header>
          <AureliaOpener />
          <p className={`case-motion-note ${styles.motionNote}`}>Portfolio motion study</p>
          <dl className={`case-facts ${detail.facts}`}>
            <div><dt>Project</dt><dd>Self-initiated hospitality concept</dd></div>
            <div><dt>My role</dt><dd>Solo design direction and AI-assisted build</dd></div>
            <div><dt>Scope</dt><dd>Discover, compare and plan a Bali stay</dd></div>
          </dl>
        </div>
        <section id="aurelia-media" className={`page-width ${detail.section}`} aria-labelledby="aurelia-purpose-title">
          <div className={detail.heading}>
            <h2 id="aurelia-purpose-title">Help guests choose a house and plan their stay</h2>
            <p>I designed and built Aurelia around ten fictional homes across Bali. The website connects the feel of a holiday with the details needed to choose a stay: location, guest capacity, price and everyday comfort.</p>
          </div>
          <nav className={styles.journey} aria-label="Aurelia website flow">
            <ol>{journey.map((step, index) => (
              <li key={step.href}>
                <a href={step.href} data-pointer-feedback="local">
                  <span className={styles.stepNumber}>{index + 1}</span>
                  <span><strong>{step.title}</strong><span className={styles.stepBody}>{step.body}</span></span>
                  <ArrowIcon />
                </a>
              </li>
            ))}</ol>
          </nav>
        </section>
        <section id="aurelia-discovery" tabIndex={-1} className={`page-width ${detail.section}`} aria-labelledby="aurelia-discovery-title">
          <div className={detail.heading}>
            <h2 id="aurelia-discovery-title">Start with how you want to spend your days</h2>
            <p>Rest and stay in, explore from here, or work and stay longer. These holiday rhythms give visitors a starting point. Area guidance helps them compare settings before narrowing the collection.</p>
          </div>
          <div className={styles.discovery}>
            <ProjectScreen image={`${assets}/holiday-rhythm.svg`} width={1912} height={1247} label="Choose a holiday rhythm"
              alt="Complete Aurelia holiday-rhythm section with Rest and stay in, Explore from here and Work and stay longer options beside a shaded villa photograph" />
            <ProjectScreen image={`${assets}/areas.svg`} width={1912} height={1332} label="Compare Bali areas"
              alt="Complete Aurelia area guide with Uluwatu, Ubud, Pererenan and Canggu, Seminyak, Sanur, Nusa Dua and Sidemen, with Uluwatu selected" />
          </div>
        </section>
        <section id="aurelia-collection" tabIndex={-1} className={`page-width ${detail.section}`} aria-labelledby="aurelia-collection-title">
          <div className={detail.heading}>
            <h2 id="aurelia-collection-title">Narrow the collection without losing your place</h2>
            <p>Holiday rhythm and area filter the ten-stay collection. Each card keeps the house, capacity and indicative nightly rate together. View stay opens its details. From there, Check these dates starts a plan for that house. If filters return no matches, Show all ten stays clears them.</p>
          </div>
          <ProjectScreen image={`${assets}/collection.svg`} width={1912} height={1575} label="Browse and filter the collection"
            alt="Complete Aurelia stay-collection section with holiday-rhythm and area filters, a carousel of houses, capacity, indicative IDR rates, View stay and Check dates actions" />
        </section>
        <section id="aurelia-details" tabIndex={-1} className={`page-width ${detail.section}`} aria-labelledby="aurelia-details-title">
          <div className={detail.heading}>
            <h2 id="aurelia-details-title">Show the house beyond its first photograph</h2>
            <p>The featured house can be explored through exterior, materials, interior and setting views. Collection details add a gallery, amenities, services, nearby places and Wi-Fi guidance. Closing the overlay returns visitors to their filtered list.</p>
          </div>
          <ProjectScreen image={`${assets}/residence.svg`} width={1912} height={1349} label="Explore Awan Cliff House"
            alt="Complete Aurelia featured-house section with Exterior, Materials, Interior and Setting tabs, house photographs, setting, pool, guest capacity and Check Awan Cliff House action" />
          <div className={styles.practical}>
            <div className={detail.decisionCopy}>
              <h3>Make everyday comfort part of the decision</h3>
              <p>The Aurelia check explains access, sleep, Wi-Fi, noise, privacy and what the photographs show. Wi-Fi notes ask guests to confirm speed and coverage before planning remote work.</p>
            </div>
            <ProjectScreen image={`${assets}/standards.svg`} width={1912} height={1830} label="The Aurelia check"
              alt="Complete Aurelia practical-check section covering the road in, room at night, connection, noise, privacy and photographs, followed by the request-before-confirmation process" />
          </div>
        </section>
        <section id="aurelia-request" tabIndex={-1} className={`page-width ${detail.section}`} aria-labelledby="aurelia-request-title">
          <div className={detail.heading}>
            <h2 id="aurelia-request-title">Carry each choice into an editable stay plan</h2>
            <p>The homepage passes dates, guests and area into the request. Choosing a house carries it forward too. Three form steps lead to a review, with a persistent summary and Back controls to revise earlier choices.</p>
          </div>
          <ol className={styles.requestFlow} aria-label="Stay request steps and review">
            {requestScreens.map(screen => (
              <li key={screen.file}>
                <ProjectScreen image={`${assets}/${screen.file}.svg`} width={700} height={946} label={screen.label} caption={screen.caption} alt={screen.alt} />
              </li>
            ))}
          </ol>
          <div className={styles.planOutcome}>
            <p>The review suggests up to three houses based on holiday rhythm, area, guest capacity and budget.</p>
            <p>The concept prepares the plan in the browser. It does not send a request, take payment or hold dates. Availability and final pricing require confirmation.</p>
          </div>
        </section>
        <section className={`page-width ${detail.section} ${styles.supporting}`} aria-labelledby="aurelia-guidance-title">
          <div className={detail.decisionCopy}>
            <h2 id="aurelia-guidance-title">Keep guidance close to the next step</h2>
            <p>Ask Aurelia compares areas and suggests houses using prepared guidance from the same collection. Selecting a suggested house opens its stay request.</p>
            <dl className={styles.features}>
              <div><dt>Two languages</dt><dd>English and Indonesian across the website and planner.</dd></div>
              <div><dt>Light and dark</dt><dd>Prepared photography supports both themes.</dd></div>
              <div><dt>Flexible controls</dt><dd>Keyboard and touch controls, responsive layouts and reduced-motion alternatives.</dd></div>
            </dl>
          </div>
          <ProjectScreen image={`${assets}/hero-dark.svg`} width={1912} height={948} label="The homepage in dark mode"
            alt="Complete Aurelia dark-theme hero with evening villa photography and the dates, guests and area planning form" />
        </section>
        <section id="aurelia-implementation" className={`page-width ${detail.closing}`} aria-labelledby="aurelia-delivery-title">
          <h2 id="aurelia-delivery-title">A complete discovery and planning concept</h2>
          <p>The build connects editorial browsing, house comparison and a stay plan in one journey. The collection uses fictional property names, indicative prices and AI-generated photography.</p>
          <details className="case-notes">
            <summary>Build notes and workflow recording</summary>
            <div>
              <p>Next.js and React support the interface. GSAP and Lenis handle motion and scrolling; Embla supports the collection carousel. Stay details, filters, planning recommendations and Ask Aurelia share the same content. Ask Aurelia uses local rules and prepared responses.</p>
              <p>The recording follows filters, Wi-Fi details and an editable stay request.</p>
              <video className="case-recording" controls preload="none" poster={`${assets}/residence.preview.svg`} width={1440} height={900} aria-label="Recorded Aurelia filter, stay details, and request workflow">
                <source src="/media/aurelia-observed-flow.webm" type="video/webm" />
                <a href="/media/aurelia-observed-flow.webm" data-pointer-feedback="local">Open the Aurelia workflow recording</a>
              </video>
            </div>
          </details>
          <div className={detail.sourceLinks}>
            <a href={live} data-pointer-feedback="local">Explore the live Aurelia concept <ArrowIcon /></a>
            <a href={figma} data-pointer-feedback="local">Open the Aurelia Figma file <ArrowIcon /></a>
          </div>
          <ReturnToWorkLink className="case-return" />
        </section>
      </main>
      <SiteFooter />
    </PageTransition>
  );
}
