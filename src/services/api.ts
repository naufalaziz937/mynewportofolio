import type { ApiError, ApiResponse } from '../types/api';
const base = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '');

export class ApiRequestError extends Error { constructor(public status: number, message: string, public issues: ApiError['issues'] = []) { super(message); } }

function isApiEnvelope(payload: unknown): payload is ApiResponse<unknown> | ApiError {
  return typeof payload === 'object' && payload !== null && 'success' in payload && typeof payload.success === 'boolean';
}

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  if (options.body && !(options.body instanceof FormData) && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  let response: Response;
  try { response = await fetch(`${base}/api${path}`, { ...options, credentials: 'include', headers }); }
  catch { throw new ApiRequestError(0, 'Cannot connect to the portfolio API. Try again later.'); }
  const contentType = response.headers.get('content-type')?.toLowerCase() ?? '';
  if (!contentType.includes('application/json')) throw new ApiRequestError(response.status, 'The portfolio service is temporarily unavailable.');
  let payload: unknown;
  try { payload = await response.json(); }
  catch { throw new ApiRequestError(response.status, 'The portfolio service returned malformed JSON.'); }
  if (!isApiEnvelope(payload)) throw new ApiRequestError(response.status, 'The portfolio service returned an unexpected response.');
  if (!response.ok || !payload.success) { const error = payload as ApiError; throw new ApiRequestError(response.status, error.message ?? 'Request failed', error.issues); }
  if (!('data' in payload)) throw new ApiRequestError(response.status, 'The portfolio service response is missing data.');
  return payload.data as T;
}
