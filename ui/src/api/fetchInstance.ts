const API_BASE_URL = 'http://localhost:8009/api';

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const apiKey = localStorage.getItem('GROCY_API_KEY');

  const headers = new Headers(options.headers);
  if (apiKey) headers.set('GROCY-API-KEY', apiKey);

  // Add JSON headers automatically if body is an object
  if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
    options.body = JSON.stringify(options.body);
  }

  const res = await fetch(`${API_BASE_URL}${url}`, { ...options, headers });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Request failed: ${res.status} - ${error}`);
  }

  // If no content
  if (res.status === 204) return null as T;

  return res.json();
}

export const api = {
  get: <T>(url: string) => request<T>(url),
  post: <T>(url: string, body?: any) => request<T>(url, { method: 'POST', body }),
  put:  <T>(url: string, body?: any) => request<T>(url, { method: 'PUT', body }),
};