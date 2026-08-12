import { NextResponse } from "next/server";
import { getRedis, isValidJobId, jobKey } from "@/lib/auditStore";

// Polled by the client every few seconds while a job runs. Returns the stored
// record as-is: { status: "processing" } | { status: "complete", data } |
// { status: "failed", error }.
//
// A missing key means the job expired or never existed, which is reported as
// not_found rather than an error — the client turns that into the normal
// "took longer than expected" path instead of a scary failure.

export const runtime = "nodejs";

export async function GET(request: Request) {
  const jobId = new URL(request.url).searchParams.get("jobId");
  if (!isValidJobId(jobId)) {
    return NextResponse.json({ status: "not_found" });
  }

  const redis = getRedis();
  if (!redis) {
    console.error("[audit-status] Redis is not configured");
    return NextResponse.json({ status: "not_found" });
  }

  try {
    const record = await redis.get(jobKey(jobId));
    if (!record) return NextResponse.json({ status: "not_found" });
    // No caching anywhere on this path — a cached "processing" would strand
    // the client polling a value that never changes.
    return NextResponse.json(record, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch (error) {
    console.error("[audit-status] read failed", error);
    return NextResponse.json({ status: "not_found" });
  }
}
