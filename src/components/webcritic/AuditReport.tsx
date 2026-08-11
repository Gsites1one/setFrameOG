"use client";

import { useState } from "react";
import { BrowserFrame } from "@/components/BrowserFrame";
import { ScoreRing } from "./ScoreRing";
import {
  TONE_BADGE,
  TONE_BAR,
  TONE_TEXT,
  toneForPriority,
  toneForScore,
} from "@/lib/auditScore";
import type { AuditResult } from "@/lib/auditTypes";

// Two-column report (redesign pass). Left: the captured page in a preview panel
// with a Desktop/Mobile toggle. Right: the written report — summary, score
// ring, category grid, prioritised fixes.
//
// Copy note: this panel is titled "Audit Report", not "AI Audit Report". The
// standing constraint on this site is that the word never appears in visible
// copy — the output has to read as expert judgement, not as machine output —
// and that rule does not stop applying because the panel is new.

type View = "desktop" | "mobile";

function Panel({
  title,
  action,
  children,
  className = "",
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  // Same panel language as the /services cards: rounded-2xl, hairline border,
  // surface tint.
  return (
    <section
      className={`rounded-2xl border border-white/10 bg-surface/40 p-5 sm:p-6 ${className}`}
    >
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="font-mono text-[11px] uppercase tracking-[0.1em] text-foreground/50">
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function ToggleButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  // Scaled-down version of the site's secondary pill (border, pill shape,
  // copper on hover) with an active state that fills rather than glows, so the
  // selected view is unmistakable without competing with the primary CTA.
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-3 py-1 font-display text-[11px] font-semibold transition-[color,background-color,border-color] duration-200 ${
        active
          ? "border-accent/60 bg-accent/15 text-accent"
          : "border-white/15 text-foreground/50 hover:border-accent/40 hover:text-accent"
      }`}
    >
      {children}
    </button>
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
  const hasDesktop = Boolean(result.desktopBase64);
  const hasMobile = Boolean(result.mobileBase64);
  const [view, setView] = useState<View>(hasDesktop ? "desktop" : "mobile");

  const active = view === "desktop" ? result.desktopBase64 : result.mobileBase64;
  const src = active
    ? active.startsWith("data:")
      ? active
      : `data:image/png;base64,${active}`
    : null;

  return (
    <div className="mt-12">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start">
        {/* ── left: preview ─────────────────────────────────────────────── */}
        <Panel
          title="Website preview"
          className="lg:sticky lg:top-24"
          action={
            <div className="flex gap-2">
              {hasDesktop && (
                <ToggleButton
                  active={view === "desktop"}
                  onClick={() => setView("desktop")}
                >
                  Desktop
                </ToggleButton>
              )}
              {hasMobile && (
                <ToggleButton
                  active={view === "mobile"}
                  onClick={() => setView("mobile")}
                >
                  Mobile
                </ToggleButton>
              )}
            </div>
          }
        >
          <div className="group">
            <BrowserFrame
              displayUrl={hostname}
              label={view === "desktop" ? "Desktop" : "Mobile"}
            >
              {src && (
                // A plain <img>: these are per-request base64 data URIs, so
                // there is nothing for next/image to fetch or optimise.
                //
                // The fit differs by view out of necessity, not inconsistency.
                // The frame is 16:9; a desktop capture fills it from the top,
                // but a tall mobile capture would show only a sliver, so it is
                // contained and centred instead. Same frame either way.
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  key={view}
                  src={src}
                  alt={`${view === "desktop" ? "Desktop" : "Mobile"} view of ${hostname}`}
                  className={`h-full w-full ${
                    view === "desktop"
                      ? "object-cover object-top"
                      : "object-contain"
                  }`}
                />
              )}
            </BrowserFrame>
          </div>
        </Panel>

        {/* ── right: report ─────────────────────────────────────────────── */}
        <div className="space-y-6">
          <Panel title="Audit report">
            {/* summary, highlighted */}
            {result.executive_summary && (
              <div className="rounded-xl border border-accent/20 bg-accent/[0.06] p-4">
                <p className="leading-relaxed text-foreground/85">
                  {result.executive_summary}
                </p>
              </div>
            )}

            {/* score ring */}
            <div className="mt-7 flex justify-center">
              <ScoreRing score={result.overall_score} />
            </div>

            {/* categories */}
            {result.categories.length > 0 && (
              <div className="mt-8">
                <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-foreground/40">
                  By category
                </p>
                <div className="mt-4 grid gap-x-5 gap-y-3.5 sm:grid-cols-2">
                  {result.categories.map((category) => {
                    const tone = toneForScore(category.score);
                    return (
                      <div key={category.name}>
                        <div className="flex items-baseline justify-between gap-2">
                          <span className="truncate text-xs text-foreground/70">
                            {category.name}
                          </span>
                          <span
                            className={`shrink-0 font-display text-xs font-bold ${TONE_TEXT[tone]}`}
                          >
                            {category.score.toFixed(1)}
                          </span>
                        </div>
                        <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-white/[0.06]">
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
              </div>
            )}
          </Panel>

          {result.top_improvements.length > 0 && (
            <Panel title="Fix these first">
              <ol className="space-y-4">
                {result.top_improvements.map((item, i) => {
                  const tone = toneForPriority(item.priority);
                  return (
                    <li key={`${item.title}-${i}`} className="flex gap-3.5">
                      <span
                        aria-hidden="true"
                        className="shrink-0 font-mono text-lg font-normal leading-tight text-foreground/[0.22]"
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <h3 className="font-display text-sm font-semibold leading-snug">
                            {item.title}
                          </h3>
                          <span
                            className={`rounded-full border px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest ${TONE_BADGE[tone]}`}
                          >
                            {item.priority}
                          </span>
                        </div>
                        {item.description && (
                          <p className="mt-1.5 text-sm leading-relaxed text-foreground/65">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ol>
            </Panel>
          )}
        </div>
      </div>

      <div className="mt-10 flex flex-col items-start gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
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
