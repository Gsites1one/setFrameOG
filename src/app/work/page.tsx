import type { Metadata } from "next";
import { BrowserFrame } from "@/components/BrowserFrame";
import { CtaButton } from "@/components/CtaButton";
import { Eyebrow } from "@/components/Eyebrow";
import { PageHeader } from "@/components/PageHeader";
import { WebsiteCard } from "@/components/WebsiteCard";
import {
  AutomationHubMockup,
  DashboardMockup,
  DocumentProcessingMockup,
  EcommerceMockup,
  LeadCaptureMockup,
  OutreachMockup,
  ResponseBookingMockup,
  SkillsMockup,
  SystemMapMockup,
} from "@/components/work/SystemMockups";
import { CAPABILITIES, WEBSITE_PROJECT } from "@/lib/projects";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Work — SetFrame",
  description:
    "Prototypes from SetFrame: two website directions built from one brief, plus working interface prototypes for response and booking, document processing, lead capture, outreach, e-commerce, dashboards and automation.",
  alternates: { canonical: "/work" },
  openGraph: {
    title: "Work — SetFrame",
    description:
      "Website and system prototypes built by SetFrame — shown, not described.",
    url: `${SITE_URL}/work`,
    siteName: "SetFrame",
    type: "website",
  },
};

// /work is proof only. It shows; it does not explain. What each system IS
// belongs on /services, how it works belongs on /knowledge, and neither is
// repeated here — every panel carries a badge, a name and one line of already
// approved copy, nothing more.
//
// Honesty framing (hard constraint): there is no client work yet. The website
// panels are the two prototypes that already existed, and the system panels are
// coded interface prototypes built for this page. Every one is badged
// "Prototype 0X" for exactly that reason. No screen claims a real customer, a
// real inbox or a measured result.
const SYSTEM_PANELS = [
  { slug: "response-booking", displayUrl: "app.setframe.net/inbox", Mockup: ResponseBookingMockup },
  { slug: "document-processing", displayUrl: "app.setframe.net/documents", Mockup: DocumentProcessingMockup },
  { slug: "lead-capture", displayUrl: "app.setframe.net/contacts", Mockup: LeadCaptureMockup },
  { slug: "outreach", displayUrl: "app.setframe.net/outreach", Mockup: OutreachMockup },
  { slug: "ecommerce", displayUrl: "app.setframe.net/orders", Mockup: EcommerceMockup },
  { slug: "dashboards", displayUrl: "app.setframe.net/overview", Mockup: DashboardMockup },
  { slug: "ai-skills", displayUrl: "app.setframe.net/tasks", Mockup: SkillsMockup },
  { slug: "automation-hub", displayUrl: "app.setframe.net/workflow", Mockup: AutomationHubMockup },
  { slug: "system-map", displayUrl: "app.setframe.net/map", Mockup: SystemMapMockup },
];

const CAPABILITY_BY_SLUG = new Map(CAPABILITIES.map((c) => [c.slug, c]));

export default function WorkPage() {
  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-16">
      <PageHeader />

      <h1 className="max-w-2xl font-display text-3xl font-bold leading-tight sm:text-4xl">
        Built, not described.
      </h1>
      <p className="mt-4 max-w-xl leading-relaxed text-foreground/70">
        Prototypes of the websites and the systems behind them. Every screen
        below was built to be looked at, not explained.
      </p>

      {/* ── websites ─────────────────────────────────────────────────────── */}
      <section className="mt-20">
        <Eyebrow>Websites</Eyebrow>
        <h2 className="mt-6 max-w-2xl font-display text-2xl font-bold leading-snug sm:text-3xl">
          One brief. Two different directions.
        </h2>
        <p className="mt-3 max-w-xl leading-relaxed text-foreground/70">
          The same brief taken two deliberately different ways: one goal, two
          designs that share nothing but intent.
        </p>

        <div className="mt-10 grid gap-8 md:grid-cols-2 md:items-start">
          {WEBSITE_PROJECT.prototypes.map((prototype, i) => (
            <div key={prototype.slug} className={i === 1 ? "md:mt-16" : ""}>
              <WebsiteCard prototype={prototype} />
            </div>
          ))}
        </div>
      </section>

      {/* ── systems ──────────────────────────────────────────────────────── */}
      <section className="mt-28">
        <Eyebrow>Systems</Eyebrow>
        <h2 className="mt-6 max-w-2xl font-display text-2xl font-bold leading-snug sm:text-3xl">
          The screens behind the website.
        </h2>
        <p className="mt-3 max-w-xl leading-relaxed text-foreground/70">
          Interface prototypes for the systems that run once a visitor becomes
          an enquiry. Same frame, same build quality as the sites above.
        </p>

        <div className="mt-10 grid gap-8 md:grid-cols-2">
          {SYSTEM_PANELS.map(({ slug, displayUrl, Mockup }, i) => {
            const capability = CAPABILITY_BY_SLUG.get(slug);
            if (!capability) return null;
            return (
              <div key={slug} className="group flex flex-col">
                <BrowserFrame
                  displayUrl={displayUrl}
                  label={`Prototype ${String(i + 3).padStart(2, "0")}`}
                >
                  <Mockup />
                </BrowserFrame>

                {/* Caption mirrors the website cards exactly: name on top,
                    one locked outcome line under it. No new claims. */}
                <div className="mt-4">
                  <p className="font-display text-base font-semibold">
                    {capability.name}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-foreground/60">
                    {capability.outcome}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-10 max-w-xl font-mono text-xs leading-relaxed text-foreground/45">
          These are interface prototypes, not client installations. The content
          on every screen is demonstration data.
        </p>
      </section>

      <section className="py-24 text-center">
        <h2 className="mx-auto max-w-xl font-display text-2xl font-bold leading-snug sm:text-3xl">
          Yours would be built the same way.
        </h2>
        <p className="mx-auto mt-4 max-w-md leading-relaxed text-foreground/70">
          A working version in 7 days, the full build in 30 — shaped around
          what your business actually needs.
        </p>
        <div className="mt-8">
          <CtaButton size="lg" />
        </div>
      </section>
    </main>
  );
}
