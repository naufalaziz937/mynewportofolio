import type { IncomingMessage, ServerResponse } from 'node:http';
import mongoose from 'mongoose';
import { createApp } from '../server/src/app.js';
import { getConfig } from '../server/src/config/env.js';
import { connectDatabase } from '../server/src/config/db.js';

const config = getConfig();
const app = createApp(config);
let connection: Promise<void> | undefined;

function ensureDatabase(): Promise<void> {
  if (mongoose.connection.readyState === 1) return Promise.resolve();
  if (!connection || mongoose.connection.readyState === 0) connection = connectDatabase(config.MONGODB_URI).catch(error => {
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
    res.end('Not found');
    return;
  }
  url.searchParams.delete('__route');
  req.url = `/api/${route}${url.search}`;
  try {
    await ensureDatabase();
    app(req, res);
  } catch {
    res.statusCode = 503;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ success: false, message: 'Database unavailable' }));
  }
}
