import type { Request, Response, NextFunction } from 'express';
import type { ServerConfig } from '../config/env.js';
import { getSession } from '../services/auth.js';

export function requireAdmin(config: ServerConfig) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try { const session = await getSession(req, config); if (!session) { res.status(401).json({ success: false, message: 'Unauthorized' }); return; } next(); }
    catch (error) { next(error); }
  };
}
