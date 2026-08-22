'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

// Кнопка «скопировать в буфер» с тостом: буфер невидим, поэтому результат
// действия показывается явно. На пару секунд иконка меняется на галочку.
export function CopyButton({
  value,
  label,
  done,
  className,
}: {
  value: string
  /** aria-label и title: «Скопировать». */
  label: string
  /** Текст тоста: «Скопировано». */
  done: string
  className?: string
}) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      toast.success(done, { description: value, duration: 2500 })
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      // Без доступа к буферу (http, старые браузеры) — показываем значение, пусть скопируют руками.
      toast(value)
    }
  }

  const Icon = copied ? Check : Copy
  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`${label}: ${value}`}
      title={label}
      className={cn(
        'inline-flex size-8 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition hover:border-primary/50 hover:text-primary',
        copied && 'text-primary',
        className,
      )}
    >
      <Icon className="size-3.5" aria-hidden />
    </button>
  )
}
