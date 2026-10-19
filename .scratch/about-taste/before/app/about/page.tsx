import type { Metadata } from "next";
import { createPageMetadata } from "../lib/metadata";
import Image from "next/image";
import { TransitionLink as Link } from "../components/navigation-transition";
import { SiteHeader } from "../components/site-header";
import { SiteFooter } from "../components/site-footer";
import { ArrowIcon } from "../components/ui-icons";
import { RESUME_HREF } from "../lib/portfolio-links";
import { PageTransition } from "../components/page-transition";
import { AboutExperiment, AboutPortrait, AboutSketch } from "../components/about-play";
import { AboutCuriosity, AboutNotebook } from "../components/about-notebook";
import styles from "./about.module.css";

export const metadata: Metadata = createPageMetadata(
  "About Alan Sahlan — Product Designer",
  "Meet Alan Sahlan, a Product Designer based in Indonesia. A little about his approach to digital products, his work at CADIT, and what he is exploring next.",
);

export default function About() {
  return (
    <PageTransition name="about-page">
      <SiteHeader page="about" />
      <main id="main" tabIndex={-1} className="about-page page-width">
        <header className="about-hero">
          <div className="about-eyebrow">
            <p>About me</p>
            <p>Product Designer <span aria-hidden="true">/</span> Indonesia</p>
          </div>
          <h1 tabIndex={-1}>I design digital products, from the first question to <span className="about-title-accent">the smallest interaction.</span></h1>
          <p className={styles.heroAside}><span>Designer. Movie watcher. Gamer. History reader.</span><span aria-hidden="true">✳</span></p>
          <div className={styles.heroActions}>
            <Link className="about-action" href="/contact" data-magnet="text">
              <span data-magnet-part>Let&apos;s talk</span>
              <span data-magnet-part><ArrowIcon /></span>
            </Link>
            <a className={styles.meetLink} href="#about-story-title">Meet the human
              <svg viewBox="0 0 60 40" fill="none" aria-hidden="true"><path d="M3 10c20-15 42-2 37 13s-21 4-11-3 21 0 24 13m-9-2 10 3 3-10" /></svg>
            </a>
          </div>
        </header>

        <div className="about-story">
          <section className="about-story-copy" aria-labelledby="about-story-title">
            <h2 id="about-story-title" className="section-label">A little about me</h2>
            <p className="about-story-lead">I&apos;m Alan, a Product Designer based in Indonesia.</p>
            <p>My background is in <AboutSketch kind="research" />, <AboutSketch kind="wireframe" />, and <AboutSketch kind="prototype" /> for web and mobile. I like making sense of a problem, then working through how an interface should look and behave.</p>
            <p>That curiosity extends to how things are made. I want to understand what happens beyond the mockup, and stay involved as an idea becomes something people can use.</p>
            <p>I love how small details can add so much to an app or website. Away from design, you&apos;ll find me watching movies, gaming, or reading history.</p>
            <AboutNotebook />
            <Link className="about-action" href="/#work" data-magnet="text">
              <span data-magnet-part>View selected work</span>
              <span data-magnet-part><ArrowIcon direction="right" /></span>
            </Link>
          </section>
          <figure className={`about-portrait ${styles.portraitFigure}`}>
            <span className={styles.portraitAnnotation} aria-hidden="true">Yep, that&apos;s me.
              <svg viewBox="0 0 60 40" fill="none"><path d="M3 10c25-11 30-6 38 19m-9-4 10 6 5-11" /></svg>
            </span>
            <AboutPortrait>
              <Image className="portrait" src="/images/alan-portrait.webp" alt="Alan Sahlan" fill sizes="(max-width: 760px) calc(100vw - 48px), (max-width: 1200px) 40vw, 480px" />
              <span className="portrait-corner" aria-hidden="true" />
              <span className={styles.portraitStamp} aria-hidden="true">ALAN SAHLAN<span>✳</span>STILL CURIOUS</span>
            </AboutPortrait>
            <figcaption><span>Alan Sahlan</span><span>Based in Indonesia</span></figcaption>
          </figure>
        </div>

        <div className="about-details">
          <section aria-labelledby="current-work-title">
            <div className={styles.nowHeading}>
              <h2 id="current-work-title" className="section-label">Where I am now</h2>
              <span className={styles.currentTag}><i aria-hidden="true" />The current chapter</span>
            </div>
            <div className="about-role">
              <p className="about-role-company"><a href="https://www.cadit.com/">CADIT <ArrowIcon /></a></p>
              <p className="about-role-title">UI/UX Designer</p>
              <p className="about-role-date">Since <time dateTime="2025-10">October 2025</time></p>
            </div>
            <p>I&apos;m building a component library from the existing design system and creating UI mockups for developers working with international clients.</p>
            <p className="about-supporting">Through CADIT, that work includes Daikin Singapore, Thai Honda, and SP Group Singapore.</p>
            <div className={styles.workNote}><p>From design decisions to the details developers can build.</p><span>A thread that runs through my work.</span></div>
            <a className="about-action resume-download" href={RESUME_HREF} download="Alan-Sahlan-Resume.pdf" aria-label="Download resume, PDF" data-magnet="text">
              <span data-magnet-part>Download resume</span>
              <span data-magnet-part><ArrowIcon direction="down" /></span>
              <span className="resume-format">PDF</span>
            </a>
          </section>
          <section aria-labelledby="approach-title">
            <h2 id="approach-title" className="section-label">Where I&apos;m heading</h2>
            <p className="about-outlook">Design is my starting point. <span>There&apos;s more I want to learn.</span></p>
            <p>Lately, I&apos;ve been learning to build interfaces in code. It helps me understand technical constraints, explain design decisions, and refine the details as they take shape.</p>
            <p>Product design is still at the heart of what I do. Design engineering is a direction I&apos;m growing into, with room to keep exploring.</p>
            <AboutCuriosity />
            <AboutExperiment />
          </section>
        </div>
      </main>
      <SiteFooter />
    </PageTransition>
  );
}
