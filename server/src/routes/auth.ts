import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import type { ServerConfig } from '../config/env.js';
import { asyncRoute } from '../middleware/http.js';
import { getSession, login, logout } from '../services/auth.js';
import { loginSchema } from '../schemas/content.js';

export function authRoutes(config: ServerConfig): Router {
  const router = Router();
  router.post('/login', rateLimit({ windowMs: 15 * 60 * 1000, limit: 5, standardHeaders: 'draft-7', legacyHeaders: false, message: { success: false, message: 'Too many attempts. Try again later.' } }), asyncRoute(async (req, res) => {
    const { password } = loginSchema.parse(req.body);
    const valid = await login(password, config, res);
    if (!valid) { res.status(401).json({ success: false, message: 'Invalid credentials' }); return; }
    res.json({ success: true, data: { authenticated: true } });
  }));
  router.get('/me', asyncRoute(async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    const session = await getSession(req, config);
    res.json({ success: true, data: { authenticated: Boolean(session) } });
  }));
  router.post('/logout', asyncRoute(async (req, res) => { await logout(req, res, config); res.json({ success: true, data: { authenticated: false } }); }));
  return router;
}
