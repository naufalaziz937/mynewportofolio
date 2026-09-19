import { Router } from 'express';
import multer from 'multer';
import type { Model } from 'mongoose';
import type { z } from 'zod';
import type { ServerConfig } from '../config/env.js';
import { Profile, Project, Skill, Experience, Certificate, SiteSettings, Message } from '../models/index.js';
import { profileSchema, projectSchema, skillSchema, experienceSchema, certificateSchema, settingsSchema } from '../schemas/content.js';
import { asyncRoute, HttpError, validId } from '../middleware/http.js';
import { removeAssets, signBrowserUpload, uploadFile, type UploadKind } from '../services/upload.js';

function assetIds(value: unknown): string[] {
  if (typeof value !== 'object' || value === null) return [];
  const record = value as Record<string, unknown>;
  return [record.thumbnailPublicId, record.profileImagePublicId, record.cvPublicId, record.companyLogoPublicId, record.imagePublicId, ...(Array.isArray(record.galleryPublicIds) ? record.galleryPublicIds : [])].filter((id): id is string => typeof id === 'string' && id.length > 0);
}
function crud<T extends object>(router: Router, path: string, model: Model<T>, schema: z.ZodType<T>, config: ServerConfig): void {
  router.get(`/${path}`, asyncRoute(async (_req, res) => { res.json({ success: true, data: await model.find().sort({ displayOrder: 1, createdAt: -1 }).lean() }); }));
  router.post(`/${path}`, asyncRoute(async (req, res) => { const data = schema.parse(req.body); const created = await model.create(data); res.status(201).json({ success: true, data: created }); }));
  router.put(`/${path}/:id`, asyncRoute(async (req, res) => {
    const data = schema.parse(req.body);
    const previous = await model.findById(validId(req.params.id));
    if (!previous) throw new HttpError(404, 'Resource not found');
    const unset = path === 'projects' && !('year' in data) ? { year: 1 } : path === 'experience' && !('endDate' in data) ? { endDate: 1 } : {};
    const updated = await model.findByIdAndUpdate(previous._id, { $set: data, $unset: unset }, { new: true, runValidators: true });
    const removed = assetIds(previous.toObject()).filter(id => !assetIds(data).includes(id));
    await removeAssets(removed, config);
    res.json({ success: true, data: updated });
  }));
  router.delete(`/${path}/:id`, asyncRoute(async (req, res) => {
    const deleted = await model.findByIdAndDelete(validId(req.params.id));
    if (!deleted) throw new HttpError(404, 'Resource not found');
    await removeAssets(assetIds(deleted.toObject()), config);
    res.json({ success: true, data: { deleted: true } });
  }));
}

export function manageRoutes(config: ServerConfig): Router {
  const router = Router();
  router.get('/overview', asyncRoute(async (_req, res) => {
    const [projects, skills, experience, certificates, messages, unread] = await Promise.all([Project.countDocuments(), Skill.countDocuments(), Experience.countDocuments(), Certificate.countDocuments(), Message.countDocuments(), Message.countDocuments({ read: false })]);
    res.json({ success: true, data: { projects, skills, experience, certificates, messages, unread, api: 'online', database: 'connected', session: 'authenticated' } });
  }));
  router.get('/profile', asyncRoute(async (_req, res) => { res.json({ success: true, data: await Profile.findOne().lean() }); }));
  router.put('/profile', asyncRoute(async (req, res) => {
    const data = profileSchema.parse(req.body);
    const previous = await Profile.findOne();
    const updated = previous ? await Profile.findByIdAndUpdate(previous._id, data, { new: true, runValidators: true }) : await Profile.create(data);
    await SiteSettings.updateOne({}, { $set: { availabilityStatus: data.status } });
    await removeAssets(assetIds(previous?.toObject()).filter(id => !assetIds(data).includes(id)), config);
    res.json({ success: true, data: updated });
  }));
  router.get('/settings', asyncRoute(async (_req, res) => { res.json({ success: true, data: await SiteSettings.findOne().lean() }); }));
  router.put('/settings', asyncRoute(async (req, res) => {
    const data = settingsSchema.parse(req.body);
    const current = await SiteSettings.findOne();
    const updated = current ? await SiteSettings.findByIdAndUpdate(current._id, data, { new: true, runValidators: true }) : await SiteSettings.create(data);
    await Profile.updateOne({}, { $set: { status: data.availabilityStatus } });
    res.json({ success: true, data: updated });
  }));
  crud(router, 'projects', Project, projectSchema, config);
  crud(router, 'skills', Skill, skillSchema, config);
  crud(router, 'experience', Experience, experienceSchema, config);
  crud(router, 'certificates', Certificate, certificateSchema, config);
  router.get('/messages', asyncRoute(async (_req, res) => { res.json({ success: true, data: await Message.find().sort({ createdAt: -1 }).lean() }); }));
  router.patch('/messages/:id/read', asyncRoute(async (req, res) => { const updated = await Message.findByIdAndUpdate(validId(req.params.id), { read: true }, { new: true }); if (!updated) throw new HttpError(404, 'Resource not found'); res.json({ success: true, data: updated }); }));
  router.delete('/messages/:id', asyncRoute(async (req, res) => { const deleted = await Message.findByIdAndDelete(validId(req.params.id)); if (!deleted) throw new HttpError(404, 'Resource not found'); res.json({ success: true, data: { deleted: true } }); }));

  router.post('/uploads/sign', (req, res) => {
    if (req.body?.kind !== 'image' && req.body?.kind !== 'cv') throw new HttpError(400, 'Invalid upload type');
    res.json({ success: true, data: signBrowserUpload(req.body.kind, config) });
  });

  const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024, files: 1 }, fileFilter: (_req, file, callback) => {
    if (!['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'application/pdf'].includes(file.mimetype)) { callback(new HttpError(400, 'Unsupported file type')); return; }
    callback(null, true);
  } });
  router.post('/uploads', upload.single('file'), asyncRoute(async (req, res) => {
    const kind: UploadKind = req.body.kind === 'cv' ? 'cv' : 'image';
    if (!req.file) throw new HttpError(400, 'File is required');
    if (kind === 'image' && (req.file.mimetype === 'application/pdf' || req.file.size > 5 * 1024 * 1024)) throw new HttpError(400, 'Image must be 5 MB or less');
    if (kind === 'cv' && req.file.mimetype !== 'application/pdf') throw new HttpError(400, 'CV must be a PDF');
    res.status(201).json({ success: true, data: await uploadFile(req.file, kind, config) });
  }));
  return router;
}
