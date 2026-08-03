import type { Metadata } from "next";
import Link from "next/link";
import { CtaButton } from "@/components/CtaButton";
import { Eyebrow } from "@/components/Eyebrow";
import { LogoMark } from "@/components/LogoMark";
import { PageHeader } from "@/components/PageHeader";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About — SetFrame",
  description:
    "SetFrame is a studio that builds websites and the systems behind them for businesses that run on inquiries, appointments and follow-up. How the work is approached, and what working together looks like.",
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
// deliberate, standing decision, not an oversight: the site sells a way of
// working, and personal branding would change what is being promised.
//
// This page is the long form of homepage section 04, not a copy of it. The
// homepage keeps a short teaser and links here. It is also NOT a restatement
// of section 03 (the three process steps): section 03 is the sequence of what
// happens, this is why the work is shaped that way.
const PRINCIPLES = [
  {
    title: "The result is the product, not the software.",
    body: [
      "A system is only worth what changes after it ships. A dashboard that nobody opens, an automation that saves four minutes a month, a redesign that moves nothing — all of it is cost dressed as progress.",
      "So every project is written down as a change before it is built: what the business does today, what it should do instead, and how that gets measured. If a build cannot be described that way, it is the wrong build.",
    ],
  },
  {
    title: "Nothing is reused from the last client.",
    body: [
      "Two businesses that look identical from the outside almost never leak in the same place. One is losing people at the first reply, another has plenty of enquiries and no way to keep track of them, a third is fine until the person holding it together takes a week off.",
      "A template answers all three the same way. The work here starts from a conversation instead, and what gets built follows from what that conversation finds.",
    ],
  },
  {
    title: "You see it before you owe anything.",
    body: [
      "Proposals are easy to agree with and hard to judge. A working version is neither — it either does the thing or it does not, and you can tell in a minute without knowing anything about how it was made.",
      "That is why a preview comes before a signature. It removes the part of the decision that runs on trust alone.",
    ],
  },
  {
    title: "The tools stay out of the conversation.",
    body: [
      "Which stack, which service, which model — those are implementation details, and treating them as selling points asks you to evaluate something you have no reason to have an opinion about.",
      "What matters is the reply that goes out at 11pm, the paperwork that files itself, the enquiry that becomes a booked call. The machinery behind that is the studio's problem to get right.",
    ],
  },
  {
    title: "It has to keep working without attention.",
    body: [
      "Anything that needs babysitting gets abandoned in the first busy week, and a system abandoned in month two was never worth building.",
      "So the standard is durability: fast, accessible, understandable by whoever comes next, and owned outright by the business it serves. Nothing is held hostage — the code, the content and the accounts are yours.",
    ],
  },
];

export default function AboutPage() {
  return (
    <main className="mx-auto min-h-screen max-w-3xl px-6 py-16">
      <PageHeader />

      <h1 className="max-w-2xl font-display text-3xl font-bold leading-tight sm:text-4xl">
        What SetFrame is.
      </h1>
      <div className="mt-6 max-w-2xl space-y-4 text-lg leading-relaxed text-foreground/80">
        <p>
          <LogoMark className="text-foreground" /> is a studio that builds
          websites and the systems behind them for businesses that run on
          inquiries, appointments and follow-up.
        </p>
        <p>
          The focus is narrow on purpose: turn the trust a business already
          earns into booked calls, and stop the leads, replies and paperwork
          that quietly slip through the cracks in between.
        </p>
      </div>

      <section className="mt-20">
        <Eyebrow>How the work is approached</Eyebrow>

        <div className="mt-10 space-y-14">
          {PRINCIPLES.map((principle) => (
            <article key={principle.title}>
              <h2 className="font-display text-xl font-bold leading-snug sm:text-2xl">
                {principle.title}
              </h2>
              <div className="mt-4 space-y-4 leading-relaxed text-foreground/70">
                {principle.body.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-20 rounded-2xl border border-white/10 bg-surface/40 p-8 sm:p-10">
        <Eyebrow>What working together looks like</Eyebrow>
        <div className="mt-6 space-y-4 leading-relaxed text-foreground/75">
          <p>
            You talk to the person doing the work. There is no account layer in
            between, so nothing gets lost on the way to whoever is actually
            building it, and questions get answered by someone who knows the
            answer.
          </p>
          <p>
            Scope and price are agreed before anything starts, and they do not
            move while the work is underway. Feedback runs until the thing does
            what it was supposed to do — that is part of the project, not an
            extra.
          </p>
          <p>
            After launch you are not locked in. Ongoing improvement is
            available if it is useful, and if your own team would rather take
            it over, everything is documented well enough for them to do that.
          </p>
        </div>
        <p className="mt-8 font-mono text-xs leading-relaxed text-foreground/55">
          Step by step, that runs as{" "}
          <Link href="/#how" className="text-accent hover:opacity-80">
            three stages
          </Link>
          : a conversation, a working preview, then a system that keeps
          running.
        </p>
      </section>

      <section className="py-20 text-center">
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
        <p className="mt-8 font-mono text-xs text-foreground/50">
          <Link
            href="/services"
            className="transition-colors hover:text-accent"
          >
            Or see everything that gets built →
          </Link>
        </p>
      </section>
    </main>
  );
}
