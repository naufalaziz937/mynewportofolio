import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { getConfig } from '../src/config/env.js';
import { connectDatabase, disconnectDatabase } from '../src/config/db.js';
import { Admin } from '../src/models/index.js';

async function createAdmin(): Promise<void> {
  const config = getConfig();
  const username = process.env.ADMIN_USERNAME?.trim();
  const password = process.env.ADMIN_INITIAL_PASSWORD;
  if (!username || !password || password.length < 12) throw new Error('Set ADMIN_USERNAME and an ADMIN_INITIAL_PASSWORD of at least 12 characters before running setup.');
  await connectDatabase(config.MONGODB_URI);
  try {
    if (await Admin.exists({})) { console.info('An admin already exists. No changes made.'); return; }
    await Admin.create({ username, passwordHash: await bcrypt.hash(password, 12) });
    console.info('Admin created. Remove ADMIN_INITIAL_PASSWORD from the environment now.');
  } finally { await disconnectDatabase(); }
}
createAdmin().catch(error => { console.error(error instanceof Error ? error.message : 'Admin setup failed'); process.exitCode = 1; });
