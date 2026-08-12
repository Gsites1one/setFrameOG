import { NextResponse } from "next/server";
import {
  JOB_TTL_SECONDS,
  getRedis,
  isValidJobId,
  jobKey,
} from "@/lib/auditStore";

// Callback endpoint n8n calls when a job finishes, up to ~3 minutes after the
// trigger. Writes the finished report into the job store, overwriting the
// "processing" entry the start route left there.
//
// This route is publicly reachable by necessity — n8n has to be able to call
// it — so the shared secret is the only thing standing between the internet
// and the ability to write arbitrary report content into a job. It is compared
// in constant time and the failure response is deliberately featureless.

export const runtime = "nodejs";
export const maxDuration = 30;

/** Constant-time comparison, so a wrong secret cannot be recovered by timing
 *  the response. Length is compared first, which is not secret. */
function secretMatches(provided: string, expected: string): boolean {
  if (provided.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < provided.length; i++) {
    diff |= provided.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return diff === 0;
}

export async function POST(request: Request) {
  const expected = process.env.CALLBACK_SECRET;
  if (!expected) {
    // Refuse rather than accept everything if the secret is unset — an open
    // write endpoint is worse than a broken one.
    console.error("[audit-complete] CALLBACK_SECRET is not set");
    return NextResponse.json({ error: "Not available." }, { status: 503 });
  }

  const provided = request.headers.get("x-callback-secret") ?? "";
  if (!provided || !secretMatches(provided, expected)) {
    console.error("[audit-complete] rejected a callback with a bad secret");
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const redis = getRedis();
  if (!redis) {
    console.error("[audit-complete] Redis is not configured");
    return NextResponse.json({ error: "Not available." }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed body." }, { status: 400 });
  }

  const payload = (body ?? {}) as Record<string, unknown>;
  const jobId = payload.jobId;
  if (!isValidJobId(jobId)) {
    return NextResponse.json({ error: "Missing or invalid jobId." }, { status: 400 });
  }

  // The report is stored as received. The client normaliser already tolerates
  // shape variation, so reshaping here would only add a second place for the
  // contract to drift.
  const { jobId: _omit, ...data } = payload;
  void _omit;

  try {
    await redis.set(
      jobKey(jobId),
      { status: "complete", data },
      { ex: JOB_TTL_SECONDS }
    );
  } catch (error) {
    console.error("[audit-complete] could not write result", error);
    return NextResponse.json({ error: "Could not store result." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
