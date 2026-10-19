import type { Metadata } from "next";
import Image from "next/image";
import { createPageMetadata } from "../../lib/metadata";
import { ProjectScreen } from "../project-screen";
import { projectPreview } from "../../lib/project-preview";
import { PageTransition } from "../../components/page-transition";
import { MunchpalOpener } from "./munchpal-opener";
import { ReturnToWorkLink } from "../../components/return-to-work-link";
import { SiteFooter } from "../../components/site-footer";
import { SiteHeader } from "../../components/site-header";
import { ArrowIcon } from "../../components/ui-icons";
import styles from "./munchpal.module.css";
import detail from "../project-detail.module.css";

const pdf = "https://drive.google.com/file/d/10I2jSY0_W8WTrntBog6EQQRD2IMFV4Lk/view";
const prototype = "https://www.figma.com/proto/Xsj8X9CcL5SW6CoILaZFH3/MunchPal?node-id=327-4477&t=I0tPWQMFFzQHCDff-1&scaling=scale-down&content-scaling=fixed&page-id=326%3A3405&starting-point-node-id=327%3A4467&show-proto-sidebar=1";
const description = "A client food-sharing design for Surabaya. Research with residents and volunteers shaped separate meal-sharing and bulk-donation flows, original interface revisions, and a tested Figma prototype.";
const figma = "https://www.figma.com/design/nzrjEnmrDqfXUPLawnxmEn/Dump?node-id=306-1882";
const assets = "/images/figma/munchpal";

export const metadata: Metadata = createPageMetadata(
  "Munchpal | Alan Sahlan", description,
  { url: "/work/munchpal/opengraph-image.jpg", alt: "Original Munchpal food-sharing case study cover with three mobile app screen mockups" },
);

function OriginalScreen({ image, alt, label, linkLabel, composer = false }: {
  image: string;
  alt: string;
  label: string;
  linkLabel: string;
  composer?: boolean;
}) {
  return (
    <figure className={styles.screen} data-composer={composer || undefined}>
      <figcaption>{label}</figcaption>
      <a href={image} target="_blank" rel="noreferrer" aria-label={linkLabel.replace(/^Open /, "Enlarge ")} data-pointer-feedback="local">
        <span className={styles.screenViewport}>
        <Image src={projectPreview(image)} alt={alt} width={388} height={834} unoptimized />
        </span>
      </a>
    </figure>
  );
}

export default function MunchpalPage() {
  return (
    <PageTransition name="munchpal-page">
      <SiteHeader page="work" />
      <main id="main" className={`case-study case-study--munchpal ${styles.case} ${detail.case}`} tabIndex={-1}>
        <div className="page-width">
          <div className={`case-topline ${detail.topline}`}>
            <ReturnToWorkLink />
          </div>
          <header className={`case-intro ${detail.intro}`}>
            <h1 className="case-title" tabIndex={-1}>Munchpal</h1>
            <div>
              <p className="case-lead">Food sharing for residents. Donation coordination for volunteers.</p>
              <a className={`case-live-link ${styles.primaryLink}`} href={prototype} data-magnet="text">
                <span data-magnet-part>Explore the Munchpal prototype</span>
                <span data-magnet-part aria-hidden="true"><ArrowIcon /></span>
              </a>
            </div>
          </header>
          <MunchpalOpener />
          <dl className={`case-facts ${detail.facts}`}>
            <div><dt>Project</dt><dd>Client design project, Surabaya<br />September to December 2024</dd></div>
            <div><dt>My role</dt><dd>Sole UI/UX designer</dd></div>
            <div><dt>Scope</dt><dd>Research, UI and prototype evaluation</dd></div>
          </dl>
        </div>

        <div id="munchpal-case-study">
        <section id="munchpal-research" className={`page-width ${styles.research}`} aria-labelledby="munchpal-research-title">
          <div className={styles.sectionHeading}>
            <h2 id="munchpal-research-title" tabIndex={-1}>Two groups, different needs</h2>
            <p>Residents hesitated to ask for food. Volunteers needed clearer donation and pickup records. I designed separate flows for the two groups.</p>
          </div>
          <details className="case-notes">
            <summary>Research notes</summary>
            <div>
          <p>I interviewed five Surabaya residents and five Garda Pangan volunteers, then mapped needs, donation workflows, information architecture and user flows before designing the wireframes and UI.</p>
          <div className={styles.audiences}>
            <div>
              <h3>Residents needed certainty before asking</h3>
              <p>All five residents described hesitation or embarrassment. Some had surplus food go unused. They wanted clearer availability, pickup information, search, communication and reviews, so I made each request start from a specific listing.</p>
            </div>
            <div>
              <h3>Volunteers needed a way to coordinate</h3>
              <p>Volunteers used paper or WhatsApp forms, manual records and separate pickup messages. I designed a workflow for accepting donations, confirming pickup, reporting and downloading donation history.</p>
            </div>
          </div>
            </div>
          </details>
        </section>
        </div>

        <section className={`page-width ${styles.flowSection}`} aria-labelledby="munchpal-flow-title">
          <div className={detail.heading}>
            <h2 id="munchpal-flow-title">Different needs, different paths</h2>
            <p>The resident journey starts with a food listing. Bulk donations follow a separate coordination path, with pickup records and reporting for volunteers.</p>
          </div>
          <div id="munchpal-media-flow" className={styles.flowArtwork}>
            <ProjectScreen image={`${assets}/flow.svg`} width={1549} height={814}
              alt="Original Munchpal resident user-flow map with paths for requesting food, offering surplus food, bulk donations, messages and community"
              label="Resident user-flow map" caption="The original flow connects browsing, requesting, sharing and communication." />
          </div>
        </section>

        <section id="munchpal-showcase" className={`page-width ${detail.section}`} aria-labelledby="munchpal-listing-title">
          <div className={detail.heading}>
            <h2 id="munchpal-listing-title" tabIndex={-1}>A request starts with a listing</h2>
            <p>Find nearby food, check what is available, then arrange the pickup with the person sharing it. Location, availability and a direct conversation give each request a starting point.</p>
          </div>
          <div className={styles.residentComposition}>
            <div id="munchpal-media-home">
              <ProjectScreen image={`${assets}/home.svg`} width={388} height={834} presentation="phone"
                alt="Munchpal resident home on a silver phone, with Surabaya location, search, food categories and recent food listings"
                label="Find food nearby" />
            </div>
            <ProjectScreen image={`${assets}/food-list.svg`} width={388} height={834}
              alt="Original Munchpal food list with food photos, donor names, distances and written availability states"
              label="Check the food list" />
            <ProjectScreen image={`${assets}/conversation.svg`} width={388} height={834}
              alt="Munchpal conversation between Alan Sahlan and Janu Suryajana with a food photograph and pickup confirmation messages"
              label="Arrange a pickup" />
          </div>
        </section>

        <section id="munchpal-media-feedback" className={`page-width ${styles.states}`} aria-labelledby="munchpal-states-title">
          <div className={styles.statusStory}>
            <div className={detail.decisionCopy}>
              <h2 id="munchpal-states-title">Give each request a next step</h2>
              <p>A request continues through acceptance, a conversation and pickup. Notifications connect a status to the relevant action, such as sending a message or leaving a rating.</p>
              <p>Bulk donations have a separate reporting path. The pickup notification gives access to the donation report.</p>
            </div>
            <div className={styles.statusComposition}>
              <ProjectScreen image={`${assets}/request-status.svg`} width={388} height={834}
                alt="Munchpal resident notifications with sent and accepted food requests, and a pickup notification with a Leave a rating action"
                label="Request and pickup states" caption="The request status points to a message or rating." />
              <ProjectScreen image={`${assets}/pickup-status.svg`} width={388} height={834} presentation="phone" className={styles.pickupPhone}
                alt="Munchpal notifications on a silver phone, with a completed bulk-donation pickup and a green Donation report action"
                label="Donation report access" caption="The bulk-donation pickup has its own reporting action." />
            </div>
          </div>
        </section>

        <section id="munchpal-revisions" className={`page-width ${styles.revisions}`} aria-labelledby="munchpal-revisions-title">
          <div className={styles.sectionHeading}>
            <h2 id="munchpal-revisions-title" tabIndex={-1}>What I changed, and why</h2>
          </div>
          <article className={styles.revision} aria-labelledby="munchpal-availability-title">
            <div className={styles.decisionCopy}>
              <h3 id="munchpal-availability-title">Make unavailable food obvious</h3>
              <p>The grey unavailable label meant food had run out, but the photos still looked active. After participant feedback, I faded unavailable items and kept the label.</p>
            </div>
            <div className={styles.comparison}>
              <OriginalScreen image={`${assets}/availability-before.svg`} label="Before"
                alt="Food list before the contrast change. KitKat and Padang Rice have grey Gone labels, while their food photographs retain full contrast."
                linkLabel="Open earlier food list" />
              <OriginalScreen image={`${assets}/availability-after.svg`} label="After"
                alt="Revised food list. KitKat and Padang Rice photographs are faded, while their Gone labels remain. Available food photographs retain full contrast."
                linkLabel="Open revised food list" />
            </div>
          </article>
          <article className={`${styles.revision} ${styles.messageRevision}`} aria-labelledby="munchpal-message-title">
            <div className={styles.decisionCopy}>
              <h3 id="munchpal-message-title">Start with an editable message</h3>
              <p>Volunteers repeated the same opening question for each donor. I added a suggested donation-confirmation message they could edit before sending.</p>
            </div>
            <div className={styles.comparison}>
              <OriginalScreen image={`${assets}/message-before.svg`} label="Before" composer
                alt="Earlier volunteer chat with an empty conversation and message input. No suggested opening message is available."
                linkLabel="Open earlier volunteer chat" />
              <OriginalScreen image={`${assets}/message-after.svg`} label="After" composer
                alt="Revised volunteer chat with a suggested donation-confirmation question, a template tip, and an edit control above the message input."
                linkLabel="Open revised volunteer chat" />
            </div>
            <p className={styles.detailCaption}>Message composer detail. Open either screen to see the complete original.</p>
          </article>
          <p className={styles.revisionLimit}>These revisions are documented. Their effect on recognition and task time needs a separate retest.</p>
        </section>

        <section id="munchpal-evaluation" className={`page-width ${styles.evaluation}`} aria-labelledby="munchpal-evaluation-title">
          <div className={styles.sectionHeading}>
            <h2 id="munchpal-evaluation-title" tabIndex={-1}>What testing showed</h2>
            <div className={styles.testResult}>
              <span className={styles.testCount} aria-hidden="true">109/110</span>
              <p>20 participants completed 109 of 110 task attempts in the prototype. This tests navigation, not live pickups or food waste reduction.</p>
            </div>
          </div>
          <details className={`case-notes ${styles.taskDetails}`}>
            <summary>Test details</summary>
            <div>
          <p>I evaluated the prototype remotely using Maze tasks and a UEQ questionnaire through Google Forms, with moderated and unmoderated sessions.</p>
          <p id="munchpal-results-caption" className={styles.resultsCaption}>Task completion by participant group</p>
          <dl className={styles.results} aria-labelledby="munchpal-results-caption">
            <div><dt>Residents<span>10 participants, 6 tasks each</span></dt><dd>59 of 60<span>task attempts completed</span></dd></div>
            <div><dt>Garda Pangan volunteers<span>10 participants, 5 tasks each</span></dt><dd>50 of 50<span>task attempts completed</span></dd></div>
          </dl>
          <p>One resident&apos;s community task remained unfinished. The record attributes this to a connection problem and accidental use of Maze&apos;s Stop Task control.</p>
              <div className={styles.audiences}>
              <section aria-labelledby="munchpal-resident-tasks"><h3 id="munchpal-resident-tasks">Resident tasks</h3><ul><li>Register and sign in</li><li>Request food</li><li>Post surplus food</li><li>Make a bulk donation</li><li>Check the community feed</li><li>Sign out</li></ul></section>
              <section aria-labelledby="munchpal-volunteer-tasks"><h3 id="munchpal-volunteer-tasks">Volunteer tasks</h3><ul><li>Sign in</li><li>Accept a donation</li><li>Confirm pickup and make a report</li><li>Check and download donation history</li><li>Sign out</li></ul></section>
              </div>
          <p>Next I would retest recognition of unavailable food and use of the editable message. A live pilot would also need reliable availability, pickup status, food information rules, privacy and notifications.</p>
            </div>
          </details>
        </section>
        <section className="case-support page-width" aria-label="Original prototype and presentation">
          <div className={detail.sourceLinks}>
            <a href={figma} data-pointer-feedback="local">Explore the Figma designs <ArrowIcon /></a>
          </div>
          <div>
            <a className="case-live-link" href={pdf} data-magnet="text"><span data-magnet-part>Read the original Munchpal presentation</span> <span data-magnet-part aria-hidden="true"><ArrowIcon /></span></a>
          </div>
          <ReturnToWorkLink className="case-return" />
        </section>
      </main>
      <SiteFooter />
    </PageTransition>
  );
}
