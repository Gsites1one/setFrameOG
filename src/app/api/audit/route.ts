import { NextResponse } from "next/server";

// Server-side proxy to the audit workflow's webhook.
//
// The whole reason this route exists is that the webhook URL must never reach
// the browser. It is read from AUDIT_WEBHOOK_URL — a private variable with no
// NEXT_PUBLIC_ prefix, so Next.js will not inline it into the client bundle —
// and the browser only ever talks to /api/audit. Nothing in the client code,
// the JS bundle, or the network panel reveals where the request actually goes.
//
// Client-side validation is re-run here rather than trusted: the client can be
// bypassed trivially, and this route can POST anywhere the workflow accepts.

export const runtime = "nodejs";
// The workflow takes 15-40s end to end (screenshot capture, then analysis), so
// this must outlive the default serverless timeout window.
export const maxDuration = 60;

// Give the workflow room to finish but never hang the request forever. Sits
// under the client's own 60s abort so the client gets a real error shape back
// rather than timing out on its own first.
const UPSTREAM_TIMEOUT_MS = 55_000;

type ErrorBody = { error: string };

function fail(status: number, error: string) {
  return NextResponse.json<ErrorBody>({ error }, { status });
}

/** Accepts bare hosts too ("setframe.net"), normalising to a real URL. */
function normaliseUrl(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  let parsed: URL;
  try {
    parsed = new URL(withScheme);
  } catch {
    return null;
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;
  // Needs a dotted hostname; rejects "localhost", "foo", and similar.
  if (!/^[a-z0-9-]+(\.[a-z0-9-]+)+$/i.test(parsed.hostname)) return null;
  return parsed.toString();
}

function isEmail(raw: string): boolean {
  const v = raw.trim();
  return v.length <= 254 && /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(v);
}

export async function POST(request: Request) {
  const webhookUrl = process.env.AUDIT_WEBHOOK_URL;
  if (!webhookUrl) {
    // Deliberately vague to the client — a missing env var is our problem, not
    // something to describe to a visitor. The detail goes to the server log.
    console.error("[audit] AUDIT_WEBHOOK_URL is not set");
    return fail(503, "The audit service is not available right now.");
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return fail(400, "We could not read that request.");
  }

  const { websiteUrl, recipientEmail } = (body ?? {}) as {
    websiteUrl?: unknown;
    recipientEmail?: unknown;
  };

  if (typeof websiteUrl !== "string" || typeof recipientEmail !== "string") {
    return fail(400, "Please provide a website address and an email address.");
  }

  const normalisedUrl = normaliseUrl(websiteUrl);
  if (!normalisedUrl) {
    return fail(400, "That does not look like a valid website address.");
  }
  if (!isEmail(recipientEmail)) {
    return fail(400, "That does not look like a valid email address.");
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);

  try {
    const upstream = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        websiteUrl: normalisedUrl,
        recipientEmail: recipientEmail.trim(),
      }),
      signal: controller.signal,
      cache: "no-store",
    });

    if (!upstream.ok) {
      console.error("[audit] upstream responded", upstream.status);
      return fail(502, "The audit could not be completed. Please try again.");
    }

    // Proxy the payload back unchanged — the client renders whatever the
    // workflow produced. Guard only against a non-JSON body.
    const text = await upstream.text();
    try {
      return NextResponse.json(JSON.parse(text));
    } catch {
      console.error("[audit] upstream returned non-JSON");
      return fail(502, "The audit could not be completed. Please try again.");
    }
  } catch (error) {
    const aborted = error instanceof Error && error.name === "AbortError";
    console.error("[audit] request failed", aborted ? "timeout" : error);
    return fail(
      aborted ? 504 : 502,
      aborted
        ? "The audit took longer than expected. Please try again."
        : "The audit could not be completed. Please try again."
    );
  } finally {
    clearTimeout(timer);
  }
}
