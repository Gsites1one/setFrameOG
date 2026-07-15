import { Reveal } from "./Reveal";

// The three "why work with me" reasons, given a copper line-icon, a stronger
// type hierarchy and a staggered scroll reveal (opacity + translate, handled
// by Reveal — compositor-safe). No brackets: numbers are gone in favour of
// icons, so nothing competes with the logo/button motif.

type IconProps = { className?: string };

function IconAccountability({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconSystems({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="5" cy="6" r="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="19" cy="9" r="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="10" cy="18" r="2" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M6.7 7.3 8.5 16M6.8 6.4 17 8.4M17.6 10.6 11.4 16.4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconDurable({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 3 19 6v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M9 12l2 2 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const REASONS = [
  {
    Icon: IconAccountability,
    title: "One person, full accountability",
    body: "You talk directly to the person who designs and builds your project. No handoffs, no account managers, no lost context.",
  },
  {
    Icon: IconSystems,
    title: "Systems, not just pages",
    body: "Websites come wired with the follow-up, booking and content flows that keep working after launch. The site is the start, not the end.",
  },
  {
    Icon: IconDurable,
    title: "Built to last",
    body: "Fast, accessible and easy to update. You own everything that gets built, from the code to the content.",
  },
];

export function ContactReasons() {
  return (
    <section aria-label="Why SetFrame" className="mt-12 grid gap-6 sm:grid-cols-3">
      {REASONS.map((reason, i) => (
        <Reveal key={reason.title} delay={i * 0.1}>
          <div className="flex h-full flex-col rounded-xl border border-white/10 bg-surface/60 p-5">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-accent/30 text-accent">
              <reason.Icon className="h-5 w-5" />
            </span>
            <h2 className="mt-4 font-display text-base font-semibold leading-snug">
              {reason.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-foreground/70">
              {reason.body}
            </p>
          </div>
        </Reveal>
      ))}
    </section>
  );
}
