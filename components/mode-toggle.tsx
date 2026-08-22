"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

// Hydration guard without setState-in-effect: the server snapshot is `false`,
// the client snapshot is `true`, so the first client render after hydration
// flips to the real theme. Nothing to subscribe to — the value never changes
// after mount.
const subscribeNoop = () => () => {}
const getClientSnapshot = () => true
const getServerSnapshot = () => false

export function ModeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme()
  const mounted = React.useSyncExternalStore(subscribeNoop, getClientSnapshot, getServerSnapshot)

  const current = mounted ? (theme === "system" ? resolvedTheme : theme) : undefined
  const isDark = current === "dark"

  const toggle = () => setTheme(isDark ? "light" : "dark")

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className="relative inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background text-foreground shadow-xs transition hover:bg-muted"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}
