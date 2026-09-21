import type { SkillCategory, SiteSettings } from './portfolio';
import type { PersonalCategory, PersonalCardSize, PersonalDisplayMode } from '../data/personalCategories';
export interface ApiResponse<T> { success: boolean; data: T; message?: string }
export interface ApiError { success: false; message: string; issues?: { path: string; message: string }[] }
export interface DbRecord { _id: string; createdAt?: string; updatedAt?: string }
export interface ProfileRecord extends DbRecord { name: string; username: string; role: string; location: string; status: string; heroGreeting: string; heroDescription: string[]; about: string; profileImage?: string; profileImagePublicId?: string; email: string; github: string; instagram: string; cvUrl?: string; cvPublicId?: string }
export interface ProjectRecord extends DbRecord { name: string; slug: string; shortDescription: string; overview?: string; problem?: string; solution?: string; challenges?: string; result?: string; features: string[]; thumbnail?: string; thumbnailPublicId?: string; gallery: string[]; galleryPublicIds: string[]; stack: string[]; status: 'deployed' | 'development' | 'archived'; githubUrl?: string; liveUrl?: string; featured: boolean; year?: number; displayOrder: number }
export interface SkillRecord extends DbRecord { name: string; category: SkillCategory; icon?: string; displayOrder: number; visible: boolean }
export interface ExperienceRecord extends DbRecord { company: string; role: string; companyLogo?: string; companyLogoPublicId?: string; startDate: string; endDate?: string; current: boolean; description: string; technologies: string[]; displayOrder: number }
export interface CertificateRecord extends DbRecord { name: string; issuer: string; issueDate: string; image?: string; imagePublicId?: string; credentialId?: string; credentialUrl?: string; displayOrder: number }
export interface PersonalItemRecord extends DbRecord { category: PersonalCategory; title: string; description?: string; image?: string; imagePublicId?: string; imageAlt?: string; label?: string; icon?: string; status?: string; url?: string; completed: boolean; size: PersonalCardSize; displayMode: PersonalDisplayMode; order: number; visible: boolean }
export interface SettingsRecord extends DbRecord, SiteSettings {}
export interface MessageRecord extends DbRecord { name: string; email: string; message: string; read: boolean }
export interface Overview { projects: number; skills: number; experience: number; certificates: number; messages: number; unread: number; api: string; database: string; session: string }
export interface UploadedAsset { url: string; publicId: string }
