import type { NavigationItem, Profile, SystemStatus } from '../types/portfolio';

export const navigation: NavigationItem[] = [
  { label: 'home', sectionId: 'home', command: 'whoami' },
  { label: 'about', sectionId: 'about' },
  { label: 'projects', sectionId: 'projects' },
  { label: 'skills', sectionId: 'skills' },
  { label: 'experience', sectionId: 'experience' },
  { label: 'certificates', sectionId: 'certificates' },
  { label: 'contact', sectionId: 'contact' }
];

export const profile: Profile = {
  name: 'Davy', username: 'davy', role: 'Full-Stack Developer', location: 'Indonesia', status: 'Available', heroGreeting: "Hi, I'm", heroDescription: ['Building modern web applications.', 'Turning ideas into real-world solutions.', 'Always learning, always improving.'],
  biography: 'I build practical web experiences from the interface to the server. I care about clear architecture, thoughtful details, and software that people enjoy using. Every project is a chance to learn, iterate, and ship something better.',
  email: 'hello@example.com',
  socials: [
    { id: 'github', label: 'github', href: 'https://github.com/', type: 'github' },
    { id: 'email', label: 'email', href: 'mailto:hello@example.com', type: 'email' },
    { id: 'instagram', label: 'instagram', href: 'https://instagram.com/', type: 'instagram' }
  ]
};

export const systemStatus: SystemStatus = { os: 'portfolioOS', user: profile.name, role: profile.role, location: profile.location, status: profile.status };
export const defaultSettings = { siteTitle: 'Davy // portfolioOS', terminalUsername: 'davy', terminalHostname: 'portfolio', systemOS: 'portfolioOS', footerQuote: 'Discipline compiles dreams.', availabilityStatus: 'Available', bootEnabled: true, sideStreamEnabled: true, crtEnabled: true };
