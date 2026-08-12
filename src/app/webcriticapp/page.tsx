import type { Metadata } from "next";
import { AuditApp } from "@/components/webcritic/AuditApp";
import { PageHeader } from "@/components/PageHeader";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Website Critic — SetFrame",
  description:
    "Get a scored, prioritised breakdown of what is costing your website conversions — desktop and mobile, in under a minute, sent to your inbox.",
  alternates: { canonical: "/webcriticapp" },
  openGraph: {
    title: "Website Critic — SetFrame",
    description:
      "A scored, prioritised breakdown of what is costing your website conversions.",
    url: `${SITE_URL}/webcriticapp`,
    siteName: "SetFrame",
    type: "website",
  },
};

// Front end for the audit workflow. The header follows the same shape as
// /services and /about: eyebrow, Syne title, one supporting sentence.
//
// Copy note: nothing on this page describes HOW the review is produced. The
// visitor is buying the judgement, not the machinery, which is the same
// position the rest of the site takes — the tools stay invisible.
export default function WebCriticPage() {
  return (
    // Wider than the other standalone pages: the report is a two-column
    // layout, and at max-w-4xl the preview and the report would each be too
    // narrow to read as panels in an app.
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-16">
      <PageHeader />

      {/* The h1 and description now live inside AuditApp's persistent header
          bar, alongside the form, so the title and the control that acts on it
          stay together in one band. */}
      <AuditApp />
    </main>
  );
}
