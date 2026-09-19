import { z } from 'zod';

const text = (max: number) => z.string().trim().min(1).max(max);
const optionalText = (max: number) => z.string().trim().max(max).optional().default('');
const urlValue = z.union([z.string().url().max(1000).refine(value => /^https?:\/\//i.test(value), 'Only HTTP(S) URLs are allowed'), z.literal(''), z.string().regex(/^\/images\/[a-z0-9-]+\.svg$/)]);
const optionalUrl = urlValue.optional().default('');
const list = (max: number) => z.array(text(100)).max(max);
const order = z.number().int().min(0).max(100000);

export const profileSchema = z.object({ name: text(100), username: text(60), role: text(120), location: text(120), status: text(120), heroGreeting: text(120), heroDescription: z.array(text(200)).min(1).max(6), about: text(4000), profileImage: optionalUrl, profileImagePublicId: optionalText(200), email: z.string().email().max(254), github: optionalUrl, instagram: optionalUrl, cvUrl: optionalUrl, cvPublicId: optionalText(200) }).strict();
export const projectSchema = z.object({ name: text(120), slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(120), shortDescription: text(500), overview: optionalText(5000), problem: optionalText(5000), solution: optionalText(5000), challenges: optionalText(5000), result: optionalText(5000), features: list(30), thumbnail: optionalUrl, thumbnailPublicId: optionalText(200), gallery: z.array(urlValue).max(8), galleryPublicIds: z.array(z.string().max(200)).max(8), stack: list(30), status: z.enum(['deployed', 'development', 'archived']), githubUrl: optionalUrl, liveUrl: optionalUrl, featured: z.boolean(), year: z.number().int().min(1990).max(2100).optional(), displayOrder: order }).strict();
export const skillSchema = z.object({ name: text(100), category: z.enum(['frontend', 'backend', 'database', 'tools', 'language']), icon: optionalText(100), displayOrder: order, visible: z.boolean() }).strict();
export const experienceSchema = z.object({ company: text(150), role: text(150), companyLogo: optionalUrl, companyLogoPublicId: optionalText(200), startDate: z.coerce.date(), endDate: z.coerce.date().optional(), current: z.boolean(), description: text(3000), technologies: list(30), displayOrder: order }).strict().refine(value => value.current ? !value.endDate : !!value.endDate, { message: 'End date is required only for past roles' });
export const certificateSchema = z.object({ name: text(200), issuer: text(150), issueDate: z.coerce.date(), image: optionalUrl, imagePublicId: optionalText(200), credentialId: optionalText(200), credentialUrl: optionalUrl, displayOrder: order }).strict();
export const settingsSchema = z.object({ siteTitle: text(120), terminalUsername: text(60), terminalHostname: text(60), systemOS: text(100), footerQuote: text(200), availabilityStatus: text(120), bootEnabled: z.boolean(), sideStreamEnabled: z.boolean(), crtEnabled: z.boolean() }).strict();
export const contactSchema = z.object({ name: text(100), email: z.string().trim().email().max(254), message: text(4000) }).strict();
export const loginSchema = z.object({ password: z.string().min(1).max(200) }).strict();
