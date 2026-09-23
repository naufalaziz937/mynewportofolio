import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { Profile, Project, Skill, Experience, Certificate, PersonalItem, SiteSettings, Message } from '../models/index.js';
import { contactSchema, personalCategorySchema } from '../schemas/content.js';
import { asyncRoute, HttpError } from '../middleware/http.js';

export function publicRoutes(): Router {
  const router = Router();
  router.get('/profile', asyncRoute(async (_req, res) => { const data = await Profile.findOne().select('-profileImagePublicId -cvPublicId').lean(); res.json({ success: true, data }); }));
  router.get('/projects', asyncRoute(async (_req, res) => { const data = await Project.find().select('-thumbnailPublicId -galleryPublicIds').sort({ displayOrder: 1, createdAt: -1 }).lean(); res.json({ success: true, data }); }));
  router.get('/projects/:slug', asyncRoute(async (req, res) => { const data = await Project.findOne({ slug: req.params.slug }).select('-thumbnailPublicId -galleryPublicIds').lean(); if (!data) throw new HttpError(404, 'Resource not found'); res.json({ success: true, data }); }));
  router.get('/skills', asyncRoute(async (_req, res) => { const data = await Skill.find({ visible: true }).sort({ displayOrder: 1 }).lean(); res.json({ success: true, data }); }));
  router.get('/experience', asyncRoute(async (_req, res) => { const data = await Experience.find().select('-companyLogoPublicId').sort({ displayOrder: 1, startDate: -1 }).lean(); res.json({ success: true, data }); }));
  router.get('/certificates', asyncRoute(async (_req, res) => { const data = await Certificate.find().select('-imagePublicId').sort({ displayOrder: 1, issueDate: -1 }).lean(); res.json({ success: true, data }); }));
  router.get('/personal', asyncRoute(async (req, res) => {
    const category = req.query.category === undefined ? undefined : personalCategorySchema.parse(req.query.category);
    const data = await PersonalItem.find({ visible: true, ...(category ? { category } : {}) }).select('-imagePublicId').sort({ order: 1, createdAt: -1 }).lean();
    res.json({ success: true, data });
  }));
  router.get('/settings', asyncRoute(async (_req, res) => { const data = await SiteSettings.findOne().lean(); res.json({ success: true, data }); }));
  router.post('/contact', rateLimit({ windowMs: 60 * 60 * 1000, limit: 5, standardHeaders: 'draft-7', legacyHeaders: false, message: { success: false, message: 'Too many messages. Try again later.' } }), asyncRoute(async (req, res) => {
    const input = contactSchema.parse(req.body);
    const message = await Message.create({ ...input, read: false });
    res.status(201).json({ success: true, data: { id: message.id } });
  }));
  return router;
}
