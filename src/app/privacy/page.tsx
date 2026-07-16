import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CONTACT_EMAIL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy policy — SetFrame",
  description:
    "How SetFrame collects, uses and protects the information you share through this site.",
};

const LAST_UPDATED = "16 July 2026";

export default function PrivacyPage() {
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
          ← Back
        </Link>
      </div>

      <h1 className="font-display text-3xl font-bold sm:text-4xl">
        Privacy policy.
      </h1>
      <p className="mt-3 text-sm text-foreground/50">
        Last updated {LAST_UPDATED}.
      </p>
      <p className="mt-6 text-foreground/70">
        This page explains what happens to your information when you use
        this site, in plain language. If anything here is unclear, email{" "}
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="text-accent transition-opacity hover:opacity-80"
        >
          {CONTACT_EMAIL}
        </a>{" "}
        and ask.
      </p>

      <div className="mt-12 space-y-10">
        <section>
          <h2 className="font-display text-lg font-semibold">Who this is</h2>
          <p className="mt-2 text-sm leading-relaxed text-foreground/70">
            This site is operated by SetFrame. For anything relating to your
            personal data, SetFrame is the controller, meaning it decides why
            and how your information is used.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold">
            What is collected
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-foreground/70">
            The only personal data this site collects is what you choose to
            submit through the contact form: your name, email address,
            preferred contact method and message. Nothing is collected
            automatically. This site runs no analytics, no advertising
            pixels and no tracking cookies.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold">
            Why it is collected
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-foreground/70">
            Solely to read your message and reply to it. That is a
            legitimate interest in responding to enquiries sent directly to
            us, and nothing more. Your details are never used for marketing,
            profiling or any purpose beyond that conversation.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold">
            Who sees it
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-foreground/70">
            The contact form is handled by Formspree, a third-party form
            processor that delivers submissions to us. Formspree stores
            submissions on our behalf and processes them under its own
            security and privacy terms. Your details are not sold, rented or
            shared with anyone for advertising or marketing purposes.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold">
            How long it is kept
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-foreground/70">
            Messages are kept only for as long as needed to respond and, if a
            project follows, for the ordinary course of that work. You can
            ask for your message to be deleted at any time.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold">Your rights</h2>
          <p className="mt-2 text-sm leading-relaxed text-foreground/70">
            You can ask to see what information is held about you, have it
            corrected, have it deleted, or object to how it is used. Email{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-accent transition-opacity hover:opacity-80"
            >
              {CONTACT_EMAIL}
            </a>{" "}
            and this will be handled directly. If you are not satisfied with
            the response, you have the right to lodge a complaint with the
            data protection authority in your country.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold">
            Changes to this policy
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-foreground/70">
            If what this site collects or how it is used ever changes, for
            example if analytics are added later, this page will be updated
            first and the date above will change.
          </p>
        </section>
      </div>
    </main>
  );
}
