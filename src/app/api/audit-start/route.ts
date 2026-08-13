import { NextResponse } from "next/server";
import {
  DAILY_COUNT_TTL_SECONDS,
  JOB_TTL_SECONDS,
  dailyCountKey,
  getRedis,
  isValidJobId,
  jobKey,
  maxAuditsPerDay,
} from "@/lib/auditStore";

// Starts an audit job and returns immediately.
//
// The old synchronous route held the request open for the whole workflow,
// which no longer fits: the real job takes ~2 minutes and the function budget
// is 60s. Now this marks the job as processing, hands it to n8n, and returns.
// n8n calls /api/audit-complete when it is done; the client polls
// /api/audit-status in the meantime.
//
// The webhook URL stays server-only, exactly as before.

export const runtime = "nodejs";
export const maxDuration = 30;

// n8n acknowledges the trigger almost immediately now, so this only needs to
// cover the handshake — NOT the workflow. If the ack is slow we still return
// success to the client, because the job may well have started anyway and the
// callback is what actually decides the outcome.
const HANDOFF_TIMEOUT_MS = 10_000;

function fail(status: number, error: string) {
  return NextResponse.json({ error }, { status });
}

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
  if (!/^[a-z0-9-]+(\.[a-z0-9-]+)+$/i.test(parsed.hostname)) return null;
  return parsed.toString();
}

function isEmail(raw: string): boolean {
  const v = raw.trim();
  return v.length <= 254 && /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(v);
}

/** Constant-time comparison so the code cannot be recovered by timing the
 *  response. Trimmed and case-insensitive, because visitors paste it from a
 *  message and a stray space should not read as "wrong code". */
function codeMatches(provided: string, expected: string): boolean {
  const a = provided.trim().toLowerCase();
  const b = expected.trim().toLowerCase();
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function POST(request: Request) {
  const webhookUrl = process.env.AUDIT_WEBHOOK_URL;
  if (!webhookUrl) {
    console.error("[audit-start] AUDIT_WEBHOOK_URL is not set");
    return fail(503, "The audit service is not available right now.");
  }

  const redis = getRedis();
  if (!redis) {
    console.error("[audit-start] Redis is not configured (KV_REST_API_URL/TOKEN)");
    return fail(503, "The audit service is not available right now.");
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return fail(400, "We could not read that request.");
  }

  const { websiteUrl, recipientEmail, jobId, accessCode } = (body ?? {}) as {
    websiteUrl?: unknown;
    recipientEmail?: unknown;
    jobId?: unknown;
    accessCode?: unknown;
  };

  // ── access gate ───────────────────────────────────────────────────────────
  // Checked FIRST, before any Redis write and before n8n is contacted, so a
  // wrong code costs nothing: no job key, no counter increment, no workflow
  // run. The expected value lives only in the environment; it is never
  // referenced literally anywhere in this repo.
  const expectedCode = process.env.SITE_ACCESS_CODE;
  if (!expectedCode) {
    // Fail closed. An unset code must not mean "let everyone in" on a tool that
    // costs money to run.
    console.error("[audit-start] SITE_ACCESS_CODE is not set");
    return fail(503, "The audit service is not available right now.");
  }
  if (typeof accessCode !== "string" || !codeMatches(accessCode, expectedCode)) {
    return fail(403, "Invalid access code.");
  }

  // Re-validated server-side; the client's checks are a convenience, not a gate.
  if (typeof websiteUrl !== "string" || typeof recipientEmail !== "string") {
    return fail(400, "Please provide a website address and an email address.");
  }
  if (!isValidJobId(jobId)) {
    return fail(400, "That request was not formed correctly.");
  }
  const normalisedUrl = normaliseUrl(websiteUrl);
  if (!normalisedUrl) {
    return fail(400, "That does not look like a valid website address.");
  }
  if (!isEmail(recipientEmail)) {
    return fail(400, "That does not look like a valid email address.");
  }

  // ── global daily cap ──────────────────────────────────────────────────────
  // A backstop for the access code leaking. One counter for the whole site —
  // not per IP or per identity, which would need tracking this tool has no
  // business doing.
  //
  // INCR is atomic, so two simultaneous requests cannot both read the same
  // value and slip past the limit. The TTL is only set when the counter is
  // created (value === 1); setting it on every increment would slide the window
  // forward forever and the key would never expire.
  try {
    const key = dailyCountKey();
    const count = await redis.incr(key);

    // Guard the type explicitly. A non-numeric result would make the
    // comparison below false and the cap would fail open without a single log
    // line — found exactly that while testing against a store whose INCR
    // returned null. Loud, because a silently-disabled spend limit is the
    // worst version of this bug.
    if (typeof count !== "number" || !Number.isFinite(count)) {
      console.error("[audit-start] daily counter returned a non-number", count);
      throw new Error("counter unavailable");
    }

    if (count === 1) await redis.expire(key, DAILY_COUNT_TTL_SECONDS);

    if (count > maxAuditsPerDay()) {
      console.warn("[audit-start] daily cap reached", count);
      return fail(
        429,
        "Daily audit limit reached, please try again tomorrow."
      );
    }
  } catch (error) {
    // The counter is a safety net, not the feature. If Redis hiccups on this
    // one call, let the audit through rather than blocking a legitimate run —
    // the access code is still the primary gate.
    console.error("[audit-start] could not update the daily counter", error);
  }

  // Mark the job as in flight BEFORE handing off, so a fast callback can never
  // arrive and then be overwritten by this write.
  try {
    await redis.set(
      jobKey(jobId),
      { status: "processing" },
      { ex: JOB_TTL_SECONDS }
    );
  } catch (error) {
    console.error("[audit-start] could not write job", error);
    return fail(503, "The audit service is not available right now.");
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), HANDOFF_TIMEOUT_MS);

  try {
    const upstream = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        websiteUrl: normalisedUrl,
        recipientEmail: recipientEmail.trim(),
        jobId,
      }),
      signal: controller.signal,
      cache: "no-store",
    });

    if (!upstream.ok) {
      // The trigger was refused outright, so no callback is coming — say so now
      // rather than letting the client poll for four minutes.
      console.error("[audit-start] upstream refused the trigger", upstream.status);
      await redis
        .set(
          jobKey(jobId),
          { status: "failed", error: "The audit could not be started." },
          { ex: JOB_TTL_SECONDS }
        )
        .catch(() => {});
      return fail(502, "The audit could not be started. Please try again.");
    }
  } catch (error) {
    // A slow or aborted ACK is not fatal: n8n may still be running the job, and
    // the callback decides. Log it and let the client poll.
    const aborted = error instanceof Error && error.name === "AbortError";
    console.error(
      "[audit-start] handoff did not confirm",
      aborted ? "timeout" : error
    );
  } finally {
    clearTimeout(timer);
  }

  return NextResponse.json({ jobId });
}
