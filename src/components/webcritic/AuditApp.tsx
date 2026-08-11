"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { m, useReducedMotion } from "framer-motion";
import { CtaButton } from "@/components/CtaButton";
import { RecentAudits } from "./RecentAudits";
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

// The workflow runs 15-40s end to end. The status line has to stay alive across
// that whole window rather than running out of things to say at 12s, so the
// last phrase holds instead of the list looping back to "Capturing
// screenshots…" while the report is nearly finished.
const STATUS_STEPS = [
  "Capturing screenshots…",
  "Reviewing the page…",
  "Scoring categories…",
  "Building your report…",
] as const;
const STATUS_INTERVAL_MS = 6000;

// Sits above the API route's own 55s upstream timeout, so a slow workflow
// surfaces the route's clean message rather than this generic one.
const CLIENT_TIMEOUT_MS = 60_000;

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
  const [errors, setErrors] = useState<{ url?: string; email?: string }>({});
  const [failure, setFailure] = useState("");
  const [result, setResult] = useState<AuditResult | null>(null);
  const [auditedHost, setAuditedHost] = useState("");
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => () => abortRef.current?.abort(), []);

  // Returns the page to its initial state, not just the previous phase: the
  // fields are cleared too. That is the right behaviour after a finished
  // report ("Run another audit" means a different site), and it is what the
  // spec asks for after a failure. The cost is that retrying the same address
  // after a transient failure means retyping it — flip the two setters below
  // if that trade should go the other way.
  const reset = () => {
    abortRef.current?.abort();
    setPhase("idle");
    setErrors({});
    setFailure("");
    setResult(null);
    setWebsiteUrl("");
    setRecipientEmail("");
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const next: { url?: string; email?: string } = {};
    if (!looksLikeUrl(websiteUrl)) {
      next.url = "Enter a full website address, like setframe.net";
    }
    if (!looksLikeEmail(recipientEmail)) {
      next.email = "Enter an email address we can send the report to";
    }
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setAuditedHost(hostnameOf(websiteUrl));
    setPhase("loading");
    setFailure("");

    const controller = new AbortController();
    abortRef.current = controller;
    const timer = window.setTimeout(() => controller.abort(), CLIENT_TIMEOUT_MS);

    try {
      const response = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ websiteUrl, recipientEmail }),
        signal: controller.signal,
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        setFailure(
          (payload as { error?: string } | null)?.error ??
            "The audit could not be completed. Please try again."
        );
        setPhase("error");
        return;
      }

      const normalised = normaliseAudit(payload);
      if (!normalised) {
        setFailure("The report came back empty. Please try again.");
        setPhase("error");
        return;
      }

      setResult(normalised);
      setPhase("done");
    } catch {
      // Covers both the abort and any network failure. Deliberately one calm
      // message either way — the distinction is not useful to the visitor.
      setFailure(
        "We could not reach the audit service, or it took too long. Please try again."
      );
      setPhase("error");
    } finally {
      window.clearTimeout(timer);
    }
  };

  return (
    <>
      {phase === "idle" && (
        <m.form
          onSubmit={onSubmit}
          noValidate
          // Compact: the two fields sit side by side from sm up so the whole
          // "before" state is one shallow band rather than a tall stack, which
          // leaves room for the recent-audits strip underneath.
          className="mt-10 rounded-2xl border border-white/10 bg-surface/40 p-5 sm:p-6"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={
            shouldReduceMotion ? { duration: 0 } : { duration: 0.35, ease: "easeOut" }
          }
        >
          <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="websiteUrl" className={FIELD_LABEL_CLASSES}>
              Website address
            </label>
            <input
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
            {errors.url && (
              <span id="websiteUrl-error" className={FIELD_ERROR_CLASSES}>
                {errors.url}
              </span>
            )}
          </div>

          <div>
            <label htmlFor="recipientEmail" className={FIELD_LABEL_CLASSES}>
              Where to send it
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
              aria-describedby={errors.email ? "recipientEmail-error" : undefined}
              className={FIELD_CLASSES}
            />
            {errors.email && (
              <span id="recipientEmail-error" className={FIELD_ERROR_CLASSES}>
                {errors.email}
              </span>
            )}
          </div>
          </div>

          <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CtaButton submit label="Run Audit" />
            <p className="max-w-xs text-xs leading-relaxed text-foreground/40">
              Your email is used to send the report and nothing else.
            </p>
          </div>
        </m.form>
      )}

      {phase === "idle" && (
        // Not gated behind running an audit — this is the first thing a
        // returning visitor sees, and it makes the page read as a tool with
        // history rather than an empty form.
        <RecentAudits />
      )}

      {phase === "loading" && <LoadingState />}

      {phase === "error" && <ErrorState message={failure} onReset={reset} />}

      {phase === "done" && result && (
        <AuditReportLazy
          result={result}
          hostname={auditedHost}
          onReset={reset}
        />
      )}
    </>
  );
}
