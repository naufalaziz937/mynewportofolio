import type { NavigationItem, SiteSettings } from '../types/portfolio';

export const navigation: NavigationItem[] = [
  { label: 'home', sectionId: 'home', command: 'whoami' },
  { label: 'about', sectionId: 'about' },
  { label: 'personal', sectionId: 'personal' },
  { label: 'projects', sectionId: 'projects' },
  { label: 'skills', sectionId: 'skills' },
  { label: 'experience', sectionId: 'experience' },
  { label: 'certificates', sectionId: 'certificates' },
  { label: 'contact', sectionId: 'contact' }
];

// Blank values initialize the CMS form only when no settings record exists.
export const defaultSettings: SiteSettings = { siteTitle: '', terminalUsername: '', terminalHostname: '', systemOS: '', footerQuote: '', availabilityStatus: '', bootEnabled: false, sideStreamEnabled: false, crtEnabled: false };
