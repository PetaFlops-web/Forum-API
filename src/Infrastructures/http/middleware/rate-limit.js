/**
 * Rate limiting middleware using in-memory sliding window.
 * For production with multiple instances, use Redis-backed store (e.g., rate-limit-redis).
 */

const rateLimit = ({
  windowMs = 60 * 1000, // 1 minute
  max = 100,            // max requests per window
  message = 'Too many requests, please try again later.',
  standardHeaders = true, // Return rate limit info in headers
  keyGenerator = (req) => req.ip,
} = {}) => {
  // Store: Map<key, { count, resetTime }>
  const hits = new Map();

  // Cleanup expired entries every 60 seconds
  const cleanupInterval = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of hits) {
      if (now > entry.resetTime) {
        hits.delete(key);
      }
    }
  }, 60_000);

  // Allow cleanup interval to not prevent process exit
  if (cleanupInterval.unref) {
    cleanupInterval.unref();
  }

  return (req, res, next) => {
    const key = keyGenerator(req);
    const now = Date.now();

    let entry = hits.get(key);

    if (!entry || now > entry.resetTime) {
      entry = { count: 0, resetTime: now + windowMs };
      hits.set(key, entry);
    }

    entry.count += 1;

    const remaining = Math.max(0, max - entry.count);
    const resetEpoch = Math.ceil(entry.resetTime / 1000);

    if (standardHeaders) {
      res.set('RateLimit-Limit', String(max));
      res.set('RateLimit-Remaining', String(remaining));
      res.set('RateLimit-Reset', String(resetEpoch));
    }

    if (entry.count > max) {
      res.set('Retry-After', String(Math.ceil((entry.resetTime - now) / 1000)));
      return res.status(429).json({
        status: 'fail',
        message,
      });
    }

    next();
  };
};

export default rateLimit;
