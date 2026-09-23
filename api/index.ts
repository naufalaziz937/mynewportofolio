import type { IncomingMessage, ServerResponse } from 'node:http';
import mongoose from 'mongoose';
import { createApp } from '../server/src/app.js';
import { getConfig } from '../server/src/config/env.js';
import { connectDatabase } from '../server/src/config/db.js';

type ApiApp = ReturnType<typeof createApp>;

let app: ApiApp | undefined;
let connection: Promise<void> | undefined;

function getApp(): ApiApp {
  if (!app) app = createApp(getConfig());
  return app;
}

function ensureDatabase(uri: string): Promise<void> {
  if (mongoose.connection.readyState === 1) return Promise.resolve();
  if (!connection || mongoose.connection.readyState === 0) connection = connectDatabase(uri).catch(error => {
    connection = undefined;
    throw error;
  });
  return connection;
}

export default async function handler(req: IncomingMessage, res: ServerResponse): Promise<void> {
  const url = new URL(req.url ?? '/', 'http://localhost');
  const route = url.searchParams.get('__route');
  if (route === null) {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({ success: false, message: 'Resource not found' }));
    return;
  }
  url.searchParams.delete('__route');
  req.url = `/api/${route}${url.search}`;
  let stage = 'configuration';
  try {
    const config = getConfig();
    stage = 'database';
    await ensureDatabase(config.MONGODB_URI);
    stage = 'application';
    getApp()(req, res);
  } catch (error) {
    console.error('API initialization failed', { route, stage, error: error instanceof Error ? error.name : 'UnknownError' });
    res.statusCode = 503;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({ success: false, message: 'Portfolio service unavailable' }));
  }
}
