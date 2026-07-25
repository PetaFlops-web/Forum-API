
const logger = ({
  logLevel = process.env.LOG_LEVEL || 'info',
} = {}) => {
  const levels = { error: 0, warn: 1, info: 2, debug: 3 };
  const currentLevel = levels[logLevel] ?? levels.info;

  return (req, res, next) => {
    const startTime = process.hrtime.bigint();

    const originalEnd = res.end;
    res.end = function (...args) {
      const endTime = process.hrtime.bigint();
      const durationNs = Number(endTime - startTime);
      const durationMs = (durationNs / 1_000_000).toFixed(2);

      const logEntry = {
        timestamp: new Date().toISOString(),
        level: res.statusCode >= 500 ? 'error' : res.statusCode >= 400 ? 'warn' : 'info',
        method: req.method,
        url: req.originalUrl || req.url,
        statusCode: res.statusCode,
        responseTime: `${durationMs}ms`,
        userAgent: req.headers['user-agent'] || '-',
        ip: req.ip || req.connection?.remoteAddress || '-',
        contentLength: res.getHeader('content-length') || '-',
      };

      // Add request ID if present
      if (req.id) {
        logEntry.requestId = req.id;
      }

      // Only log if within configured level
      const entryLevel = levels[logEntry.level] ?? levels.info;
      if (entryLevel <= currentLevel) {
        process.stdout.write(`${JSON.stringify(logEntry)}\n`);
      }

      originalEnd.apply(res, args);
    };

    next();
  };
};

export default logger;
