import { useEffect, useState } from 'react';

const key = 'portfolio-os-booted';
function hasBooted(): boolean { try { return sessionStorage.getItem(key) === 'yes'; } catch { return false; } }
function markBooted(): void { try { sessionStorage.setItem(key, 'yes'); } catch { /* Session storage can be unavailable. */ } }
interface BootScreenProps { onComplete: () => void; os: string; username: string; hostname: string }
export function BootScreen({ onComplete, os, username, hostname }: BootScreenProps) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (hasBooted() || window.matchMedia('(prefers-reduced-motion: reduce)').matches) { markBooted(); onComplete(); return; }
    const interval = window.setInterval(() => setStep(current => Math.min(current + 1, 5)), 230);
    const timeout = window.setTimeout(() => { markBooted(); onComplete(); }, 1650);
    return () => { window.clearInterval(interval); window.clearTimeout(timeout); };
  }, [onComplete]);
  const skip = () => { markBooted(); onComplete(); };
  return <div className="boot-screen" role="status" aria-live="polite"><div className="boot-terminal"><div className="boot-top"><span>{os} v1.0</span><button onClick={skip}>[ skip ]</button></div><div className="boot-lines">{['initializing kernel', 'loading interface', 'loading profile', 'loading projects'].map((line, index) => <p key={line} className={step > index ? 'visible' : ''}>&gt; {line} <span>........ OK</span></p>)}<p className={`boot-ready ${step >= 4 ? 'visible' : ''}`}>SYSTEM READY.</p><p className={step >= 5 ? 'visible' : ''}>{username}@{hostname}:~$ <span className="blinking-cursor">_</span></p></div></div></div>;
}
