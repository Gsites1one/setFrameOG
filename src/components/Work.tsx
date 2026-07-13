import Image from "next/image";
import { PROJECTS, type Project } from "@/lib/projects";
import { CornerShowcase } from "./CornerShowcase";
import { FlowDiagram } from "./FlowDiagram";
import { Reveal } from "./Reveal";

// Keyword-level only: signals insight without giving away the method.
const WHY_WEBSITES = [
  { number: "[ 01 ]", text: "Search engines answer first now. Visitors arrive half-decided." },
  { number: "[ 02 ]", text: "Your website has one job: turn that trust into action." },
  { number: "[ 03 ]", text: "Growing businesses run systems of pages, not a brochure." },
];

function MarqueeCard({ project }: { project: Project }) {
  return (
    <a
      href={project.url}
      target={project.kind === "site" ? "_blank" : undefined}
      rel={project.kind === "site" ? "noopener noreferrer" : undefined}
      className="group mx-4 block w-72 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-surface transition-colors hover:border-accent/50"
    >
      <div className="relative aspect-video overflow-hidden">
        {project.kind === "site" && project.image ? (
          <Image
            src={project.image}
            alt={project.alt ?? project.name}
            fill
            sizes="288px"
            className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <FlowDiagram />
        )}
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

export function Work() {
  return (
    <section id="work" className="overflow-hidden py-24" aria-label="Selected client work">
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
          <div className="grid items-center gap-10 lg:grid-cols-[3fr_2fr]">
            <CornerShowcase />
            <ul className="space-y-6" aria-label="Why your website matters now">
              {WHY_WEBSITES.map((item) => (
                <li key={item.number} className="flex gap-4">
                  <span className="shrink-0 font-mono text-sm text-accent">
                    {item.number}
                  </span>
                  <p className="text-sm leading-relaxed text-foreground/80">
                    {item.text}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>

      <Reveal delay={0.15}>
        <div className="marquee mt-16" tabIndex={0}>
          <div className="marquee-track flex w-max">
            {[0, 1].map((half) => (
              <div key={half} className="flex" aria-hidden={half === 1}>
                {[0, 1, 2].map((repeat) => (
                  <div
                    key={repeat}
                    className="flex"
                    aria-hidden={half === 0 && repeat > 0 ? true : undefined}
                  >
                    {PROJECTS.map((project) => (
                      <MarqueeCard
                        key={`${half}-${repeat}-${project.slug}`}
                        project={project}
                      />
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
