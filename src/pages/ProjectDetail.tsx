import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, Github } from 'lucide-react';
import { portfolioService } from '../services/portfolio.service';
import type { ProjectRecord } from '../types/api';
import { usePortfolio } from '../context/PortfolioContext';
import { DecryptingTextLoader } from '../components/ui/DecryptingTextLoader';
import { TerminalSkeleton } from '../components/ui/TerminalSkeleton';
import { SideDataStream } from '../components/effects/SideDataStream';
import { CRTOverlay } from '../components/effects/CRTOverlay';

export function ProjectDetail() {
  const { slug } = useParams();
  const { settings: resource } = usePortfolio();
  const settings = resource.data;
  const [project, setProject] = useState<ProjectRecord | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    let active = true;
    setProject(null); setError(''); setLoading(true);
    if (!slug) { setError('Project missing'); setLoading(false); return; }
    portfolioService.project(slug).then(item => { if (active) setProject(item); }).catch(failure => { if (active) setError(failure instanceof Error ? failure.message : 'Unable to load project'); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [slug, revision]);
  return <>{settings?.sideStreamEnabled && <SideDataStream />}{settings?.crtEnabled && <CRTOverlay />}<div className="project-detail-shell"><header><Link to="/"><ArrowLeft size={15} /> <DecryptingTextLoader value={settings?.terminalUsername} loading={resource.loading} estimatedLength={8} />@<DecryptingTextLoader value={settings?.terminalHostname} loading={resource.loading} estimatedLength={9} />:~$ /projects</Link><span>PROJECT FILE</span></header><main><Link className="project-back" to="/#projects">← BACK TO PROJECTS</Link>{loading && <div className="resource-state"><DecryptingTextLoader loading estimatedLength={20} /><TerminalSkeleton lines={3} /></div>}{error && <div className="resource-state error" role="alert">ERR_FETCH_PROJECT: {error} <button onClick={() => setRevision(value => value + 1)}>[ RETRY ]</button> <Link to="/#projects">[ BACK ]</Link></div>}{!loading && !error && project && <><div className="detail-heading"><span>&gt; cat ./projects/{project.slug}</span><h1><DecryptingTextLoader value={project.name} estimatedLength={18} /><span>_</span></h1><p>{project.shortDescription}</p><div className="detail-meta"><span>● {project.status.toUpperCase()}</span>{project.year && <span>{project.year}</span>}{project.featured && <span>★ FEATURED</span>}</div></div>{project.thumbnail && <img className="detail-cover" src={project.thumbnail} alt={`${project.name} preview`} />}<div className="detail-actions">{project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noreferrer"><Github size={15} /> SOURCE <ArrowUpRight size={15} /></a>}{project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noreferrer">LIVE SITE <ArrowUpRight size={15} /></a>}</div><div className="detail-stack">{project.stack.map(item => <span key={item}>{item}</span>)}</div><div className="detail-sections">{([['Overview', project.overview], ['Problem', project.problem], ['Solution', project.solution], ['Challenges', project.challenges], ['Result', project.result]] as const).filter(([, content]) => !!content).map(([label, content]) => <section key={label}><h2>/ {label.toLowerCase()}</h2><p>{content}</p></section>)}{!!project.features.length && <section><h2>/ features</h2><ul>{project.features.map(feature => <li key={feature}>{feature}</li>)}</ul></section>}</div>{!!project.gallery.length && <div className="detail-gallery">{project.gallery.map((image, index) => <img key={`${image}-${index}`} src={image} loading="lazy" alt={`${project.name} gallery image ${index + 1}`} />)}</div>}</>}</main></div></>;
}


