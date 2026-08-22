'use client'

import { useEffect } from 'react'
import type { Lang } from '@/app/data/evolution/types'

// Один root layout на весь сайт, поэтому `<html lang>` статически — «ru».
// На английских маршрутах честно переключаем атрибут после гидрации;
// до неё язык содержимого задаёт `lang` на `<main>`.
export function HtmlLang({ lang }: { lang: Lang }) {
  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])
  return null
}
