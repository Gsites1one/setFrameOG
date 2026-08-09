// Shape of a finished audit, plus a normaliser.
//
// The workflow's payload is normalised rather than consumed raw. Two reasons:
// a webhook is an external contract that can drift, and a report that renders
// "NaN" or crashes the page because one field arrived as a string is a worse
// failure than a report missing one section. Everything is coerced to the type
// the UI needs, and anything unusable is dropped instead of rendered broken.

export type AuditCategory = { name: string; score: number };
export type AuditImprovement = {
  priority: string;
  title: string;
  description: string;
};

export type AuditResult = {
  desktopBase64: string | null;
  mobileBase64: string | null;
  executive_summary: string;
  overall_score: number;
  categories: AuditCategory[];
  top_improvements: AuditImprovement[];
};

function asNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number.parseFloat(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function asBase64(value: unknown): string | null {
  const s = asString(value);
  return s.length > 0 ? s : null;
}

const clamp10 = (n: number) => Math.max(0, Math.min(10, n));

/**
 * Returns null when the payload has nothing worth rendering, so the caller can
 * fall back to the error state rather than showing an empty report.
 */
export function normaliseAudit(raw: unknown): AuditResult | null {
  if (!raw || typeof raw !== "object") return null;

  // n8n commonly wraps a single item in an array, or under `data`/`json`.
  let node = raw as Record<string, unknown>;
  if (Array.isArray(raw)) {
    if (raw.length === 0) return null;
    node = raw[0] as Record<string, unknown>;
  }
  for (const key of ["data", "json", "body", "result"]) {
    const inner = node?.[key];
    if (inner && typeof inner === "object" && !Array.isArray(inner)) {
      const candidate = inner as Record<string, unknown>;
      // Only unwrap if the inner object actually looks like the report.
      if (
        "executive_summary" in candidate ||
        "overall_score" in candidate ||
        "categories" in candidate
      ) {
        node = candidate;
      }
    }
  }

  const overall =
    asNumber(node.overall_score) ??
    asNumber(node.overallScore) ??
    asNumber(node.score);

  const summary =
    asString(node.executive_summary) ||
    asString(node.executiveSummary) ||
    asString(node.summary);

  const categoriesRaw = Array.isArray(node.categories) ? node.categories : [];
  const categories: AuditCategory[] = categoriesRaw
    .map((c) => {
      const item = (c ?? {}) as Record<string, unknown>;
      const name = asString(item.name) || asString(item.category);
      const score = asNumber(item.score);
      return name && score !== null ? { name, score: clamp10(score) } : null;
    })
    .filter((c): c is AuditCategory => c !== null);

  const improvementsRaw = Array.isArray(node.top_improvements)
    ? node.top_improvements
    : Array.isArray(node.topImprovements)
      ? node.topImprovements
      : [];
  const improvements: AuditImprovement[] = improvementsRaw
    .map((c) => {
      const item = (c ?? {}) as Record<string, unknown>;
      const title = asString(item.title);
      if (!title) return null;
      return {
        priority: asString(item.priority) || "Medium",
        title,
        description: asString(item.description),
      };
    })
    .filter((c): c is AuditImprovement => c !== null);

  const desktop = asBase64(node.desktopBase64) ?? asBase64(node.desktop);
  const mobile = asBase64(node.mobileBase64) ?? asBase64(node.mobile);

  // A report with no score AND no summary AND no sections is not a report.
  if (
    overall === null &&
    !summary &&
    categories.length === 0 &&
    improvements.length === 0
  ) {
    return null;
  }

  return {
    desktopBase64: desktop,
    mobileBase64: mobile,
    executive_summary: summary,
    overall_score: clamp10(overall ?? 0),
    categories,
    top_improvements: improvements,
  };
}
