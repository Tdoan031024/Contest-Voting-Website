export function apiUrl(path: string) {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `/admin${cleanPath}`;
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
