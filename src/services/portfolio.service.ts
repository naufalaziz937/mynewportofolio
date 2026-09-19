import { api } from './api';
import type { ProfileRecord, ProjectRecord, SkillRecord, ExperienceRecord, CertificateRecord, SettingsRecord } from '../types/api';
import type { Profile, Project, Skill, Experience, Certificate } from '../types/portfolio';

export const portfolioService = {
  profile: async (): Promise<Profile | null> => { const item = await api<ProfileRecord | null>('/profile'); return item && { name: item.name, username: item.username, role: item.role, location: item.location, status: item.status, heroGreeting: item.heroGreeting, heroDescription: item.heroDescription, biography: item.about, profileImage: item.profileImage, email: item.email, cvUrl: item.cvUrl, socials: [{ id: 'github', label: 'github', href: item.github, type: 'github' }, { id: 'email', label: 'email', href: `mailto:${item.email}`, type: 'email' }, { id: 'instagram', label: 'instagram', href: item.instagram, type: 'instagram' }].filter(link => !!link.href && link.href !== 'mailto:') as Profile['socials'] }; },
  projects: async (): Promise<Project[]> => (await api<ProjectRecord[]>('/projects')).map(item => ({ id: item._id, name: item.name, slug: item.slug, description: item.shortDescription, image: item.thumbnail ?? '', stack: item.stack, status: item.status, github: item.githubUrl, live: item.liveUrl, featured: item.featured, year: item.year, displayOrder: item.displayOrder })),
  project: (slug: string) => api<ProjectRecord>(`/projects/${encodeURIComponent(slug)}`),
  skills: async (): Promise<Skill[]> => (await api<SkillRecord[]>('/skills')).map(item => ({ id: item._id, name: item.name, category: item.category, status: 'installed' })),
  experience: async (): Promise<Experience[]> => (await api<ExperienceRecord[]>('/experience')).map(item => ({ id: item._id, role: item.role, company: item.company, companyLogo: item.companyLogo, startDate: item.startDate, endDate: item.endDate, current: item.current, description: item.description, technologies: item.technologies })),
  certificates: async (): Promise<Certificate[]> => (await api<CertificateRecord[]>('/certificates')).map(item => ({ id: item._id, name: item.name, issuer: item.issuer, issueDate: item.issueDate, image: item.image ?? '', credentialId: item.credentialId, credentialUrl: item.credentialUrl })),
  settings: () => api<SettingsRecord | null>('/settings'),
  contact: (data: { name: string; email: string; message: string }) => api<{ id: string }>('/contact', { method: 'POST', body: JSON.stringify(data) })
};
