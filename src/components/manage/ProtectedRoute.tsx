import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
export function ProtectedRoute() {
  const { loading, authenticated } = useAuth();
  if (loading) return <div className="manage-gate">&gt; VERIFYING_SESSION...</div>;
  return authenticated ? <Outlet /> : <Navigate to="/" replace />;
}
