const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : '');

export function apiUrl(path: string) {
  return `${API_BASE_URL}${path}`;
}
