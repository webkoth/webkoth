// Simple in-memory token bucket. For single-server deployments only.
// For horizontal scale → swap to @upstash/ratelimit or similar.

type Bucket = { tokens: number; updatedAt: number };
const buckets = new Map<string, Bucket>();

const CAPACITY = 5;
const REFILL_PER_MIN = 0.5; // 5 tokens per 10 minutes

export function rateLimitTake(key: string): { allowed: boolean; remaining: number; retryAfterMs?: number } {
  const now = Date.now();
  const b = buckets.get(key) ?? { tokens: CAPACITY, updatedAt: now };
  const minutesElapsed = (now - b.updatedAt) / 60000;
  b.tokens = Math.min(CAPACITY, b.tokens + minutesElapsed * REFILL_PER_MIN);
  b.updatedAt = now;
  if (b.tokens < 1) {
    const minutesToOne = (1 - b.tokens) / REFILL_PER_MIN;
    buckets.set(key, b);
    return { allowed: false, remaining: 0, retryAfterMs: Math.ceil(minutesToOne * 60000) };
  }
  b.tokens -= 1;
  buckets.set(key, b);
  return { allowed: true, remaining: Math.floor(b.tokens) };
}
