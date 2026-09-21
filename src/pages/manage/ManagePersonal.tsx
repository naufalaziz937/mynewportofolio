import { useEffect, useState, type FormEvent } from 'react';
import { PERSONAL_CATEGORIES, PERSONAL_CARD_SIZES, personalCategoryLabel, type PersonalCategory, type PersonalCardSize } from '../../data/personalCategories';
import type { PersonalItemRecord } from '../../types/api';
import { manageService } from '../../services/manage.service';
import { usePortfolio } from '../../context/PortfolioContext';
import { FormField, TextField } from '../../components/manage/FormField';
import { ImageUploader } from '../../components/manage/ImageUploader';
import { DeleteConfirmation } from '../../components/manage/DeleteConfirmation';

type Draft = Omit<PersonalItemRecord, '_id' | 'createdAt' | 'updatedAt'>;
const blank: Draft = { category: 'hobbies', title: '', description: '', image: '', imagePublicId: '', imageAlt: '', label: '', icon: '', status: '', url: '', completed: false, size: 'large', displayMode: 'visual', order: 0, visible: true };
const visualCategories: PersonalCategory[] = ['hobbies', 'favorites', 'dream-setup', 'dream-garage', 'dream-home'];
function toDraft(item: PersonalItemRecord | null): Draft {
  if (!item) return { ...blank };
  return { category: item.category, title: item.title, description: item.description ?? '', image: item.image ?? '', imagePublicId: item.imagePublicId ?? '', imageAlt: item.imageAlt ?? '', label: item.label ?? '', icon: item.icon ?? '', status: item.status ?? '', url: item.url ?? '', completed: item.completed, size: item.size, displayMode: item.displayMode, order: item.order, visible: item.visible };
}

function PersonalForm({ item, onCancel, onSaved }: { item: PersonalItemRecord | null; onCancel: () => void; onSaved: () => void }) {
  const [draft, setDraft] = useState<Draft>(() => toDraft(item));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => setDraft(current => ({ ...current, [key]: value }));
  const changeCategory = (category: PersonalCategory) => setDraft(current => ({ ...current, category, displayMode: visualCategories.includes(category) ? 'visual' : 'text', size: category === 'personal-quote' ? 'large' : current.size }));
  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    const payload: Draft = { ...draft, title: draft.title.trim(), description: draft.description?.trim() ?? '', imageAlt: draft.imageAlt?.trim() ?? '', label: draft.label?.trim() ?? '', icon: draft.icon?.trim() ?? '', status: draft.status?.trim() ?? '', url: draft.url?.trim() ?? '' };
    try { if (item) await manageService.updatePersonal(item._id, payload); else await manageService.createPersonal(payload); onSaved(); }
    catch (failure) { setError(failure instanceof Error ? failure.message : 'Save failed'); }
    finally { setSaving(false); }
  };
  return <form className="manage-panel manage-form" onSubmit={event => { void save(event); }}><h2>{item ? 'EDIT' : 'NEW'}_PERSONAL_ITEM</h2>
    <div className="manage-form-grid">
      <FormField label="Category"><select value={draft.category} onChange={event => changeCategory(event.target.value as PersonalCategory)}>{PERSONAL_CATEGORIES.map(category => <option key={category.key} value={category.key}>{category.label}</option>)}</select></FormField>
      <TextField label={draft.category === 'personal-quote' ? 'Quote' : 'Title'} value={draft.title} onChange={event => set('title', event.target.value)} required />
      <FormField label="Display Mode"><select value={draft.displayMode} onChange={event => set('displayMode', event.target.value as Draft['displayMode'])}><option value="visual">Visual / image first</option><option value="text">Text / information first</option></select></FormField>
      <TextField label="Display Order" type="number" value={String(draft.order)} onChange={event => set('order', Math.max(0, Number(event.target.value) || 0))} required />
    </div>
    <FormField label={draft.category === 'personal-quote' ? 'Context (optional)' : 'Short Description (optional)'}><textarea rows={3} maxLength={1000} value={draft.description ?? ''} onChange={event => set('description', event.target.value)} /></FormField>
    <div className="manage-form-grid">
      <TextField label={draft.category === 'personal-quote' ? 'Source / Author (optional)' : 'Label (optional)'} value={draft.label ?? ''} onChange={event => set('label', event.target.value)} />
      <TextField label="Icon / Emoji (optional)" value={draft.icon ?? ''} onChange={event => set('icon', event.target.value)} />
      {(draft.category === 'currently' || draft.category === 'career-goal' || draft.category === 'life-goal') && <TextField label="Status (optional)" value={draft.status ?? ''} onChange={event => set('status', event.target.value)} />}
      <TextField label="External URL (optional)" type="url" value={draft.url ?? ''} onChange={event => set('url', event.target.value)} />
    </div>
    {draft.category === 'bucket-list' && <label className="manage-checkbox"><input type="checkbox" checked={draft.completed} onChange={event => set('completed', event.target.checked)} /> Completed</label>}
    <div className="manage-field"><span id="personal-card-size-label">Card Size</span><div className="personal-size-selector" role="radiogroup" aria-labelledby="personal-card-size-label">{PERSONAL_CARD_SIZES.map(size => <label key={size} className={draft.size === size ? 'selected' : ''}><input type="radio" name="card-size" value={size} checked={draft.size === size} onChange={() => set('size', size as PersonalCardSize)} /><span className={`personal-size-preview preview-${size}`} aria-hidden="true" /><span>{size.toUpperCase()}</span></label>)}</div></div>
    <ImageUploader label="Card Image (optional)" value={draft.image} onUploaded={asset => setDraft(current => ({ ...current, image: asset.url, imagePublicId: asset.publicId }))} />
    {draft.image && <button className="personal-remove-image" type="button" onClick={() => setDraft(current => ({ ...current, image: '', imagePublicId: '', imageAlt: '' }))}>[ REMOVE IMAGE ]</button>}
    <TextField label="Image Alt Text" value={draft.imageAlt ?? ''} onChange={event => set('imageAlt', event.target.value)} />
    <label className="manage-checkbox"><input type="checkbox" checked={draft.visible} onChange={event => set('visible', event.target.checked)} /> Visible on public portfolio</label>
    {error && <p className="manage-error" role="alert">ERR_SAVE: {error}</p>}
    <div className="manage-actions"><button type="button" onClick={onCancel}>[ CANCEL ]</button><button type="submit" className="primary" disabled={saving}>{saving ? '[ SAVING... ]' : '[ SAVE ]'}</button></div>
  </form>;
}

export function ManagePersonal() {
  const { retry } = usePortfolio();
  const [items, setItems] = useState<PersonalItemRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');
  const [filter, setFilter] = useState<PersonalCategory | 'all'>('all');
  const [editing, setEditing] = useState<PersonalItemRecord | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<PersonalItemRecord | null>(null);
  const [busy, setBusy] = useState(false);
  const load = () => { setLoading(true); setError(''); manageService.personal().then(setItems).catch(failure => setError(failure instanceof Error ? failure.message : 'Unable to load items')).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);
  const saved = () => { setEditing(null); setCreating(false); setFeedback('CHANGES SAVED.'); load(); retry(); };
  const remove = async () => { if (!deleting) return; setBusy(true); try { await manageService.removePersonal(deleting._id); setDeleting(null); setFeedback('ITEM DELETED.'); load(); retry(); } catch (failure) { setError(failure instanceof Error ? failure.message : 'Delete failed'); } finally { setBusy(false); } };
  const visibleItems = filter === 'all' ? items : items.filter(item => item.category === filter);
  return <div className="manage-page"><div className="manage-heading"><span>&gt; ls ./manage/personal</span><h1>BEYOND THE CODE<span>_</span></h1><p>Personal modules shown in the public mosaic. Set the order with a number; lower numbers appear first.</p></div>
    {error && <div className="manage-error" role="alert">ERR_PERSONAL: {error}</div>}{feedback && <div className="manage-success" role="status">{feedback}</div>}
    {!creating && !editing && <><div className="manage-toolbar"><span>{items.length} RECORDS</span><button className="primary" onClick={() => { setCreating(true); setFeedback(''); }}>[ + ADD ITEM ]</button></div>
      <div className="manage-personal-filter"><label htmlFor="personal-filter">CATEGORY</label><select id="personal-filter" value={filter} onChange={event => setFilter(event.target.value as PersonalCategory | 'all')}><option value="all">All categories</option>{PERSONAL_CATEGORIES.map(category => <option key={category.key} value={category.key}>{category.label}</option>)}</select></div>
      {loading ? <div className="manage-loading">FETCHING_PERSONAL...</div> : visibleItems.length ? <div className="manage-list">{visibleItems.map(item => <div className="manage-list-row" key={item._id}><div><strong>{item.title}</strong><span>{personalCategoryLabel(item.category)} / {item.size.toUpperCase()} / ORDER {item.order} / {item.visible ? 'PUBLIC' : 'HIDDEN'}</span></div><div className="manage-row-actions"><button onClick={() => { setEditing(item); setFeedback(''); }}>EDIT</button><button className="danger-text" onClick={() => setDeleting(item)}>DELETE</button></div></div>)}</div> : <div className="manage-empty">0 RECORDS FOUND. Add your first personal item above.</div>}
    </>}
    {(creating || editing) && <PersonalForm key={editing?._id ?? 'new'} item={editing} onCancel={() => { setEditing(null); setCreating(false); }} onSaved={saved} />}
    {deleting && <DeleteConfirmation type="personal item" target={deleting.title} busy={busy} onCancel={() => setDeleting(null)} onDelete={() => { void remove(); }} />}
  </div>;
}
