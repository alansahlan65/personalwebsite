import type { Metadata } from "next";
import Image from "next/image";
import { CaseMediaSequence, type CaseMediaPanel } from "../../components/case-media-sequence";
import { PageTransition } from "../../components/page-transition";
import { ProjectImageTransition } from "../../components/project-transition";
import { ReturnToWorkLink } from "../../components/return-to-work-link";
import { SiteFooter } from "../../components/site-footer";
import { SiteHeader } from "../../components/site-header";
import { ArrowIcon } from "../../components/ui-icons";

const source = "https://drive.google.com/file/d/19UDppHbm1QU3C_0gCycbTltVKUSxPxmi/view";
const description = "A client finance dashboard design for merchants and small businesses, designed independently by Alan Sahlan.";

export const metadata: Metadata = {
  title: "Paylecta | Alan Sahlan",
  description,
  openGraph: { title: "Paylecta | Alan Sahlan", description },
};

const panels: readonly CaseMediaPanel[] = [
  {
    id: "overview",
    title: "Keep the overview useful on a phone",
    description: "On mobile, balance comes first, then transaction counts and revenue. The desktop account view gives profile, account, and funding details more room. I changed the hierarchy for the task, not just the screen width.",
    image: "/images/paylecta-overview.webp",
    alt: "Paylecta mobile dashboard with balance, transaction cards and revenue chart, beside a desktop account settings design",
    width: 1402, height: 1081,
    caption: "Source design mockups, June 2025. PDF page 4.",
  },
  {
    id: "customers",
    title: "Connect the summary to the records",
    description: "Totals lead into a searchable customer table. Status and actions stay with each record; the customer form opens over the list so the user keeps that context.",
    image: "/images/paylecta-customers.webp",
    alt: "Paylecta customer summary, searchable customer table with status labels, and a customer form overlay in original device mockups",
    width: 1402, height: 1081,
    caption: "Source design mockups, June 2025. PDF page 6.",
  },
  {
    id: "invoices",
    title: "Make the payment state visible",
    description: "An invoice preview sits beside the desktop editor. On mobile, overdue status, reminder, and activity stay together. Payout cards name each state beside its amount, so a color alone never has to explain what happened.",
    image: "/images/paylecta-invoices.webp",
    alt: "Paylecta desktop invoice editor and preview, mobile overdue invoice with timeline, and mobile payout cards with named payment states",
    width: 1402, height: 1081,
    caption: "Source design mockups, June 2025. PDF page 7.",
  },
];

export default function PaylectaPage() {
  return (
    <PageTransition name="paylecta-page">
      <SiteHeader page="work" />
      <main id="main" className="case-study" tabIndex={-1}>
        <div className="page-width">
          <div className="case-topline">
            <p className="section-label">02 / Finance / Client design project</p>
            <ReturnToWorkLink />
          </div>
          <header className="case-intro">
            <h1 className="case-title" tabIndex={-1}>Paylecta</h1>
            <p className="case-lead">When money moves, merchants need to know what changed and what needs attention. I designed Paylecta&apos;s desktop and mobile dashboards around those decisions.</p>
          </header>
          <figure className="case-hero">
            <ProjectImageTransition slug="paylecta">
              <Image src="/images/paylecta-cover.webp" width={1402} height={1081}
                alt="Original Paylecta case-study cover with a desktop finance dashboard, balance card, transaction summaries, and revenue chart"
                preload sizes="(max-width: 768px) 92vw, (max-width: 1440px) 86vw, 1280px" style={{ aspectRatio: "auto" }} />
            </ProjectImageTransition>
            <figcaption>Original design presentation, June 2025. PDF page 1. Screen values are example content.</figcaption>
          </figure>
          <dl className="case-facts">
            <div><dt>Audience</dt><dd>Merchants and small businesses managing money and customer records.</dd></div>
            <div><dt>My role</dt><dd>Sole UI/UX designer for the dashboard, responsive screens, and visual system.</dd></div>
            <div><dt>Collaborators</dt><dd>No other designers.</dd></div>
            <div><dt>Status</dt><dd>Client design project, June 2025. The screens below are original design mockups.</dd></div>
          </dl>
          <a className="case-live-link" href={source} data-magnet="text"><span data-magnet-part>Read the original Paylecta case study PDF</span> <span data-magnet-part aria-hidden="true"><ArrowIcon /></span></a>
        </div>
        <section className="case-decisions page-width" aria-labelledby="paylecta-decisions">
          <h2 id="paylecta-decisions">Design decisions</h2>
          <div className="case-decision">
            <h3>Give the balance a clear place</h3>
            <p>I put the balance first, then transactions and revenue. A pending-transaction notice points to work that needs action; the navigation keeps customers, invoices, and payouts distinct.</p>
          </div>
          <div className="case-decision">
            <h3>Keep detail and status together</h3>
            <p>Amounts, dates, and written states travel together. The mobile cards retain the essentials from the desktop records without squeezing a table into a phone.</p>
          </div>
          <div className="case-decision">
            <h3>Use a shared visual system</h3>
            <p>I used Plus Jakarta Sans, orange for the primary balance, neutral surfaces, and consistent card and status patterns. Repetition helps the screens read as one product.</p>
          </div>
        </section>
        <CaseMediaSequence id="paylecta-media" title="Inside the design" panels={panels} skipTo="paylecta-implementation" skipLabel="Skip to implementation considerations" />
        <section className="case-reading page-width" aria-labelledby="paylecta-implementation">
          <h2 id="paylecta-implementation" tabIndex={-1}>Implementation considerations</h2>
          <div>
            <p>The mockups define the hierarchy, not transaction logic. A build would need validated inputs, a preview that matches the invoice sent, draft recovery, and clear success or failure feedback. Closing or retrying should not erase the work.</p>
            <p>I would map desktop rows and mobile cards to the same record and actions, with written status labels, loading and empty states, and one definition for every financial amount.</p>
          </div>
        </section>
        <section className="case-reading page-width" aria-labelledby="paylecta-evidence">
          <h2 id="paylecta-evidence">What the evidence shows</h2>
          <div>
            <p>These are original screens from my client presentation. They show the design and its intended states; I do not have a live product, working prototype, or measured business result to present.</p>
            <p>The takeaway is simple: a useful dashboard connects the overview to the record someone can act on. The later gallery artwork is an illustration, separate from these source screens.</p>
          </div>
          <ReturnToWorkLink className="case-return" />
        </section>
      </main>
      <SiteFooter />
    </PageTransition>
  );
}
