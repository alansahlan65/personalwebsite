import { ArrowIcon } from "./components/ui-icons";
import { AlanCharacter } from "./components/alan-character";
import { TransitionLink as Link } from "./components/navigation-transition";
import { SiteHeader } from "./components/site-header";
import { HeroRolePlay } from "./components/hero-role-play";
import { SiteFooter } from "./components/site-footer";
import { ProjectGallery } from "./components/project-gallery";
import { PageTransition } from "./components/page-transition";

export default function Home() {
  return (
    <PageTransition name="home-page">
      <SiteHeader page="home" />
      <main id="main" tabIndex={-1}>
        <section className="hero page-width" aria-labelledby="hero-title">
          <div className="hero-copy">
            <h1 id="hero-title" tabIndex={-1}>Alan<br />Sahlan<span className="name-period">.</span></h1>
            <HeroRolePlay />
          </div>
          <div className="hero-portrait">
            <div className="hero-access">
            <p className="location"><span className="location-id" aria-hidden="true">ID</span><span>Based in Indonesia</span></p>
            <a className="hero-work-link" href="#work" data-pointer-feedback="local">Selected work <ArrowIcon direction="down" /></a>
            </div>
            <AlanCharacter />
          </div>
        </section>
        <section className="work page-width" id="work" tabIndex={-1} aria-labelledby="work-title">
          <div className="section-intro">
            <h2 className="section-label" id="work-title">Selected work</h2>
            <a className="work-all" href="https://www.behance.net/muhammadsahlanshadiq" target="_blank" rel="noopener noreferrer" aria-label="More work on Behance (opens in a new tab)" data-magnet="text">
              <span data-magnet-part>More work on Behance</span><ArrowIcon direction="right" />
            </a>
          </div>
          <ProjectGallery />
        </section>
        <section className="about page-width" id="about" aria-labelledby="about-title">
          <h2 className="section-label" id="about-title">About</h2>
          <div className="about-copy">
            <span className="about-corner" aria-hidden="true" />
            <p>I design for web and mobile, from user research and wireframes to interactive prototypes.</p>
            <Link className="about-link" href="/about" data-magnet="text"><span data-magnet-part>More about me</span> <span data-magnet-part aria-hidden="true"><ArrowIcon direction="right" /></span></Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </PageTransition>
  );
}
