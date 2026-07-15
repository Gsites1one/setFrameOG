import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";
import { ContactReasons } from "@/components/ContactReasons";

export const metadata: Metadata = {
  title: "Contact — SetFrame",
  description:
    "Start a conversation with SetFrame. Tell us what you want to build or improve and hear back within one business day.",
};

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
          ← Back
        </Link>
      </div>

      <h1 className="font-display text-3xl font-bold sm:text-4xl">
        Start a conversation.
      </h1>
      <p className="mt-3 text-foreground/70">
        Tell us what you want to build or improve. You will hear back within
        one business day.
      </p>

      <ContactReasons />

      <div className="mt-12">
        <ContactForm />
      </div>
    </main>
  );
}
