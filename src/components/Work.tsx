import Image from "next/image";
import {
  SYSTEM_PROJECTS,
  WEBSITE_PROJECTS,
  type Project,
} from "@/lib/projects";
import { Reveal } from "./Reveal";
import { SectionNumber } from "./SectionNumber";
import { WebsiteCard } from "./WebsiteCard";

// Keyword-level only: signals insight without giving away the method.
const WHY_WEBSITES = [
  { number: "[ 01 ]", text: "Search engines answer first now. Visitors arrive half-decided." },
  { number: "[ 02 ]", text: "Your website has one job: turn that trust into action." },
  { number: "[ 03 ]", text: "Growing businesses run systems of pages, not a brochure." },
];

// The raster tiles are square isometric renders on a near-black backdrop
// that already matches the site background, so `object-contain` (not cover)
// keeps the whole composition intact inside the 16:9 card instead of
// cropping the top/bottom nodes — the letterboxed edges are invisible
// against the matching background.
function SystemTileImage({ project }: { project: Project }) {
  if (!project.image) return null;
  return (
    <div className="relative aspect-video overflow-hidden bg-surface">
      <Image
        src={project.image}
        alt={project.alt ?? project.name}
        fill
        sizes="320px"
        className="object-contain p-4 transition-transform duration-500 ease-out group-hover:scale-105"
      />
      {/* slow breathing highlight — opacity only, shared keyframe with the
          hero/ambient glow so it reads as one motion system */}
      <div
        aria-hidden="true"
        className="ambient-glow pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(199,123,63,0.35),transparent_65%)]"
      />
    </div>
  );
}

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
      <SystemTileImage project={project} />
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
  // (With the capability tiles added alongside the real system, this branch
  // stays correct if the data ever drops back to one entry.)
  if (SYSTEM_PROJECTS.length < 2) {
    const project = SYSTEM_PROJECTS[0];
    return (
      <div className="mx-auto mt-16 max-w-2xl px-6">
        <a
          href={project.url}
          className="group block overflow-hidden rounded-xl border border-white/10 bg-surface transition-colors hover:border-accent/50"
        >
          <SystemTileImage project={project} />
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
          <SectionNumber number="01" title="Work that moves businesses forward." />
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
          <div className="mt-20 flex flex-col items-center gap-6 sm:flex-row sm:items-center">
            <div className="relative aspect-square w-40 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-surface sm:w-48">
              <Image
                src="/systems/system-tower.webp"
                alt="Illustration of a layered tower with a light beam rising from it, representing a business system built to keep running"
                fill
                sizes="192px"
                className="object-contain p-3"
              />
              <div
                aria-hidden="true"
                className="ambient-glow pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(79,179,201,0.3),transparent_65%)]"
              />
            </div>
            <p className="font-mono text-xs tracking-widest text-foreground/50 sm:max-w-xs">
              systems that keep working after launch
            </p>
          </div>
        </Reveal>
      </div>

      <Reveal delay={0.15}>
        <SystemsStrip />
      </Reveal>
    </section>
  );
}
