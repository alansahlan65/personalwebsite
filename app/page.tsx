import { ArrowIcon } from "./components/ui-icons";
import Image from "next/image";
import { TransitionLink as Link } from "./components/navigation-transition";
import { SiteHeader } from "./components/site-header";
import { SiteFooter } from "./components/site-footer";
import { ProjectGallery } from "./components/project-gallery";
import { RoleParallax } from "./components/role-parallax";
import { PageTransition } from "./components/page-transition";

export default function Home() {
  return (
    <PageTransition name="home-page">
      <SiteHeader page="home" />
      <main id="main" tabIndex={-1}>
        <section className="hero page-width" aria-labelledby="hero-title">
          <div className="hero-copy">
            <h1 id="hero-title" tabIndex={-1}>Alan<br />Sahlan<span className="name-period">.</span></h1>
            <p className="hero-role">Design <span className="role-dot">•</span> Engineer</p>
          </div>
          <div className="portrait-frame">
            <Image className="portrait" src="/images/alan-portrait.webp" alt="Alan Sahlan" fill preload
              sizes="(max-width: 650px) calc(100vw - 48px), (max-width: 1000px) 42vw, 480px" />
            <span className="portrait-corner" aria-hidden="true" />
          </div>
          <p className="location"><span className="location-id" aria-hidden="true">ID</span><span>Based in Indonesia</span></p>
        </section>
        <RoleParallax />
        <section className="work page-width" id="work" tabIndex={-1} aria-labelledby="work-title">
          <div className="section-intro">
            <h2 className="section-label" id="work-title">Selected work</h2>
            <a className="work-all" href="https://www.behance.net/muhammadsahlanshadiq" target="_blank" rel="noopener noreferrer" aria-label="View all work on Behance (opens in a new tab)" data-magnet="text">
              <span data-magnet-part>View all work</span><ArrowIcon direction="right" />
            </a>
          </div>
          <ProjectGallery />
        </section>
        <section className="about page-width" id="about" aria-labelledby="about-title">
          <h2 className="section-label" id="about-title">About</h2>
          <div className="about-copy">
            <span className="about-corner" aria-hidden="true" />
            <p>UI/UX Designer at an IT consulting company. Bringing design and frontend craft closer together.</p>
            <Link className="about-link" href="/about" data-magnet="text"><span data-magnet-part>More about me</span> <span data-magnet-part aria-hidden="true"><ArrowIcon direction="right" /></span></Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </PageTransition>
  );
}
