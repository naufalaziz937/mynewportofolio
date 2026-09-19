import { useEffect, useState, type FormEvent } from 'react';
import { manageService } from '../../services/manage.service';
import type { SettingsRecord } from '../../types/api';
import { defaultSettings } from '../../data/profile';
import { TextField } from '../../components/manage/FormField';
import { usePortfolio } from '../../context/PortfolioContext';

type SettingsInput = Omit<SettingsRecord, '_id' | 'createdAt' | 'updatedAt'>;
const fromRecord = (record: SettingsRecord): SettingsInput => ({ siteTitle: record.siteTitle, terminalUsername: record.terminalUsername, terminalHostname: record.terminalHostname, systemOS: record.systemOS, footerQuote: record.footerQuote, availabilityStatus: record.availabilityStatus, bootEnabled: record.bootEnabled, sideStreamEnabled: record.sideStreamEnabled, crtEnabled: record.crtEnabled });
export function ManageAppearance() {
  const { retry } = usePortfolio();
  const [form, setForm] = useState<SettingsInput>(defaultSettings);
  const [original, setOriginal] = useState<SettingsInput>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');
  useEffect(() => { manageService.settings().then(item => { if (item) { setForm(fromRecord(item)); setOriginal(fromRecord(item)); } }).catch(failure => setError(failure instanceof Error ? failure.message : 'Unable to load settings')).finally(() => setLoading(false)); }, []);
  const set = (field: keyof SettingsInput, value: string | boolean) => setForm(current => ({ ...current, [field]: value }));
  const save = async (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setSaving(true); setError(''); setFeedback(''); try { const result = fromRecord(await manageService.saveSettings(form)); setForm(result); setOriginal(result); setFeedback('SETTINGS SAVED.'); retry(); document.title = result.siteTitle; } catch (failure) { setError(failure instanceof Error ? failure.message : 'Save failed'); } finally { setSaving(false); } };
  return <div className="manage-page"><div className="manage-heading"><span>&gt; config --edit</span><h1>APPEARANCE<span>_</span></h1><p>Control terminal labels and ambient effects.</p></div>{loading ? <div className="manage-loading">FETCHING_SETTINGS...</div> : <form className="manage-panel manage-form" onSubmit={event => { void save(event); }}><h2>/site_settings</h2><div className="manage-form-grid"><TextField label="Site Title" value={form.siteTitle} onChange={event => set('siteTitle', event.target.value)} required /><TextField label="Terminal Username" value={form.terminalUsername} onChange={event => set('terminalUsername', event.target.value)} required /><TextField label="Terminal Hostname" value={form.terminalHostname} onChange={event => set('terminalHostname', event.target.value)} required /><TextField label="System OS" value={form.systemOS} onChange={event => set('systemOS', event.target.value)} required /><TextField label="Footer Quote" value={form.footerQuote} onChange={event => set('footerQuote', event.target.value)} required /><TextField label="Availability Status" value={form.availabilityStatus} onChange={event => set('availabilityStatus', event.target.value)} required /></div><h2>/effects</h2><div className="manage-checks">{([['bootEnabled', 'Boot Sequence'], ['sideStreamEnabled', 'Side Data Stream'], ['crtEnabled', 'CRT Effect']] as const).map(([key, label]) => <label key={key}><input type="checkbox" checked={form[key]} onChange={event => set(key, event.target.checked)} /> {label}</label>)}</div>{error && <p className="manage-error" role="alert">ERR_SAVE: {error}</p>}{feedback && <p className="manage-success" role="status">{feedback}</p>}<div className="manage-actions"><button type="button" onClick={() => setForm(original)}>[ RESET ]</button><button className="primary" type="submit" disabled={saving}>{saving ? '[ SAVING... ]' : '[ SAVE CHANGES ]'}</button></div></form>}</div>;
}
