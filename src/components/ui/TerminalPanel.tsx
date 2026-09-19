import type { ReactNode } from 'react';
interface TerminalPanelProps { title?: string; children: ReactNode; className?: string }
export function TerminalPanel({ title, children, className = '' }: TerminalPanelProps) {
  return <div className={`terminal-panel ${className}`}>{title && <div className="panel-heading"><span className="panel-dots"><i /><i /><i /></span><span>{title}</span><span className="panel-heading-end">×</span></div>}{children}</div>;
}
