"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { ThemeProvider } from "@/components/theme-provider"
import { isForcedDarkPath } from "@/app/data/forced-dark-paths"

// Тема сайта с учётом страницы. На путях из FORCED_DARK_PATHS тема форсится в dark на весь
// документ: next-themes ставит класс ещё во встроенном скрипте до гидрации (без светлой
// вспышки) и не трогает сохранённый выбор посетителя — на остальных страницах остаётся system.
// Отдельно от components/theme-provider.tsx: тот раздаётся в shadcn-реестре (public/r) и не
// должен знать о страницах сайта.
export function SiteThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof ThemeProvider>) {
  const pathname = usePathname()
  const forcedTheme = isForcedDarkPath(pathname) ? "dark" : props.forcedTheme
  return (
    <ThemeProvider {...props} forcedTheme={forcedTheme}>
      {children}
    </ThemeProvider>
  )
}
