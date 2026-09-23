import { useEffect, useState } from 'react';

interface BootScreenProps {
  os: string;
  username?: string;
  hostname?: string;
  dataReady: boolean;
  skipCosmetics: boolean;
  completing: boolean;
  error: string | null;
  onRetry: () => void;
  onSkip: () => void;
}

export function BootScreen({ os, username, hostname, dataReady, skipCosmetics, completing, error, onRetry, onSkip }: BootScreenProps) {
  const [cosmeticStep, setCosmeticStep] = useState(0);

  useEffect(() => {
    const first = window.setTimeout(() => setCosmeticStep(1), 180);
    const second = window.setTimeout(() => setCosmeticStep(2), 360);
    return () => { window.clearTimeout(first); window.clearTimeout(second); };
  }, []);

  return <div className="boot-screen" role="status" aria-live="polite"><div className="boot-terminal">
    <div className="boot-top"><span>{os} v1.0</span><button type="button" onClick={onSkip}>[ skip ]</button></div>
    <div className="boot-lines">
      <p className="visible">&gt; initializing kernel <span>........ OK</span></p>
      <p className={skipCosmetics || cosmeticStep >= 1 ? 'visible' : ''}>&gt; loading interface <span>........ OK</span></p>
      <p className={skipCosmetics || cosmeticStep >= 2 || dataReady || !!error ? 'visible' : ''}>&gt; loading profile <span className={error ? 'boot-failed' : ''}>........ {error ? 'FAILED' : dataReady ? 'OK' : ''}</span></p>
      {error && <p className="visible boot-error-detail">{error}</p>}
      {error && <p className="visible"><button type="button" className="boot-retry" onClick={onRetry}>[ retry ]</button></p>}
      <p className={`boot-ready ${completing ? 'visible' : ''}`}>SYSTEM READY.</p>
      <p className={completing && username && hostname ? 'visible' : ''}>{username && hostname ? `${username}@${hostname}:~$` : ''} <span className="blinking-cursor">_</span></p>
    </div>
  </div></div>;
}
