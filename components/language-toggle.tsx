"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface LanguageToggleProps {
  currentLang: "en" | "ru"
}

function buildPath(pathname: string, currentLang: "en" | "ru", newLang: "en" | "ru") {
  const segments = pathname.split("/").filter(Boolean)
  if (segments[0] === currentLang) {
    segments[0] = newLang
  } else {
    segments.unshift(newLang)
  }
  return "/" + segments.join("/")
}

export function LanguageToggle({ currentLang }: LanguageToggleProps) {
  const pathname = usePathname() || `/${currentLang}`

  const base =
    "inline-flex h-9 items-center justify-center px-3 text-sm font-medium transition-colors"
  const active = "bg-primary text-primary-foreground"
  const inactive = "text-foreground hover:bg-muted"

  return (
    <div className="flex items-center overflow-hidden rounded-md border border-border">
      <Link
        href={buildPath(pathname, currentLang, "en")}
        aria-current={currentLang === "en" ? "page" : undefined}
        className={cn(base, currentLang === "en" ? active : inactive)}
      >
        EN
      </Link>
      <Link
        href={buildPath(pathname, currentLang, "ru")}
        aria-current={currentLang === "ru" ? "page" : undefined}
        className={cn(base, currentLang === "ru" ? active : inactive)}
      >
        RU
      </Link>
    </div>
  )
}
