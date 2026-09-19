import { useEffect, useState, type FormEvent } from 'react';
import { manageService } from '../../services/manage.service';
import type { ProfileRecord } from '../../types/api';
import { FormField, TextField } from '../../components/manage/FormField';
import { ImageUploader } from '../../components/manage/ImageUploader';
import { usePortfolio } from '../../context/PortfolioContext';

type ProfileInput = Omit<ProfileRecord, '_id' | 'createdAt' | 'updatedAt'>;
const blank: ProfileInput = { name: '', username: '', role: '', location: '', status: '', heroGreeting: '', heroDescription: [''], about: '', email: '', github: '', instagram: '', profileImage: '', profileImagePublicId: '', cvUrl: '', cvPublicId: '' };
const fromRecord = (record: ProfileRecord): ProfileInput => ({ name: record.name, username: record.username, role: record.role, location: record.location, status: record.status, heroGreeting: record.heroGreeting, heroDescription: record.heroDescription, about: record.about, email: record.email, github: record.github ?? '', instagram: record.instagram ?? '', profileImage: record.profileImage ?? '', profileImagePublicId: record.profileImagePublicId ?? '', cvUrl: record.cvUrl ?? '', cvPublicId: record.cvPublicId ?? '' });
export function ManageProfile() {
  const { retry } = usePortfolio();
  const [form, setForm] = useState<ProfileInput>(blank);
  const [original, setOriginal] = useState<ProfileInput>(blank);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');
  useEffect(() => { manageService.profile().then(item => { if (item) { setForm(fromRecord(item)); setOriginal(fromRecord(item)); } }).catch(failure => setError(failure instanceof Error ? failure.message : 'Unable to load profile')).finally(() => setLoading(false)); }, []);
  const set = (field: keyof ProfileInput, value: string) => setForm(current => ({ ...current, [field]: value }));
  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setSaving(true); setError(''); setFeedback('');
    try { const result = await manageService.saveProfile(form); setOriginal(fromRecord(result)); setForm(fromRecord(result)); setFeedback('PROFILE SAVED. Public content is updated.'); retry(); }
    catch (failure) { setError(failure instanceof Error ? failure.message : 'Save failed'); }
    finally { setSaving(false); }
  };
  return <div className="manage-page"><div className="manage-heading"><span>&gt; edit ./profile</span><h1>PROFILE<span>_</span></h1><p>Identity, hero, biography, and contact links.</p></div>{loading ? <div className="manage-loading">FETCHING_PROFILE...</div> : <form className="manage-panel manage-form" onSubmit={event => { void save(event); }}><h2>/identity</h2><div className="manage-form-grid"><TextField label="Name" value={form.name} onChange={event => set('name', event.target.value)} required /><TextField label="Username" value={form.username} onChange={event => set('username', event.target.value)} required /><TextField label="Role" value={form.role} onChange={event => set('role', event.target.value)} required /><TextField label="Location" value={form.location} onChange={event => set('location', event.target.value)} required /><TextField label="Availability Status" value={form.status} onChange={event => set('status', event.target.value)} required /><TextField label="Hero Greeting" value={form.heroGreeting} onChange={event => set('heroGreeting', event.target.value)} required /></div><FormField label="Hero Description" hint="One line per sentence"><textarea rows={3} value={form.heroDescription.join('\n')} onChange={event => setForm(current => ({ ...current, heroDescription: event.target.value.split('\n') }))} required /></FormField><FormField label="About"><textarea rows={7} value={form.about} onChange={event => set('about', event.target.value)} required /></FormField><h2>/links_and_media</h2><div className="manage-form-grid"><TextField label="Email" type="email" value={form.email} onChange={event => set('email', event.target.value)} required /><TextField label="GitHub URL" type="url" value={form.github} onChange={event => set('github', event.target.value)} /><TextField label="Instagram URL" type="url" value={form.instagram} onChange={event => set('instagram', event.target.value)} /><TextField label="CV URL" value={form.cvUrl ?? ''} onChange={event => set('cvUrl', event.target.value)} /></div><div className="manage-form-grid"><ImageUploader label="Profile image" value={form.profileImage} onUploaded={asset => setForm(current => ({ ...current, profileImage: asset.url, profileImagePublicId: asset.publicId }))} /><ImageUploader label="CV document" kind="cv" value={form.cvUrl} onUploaded={asset => setForm(current => ({ ...current, cvUrl: asset.url, cvPublicId: asset.publicId }))} /></div>{error && <p className="manage-error" role="alert">ERR_SAVE: {error}</p>}{feedback && <p className="manage-success" role="status">{feedback}</p>}<div className="manage-actions"><button type="button" onClick={() => { setForm(original); setError(''); setFeedback(''); }}>[ RESET ]</button><button className="primary" disabled={saving} type="submit">{saving ? '[ SAVING... ]' : '[ SAVE CHANGES ]'}</button></div></form>}</div>;
}
