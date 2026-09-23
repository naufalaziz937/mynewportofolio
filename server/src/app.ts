import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { randomUUID } from 'node:crypto';
import type { ServerConfig } from './config/env.js';
import { authRoutes } from './routes/auth.js';
import { publicRoutes } from './routes/public.js';
import { manageRoutes } from './routes/manage.js';
import { requireAdmin } from './middleware/auth.js';
import { errorHandler } from './middleware/http.js';

export function createApp(config: ServerConfig) {
  const app = express();
  const allowedOrigins = [config.CLIENT_URL, ...(config.CLIENT_URLS?.split(',').map(value => value.trim()).filter(Boolean) ?? [])];
  app.disable('x-powered-by');
  app.set('trust proxy', config.TRUST_PROXY || false);
  app.use((_req, res, next) => {
    const requestId = randomUUID();
    res.locals.requestId = requestId;
    res.set('X-Request-Id', requestId);
    next();
  });
  app.use(helmet());
  app.use(cors({ origin: allowedOrigins, credentials: true }));
  app.use((req, res, next) => {
    const origin = req.get('origin');
    if (!['GET', 'HEAD', 'OPTIONS'].includes(req.method) && origin && !allowedOrigins.includes(origin)) { res.status(403).json({ success: false, message: 'Origin not allowed' }); return; }
    next();
  });
  app.use(express.json({ limit: '100kb' }));
  app.use(cookieParser());
  app.get('/api/health', (_req, res) => res.json({ success: true, data: { api: 'online' } }));
  app.use('/api/auth', authRoutes(config));
  app.use('/api/manage', requireAdmin(config), manageRoutes(config));
  app.use('/api', publicRoutes());
  app.use((_req, res) => res.status(404).json({ success: false, message: 'Resource not found' }));
  app.use(errorHandler);
  return app;
}
