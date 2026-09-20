import { useState, type ChangeEvent, type FormEvent } from 'react';
import { ArrowUpRight, Send } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { portfolioService } from '../../services/portfolio.service';
import { DecryptingTextLoader } from '../ui/DecryptingTextLoader';
import { SectionCommand } from '../ui/SectionCommand';
import { TerminalPanel } from '../ui/TerminalPanel';

interface ContactFormData { name: string; email: string; message: string }
type FormStatus = 'idle' | 'transmitting' | 'delivered';
const initialForm: ContactFormData = { name: '', email: '', message: '' };
export function ContactSection() {
  const { profile, settings } = usePortfolio();
  const [form, setForm] = useState<ContactFormData>(initialForm);
  const [status, setStatus] = useState<FormStatus>('idle');
  const [messageId, setMessageId] = useState('');
  const [error, setError] = useState('');
  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => { setForm(current => ({ ...current, [event.target.name]: event.target.value })); setError(''); };
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) { setError('All fields are required.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { setError('Enter a valid email address.'); return; }
    setStatus('transmitting');
    try { const result = await portfolioService.contact(form); setMessageId(`#${result.id.slice(-6).toUpperCase()}`); setStatus('delivered'); setForm(initialForm); }
    catch (failure) { setError(failure instanceof Error ? failure.message : 'Unable to transmit message'); setStatus('idle'); }
  };
  return <section id="contact" className="section standard-section contact-section"><SectionCommand command="./contact --init" index="06" label="connection" /><div className="section-heading"><span className="section-kicker">PORT: OPEN</span><h2>Let's <span>connect.</span></h2><p>Have an idea, opportunity, or just want to say hello?</p></div><div className="contact-grid"><div className="contact-copy"><div className="contact-large">Let's build<br /><span>something good.</span></div><p>I'm open to thoughtful projects, collaboration, and new challenges. Drop a message and let's see where it goes.</p>
    {profile.data?.email ? <a href={`mailto:${profile.data.email}`}>or reach me via email <ArrowUpRight size={16} /></a> : profile.loading ? <span className="loading-contact-link">EMAIL: <DecryptingTextLoader loading estimatedLength={18} /></span> : profile.error && <span className="form-error">EMAIL UNAVAILABLE</span>}
    <div className="contact-availability"><span className="status-dot pulse" /> <DecryptingTextLoader value={settings.data?.availabilityStatus.toUpperCase()} loading={settings.loading} estimatedLength={9} /></div></div>
    <TerminalPanel title="establish_connection.sh"><form className="contact-form" onSubmit={handleSubmit} noValidate><div className="form-title">ESTABLISH_CONNECTION <span>v1.0</span></div><label htmlFor="contact-name">NAME</label><div className="input-wrap"><span>&gt;</span><input id="contact-name" name="name" value={form.name} onChange={handleChange} placeholder="Your name" autoComplete="name" maxLength={100} /></div><label htmlFor="contact-email">EMAIL</label><div className="input-wrap"><span>&gt;</span><input id="contact-email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" autoComplete="email" maxLength={254} /></div><label htmlFor="contact-message">MESSAGE</label><div className="input-wrap textarea-wrap"><span>&gt;</span><textarea id="contact-message" name="message" value={form.message} onChange={handleChange} placeholder="Tell me about your idea..." rows={4} maxLength={4000} /></div>{error && <p className="form-error" role="alert">ERROR: {error}</p>}{status === 'delivered' && <div className="form-success" role="status"><strong>MESSAGE TRANSMITTED.</strong><span>STATUS &nbsp;&nbsp;&nbsp;&nbsp; DELIVERED</span><span>MESSAGE_ID &nbsp; {messageId}</span></div>}<button className="submit-button" type="submit" disabled={status === 'transmitting'}><Send size={15} /> {status === 'transmitting' ? 'TRANSMITTING...' : 'TRANSMIT MESSAGE'} <span>↗</span></button><div className="form-footnote">// Your message is stored securely for review.</div></form></TerminalPanel></div></section>;
}
