import type { Metadata } from "next";
import Image from "next/image";
import { TransitionLink as Link } from "../components/navigation-transition";
import { SiteHeader } from "../components/site-header";
import { SiteFooter } from "../components/site-footer";
import { ArrowIcon } from "../components/ui-icons";
import { RESUME_HREF } from "../lib/portfolio-links";
import { PageTransition } from "../components/page-transition";

export const metadata: Metadata = {
  title: "About Alan Sahlan — Product Designer",
  description: "Alan Sahlan is a Product Designer based in Indonesia and a UI/UX Designer at CADIT, connecting design decisions with working interfaces.",
};

export default function About() {
  return (
    <PageTransition name="about-page">
      <SiteHeader page="about" />
      <main id="main" tabIndex={-1} className="about-page page-width">
        <header className="about-hero">
          <div className="about-page-intro">
            <h1 tabIndex={-1}>Product Designer.<br /><span className="about-title-secondary">Closer to the <span className="about-title-accent">build.</span></span></h1>
            <p className="about-lead">I’m Alan Sahlan, based in Indonesia. I currently work as a UI/UX Designer at <a href="https://www.cadit.com/" data-magnet="text"><span data-magnet-part>CADIT</span></a>.</p>
            <p className="about-direction">My primary focus is Product Designer opportunities. I’m also learning toward Design Engineer roles.</p>
            <Link className="about-work-link" href="/#work" data-magnet="text"><span data-magnet-part>View selected work</span><span aria-hidden="true" data-magnet-part><ArrowIcon direction="right" /></span></Link>
          </div>
          <figure className="about-portrait">
            <div className="portrait-frame">
              <Image className="portrait" src="/images/alan-portrait.webp" alt="Alan Sahlan" fill preload sizes="(max-width: 850px) 256px, 360px" />
              <span className="portrait-corner" aria-hidden="true" />
            </div>
            <figcaption><span>Alan Sahlan</span><span>Indonesia</span></figcaption>
          </figure>
        </header>
        <div className="about-details">
          <section aria-labelledby="current-work-title">
            <h2 id="current-work-title" className="section-label">My work at CADIT</h2>
            <div className="about-detail-body">
              <p>I’ve been a UI/UX Designer at CADIT since October 2025. I’m building a component library from the existing design system and creating UI mockups for developers working with international clients.</p>
              <p className="about-supporting">Those clients include Daikin Singapore, Thai Honda, and SP Group Singapore.</p>
            </div>
          </section>
          <section aria-labelledby="project-example-title">
            <h2 id="project-example-title" className="section-label">Designing and building</h2>
            <div className="about-detail-body">
              <p>I designed and built Aurelia independently. The hospitality concept helps visitors compare Bali stays by trip intention, then check practical details before making a request.</p>
              <Link className="about-project-link" href="/work/aurelia" aria-label="Read the Aurelia case study" data-magnet="control">
                <span className="about-project-image"><Image src="/images/aurelia-interface.webp" alt="" width={1440} height={900} sizes="(max-width: 650px) 85vw, 240px" /></span>
                <span className="about-project-copy" data-magnet-part><span className="about-project-title">Aurelia</span><span className="about-project-meta">Hospitality · Self-initiated concept</span><span className="about-project-action">Read the case study <ArrowIcon /></span></span>
              </Link>
            </div>
          </section>
          <section aria-labelledby="approach-title">
            <h2 id="approach-title" className="section-label">How I work and learn</h2>
            <div className="about-detail-body">
              <p>My background includes user research, wireframing, and prototyping for web and mobile. I’m learning to carry design decisions into working interfaces: understand technical constraints, explain design intent, and refine what gets built.</p>
            </div>
          </section>
          <section aria-labelledby="resume-title">
            <h2 id="resume-title" className="section-label">Experience and resume</h2>
            <div className="about-detail-body about-resume">
              <p>My current role, previous experience, education, and selected work in one place.</p>
              <a className="resume-download" href={RESUME_HREF} download="Alan-Sahlan-Resume.pdf" data-magnet="text"><span data-magnet-part>Download resume</span><span aria-hidden="true" data-magnet-part><ArrowIcon direction="down" /></span><span className="resume-format">PDF</span></a>
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </PageTransition>
  );
}
