export function TerminalSkeleton({ lines = 3, className = '' }: { lines?: number; className?: string }) {
  return <span className={`terminal-skeleton ${className}`} role="status" aria-label="Loading content">{Array.from({ length: lines }, (_, index) => <span key={index} style={{ width: `${[91, 72, 83, 58][index % 4]}%` }} />)}</span>;
}
