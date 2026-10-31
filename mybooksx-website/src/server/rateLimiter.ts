/**
 * Sliding Window Rate Limiter
 * Protects authentication and critical transactional endpoints against brute-force attacks.
 */

interface RateLimitRecord {
  timestamps: number[];
}

const memoryStore = new Map<string, RateLimitRecord>();

// Periodic garbage collection for memory store (every 5 minutes)
let lastCleanup = Date.now();
function cleanupOldEntries(windowMs: number) {
  const now = Date.now();
  if (now - lastCleanup < 60000) return;
  lastCleanup = now;

  for (const [key, record] of memoryStore.entries()) {
    record.timestamps = record.timestamps.filter(t => now - t < windowMs);
    if (record.timestamps.length === 0) {
      memoryStore.delete(key);
    }
  }
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetMs: number;
}

/**
 * Check and record a rate limit attempt
 * @param key Unique identifier (e.g. `login:192.168.1.1` or `submit:user_123`)
 * @param maxAttempts Maximum permitted attempts within the window
 * @param windowMs Time window in milliseconds (e.g. 60,000 for 1 minute)
 */
export function checkRateLimit(key: string, maxAttempts: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  cleanupOldEntries(windowMs);

  let record = memoryStore.get(key);
  if (!record) {
    record = { timestamps: [] };
    memoryStore.set(key, record);
  }

  // Filter timestamps within window
  record.timestamps = record.timestamps.filter(t => now - t < windowMs);

  if (record.timestamps.length >= maxAttempts) {
    const oldest = record.timestamps[0];
    const resetMs = Math.max(0, windowMs - (now - oldest));
    return {
      allowed: false,
      remaining: 0,
      resetMs
    };
  }

  // Record this attempt
  record.timestamps.push(now);

  return {
    allowed: true,
    remaining: maxAttempts - record.timestamps.length,
    resetMs: windowMs
  };
}

