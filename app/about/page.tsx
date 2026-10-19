import type { Metadata } from "next";
import Image from "next/image";
import { createPageMetadata } from "../lib/metadata";
import { SiteHeader } from "../components/site-header";
import { SiteFooter } from "../components/site-footer";
import { ArrowIcon } from "../components/ui-icons";
import { RESUME_HREF } from "../lib/portfolio-links";
import { PageTransition } from "../components/page-transition";
import { AboutExperiment, AboutPortrait, AboutSketch } from "../components/about-play";
import { AboutNotebook } from "../components/about-notebook";
import styles from "./about.module.css";

export const metadata: Metadata = createPageMetadata(
  "About Alan Sahlan | Product Designer",
  "Alan Sahlan is a Product Designer in Indonesia and a UI/UX Designer at CADIT. Read about his work, experience and interest in building interfaces.",
);

export default function About() {
  return (
    <PageTransition name="about-page">
      <SiteHeader page="about" />
      <main id="main" tabIndex={-1} className={`about-page page-width ${styles.page}`}>
        <header className={styles.hero}>
          <div className={styles.intro}>
            <h1 tabIndex={-1}>Hi, I&apos;m <span>Alan.</span></h1>
            <p className={styles.introText}>I&apos;m a Product Designer in Indonesia. I work at CADIT and I&apos;m learning to build the interfaces I design.</p>
          </div>
          <figure className={`about-portrait ${styles.portraitFigure}`}>
            <AboutPortrait>
              <Image className="portrait" src="/images/alan-portrait.webp" alt="Alan Sahlan" fill loading="eager" fetchPriority="high" sizes="(max-width: 760px) min(440px, calc(100vw - max(48px, 10vw))), min(440px, 33.2vw)" />
              <span className="portrait-corner" aria-hidden="true" />
            </AboutPortrait>
          </figure>
        </header>
        <div className={styles.story}>
          <section className={styles.storyIntro} aria-labelledby="capabilities-title">
            <h2 id="capabilities-title">What I do</h2>
            <p>I work across <span className={styles.skillPhrase}><AboutSketch kind="research" />,</span>{" "}<span className={styles.skillPhrase}><AboutSketch kind="wireframe" />,</span> and <AboutSketch kind="prototype" /> for web and mobile.</p>
            <p>I work with developers on components, UI details and design handoff.</p>
          </section>
          <section className={styles.currentWork} aria-labelledby="about-story-title">
            <h2 id="about-story-title" tabIndex={-1}>Experience</h2>
            <div className={styles.role}>
              <a href="https://www.cadit.com/" data-magnet="text"><span data-magnet-part>CADIT</span><span data-magnet-part aria-hidden="true"><ArrowIcon /></span></a>
              <p>UI/UX Designer <span>Since <time dateTime="2025-10">October 2025</time></span></p>
            </div>
            <p>I build a component library and create UI mockups for developers working with international clients.</p>
            <p className={styles.clients}>Client work includes Daikin Singapore, Thai Honda and SP Group Singapore.</p>
            <div className={styles.workActions}>
              <a className="about-action resume-download" href={RESUME_HREF} download="Alan-Sahlan-Resume.pdf" aria-label="Download resume, PDF" data-magnet="text"><span data-magnet-part>Download resume</span><span data-magnet-part><ArrowIcon direction="down" /></span><span className="resume-format">PDF</span></a>
            </div>
          </section>
        </div>
        <section className={`${styles.learning} about-details`} aria-labelledby="approach-title">
          <div>
            <h2 id="approach-title">Learning by building</h2>
            <p>I&apos;m learning to code so I can test how my designs work and understand what it takes to build them.</p>
          </div>
          <AboutExperiment />
        </section>
        <section className={styles.personal} aria-labelledby="trivia-title">
          <div className={styles.personalIntro}>
            <h2 id="trivia-title">Little trivia</h2>
          </div>
          <AboutNotebook />
        </section>
      </main>
      <SiteFooter />
    </PageTransition>
  );
}
