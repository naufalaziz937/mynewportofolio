import { useEffect, useState, type ChangeEvent } from 'react';
import { Upload } from 'lucide-react';
import { manageService } from '../../services/manage.service';
import type { UploadedAsset } from '../../types/api';

interface ImageUploaderProps { label: string; value?: string; kind?: 'image' | 'cv'; onUploaded: (asset: UploadedAsset) => void }
export function ImageUploader({ label, value, kind = 'image', onUploaded }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);
  useEffect(() => { setPreview(null); }, [value]);
  const select = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setError('');
    const valid = kind === 'cv' ? file.type === 'application/pdf' && file.size <= 10 * 1024 * 1024 : ['image/png', 'image/jpeg', 'image/webp', 'image/gif'].includes(file.type) && file.size <= 5 * 1024 * 1024;
    if (!valid) { setError(kind === 'cv' ? 'Select a PDF under 10 MB.' : 'Select a PNG, JPG, WebP, or GIF under 5 MB.'); return; }
    setPreview(URL.createObjectURL(file));
    setBusy(true);
    try { onUploaded(await manageService.upload(file, kind)); }
    catch (failure) { setError(failure instanceof Error ? failure.message : 'Upload failed'); }
    finally { setBusy(false); event.target.value = ''; }
  };
  return <div className="manage-upload"><label>{label}<span>{kind === 'cv' ? 'PDF / max 10 MB' : 'PNG, JPG, WebP, GIF / max 5 MB'}</span><input type="file" accept={kind === 'cv' ? 'application/pdf' : 'image/png,image/jpeg,image/webp,image/gif'} onChange={event => { void select(event); }} /><span className="manage-upload-action"><Upload size={15} /> {busy ? 'UPLOADING...' : 'SELECT FILE'}</span></label>{(preview || value) && (kind === 'cv' ? <a href={value || preview || '#'} target="_blank" rel="noreferrer">[ VIEW PDF ]</a> : <img src={preview ?? value} alt={`${label} preview`} />)}{error && <p className="manage-error" role="alert">{error}</p>}</div>;
}
