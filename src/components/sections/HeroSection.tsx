import { ArrowDownRight, ArrowUpRight, Download, FolderGit2 } from 'lucide-react';
import type { MouseEvent } from 'react';
import { profile, defaultSettings } from '../../data/profile';
import { usePortfolio } from '../../context/PortfolioContext';
import { scrollToSection } from '../../utils/scrollToSection';
import { BlinkingCursor } from '../effects/BlinkingCursor';
import { TerminalButton } from '../ui/TerminalButton';

export function HeroSection() {
  const { profile: resource, settings: settingsResource } = usePortfolio();
  const person = resource.data ?? profile;
  const settings = settingsResource.data ?? defaultSettings;
  return <section id="home" className="hero section"><div className="hero-copy"><div className="hero-eyebrow entrance one"><span className="green">&gt;</span> whoami <span className="hero-path">// /home/{person.username}</span></div><div className="hero-intro entrance two">{person.heroGreeting}</div><h1 className="hero-name entrance three">{person.name.toUpperCase()}<BlinkingCursor /></h1><h2 className="hero-role entrance four">{person.role.split(' ').slice(0, -1).join(' ')} <span>{person.role.split(' ').at(-1)}</span></h2><div className="hero-description entrance five">{person.heroDescription.map(line => <p key={line}>{line}</p>)}</div><div className="hero-actions entrance six"><TerminalButton primary onClick={() => scrollToSection('projects')}><FolderGit2 size={16} /> View Projects <ArrowUpRight size={16} /></TerminalButton><TerminalButton href={person.cvUrl || '#about'} onClick={person.cvUrl ? undefined : (event: MouseEvent<HTMLAnchorElement>) => { event.preventDefault(); scrollToSection('about'); }}><Download size={16} /> {person.cvUrl ? 'Download CV' : 'View Profile'}</TerminalButton></div><div className="hero-scroll entrance six"><ArrowDownRight size={16} /> SCROLL TO EXPLORE <span>↓</span></div></div><div className="hero-visual" aria-hidden="true"><div className="visual-grid" /><div className="visual-orbit orbit-one" /><div className="visual-orbit orbit-two" /><div className="visual-center"><span className="visual-corner top-left" /><span className="visual-corner top-right" /><span className="visual-corner bottom-left" /><span className="visual-corner bottom-right" /><div className="visual-prompt">{settings.terminalUsername}@{settings.terminalHostname}:~$</div><div className="visual-code"><span>const</span> developer = {'{'}<br /><span className="indent">mindset: <b>'build'</b>,</span><br /><span className="indent">status: <b>'{person.status.toLowerCase()}'</b></span><br />{'}'};</div><div className="visual-caption"><span>● SYSTEM ONLINE</span><span>v1.0.0</span></div></div><div className="visual-coordinate">// 00.0000° S &nbsp; 00.0000° E</div></div></section>;
}
