import { useEffect, useState } from 'react';
import { Menu } from 'lucide-react';
import { navigation } from '../../data/profile';
import { usePortfolio } from '../../context/PortfolioContext';
import type { SectionId } from '../../types/portfolio';
import { scrollToSection } from '../../utils/scrollToSection';
import { DecryptingTextLoader } from '../ui/DecryptingTextLoader';
import { StatusIndicator } from '../ui/StatusIndicator';

interface TopBarProps { active: SectionId; onMenuToggle: () => void }
export function TopBar({ active, onMenuToggle }: TopBarProps) {
  const { settings } = usePortfolio();
  const [clock, setClock] = useState(() => new Date().toLocaleTimeString('en-GB', { hour12: false }));
  useEffect(() => { const timer = window.setInterval(() => setClock(new Date().toLocaleTimeString('en-GB', { hour12: false })), 1000); return () => window.clearInterval(timer); }, []);
  return <header className="top-bar"><div className="top-bar-inner"><a className="brand" href="#home" onClick={event => { event.preventDefault(); scrollToSection('home'); }}><span><DecryptingTextLoader value={settings.data?.terminalUsername} loading={settings.loading} estimatedLength={8} /></span>@<DecryptingTextLoader value={settings.data?.terminalHostname} loading={settings.loading} estimatedLength={9} />:<span>~$</span></a><nav className="top-navigation" aria-label="Primary navigation">{navigation.map(item => <a key={item.sectionId} href={`#${item.sectionId}`} className={active === item.sectionId ? 'active' : ''} onClick={event => { event.preventDefault(); scrollToSection(item.sectionId); }}>{item.label}</a>)}</nav><div className="top-right"><span className="online-pill"><StatusIndicator label="online" pulse /></span><time suppressHydrationWarning>{clock}</time><button className="mobile-menu-toggle" onClick={onMenuToggle} aria-label="Toggle navigation"><Menu size={20} /></button></div></div></header>;
}
