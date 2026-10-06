import { ArrowRight, FolderOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePortfolio } from '../../context/PortfolioContext';
import { LoadingProjectCard, ProjectCard } from '../projects/ProjectCard';
import { SectionCommand } from '../ui/SectionCommand';
import { ResourceState } from '../ui/ResourceState';

export function ProjectsSection() {
  const { projects: resource, retry } = usePortfolio();
  const projects = resource.data;
  const featuredProjects = projects.slice(0, 3);
  return <section id="projects" className="section standard-section"><SectionCommand command="ls ./projects" index="03" label="selected work" /><div className="section-heading heading-with-count"><div><span className="section-kicker">DIRECTORY: /PROJECTS</span><h2>Selected <span>work.</span></h2><p>Things I've built, explored, and shipped.</p></div><span className="count-label">{resource.loading ? 'FETCHING ITEMS...' : `${String(projects.length).padStart(2, '0')} ITEMS FOUND`}</span></div>{resource.error && <ResourceState name="projects" loading={false} error={resource.error} onRetry={retry} />}{!resource.loading && !resource.error && !projects.length && <ResourceState name="projects" loading={false} error={null} empty onRetry={retry} />}<div className="projects-grid">{resource.loading ? [0, 1, 2].map(index => <LoadingProjectCard key={index} index={index} />) : <>{featuredProjects.map((project, index) => <ProjectCard key={project.id} project={project} index={index} />)}<Link className="project-card project-more-card" to="/projects" aria-label="Explore all projects"><div className="project-image project-more-visual"><span className="project-image-label">MORE_PROJECTS</span><FolderOpen size={46} aria-hidden="true" /><span className="project-open-command">&gt; open ./projects</span></div><div className="project-card-body"><div className="project-topline"><span>04 / DIRECTORY</span><span className="project-status deployed">● OPEN</span></div><h3>&gt; more_projects <ArrowRight size={19} /></h3><p>Explore all projects</p><div className="project-links">View everything I've built <ArrowRight size={14} /></div></div></Link></>}</div></section>;
}
