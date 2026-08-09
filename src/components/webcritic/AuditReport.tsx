"use client";

import { BrowserFrame } from "@/components/BrowserFrame";
import { Eyebrow } from "@/components/Eyebrow";
import {
  TONE_BADGE,
  TONE_BAR,
  TONE_TEXT,
  toneForPriority,
  toneForScore,
} from "@/lib/auditScore";
import type { AuditResult } from "@/lib/auditTypes";

// The finished report. Every heading here is deliberately plain — this reads as
// an expert review of the page, so nothing is labelled by how it was produced.

function Screenshot({
  base64,
  label,
  displayUrl,
  alt,
}: {
  base64: string;
  label: string;
  displayUrl: string;
  alt: string;
}) {
  // The workflow may hand back a bare base64 string or a full data URI; accept
  // either rather than assuming.
  const src = base64.startsWith("data:")
    ? base64
    : `data:image/png;base64,${base64}`;

  return (
    <div className="group flex flex-col">
      <BrowserFrame displayUrl={displayUrl} label={label}>
        {/* A plain <img>, not next/image: these are base64 data URIs generated
            per request, so there is nothing for the image optimiser to fetch,
            cache or resize — routing them through it would only add failure
            modes. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover object-top"
        />
      </BrowserFrame>
    </div>
  );
}

export function AuditReport({
  result,
  hostname,
  onReset,
}: {
  result: AuditResult;
  hostname: string;
  onReset: () => void;
}) {
  const overallTone = toneForScore(result.overall_score);

  return (
    <div className="mt-14">
      {/* ── the two captures ─────────────────────────────────────────────── */}
      {(result.desktopBase64 || result.mobileBase64) && (
        <section>
          <Eyebrow>What we looked at</Eyebrow>
          <div className="mt-8 grid gap-8 md:grid-cols-2">
            {result.desktopBase64 && (
              <Screenshot
                base64={result.desktopBase64}
                label="Desktop"
                displayUrl={hostname}
                alt={`Desktop view of ${hostname}`}
              />
            )}
            {result.mobileBase64 && (
              <Screenshot
                base64={result.mobileBase64}
                label="Mobile"
                displayUrl={hostname}
                alt={`Mobile view of ${hostname}`}
              />
            )}
          </div>
        </section>
      )}

      {/* ── score + summary ──────────────────────────────────────────────── */}
      <section className="mt-16 grid gap-8 md:grid-cols-[auto_1fr] md:gap-12">
        <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-surface/40 px-10 py-8">
          <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-foreground/45">
            Overall
          </span>
          <span
            className={`mt-2 font-display text-6xl font-bold leading-none ${TONE_TEXT[overallTone]}`}
          >
            {result.overall_score.toFixed(1)}
          </span>
          <span className="mt-2 font-mono text-[11px] text-foreground/40">
            out of 10
          </span>
        </div>

        <div>
          <Eyebrow>What we found</Eyebrow>
          <p className="mt-6 text-lg leading-relaxed text-foreground/80">
            {result.executive_summary}
          </p>
        </div>
      </section>

      {/* ── category scores ──────────────────────────────────────────────── */}
      {result.categories.length > 0 && (
        <section className="mt-16">
          <Eyebrow>Scored by category</Eyebrow>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {result.categories.map((category) => {
              const tone = toneForScore(category.score);
              return (
                <div
                  key={category.name}
                  className="rounded-2xl border border-white/10 bg-surface/40 p-5"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="font-display text-sm font-semibold leading-snug">
                      {category.name}
                    </p>
                    <span
                      className={`shrink-0 font-display text-xl font-bold leading-none ${TONE_TEXT[tone]}`}
                    >
                      {category.score.toFixed(1)}
                    </span>
                  </div>
                  {/* The bar restates the number visually, so the score never
                      depends on telling two warm tones apart. */}
                  <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-white/[0.06]">
                    <div
                      className={`h-full rounded-full ${TONE_BAR[tone]}`}
                      style={{
                        width: `${Math.max(0, Math.min(100, category.score * 10))}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── prioritised fixes ────────────────────────────────────────────── */}
      {result.top_improvements.length > 0 && (
        <section className="mt-16">
          <Eyebrow>Fix these first</Eyebrow>
          <ol className="mt-8 space-y-4">
            {result.top_improvements.map((item, i) => {
              const tone = toneForPriority(item.priority);
              return (
                <li
                  key={`${item.title}-${i}`}
                  className="rounded-2xl border border-white/10 bg-surface/40 p-5 sm:p-6"
                >
                  <div className="flex gap-4">
                    <span
                      aria-hidden="true"
                      className="shrink-0 font-mono text-2xl font-normal leading-none text-foreground/[0.18]"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="font-display text-base font-semibold leading-snug">
                          {item.title}
                        </h3>
                        <span
                          className={`rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest ${TONE_BADGE[tone]}`}
                        >
                          {item.priority}
                        </span>
                      </div>
                      <p className="mt-2 leading-relaxed text-foreground/70">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>
      )}

      <div className="mt-14 flex flex-col items-start gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono text-xs leading-relaxed text-foreground/45">
          A copy of this report is on its way to your inbox.
        </p>
        <button
          type="button"
          onClick={onReset}
          className="shrink-0 rounded-full border border-white/15 px-4 py-2 font-display text-xs font-semibold text-foreground/75 transition-[color,background-color,border-color,box-shadow] duration-300 hover:border-accent/60 hover:bg-accent/10 hover:text-accent hover:shadow-[0_0_20px_-6px_rgba(199,123,63,0.6)]"
        >
          Run another audit
        </button>
      </div>
    </div>
  );
}
