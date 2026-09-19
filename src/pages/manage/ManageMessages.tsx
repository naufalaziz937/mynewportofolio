import { useEffect, useState } from 'react';
import { manageService } from '../../services/manage.service';
import type { MessageRecord } from '../../types/api';
import { DeleteConfirmation } from '../../components/manage/DeleteConfirmation';

export function ManageMessages() {
  const [messages, setMessages] = useState<MessageRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState<MessageRecord | null>(null);
  const [deleting, setDeleting] = useState<MessageRecord | null>(null);
  const [busy, setBusy] = useState(false);
  const load = () => { setLoading(true); setError(''); manageService.messages().then(setMessages).catch(failure => setError(failure instanceof Error ? failure.message : 'Unable to load messages')).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);
  const read = async (message: MessageRecord) => { try { const updated = await manageService.markRead(message._id); setMessages(current => current.map(item => item._id === updated._id ? updated : item)); setSelected(updated); } catch (failure) { setError(failure instanceof Error ? failure.message : 'Unable to mark read'); } };
  const remove = async () => { if (!deleting) return; setBusy(true); try { await manageService.removeMessage(deleting._id); setSelected(null); setDeleting(null); load(); } catch (failure) { setError(failure instanceof Error ? failure.message : 'Unable to delete'); } finally { setBusy(false); } };
  return <div className="manage-page"><div className="manage-heading"><span>&gt; inbox --list</span><h1>MESSAGES<span>_</span></h1><p>Contact requests delivered to your portfolio inbox.</p></div>{error && <div className="manage-error" role="alert">ERR_MESSAGES: {error}</div>}{loading ? <div className="manage-loading">FETCHING_MESSAGES...</div> : !messages.length ? <div className="manage-empty">INBOX EMPTY. No messages received.</div> : <div className="manage-message-layout"><div className="manage-list">{messages.map(message => <button className={`manage-message-item ${selected?._id === message._id ? 'selected' : ''}`} key={message._id} onClick={() => { setSelected(message); if (!message.read) void read(message); }}><span>{message.read ? '○ READ' : '● NEW'} <time>{message.createdAt ? new Date(message.createdAt).toLocaleDateString() : ''}</time></span><strong>{message.name}</strong><small>{message.email}</small><p>{message.message.slice(0, 90)}{message.message.length > 90 ? '…' : ''}</p></button>)}</div><div className="manage-panel manage-message-detail">{selected ? <><h2>MESSAGE_{selected._id.slice(-6).toUpperCase()}</h2><p>FROM: {selected.name}</p><p>EMAIL: <a href={`mailto:${selected.email}`}>{selected.email}</a></p><p>RECEIVED: {selected.createdAt ? new Date(selected.createdAt).toLocaleString() : ''}</p><div className="message-body">{selected.message}</div><div className="manage-actions"><button onClick={() => { void read(selected); }}>MARK READ</button><button className="danger-text" onClick={() => setDeleting(selected)}>DELETE</button></div></> : <p>Select a message to read it.</p>}</div></div>}{deleting && <DeleteConfirmation type="message" target={deleting.name} busy={busy} onCancel={() => setDeleting(null)} onDelete={() => { void remove(); }} />}</div>;
}
