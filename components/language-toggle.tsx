"use client"

import * as React from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"

interface LanguageToggleProps {
  currentLang: "en" | "ru"
}

export function LanguageToggle({ currentLang }: LanguageToggleProps) {
  const router = useRouter()
  const pathname = usePathname()

  const switchLanguage = (newLang: "en" | "ru") => {
    if (newLang === currentLang) return
    
    // Replace the current lang in the pathname
    const newPath = pathname.replace(`/${currentLang}`, `/${newLang}`)
    router.push(newPath)
  }

  return (
    <div className="flex items-center gap-0 border border-border rounded-md overflow-hidden">
      <Button
        variant={currentLang === "en" ? "default" : "ghost"}
        size="sm"
        className="rounded-none border-0 h-9 px-3"
        onClick={() => switchLanguage("en")}
      >
        EN
      </Button>
      <Button
        variant={currentLang === "ru" ? "default" : "ghost"}
        size="sm"
        className="rounded-none border-0 h-9 px-3"
        onClick={() => switchLanguage("ru")}
      >
        RU
      </Button>
    </div>
  )
}
