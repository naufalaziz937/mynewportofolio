import { createHmac, randomBytes } from 'node:crypto';
import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { Admin, Session } from '../models/index.js';
import type { ServerConfig } from '../config/env.js';

export const COOKIE_NAME = 'portfolio_session';
const duration = 7 * 24 * 60 * 60 * 1000;
export const hashToken = (token: string, secret: string): string => createHmac('sha256', secret).update(token).digest('hex');
export async function login(password: string, config: ServerConfig, response: Response): Promise<boolean> {
  const admin = await Admin.findOne().select('+passwordHash');
  // The fallback hash keeps missing-account failures in the same timing class.
  const valid = await bcrypt.compare(password, admin?.passwordHash ?? '$2a$12$C6UzMDM.H6dfI/f/IKcEe.O.zG0WfLDK00DhwyMCy.ZbOLO4sPxyy');
  if (!admin || !valid) return false;
  const token = randomBytes(32).toString('base64url');
  await Session.create({ adminId: admin._id, tokenHash: hashToken(token, config.AUTH_SECRET), expiresAt: new Date(Date.now() + duration) });
  response.cookie(COOKIE_NAME, token, { httpOnly: true, secure: config.NODE_ENV === 'production', sameSite: config.COOKIE_SAME_SITE, maxAge: duration, path: '/' });
  return true;
}
export async function getSession(request: Request, config: ServerConfig) {
  const token: unknown = request.cookies?.[COOKIE_NAME];
  if (typeof token !== 'string' || token.length > 128) return null;
  return Session.findOne({ tokenHash: hashToken(token, config.AUTH_SECRET), expiresAt: { $gt: new Date() } });
}
export async function logout(request: Request, response: Response, config: ServerConfig): Promise<void> {
  const token: unknown = request.cookies?.[COOKIE_NAME];
  if (typeof token === 'string') await Session.deleteOne({ tokenHash: hashToken(token, config.AUTH_SECRET) });
  response.clearCookie(COOKIE_NAME, { httpOnly: true, secure: config.NODE_ENV === 'production', sameSite: config.COOKIE_SAME_SITE, path: '/' });
}
