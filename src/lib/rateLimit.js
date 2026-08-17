/**
 * Simple in-memory rate limiter.
 * In production with multiple instances, replace with Redis-based solution.
 */

const store = new Map(); // ip -> { count, resetAt }

const MAX_ATTEMPTS = 5;         // max failed login attempts
const WINDOW_MS = 15 * 60 * 1000; // 15-minute window

/**
 * Check if the given identifier (e.g. IP) is rate limited.
 * Returns { limited: true, retryAfterMs } or { limited: false }.
 */
export function checkRateLimit(identifier) {
  const now = Date.now();
  const entry = store.get(identifier);

  if (!entry || now > entry.resetAt) {
    store.set(identifier, { count: 1, resetAt: now + WINDOW_MS });
    return { limited: false };
  }

  if (entry.count >= MAX_ATTEMPTS) {
    return { limited: true, retryAfterMs: entry.resetAt - now };
  }

  entry.count += 1;
  return { limited: false };
}

/**
 * Reset the rate limit counter for an identifier (e.g. after successful login).
 */
export function resetRateLimit(identifier) {
  store.delete(identifier);
}

/**
 * Get IP address from Next.js request headers.
 */
export function getClientIp(request) {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}
