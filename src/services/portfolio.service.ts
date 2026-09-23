import { api } from './api';
import type { ProfileRecord, ProjectRecord, SkillRecord, ExperienceRecord, CertificateRecord, PersonalItemRecord, SettingsRecord, PortfolioBootstrapRecord } from '../types/api';
import type { Profile, Project, Skill, Experience, Certificate, PersonalItem } from '../types/portfolio';

const mapProfile = (item: ProfileRecord | null): Profile | null => item && ({ name: item.name, username: item.username, role: item.role, location: item.location, status: item.status, heroGreeting: item.heroGreeting, heroDescription: item.heroDescription, biography: item.about, profileImage: item.profileImage, email: item.email, cvUrl: item.cvUrl, socials: [{ id: 'github', label: 'github', href: item.github, type: 'github' }, { id: 'email', label: 'email', href: `mailto:${item.email}`, type: 'email' }, { id: 'instagram', label: 'instagram', href: item.instagram, type: 'instagram' }].filter(link => !!link.href && link.href !== 'mailto:') as Profile['socials'] });
const mapProjects = (items: ProjectRecord[]): Project[] => items.map(item => ({ id: item._id, name: item.name, slug: item.slug, description: item.shortDescription, image: item.thumbnail ?? '', stack: item.stack, status: item.status, github: item.githubUrl, live: item.liveUrl, featured: item.featured, year: item.year, displayOrder: item.displayOrder }));
const mapSkills = (items: SkillRecord[]): Skill[] => items.map(item => ({ id: item._id, name: item.name, category: item.category, status: 'installed' }));
const mapExperience = (items: ExperienceRecord[]): Experience[] => items.map(item => ({ id: item._id, role: item.role, company: item.company, companyLogo: item.companyLogo, startDate: item.startDate, endDate: item.endDate, current: item.current, description: item.description, technologies: item.technologies }));
const mapCertificates = (items: CertificateRecord[]): Certificate[] => items.map(item => ({ id: item._id, name: item.name, issuer: item.issuer, issueDate: item.issueDate, image: item.image ?? '', credentialId: item.credentialId, credentialUrl: item.credentialUrl }));
const mapPersonal = (items: PersonalItemRecord[]): PersonalItem[] => items.map((item, index) => ({ id: item._id, category: item.category, title: item.title, description: item.description ?? '', image: item.image ?? '', imageAlt: item.imageAlt ?? '', label: item.label ?? '', icon: item.icon ?? '', status: item.status ?? '', url: item.url ?? '', completed: item.completed, size: item.size || (['large', 'small', 'tall', 'wide', 'small', 'wide'] as const)[index % 6], displayMode: item.displayMode || (item.image ? 'visual' : 'text'), order: item.order ?? index }));

export const portfolioService = {
  bootstrap: async () => { const data = await api<PortfolioBootstrapRecord>('/portfolio'); return { profile: mapProfile(data.profile), projects: mapProjects(data.projects), skills: mapSkills(data.skills), experience: mapExperience(data.experience), certificates: mapCertificates(data.certificates), personal: mapPersonal(data.personal), settings: data.settings }; },
  profile: async (): Promise<Profile | null> => mapProfile(await api<ProfileRecord | null>('/profile')),
  projects: async (): Promise<Project[]> => mapProjects(await api<ProjectRecord[]>('/projects')),
  project: (slug: string) => api<ProjectRecord>(`/projects/${encodeURIComponent(slug)}`),
  skills: async (): Promise<Skill[]> => mapSkills(await api<SkillRecord[]>('/skills')),
  experience: async (): Promise<Experience[]> => mapExperience(await api<ExperienceRecord[]>('/experience')),
  certificates: async (): Promise<Certificate[]> => mapCertificates(await api<CertificateRecord[]>('/certificates')),
  personal: async (): Promise<PersonalItem[]> => mapPersonal(await api<PersonalItemRecord[]>('/personal')),
  settings: () => api<SettingsRecord | null>('/settings'),
  contact: (data: { name: string; email: string; message: string }) => api<{ id: string }>('/contact', { method: 'POST', body: JSON.stringify(data) })
};
