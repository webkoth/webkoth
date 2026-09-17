'use client'

import type { Dispatch } from 'react'
import { briefCopy } from '@/app/data/brief/copy'
import { processCatalog } from '@/app/data/brief/processes'
import { deepQuestions } from '@/app/data/brief/questions'
import type { ProcessId } from '@/lib/brief/ids'
import { processLabel } from '@/lib/brief/labels'
import type { BriefAnswers } from '@/lib/brief/schema'
import type { BriefAction } from '@/lib/brief/state'
import { ChoiceChips } from './choice-chips'
import { TermNotes } from './term-notes'

// Шаг 4: один экран на процесс. Подсказки под вопросами - на языке этого процесса.

export function StepDeep({
  id,
  index,
  total,
  answers,
  dispatch,
  invalid,
}: {
  id: ProcessId
  index: number
  total: number
  answers: BriefAnswers
  dispatch: Dispatch<BriefAction>
  invalid: readonly string[]
}) {
  const entry = processCatalog[id]
  const d = answers.deepAnswers[id] ?? {}

  return (
    <section className="space-y-7">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
          {briefCopy.deep.eyebrow(index + 1, total)}
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight">{processLabel(id, answers)}</h2>
      </div>
      {deepQuestions.map((q) => {
        if (q.showIf && !q.showIf(d)) return null
        const bad = invalid.includes(q.id)
        return (
          <fieldset key={q.id} className="min-w-0">
            <legend className="text-sm font-medium">{q.title}</legend>
            {entry.hints[q.id] ? <p className="mt-1 text-xs text-muted-foreground">{entry.hints[q.id]}</p> : null}
            {q.terms ? <TermNotes terms={q.terms} /> : null}
            <ChoiceChips
              options={q.options}
              value={d[q.id]}
              invalid={bad}
              onChange={(v) => dispatch({ type: 'setDeep', id, field: q.id, value: typeof v === 'string' ? v : undefined })}
            />
            {bad ? <p className="mt-1.5 text-xs text-destructive">{briefCopy.errors.required}</p> : null}
          </fieldset>
        )
      })}
    </section>
  )
}
