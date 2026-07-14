import {
  SYSTEM_PROJECTS,
  WEBSITE_PROJECTS,
  type Project,
} from "@/lib/projects";
import { FlowDiagram } from "./FlowDiagram";
import { Reveal } from "./Reveal";
import { WebsiteCard } from "./WebsiteCard";

// Keyword-level only: signals insight without giving away the method.
const WHY_WEBSITES = [
  { number: "[ 01 ]", text: "Search engines answer first now. Visitors arrive half-decided." },
  { number: "[ 02 ]", text: "Your website has one job: turn that trust into action." },
  { number: "[ 03 ]", text: "Growing businesses run systems of pages, not a brochure." },
];

// `interactive` is false inside aria-hidden marquee duplicates so screen
// readers and keyboard focus skip them (no focusable descendants in
// aria-hidden containers).
function SystemCard({
  project,
  interactive = true,
}: {
  project: Project;
  interactive?: boolean;
}) {
  return (
    <a
      href={project.url}
      tabIndex={interactive ? undefined : -1}
      aria-hidden={interactive ? undefined : true}
      className="group mx-4 block w-80 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-surface transition-colors hover:border-accent/50"
    >
      <div className="relative aspect-video overflow-hidden">
        <FlowDiagram />
      </div>
      <div className="px-4 py-3">
        <p className="font-display text-sm font-semibold">{project.name}</p>
        <p className="mt-1 text-xs leading-relaxed text-foreground/60">
          {project.outcome}
        </p>
      </div>
    </a>
  );
}

function SystemsStrip() {
  // A single system reads as broken in an infinite scroller, so show it as a
  // centered feature; switch to the marquee once there are two or more.
  if (SYSTEM_PROJECTS.length < 2) {
    const project = SYSTEM_PROJECTS[0];
    return (
      <div className="mx-auto mt-16 max-w-2xl px-6">
        <a
          href={project.url}
          className="group block overflow-hidden rounded-xl border border-white/10 bg-surface transition-colors hover:border-accent/50"
        >
          <div className="relative aspect-video overflow-hidden">
            <FlowDiagram />
          </div>
          <div className="px-5 py-4">
            <p className="font-display text-base font-semibold">{project.name}</p>
            <p className="mt-1 text-sm leading-relaxed text-foreground/60">
              {project.outcome}
            </p>
          </div>
        </a>
      </div>
    );
  }

  return (
    <div className="marquee mt-16" tabIndex={0}>
      <div className="marquee-track flex w-max">
        {[0, 1].map((half) => (
          <div key={half} className="flex">
            {[0, 1, 2].map((repeat) => (
              <div key={repeat} className="flex">
                {SYSTEM_PROJECTS.map((project) => (
                  <SystemCard
                    key={`${half}-${repeat}-${project.slug}`}
                    project={project}
                    interactive={half === 0 && repeat === 0}
                  />
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function Work() {
  return (
    <section id="work" className="overflow-hidden py-24" aria-label="Selected work">
      <div className="mx-auto max-w-5xl px-6">
        <Reveal>
          <div className="mb-10 flex items-baseline gap-4">
            <span className="font-mono text-sm text-accent">[ 01 ]</span>
            <h2 className="font-display text-2xl font-bold sm:text-3xl">
              Work that moves businesses forward.
            </h2>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <ul
            className="mb-12 grid gap-4 sm:grid-cols-3"
            aria-label="Why your website matters now"
          >
            {WHY_WEBSITES.map((item) => (
              <li key={item.number} className="flex gap-3">
                <span className="shrink-0 font-mono text-sm text-accent">
                  {item.number}
                </span>
                <p className="text-sm leading-relaxed text-foreground/80">
                  {item.text}
                </p>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="grid gap-8 md:grid-cols-2">
            {WEBSITE_PROJECTS.map((project) => (
              <WebsiteCard key={project.slug} project={project} />
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mt-20 font-mono text-xs tracking-widest text-foreground/50">
            systems that keep working after launch
          </p>
        </Reveal>
      </div>

      <Reveal delay={0.15}>
        <SystemsStrip />
      </Reveal>
    </section>
  );
}
