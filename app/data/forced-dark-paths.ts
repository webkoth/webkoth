import { avtomatizaciyaPath } from './avtomatizaciya/path'

// Страницы, которые всегда тёмные, при любой системной теме и выборе в тумблере.
// Тема форсится на весь документ через next-themes `forcedTheme` (components/site-theme-provider.tsx):
// класс dark на <html> нужен фону частиц, overscroll и палитре, обёртка внутри страницы этого не даёт.
export const FORCED_DARK_PATHS: readonly string[] = [avtomatizaciyaPath]

export function isForcedDarkPath(pathname: string | null | undefined): boolean {
  if (!pathname) return false
  const normalized = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname
  return FORCED_DARK_PATHS.includes(normalized)
}
