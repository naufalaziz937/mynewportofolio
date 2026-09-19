import { api } from './api';
export const authService = {
  me: () => api<{ authenticated: boolean }>('/auth/me'),
  login: (password: string) => api<{ authenticated: boolean }>('/auth/login', { method: 'POST', body: JSON.stringify({ password }) }),
  logout: () => api<{ authenticated: boolean }>('/auth/logout', { method: 'POST' })
};
