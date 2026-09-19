import type { ApiError, ApiResponse } from '../types/api';
const base = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '');

export class ApiRequestError extends Error { constructor(public status: number, message: string, public issues: ApiError['issues'] = []) { super(message); } }
export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  if (options.body && !(options.body instanceof FormData) && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  let response: Response;
  try { response = await fetch(`${base}/api${path}`, { ...options, credentials: 'include', headers }); }
  catch { throw new ApiRequestError(0, 'Cannot connect to the portfolio API. Try again later.'); }
  let payload: ApiResponse<T> | ApiError;
  try { payload = await response.json() as ApiResponse<T> | ApiError; }
  catch { throw new ApiRequestError(response.status, 'The portfolio API returned an invalid response.'); }
  if (!response.ok || !payload.success) { const error = payload as ApiError; throw new ApiRequestError(response.status, error.message ?? 'Request failed', error.issues); }
  return (payload as ApiResponse<T>).data;
}
