import { usePortfolio } from '../../context/PortfolioContext';
import { SectionCommand } from '../ui/SectionCommand';
import { ResourceState } from '../ui/ResourceState';

export function ExperienceSection() {
  const { experience: resource, retry } = usePortfolio();
  const experience = resource.data;
  const year = (date?: string) => date ? new Date(date).getFullYear() : '';
  return <section id="experience" className="section standard-section"><SectionCommand command="git log --experience" index="04" label="history" /><div className="section-heading"><span className="section-kicker">BRANCH: GROWTH</span><h2>Experience<span>.</span></h2><p>A record of learning, building, and improving.</p></div><ResourceState name="experience" loading={resource.loading} error={resource.error} empty={!experience.length} onRetry={retry} /><div className="experience-timeline">{experience.map(item => <article className="experience-item" key={item.id}><span className="timeline-node" /><div className="experience-meta"><span>commit {item.id.slice(-7)}</span><span>{year(item.startDate)} — {item.current ? 'Present' : year(item.endDate)}</span></div><h3>{item.role}</h3><div className="experience-company">{item.companyLogo && <img src={item.companyLogo} alt="" />}@ {item.company}</div><p>{item.description}</p><div className="experience-tags">{item.technologies.map(tech => <span key={tech}>{tech}</span>)}</div></article>)}</div></section>;
}
