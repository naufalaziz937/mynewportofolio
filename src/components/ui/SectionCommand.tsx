interface SectionCommandProps { command: string; index?: string; label?: string }
export function SectionCommand({ command, index, label }: SectionCommandProps) {
  return <div className="section-command"><span className="command-chevron">&gt;</span> {command}<span className="command-tail" /><span className="command-meta">{index && `// ${index}`} {label}</span></div>;
}
