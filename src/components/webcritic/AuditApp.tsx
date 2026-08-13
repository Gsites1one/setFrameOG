"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { m, useReducedMotion } from "framer-motion";
import { CtaButton } from "@/components/CtaButton";
import { RecentAudits } from "./RecentAudits";
import { WebCriticSidebar } from "./WebCriticSidebar";
import {
  FIELD_CLASSES,
  FIELD_ERROR_CLASSES,
  FIELD_LABEL_CLASSES,
} from "@/lib/formStyles";
import { normaliseAudit, type AuditResult } from "@/lib/auditTypes";

// Split out so the report's markup is not part of the initial page payload —
// nobody sees it until an audit actually finishes.
const AuditReportLazy = dynamic(
  () => import("./AuditReport").then((mod) => mod.AuditReport),
  { ssr: false }
);

// The real workflow runs ~2 minutes, so the status line has to stay credible
// for that long. Two rules make it read as progress rather than a stuck or
// looping spinner:
//   1. The phrases advance in order and NEVER wrap back to the first — seeing
//      "Capturing screenshots…" again after 90s would read as a restart.
//   2. The final phrase is open-ended ("Almost there…") and simply holds, so a
//      long tail looks like waiting rather than like the list ran out.
// Eight steps at 11s covers ~90s before it settles on the last one.
const STATUS_STEPS = [
  "Capturing screenshots…",
  "Loading the page as a visitor…",
  "Reviewing the layout…",
  "Checking the mobile experience…",
  "Scoring categories…",
  "Ranking what to fix first…",
  "Writing your report…",
  "Almost there…",
] as const;
const STATUS_INTERVAL_MS = 11_000;

/** How often the client asks whether the job has finished. */
const POLL_INTERVAL_MS = 4000;
/** Ceiling on the whole wait. Well past the ~2 minute job, under the 10 minute
 *  server-side TTL, so a job that dies quietly still ends in a clean error. */
const POLL_CEILING_MS = 4 * 60 * 1000;
/** The start call only triggers the job; it should never hang. */
const START_TIMEOUT_MS = 30_000;

type Phase = "idle" | "loading" | "done" | "error";

function looksLikeUrl(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;
  const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const parsed = new URL(withScheme);
    return /^[a-z0-9-]+(\.[a-z0-9-]+)+$/i.test(parsed.hostname);
  } catch {
    return false;
  }
}

function looksLikeEmail(value: string): boolean {
  const v = value.trim();
  return v.length <= 254 && /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(v);
}

function hostnameOf(value: string): string {
  const trimmed = value.trim();
  const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    return new URL(withScheme).hostname.replace(/^www\./, "");
  } catch {
    return trimmed;
  }
}

/* ── loading ──────────────────────────────────────────────────────────────── */

function LoadingState() {
  const [step, setStep] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const id = window.setInterval(() => {
      // Hold on the final phrase rather than cycling back to the first, which
      // would suggest the work had restarted.
      setStep((s) => Math.min(s + 1, STATUS_STEPS.length - 1));
    }, STATUS_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="mt-16 flex flex-col items-center py-16 text-center">
      <div className="relative h-14 w-14">
        {/* faint full ring, breathing */}
        <div className="audit-ring-pulse absolute inset-0 rounded-full border-2 border-accent/20" />
        {/* copper arc, the part that rotates */}
        <div className="audit-spin absolute inset-0 rounded-full border-2 border-transparent border-t-accent" />
      </div>

      <p
        aria-live="polite"
        className="mt-8 font-mono text-sm tracking-wide text-foreground/70"
      >
        {STATUS_STEPS[step]}
      </p>
      <p className="mt-3 max-w-xs text-xs leading-relaxed text-foreground/40">
        {shouldReduceMotion
          ? "This usually takes under a minute."
          : "This usually takes under a minute. You can leave the page open."}
      </p>
    </div>
  );
}

/* ── error ────────────────────────────────────────────────────────────────── */

function ErrorState({
  message,
  onReset,
}: {
  message: string;
  onReset: () => void;
}) {
  return (
    <div className="mt-16 rounded-2xl border border-white/10 bg-surface/40 p-8 text-center sm:p-10">
      <span
        aria-hidden="true"
        className="mx-auto block h-1.5 w-1.5 rounded-full bg-[#CE6B5F]"
      />
      <h2 className="mt-6 font-display text-xl font-bold">
        That did not go through.
      </h2>
      <p className="mx-auto mt-3 max-w-sm leading-relaxed text-foreground/70">
        {message}
      </p>
      <button
        type="button"
        onClick={onReset}
        className="mt-8 rounded-full border border-accent/50 px-5 py-2.5 font-display text-sm font-semibold tracking-wide text-accent transition-[color,background-color,border-color,box-shadow] duration-300 hover:border-accent hover:bg-accent/15 hover:text-[#e0a068] hover:shadow-[0_0_26px_-4px_rgba(199,123,63,0.6)]"
      >
        Try again
      </button>
    </div>
  );
}

/* ── app ──────────────────────────────────────────────────────────────────── */

export function AuditApp() {
  const shouldReduceMotion = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("idle");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [errors, setErrors] = useState<{
    url?: string;
    email?: string;
    code?: string;
  }>({});
  // The form collapses to a one-line summary once a report is showing, and
  // re-expands on request. Kept separate from `phase` because the visitor can
  // re-open the form while still looking at the previous result.
  const [formExpanded, setFormExpanded] = useState(true);
  const [failure, setFailure] = useState("");
  const [result, setResult] = useState<AuditResult | null>(null);
  const [generatedAt, setGeneratedAt] = useState<Date | null>(null);
  const [auditedHost, setAuditedHost] = useState("");
  const abortRef = useRef<AbortController | null>(null);
  const pollRef = useRef<number | null>(null);
  const deadlineRef = useRef<number>(0);
  // Targets for the sidebar's New Audit action.
  const urlInputRef = useRef<HTMLInputElement | null>(null);
  const formBandRef = useRef<HTMLDivElement | null>(null);

  const stopPolling = () => {
    if (pollRef.current !== null) {
      window.clearInterval(pollRef.current);
      pollRef.current = null;
    }
  };

  // Both the in-flight start request and the polling loop have to be torn down
  // on unmount, or a finished poll would setState on a dead component.
  useEffect(
    () => () => {
      abortRef.current?.abort();
      stopPolling();
    },
    []
  );

  // Clears the results and returns to the empty state. The header form keeps
  // its values on purpose now that it is persistent: the address stays in the
  // field after a run (the spec asks for it pre-filled), and the email is
  // retained so a second audit is one click rather than a re-type.
  const reset = () => {
    abortRef.current?.abort();
    stopPolling();
    setPhase("idle");
    setErrors({});
    setFailure("");
    setResult(null);
    setFormExpanded(true);
  };

  const failWith = (message: string) => {
    stopPolling();
    setFailure(message);
    setPhase("error");
  };

  const finishWith = (raw: unknown) => {
    const normalised = normaliseAudit(raw);
    if (!normalised) {
      failWith("The report came back empty. Please try again.");
      return;
    }
    stopPolling();
    setResult(normalised);
    // Stamped when the report lands rather than during render, so the
    // "Generated" line is stable and never shifts on re-render.
    setGeneratedAt(new Date());
    setPhase("done");
    // Hand the screen over to the report: the form shrinks to a single row so
    // the results fit the viewport without the page scrolling.
    setFormExpanded(false);
  };

  // Polls until the job completes, fails, or the ceiling is reached. Kept on a
  // plain interval rather than a self-scheduling chain so `stopPolling` is the
  // single, unambiguous way it ends.
  const startPolling = (jobId: string) => {
    stopPolling();
    deadlineRef.current = Date.now() + POLL_CEILING_MS;

    pollRef.current = window.setInterval(async () => {
      if (Date.now() > deadlineRef.current) {
        failWith(
          "This is taking longer than expected. The report may still arrive by email — you can try again in a moment."
        );
        return;
      }

      try {
        const response = await fetch(
          `/api/audit-status?jobId=${encodeURIComponent(jobId)}`,
          { cache: "no-store" }
        );
        if (!response.ok) return; // transient; the next tick retries
        const record = (await response.json()) as {
          status?: string;
          data?: unknown;
          error?: string;
        };

        if (record.status === "complete") {
          finishWith(record.data);
        } else if (record.status === "failed") {
          failWith(record.error || "The audit could not be completed.");
        }
        // "processing" and "not_found" both just keep waiting: a job written
        // moments ago can briefly read as absent, and letting the ceiling
        // decide avoids failing on a momentary miss.
      } catch {
        // Network blip — say nothing and let the next tick try again.
      }
    }, POLL_INTERVAL_MS);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const next: { url?: string; email?: string; code?: string } = {};
    if (!looksLikeUrl(websiteUrl)) {
      next.url = "Enter a full website address, like setframe.net";
    }
    if (!looksLikeEmail(recipientEmail)) {
      next.email = "Enter an email address we can send the report to";
    }
    // Presence only. Whether the code is correct is the server's call — the
    // client never knows the value.
    if (!accessCode.trim()) {
      next.code = "An access code is required to run an audit";
    }
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setAuditedHost(hostnameOf(websiteUrl));
    setPhase("loading");
    setFailure("");
    setResult(null);

    // crypto.randomUUID needs a secure context; every deployment of this site
    // is HTTPS, but fall back rather than throw on an http:// preview.
    const jobId =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now().toString(16).padStart(12, "0").slice(-8)}-0000-4000-8000-${Math.random().toString(16).slice(2, 14).padEnd(12, "0")}`;

    const controller = new AbortController();
    abortRef.current = controller;
    const timer = window.setTimeout(() => controller.abort(), START_TIMEOUT_MS);

    try {
      const response = await fetch("/api/audit-start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ websiteUrl, recipientEmail, jobId, accessCode }),
        signal: controller.signal,
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        failWith(
          (payload as { error?: string } | null)?.error ??
            "The audit could not be started. Please try again."
        );
        return;
      }

      startPolling(jobId);
    } catch {
      failWith(
        "We could not reach the audit service. Please try again in a moment."
      );
    } finally {
      window.clearTimeout(timer);
    }
  };


  const hasRun = phase === "done" && result !== null;

  // Sidebar actions. Both are in-page moves, not navigation — there is only
  // one page here.
  const handleNewAudit = () => {
    // Clearing a showing result is the point of "New Audit": leaving the old
    // report under a focused, ready form would read as though it applied to
    // whatever gets typed next.
    if (phase === "done" || phase === "error") reset();
    setFormExpanded(true);
    formBandRef.current?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "start",
    });
    // Focus after the scroll starts, so the browser does not fight it.
    window.setTimeout(() => urlInputRef.current?.focus(), 350);
  };

  // "Compact" is the post-run state: a report is showing and the form has been
  // collapsed to a single row.
  const compact = hasRun && !formExpanded;

  const handleHistory = () => {
    // In the fixed-height state the strip is not mounted, so "Audit History"
    // has to expand the page back out before it has anything to scroll to.
    // The scroll is deferred a frame so the section exists when it runs.
    if (compact) {
      setFormExpanded(true);
      window.setTimeout(() => scrollToHistory(), 60);
      return;
    }
    scrollToHistory();
  };

  const scrollToHistory = () => {
    const target = document.getElementById("recent-audits");
    // The strip renders nothing when the list is empty, so fall back to the
    // bottom of the page rather than doing nothing at all.
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (target) {
      target.scrollIntoView({
        behavior: smooth ? "smooth" : "auto",
        block: "start",
      });
    } else {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: smooth ? "smooth" : "auto",
      });
    }
  };

  return (
    // Sidebar rail beside the content from lg up; above it on narrower
    // screens, where a fixed left column would eat most of the width.
    <div
      className={`mt-10 flex flex-col gap-6 lg:flex-row lg:gap-8 ${
        // Fixed-height mode: once the report has the screen, the results area
        // fills what is left of the viewport and each column scrolls inside
        // itself instead of the page growing. Desktop only — on a phone,
        // nested scroll panes are worse than a normal long page.
        // 17.5rem is measured, not guessed: at 15rem the page still overflowed
        // by 33px once the page padding, PageHeader and collapsed row were
        // accounted for. min-h keeps it usable on short viewports, where a
        // little page scroll is better than columns squeezed to nothing.
        compact ? "lg:h-[calc(100vh-17.5rem)] lg:min-h-[30rem] lg:overflow-hidden" : ""
      }`}
    >
      <WebCriticSidebar onNewAudit={handleNewAudit} onHistory={handleHistory} />

      <div className={`min-w-0 flex-1 ${compact ? "lg:flex lg:min-h-0 lg:flex-col" : ""}`}>
      {/* ── persistent header bar ──────────────────────────────────────────
          Title and description on the left, the whole form on the right. The
          form does NOT unmount between phases: after a run the address stays
          in the field, the email is retained, and the button becomes "Run New
          Audit", so a second audit is one click.

          The email sits inline rather than in a popover. A popover would mean
          building focus trapping and dismissal for a single text field, and it
          would hide a required input behind an extra click — inline keeps both
          requirements visible and costs one more column on wide screens. */}
      {/* Collapsed state: one row, just the audited domain and a way back to
          the form. The title and description are dropped here on purpose —
          once a report is on screen they have done their job and the space is
          worth more to the results. */}
      {compact && (
        <div
          ref={formBandRef}
          className="flex shrink-0 items-center justify-between gap-4 rounded-2xl border border-white/10 bg-surface/40 px-5 py-3 scroll-mt-24"
        >
          <div className="flex min-w-0 items-center gap-3">
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
            />
            <p className="truncate font-display text-sm font-semibold">
              {auditedHost}
            </p>
          </div>
          <button
            type="button"
            onClick={handleNewAudit}
            className="shrink-0 rounded-full border border-accent/50 px-4 py-1.5 font-display text-xs font-semibold tracking-wide text-accent transition-[color,background-color,border-color,box-shadow] duration-300 hover:border-accent hover:bg-accent/15 hover:text-[#e0a068] hover:shadow-[0_0_20px_-6px_rgba(199,123,63,0.6)]"
          >
            Run New Audit
          </button>
        </div>
      )}

      <div
        ref={compact ? undefined : formBandRef}
        hidden={compact}
        className="scroll-mt-24 rounded-2xl border border-white/10 bg-surface/40 p-5 sm:p-6"
      >
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="min-w-0">
            <h1 className="font-display text-2xl font-bold leading-tight sm:text-3xl">
              Website Critic
            </h1>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-foreground/60">
              A scored, prioritised breakdown of what is costing you
              conversions — desktop and mobile.
            </p>
          </div>

          <m.form
            onSubmit={onSubmit}
            noValidate
            className="w-full xl:w-auto xl:shrink-0"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : { duration: 0.35, ease: "easeOut" }
            }
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-start">
              <div className="sm:w-48">
                <label htmlFor="websiteUrl" className={FIELD_LABEL_CLASSES}>
                  Website address
                </label>
                <input
                  ref={urlInputRef}
                  id="websiteUrl"
                  name="websiteUrl"
                  type="text"
                  inputMode="url"
                  autoComplete="url"
                  placeholder="yourbusiness.com"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  aria-invalid={errors.url ? true : undefined}
                  aria-describedby={errors.url ? "websiteUrl-error" : undefined}
                  className={FIELD_CLASSES}
                />
              </div>

              <div className="sm:w-48">
                <label htmlFor="recipientEmail" className={FIELD_LABEL_CLASSES}>
                  Send it to
                </label>
                <input
                  id="recipientEmail"
                  name="recipientEmail"
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  aria-invalid={errors.email ? true : undefined}
                  aria-describedby={
                    errors.email ? "recipientEmail-error" : undefined
                  }
                  className={FIELD_CLASSES}
                />
              </div>

              {/* Access code. type="text", not "password": this is a shared
                  code pasted from a message, not a personal secret, and masking
                  it would only make paste errors harder to spot. */}
              <div className="sm:w-36">
                <label htmlFor="accessCode" className={FIELD_LABEL_CLASSES}>
                  Access code
                </label>
                <input
                  id="accessCode"
                  name="accessCode"
                  type="text"
                  autoComplete="off"
                  spellCheck={false}
                  placeholder="Your code"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  aria-invalid={errors.code ? true : undefined}
                  aria-describedby={errors.code ? "accessCode-error" : undefined}
                  className={FIELD_CLASSES}
                />
              </div>

              <div className="sm:self-end sm:pb-px">
                <CtaButton
                  submit
                  disabled={phase === "loading"}
                  label={
                    phase === "loading"
                      ? "Running…"
                      : hasRun
                        ? "Run New Audit"
                        : "Run Audit"
                  }
                />
              </div>
            </div>

            {/* Validation messages sit under the row so the inputs stay
                aligned whether or not either one is in error. */}
            {(errors.url || errors.email || errors.code) && (
              <div className="mt-2 space-y-1">
                {errors.code && (
                  <span id="accessCode-error" className={FIELD_ERROR_CLASSES}>
                    {errors.code}
                  </span>
                )}
                {errors.url && (
                  <span id="websiteUrl-error" className={FIELD_ERROR_CLASSES}>
                    {errors.url}
                  </span>
                )}
                {errors.email && (
                  <span id="recipientEmail-error" className={FIELD_ERROR_CLASSES}>
                    {errors.email}
                  </span>
                )}
              </div>
            )}
          </m.form>
        </div>
      </div>

      {/* ── results area ─────────────────────────────────────────────────── */}
      {phase === "loading" && <LoadingState />}

      {phase === "error" && <ErrorState message={failure} onReset={reset} />}

      {hasRun && generatedAt && (
        <AuditReportLazy
          result={result}
          hostname={auditedHost}
          generatedAt={generatedAt}
          onReset={reset}
          fillHeight={compact}
        />
      )}

      {/* ── recent audits ────────────────────────────────────────────────
          Always mounted, including before the first run — it is what makes the
          empty state read as a tool with history rather than a bare form.
          Hidden in the fixed-height state: the whole point is that nothing
          sits below the fold, and the sidebar's Audit History expands it. */}
      {!compact && <RecentAudits />}
      </div>
    </div>
  );
}
