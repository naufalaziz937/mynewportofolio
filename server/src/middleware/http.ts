import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import mongoose from 'mongoose';
import multer from 'multer';

export class HttpError extends Error { constructor(public status: number, message: string) { super(message); } }
export function asyncRoute(handler: (req: Request, res: Response) => Promise<void>) {
  return (req: Request, res: Response, next: NextFunction): void => { Promise.resolve(handler(req, res)).catch(next); };
}
export function validId(id: string): string { if (!mongoose.isValidObjectId(id)) throw new HttpError(400, 'Invalid resource ID'); return id; }
export function errorHandler(error: unknown, req: Request, res: Response, _next: NextFunction): void {
  if (error instanceof ZodError) { res.status(400).json({ success: false, message: 'Invalid input', issues: error.issues.map(issue => ({ path: issue.path.join('.'), message: issue.message })) }); return; }
  if (error instanceof HttpError) { res.status(error.status).json({ success: false, message: error.message }); return; }
  if (error instanceof multer.MulterError) { res.status(error.code === 'LIMIT_FILE_SIZE' ? 413 : 400).json({ success: false, message: 'Upload exceeds the allowed limits' }); return; }
  if (error instanceof SyntaxError && 'body' in error) { res.status(400).json({ success: false, message: 'Malformed JSON' }); return; }
  if (error instanceof mongoose.Error.ValidationError) { res.status(400).json({ success: false, message: 'Invalid resource data' }); return; }
  if (typeof error === 'object' && error !== null && 'code' in error && error.code === 11000) { res.status(409).json({ success: false, message: 'A resource with this unique value already exists' }); return; }
  console.error('Request failed', { requestId: res.locals.requestId, method: req.method, path: req.path, error: error instanceof Error ? error.name : 'UnknownError' });
  res.status(500).json({ success: false, message: 'Internal server error' });
}
