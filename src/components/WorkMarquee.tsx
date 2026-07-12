import Image from "next/image";
import { PROJECTS, type Project } from "@/lib/projects";
import { Reveal } from "./Reveal";

function MarqueeCard({ project }: { project: Project }) {
  return (
    <a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group mx-4 block w-72 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-surface transition-colors hover:border-accent/50"
    >
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={project.image}
          alt={project.alt}
          fill
          sizes="288px"
          className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
        />
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

export function WorkMarquee() {
  // Track is duplicated for a seamless loop; the copy is aria-hidden so
  // screen readers hear each project once.
  return (
    <section id="work" className="overflow-hidden py-24" aria-label="Selected client work">
      <Reveal>
        <div className="mx-auto mb-10 flex max-w-5xl items-baseline gap-4 px-6">
          <span className="font-mono text-sm text-accent">[ 01 ]</span>
          <h2 className="font-display text-2xl font-bold sm:text-3xl">
            Work that moves businesses forward.
          </h2>
        </div>

        <div className="marquee" tabIndex={0}>
          <div className="marquee-track flex w-max">
            {/* Each half repeats the set 3x so the loop stays wider than any
                viewport; only the first set is exposed to screen readers. */}
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
