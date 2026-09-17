'use client'

import type { Option } from '@/app/data/brief/questions'
import { cn } from '@/lib/utils'

// Варианты ответа кнопками. Один выбор: повторное нажатие снимает. Несколько: exclusive
// («не знаю», «ничем из этого») снимает остальные, max ограничивает число.

type Props = {
  options: readonly Option[]
  value: string | readonly string[] | undefined
  onChange: (value: string | string[] | undefined) => void
  multi?: boolean
  max?: number
  exclusive?: readonly string[]
  invalid?: boolean
  /** Подпись группы для экранного диктора, когда видимого заголовка рядом нет. */
  label?: string
}

export function ChoiceChips({ options, value, onChange, multi, max, exclusive, invalid, label }: Props) {
  const selected: readonly string[] = typeof value === 'string' ? [value] : (value ?? [])

  const toggle = (v: string) => {
    if (!multi) return onChange(value === v ? undefined : v)
    if (selected.includes(v)) return onChange(selected.filter((x) => x !== v))
    if (exclusive?.includes(v)) return onChange([v])
    const rest = selected.filter((x) => !exclusive?.includes(x))
    if (max && rest.length >= max) return
    onChange([...rest, v])
  }

  return (
    <div className="mt-2 flex flex-wrap gap-2" role={label ? 'group' : undefined} aria-label={label}>
      {options.map((o) => {
        const on = selected.includes(o.value)
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={on}
            onClick={() => toggle(o.value)}
            className={cn(
              'rounded-xl border px-3 py-2 text-left text-sm [overflow-wrap:anywhere] transition focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none',
              on ? 'border-primary bg-primary/10 text-foreground' : 'border-border bg-card/70 hover:border-primary/60',
              invalid && !on && 'border-destructive/50',
            )}
          >
            {o.label}
            {o.hint ? <span className="mt-0.5 block text-xs text-muted-foreground">{o.hint}</span> : null}
          </button>
        )
      })}
    </div>
  )
}
