import { usePortfolio } from '../../context/PortfolioContext';
import { SectionCommand } from '../ui/SectionCommand';
import { TerminalPanel } from '../ui/TerminalPanel';
import { ResourceState } from '../ui/ResourceState';

export function SkillsSection() {
  const { skills: resource, retry } = usePortfolio();
  const skills = resource.data;
  return <section id="skills" className="section standard-section"><SectionCommand command="packages --list" index="03" label="toolkit" /><div className="section-heading"><span className="section-kicker">ENVIRONMENT: PRODUCTION</span><h2>Tech <span>stack.</span></h2><p>Tools I reach for to turn ideas into working software.</p></div><ResourceState name="skills" loading={resource.loading} error={resource.error} empty={!skills.length} onRetry={retry} />{!!skills.length && <TerminalPanel title="package-manager // installed"><div className="skills-content"><div className="skills-table-header"><span>PACKAGE</span><span>CATEGORY</span><span>STATUS</span></div>{skills.map((skill, index) => <div className="skill-row" key={skill.id}><span><i>{String(index + 1).padStart(2, '0')}</i>{skill.name}</span><span>{skill.category}</span><span className="green">● INSTALLED</span></div>)}<div className="skills-footer">{skills.length} packages installed <span>0 vulnerabilities found</span></div></div></TerminalPanel>}</section>;
}
