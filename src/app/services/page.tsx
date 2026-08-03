import type { Metadata } from "next";
import Link from "next/link";
import { CtaButton } from "@/components/CtaButton";
import { Eyebrow } from "@/components/Eyebrow";
import { PageHeader } from "@/components/PageHeader";
import { CAPABILITIES } from "@/lib/projects";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Services — SetFrame",
  description:
    "The full range SetFrame builds: websites, response and booking, document processing, lead capture, outreach, e-commerce, dashboards, automation and system mapping. A working version in 7 days, full rollout in 30.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Services — SetFrame",
    description:
      "Everything SetFrame builds, and the leak each one closes. A working version in 7 days, full rollout in 30.",
    url: `${SITE_URL}/services`,
    siteName: "SetFrame",
    type: "website",
  },
};

// /services is the SALES view of the same ten capabilities: what each one is
// for, in one pain line and one result line, so a visitor can scan the whole
// range in a minute and pick the one that sounds like their problem.
//
// It deliberately does NOT restate /knowledge. Every entry carries only the
// locked `headline` and `outcome` strings (the same two lines the homepage
// marquee shows) and then hands off to /knowledge#slug for the explanation of
// what the thing actually is and how it works. Nothing on this page is newly
// written per-capability copy — that is a hard constraint, because these pain
// headlines are final.
export default function ServicesPage() {
  return (
    <main className="mx-auto min-h-screen max-w-3xl px-6 py-16">
      <PageHeader />

      <h1 className="max-w-2xl font-display text-3xl font-bold leading-tight sm:text-4xl">
        Everything that gets built, and the leak it closes.
      </h1>
      <p className="mt-4 max-w-2xl leading-relaxed text-foreground/70">
        Every project starts from the same question: where is the business
        losing time, leads or follow-up right now. Find the line below that
        sounds like yours.
      </p>
      <p className="mt-4 max-w-2xl font-mono text-xs leading-relaxed tracking-wide text-foreground/55">
        Built to order, one business at a time.{" "}
        <span className="text-accent">7 days</span> to a working version,{" "}
        <span className="text-accent">30 days</span> to full rollout.
      </p>

      <div className="mt-8">
        <CtaButton />
      </div>

      {/* The menu. A hairline-separated list rather than a card grid: this page
          is for scanning ten things in order, and ten cards would read as a
          second marquee. */}
      <ol className="mt-16 border-t border-white/10">
        {CAPABILITIES.map((capability, i) => (
          <li
            key={capability.slug}
            id={capability.slug}
            className="scroll-mt-24 border-b border-white/10"
          >
            <div className="group flex gap-5 py-8">
              <span
                aria-hidden="true"
                className="shrink-0 pt-1 font-mono text-xs text-foreground/30"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
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
                <Link
                  href={`/knowledge#${capability.slug}`}
                  className="mt-4 inline-flex items-center gap-1.5 font-mono text-xs text-foreground/60 transition-colors hover:text-accent"
                >
                  <span className="border-b border-transparent pb-0.5 transition-colors group-hover:border-accent/40">
                    Learn how it works
                  </span>
                  <span aria-hidden="true" className="text-accent">
                    →
                  </span>
                </Link>
              </div>
            </div>

            {/* CTA breaks, placed inside the list so they interrupt the scan
                rather than waiting at the bottom of ten entries. */}
            {(i === 3 || i === 7) && (
              <div className="border-t border-white/10 bg-surface/30 px-5 py-8 text-center">
                <p className="font-display text-base font-semibold">
                  {i === 3
                    ? "Recognise one of these already?"
                    : "Not sure which one you need?"}
                </p>
                <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-foreground/60">
                  {i === 3
                    ? "That is usually enough to start from. The first conversation is about finding what it costs you."
                    : "Most businesses do not. The conversation works it out before anything gets built."}
                </p>
                <div className="mt-5">
                  <CtaButton size="sm" />
                </div>
              </div>
            )}
          </li>
        ))}
      </ol>

      <section className="py-16 text-center">
        <Eyebrow align="center">Where it starts</Eyebrow>
        <h2 className="mx-auto mt-6 max-w-xl font-display text-2xl font-bold leading-snug sm:text-3xl">
          One conversation, and you will know what this is worth.
        </h2>
        <p className="mx-auto mt-4 max-w-md leading-relaxed text-foreground/70">
          No pitch. We find where the business leaks, agree what stopping it is
          worth, and you see a working version before anything is signed.
        </p>
        <div className="mt-8">
          <CtaButton size="lg" />
        </div>
        <p className="mt-8 font-mono text-xs text-foreground/50">
          <Link
            href="/knowledge"
            className="transition-colors hover:text-accent"
          >
            Or read how the systems actually work →
          </Link>
        </p>
      </section>
    </main>
  );
}
