import type { Metadata } from "next";
import { createPageMetadata } from "../../lib/metadata";
import { PageTransition } from "../../components/page-transition";
import { ProjectScreen } from "../project-screen";
import { PaylectaOpener } from "./paylecta-opener";
import { ReturnToWorkLink } from "../../components/return-to-work-link";
import { SiteFooter } from "../../components/site-footer";
import { SiteHeader } from "../../components/site-header";
import { ArrowIcon } from "../../components/ui-icons";
import styles from "../project-detail.module.css";

const source = "https://drive.google.com/file/d/19UDppHbm1QU3C_0gCycbTltVKUSxPxmi/view";
const figma = "https://www.figma.com/design/nzrjEnmrDqfXUPLawnxmEn/Dump?node-id=307-3";
const assets = "/images/figma/paylecta";
const description = "Desktop and mobile finance dashboards for merchants, with customer records, invoice editing and payout tracking.";

export const metadata: Metadata = createPageMetadata(
  "Paylecta | Alan Sahlan", description,
  { url: "/work/paylecta/opengraph-image.jpg", alt: "Paylecta original client finance dashboard design by Alan Sahlan." },
);

export default function PaylectaPage() {
  return (
    <PageTransition name="paylecta-page">
      <SiteHeader page="work" />
      <main id="main" className={`case-study ${styles.case}`} tabIndex={-1}>
        <div className="page-width">
          <div className={`case-topline ${styles.topline}`}>
            <ReturnToWorkLink />
          </div>
          <header className={`case-intro ${styles.intro}`}>
            <h1 className="case-title" tabIndex={-1}>Paylecta</h1>
            <div>
              <p className="case-lead">Desktop and mobile finance dashboards for merchants.</p>
              <div className={styles.sourceLinks}>
                <a href={figma} data-pointer-feedback="local">Explore the Paylecta designs <ArrowIcon /></a>
              </div>
            </div>
          </header>
          <PaylectaOpener />
          <p className="case-motion-note">Portfolio motion study</p>
          <dl className={`case-facts ${styles.facts}`}>
            <div><dt>Project</dt><dd>Client design project, June 2025</dd></div>
            <div><dt>My role</dt><dd>Sole UI/UX designer</dd></div>
            <div><dt>Scope</dt><dd>Responsive dashboards and visual system</dd></div>
          </dl>
        </div>

        <section id="paylecta-showcase" className={`page-width ${styles.section}`} aria-labelledby="paylecta-overview-title">
          <div className={styles.heading}>
            <h2 id="paylecta-overview-title" tabIndex={-1}>One place to see the business</h2>
            <p>I put total balance and period summaries first, with gross and net revenue together for comparison. The desktop grid lets merchants scan several summaries at once; mobile follows the same order in one column.</p>
          </div>
          <div className={styles.overviewComposition} id="paylecta-media-overview">
            <ProjectScreen image={`${assets}/dashboard.svg`} width={1440} height={1279}
              presentation="laptop"
              alt="Paylecta desktop dashboard on a silver laptop, with sidebar, total balance, transaction summaries, revenue chart and new customers"
              label="Desktop dashboard" />
            <ProjectScreen image={`${assets}/dashboard-mobile.svg`} width={393} height={1399}
              alt="Complete Paylecta mobile dashboard with balance first, transaction cards, revenue overview and recent transactions in a single column"
              label="Mobile dashboard" />
          </div>
        </section>

        <div id="paylecta-case-study">
          <section id="paylecta-media-customers" className={`page-width ${styles.section} ${styles.customerStory}`} aria-labelledby="paylecta-customers-title">
            <div className={styles.decisionCopy}>
              <h2 id="paylecta-customers-title">Keep actions with the record</h2>
              <p>Search, filters and primary actions stay at the top of each screen. Customer rows keep their status and actions together, and the add-customer form opens over the list.</p>
            </div>
            <div className={styles.customerComposition}>
              <ProjectScreen image={`${assets}/customers.svg`} width={1440} height={1180} className={styles.customerList}
                presentation="monitor"
                alt="Paylecta customer records on a desktop display, with search, contact details, written statuses and row actions"
                label="Customer records" />
              <ProjectScreen image={`${assets}/customers-add.svg`} width={1440} height={1180} className={styles.customerForm}
                alt="Paylecta Add New Customer form over the searchable customer list, with customer status and row actions visible behind it"
                label="Add a customer in context" />
            </div>
          </section>

          <section className={`page-width ${styles.section}`} aria-labelledby="paylecta-invoice-title">
            <div className={styles.heading}>
              <h2 id="paylecta-invoice-title">See the invoice while making it</h2>
              <p>I placed the invoice preview beside the fields so merchants could check the amount and document while editing.</p>
            </div>
            <div className={styles.invoiceComposition}>
              <ProjectScreen image={`${assets}/invoice-editor.svg`} width={1440} height={1279} className={styles.invoiceSheet}
                alt="Paylecta invoice editor with sender, customer, due date, payment method and product details beside a complete invoice preview"
                label="Invoice editor and preview" />
              <ProjectScreen image={`${assets}/invoice-overdue.svg`} width={393} height={917} presentation="phone" className={styles.financePhone}
                alt="Paylecta overdue invoice on a graphite phone, with Send reminder, amount, payment details, line item and activity timeline"
                label="Invoice reminders on mobile" />
            </div>
          </section>

          <section id="paylecta-media-invoices" className={`page-width ${styles.section} ${styles.payoutStory}`} aria-labelledby="paylecta-states-title">
            <div className={styles.payoutArtwork}>
              <ProjectScreen image={`${assets}/payout-mobile.svg`} width={393} height={1086}
                alt="Paylecta mobile payouts with available balance, payout counts and history cards labelled Success, Processing and Cancelled"
                label="Mobile payouts" />
            </div>
            <div className={styles.decisionCopy}>
              <h2 id="paylecta-states-title">Make the payment state visible</h2>
              <p>Each payout has a written status: Success, Processing or Cancelled. Mobile cards keep the amount, status and next action together.</p>
            </div>
          </section>

          <section className={`page-width ${styles.section} ${styles.systemStory}`} aria-labelledby="paylecta-system-title">
            <div className={styles.decisionCopy}>
              <h2 id="paylecta-system-title">A shared visual language</h2>
              <p>I used Plus Jakarta Sans, orange accents and shared buttons, inputs and cards across the dashboards. Payment states keep consistent colors and labels on desktop and mobile.</p>
            </div>
            <ProjectScreen image={`${assets}/design-system.svg`} width={1400} height={2400}
              alt="Original Paylecta visual system with typography, orange and semantic color palettes, dashboard components, status treatments and icons"
              label="Paylecta visual system" />
          </section>
        </div>

        <section id="paylecta-implementation" className={`page-width ${styles.closing}`} aria-labelledby="paylecta-delivery-title">
          <h2 id="paylecta-delivery-title">The design delivered</h2>
          <p>Desktop and mobile designs for monitoring finances, managing customers, creating invoices and reviewing payouts, supported by a shared visual system.</p>
          <div className={styles.sourceLinks}>
            <a href={source} data-pointer-feedback="local">Read the original Paylecta case study PDF <ArrowIcon /></a>
          </div>
          <ReturnToWorkLink className="case-return" />
        </section>
      </main>
      <SiteFooter />
    </PageTransition>
  );
}
