import 'dotenv/config';
import { z } from 'zod';

const schema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  MONGODB_URI: z.string().min(1),
  CLIENT_URL: z.string().url().transform(value => new URL(value).origin),
  CLIENT_URLS: z.string().optional().refine(value => !value || value.split(',').every(entry => {
    const origin = entry.trim();
    try { return new URL(origin).origin === origin; } catch { return false; }
  }), 'Use comma-separated frontend origins without paths'),
  AUTH_SECRET: z.string().min(32),
  TRUST_PROXY: z.coerce.number().int().min(0).max(3).default(0),
  COOKIE_SAME_SITE: z.enum(['lax', 'strict', 'none']).default('lax'),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional()
});
export type ServerConfig = z.infer<typeof schema>;
export function getConfig(): ServerConfig {
  const deploymentOrigin = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined;
  const productionOrigin = process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : undefined;
  const additionalOrigins = [process.env.CLIENT_URLS, deploymentOrigin, productionOrigin].filter(Boolean).join(',');
  const parsed = schema.safeParse({
    ...process.env,
    CLIENT_URL: process.env.CLIENT_URL || deploymentOrigin || productionOrigin,
    CLIENT_URLS: additionalOrigins || undefined
  });
  if (!parsed.success) throw new Error(`Invalid server configuration: ${parsed.error.issues.map(issue => issue.path.join('.')).join(', ')}`);
  if (parsed.data.COOKIE_SAME_SITE === 'none' && parsed.data.NODE_ENV !== 'production') throw new Error('SameSite=None requires production HTTPS');
  return parsed.data;
}
