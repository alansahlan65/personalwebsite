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
const description = "A food-sharing prototype for Surabaya, with separate flows for residents sharing meals and volunteers coordinating bulk donations.";
const figma = "https://www.figma.com/design/nzrjEnmrDqfXUPLawnxmEn/Dump?node-id=306-1882";
const pickupIteration = "https://www.figma.com/design/nzrjEnmrDqfXUPLawnxmEn/Dump?node-id=375-16056";
const assets = "/images/figma/munchpal";
const userFlows = [
  {
    id: "residents", audience: "Residents", label: "Resident user-flow map",
    image: `${assets}/flow-residents.png`, width: 4544, height: 2410,
    alt: "Original Munchpal resident flow from onboarding and sign-in to requesting food, sharing surplus food, bulk donations, messages, community and profile settings",
  },
  {
    id: "volunteers", audience: "Volunteers", label: "Volunteer user-flow map",
    image: `${assets}/flow-volunteers.png`, width: 3248, height: 1894,
    alt: "Original Munchpal Garda Pangan volunteer flow from sign-in to reviewing and accepting active donations, chatting with donors, donation history, notifications and organization settings",
  },
] as const;

export const metadata: Metadata = createPageMetadata(
  "Munchpal | Alan Sahlan", description,
  { url: "/work/munchpal/opengraph-image.jpg", alt: "Original Munchpal food-sharing case study cover with three mobile app screen mockups" },
);

function OriginalScreen({ image, alt, label, linkLabel, detail: screenDetail }: {
  image: string;
  alt: string;
  label: string;
  linkLabel: string;
  detail?: "availability" | "composer";
}) {
  return (
    <figure className={styles.screen} data-detail={screenDetail}>
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
              <p className="case-lead">Food availability for residents. Pickup records for volunteers.</p>
              <a className={`case-live-link ${styles.primaryLink}`} href={prototype} data-magnet="text">
                <span data-magnet-part>Explore the Munchpal prototype</span>
                <span data-magnet-part aria-hidden="true"><ArrowIcon /></span>
              </a>
            </div>
          </header>
          <MunchpalOpener />
          <p className={styles.artifactNote}>Portfolio motion study</p>
          <dl className={`case-facts ${detail.facts}`}>
            <div><dt>Project</dt><dd>Client design project, Surabaya<br />September to December 2024</dd></div>
            <div><dt>My role</dt><dd>Sole UI/UX designer</dd></div>
            <div><dt>Scope</dt><dd>Research, UI design and Figma prototype testing</dd></div>
          </dl>
        </div>

        <div id="munchpal-case-study">
        <section id="munchpal-research" className={`page-width ${styles.research}`} aria-labelledby="munchpal-research-title">
          <div className={styles.sectionHeading}>
            <h2 id="munchpal-research-title" tabIndex={-1}>Two groups, two different jobs</h2>
            <p>Residents wanted to know what food was available before asking. Volunteers managed donations through paper records and WhatsApp. I designed separate flows for requesting food and coordinating bulk donations.</p>
          </div>
          <details className="case-notes">
            <summary>Research notes</summary>
            <div>
          <p>I interviewed five Surabaya residents and five Garda Pangan volunteers, then mapped their needs and donation process into user flows, wireframes and a high-fidelity prototype.</p>
          <div className={styles.audiences}>
            <div>
              <h3>Residents needed certainty before asking</h3>
              <p>All five residents described hesitation or embarrassment when asking for food. They wanted clear availability and pickup details, so I made each request start from a listing.</p>
            </div>
            <div>
              <h3>Volunteers needed a way to coordinate</h3>
              <p>I brought donation acceptance, pickup confirmation, reports and donation history into one workflow.</p>
            </div>
          </div>
            </div>
          </details>
        </section>
        </div>

        <section className={`page-width ${styles.flowSection}`} aria-labelledby="munchpal-flow-title">
          <div className={detail.heading}>
            <h2 id="munchpal-flow-title">Keep bulk donations on their own path</h2>
            <p>Residents share food details and arrange pickups. Volunteers review bulk donations, confirm collection and record the pickup.</p>
          </div>
          <div id="munchpal-media-flow" className={styles.flowSwitcher}>
            <fieldset className={styles.flowOptions}>
              <legend className={styles.flowLegend}>User flow</legend>
              <span className={styles.flowIndicator} aria-hidden="true">
                <span className={styles.flowActiveLabels}>
                  {userFlows.map(flow => <span key={flow.id}>{flow.audience}</span>)}
                </span>
              </span>
              {userFlows.map((flow, index) => (
                <label key={flow.id} className={styles.flowOption}>
                  <input type="radio" name="munchpal-user-flow" value={flow.id}
                    defaultChecked={index === 0} aria-label={flow.audience} aria-controls={`munchpal-flow-${flow.id}`} />
                  <span aria-hidden="true">{flow.audience}</span>
                </label>
              ))}
            </fieldset>
            {userFlows.map(flow => (
              <div key={flow.id} id={`munchpal-flow-${flow.id}`} data-flow={flow.id}
                className={styles.flowArtwork} role="region" aria-label={`${flow.audience} user flow`}>
                <ProjectScreen image={flow.image} width={flow.width} height={flow.height}
                  alt={flow.alt} label={flow.label} />
              </div>
            ))}
          </div>
        </section>

        <section id="munchpal-showcase" className={`page-width ${detail.section}`} aria-labelledby="munchpal-listing-title">
          <div className={detail.heading}>
            <h2 id="munchpal-listing-title" tabIndex={-1}>A request starts with a listing</h2>
            <p>Each listing shows the food, location and availability. Residents can check the details, then message the donor to arrange a pickup.</p>
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
              <p>Notifications link each request to its next action, such as messaging the donor or leaving a rating. Bulk-donation pickup notifications open the donation report.</p>
              <p>I added the pickup date to the confirmation so volunteers could include it in their reports.</p>
              <div className={detail.sourceLinks}>
                <a href={pickupIteration} data-pointer-feedback="local">See the pickup-date revision <ArrowIcon /></a>
              </div>
            </div>
            <div className={styles.statusComposition}>
              <ProjectScreen image={`${assets}/request-status.svg`} width={388} height={834}
                alt="Munchpal resident notifications with sent and accepted food requests, and a pickup notification with a Leave a rating action"
                label="Request and pickup states" />
              <ProjectScreen image={`${assets}/pickup-status.svg`} width={388} height={834} presentation="phone" className={styles.pickupPhone}
                alt="Munchpal notifications on a silver phone, with a completed bulk-donation pickup and a green Donation report action"
                label="Donation report access" />
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
              <p>Participants found that food marked Gone still looked available. I faded those photographs and kept the written status to make availability clearer.</p>
            </div>
            <div className={styles.comparison}>
              <OriginalScreen image={`${assets}/availability-before.svg`} label="Before" detail="availability"
                alt="Food list before the contrast change. KitKat and Padang Rice have grey Gone labels, while their food photographs retain full contrast."
                linkLabel="Open earlier food list" />
              <OriginalScreen image={`${assets}/availability-after.svg`} label="After" detail="availability"
                alt="Revised food list. KitKat and Padang Rice photographs are faded, while their Gone labels remain. Available food photographs retain full contrast."
                linkLabel="Open revised food list" />
            </div>
          </article>
          <article className={`${styles.revision} ${styles.messageRevision}`} aria-labelledby="munchpal-message-title">
            <div className={styles.decisionCopy}>
              <h3 id="munchpal-message-title">Start with an editable message</h3>
              <p>Volunteers had to write the same opening question for each donor. I added a suggested confirmation message they could edit before sending.</p>
            </div>
            <div className={styles.comparison}>
              <OriginalScreen image={`${assets}/message-before.svg`} label="Before" detail="composer"
                alt="Earlier volunteer chat with an empty conversation and message input. No suggested opening message is available."
                linkLabel="Open earlier volunteer chat" />
              <OriginalScreen image={`${assets}/message-after.svg`} label="After" detail="composer"
                alt="Revised volunteer chat with a suggested donation-confirmation question, a template tip, and an edit control above the message input."
                linkLabel="Open revised volunteer chat" />
            </div>
          </article>
        </section>

        <section id="munchpal-evaluation" className={`page-width ${styles.evaluation}`} aria-labelledby="munchpal-evaluation-title">
          <div className={styles.sectionHeading}>
            <h2 id="munchpal-evaluation-title" tabIndex={-1}>What testing showed</h2>
            <div className={styles.testResult}>
              <span className={styles.testCount} aria-hidden="true">109/110</span>
              <p>20 participants completed 109 of 110 task attempts in the Figma prototype.</p>
            </div>
          </div>
          <details className={`case-notes ${styles.taskDetails}`}>
            <summary>Test details</summary>
            <div>
          <p>I tested the prototype remotely through moderated and unmoderated Maze sessions, with a UEQ questionnaire in Google Forms.</p>
          <p id="munchpal-results-caption" className={styles.resultsCaption}>Task completion by participant group</p>
          <dl className={styles.results} aria-labelledby="munchpal-results-caption">
            <div><dt>Residents<span>10 participants, 6 tasks each</span></dt><dd>59 of 60<span>task attempts completed</span></dd></div>
            <div><dt>Garda Pangan volunteers<span>10 participants, 5 tasks each</span></dt><dd>50 of 50<span>task attempts completed</span></dd></div>
          </dl>
          <p>One community task remained unfinished after a connection problem and accidental use of Maze&apos;s Stop Task control.</p>
              <div className={styles.audiences}>
              <section aria-labelledby="munchpal-resident-tasks"><h3 id="munchpal-resident-tasks">Resident tasks</h3><ul><li>Register and sign in</li><li>Request food</li><li>Post surplus food</li><li>Make a bulk donation</li><li>Check the community feed</li><li>Sign out</li></ul></section>
              <section aria-labelledby="munchpal-volunteer-tasks"><h3 id="munchpal-volunteer-tasks">Volunteer tasks</h3><ul><li>Sign in</li><li>Accept a donation</li><li>Confirm pickup and make a report</li><li>Check and download donation history</li><li>Sign out</li></ul></section>
              </div>
            </div>
          </details>
        </section>
        <section className="case-support page-width" aria-label="Original prototype and presentation">
          <div className={detail.sourceLinks}>
            <a href={figma} data-pointer-feedback="local">Explore the Munchpal designs <ArrowIcon /></a>
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
