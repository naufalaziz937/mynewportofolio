import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { LayoutDashboard, UserRound, FolderGit2, Blocks, GitBranch, Award, SlidersHorizontal, Mail, LogOut, Menu, X, ExternalLink } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const links = [
  { to: '/manage', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/manage/profile', label: 'Profile', icon: UserRound },
  { to: '/manage/projects', label: 'Projects', icon: FolderGit2 },
  { to: '/manage/skills', label: 'Skills', icon: Blocks },
  { to: '/manage/experience', label: 'Experience', icon: GitBranch },
  { to: '/manage/certificates', label: 'Certificates', icon: Award },
  { to: '/manage/appearance', label: 'Appearance', icon: SlidersHorizontal },
  { to: '/manage/messages', label: 'Messages', icon: Mail }
];
export function ManageLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState('');
  const signOut = async () => { setLoggingOut(true); setLogoutError(''); try { await logout(); navigate('/', { replace: true }); } catch { setLogoutError('Unable to terminate the server session. Please retry.'); } finally { setLoggingOut(false); } };
  return <div className="manage-shell"><header className="manage-mobile-header"><span>root@manage:~#</span><button onClick={() => setOpen(!open)} aria-label="Toggle management navigation">{open ? <X size={20} /> : <Menu size={20} />}</button></header>{open && <div className="manage-nav-backdrop" onClick={() => setOpen(false)} />}<aside className={`manage-sidebar ${open ? 'open' : ''}`}><div className="manage-brand"><span>root@manage:~#</span><small>CONTROL PANEL / v1.0</small></div><nav aria-label="Management navigation">{links.map(({ to, label, icon: Icon, end }) => <NavLink key={to} to={to} end={end} className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setOpen(false)}><Icon size={16} />{label}<span>›</span></NavLink>)}</nav><div className="manage-sidebar-bottom"><a href="/" target="_blank" rel="noreferrer"><ExternalLink size={15} /> View portfolio</a><button onClick={() => { void signOut(); }} disabled={loggingOut}><LogOut size={15} />{loggingOut ? 'Logging out...' : 'Logout'}</button></div></aside><main className="manage-main"><div className="manage-topline"><span>/manage / secure workspace</span><span><i /> ADMIN SESSION ACTIVE</span></div>{logoutError && <div className="manage-error" role="alert">{logoutError}</div>}<Outlet /></main></div>;
}
