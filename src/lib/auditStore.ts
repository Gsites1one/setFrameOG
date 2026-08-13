import { Redis } from "@upstash/redis";

// Job store for the async audit flow, backed by the Upstash Redis database
// connected through the Vercel Marketplace.
//
// IMPORTANT — env var names. `Redis.fromEnv()` is not used here on purpose: it
// looks for UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN, and the
// Marketplace integration on this project actually injects the KV_-prefixed
// names (KV_REST_API_URL / KV_REST_API_TOKEN, plus KV_URL and REDIS_URL).
// Verified by pulling the production environment. Both naming schemes are
// accepted below so this keeps working if the integration is ever re-created
// with the other set.
//
// Why a store at all: the real workflow takes ~2 minutes, which no serverless
// function should be held open for. The request that starts a job and the
// callback that finishes it are separate invocations with no shared memory, so
// the job state has to live somewhere both can reach.

const url =
  process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL ?? "";
const token =
  process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN ?? "";

let client: Redis | null = null;

/** Null when the database is not configured, so callers can fail cleanly. */
export function getRedis(): Redis | null {
  if (!url || !token) return null;
  if (!client) client = new Redis({ url, token });
  return client;
}

/** Ten minutes: comfortably longer than the ~2 minute job plus the client's
 *  4 minute polling ceiling, short enough that abandoned jobs expire. */
export const JOB_TTL_SECONDS = 600;

export const jobKey = (jobId: string) => `audit:${jobId}`;

/** Global run counter, one key per UTC day. UTC rather than server-local so the
 *  window cannot shift between regions or across a DST change. */
export function dailyCountKey(now = new Date()): string {
  return `audit-count:${now.toISOString().slice(0, 10)}`;
}

/** 25h, so the key always outlives the day it counts and expires on its own. */
export const DAILY_COUNT_TTL_SECONDS = 25 * 60 * 60;

export const DEFAULT_MAX_AUDITS_PER_DAY = 20;

export function maxAuditsPerDay(): number {
  const raw = Number.parseInt(process.env.MAX_AUDITS_PER_DAY ?? "", 10);
  return Number.isFinite(raw) && raw > 0 ? raw : DEFAULT_MAX_AUDITS_PER_DAY;
}

export type JobRecord =
  | { status: "processing" }
  | { status: "complete"; data: Record<string, unknown> }
  | { status: "failed"; error: string };

/** Job ids come from the client, so they are never trusted as key material —
 *  anything that is not a plain UUID-shaped token is rejected before it can
 *  reach Redis. */
export function isValidJobId(value: unknown): value is string {
  return (
    typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)
  );
}
