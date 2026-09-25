import type { Metadata } from "next";
import { SiteHeader } from "../components/site-header";
import { SiteFooter } from "../components/site-footer";

export const metadata: Metadata = {
  title: "About Alan Sahlan — Product Designer",
  description: "Alan's current work in UI/UX design and his developing design engineering practice.",
};

export default function About() {
  return (
    <>
      <SiteHeader page="about" />
      <main id="main" tabIndex={-1} className="about-page page-width">
        <h1 tabIndex={-1}>About me</h1>
        <div className="about-page-intro">
          <span className="about-corner" aria-hidden="true" />
          <p>I’m Alan, a UI/UX Designer at an IT consulting company, based in Indonesia.</p>
        </div>
        <div className="about-details">
          <section aria-labelledby="direction-title">
            <h2 id="direction-title" className="section-label">Where I’m heading</h2>
            <p>My primary focus is Product Designer opportunities. I’m also learning toward Design Engineer roles and open to opportunities in that direction.</p>
          </section>
          <section aria-labelledby="approach-title">
            <h2 id="approach-title" className="section-label">From a problem to a prototype</h2>
            <p>My background includes user research, wireframing, and prototyping for web and mobile interfaces. I’m interested in how those design decisions carry through to a working product.</p>
          </section>
          <section aria-labelledby="learning-title">
            <h2 id="learning-title" className="section-label">Bringing design and development closer</h2>
            <p>I’m learning to connect design decisions with what can be built: understand technical constraints, explain design intent, and build and refine interfaces.</p>
          </section>
          <section aria-labelledby="resume-title">
            <h2 id="resume-title" className="section-label">Resume</h2>
            <p className="development-note">An updated resume will be available here once verified.</p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
