import Image from "next/image";
import Link from "next/link";

const projects = [
  { name: "Aurelia", category: "Hospitality" },
  { name: "Paylecta", category: "Finance" },
  { name: "PawFriend", category: "Pet adoption" },
  { name: "Munchpal", category: "Food sharing" },
];

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="site-header page-width">
        <Link className="brand" href="/" aria-label="Alan Sahlan, home">
          <Image src="/images/alan-logo.png" width={52} height={52} alt="" />
          <span>Alan Sahlan</span>
        </Link>
        <nav className="primary-nav" aria-label="Primary">
          <a href="#work">Work</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
          <span className="unavailable" aria-disabled="true" title="Resume will be added after verification">Resume</span>
        </nav>
      </header>
      <main id="main" tabIndex={-1}>
        <section className="hero page-width" aria-labelledby="hero-title">
          <div className="hero-copy">
            <h1 id="hero-title">Alan<br />Sahlan<span className="name-period">.</span></h1>
            <p className="hero-role">Design <span className="role-dot">•</span> Engineer</p>
          </div>
          <div className="portrait-frame">
            <Image className="portrait" src="/images/alan-portrait.webp" alt="Alan Sahlan" fill preload
              sizes="(max-width: 650px) calc(100vw - 48px), (max-width: 1000px) 42vw, 480px" />
            <span className="portrait-corner" aria-hidden="true" />
          </div>
          <p className="location"><span className="location-id" aria-hidden="true">ID</span><span>Based in Indonesia</span></p>
        </section>
        <section className="roles" aria-labelledby="roles-title">
          <div className="page-width"><h2 className="section-label" id="roles-title">Design / Build / Refine</h2></div>
          <div className="role-lines page-width">
            <p>Product Designer</p><p>Design Engineer</p><p>Interaction Designer</p>
          </div>
        </section>
        <section className="work page-width" id="work" aria-labelledby="work-title">
          <div className="section-intro">
            <h2 className="section-label" id="work-title">Selected work</h2>
            <p className="development-note">Case studies in preparation</p>
          </div>
          <ol className="project-list">
            {projects.map((project, index) => (
              <li className="project-row" key={project.name}>
                <span className="project-number" aria-hidden="true">0{index + 1}</span>
                <h3>{project.name}</h3><span className="project-category">{project.category}</span>
              </li>
            ))}
          </ol>
        </section>
        <section className="about page-width" id="about" aria-labelledby="about-title">
          <h2 className="section-label" id="about-title">About</h2>
          <div className="about-copy">
            <span className="about-corner" aria-hidden="true" />
            <p>UI/UX Designer at an IT consulting company. Bringing design and frontend craft closer together.</p>
          </div>
        </section>
        <footer className="contact" id="contact" aria-labelledby="contact-title">
          <div className="page-width">
            <h2 id="contact-title">Let’s work<br />together.</h2>
            <p className="contact-note">Contact details will be added soon.</p>
            <div className="footer-bottom">
              <Link className="footer-home" href="/" aria-label="Alan Sahlan, home">
                <Image src="/images/alan-logo.png" alt="" width={64} height={64} /><span>Alan Sahlan</span>
              </Link>
              <p>© {new Date().getFullYear()} Alan Sahlan</p>
            </div>
            <p className="preview-note">Development preview. Typography and remaining interactions are in progress.</p>
          </div>
        </footer>
      </main>
    </>
  );
}



