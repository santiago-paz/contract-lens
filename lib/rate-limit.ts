type RateLimitEntry = {
  count: number;
  expiresAt: number;
};

const store = new Map<string, RateLimitEntry>();

/**
 * Basic in-memory rate limiter.
 * @param key Unique identifier (IP, email, etc.)
 * @param limit Max number of requests
 * @param windowMs Time window in milliseconds
 * @returns true if request is allowed, false if limit exceeded
 */
export function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = store.get(key);

  // If no entry or expired, reset
  if (!entry || now > entry.expiresAt) {
    store.set(key, { count: 1, expiresAt: now + windowMs });
    return true;
  }

  // If limit exceeded
  if (entry.count >= limit) {
    return false;
  }

  // Increment
  entry.count++;
  return true;
}

// Cleanup expired entries every minute to prevent memory leaks
if (typeof setInterval !== 'undefined') {
    setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store.entries()) {
        if (now > entry.expiresAt) {
        store.delete(key);
        }
    }
    }, 60000).unref?.(); // .unref() if in Node to not block exit
}
