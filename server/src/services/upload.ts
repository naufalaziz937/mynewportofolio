import { v2 as cloudinary } from 'cloudinary';
import type { ServerConfig } from '../config/env.js';
import { HttpError } from '../middleware/http.js';

export type UploadKind = 'image' | 'cv';
function verifySignature(buffer: Buffer, kind: UploadKind): boolean {
  const hex = buffer.subarray(0, 12).toString('hex');
  if (kind === 'cv') return buffer.subarray(0, 5).toString() === '%PDF-';
  return hex.startsWith('89504e470d0a1a0a') || hex.startsWith('ffd8ff') || buffer.subarray(0, 6).toString() === 'GIF89a' || buffer.subarray(0, 6).toString() === 'GIF87a' || (buffer.subarray(0, 4).toString() === 'RIFF' && buffer.subarray(8, 12).toString() === 'WEBP');
}
function configure(config: ServerConfig): void {
  if (!config.CLOUDINARY_CLOUD_NAME || !config.CLOUDINARY_API_KEY || !config.CLOUDINARY_API_SECRET) throw new HttpError(503, 'Media storage is not configured');
  cloudinary.config({ cloud_name: config.CLOUDINARY_CLOUD_NAME, api_key: config.CLOUDINARY_API_KEY, api_secret: config.CLOUDINARY_API_SECRET, secure: true });
}
export function signBrowserUpload(kind: UploadKind, config: ServerConfig) {
  configure(config);
  const timestamp = Math.floor(Date.now() / 1000);
  const folder = `portfolio-os/${kind}`;
  const allowedFormats = kind === 'cv' ? 'pdf' : 'jpg,png,webp,gif';
  const parameters = { timestamp, folder, allowed_formats: allowedFormats, overwrite: false };
  return {
    cloudName: config.CLOUDINARY_CLOUD_NAME,
    apiKey: config.CLOUDINARY_API_KEY,
    resourceType: kind === 'cv' ? 'raw' : 'image',
    timestamp,
    folder,
    allowedFormats,
    overwrite: false,
    signature: cloudinary.utils.api_sign_request(parameters, config.CLOUDINARY_API_SECRET!)
  };
}
export async function uploadFile(file: Express.Multer.File, kind: UploadKind, config: ServerConfig): Promise<{ url: string; publicId: string }> {
  if (!verifySignature(file.buffer, kind)) throw new HttpError(400, 'Invalid file format');
  configure(config);
  const result = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder: `portfolio-os/${kind}`, resource_type: kind === 'cv' ? 'raw' : 'image', allowed_formats: kind === 'cv' ? ['pdf'] : ['jpg', 'png', 'webp', 'gif'], overwrite: false }, (error, response) => {
      if (error || !response) reject(error ?? new Error('Upload failed'));
      else resolve(response);
    });
    stream.end(file.buffer);
  });
  return { url: result.secure_url, publicId: result.public_id };
}
export async function removeAssets(ids: string[], config: ServerConfig): Promise<void> {
  if (!ids.length || !config.CLOUDINARY_CLOUD_NAME) return;
  configure(config);
  const safe = [...new Set(ids)].filter(id => /^portfolio-os\/(image|cv)\/[a-zA-Z0-9_.-]+$/.test(id));
  await Promise.allSettled(safe.map(id => cloudinary.uploader.destroy(id, { resource_type: id.includes('/cv/') ? 'raw' : 'image' })));
}
