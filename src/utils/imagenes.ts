const BASE_URL = import.meta.env.VITE_API_URL as string;

export function resolveImgUrl(url: string | null | undefined): string {
  if (!url) return "";
  const u = String(url).trim();
  if (!u) return "";
  if (u.startsWith("http://") || u.startsWith("https://")) return u;
  if (u.startsWith("/")) return BASE_URL + u;
  return BASE_URL + "/" + u;
}