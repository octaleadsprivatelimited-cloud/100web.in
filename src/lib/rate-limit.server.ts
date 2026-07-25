type Entry = { count: number; resetAt: number };
const buckets = new Map<string, Entry>();

export function consumeRateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const current = buckets.get(key);
  const entry = !current || current.resetAt <= now ? { count: 0, resetAt: now + windowMs } : current;
  entry.count += 1;
  buckets.set(key, entry);
  return { allowed: entry.count <= limit, retryAfterSeconds: Math.ceil(Math.max(0, entry.resetAt - now) / 1000) };
}

export function clearRateLimit(key: string) { buckets.delete(key); }
