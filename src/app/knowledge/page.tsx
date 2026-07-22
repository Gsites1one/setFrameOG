import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CtaButton } from "@/components/CtaButton";
import { CAPABILITIES } from "@/lib/projects";

export const metadata: Metadata = {
  title: "How the systems work — SetFrame",
  description:
    "Plain-language guide to the systems SetFrame builds: what each one is, the leak it fixes, and what you see as a result. Includes a simple explainer of what SaaS means.",
  openGraph: {
    title: "How the systems work — SetFrame",
    description:
      "Plain-language guide to the systems SetFrame builds: what each one is, the leak it fixes, and what you see as a result.",
    url: "/knowledge",
    siteName: "SetFrame",
    type: "article",
  },
};

// The 3-step process, mirrored from the homepage HowWeWork copy.
const STEPS = [
  {
    number: "01",
    title: "A conversation to find the leak",
    body: "We start by finding where your business loses time, leads or follow-up, and what stopping that is worth. No pitch.",
  },
  {
    number: "02",
    title: "A working preview before you commit",
    body: "You see the direction with your own eyes before anything is signed, so there is nothing to take on faith.",
  },
  {
    number: "03",
    title: "A system that keeps running",
    body: "A working version is live in 7 days and the full build in 30. Then the system keeps working: replying, reminding and sorting while you run the business.",
  },
];

// Every capability now carries a knowledge object, so this is the full list.
const TILE_SECTIONS = CAPABILITIES;

export default function KnowledgePage() {
  return (
    <main className="mx-auto min-h-screen max-w-3xl px-6 py-16">
      {/*
        [[REVIEW]] All copy on this page is a concise draft for owner sign-off.
        No metrics, guarantees or testimonials have been invented.
      */}
      <div className="mb-12 flex items-center justify-between">
        <Link href="/" aria-label="Back to the SetFrame homepage">
          <Image
            src="/brand/wordmark-white.png"
            alt="SetFrame"
            width={150}
            height={100}
            priority
            className="h-auto w-36 transition-opacity hover:opacity-80"
          />
        </Link>
        <Link
          href="/"
          className="font-mono text-xs text-foreground/60 transition-colors hover:text-accent"
        >
          ← Back
        </Link>
      </div>

      <h1 className="max-w-2xl font-display text-3xl font-bold leading-tight sm:text-4xl">
        How the systems work, in plain terms.
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-foreground/70">
        No jargon. Here is what each system does, the quiet leak it fixes, and
        what changes for you once it is running.
      </p>

      {/* What is SaaS? — the concept tile links here. */}
      <section id="saas" className="mt-16 scroll-mt-24">
        <div className="h-px w-16 bg-accent" />
        <h2 className="mt-6 font-display text-2xl font-bold">What is SaaS?</h2>
        <div className="mt-4 space-y-4 text-foreground/80">
          <p>
            SaaS is short for software as a service. Instead of buying and
            installing a program, you subscribe to one that runs online and does
            a specific job for you: answering messages, booking appointments,
            sorting paperwork.
          </p>
          <p>
            It is always on, always up to date, and there is nothing for you to
            maintain. You pay a predictable monthly fee and the software keeps
            working in the background, whether you are at your desk or not.
          </p>
        </div>
      </section>

      {/* One section per system tile. */}
      <div className="mt-8">
        {TILE_SECTIONS.map((tile) => (
          <section
            key={tile.slug}
            id={tile.slug}
            className="scroll-mt-24 border-t border-white/10 py-12"
          >
            <div className="grid gap-8 md:grid-cols-[200px_1fr] md:gap-10">
              <div className="relative aspect-square overflow-hidden rounded-xl border border-white/10 bg-surface">
                <Image
                  src={tile.image}
                  alt={tile.alt}
                  fill
                  sizes="200px"
                  loading="lazy"
                  className="object-contain p-3"
                />
              </div>
              <div>
                <h2 className="font-display text-2xl font-bold">{tile.name}</h2>
                <dl className="mt-5 space-y-4">
                  <div>
                    <dt className="font-mono text-xs uppercase tracking-widest text-accent">
                      What it is
                    </dt>
                    <dd className="mt-1.5 leading-relaxed text-foreground/80">
                      {tile.knowledge.whatItIs}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-mono text-xs uppercase tracking-widest text-accent">
                      The leak it fixes
                    </dt>
                    <dd className="mt-1.5 leading-relaxed text-foreground/80">
                      {tile.knowledge.theLeak}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-mono text-xs uppercase tracking-widest text-accent">
                      What you see
                    </dt>
                    <dd className="mt-1.5 leading-relaxed text-foreground/80">
                      {tile.knowledge.whatClientSees}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* How it works in 3 steps. */}
      <section id="how-it-works" className="scroll-mt-24 border-t border-white/10 py-12">
        <div className="h-px w-16 bg-accent" />
        <h2 className="mt-6 font-display text-2xl font-bold">
          How it works, in three steps.
        </h2>
        <ol className="mt-8 space-y-8">
          {STEPS.map((step) => (
            <li key={step.number} className="flex gap-5">
              <span className="shrink-0 font-mono text-2xl font-medium text-foreground/25">
                {step.number}
              </span>
              <div>
                <h3 className="font-display text-lg font-semibold">
                  {step.title}
                </h3>
                <p className="mt-2 leading-relaxed text-foreground/70">
                  {step.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Closing CTA. */}
      <div className="mt-16 border-t border-white/10 pt-16 text-center">
        <h2 className="mx-auto max-w-xl font-display text-2xl font-bold leading-tight sm:text-3xl">
          Not sure which one your business needs?
        </h2>
        <p className="mx-auto mt-3 max-w-md text-foreground/70">
          That is what the first conversation is for. We find the leak together.
        </p>
        <div className="mt-8">
          <CtaButton size="lg" />
        </div>
      </div>
    </main>
  );
}
