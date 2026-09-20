import { useEffect, useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { DecryptingTextLoader } from '../ui/DecryptingTextLoader';
interface BottomStatusBarProps { onTerminalOpen: () => void }
export function BottomStatusBar({ onTerminalOpen }: BottomStatusBarProps) {
  const { settings: resource } = usePortfolio();
  const [date, setDate] = useState(() => new Date().toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' }));
  useEffect(() => { const interval = window.setInterval(() => setDate(new Date().toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })), 60000); return () => window.clearInterval(interval); }, []);
  return <footer className="bottom-bar"><div className="bottom-inner"><div className="tmux-tabs"><span className="tmux-location">~/portfolio</span><span className="tmux-tab active">1:node*</span><span className="tmux-tab">2:git</span><button className="tmux-tab" onClick={onTerminalOpen}>3:terminal</button></div><span className="bottom-quote">“<DecryptingTextLoader value={resource.data?.footerQuote} loading={resource.loading} estimatedLength={20} />”</span><div className="bottom-right"><time>{date}</time><span className="bottom-led" /></div></div></footer>;
}
