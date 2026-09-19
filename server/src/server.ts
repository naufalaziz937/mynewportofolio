import { createServer } from 'node:http';
import { getConfig } from './config/env.js';
import { connectDatabase, disconnectDatabase } from './config/db.js';
import { createApp } from './app.js';

async function main(): Promise<void> {
  const config = getConfig();
  await connectDatabase(config.MONGODB_URI);
  const server = createServer(createApp(config));
  server.listen(config.PORT, () => console.info(`Portfolio API listening on port ${config.PORT}.`));
  const shutdown = () => { server.close(() => { disconnectDatabase().finally(() => process.exit(0)); }); };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}
main().catch(error => { console.error(error instanceof Error ? error.message : 'API startup failed'); process.exitCode = 1; });
