import { GitCommitHorizontal } from 'lucide-react';
import { TerminalPanel } from '../ui/TerminalPanel';

export function LatestCommit() {
  return <div className="latest-commit"><div className="section-command"><span className="command-chevron">&gt;</span> latest_commit<span className="command-tail" /><span className="command-meta">// activity</span></div><TerminalPanel title="git log --oneline -1"><div className="commit-content"><div className="commit-meta"><span><GitCommitHorizontal size={16} /> commit <b>a82df92</b></span><span>recent activity</span></div><h3>Update portfolio: improve UI and add new projects</h3><div className="commit-changes"><span>+ Refactor components</span><span>+ Optimize animations</span><span>+ Add new content</span></div></div></TerminalPanel></div>;
}
