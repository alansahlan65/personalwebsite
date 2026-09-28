import { TransitionLink as Link } from "./components/navigation-transition";
import { PageTransition } from "./components/page-transition";
import { SiteFooter } from "./components/site-footer";
import { SiteHeader } from "./components/site-header";
import { ArrowIcon } from "./components/ui-icons";

export default function NotFound() {
  return (
    <PageTransition name="not-found-page">
      <SiteHeader page="work" />
      <main id="main" className="not-found page-width" tabIndex={-1}>
        <p className="section-label">404 / Page not found</p>
        <h1 tabIndex={-1}>There’s nothing here.</h1>
        <p>The page may have moved, or the address may be wrong. You can return to the portfolio and continue browsing.</p>
        <Link href="/#work" className="not-found-link" data-magnet="text">
          <span data-magnet-part>View selected work</span>
          <span data-magnet-part aria-hidden="true"><ArrowIcon direction="right" /></span>
        </Link>
      </main>
      <SiteFooter />
    </PageTransition>
  );
}
