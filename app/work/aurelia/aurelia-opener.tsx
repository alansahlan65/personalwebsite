import { ProjectOpener } from "../project-opener";

export function AureliaOpener() {
  return <ProjectOpener slug="aurelia" projectName="Aurelia" durationSeconds={36} composition
    poster={{ image: "/images/figma/aurelia/hero.preview.svg", width: 1912, height: 948 }}
    description="From a place to a plan. Explore Tirta Forest Villa, then make the stay your own." />;
}
