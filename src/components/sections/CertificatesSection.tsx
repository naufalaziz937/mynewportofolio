import { Award, ArrowUpRight } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { SectionCommand } from '../ui/SectionCommand';
import { TerminalPanel } from '../ui/TerminalPanel';
import { ResourceState } from '../ui/ResourceState';

export function CertificatesSection() {
  const { certificates: resource, retry } = usePortfolio();
  const certificates = resource.data;
  return <section id="certificates" className="section standard-section"><SectionCommand command="ls ./certificates" index="05" label="credentials" /><div className="section-heading"><span className="section-kicker">DIRECTORY: /CERTIFICATES</span><h2>Credentials<span>.</span></h2><p>Learning milestones and verified achievements.</p></div><ResourceState name="certificates" loading={resource.loading} error={resource.error} onRetry={retry} />{!resource.loading && !resource.error && (certificates.length ? <div className="certificates-grid">{certificates.map((certificate, index) => <article className="certificate-card" key={certificate.id}>{certificate.image && <img src={certificate.image} alt={`${certificate.name} certificate preview`} loading="lazy" />}<div><span>CERT_{String(index + 1).padStart(3, '0')}</span><h3>{certificate.name}</h3><p>{certificate.issuer} / {new Date(certificate.issueDate).getFullYear()}</p>{certificate.credentialUrl && <a href={certificate.credentialUrl} target="_blank" rel="noreferrer">OPEN CREDENTIAL <ArrowUpRight size={14} /></a>}</div></article>)}</div> : <TerminalPanel title="certificates // directory"><div className="empty-state"><Award size={28} /><div><strong>No public credentials listed yet.</strong><p>This directory is ready for verified certificates.</p></div><span>0 FILES</span></div></TerminalPanel>)}</section>;
}
