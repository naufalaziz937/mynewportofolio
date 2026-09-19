import { useEffect, useState, type FormEvent } from 'react';
import { manageService, type ResourceName, type ResourceRecord } from '../../services/manage.service';
import { FormField, TextField } from '../../components/manage/FormField';
import { ListEditor } from '../../components/manage/ListEditor';
import { ImageUploader } from '../../components/manage/ImageUploader';
import { DeleteConfirmation } from '../../components/manage/DeleteConfirmation';
import { usePortfolio } from '../../context/PortfolioContext';

type FieldValue = string | number | boolean | string[];
type Draft = Record<string, FieldValue>;
const defaults: Record<ResourceName, Draft> = {
  projects: { name: '', slug: '', shortDescription: '', overview: '', problem: '', solution: '', challenges: '', result: '', features: [], thumbnail: '', thumbnailPublicId: '', gallery: [], galleryPublicIds: [], stack: [], status: 'development', githubUrl: '', liveUrl: '', featured: false, year: '', displayOrder: 0 },
  skills: { name: '', category: 'frontend', icon: '', visible: true, displayOrder: 0 },
  experience: { company: '', role: '', companyLogo: '', companyLogoPublicId: '', startDate: '', endDate: '', current: false, description: '', technologies: [], displayOrder: 0 },
  certificates: { name: '', issuer: '', issueDate: '', image: '', imagePublicId: '', credentialId: '', credentialUrl: '', displayOrder: 0 }
};
function toDraft(resource: ResourceName, record: ResourceRecord | null): Draft {
  const values: Draft = { ...defaults[resource] };
  if (record) for (const [key, value] of Object.entries(record)) {
    if (typeof value === 'string') values[key] = key.endsWith('Date') ? value.slice(0, 10) : value;
    if (typeof value === 'number' || typeof value === 'boolean') values[key] = value;
    if (Array.isArray(value) && value.every(item => typeof item === 'string')) values[key] = value;
  }
  return values;
}
function payload(resource: ResourceName, draft: Draft): object {
  const text = (key: string): string => String(draft[key] ?? '').trim();
  const list = (key: string): string[] => (Array.isArray(draft[key]) ? draft[key] as string[] : []).map(item => item.trim()).filter(Boolean);
  const order = Number(draft.displayOrder) || 0;
  if (resource === 'projects') return { name: text('name'), slug: text('slug'), shortDescription: text('shortDescription'), overview: text('overview'), problem: text('problem'), solution: text('solution'), challenges: text('challenges'), result: text('result'), features: list('features'), thumbnail: text('thumbnail'), thumbnailPublicId: text('thumbnailPublicId'), gallery: list('gallery'), galleryPublicIds: list('galleryPublicIds'), stack: list('stack'), status: text('status'), githubUrl: text('githubUrl'), liveUrl: text('liveUrl'), featured: Boolean(draft.featured), ...(text('year') ? { year: Number(draft.year) } : {}), displayOrder: order };
  if (resource === 'skills') return { name: text('name'), category: text('category'), icon: text('icon'), visible: Boolean(draft.visible), displayOrder: order };
  if (resource === 'experience') return { company: text('company'), role: text('role'), companyLogo: text('companyLogo'), companyLogoPublicId: text('companyLogoPublicId'), startDate: text('startDate'), ...(!draft.current && text('endDate') ? { endDate: text('endDate') } : {}), current: Boolean(draft.current), description: text('description'), technologies: list('technologies'), displayOrder: order };
  return { name: text('name'), issuer: text('issuer'), issueDate: text('issueDate'), image: text('image'), imagePublicId: text('imagePublicId'), credentialId: text('credentialId'), credentialUrl: text('credentialUrl'), displayOrder: order };
}

interface ResourceFormProps { resource: ResourceName; record: ResourceRecord | null; onSave: (data: object) => Promise<void>; onCancel: () => void }
function ResourceForm({ resource, record, onSave, onCancel }: ResourceFormProps) {
  const [draft, setDraft] = useState<Draft>(() => toDraft(resource, record));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const value = (key: string): string => String(draft[key] ?? '');
  const list = (key: string): string[] => Array.isArray(draft[key]) ? draft[key] as string[] : [];
  const set = (key: string, fieldValue: FieldValue) => setDraft(current => ({ ...current, [key]: fieldValue }));
  const field = (key: string, label: string, required = false, type = 'text') => <TextField label={label} value={value(key)} onChange={event => set(key, event.target.value)} required={required} type={type} />;
  const textarea = (key: string, label: string, rows = 3, required = false) => <FormField label={label}><textarea rows={rows} value={value(key)} onChange={event => set(key, event.target.value)} required={required} /></FormField>;
  const submit = async (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setBusy(true); setError(''); try { await onSave(payload(resource, draft)); } catch (failure) { setError(failure instanceof Error ? failure.message : 'Save failed'); } finally { setBusy(false); } };
  return <form className="manage-panel manage-form" onSubmit={event => { void submit(event); }}><h2>{record ? 'EDIT' : 'NEW'}_{resource.toUpperCase().replace(/S$/, '')}</h2><div className="manage-form-grid">{resource === 'projects' && <>{field('name', 'Project Name', true)}{field('slug', 'Slug', true)}{field('shortDescription', 'Short Description', true)}<FormField label="Status"><select value={value('status')} onChange={event => set('status', event.target.value)}><option value="development">Development</option><option value="deployed">Deployed</option><option value="archived">Archived</option></select></FormField></>}{resource === 'skills' && <>{field('name', 'Name', true)}<FormField label="Category"><select value={value('category')} onChange={event => set('category', event.target.value)}>{['frontend', 'backend', 'database', 'tools', 'language'].map(category => <option key={category} value={category}>{category}</option>)}</select></FormField>{field('icon', 'Icon')}</>}{resource === 'experience' && <>{field('company', 'Company', true)}{field('role', 'Role', true)}{field('startDate', 'Start Date', true, 'date')}{!draft.current && field('endDate', 'End Date', true, 'date')}</>}{resource === 'certificates' && <>{field('name', 'Certificate Name', true)}{field('issuer', 'Issuer', true)}{field('issueDate', 'Issue Date', true, 'date')}{field('credentialId', 'Credential ID')}{field('credentialUrl', 'Credential URL', false, 'url')}</>}{field('displayOrder', 'Display Order', true, 'number')}</div>
    {resource === 'projects' && <>{textarea('overview', 'Overview', 5)}<div className="manage-form-grid">{textarea('problem', 'Problem')}{textarea('solution', 'Solution')}{textarea('challenges', 'Challenges')}{textarea('result', 'Result')}</div><ListEditor label="Features" values={list('features')} onChange={items => set('features', items)} /><ListEditor label="Tech Stack" values={list('stack')} onChange={items => set('stack', items)} />{field('githubUrl', 'GitHub URL', false, 'url')}{field('liveUrl', 'Live URL', false, 'url')}{field('year', 'Year', false, 'number')}<label className="manage-checkbox"><input type="checkbox" checked={Boolean(draft.featured)} onChange={event => set('featured', event.target.checked)} /> Featured project</label><ImageUploader label="Thumbnail" value={value('thumbnail')} onUploaded={asset => setDraft(current => ({ ...current, thumbnail: asset.url, thumbnailPublicId: asset.publicId }))} /><div className="manage-field"><span>Gallery Images (max 8)</span><div className="manage-gallery">{list('gallery').map((url, index) => <div key={`${url}-${index}`}><img src={url} alt={`Gallery ${index + 1}`} /><button type="button" onClick={() => setDraft(current => ({ ...current, gallery: list('gallery').filter((_, position) => position !== index), galleryPublicIds: list('galleryPublicIds').filter((_, position) => position !== index) }))}>Remove</button></div>)}</div>{list('gallery').length < 8 && <ImageUploader label="Add gallery image" onUploaded={asset => setDraft(current => ({ ...current, gallery: [...list('gallery'), asset.url], galleryPublicIds: [...list('galleryPublicIds'), asset.publicId] }))} />}</div></>}
    {resource === 'skills' && <label className="manage-checkbox"><input type="checkbox" checked={Boolean(draft.visible)} onChange={event => set('visible', event.target.checked)} /> Visible on public portfolio</label>}
    {resource === 'experience' && <><label className="manage-checkbox"><input type="checkbox" checked={Boolean(draft.current)} onChange={event => set('current', event.target.checked)} /> Currently working here</label>{textarea('description', 'Description', 5, true)}<ListEditor label="Technologies" values={list('technologies')} onChange={items => set('technologies', items)} /><ImageUploader label="Company Logo" value={value('companyLogo')} onUploaded={asset => setDraft(current => ({ ...current, companyLogo: asset.url, companyLogoPublicId: asset.publicId }))} /></>}
    {resource === 'certificates' && <ImageUploader label="Certificate Image" value={value('image')} onUploaded={asset => setDraft(current => ({ ...current, image: asset.url, imagePublicId: asset.publicId }))} />}
    {error && <p className="manage-error" role="alert">ERR_SAVE: {error}</p>}<div className="manage-actions"><button type="button" onClick={onCancel}>[ CANCEL ]</button><button className="primary" type="submit" disabled={busy}>{busy ? '[ SAVING... ]' : '[ SAVE ]'}</button></div></form>;
}

interface ManageCollectionProps { resource: ResourceName; title: string; description: string }
export function ManageCollection({ resource, title, description }: ManageCollectionProps) {
  const { retry } = usePortfolio();
  const [items, setItems] = useState<ResourceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState<ResourceRecord | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<ResourceRecord | null>(null);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState('');
  const load = () => { setLoading(true); setError(''); manageService.list(resource).then(setItems).catch(failure => setError(failure instanceof Error ? failure.message : 'Unable to load data')).finally(() => setLoading(false)); };
  useEffect(() => { setEditing(null); setCreating(false); setDeleting(null); setFeedback(''); load(); }, [resource]);
  const save = async (data: object) => {
    if (editing) await manageService.update(resource, editing._id, data);
    else await manageService.create(resource, data);
    setEditing(null); setCreating(false); setFeedback('CHANGES SAVED.'); load(); retry();
  };
  const remove = async () => { if (!deleting) return; setBusy(true); try { await manageService.remove(resource, deleting._id); setDeleting(null); setFeedback('RESOURCE DELETED.'); load(); retry(); } catch (failure) { setError(failure instanceof Error ? failure.message : 'Delete failed'); } finally { setBusy(false); } };
  const label = (item: ResourceRecord): string => 'role' in item ? item.role : item.name;
  return <div className="manage-page"><div className="manage-heading"><span>&gt; ls ./manage/{resource}</span><h1>{title.toUpperCase()}<span>_</span></h1><p>{description}</p></div>{error && <div className="manage-error" role="alert">ERR_{resource.toUpperCase()}: {error}</div>}{feedback && <div className="manage-success" role="status">{feedback}</div>}{!creating && !editing && <><div className="manage-toolbar"><span>{items.length} RECORDS</span><button className="primary" onClick={() => { setCreating(true); setFeedback(''); }}>[ + ADD {resource.toUpperCase().replace(/S$/, '')} ]</button></div>{loading ? <div className="manage-loading">FETCHING_{resource.toUpperCase()}...</div> : items.length ? <div className="manage-list">{items.map(item => <div className="manage-list-row" key={item._id}><div><strong>{label(item)}</strong><span>{'status' in item ? item.status : 'category' in item ? item.category : 'issuer' in item ? item.issuer : item.company}{'featured' in item && item.featured ? ' / FEATURED' : ''}</span></div><div className="manage-row-actions">{resource === 'projects' && 'slug' in item && <a href={`/projects/${item.slug}`} target="_blank" rel="noreferrer">VIEW</a>}<button onClick={() => { setEditing(item); setFeedback(''); }}>EDIT</button><button className="danger-text" onClick={() => setDeleting(item)}>DELETE</button></div></div>)}</div> : <div className="manage-empty">0 RECORDS FOUND. Create the first one above.</div>}</>}{(creating || editing) && <ResourceForm key={`${resource}-${editing?._id ?? 'new'}`} resource={resource} record={editing} onSave={save} onCancel={() => { setCreating(false); setEditing(null); }} />}{deleting && <DeleteConfirmation type={resource.replace(/s$/, '')} target={label(deleting)} busy={busy} onCancel={() => setDeleting(null)} onDelete={() => { void remove(); }} />}</div>;
}
