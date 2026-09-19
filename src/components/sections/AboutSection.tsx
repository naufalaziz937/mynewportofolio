import { profile } from '../../data/profile';
import { usePortfolio } from '../../context/PortfolioContext';
import { ResourceState } from '../ui/ResourceState';
import { SectionCommand } from '../ui/SectionCommand';
import { TerminalPanel } from '../ui/TerminalPanel';

export function AboutSection() {
  const { profile: resource, retry } = usePortfolio();
  const person = resource.data ?? profile;
  return <section id="about" className="section standard-section"><SectionCommand command="cat ./about_me.txt" index="01" label="about" /><div className="section-heading"><span className="section-kicker">FILE: 01 / 07</span><h2>About <span>me.</span></h2><p>A little context behind the code.</p></div>{resource.error && <ResourceState name="profile" loading={false} error={resource.error} onRetry={retry} />}<TerminalPanel title="about_me.txt"><div className="about-content">{person.profileImage && <img className="about-profile-image" src={person.profileImage} alt={`${person.name} portrait`} />}<div className="about-file-label">ABOUT_ME.TXT <span>— 1 file, 4 fields</span></div><dl className="about-details"><div><dt>NAME</dt><dd>{person.name}</dd></div><div><dt>ROLE</dt><dd>{person.role}</dd></div><div><dt>LOCATION</dt><dd>{person.location}</dd></div><div><dt>STATUS</dt><dd className="green">● {person.status}</dd></div></dl><div className="file-divider" /><p className="about-bio">{person.biography}</p><div className="about-signoff">// Always curious. Always building.</div></div></TerminalPanel></section>;
}
