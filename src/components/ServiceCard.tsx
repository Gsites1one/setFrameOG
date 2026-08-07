import Image from "next/image";
import Link from "next/link";
import type { Capability } from "@/lib/projects";

// One entry in the /services menu (Iteration 8, Task 4). Replaces the previous
// hairline-divided list row with a real panel: bordered card, thumbnail reusing
// the existing marquee//knowledge illustration, the index promoted to the same
// ghost numeral treatment section 01 uses, and a secondary pill button instead
// of an underlined text link.
//
// AMBIENT MOTION — the constraint here is that ten cards must not all animate
// at once on load, which is exactly what a looping background would do. So the
// side accent is driven by the shared RevealObserver via data-reveal: each
// card's own line draws itself the moment THAT card scrolls into view, once,
// and then rests. Hover adds a copper wash on top. No continuous loop anywhere,
// no per-card JS, and reduced-motion users get the finished state immediately
// (the global [data-reveal] reduced-motion rule already covers both variants).
export function ServiceCard({
  capability,
  index,
}: {
  capability: Capability;
  index: number;
}) {
  return (
    <div
      data-reveal="fade"
      style={{ "--reveal-delay": "0s" } as React.CSSProperties}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-surface/40 p-6 transition-colors duration-300 hover:border-accent/40 sm:p-7"
    >
      {/* ghost numeral — same language as section 01, scaled for a card */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-5 top-3 select-none font-mono text-6xl font-normal leading-none text-foreground/[0.07] sm:text-7xl"
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* side accent: a hairline that draws down this card's left edge as it
          enters view, with two quiet nodes on it */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-6 left-0 w-px"
      >
        <div
          data-reveal="rule-y"
          className="h-full w-full origin-top bg-gradient-to-b from-transparent via-accent/50 to-transparent"
        />
      </div>
      <div
        aria-hidden="true"
        data-reveal="fade"
        className="pointer-events-none absolute left-0 top-10 h-1 w-1 -translate-x-1/2 rounded-full bg-accent/70 shadow-[0_0_8px_1px_rgba(199,123,63,0.5)]"
      />
      <div
        aria-hidden="true"
        data-reveal="fade"
        style={{ "--reveal-delay": "0.15s" } as React.CSSProperties}
        className="pointer-events-none absolute bottom-10 left-0 h-1 w-1 -translate-x-1/2 rounded-full bg-accent/40"
      />

      {/* hover wash, from the accent edge inward */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(70% 120% at 0% 50%, rgba(199,123,63,0.10), transparent 70%)",
        }}
      />

      <div className="relative flex gap-5">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-background sm:h-20 sm:w-20">
          <Image
            src={capability.image}
            alt={capability.alt}
            fill
            sizes="80px"
            loading="lazy"
            className="object-contain p-1.5 transition-transform duration-500 ease-out group-hover:scale-105"
          />
        </div>

        <div className="min-w-0">
          <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-accent/80">
            {capability.name}
          </p>
          {/* Locked pain-first headline — reused verbatim, never reworded. */}
          <h2 className="mt-2 font-display text-lg font-semibold leading-snug sm:text-xl">
            {capability.headline}
          </h2>
          {/* Locked outcome line — also verbatim. */}
          <p className="mt-2 leading-relaxed text-foreground/70">
            {capability.outcome}
          </p>

          {/* Secondary pill: same button language as the main CTA — border,
              pill shape, copper glow on hover — a step down in size and set on
              a neutral border until hover, so it never competes with it. */}
          <Link
            href={`/knowledge#${capability.slug}`}
            className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3.5 py-1.5 font-display text-xs font-semibold text-foreground/75 transition-[color,background-color,border-color,box-shadow] duration-300 hover:border-accent/60 hover:bg-accent/10 hover:text-accent hover:shadow-[0_0_20px_-6px_rgba(199,123,63,0.6)]"
          >
            Learn how it works
            <span aria-hidden="true" className="text-accent">
              →
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
