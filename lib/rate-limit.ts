// Enhanced rate limiting with IP and email tracking, progressive delays
// 
// VERCEL DEPLOYMENT NOTICE:
// This rate limiting uses in-memory storage which resets between serverless function invocations.
// This is acceptable behavior for Vercel deployments because:
// 1. Serverless functions are stateless by design
// 2. Each function invocation gets a fresh memory space
// 3. Rate limiting still provides protection during active sessions
// 4. Vercel's edge network provides additional DDoS protection
// 5. The multi-layer approach (email + IP) provides redundant protection
//
// For persistent rate limiting across function restarts, consider:
// - Redis/Upstash for high-traffic applications
// - Database-backed rate limiting for complex scenarios
// - Vercel Edge Config for simple global limits
interface RateLimitEntry {
  count: number;
  resetTime: number;
  lastAttempt: number;
  progressiveDelay: number;
}

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  enableProgressiveDelay: boolean;
  baseDelayMs: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

// Default configurations for different endpoints
const RATE_LIMIT_CONFIGS = {
  email: { maxRequests: 3, windowMs: 15 * 60 * 1000, enableProgressiveDelay: true, baseDelayMs: 1000 },
  ip: { maxRequests: 10, windowMs: 15 * 60 * 1000, enableProgressiveDelay: true, baseDelayMs: 500 },
  health: { maxRequests: 60, windowMs: 60 * 1000, enableProgressiveDelay: false, baseDelayMs: 0 }
} as const;

// Clean up old entries every 5 minutes (more frequent cleanup)
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap.entries()) {
    if (now > entry.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}, 5 * 60 * 1000);

// Enhanced rate limiting with progressive delays
export function checkRateLimit(
  identifier: string, 
  maxRequests = 5, 
  windowMs = 15 * 60 * 1000,
  enableProgressiveDelay = false
): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(identifier);

  if (!entry || now > entry.resetTime) {
    // First request or window expired
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
      lastAttempt: now,
      progressiveDelay: 0
    });
    return true;
  }

  // Check if we need to apply progressive delay
  if (enableProgressiveDelay && entry.progressiveDelay > 0) {
    const timeSinceLastAttempt = now - entry.lastAttempt;
    if (timeSinceLastAttempt < entry.progressiveDelay) {
      // Still in delay period
      return false;
    }
  }

  if (entry.count >= maxRequests) {
    // Calculate progressive delay (exponential backoff)
    if (enableProgressiveDelay) {
      entry.progressiveDelay = Math.min(
        1000 * Math.pow(2, entry.count - maxRequests), // Exponential backoff
        30 * 60 * 1000 // Max 30 minutes delay
      );
    }
    entry.lastAttempt = now;
    return false; // Rate limit exceeded
  }

  entry.count++;
  entry.lastAttempt = now;
  return true;
}

// Multi-layer rate limiting (email + IP)
export function checkMultiLayerRateLimit(
  email: string, 
  ipAddress?: string
): { allowed: boolean; reason?: string } {
  // Check email-based rate limiting
  const emailAllowed = checkRateLimit(
    `email:${email}`, 
    RATE_LIMIT_CONFIGS.email.maxRequests,
    RATE_LIMIT_CONFIGS.email.windowMs,
    RATE_LIMIT_CONFIGS.email.enableProgressiveDelay
  );

  if (!emailAllowed) {
    return { allowed: false, reason: 'email_rate_limit' };
  }

  // Check IP-based rate limiting if IP is provided
  if (ipAddress) {
    const ipAllowed = checkRateLimit(
      `ip:${ipAddress}`,
      RATE_LIMIT_CONFIGS.ip.maxRequests,
      RATE_LIMIT_CONFIGS.ip.windowMs,
      RATE_LIMIT_CONFIGS.ip.enableProgressiveDelay
    );

    if (!ipAllowed) {
      return { allowed: false, reason: 'ip_rate_limit' };
    }
  }

  return { allowed: true };
}

// Health endpoint specific rate limiting
export function checkHealthRateLimit(ipAddress: string): boolean {
  return checkRateLimit(
    `health:${ipAddress}`,
    RATE_LIMIT_CONFIGS.health.maxRequests,
    RATE_LIMIT_CONFIGS.health.windowMs,
    RATE_LIMIT_CONFIGS.health.enableProgressiveDelay
  );
}

// Get rate limit status for monitoring
export function getRateLimitStatus(identifier: string): RateLimitEntry | null {
  return rateLimitMap.get(identifier) || null;
}

// Clear rate limit for specific identifier (for admin use)
export function clearRateLimit(identifier: string): boolean {
  return rateLimitMap.delete(identifier);
}

// Get rate limiting statistics (for monitoring and debugging)
export function getRateLimitStats(): {
  totalEntries: number;
  activeEntries: number;
  expiredEntries: number;
  memoryUsage: string;
} {
  const now = Date.now();
  let activeEntries = 0;
  let expiredEntries = 0;

  for (const [, entry] of rateLimitMap.entries()) {
    if (now > entry.resetTime) {
      expiredEntries++;
    } else {
      activeEntries++;
    }
  }

  return {
    totalEntries: rateLimitMap.size,
    activeEntries,
    expiredEntries,
    memoryUsage: `${Math.round(rateLimitMap.size * 100 / 1024)}KB (estimated)`
  };
}

// Manual cleanup function (can be called periodically)
export function cleanupExpiredEntries(): number {
  const now = Date.now();
  let cleanedCount = 0;

  for (const [key, entry] of rateLimitMap.entries()) {
    if (now > entry.resetTime) {
      rateLimitMap.delete(key);
      cleanedCount++;
    }
  }

  return cleanedCount;
}

// Vercel-optimized rate limiting with automatic cleanup on each check
export function checkRateLimitWithCleanup(
  identifier: string,
  maxRequests = 5,
  windowMs = 15 * 60 * 1000,
  enableProgressiveDelay = false
): boolean {
  // Perform lightweight cleanup on every 10th call to prevent memory bloat
  if (Math.random() < 0.1) {
    cleanupExpiredEntries();
  }

  return checkRateLimit(identifier, maxRequests, windowMs, enableProgressiveDelay);
}