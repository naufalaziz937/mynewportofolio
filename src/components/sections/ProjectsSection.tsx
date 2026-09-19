import { ArrowUpRight, Github } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePortfolio } from '../../context/PortfolioContext';
import type { Project } from '../../types/portfolio';
import { SectionCommand } from '../ui/SectionCommand';
import { ResourceState } from '../ui/ResourceState';

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return <article className="project-card"><div className="project-image">{project.image ? <img src={project.image} alt={`${project.name} interface preview`} loading="lazy" /> : <div className="project-image-empty">{project.name}</div>}<span className="project-image-label">PROJECT_{String(index + 1).padStart(2, '0')}</span><span className="project-open-command">&gt; open ./projects/{project.slug}</span></div><div className="project-card-body"><div className="project-topline"><span>{String(index + 1).padStart(2, '0')} / DIRECTORY {project.featured && '★ FEATURED'}</span><span className={`project-status ${project.status}`}>● {project.status.toUpperCase()}</span></div><h3>{project.name}<ArrowUpRight size={19} /></h3><p>{project.description}</p><div className="project-stack">{project.stack.map(tech => <span key={tech}>{tech}</span>)}</div><div className="project-links"><Link to={`/projects/${project.slug}`}><ArrowUpRight size={14} /> OPEN</Link>{project.github && <a href={project.github} target="_blank" rel="noreferrer"><Github size={14} /> SOURCE</a>}{project.live && <a href={project.live} target="_blank" rel="noreferrer"><ArrowUpRight size={14} /> LIVE</a>}{!project.github && !project.live && <span>LOCAL PREVIEW <span className="muted">// links coming soon</span></span>}</div></div></article>;
}
export function ProjectsSection() {
  const { projects: resource, retry } = usePortfolio();
  const projects = resource.data;
  return <section id="projects" className="section standard-section"><SectionCommand command="ls ./projects" index="02" label="selected work" /><div className="section-heading heading-with-count"><div><span className="section-kicker">DIRECTORY: /PROJECTS</span><h2>Selected <span>work.</span></h2><p>Things I've built, explored, and shipped.</p></div><span className="count-label">{String(projects.length).padStart(2, '0')} ITEMS FOUND</span></div><ResourceState name="projects" loading={resource.loading} error={resource.error} empty={!projects.length} onRetry={retry} /><div className="projects-grid">{projects.map((project, index) => <ProjectCard key={project.id} project={project} index={index} />)}</div></section>;
}
