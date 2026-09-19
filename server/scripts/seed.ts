import { getConfig } from '../src/config/env.js';
import { connectDatabase, disconnectDatabase } from '../src/config/db.js';
import { Profile, Project, Skill, Experience, Certificate, SiteSettings } from '../src/models/index.js';

async function seed(): Promise<void> {
  const config = getConfig();
  await connectDatabase(config.MONGODB_URI);
  try {
    if (await Profile.countDocuments() === 0) await Profile.create({ name: 'Davy', username: 'davy', role: 'Full-Stack Developer', location: 'Indonesia', status: 'Available', heroGreeting: "Hi, I'm", heroDescription: ['Building modern web applications.', 'Turning ideas into real-world solutions.', 'Always learning, always improving.'], about: 'I build practical web experiences from the interface to the server. I care about clear architecture, thoughtful details, and software that people enjoy using. Every project is a chance to learn, iterate, and ship something better.', email: 'hello@example.com', github: 'https://github.com/', instagram: 'https://instagram.com/' });
    if (await Project.countDocuments() === 0) await Project.insertMany([
      { name: 'MatrIQ', slug: 'matriq', shortDescription: 'A focused workspace for UTBK preparation, progress tracking, and better study habits.', thumbnail: '/images/matriq.svg', gallery: [], galleryPublicIds: [], features: [], stack: ['React', 'TypeScript', 'Node.js', 'MongoDB'], status: 'development', featured: true, displayOrder: 0 },
      { name: 'PortfoliOS', slug: 'portfolio-os', shortDescription: 'A developer portfolio shaped like a tiny terminal operating system.', thumbnail: '/images/portfolio.svg', gallery: [], galleryPublicIds: [], features: [], stack: ['React', 'TypeScript', 'Canvas', 'Tailwind'], status: 'development', featured: true, displayOrder: 1 },
      { name: 'Signal Notes', slug: 'signal-notes', shortDescription: 'A minimal concept for capturing ideas and turning them into an organized workflow.', thumbnail: '/images/notes.svg', gallery: [], galleryPublicIds: [], features: [], stack: ['React', 'TypeScript', 'UI Design'], status: 'archived', featured: false, displayOrder: 2 }
    ]);
    if (await Skill.countDocuments() === 0) await Skill.insertMany(['React:frontend', 'TypeScript:language', 'Tailwind CSS:frontend', 'Node.js:backend', 'Express:backend', 'MongoDB:database', 'Git:tools'].map((entry, index) => { const [name, category] = entry.split(':'); return { name, category, visible: true, displayOrder: index }; }));
    if (await Experience.countDocuments() === 0) await Experience.insertMany([
      { role: 'Independent Developer', company: 'Personal projects', startDate: new Date('2025-01-01'), current: true, description: 'Designing and building web products, from early ideas to functional interfaces and full-stack prototypes.', technologies: ['React', 'TypeScript', 'Node.js'], displayOrder: 0 },
      { role: 'Developer in Practice', company: 'Continuous learning', startDate: new Date('2024-01-01'), endDate: new Date('2025-01-01'), current: false, description: 'Building a foundation in modern web development through hands-on projects and iteration.', technologies: ['JavaScript', 'Git', 'CSS'], displayOrder: 1 }
    ]);
    if (await Certificate.countDocuments() === 0) console.info('No existing certificates to seed.');
    if (await SiteSettings.countDocuments() === 0) await SiteSettings.create({ siteTitle: 'Davy // portfolioOS', terminalUsername: 'davy', terminalHostname: 'portfolio', systemOS: 'portfolioOS', footerQuote: 'Discipline compiles dreams.', availabilityStatus: 'Available', bootEnabled: true, sideStreamEnabled: true, crtEnabled: true });
    console.info('Missing collections initialized; existing documents were not overwritten.');
  } finally { await disconnectDatabase(); }
}
seed().catch(error => { console.error(error instanceof Error ? error.message : 'Seed failed'); process.exitCode = 1; });
