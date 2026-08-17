export function getBasePath() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  if (!basePath || basePath === '/') return '';
  return basePath.startsWith('/') ? basePath : `/${basePath}`;
}

export function withBasePath(path = '') {
  if (!path) {
    const basePath = getBasePath();
    return basePath || '/';
  }
  if (
    typeof path === 'string' &&
    (path.startsWith('data:') || path.startsWith('http://') || path.startsWith('https://'))
  ) {
    return path;
  }
  const basePath = getBasePath();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (!basePath) return cleanPath;
  return `${basePath.replace(/\/$/, '')}${cleanPath}`;
}
