import { api } from './api';
import type { ProfileRecord, ProjectRecord, SkillRecord, ExperienceRecord, CertificateRecord, SettingsRecord, MessageRecord, Overview, UploadedAsset } from '../types/api';

export type ResourceName = 'projects' | 'skills' | 'experience' | 'certificates';
export type ResourceRecord = ProjectRecord | SkillRecord | ExperienceRecord | CertificateRecord;
export const manageService = {
  overview: () => api<Overview>('/manage/overview'),
  profile: () => api<ProfileRecord | null>('/manage/profile'),
  saveProfile: (data: Omit<ProfileRecord, '_id' | 'createdAt' | 'updatedAt'>) => api<ProfileRecord>('/manage/profile', { method: 'PUT', body: JSON.stringify(data) }),
  settings: () => api<SettingsRecord | null>('/manage/settings'),
  saveSettings: (data: Omit<SettingsRecord, '_id' | 'createdAt' | 'updatedAt'>) => api<SettingsRecord>('/manage/settings', { method: 'PUT', body: JSON.stringify(data) }),
  list: <T extends ResourceRecord>(resource: ResourceName) => api<T[]>(`/manage/${resource}`),
  create: <T extends ResourceRecord>(resource: ResourceName, data: object) => api<T>(`/manage/${resource}`, { method: 'POST', body: JSON.stringify(data) }),
  update: <T extends ResourceRecord>(resource: ResourceName, id: string, data: object) => api<T>(`/manage/${resource}/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (resource: ResourceName, id: string) => api<{ deleted: boolean }>(`/manage/${resource}/${id}`, { method: 'DELETE' }),
  messages: () => api<MessageRecord[]>('/manage/messages'),
  markRead: (id: string) => api<MessageRecord>(`/manage/messages/${id}/read`, { method: 'PATCH' }),
  removeMessage: (id: string) => api<{ deleted: boolean }>(`/manage/messages/${id}`, { method: 'DELETE' }),
  upload: async (file: File, kind: 'image' | 'cv'): Promise<UploadedAsset> => {
    const signed = await api<{ cloudName: string; apiKey: string; resourceType: string; timestamp: number; folder: string; allowedFormats: string; signature: string; overwrite: boolean }>('/manage/uploads/sign', { method: 'POST', body: JSON.stringify({ kind }) });
    const form = new FormData();
    form.append('file', file);
    form.append('api_key', signed.apiKey);
    form.append('timestamp', String(signed.timestamp));
    form.append('folder', signed.folder);
    form.append('allowed_formats', signed.allowedFormats);
    form.append('overwrite', String(signed.overwrite));
    form.append('signature', signed.signature);
    const response = await fetch(`https://api.cloudinary.com/v1_1/${encodeURIComponent(signed.cloudName)}/${signed.resourceType}/upload`, { method: 'POST', body: form });
    const result = await response.json() as { secure_url?: string; public_id?: string; error?: { message?: string } };
    if (!response.ok || !result.secure_url || !result.public_id) throw new Error(result.error?.message || 'Upload failed');
    if (!result.public_id.startsWith(`${signed.folder}/`)) throw new Error('Unexpected upload destination');
    return { url: result.secure_url, publicId: result.public_id };
  }
};
