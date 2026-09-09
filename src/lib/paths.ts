/** Prefix an in-site path or hash with Astro `base` (project Pages). */
export function withBase(path = ''): string {
  const base = import.meta.env.BASE_URL;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  if (path.startsWith('#')) return `${base}${path}`;
  const trimmed = path.replace(/^\/+/, '');
  return `${base}${trimmed}`;
}
