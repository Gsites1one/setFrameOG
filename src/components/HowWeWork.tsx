import Image from "next/image";
import { Reveal } from "./Reveal";
import { SectionNumber } from "./SectionNumber";

// Thin copper line icons, one per step (P9). Static, not filled/bold.
type IconProps = { className?: string };

function IconConversation({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M4 4h12a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-5l-4 3v-3H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
      <path d="M8 9.5h.01M11 9.5h.01M14 9.5h.01" />
    </svg>
  );
}

function IconPreview({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  );
}

function IconOngoing({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M20 12a8 8 0 1 1-2.3-5.6" />
      <path d="M20 4v4h-4" />
    </svg>
  );
}

// Buyer-perspective steps, framed as question -> answer for AEO. Copy is
// unchanged; the supporting images live in public/process/.
const STEPS = [
  {
    number: "01",
    title: "Where does it start?",
    body: "A conversation, not a pitch. We find where your business leaks time, leads or follow-up, and what stopping that is worth.",
    Icon: IconConversation,
    image: "/process/discovery.webp",
    alt: "Two armchairs facing each other with a copper speech bubble above them, representing the first conversation.",
  },
  {
    number: "02",
    title: "What do I see before committing?",
    body: "A working preview. You see the direction with your own eyes before anything is signed, so there is nothing to take on faith.",
    Icon: IconPreview,
    image: "/process/preview.webp",
    alt: "An isometric screen showing a website half built in copper and half as a teal wireframe, representing a working preview.",
  },
  {
    number: "03",
    title: "When do results show up?",
    body: "Launch lands in weeks, not months. Then the system keeps working: replying, reminding and booking while you run the business.",
    Icon: IconOngoing,
    image: "/process/ongoing.webp",
    alt: "An open crate with a glowing monitor inside and a teal ring around it, representing a system that keeps running after launch.",
  },
];

// Static 3-column process (P9). Replaces the earlier sticky scroll-rail: no
// sticky positioning, no scroll-triggered step advance, no continuous motion.
// Each step just fades up once on scroll-into-view via the shared
// RevealObserver (compositor-safe CSS, reduced-motion shows everything).
export function HowWeWork() {
  return (
    <section id="how" className="mx-auto max-w-5xl px-6 py-24">
      <Reveal>
        <SectionNumber number="03" title="How working together goes." />
      </Reveal>

      <div className="grid gap-10 md:grid-cols-3 md:gap-8">
        {STEPS.map((step, i) => (
          <Reveal key={step.number} delay={i * 0.1}>
            <div className="flex h-full flex-col">
              <div className="flex items-center gap-3">
                <step.Icon className="h-6 w-6 shrink-0 text-accent" />
                <span
                  aria-hidden="true"
                  className="font-mono text-2xl font-medium leading-none text-foreground/[0.18]"
                >
                  {step.number}
                </span>
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold sm:text-xl">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground/70">
                {step.body}
              </p>
              {/* mt-auto pushes every illustration to the bottom of its
                  equal-height column so all three share one baseline (T5).
                  Columns are equal width and the boxes share one aspect ratio,
                  so aligned bottoms mean aligned tops too. */}
              <div className="relative mt-5 aspect-[4/3] overflow-hidden rounded-xl border border-white/10 bg-surface md:mt-auto">
                <Image
                  src={step.image}
                  alt={step.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  loading="lazy"
                  className="object-cover"
                />
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
