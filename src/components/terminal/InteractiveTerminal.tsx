import { useEffect, useMemo, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { ChevronDown, TerminalSquare, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createCommands, executeCommand } from '../../utils/terminalCommands';
import { scrollToSection } from '../../utils/scrollToSection';
import { usePortfolio } from '../../context/PortfolioContext';
import { useAuth } from '../../context/AuthContext';
import { profile as fallbackProfile, defaultSettings } from '../../data/profile';
import type { TerminalHistoryItem } from '../../types/terminal';

interface InteractiveTerminalProps { open: boolean; onClose: () => void; onOpen: () => void }
type InputMode = 'command' | 'password' | 'authenticating';
export function InteractiveTerminal({ open, onClose, onOpen }: InteractiveTerminalProps) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const portfolio = usePortfolio();
  const person = portfolio.profile.data ?? fallbackProfile;
  const settings = portfolio.settings.data ?? defaultSettings;
  const prompt = `${settings.terminalUsername}@${settings.terminalHostname}:~$`;
  const commands = useMemo(() => createCommands({ profile: person, settings, projects: portfolio.projects.data, skills: portfolio.skills.data, experience: portfolio.experience.data, certificates: portfolio.certificates.data }), [person, settings, portfolio.projects.data, portfolio.skills.data, portfolio.experience.data, portfolio.certificates.data]);
  const [value, setValue] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<InputMode>('command');
  const [items, setItems] = useState<TerminalHistoryItem[]>([{ id: 0, input: 'help', output: ['Type a command or try help. Arrow keys recall history.'] }]);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const outputRef = useRef<HTMLDivElement | null>(null);
  const timer = useRef<number | null>(null);
  const closeTerminal = () => { setPassword(''); if (mode !== 'authenticating') setMode('command'); onClose(); };
  useEffect(() => { if (open) window.setTimeout(() => inputRef.current?.focus(), 0); }, [open, mode]);
  useEffect(() => { if (open) outputRef.current?.scrollTo({ top: outputRef.current.scrollHeight }); }, [items, open]);
  useEffect(() => () => { if (timer.current !== null) window.clearTimeout(timer.current); }, []);
  useEffect(() => {
    const shortcut = (event: globalThis.KeyboardEvent) => {
      if (event.ctrlKey && (event.key === '`' || event.key === '~')) { event.preventDefault(); onOpen(); }
      if (event.key === 'Escape' && open) closeTerminal();
    };
    window.addEventListener('keydown', shortcut);
    return () => window.removeEventListener('keydown', shortcut);
  }, [open, onClose, onOpen, mode]);
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (mode === 'authenticating') return;
    if (mode === 'password') {
      if (!password) return;
      const credential = password;
      setPassword('');
      setMode('authenticating');
      setItems(current => [...current, { id: Date.now(), input: `Password: ${'•'.repeat(credential.length)}`, output: ['Authenticating...'] }]);
      try {
        await login(credential);
        setItems(current => [...current, { id: Date.now() + 1, input: '', output: ['IDENTITY VERIFIED.', 'ACCESS LEVEL: ADMIN', 'Initializing control panel...', '[████████████████████] 100%', 'ACCESS GRANTED.'] }]);
        timer.current = window.setTimeout(() => navigate('/manage'), 600);
      } catch {
        setItems(current => [...current, { id: Date.now() + 1, input: '', output: ['ACCESS DENIED.', 'ERR_AUTH_401', 'Invalid credentials.'] }]);
        setMode('command');
      }
      return;
    }
    const input = value.trim();
    if (!input) return;
    setValue('');
    setHistory(current => [input, ...current]);
    setHistoryIndex(-1);
    if (input.toLowerCase() === 'admin') {
      setItems(current => [...current, { id: Date.now(), input, output: ['Restricted command detected.'] }]);
      setMode('password');
      return;
    }
    const result = executeCommand(input, commands);
    setItems(current => result.clear ? [] : [...current, { id: Date.now(), input, output: result.lines }]);
    if (result.navigateTo) { scrollToSection(result.navigateTo); if (window.innerWidth < 768) onClose(); }
  };
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (mode !== 'command') return;
    if (event.key === 'ArrowUp') { event.preventDefault(); const index = Math.min(historyIndex + 1, history.length - 1); if (index >= 0) { setHistoryIndex(index); setValue(history[index]); } }
    if (event.key === 'ArrowDown') { event.preventDefault(); const index = historyIndex - 1; setHistoryIndex(index); setValue(index >= 0 ? history[index] : ''); }
    if (event.key === 'Tab') { const matches = Object.keys(commands).filter(name => name.startsWith(value.toLowerCase())); if (matches.length === 1) { event.preventDefault(); setValue(matches[0]); } }
  };
  return <div className={`interactive-terminal ${open ? 'open' : ''}`} aria-label="Interactive terminal"><div className="terminal-titlebar"><div><TerminalSquare size={15} /><span>terminal — {settings.terminalUsername}@{settings.terminalHostname}</span></div><div><span className="terminal-shortcut">CTRL + `</span><button onClick={open ? closeTerminal : onOpen} aria-label={open ? 'Close terminal' : 'Open terminal'}>{open ? <X size={17} /> : <ChevronDown size={17} />}</button></div></div>{open && <div className="terminal-body" ref={outputRef} onClick={() => inputRef.current?.focus()}><div className="terminal-greeting">{settings.systemOS} interactive shell <span>v1.0</span></div>{items.map(item => <div className="terminal-history-item" key={item.id}><div>{item.input && <><span>{item.input.startsWith('Password:') ? '' : prompt}</span> {item.input}</>}</div>{item.output.map((line, index) => <pre key={index}>{line}</pre>)}</div>)}<form onSubmit={event => { void submit(event); }}><label htmlFor="terminal-input">{mode === 'command' ? prompt : 'Password:'}</label><input ref={inputRef} id="terminal-input" type={mode === 'command' ? 'text' : 'password'} value={mode === 'command' ? value : password} onChange={event => mode === 'command' ? setValue(event.target.value) : setPassword(event.target.value)} onKeyDown={handleKeyDown} autoComplete="off" spellCheck={false} disabled={mode === 'authenticating'} aria-label={mode === 'command' ? 'Type terminal command' : 'Admin password'} /></form></div>}</div>;
}
