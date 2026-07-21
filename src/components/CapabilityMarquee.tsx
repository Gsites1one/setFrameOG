import Image from "next/image";
import Link from "next/link";
import { CAPABILITIES, type Capability } from "@/lib/projects";
import { Eyebrow } from "./Eyebrow";

// Section 01b — breadth showcase (Iteration 4, Task 2). The ten pain cards
// that used to be a static grid now scroll horizontally as a compact strip
// beneath the foundation pillars. Copy for each pain is unchanged; only the
// presentation moved.
//
// Auto-scroll reuses the existing .marquee / .marquee-track CSS (translateX
// 0 -> -50% over 40s, paused on hover/focus, animation removed under
// prefers-reduced-motion). The track is the ten cards rendered twice; the
// second copy is aria-hidden and out of the tab order so assistive tech and
// keyboard users meet each card once. The container is overflow-x-auto with a
// hidden scrollbar, so touch users can swipe it and reduced-motion users get
// a plain scrollable row.

function MarqueeCard({
  capability,
  interactive,
}: {
  capability: Capability;
  interactive: boolean;
}) {
  return (
    <Link
      href={`/knowledge#${capability.slug}`}
      tabIndex={interactive ? undefined : -1}
      aria-hidden={interactive ? undefined : true}
      className="group mx-3 flex w-[320px] shrink-0 items-center gap-4 rounded-xl border border-white/10 bg-surface p-4 transition-colors hover:border-accent/50 focus-visible:border-accent"
    >
      <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-lg bg-background">
        <Image
          src={capability.image}
          alt={capability.alt}
          fill
          sizes="128px"
          loading="lazy"
          className="object-contain p-2 transition-transform duration-500 ease-out group-hover:scale-105"
        />
      </div>
      {/* Both lines share one text size; hierarchy comes from weight/colour
          only, so every card in the belt reads uniformly. */}
      <div className="min-w-0">
        <p className="font-display text-sm font-semibold leading-snug">
          {capability.headline}
        </p>
        <p className="mt-1.5 text-sm leading-snug text-foreground/60">
          {capability.outcome}
        </p>
      </div>
    </Link>
  );
}

export function CapabilityMarquee() {
  return (
    <section aria-label="What SetFrame builds" className="py-8">
      <div className="mx-auto mb-10 max-w-5xl px-6">
        <Eyebrow align="center">Wherever it leaks, it gets built.</Eyebrow>
      </div>

      <div className="marquee overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="marquee-track flex w-max py-1">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex" aria-hidden={copy === 1 || undefined}>
              {CAPABILITIES.map((capability) => (
                <MarqueeCard
                  key={`${copy}-${capability.slug}`}
                  capability={capability}
                  interactive={copy === 0}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-5xl px-6">
        <Link
          href="/knowledge"
          className="group inline-flex items-center gap-1.5 font-display text-base font-semibold text-foreground transition-colors hover:text-accent"
        >
          <span className="border-b border-transparent pb-0.5 transition-colors group-hover:border-accent">
            Discover the process
          </span>
          <span aria-hidden="true" className="text-accent">
            →
          </span>
        </Link>
      </div>
    </section>
  );
}
