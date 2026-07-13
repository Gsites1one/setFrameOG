import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact — SetFrame",
  description:
    "Start a conversation with SetFrame. Tell us what you want to build or improve and hear back within one business day.",
};

const REASONS = [
  {
    number: "[ 01 ]",
    title: "One person, full accountability",
    body: "You talk directly to the person who designs and builds your project. No handoffs, no account managers, no lost context.",
  },
  {
    number: "[ 02 ]",
    title: "Systems, not just pages",
    body: "Websites come wired with the follow-up, booking and content flows that keep working after launch. The site is the start, not the end.",
  },
  {
    number: "[ 03 ]",
    title: "Built to last",
    body: "Fast, accessible and easy to update. You own everything that gets built, from the code to the content.",
  },
];

export default function ContactPage() {
  return (
    <main className="mx-auto min-h-screen max-w-2xl px-6 py-16">
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
          [ Back ]
        </Link>
      </div>

      <h1 className="font-display text-3xl font-bold sm:text-4xl">
        Start a conversation.
      </h1>
      <p className="mt-3 text-foreground/70">
        Tell us what you want to build or improve. You will hear back within
        one business day.
      </p>

      <section aria-label="Why SetFrame" className="mt-12 space-y-6">
        {REASONS.map((reason) => (
          <div key={reason.number} className="flex gap-4">
            <span className="shrink-0 font-mono text-sm text-accent">
              {reason.number}
            </span>
            <div>
              <h2 className="font-display text-base font-semibold">
                {reason.title}
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-foreground/70">
                {reason.body}
              </p>
            </div>
          </div>
        ))}
      </section>

      <div className="mt-12">
        <ContactForm />
      </div>
    </main>
  );
}
