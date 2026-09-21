import type { PersonalCategory, PersonalCardSize, PersonalDisplayMode } from '../data/personalCategories';
export type SectionId = 'home' | 'about' | 'personal' | 'projects' | 'skills' | 'experience' | 'certificates' | 'contact';
export interface NavigationItem { label: string; sectionId: SectionId; command?: string }
export interface SocialLink { id: string; label: string; href: string; type: 'github' | 'email' | 'instagram' }
export interface Profile { name: string; username: string; role: string; location: string; status: string; heroGreeting: string; heroDescription: string[]; biography: string; profileImage?: string; email: string; cvUrl?: string; socials: SocialLink[] }
export interface Project { id: string; name: string; slug: string; description: string; image: string; stack: string[]; status: 'deployed' | 'development' | 'archived'; github?: string; live?: string; featured: boolean; year?: number; displayOrder: number }
export type SkillCategory = 'frontend' | 'backend' | 'database' | 'tools' | 'language';
export interface Skill { id: string; name: string; category: SkillCategory; status: 'installed' }
export interface Experience { id: string; role: string; company: string; companyLogo?: string; startDate: string; endDate?: string; current: boolean; description: string; technologies: string[] }
export interface Certificate { id: string; name: string; issuer: string; issueDate: string; image: string; credentialId?: string; credentialUrl?: string }
export interface PersonalItem { id: string; category: PersonalCategory; title: string; description: string; image: string; imageAlt: string; label: string; icon: string; status: string; url: string; completed: boolean; size: PersonalCardSize; displayMode: PersonalDisplayMode; order: number }
export interface SystemStatus { os: string; user: string; role: string; location: string; status: string }
export interface SiteSettings { siteTitle: string; terminalUsername: string; terminalHostname: string; systemOS: string; footerQuote: string; availabilityStatus: string; bootEnabled: boolean; sideStreamEnabled: boolean; crtEnabled: boolean }
