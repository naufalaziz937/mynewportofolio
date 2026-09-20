import { FolderGit2 } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { DecryptingTextLoader } from '../ui/DecryptingTextLoader';
import { TerminalPanel } from '../ui/TerminalPanel';
import { TerminalSkeleton } from '../ui/TerminalSkeleton';

export function LatestCommit() {
  const { projects } = usePortfolio();
  const featured = projects.data.find(project => project.featured) ?? projects.data[0];
  return <div className="latest-commit"><div className="section-command"><span className="command-chevron">&gt;</span> featured_project<span className="command-tail" /><span className="command-meta">// selected work</span></div><TerminalPanel title="ls ./projects --featured"><div className="commit-content"><div className="commit-meta"><span><FolderGit2 size={16} /> project <b><DecryptingTextLoader value={featured?.slug} loading={projects.loading} estimatedLength={12} /></b></span><span>portfolio activity</span></div><h3>{projects.loading ? <DecryptingTextLoader loading estimatedLength={20} /> : featured?.name || (projects.error ? 'Unable to load projects.' : 'No featured project yet.')}</h3><div className="commit-changes">{projects.loading ? <TerminalSkeleton lines={2} /> : featured?.stack.map(item => <span key={item}>+ {item}</span>)}</div></div></TerminalPanel></div>;
}
