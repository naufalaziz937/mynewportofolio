import { usePortfolio } from '../../context/PortfolioContext';
import { SectionCommand } from '../ui/SectionCommand';
import { ResourceState } from '../ui/ResourceState';
import { DecryptingTextLoader } from '../ui/DecryptingTextLoader';
import { TerminalSkeleton } from '../ui/TerminalSkeleton';

export function ExperienceSection() {
  const { experience: resource, retry } = usePortfolio();
  const experience = resource.data;
  const year = (date?: string) => date ? new Date(date).getFullYear() : '';
  return <section id="experience" className="section standard-section"><SectionCommand command="git log --experience" index="04" label="history" /><div className="section-heading"><span className="section-kicker">BRANCH: GROWTH</span><h2>Experience<span>.</span></h2><p>A record of learning, building, and improving.</p></div>{!resource.loading && <ResourceState name="experience" loading={false} error={resource.error} empty={!experience.length} onRetry={retry} />}<div className="experience-timeline">{resource.loading ? [0, 1].map(index => <article className="experience-item loading-experience" key={index}><span className="timeline-node" /><div className="experience-meta"><span>commit <DecryptingTextLoader loading estimatedLength={7} /></span><DecryptingTextLoader loading estimatedLength={12} /></div><h3><DecryptingTextLoader loading estimatedLength={19} /></h3><div className="experience-company">@ <DecryptingTextLoader loading estimatedLength={13} /></div><p><TerminalSkeleton lines={2} /></p></article>) : experience.map(item => <article className="experience-item" key={item.id}><span className="timeline-node" /><div className="experience-meta"><span>commit {item.id.slice(-7)}</span><span>{year(item.startDate)} — {item.current ? 'Present' : year(item.endDate)}</span></div><h3>{item.role}</h3><div className="experience-company">{item.companyLogo && <img src={item.companyLogo} alt="" />}@ {item.company}</div><p>{item.description}</p><div className="experience-tags">{item.technologies.map(tech => <span key={tech}>{tech}</span>)}</div></article>)}</div></section>;
}
