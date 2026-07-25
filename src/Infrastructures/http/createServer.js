import express from 'express';
import swaggerUi from 'swagger-ui-express';
import ClientError from '../../Commons/exceptions/ClientError.js';
import DomainErrorTranslator from '../../Commons/exceptions/DomainErrorTranslator.js';
import swaggerSpec from './swagger.js';
import users from '../../Interfaces/http/api/users/index.js';
import authentications from '../../Interfaces/http/api/authentications/index.js';
import threads from '../../Interfaces/http/api/threads/index.js';
import comment from '../../Interfaces/http/api/comments/index.js';
import rateLimit from './middleware/rate-limit.js';
import requestLogger from './middleware/logger.js';
import pool from '../database/postgres/pool.js';
const createServer = async (container) => {
  const app = express();

  app.use((req, res, next) => {
    const allowedOrigins = (process.env.CORS_ORIGINS || '*').split(',').map((o) => o.trim());
    const origin = req.headers.origin;

    if (allowedOrigins.includes('*')) {
      res.header('Access-Control-Allow-Origin', '*');
    } else if (origin && allowedOrigins.includes(origin)) {
      res.header('Access-Control-Allow-Origin', origin);
    }

    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Max-Age', '86400');

    if (req.method === 'OPTIONS') {
      return res.sendStatus(204);
    }

    next();
  });

  app.use(requestLogger());

  app.use(
    rateLimit({
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 60_000,
      max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100,
      message: 'Too many requests, please try again later.',
    }),
  );

  // Middleware for parsing JSON
  app.use(express.json());

  app.get('/health', async (req, res) => {
    try {
      const start = Date.now();
      await pool.query('SELECT 1');
      const latencyMs = Date.now() - start;

      res.status(200).json({
        status: 'success',
        data: {
          uptime: process.uptime(),
          timestamp: new Date().toISOString(),
          database: {
            status: 'connected',
            latency: `${latencyMs}ms`,
          },
          memory: {
            rss: `${Math.round(process.memoryUsage().rss / 1024 / 1024)}MB`,
            heapUsed: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
          },
        },
      });
    } catch (error) {
      res.status(503).json({
        status: 'error',
        data: {
          uptime: process.uptime(),
          timestamp: new Date().toISOString(),
          database: {
            status: 'disconnected',
            error: error.message,
          },
        },
      });
    }
  });

  // Swagger UI documentation
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      swaggerOptions: {
        displayOperationId: true,
        displayRequestDuration: true,
        defaultModelsExpandDepth: 1,
        defaultModelExpandDepth: 1,
      },
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: 'Forum API Documentation',
    }),
  );

  // Register routes
  app.use('/users', users(container));
  app.use('/authentications', authentications(container));
  app.use('/threads', threads(container));
  app.use('/threads', comment(container));
  app.get('/hello', (req, res) => {
    res.status(200).json({
      status: 'success',
      message: 'Hello, World!',
    });
  });
  // Global error handler
  app.use((error, req, res, next) => {
    const translatedError = DomainErrorTranslator.translate(error);

    // penanganan client error secara internal.
    if (translatedError instanceof ClientError) {
      return res.status(translatedError.statusCode).json({
        status: 'fail',
        message: translatedError.message,
      });
    }

    return res.status(500).json({
      status: 'error',
      message: 'terjadi kegagalan pada server kami',
    });
  });

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({
      status: 'fail',
      message: 'Route not found',
    });
  });

  return app;
};

export default createServer;
