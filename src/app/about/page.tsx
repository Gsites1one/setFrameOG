import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArtFrame } from "@/components/ArtFrame";
import { CtaButton } from "@/components/CtaButton";
import { Eyebrow } from "@/components/Eyebrow";
import { LogoMark } from "@/components/LogoMark";
import { PageHeader } from "@/components/PageHeader";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About — SetFrame",
  description:
    "SetFrame is a studio that builds websites and the systems behind them for businesses that run on inquiries, appointments and follow-up. Built for one business at a time, and only where it is actually needed.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About — SetFrame",
    description:
      "A studio that builds websites and the systems behind them, measured by what changes after they ship.",
    url: `${SITE_URL}/about`,
    siteName: "SetFrame",
    type: "website",
  },
};

// Studio-level only. No founder, no name, no photo, no personal history — a
// standing decision, not an oversight: the site sells a way of working, and
// personal branding would change what is being promised.
//
// Iteration 7 rebuilt this page around two supplied images and cut the running
// text roughly in half. It had grown into ~780 words of five two-paragraph
// principles plus a "how we work together" panel, most of which restated the
// homepage pillars, the FAQ and the contact page's reasons almost line for
// line. Each principle is now a single sentence compressed from that same
// already-approved language — no new claims about the business are introduced
// here.
//
// Both images use ArtFrame at one shared 3:4 ratio with object-cover, matching
// the pillar treatment. 3:4 rather than the pillars' 4:3 because both source
// files are portrait (0.80 and 0.64) — a landscape box would have cropped the
// blueprint's roof off. 3:4 keeps the crop off both subjects.
const PRINCIPLES = [
  {
    label: "Built for you",
    line: "Every project is shaped around one specific business, never copied from the last one.",
  },
  {
    label: "Feedback until it fits",
    line: "Revisions run until the goal is reached, because that is the job, not an extra.",
  },
  {
    label: "The result is the pitch",
    line: "The tools stay invisible; what counts is what changes once they are running.",
  },
];

export default function AboutPage() {
  return (
    <main className="mx-auto min-h-screen max-w-4xl px-6 py-16">
      <PageHeader />

      {/* Opening: the philosophy in one breath, paired with Image A. */}
      <section className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
        <ArtFrame className="aspect-[3/4] w-full">
          <Image
            src="/about/approach-compass.webp"
            alt="A brass drafting compass drawing a precise circle on an aged blueprint, warm light pooling where its point meets the paper."
            fill
            sizes="(max-width: 768px) 100vw, 420px"
            priority
            className="object-cover object-center"
          />
        </ArtFrame>

        <div>
          <Eyebrow>What SetFrame is</Eyebrow>
          <h1 className="mt-6 font-display text-3xl font-bold leading-tight sm:text-4xl">
            A system is only worth what changes after it ships.
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-foreground/75">
            <LogoMark className="text-foreground" /> is a studio that builds
            websites and the systems behind them for businesses that run on
            inquiries, appointments and follow-up.
          </p>
        </div>
      </section>

      {/* Three principles, one sentence each. */}
      <section className="mt-24">
        <Eyebrow>How the work is approached</Eyebrow>
        <div className="mt-10 grid gap-10 sm:grid-cols-3 sm:gap-8">
          {PRINCIPLES.map((principle) => (
            <div key={principle.label}>
              <div aria-hidden="true" className="h-px w-10 bg-accent/60" />
              <h2 className="mt-5 font-display text-lg font-semibold leading-snug">
                {principle.label}
              </h2>
              <p className="mt-3 leading-relaxed text-foreground/70">
                {principle.line}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Closing: breadth, and scoping to what is needed — paired with Image B.
          Order is flipped from the opening block (text first on desktop) so the
          page does not read as two identical rows. Copy is deliberately about
          BREADTH and selective scoping, distinct from the homepage approach
          banner, which is about diagnosing the one specific gap. */}
      <section className="mt-24 grid items-center gap-10 md:grid-cols-2 md:gap-14">
        <div className="md:order-2">
          <ArtFrame className="aspect-[3/4] w-full">
            <Image
              src="/about/range-blueprint.webp"
              alt="A hand holding a house blueprint whose rooms are drawn as interlocking puzzle pieces; three rooms are lit warm and stamped, the rest are still pencil outlines."
              fill
              sizes="(max-width: 768px) 100vw, 420px"
              loading="lazy"
              className="object-cover object-center"
            />
          </ArtFrame>
        </div>

        <div className="md:order-1">
          <Eyebrow>What gets built</Eyebrow>
          <h2 className="mt-6 font-display text-2xl font-bold leading-snug sm:text-3xl">
            The whole range exists. Only part of it is yours.
          </h2>
          <p className="mt-6 leading-relaxed text-foreground/75">
            Websites, replies and booking, paperwork, outreach, storefronts,
            dashboards. A business rarely needs all of it, and paying for rooms
            you will not walk into is its own kind of leak.
          </p>
          <p className="mt-4 leading-relaxed text-foreground/75">
            So the plan gets drawn in full, and only the parts that earn their
            place get built.
          </p>
          <Link
            href="/services"
            className="group mt-8 inline-flex items-center gap-1.5 font-display text-base font-semibold text-foreground transition-colors hover:text-accent"
          >
            <span className="border-b border-transparent pb-0.5 transition-colors group-hover:border-accent">
              See the full range
            </span>
            <span aria-hidden="true" className="text-accent">
              →
            </span>
          </Link>
        </div>
      </section>

      <section className="py-24 text-center">
        <h2 className="mx-auto max-w-xl font-display text-2xl font-bold leading-snug sm:text-3xl">
          The first step costs nothing and tells you the most.
        </h2>
        <p className="mx-auto mt-4 max-w-md leading-relaxed text-foreground/70">
          One conversation about where your business is leaking, and what
          stopping it is worth.
        </p>
        <div className="mt-8">
          <CtaButton size="lg" />
        </div>
      </section>
    </main>
  );
}
