import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { authService } from '../services/auth.service';

interface AuthContextValue { authenticated: boolean; loading: boolean; login: (password: string) => Promise<void>; logout: () => Promise<void>; refresh: () => Promise<void> }
const AuthContext = createContext<AuthContextValue | null>(null);
export function AuthProvider({ children }: { children: ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const refresh = useCallback(async () => { try { const session = await authService.me(); setAuthenticated(session.authenticated); } catch { setAuthenticated(false); } finally { setLoading(false); } }, []);
  useEffect(() => { void refresh(); }, [refresh]);
  const login = async (password: string) => { await authService.login(password); setAuthenticated(true); };
  const logout = async () => { await authService.logout(); setAuthenticated(false); };
  return <AuthContext.Provider value={{ authenticated, loading, login, logout, refresh }}>{children}</AuthContext.Provider>;
}
export function useAuth(): AuthContextValue { const value = useContext(AuthContext); if (!value) throw new Error('AuthProvider missing'); return value; }
