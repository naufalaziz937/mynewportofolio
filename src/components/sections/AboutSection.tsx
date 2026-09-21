import { usePortfolio } from '../../context/PortfolioContext';
import { DecryptingTextLoader } from '../ui/DecryptingTextLoader';
import { ResourceState } from '../ui/ResourceState';
import { SectionCommand } from '../ui/SectionCommand';
import { TerminalPanel } from '../ui/TerminalPanel';
import { TerminalSkeleton } from '../ui/TerminalSkeleton';

export function AboutSection() {
  const { profile: resource, retry } = usePortfolio();
  const person = resource.data;
  return <section id="about" className="section standard-section"><SectionCommand command="cat ./about_me.txt" index="01" label="about" /><div className="section-heading"><span className="section-kicker">FILE: 01 / 08</span><h2>About <span>me.</span></h2><p>A little context behind the code.</p></div><TerminalPanel title="about_me.txt"><div className="about-content">
    {person?.profileImage && <img className="about-profile-image" src={person.profileImage} alt={`${person.name} portrait`} />}
    <div className="about-file-label">ABOUT_ME.TXT <span>— 1 file, 4 fields</span></div>
    <dl className="about-details"><div><dt>NAME</dt><dd><DecryptingTextLoader value={person?.name} loading={resource.loading} estimatedLength={8} /></dd></div><div><dt>ROLE</dt><dd><DecryptingTextLoader value={person?.role} loading={resource.loading} estimatedLength={20} /></dd></div><div><dt>LOCATION</dt><dd><DecryptingTextLoader value={person?.location} loading={resource.loading} estimatedLength={17} /></dd></div><div><dt>STATUS</dt><dd className="green">● <DecryptingTextLoader value={person?.status} loading={resource.loading} estimatedLength={9} /></dd></div></dl>
    <div className="file-divider" /><div className="about-bio">{resource.loading ? <TerminalSkeleton lines={3} /> : person?.biography}</div>
    {resource.error && <ResourceState name="profile" loading={false} error={resource.error} onRetry={retry} />}
    {!resource.loading && !resource.error && !person && <ResourceState name="profile" loading={false} error={null} empty onRetry={retry} />}
    <div className="about-signoff">// Always curious. Always building.</div>
  </div></TerminalPanel></section>;
}
