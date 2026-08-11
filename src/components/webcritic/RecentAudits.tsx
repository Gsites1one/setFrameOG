"use client";

import { useEffect, useState } from "react";
import { TONE_TEXT, toneForScore } from "@/lib/auditScore";

// Recent audits strip. Fetched on page load, independent of running an audit.
//
// Deliberately shows domain / score / date only. The upstream list is not
// user-scoped — there are no accounts — so anything more identifying than a
// public domain has no business being rendered here, and the API never returns
// an email in the first place.
//
// Like the route behind it, this fails quiet: if the list is empty or the
// request fails, the section renders nothing rather than showing an error over
// a form that works.

type RecentAudit = { domain: string; score: number | null; date: string | null };

function domainOf(raw: unknown): string {
  const s = typeof raw === "string" ? raw.trim() : "";
  if (!s) return "";
  const withScheme = /^https?:\/\//i.test(s) ? s : `https://${s}`;
  try {
    return new URL(withScheme).hostname.replace(/^www\./, "");
  } catch {
    return s;
  }
}

function asNumber(v: unknown): number | null {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string") {
    const n = Number.parseFloat(v);
    if (Number.isFinite(n)) return n;
  }
  return null;
}

function formatDate(raw: unknown): string | null {
  if (typeof raw !== "string" && typeof raw !== "number") return null;
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** The upstream shape is an external contract, so accept the likely variants. */
function normalise(raw: unknown): RecentAudit[] {
  let rows: unknown[] = [];
  if (Array.isArray(raw)) rows = raw;
  else if (raw && typeof raw === "object") {
    const obj = raw as Record<string, unknown>;
    for (const key of ["audits", "data", "items", "results"]) {
      if (Array.isArray(obj[key])) {
        rows = obj[key] as unknown[];
        break;
      }
    }
  }

  return rows
    .map((row) => {
      const r = (row ?? {}) as Record<string, unknown>;
      const domain = domainOf(
        r.domain ?? r.websiteUrl ?? r.website ?? r.url ?? r.site
      );
      if (!domain) return null;
      const score =
        asNumber(r.score) ?? asNumber(r.overall_score) ?? asNumber(r.overallScore);
      const date = formatDate(
        r.date ?? r.createdAt ?? r.created_at ?? r.timestamp ?? r.runAt
      );
      return { domain, score: score === null ? null : Math.max(0, Math.min(10, score)), date };
    })
    .filter((r): r is RecentAudit => r !== null)
    .slice(0, 6);
}

export function RecentAudits() {
  const [audits, setAudits] = useState<RecentAudit[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/recent-audits")
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        if (!cancelled && json) setAudits(normalise(json));
      })
      .catch(() => {
        /* fails quiet by design — see the note above */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (audits.length === 0) return null;

  return (
    <section className="mt-14">
      <h2 className="font-mono text-[11px] uppercase tracking-[0.1em] text-foreground/50">
        Recent audits
      </h2>

      <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {audits.map((audit, i) => {
          const tone = audit.score === null ? null : toneForScore(audit.score);
          return (
            <li
              key={`${audit.domain}-${i}`}
              className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-surface/40 px-4 py-3"
            >
              <div className="min-w-0">
                <p className="truncate font-display text-sm font-semibold">
                  {audit.domain}
                </p>
                {audit.date && (
                  <p className="mt-0.5 font-mono text-[10px] text-foreground/40">
                    {audit.date}
                  </p>
                )}
              </div>
              {audit.score !== null && tone && (
                <span
                  className={`shrink-0 font-display text-lg font-bold ${TONE_TEXT[tone]}`}
                >
                  {audit.score.toFixed(1)}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
