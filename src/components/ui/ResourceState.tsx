interface ResourceStateProps { name: string; loading: boolean; error: string | null; empty?: boolean; onRetry: () => void }
export function ResourceState({ name, loading, error, empty, onRetry }: ResourceStateProps) {
  if (loading) return <div className="resource-state" role="status"><span>FETCHING_{name.toUpperCase()}...</span><div className="resource-progress">[██████████░░░░░░]</div></div>;
  if (error) return <div className="resource-state error" role="alert"><strong>ERR_FETCH_{name.toUpperCase()}</strong><p>Unable to retrieve {name.toLowerCase()} data. {error}</p><button onClick={onRetry}>[ RETRY ]</button></div>;
  if (empty) return <div className="resource-state"><span>0 FILES FOUND IN /{name.toLowerCase()}</span></div>;
  return null;
}
