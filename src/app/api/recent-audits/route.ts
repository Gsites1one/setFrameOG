import { NextResponse } from "next/server";

// Server-side proxy for the recent-audits list, same privacy rule as
// /api/audit: the upstream URL is read from a private env var and never
// reaches the browser.
//
// Failure policy differs from /api/audit on purpose. This is a secondary,
// decorative list — if it cannot be fetched, the page should simply not show
// the section, not surface an error over a form that still works perfectly.
// So every failure path returns an empty array with 200, and the reason is
// logged server-side where it is actually actionable.

export const runtime = "nodejs";

const TIMEOUT_MS = 8000;

function empty() {
  return NextResponse.json({ audits: [] });
}

export async function GET() {
  const url = process.env.RECENT_AUDITS_WEBHOOK_URL;
  if (!url) {
    console.error("[recent-audits] RECENT_AUDITS_WEBHOOK_URL is not set");
    return empty();
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const upstream = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" },
      signal: controller.signal,
      cache: "no-store",
    });

    if (!upstream.ok) {
      console.error("[recent-audits] upstream responded", upstream.status);
      return empty();
    }

    const text = await upstream.text();
    try {
      // Proxied unchanged; the client normalises the shape.
      return NextResponse.json(JSON.parse(text));
    } catch {
      console.error("[recent-audits] upstream returned non-JSON");
      return empty();
    }
  } catch (error) {
    const aborted = error instanceof Error && error.name === "AbortError";
    console.error("[recent-audits] request failed", aborted ? "timeout" : error);
    return empty();
  } finally {
    clearTimeout(timer);
  }
}
