import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { manageService } from '../../services/manage.service';
import type { Overview } from '../../types/api';

export function ManageDashboard() {
  const [data, setData] = useState<Overview | null>(null);
  const [error, setError] = useState('');
  useEffect(() => { manageService.overview().then(setData).catch(failure => setError(failure instanceof Error ? failure.message : 'Unable to load overview')); }, []);
  return <div className="manage-page"><div className="manage-heading"><span>&gt; system_overview</span><h1>WELCOME BACK, ADMIN<span>_</span></h1><p>Manage the content powering your portfolio.</p></div>{error && <div className="manage-error" role="alert">ERR_OVERVIEW: {error}</div>}{!data && !error && <div className="manage-loading">FETCHING_OVERVIEW...</div>}{data && <><div className="manage-stats">{(['projects', 'skills', 'experience', 'certificates', 'messages'] as const).map(key => <Link to={`/manage/${key}`} key={key}><span>{key.toUpperCase()}</span><strong>{data[key]}</strong><small>{key === 'messages' ? `${data.unread} unread` : 'records'}</small></Link>)}</div><section className="manage-panel"><h2>/system_status</h2><dl><div><dt>API</dt><dd>● {data.api.toUpperCase()}</dd></div><div><dt>DATABASE</dt><dd>● {data.database.toUpperCase()}</dd></div><div><dt>SESSION</dt><dd>● {data.session.toUpperCase()}</dd></div></dl></section></>}</div>;
}
