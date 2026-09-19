import { ArrowUpRight, Github, Instagram, Mail } from 'lucide-react';
import { navigation, profile, defaultSettings } from '../../data/profile';
import { usePortfolio } from '../../context/PortfolioContext';
import type { SectionId } from '../../types/portfolio';
import { scrollToSection } from '../../utils/scrollToSection';

interface TerminalSidebarProps { active: SectionId }
const socialIcons = { github: Github, email: Mail, instagram: Instagram };
export function TerminalSidebar({ active }: TerminalSidebarProps) {
  const portfolio = usePortfolio();
  const person = portfolio.profile.data ?? profile;
  const settings = portfolio.settings.data ?? defaultSettings;
  return <aside className="sidebar" aria-label="Portfolio system sidebar"><div className="sidebar-section"><h2>/system <span>01</span></h2><dl className="system-list"><div><dt>OS</dt><dd>{settings.systemOS}</dd></div><div><dt>USER</dt><dd>{person.name}</dd></div><div><dt>ROLE</dt><dd>{person.role}</dd></div><div><dt>LOCATION</dt><dd>{person.location}</dd></div><div><dt>STATUS</dt><dd className="green">● {settings.availabilityStatus}</dd></div></dl></div><div className="sidebar-section"><h2>/navigation <span>02</span></h2><nav className="sidebar-nav" aria-label="Sidebar navigation">{navigation.map((item, index) => <button key={item.sectionId} className={active === item.sectionId ? 'active' : ''} onClick={() => scrollToSection(item.sectionId)}><span className="nav-index">0{index + 1}</span><span>{item.label}</span><span className="nav-arrow">›</span></button>)}</nav></div><div className="sidebar-section"><h2>/social <span>03</span></h2><div className="sidebar-social">{person.socials.map(link => { const Icon = socialIcons[link.type]; return <a key={link.id} href={link.href} target={link.type === 'email' ? undefined : '_blank'} rel={link.type === 'email' ? undefined : 'noreferrer'}><Icon size={14} /><span>{link.label}</span><ArrowUpRight size={13} /></a>; })}</div></div><div className="sidebar-section now-playing"><h2>/now_playing <span>04</span></h2><div className="playing-title"><span className="green">▶</span> focus.exe</div><div className="playing-time">02:17 <span>/</span> 03:45</div><div className="progress-track"><span /></div><div className="equalizer" aria-hidden="true">{[13, 20, 15, 25, 18, 12, 22, 14, 19, 11, 17].map((height, index) => <i key={index} style={{ height, animationDelay: `${index * .16}s` }} />)}</div><p>“Good Code.<br /> Better Tomorrow.”</p></div></aside>;
}
