import { createServer } from 'node:http';
import { randomBytes } from 'node:crypto';
import bcrypt from 'bcryptjs';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createApp } from '../src/app.js';
import { connectDatabase, disconnectDatabase } from '../src/config/db.js';
import type { ServerConfig } from '../src/config/env.js';
import { Admin, Profile, Project, Skill, Experience, PersonalItem, SiteSettings } from '../src/models/index.js';

async function main(): Promise<void> {
  const password = process.env.UI_TEST_PASSWORD;
  if (!password || password.length < 12) throw new Error('Set a disposable UI_TEST_PASSWORD of at least 12 characters for the local test server.');
  if (process.env.NODE_ENV === 'production') throw new Error('The UI test server cannot run in production.');
  const mongo = await MongoMemoryServer.create();
  const config: ServerConfig = { NODE_ENV: 'test', PORT: Number(process.env.UI_TEST_PORT || 3000), MONGODB_URI: mongo.getUri(), CLIENT_URL: 'http://localhost:5173', CLIENT_URLS: 'http://127.0.0.1:5173', AUTH_SECRET: randomBytes(48).toString('hex'), TRUST_PROXY: 0, COOKIE_SAME_SITE: 'lax' };
  await connectDatabase(config.MONGODB_URI);
  await Admin.create({ username: 'test-owner', passwordHash: await bcrypt.hash(password, 12) });
  await Profile.create({ name: 'Example Developer', username: 'example', role: 'Full-Stack Developer', location: 'Indonesia', status: 'Available', heroGreeting: "Hi, I'm", heroDescription: ['Building modern web applications.', 'Turning ideas into real-world solutions.', 'Always learning, always improving.'], about: 'I build practical web experiences from the interface to the server. I care about clear architecture, thoughtful details, and software that people enjoy using.', email: 'hello@example.com', github: 'https://github.com/', instagram: 'https://instagram.com/' });
  await Project.create({ name: 'MatrIQ', slug: 'matriq', shortDescription: 'A focused workspace for UTBK preparation and progress tracking.', thumbnail: '/images/matriq.svg', features: ['Track progress'], gallery: [], galleryPublicIds: [], stack: ['React', 'TypeScript'], status: 'development', featured: true, displayOrder: 0 });
  await Skill.create({ name: 'React', category: 'frontend', visible: true, displayOrder: 0 });
  await Experience.create({ role: 'Independent Developer', company: 'Personal projects', startDate: new Date('2025-01-01'), current: true, description: 'Building and refining web applications.', technologies: ['React'], displayOrder: 0 });
  await PersonalItem.insertMany([
    { category: 'hobbies', title: 'Demo visual large', description: 'Disposable visual test card.', image: '/images/portfolio.svg', imageAlt: 'Abstract demo portfolio illustration', label: 'Demo', completed: false, size: 'large', displayMode: 'visual', order: 0, visible: true },
    { category: 'hobbies', title: 'Demo small', label: 'Demo', completed: false, size: 'small', displayMode: 'text', order: 1, visible: true },
    { category: 'hobbies', title: 'Demo tall', description: 'Disposable tall test card.', label: 'Demo', completed: false, size: 'tall', displayMode: 'text', order: 2, visible: true },
    { category: 'hobbies', title: 'Demo wide', description: 'Disposable wide test card.', label: 'Demo', completed: false, size: 'wide', displayMode: 'text', order: 3, visible: true },
    { category: 'hobbies', title: 'Demo visual small', image: '/images/matriq.svg', imageAlt: 'Abstract demo project illustration', label: 'Demo', completed: false, size: 'small', displayMode: 'visual', order: 4, visible: true },
    { category: 'dream-garage', title: 'Demo category item', description: 'Disposable category switch test.', completed: false, size: 'wide', displayMode: 'text', order: 0, visible: true }
  ]);
  await SiteSettings.create({ siteTitle: 'Example Developer // portfolioOS', terminalUsername: 'example', terminalHostname: 'portfolio', systemOS: 'portfolioOS', footerQuote: 'Discipline compiles dreams.', availabilityStatus: 'Available', bootEnabled: false, sideStreamEnabled: true, crtEnabled: true });
  const server = createServer(createApp(config));
  server.listen(config.PORT, () => console.info(`Local UI test API ready on port ${config.PORT}. Data and credentials are disposable.`));
  const stop = () => { server.close(() => { disconnectDatabase().then(() => mongo.stop()).finally(() => process.exit(0)); }); };
  process.on('SIGINT', stop);
  process.on('SIGTERM', stop);
}
main().catch(error => { console.error(error instanceof Error ? error.message : 'UI test server failed'); process.exitCode = 1; });

