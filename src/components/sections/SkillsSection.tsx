import { usePortfolio } from '../../context/PortfolioContext';
import { SectionCommand } from '../ui/SectionCommand';
import { TerminalPanel } from '../ui/TerminalPanel';
import { ResourceState } from '../ui/ResourceState';
import { DecryptingTextLoader } from '../ui/DecryptingTextLoader';

export function SkillsSection() {
  const { skills: resource, retry } = usePortfolio();
  const skills = resource.data;
  return <section id="skills" className="section standard-section"><SectionCommand command="packages --list" index="04" label="toolkit" /><div className="section-heading"><span className="section-kicker">ENVIRONMENT: PRODUCTION</span><h2>Tech <span>stack.</span></h2><p>Tools I reach for to turn ideas into working software.</p></div>{!resource.loading && <ResourceState name="skills" loading={false} error={resource.error} empty={!skills.length} onRetry={retry} />}{(resource.loading || !!skills.length) && <TerminalPanel title="package-manager // installed"><div className="skills-content"><div className="skills-table-header"><span>PACKAGE</span><span>CATEGORY</span><span>STATUS</span></div>{resource.loading ? [0, 1, 2, 3].map(index => <div className="skill-row loading-skill-row" key={index}><span><i>{String(index + 1).padStart(2, '0')}</i><DecryptingTextLoader loading estimatedLength={10} /></span><span><DecryptingTextLoader loading estimatedLength={8} /></span><span>● FETCHING</span></div>) : skills.map((skill, index) => <div className="skill-row" key={skill.id}><span><i>{String(index + 1).padStart(2, '0')}</i>{skill.name}</span><span>{skill.category}</span><span className="green">● INSTALLED</span></div>)}<div className="skills-footer">{resource.loading ? 'FETCHING_PACKAGES...' : `${skills.length} packages installed`} <span>{!resource.loading && '0 vulnerabilities found'}</span></div></div></TerminalPanel>}</section>;
}
