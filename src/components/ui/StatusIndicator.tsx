interface StatusIndicatorProps { label: string; pulse?: boolean }
export function StatusIndicator({ label, pulse = false }: StatusIndicatorProps) { return <span className="status-indicator"><span className={`status-dot ${pulse ? 'pulse' : ''}`} />{label}</span>; }
