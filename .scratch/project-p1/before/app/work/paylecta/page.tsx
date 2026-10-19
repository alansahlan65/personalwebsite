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
const description = "A client finance dashboard design for merchants and small businesses, designed independently by Alan Sahlan.";

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
                <a href={figma} data-pointer-feedback="local">Explore the Figma designs <ArrowIcon /></a>
              </div>
            </div>
          </header>
          <PaylectaOpener />
          <dl className={`case-facts ${styles.facts}`}>
            <div><dt>Project</dt><dd>Client design project, June 2025</dd></div>
            <div><dt>My role</dt><dd>Sole UI/UX designer</dd></div>
            <div><dt>Scope</dt><dd>Responsive dashboards and visual system</dd></div>
          </dl>
        </div>

        <section id="paylecta-showcase" className={`page-width ${styles.section}`} aria-labelledby="paylecta-overview-title">
          <div className={styles.heading}>
            <h2 id="paylecta-overview-title" tabIndex={-1}>One place to see the business</h2>
            <p>Merchants move between transactions, customers, invoices and payouts. I brought these tasks into a shared workspace, with an overview for monitoring and dedicated screens for acting on a record.</p>
            <p>The desktop overview brings the financial picture together. On mobile, the same information follows a single reading column.</p>
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
              <p>A searchable customer table keeps status and actions together. The customer form opens over the list, so the surrounding records remain visible while adding someone new.</p>
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
              <p>The editor brings customer, payment and product details alongside the invoice preview. The amount and document stay visible while the merchant checks what to send.</p>
            </div>
            <div className={styles.invoiceComposition}>
              <ProjectScreen image={`${assets}/invoice-editor.svg`} width={1440} height={1279} className={styles.invoiceSheet}
                alt="Paylecta invoice editor with sender, customer, due date, payment method and product details beside a complete invoice preview"
                label="Invoice editor and preview" />
              <ProjectScreen image={`${assets}/invoice-overdue.svg`} width={393} height={917} presentation="phone" className={styles.financePhone}
                alt="Paylecta overdue invoice on a graphite phone, with Send reminder, amount, payment details, line item and activity timeline"
                label="Following up on mobile" caption="An overdue invoice keeps its status, reminder and history together." />
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
              <p>Success, Processing and Cancelled stay with each payout. Written states accompany the colors, so a merchant can read what happened to a payment.</p>
              <p>On mobile, cards replace dense rows while keeping the record and its next action together.</p>
            </div>
          </section>

          <section className={`page-width ${styles.section} ${styles.systemStory}`} aria-labelledby="paylecta-system-title">
            <div className={styles.decisionCopy}>
              <h2 id="paylecta-system-title">A shared visual language</h2>
              <p>Plus Jakarta Sans, an orange balance card and neutral surfaces establish the hierarchy. Shared colors and components carry payment states across desktop and mobile.</p>
              <p>I designed the interfaces independently for the client, along with this visual system.</p>
            </div>
            <ProjectScreen image={`${assets}/design-system.svg`} width={1400} height={2400}
              alt="Original Paylecta visual system with typography, orange and semantic color palettes, dashboard components, status treatments and icons"
              label="Paylecta visual system" caption="The original Figma board, including typography, colors and components." />
          </section>
        </div>

        <section className={`page-width ${styles.closing}`} aria-labelledby="paylecta-delivery-title">
          <h2 id="paylecta-delivery-title">The design delivered</h2>
          <p>Desktop and mobile designs for monitoring finances, managing customers, creating invoices and reviewing payouts, supported by a shared visual system.</p>
          <p>The client presentation documents the design. A production release and measured business results are not available.</p>
          <details className="case-notes">
            <summary id="paylecta-implementation">Design and build notes</summary>
            <div>
              <p>The opener is a later motion study using the original designs and example data.</p>
              <p>A build would need validated inputs, accurate invoice previews, draft recovery and clear failure feedback. Desktop rows and mobile cards should use the same records, actions and definitions for amounts.</p>
            </div>
          </details>
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
