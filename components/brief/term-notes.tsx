'use client'

import { useId, useState } from 'react'
import { briefCopy } from '@/app/data/brief/copy'
import { glossary, type TermId } from '@/app/data/brief/glossary'

// Сноски к терминам: раскрываются по нажатию прямо под вопросом. Без подсказок
// по наведению: на телефоне наведения нет. В PDF кнопки не печатаются, раскрытая сноска печатается.

export function TermNotes({ terms }: { terms: readonly TermId[] }) {
  const [open, setOpen] = useState<TermId | null>(null)
  const id = useId()
  const term = open ? glossary[open] : null

  return (
    <div className="mt-1.5">
      <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground print:hidden">
        {terms.map((t) => (
          <button
            key={t}
            type="button"
            aria-expanded={open === t}
            aria-controls={`${id}-note`}
            onClick={() => setOpen(open === t ? null : t)}
            className="inline-flex items-center gap-1 py-1 underline decoration-dotted underline-offset-4 transition hover:text-primary"
          >
            <span aria-hidden className="inline-flex size-4 items-center justify-center rounded-full border border-border text-[10px]">
              ?
            </span>
            {glossary[t].title}
          </button>
        ))}
      </div>
      {term ? (
        <p id={`${id}-note`} className="mt-2 rounded-lg border border-border bg-muted/60 p-3 text-xs leading-relaxed">
          {term.text}
          {term.href ? (
            <>
              {' '}
              <a href={term.href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-primary">
                {briefCopy.more}
              </a>
            </>
          ) : null}
        </p>
      ) : null}
    </div>
  )
}
