"use client";

import { useMemo, useState } from "react";
import { BrowserFrame } from "@/components/BrowserFrame";
import { ScoreRing } from "./ScoreRing";
import {
  TONE_BADGE,
  TONE_TEXT,
  toneForPriority,
  toneForScore,
} from "@/lib/auditScore";
import type { AuditResult } from "@/lib/auditTypes";

// Results view, rebuilt to the dashboard structure: a wide left column holding
// the capture and the score, and a narrower right column holding the written
// report.
//
// Deliberately NOT carried over from the reference: the account sidebar, the
// upgrade card, the export/share actions and the thumbnail strip. There are no
// accounts here and none of those were in the spec, so they would be dead
// controls. Colour, type and framing all come from the existing tokens — the
// reference's purple/green and its icon set are not used anywhere.
//
// Copy note: the right panel is titled "Audit report", not "AI Audit Report".
// The word is a standing sitewide prohibition; the output has to read as expert
// judgement. One string, easy to flip if that call is overruled.

type View = "desktop" | "mobile";

/* ── icons: drawn in the site's own thin-line style, not the reference's ──── */

function IconDesktop({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="2.5" y="4" width="19" height="13" rx="2" />
      <path d="M9 20.5h6M12 17.5v3" />
    </svg>
  );
}

function IconMobile({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="7" y="2.5" width="10" height="19" rx="2.5" />
      <path d="M11 18.5h2" />
    </svg>
  );
}

/* ── shared panel shell, matching the /services card language ────────────── */

function Panel({
  title,
  action,
  children,
  className = "",
  bodyClassName = "",
  dense = false,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  /** Tighter padding for the panels competing for vertical space. A real prop
   *  rather than an override appended to bodyClassName: two padding utilities
   *  on one element resolve by stylesheet order, not by which was written
   *  last, so an "override" class is a coin flip. */
  dense?: boolean;
}) {
  return (
    <section
      className={`overflow-hidden rounded-2xl border border-white/10 bg-surface/40 ${className}`}
    >
      <div
        className={`flex items-center justify-between gap-4 border-b border-white/[0.07] ${
          dense ? "px-4 py-2.5" : "px-5 py-3.5"
        }`}
      >
        <h2 className="font-mono text-[11px] uppercase tracking-[0.1em] text-foreground/55">
          {title}
        </h2>
        {action}
      </div>
      <div className={`${dense ? "p-3.5" : "p-5"} ${bodyClassName}`}>
        {children}
      </div>
    </section>
  );
}

function ViewToggle({
  active,
  onClick,
  label,
  children,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={label}
      title={label}
      className={`inline-flex h-7 w-8 items-center justify-center rounded-md border transition-[color,background-color,border-color] duration-200 ${
        active
          ? "border-accent/50 bg-accent/15 text-accent"
          : "border-white/10 text-foreground/40 hover:border-accent/30 hover:text-accent"
      }`}
    >
      {children}
    </button>
  );
}

export function AuditReport({
  result,
  hostname,
  generatedAt,
  onReset,
  fillHeight = false,
}: {
  result: AuditResult;
  hostname: string;
  generatedAt: Date;
  onReset: () => void;
  /** Fixed-height mode: fill the space left by the collapsed header and let
   *  each column scroll inside itself instead of growing the page. */
  fillHeight?: boolean;
}) {
  const hasDesktop = Boolean(result.desktopBase64);
  const hasMobile = Boolean(result.mobileBase64);
  const [view, setView] = useState<View>(hasDesktop ? "desktop" : "mobile");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const toSrc = (raw: string) =>
    raw.startsWith("data:") ? raw : `data:image/png;base64,${raw}`;

  const active = view === "desktop" ? result.desktopBase64 : result.mobileBase64;
  const src = active ? toSrc(active) : null;

  // The captures, in strip order. Only the ones that actually came back are
  // listed, so a missing mobile capture leaves one thumbnail rather than a
  // broken tile.
  const captures = [
    result.desktopBase64
      ? { key: "desktop" as View, label: "Desktop", src: toSrc(result.desktopBase64) }
      : null,
    result.mobileBase64
      ? { key: "mobile" as View, label: "Mobile", src: toSrc(result.mobileBase64) }
      : null,
  ].filter((c): c is { key: View; label: string; src: string } => c !== null);

  const priorities = useMemo(() => {
    const seen = new Set<string>();
    for (const item of result.top_improvements) {
      const p = item.priority.trim();
      if (p) seen.add(p);
    }
    return [...seen];
  }, [result.top_improvements]);

  const visible = useMemo(
    () =>
      priorityFilter === "all"
        ? result.top_improvements
        : result.top_improvements.filter(
            (i) => i.priority.trim().toLowerCase() === priorityFilter
          ),
    [result.top_improvements, priorityFilter]
  );

  const generatedLabel = `${generatedAt.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })} · ${generatedAt.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;

  return (
    <div
      className={
        fillHeight
          ? "mt-4 lg:flex lg:min-h-0 lg:flex-1 lg:flex-col"
          : "mt-8"
      }
    >
      {/* ~60 / ~40 split, stacking below lg. */}
      <div
        className={`grid gap-6 lg:grid-cols-[3fr_2fr] ${
          // In fixed-height mode the columns stretch to the row height and
          // each one scrolls internally; otherwise they sit at their natural
          // height as before.
          fillHeight
            ? "lg:min-h-0 lg:flex-1 lg:items-stretch lg:overflow-hidden"
            : "lg:items-start"
        }`}
      >
        {/* ── LEFT ──────────────────────────────────────────────────────── */}
        <div
          className={
            fillHeight
              ? "space-y-4 lg:min-h-0 lg:overflow-y-auto lg:pr-1 [scrollbar-width:thin]"
              : "space-y-6"
          }
        >
          <Panel
            dense
            title="Website preview"
            action={
              <div className="flex gap-1.5">
                {hasDesktop && (
                  <ViewToggle
                    active={view === "desktop"}
                    onClick={() => setView("desktop")}
                    label="Show desktop screenshot"
                  >
                    <IconDesktop className="h-4 w-4" />
                  </ViewToggle>
                )}
                {hasMobile && (
                  <ViewToggle
                    active={view === "mobile"}
                    onClick={() => setView("mobile")}
                    label="Show mobile screenshot"
                  >
                    <IconMobile className="h-4 w-4" />
                  </ViewToggle>
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
                  // Plain <img>: per-request base64 data URIs, nothing for the
                  // image optimiser to fetch or resize. The fit differs by view
                  // out of necessity — a tall mobile capture in a 16:9 frame
                  // would otherwise show only a sliver.
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

            {/* Captured-screenshots strip. Clicking a thumbnail promotes it to
                the main preview — the same state the header toggles drive, so
                the two controls can never disagree. Two captures today; the
                strip lays out the same way if more are added later. */}
            {captures.length > 0 && (
              <div className="mt-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-foreground/40">
                  Screenshots captured ({captures.length})
                </p>
                <div className="mt-2.5 flex gap-2.5">
                  {captures.map((capture) => {
                    const selected = view === capture.key;
                    return (
                      <button
                        key={capture.key}
                        type="button"
                        onClick={() => setView(capture.key)}
                        aria-pressed={selected}
                        aria-label={`Show the ${capture.label.toLowerCase()} screenshot`}
                        className={`group/thumb relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border transition-[border-color,box-shadow] duration-200 ${
                          selected
                            ? "border-accent/60 shadow-[0_0_16px_-6px_rgba(199,123,63,0.7)]"
                            : "border-white/10 hover:border-accent/40"
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={capture.src}
                          alt=""
                          className="h-full w-full object-cover object-top"
                        />
                        {/* Unselected thumbnails sit back so the active one
                            reads as the current preview at a glance. */}
                        <span
                          aria-hidden="true"
                          className={`absolute inset-0 transition-colors duration-200 ${
                            selected
                              ? "bg-transparent"
                              : "bg-background/55 group-hover/thumb:bg-background/25"
                          }`}
                        />
                        <span
                          aria-hidden="true"
                          className={`absolute bottom-1 left-1 rounded px-1 py-px font-mono text-[8px] uppercase tracking-wider backdrop-blur-sm ${
                            selected
                              ? "bg-accent/20 text-accent"
                              : "bg-background/70 text-foreground/55"
                          }`}
                        >
                          {capture.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </Panel>

          <Panel dense title="Overall score">
            <div className="flex flex-col items-center gap-7 sm:flex-row sm:items-center sm:gap-8">
              <ScoreRing score={result.overall_score} rating={result.rating} />

              {/* 3-up category grid — the nine scores at a glance. */}
              {result.categories.length > 0 && (
                <div className="grid w-full flex-1 grid-cols-2 gap-2.5 sm:grid-cols-3">
                  {result.categories.map((category) => {
                    const tone = toneForScore(category.score);
                    return (
                      <div
                        key={category.name}
                        className="rounded-xl border border-white/[0.08] bg-background/40 px-3 py-2.5"
                      >
                        <p className="truncate font-mono text-[9.5px] uppercase tracking-[0.08em] text-foreground/45">
                          {category.name}
                        </p>
                        <p className="mt-1.5 flex items-baseline gap-1">
                          <span
                            className={`font-display text-lg font-bold leading-none ${TONE_TEXT[tone]}`}
                          >
                            {category.score.toFixed(1)}
                          </span>
                          <span className="font-mono text-[9px] text-foreground/30">
                            /10
                          </span>
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </Panel>
        </div>

        {/* ── RIGHT ─────────────────────────────────────────────────────── */}
        <Panel
          className={fillHeight ? "lg:flex lg:min-h-0 lg:flex-col" : undefined}
          bodyClassName={
            fillHeight ? "lg:min-h-0 lg:flex-1 lg:overflow-y-auto" : undefined
          }
          title="Audit report"
          action={
            <span className="shrink-0 font-mono text-[10px] text-foreground/40">
              Generated {generatedLabel}
            </span>
          }
        >
          {result.executive_summary && (
            <div className="rounded-xl border border-accent/20 bg-accent/[0.06] p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-accent/80">
                Summary
              </p>
              <p className="mt-2 text-sm leading-relaxed text-foreground/85">
                {result.executive_summary}
              </p>
            </div>
          )}

          {result.top_improvements.length > 0 && (
            <div className="mt-7">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-display text-sm font-semibold">
                  Top improvements
                </h3>
                {priorities.length > 1 && (
                  <select
                    aria-label="Filter improvements by priority"
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="rounded-lg border border-white/10 bg-surface px-2.5 py-1 font-mono text-[10px] text-foreground/70 outline-none transition-colors focus:border-accent/60"
                  >
                    <option value="all">All priorities</option>
                    {priorities.map((p) => (
                      <option key={p} value={p.toLowerCase()}>
                        {p}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <ol className="mt-4 space-y-2.5">
                {visible.map((item, i) => {
                  const tone = toneForPriority(item.priority);
                  return (
                    <li
                      key={`${item.title}-${i}`}
                      className="rounded-xl border border-white/[0.07] bg-background/40 p-3.5"
                    >
                      <div className="flex gap-3">
                        {/* ranked numeral, toned by priority */}
                        <span
                          aria-hidden="true"
                          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border font-mono text-[10px] ${TONE_BADGE[tone]}`}
                        >
                          {i + 1}
                        </span>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1.5">
                            <div className="flex min-w-0 flex-wrap items-center gap-2">
                              <h4 className="font-display text-[13px] font-semibold leading-snug">
                                {item.title}
                              </h4>
                              <span
                                className={`shrink-0 rounded-full border px-1.5 py-px font-mono text-[9px] uppercase tracking-wider ${TONE_BADGE[tone]}`}
                              >
                                {item.priority}
                              </span>
                            </div>

                            {/* Impact tag, right-aligned. Rendered only when
                                the workflow sends one — never inferred. */}
                            {item.impact && (
                              <span
                                className={`shrink-0 rounded-full border px-2 py-px font-mono text-[9px] uppercase tracking-wider ${TONE_BADGE[tone]}`}
                              >
                                {item.impact}
                              </span>
                            )}
                          </div>

                          {item.description && (
                            <p className="mt-1.5 text-xs leading-relaxed text-foreground/60">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ol>

              {visible.length === 0 && (
                <p className="mt-4 font-mono text-xs text-foreground/40">
                  Nothing at that priority.
                </p>
              )}
            </div>
          )}
        </Panel>
      </div>

      <div className="mt-8 flex flex-col items-start gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono text-xs leading-relaxed text-foreground/45">
          A copy of this report is on its way to your inbox.
        </p>
        <button
          type="button"
          onClick={onReset}
          className="shrink-0 rounded-full border border-white/15 px-4 py-2 font-display text-xs font-semibold text-foreground/75 transition-[color,background-color,border-color,box-shadow] duration-300 hover:border-accent/60 hover:bg-accent/10 hover:text-accent hover:shadow-[0_0_20px_-6px_rgba(199,123,63,0.6)]"
        >
          Clear results
        </button>
      </div>
    </div>
  );
}
