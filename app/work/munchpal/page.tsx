import type { Metadata } from "next";
import Image from "next/image";
import { CaseMediaSequence, type CaseMediaPanel } from "../../components/case-media-sequence";
import { PageTransition } from "../../components/page-transition";
import { ProjectImageTransition } from "../../components/project-transition";
import { ReturnToWorkLink } from "../../components/return-to-work-link";
import { SiteFooter } from "../../components/site-footer";
import { SiteHeader } from "../../components/site-header";
import { ArrowIcon } from "../../components/ui-icons";

const pdf = "https://drive.google.com/file/d/10I2jSY0_W8WTrntBog6EQQRD2IMFV4Lk/view";
const prototype = "https://www.figma.com/proto/Xsj8X9CcL5SW6CoILaZFH3/MunchPal?node-id=327-4477&t=I0tPWQMFFzQHCDff-1&scaling=scale-down&content-scaling=fixed&page-id=326%3A3405&starting-point-node-id=327%3A4467&show-proto-sidebar=1";
const description = "A client food-sharing mobile app design connecting nearby meal requests, surplus-food posts, and a bulk donation path.";

export const metadata: Metadata = {
  title: "Munchpal | Alan Sahlan",
  description,
  openGraph: { title: "Munchpal | Alan Sahlan", description },
};

const panels: readonly CaseMediaPanel[] = [
  {
    id: "research",
    title: "Name the access and trust barriers",
    description: "The case study groups concerns about food going unused, the discomfort of asking for help, and finding a nearby offer in time. It connects those concerns to search, availability alerts, and communication cues. The source reports interviews, but the underlying responses were not available for this review.",
    image: "/images/munchpal-research.webp",
    alt: "Original Munchpal research summary naming surplus food, financial pressure, nearby availability, and trust cues",
    width: 1440, height: 810,
    caption: "Original case study PDF, page 4. The source's interview summary is not an independently verified research result.",
  },
  {
    id: "flow",
    title: "Map both sides of the exchange",
    description: "The flow diagram branches from onboarding into finding food, adding a surplus listing, messages, a donation route, community, and profile. Decision points connect a request or post to notifications. This is a plan for the prototype, not evidence that a live transaction completed.",
    image: "/images/munchpal-flow.webp",
    alt: "Original Munchpal user-flow diagram branching into meal requests, food posts, messages, donations, and community",
    width: 1440, height: 810,
    caption: "Original case study PDF, page 9. Designed flow; open the image to inspect the labels.",
  },
  {
    id: "home",
    title: "Put nearby meals in context",
    description: "The homepage mockup pairs a city selector and keyword search with prepared-food and ingredient categories. Recent listings carry a request action, while the center shortcut starts a food post. The PDF presents a route for finding and offering food within the same navigation.",
    image: "/images/munchpal-home.webp",
    alt: "Original Munchpal homepage mockup with Surabaya location, search, food categories, recent listing, and a central posting shortcut",
    width: 1440, height: 811,
    caption: "Original case study PDF, page 12. Cropped from the high-fidelity interface section.",
  },
  {
    id: "feedback",
    title: "Show what happens after a request",
    description: "Notification mockups distinguish a new request, acceptance, message, donation report, and rating. A confirmation dialog is paired with an accepted-request state. These written states give the handoff a path through the design; the source does not establish production notifications or pickups.",
    image: "/images/munchpal-feedback.webp",
    alt: "Original Munchpal notification mockups with request status, messages, rating form, confirmation dialog, and accepted-request state",
    width: 1440, height: 810,
    caption: "Original case study PDF, page 12. Designed feedback states, not recorded service transactions.",
  },
];

export default function MunchpalPage() {
  return (
    <PageTransition name="munchpal-page">
      <SiteHeader page="work" />
      <main id="main" className="case-study case-study--munchpal" tabIndex={-1}>
        <div className="page-width">
          <div className="case-topline">
            <p className="section-label">04 / Food sharing / Client design project</p>
            <ReturnToWorkLink />
          </div>
          <header className="case-intro">
            <h1 className="case-title" tabIndex={-1}>Munchpal</h1>
            <p className="case-lead">Surplus meals can go to waste while people nearby struggle to find food. Munchpal is a client mobile-app design that brings local meal listings, requests, and donation routes into one prototype. The challenge was to make offering or requesting food understandable without a complicated handoff.</p>
          </header>
          <figure className="case-hero">
            <ProjectImageTransition slug="munchpal">
              <Image src="/images/munchpal-cover.webp" width={1440} height={810}
                alt="Original Munchpal case-study cover with its green and orange mark beside three mobile app mockups"
                preload sizes="(max-width: 768px) 92vw, (max-width: 1440px) 86vw, 1280px" style={{ aspectRatio: "auto" }} />
            </ProjectImageTransition>
            <figcaption>Original client design presentation, PDF page 1. The screens show proposed app states.</figcaption>
          </figure>
          <dl className="case-facts">
            <div><dt>Audience</dt><dd>People seeking shared food, people with surplus meals, and potential bulk donors.</dd></div>
            <div><dt>Design focus</dt><dd>Finding a nearby offer, posting food, and making the handoff understandable.</dd></div>
            <div><dt>Status</dt><dd>Client design project. The sources document a prototype, not a verified public release.</dd></div>
            <div><dt>Evidence</dt><dd>Original presentation and linked Figma prototype. The source&apos;s reported evaluation figures lack underlying records.</dd></div>
          </dl>
          <a className="case-live-link" href={pdf} data-magnet="text"><span data-magnet-part>Read the original Munchpal case study PDF</span> <span data-magnet-part aria-hidden="true"><ArrowIcon /></span></a>
          <a className="case-live-link" href={prototype} data-magnet="text"><span data-magnet-part>Explore the original MunchPal prototype</span> <span data-magnet-part aria-hidden="true"><ArrowIcon /></span></a>
        </div>
        <section className="case-decisions page-width" aria-labelledby="munchpal-decisions">
          <h2 id="munchpal-decisions">Design decisions</h2>
          <div className="case-decision">
            <h3>Start with place and availability</h3>
            <p>The homepage places a city selector, search, and food categories ahead of the listings. Request controls stay with each item, where someone can see what is offered and whether it is available.</p>
          </div>
          <div className="case-decision">
            <h3>Separate asking from offering</h3>
            <p>A listing has a request action. The central plus button starts an individual food post, and the navigation gives bulk donation its own route. Those entry points keep the two sides of an exchange distinct.</p>
          </div>
          <div className="case-decision">
            <h3>Write the handoff states</h3>
            <p>The flow map and notification designs name new requests, acceptance, messages, and confirmation. The screens also propose ratings and donation reports. They specify feedback a working service would need, without demonstrating that service.</p>
          </div>
        </section>
        <CaseMediaSequence id="munchpal-media" title="From research to handoff" panels={panels} skipTo="munchpal-implementation" skipLabel="Skip to implementation considerations" />
        <section className="case-reading page-width" aria-labelledby="munchpal-implementation">
          <h2 id="munchpal-implementation" tabIndex={-1}>Implementation considerations</h2>
          <div>
            <p>A working food-sharing service would need current inventory, clear pickup arrangements, and a way to withdraw an unavailable listing or request. The design also leaves decisions about food information, moderation, privacy, and notification delivery for implementation. The source material does not verify a live service behind the screens.</p>
            <p>The PDF includes a bulk-donation route labelled with Garda Pangan. That design reference does not establish a formal relationship with the organization. A public integration or partnership claim would need separate confirmation.</p>
          </div>
        </section>
        <section className="case-reading page-width" aria-labelledby="munchpal-evidence">
          <h2 id="munchpal-evidence">What the evidence shows</h2>
          <div>
            <p>The original PDF contains the problem framing, research summary, flow map, wireframes, visual system, and interface mockups. Its Figma link opens an interactive prototype with named request, posting, donation, and community flows. These sources show the design and intended states, not a released food-sharing service or completed donations.</p>
            <p>The PDF reports usability figures and quotes, but no task-level results, calculation, or questionnaire records were available to check them. This case study therefore leaves those figures out.</p>
          </div>
          <ReturnToWorkLink className="case-return" />
        </section>
      </main>
      <SiteFooter />
    </PageTransition>
  );
}
