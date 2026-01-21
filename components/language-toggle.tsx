"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"

interface LanguageToggleProps {
  lang: "en" | "ru"
  setLang: (lang: "en" | "ru") => void
}

export function LanguageToggle({ lang, setLang }: LanguageToggleProps) {
  return (
    <div className="flex items-center gap-0 border border-border rounded-md overflow-hidden">
      <Button
        variant={lang === "en" ? "default" : "ghost"}
        size="sm"
        className="rounded-none border-0 h-9 px-3"
        onClick={() => setLang("en")}
      >
        EN
      </Button>
      <Button
        variant={lang === "ru" ? "default" : "ghost"}
        size="sm"
        className="rounded-none border-0 h-9 px-3"
        onClick={() => setLang("ru")}
      >
        RU
      </Button>
    </div>
  )
}
