const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : '');

export function apiUrl(path: string) {
  return `${API_BASE_URL}${path}`;
}

export function formatAssetUrl(url: string | undefined | null): string {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  if (url.startsWith('/admin/') || url === '/admin') {
    return url;
  }
  const cleanPath = url.startsWith('/') ? url : `/${url}`;
  return `/admin${cleanPath}`;
}
