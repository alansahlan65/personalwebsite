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
    description: "The mobile dashboard keeps the balance first, followed by transaction counts and a revenue chart. The desktop account screen separates profile, account, and funding details. These mockups show how the same information can be organized for different tasks and screen sizes.",
    image: "/images/paylecta-overview.webp",
    alt: "Paylecta mobile dashboard with balance, transaction cards and revenue chart, beside a desktop account settings design",
    width: 1402, height: 1081,
    caption: "Source design mockups, June 2025. PDF page 4.",
  },
  {
    id: "customers",
    title: "Connect the summary to the records",
    description: "Customer totals and growth sit above a searchable customer list, with status and actions attached to each row. A separate mockup shows the customer form over that list. This pairing gives summary information and individual records a shared place in the navigation.",
    image: "/images/paylecta-customers.webp",
    alt: "Paylecta customer summary, searchable customer table with status labels, and a customer form overlay in original device mockups",
    width: 1402, height: 1081,
    caption: "Source design mockups, June 2025. PDF page 6.",
  },
  {
    id: "invoices",
    title: "Make the payment state visible",
    description: "Desktop invoice details sit beside a preview. The mobile invoice shows an overdue label, a reminder action, and an activity timeline. Payout cards retain amounts, channels, and named states such as Processing and Success. These are designed states; the PDF does not demonstrate sending an invoice or moving money.",
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
            <p className="case-lead">Merchants need to understand their balance, follow invoices, and check payouts while running the business. I designed Paylecta for a client to bring those tasks and customer records into one dashboard, with desktop and mobile layouts for reviewing the details.</p>
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
            <div><dt>Audience</dt><dd>Merchants and small businesses managing transactions, invoices, payouts, and customers.</dd></div>
            <div><dt>My role</dt><dd>I was the sole UI/UX designer for this client project, designing the dashboard, responsive screens, and visual system.</dd></div>
            <div><dt>Collaborators</dt><dd>None. I worked independently.</dd></div>
            <div><dt>Status</dt><dd>Client design project, June 2025. The screens below are original design mockups.</dd></div>
          </dl>
          <a className="case-live-link" href={source} data-magnet="text"><span data-magnet-part>Read the original Paylecta case study PDF</span> <span data-magnet-part aria-hidden="true"><ArrowIcon /></span></a>
        </div>
        <section className="case-decisions page-width" aria-labelledby="paylecta-decisions">
          <h2 id="paylecta-decisions">Design decisions</h2>
          <div className="case-decision">
            <h3>Give the balance a clear place</h3>
            <p>The orange balance card anchors the dashboard. Transaction summaries and the revenue chart follow it, while the navigation separates customers, invoices, payouts, and settings. A pending-transaction notice gives outstanding work a visible entry point.</p>
          </div>
          <div className="case-decision">
            <h3>Keep detail and status together</h3>
            <p>Invoice and payout screens pair amounts with payment details and written status labels. The mobile designs turn dense records into cards while keeping the amount and state visible.</p>
          </div>
          <div className="case-decision">
            <h3>Use a shared visual system</h3>
            <p>The source documents Plus Jakarta Sans, orange emphasis, neutral surfaces, and semantic accent colors. Repeated cards, search controls, and status labels give the screens a consistent structure.</p>
          </div>
        </section>
        <CaseMediaSequence id="paylecta-media" title="Inside the design" panels={panels} skipTo="paylecta-implementation" skipLabel="Skip to implementation considerations" />
        <section className="case-reading page-width" aria-labelledby="paylecta-implementation">
          <h2 id="paylecta-implementation" tabIndex={-1}>Implementation considerations</h2>
          <div>
            <p>These are considerations drawn from the static designs. A working invoice flow needs validation, a matching preview, a saved draft, and clear feedback after sending. Closing a form or retrying a failed action should preserve entered details. The source does not demonstrate those behaviors.</p>
            <p>A build also needs explicit loading, empty, and error states, accessible status labels, and a consistent definition of each financial amount. Mobile cards should preserve the same record and actions as their desktop table rows. These are implementation requirements to resolve, rather than claims about a shipped system.</p>
          </div>
        </section>
        <section className="case-reading page-width" aria-labelledby="paylecta-evidence">
          <h2 id="paylecta-evidence">What the evidence shows</h2>
          <div>
            <p>The original case study documents interface designs and a visual system. The images here come directly from that PDF. They show intended screens and states, rather than recorded live interactions or measured business results.</p>
            <p>No live product or working prototype was available for this review. The gallery banners are later concept artwork; the case-study images are original project material.</p>
          </div>
          <ReturnToWorkLink className="case-return" />
        </section>
      </main>
      <SiteFooter />
    </PageTransition>
  );
}
