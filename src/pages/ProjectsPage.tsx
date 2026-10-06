import { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CRTOverlay } from '../components/effects/CRTOverlay';
import { SideDataStream } from '../components/effects/SideDataStream';
import { LoadingProjectCard, ProjectCard } from '../components/projects/ProjectCard';
import { DecryptingTextLoader } from '../components/ui/DecryptingTextLoader';
import { ResourceState } from '../components/ui/ResourceState';
import { usePortfolio } from '../context/PortfolioContext';

export function ProjectsPage() {
  const { projects, settings, retry } = usePortfolio();
  useEffect(() => { document.title = `All Projects | ${settings.data?.siteTitle || 'portfolioOS'}`; }, [settings.data?.siteTitle]);
  return <>{settings.data?.sideStreamEnabled && <SideDataStream />}{settings.data?.crtEnabled && <CRTOverlay />}<div className="project-detail-shell project-archive-shell"><header><Link to="/#projects"><ArrowLeft size={15} /> <DecryptingTextLoader value={settings.data?.terminalUsername} loading={settings.loading} estimatedLength={8} />@<DecryptingTextLoader value={settings.data?.terminalHostname} loading={settings.loading} estimatedLength={9} />:~$ /home</Link><span>PROJECT DIRECTORY</span></header><main><Link className="project-back" to="/#projects">← BACK TO PORTFOLIO</Link><div className="detail-heading project-archive-heading"><span>&gt; find ./projects -type project</span><h1>All Projects<span>_</span></h1><p>Everything I've built, explored, and shipped—loaded from the portfolio project directory.</p><div className="detail-meta"><span>● {projects.loading ? 'SCANNING' : `${String(projects.data.length).padStart(2, '0')} PROJECTS FOUND`}</span></div></div>{projects.error && <ResourceState name="projects" loading={false} error={projects.error} onRetry={retry} />}{!projects.loading && !projects.error && !projects.data.length && <ResourceState name="projects" loading={false} error={null} empty onRetry={retry} />}<div className="projects-grid">{projects.loading ? [0, 1, 2, 3].map(index => <LoadingProjectCard key={index} index={index} />) : projects.data.map((project, index) => <ProjectCard key={project.id} project={project} index={index} />)}</div></main></div></>;
}
