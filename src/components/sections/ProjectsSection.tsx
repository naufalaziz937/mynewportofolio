import { ArrowUpRight, Github } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePortfolio } from '../../context/PortfolioContext';
import type { Project } from '../../types/portfolio';
import { SectionCommand } from '../ui/SectionCommand';
import { ResourceState } from '../ui/ResourceState';
import { DecryptingTextLoader } from '../ui/DecryptingTextLoader';
import { TerminalSkeleton } from '../ui/TerminalSkeleton';

function LoadingProjectCard({ index }: { index: number }) {
  return <article className="project-card loading-project-card" aria-label="Loading project"><div className="project-image"><span className="project-image-label">PROJECT_{String(index + 1).padStart(2, '0')}</span>▓▓▓▓▓▓▓▓▓▓</div><div className="project-card-body"><div className="project-topline"><span>{String(index + 1).padStart(2, '0')} / DIRECTORY</span><DecryptingTextLoader loading estimatedLength={9} /></div><h3><DecryptingTextLoader loading estimatedLength={17} /></h3><p><TerminalSkeleton lines={2} /></p><div className="project-stack"><DecryptingTextLoader loading estimatedLength={5} /> &nbsp; <DecryptingTextLoader loading estimatedLength={5} /> &nbsp; <DecryptingTextLoader loading estimatedLength={5} /></div><div className="project-links">&gt; LOADING_PROJECT...</div></div></article>;
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return <article className="project-card"><div className="project-image">{project.image ? <img src={project.image} alt={`${project.name} interface preview`} loading="lazy" /> : <div className="project-image-empty">{project.name}</div>}<span className="project-image-label">PROJECT_{String(index + 1).padStart(2, '0')}</span><span className="project-open-command">&gt; open ./projects/{project.slug}</span></div><div className="project-card-body"><div className="project-topline"><span>{String(index + 1).padStart(2, '0')} / DIRECTORY {project.featured && '★ FEATURED'}</span><span className={`project-status ${project.status}`}>● {project.status.toUpperCase()}</span></div><h3><DecryptingTextLoader value={project.name} estimatedLength={17} /><ArrowUpRight size={19} /></h3><p>{project.description}</p><div className="project-stack">{project.stack.map(tech => <span key={tech}><DecryptingTextLoader value={tech} estimatedLength={6} /></span>)}</div><div className="project-links"><Link to={`/projects/${project.slug}`}><ArrowUpRight size={14} /> OPEN</Link>{project.github && <a href={project.github} target="_blank" rel="noreferrer"><Github size={14} /> SOURCE</a>}{project.live && <a href={project.live} target="_blank" rel="noreferrer"><ArrowUpRight size={14} /> LIVE</a>}{!project.github && !project.live && <span>LOCAL PREVIEW <span className="muted">// links coming soon</span></span>}</div></div></article>;
}
export function ProjectsSection() {
  const { projects: resource, retry } = usePortfolio();
  const projects = resource.data;
  return <section id="projects" className="section standard-section"><SectionCommand command="ls ./projects" index="03" label="selected work" /><div className="section-heading heading-with-count"><div><span className="section-kicker">DIRECTORY: /PROJECTS</span><h2>Selected <span>work.</span></h2><p>Things I've built, explored, and shipped.</p></div><span className="count-label">{resource.loading ? 'FETCHING ITEMS...' : `${String(projects.length).padStart(2, '0')} ITEMS FOUND`}</span></div>{resource.error && <ResourceState name="projects" loading={false} error={resource.error} onRetry={retry} />}{!resource.loading && !resource.error && !projects.length && <ResourceState name="projects" loading={false} error={null} empty onRetry={retry} />}<div className="projects-grid">{resource.loading ? [0, 1].map(index => <LoadingProjectCard key={index} index={index} />) : projects.map((project, index) => <ProjectCard key={project.id} project={project} index={index} />)}</div></section>;
}
