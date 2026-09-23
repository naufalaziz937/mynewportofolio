import { ArrowDownRight, ArrowUpRight, Download, FolderGit2 } from 'lucide-react';
import type { MouseEvent } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { scrollToSection } from '../../utils/scrollToSection';
import { BlinkingCursor } from '../effects/BlinkingCursor';
import { DecryptingTextLoader } from '../ui/DecryptingTextLoader';
import { ResourceState } from '../ui/ResourceState';
import { TerminalSkeleton } from '../ui/TerminalSkeleton';
import { TerminalButton } from '../ui/TerminalButton';

const OFFICIAL_NAME = 'Nazwan Naufal Aziz';

export function HeroSection() {
  const { profile, settings, retry } = usePortfolio();
  const person = profile.data;
  const config = settings.data;
  const role = person?.role.split(' ') ?? [];
  return <section id="home" className="hero section"><div className="hero-copy">
    <div className="hero-eyebrow entrance one"><span className="green">&gt;</span> whoami <span className="hero-path">// /home/<DecryptingTextLoader value={person?.username} loading={profile.loading} estimatedLength={8} /></span></div>
    <div className="hero-intro entrance two"><DecryptingTextLoader value={person?.heroGreeting} loading={profile.loading} estimatedLength={7} /></div>
    <h1 className="hero-name entrance three"><DecryptingTextLoader value={profile.loading ? undefined : OFFICIAL_NAME} loading={profile.loading} estimatedLength={19} /><BlinkingCursor /></h1>
    <h2 className="hero-role entrance four">{profile.loading ? <DecryptingTextLoader loading estimatedLength={20} /> : person && <><DecryptingTextLoader value={role.slice(0, -1).join(' ')} estimatedLength={15} /> <span><DecryptingTextLoader value={role.at(-1)} estimatedLength={9} /></span></>}</h2>
    <div className="hero-description entrance five">{profile.loading ? <TerminalSkeleton lines={3} /> : person?.heroDescription.map(line => <p key={line}>{line}</p>)}</div>
    {profile.error && <ResourceState name="profile" loading={false} error={profile.error} onRetry={retry} />}
    {settings.error && <ResourceState name="settings" loading={false} error={settings.error} onRetry={retry} />}
    {!profile.loading && !profile.error && !person && <ResourceState name="profile" loading={false} error={null} empty onRetry={retry} />}
    <div className="hero-actions entrance six"><TerminalButton primary onClick={() => scrollToSection('projects')}><FolderGit2 size={16} /> View Projects <ArrowUpRight size={16} /></TerminalButton><TerminalButton href={person?.cvUrl || '#about'} onClick={person?.cvUrl ? undefined : (event: MouseEvent<HTMLAnchorElement>) => { event.preventDefault(); scrollToSection('about'); }}><Download size={16} /> {person?.cvUrl ? 'Download CV' : 'View Profile'}</TerminalButton></div>
    <div className="hero-scroll entrance six"><ArrowDownRight size={16} /> SCROLL TO EXPLORE <span>↓</span></div></div>
    <div className="hero-visual" aria-hidden="true"><div className="visual-grid" /><div className="visual-orbit orbit-one" /><div className="visual-orbit orbit-two" /><div className="visual-center"><span className="visual-corner top-left" /><span className="visual-corner top-right" /><span className="visual-corner bottom-left" /><span className="visual-corner bottom-right" /><div className="visual-prompt"><DecryptingTextLoader value={config?.terminalUsername} loading={settings.loading} estimatedLength={8} />@<DecryptingTextLoader value={config?.terminalHostname} loading={settings.loading} estimatedLength={9} />:~$</div><div className="visual-code"><span>const</span> developer = {'{'}<br /><span className="indent">mindset: <b>'build'</b>,</span><br /><span className="indent">status: <b>'<DecryptingTextLoader value={person?.status.toLowerCase()} loading={profile.loading} estimatedLength={9} />'</b></span><br />{'}'};</div><div className="visual-caption"><span>● SYSTEM ONLINE</span><span>v1.0.0</span></div></div><div className="visual-coordinate">// 00.0000° S &nbsp; 00.0000° E</div></div>
  </section>;
}
