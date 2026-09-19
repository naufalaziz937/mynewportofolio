import { createServer } from 'node:http';
import { randomBytes } from 'node:crypto';
import bcrypt from 'bcryptjs';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createApp } from '../src/app.js';
import { connectDatabase, disconnectDatabase } from '../src/config/db.js';
import type { ServerConfig } from '../src/config/env.js';
import { Admin, Profile, Project, Skill, Experience, SiteSettings } from '../src/models/index.js';

async function main(): Promise<void> {
  const password = process.env.UI_TEST_PASSWORD;
  if (!password || password.length < 12) throw new Error('Set a disposable UI_TEST_PASSWORD of at least 12 characters for the local test server.');
  if (process.env.NODE_ENV === 'production') throw new Error('The UI test server cannot run in production.');
  const mongo = await MongoMemoryServer.create();
  const config: ServerConfig = { NODE_ENV: 'test', PORT: 3000, MONGODB_URI: mongo.getUri(), CLIENT_URL: 'http://localhost:5173', AUTH_SECRET: randomBytes(48).toString('hex'), TRUST_PROXY: 0, COOKIE_SAME_SITE: 'lax' };
  await connectDatabase(config.MONGODB_URI);
  await Admin.create({ username: 'test-owner', passwordHash: await bcrypt.hash(password, 12) });
  await Profile.create({ name: 'Davy', username: 'davy', role: 'Full-Stack Developer', location: 'Indonesia', status: 'Available', heroGreeting: "Hi, I'm", heroDescription: ['Building modern web applications.', 'Turning ideas into real-world solutions.', 'Always learning, always improving.'], about: 'I build practical web experiences from the interface to the server. I care about clear architecture, thoughtful details, and software that people enjoy using.', email: 'hello@example.com', github: 'https://github.com/', instagram: 'https://instagram.com/' });
  await Project.create({ name: 'MatrIQ', slug: 'matriq', shortDescription: 'A focused workspace for UTBK preparation and progress tracking.', thumbnail: '/images/matriq.svg', features: ['Track progress'], gallery: [], galleryPublicIds: [], stack: ['React', 'TypeScript'], status: 'development', featured: true, displayOrder: 0 });
  await Skill.create({ name: 'React', category: 'frontend', visible: true, displayOrder: 0 });
  await Experience.create({ role: 'Independent Developer', company: 'Personal projects', startDate: new Date('2025-01-01'), current: true, description: 'Building and refining web applications.', technologies: ['React'], displayOrder: 0 });
  await SiteSettings.create({ siteTitle: 'Davy // portfolioOS', terminalUsername: 'davy', terminalHostname: 'portfolio', systemOS: 'portfolioOS', footerQuote: 'Discipline compiles dreams.', availabilityStatus: 'Available', bootEnabled: false, sideStreamEnabled: true, crtEnabled: true });
  const server = createServer(createApp(config));
  server.listen(config.PORT, () => console.info('Local UI test API ready on port 3000. Data and credentials are disposable.'));
  const stop = () => { server.close(() => { disconnectDatabase().then(() => mongo.stop()).finally(() => process.exit(0)); }); };
  process.on('SIGINT', stop);
  process.on('SIGTERM', stop);
}
main().catch(error => { console.error(error instanceof Error ? error.message : 'UI test server failed'); process.exitCode = 1; });
