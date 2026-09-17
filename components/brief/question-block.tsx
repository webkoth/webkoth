'use client'

import { useId, type Dispatch } from 'react'
import { briefCopy } from '@/app/data/brief/copy'
import type { QuestionDef } from '@/app/data/brief/questions'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import type { BriefAnswers } from '@/lib/brief/schema'
import type { BriefAction } from '@/lib/brief/state'
import { ChoiceChips } from './choice-chips'
import { TermNotes } from './term-notes'

export function QuestionBlock({
  q,
  answers,
  dispatch,
  invalid,
}: {
  q: QuestionDef
  answers: BriefAnswers
  dispatch: Dispatch<BriefAction>
  invalid: boolean
}) {
  const errorId = `${useId()}-error`
  if (q.showIf && !q.showIf(answers)) return null
  const value = answers[q.id] as unknown as string | readonly string[] | undefined
  const selected = typeof value === 'string' ? [value] : (value ?? [])
  const other = q.other
  const otherValue = other ? (answers[other.field] ?? '') : ''

  return (
    <fieldset className="min-w-0" data-invalid={invalid ? 'true' : undefined} aria-describedby={invalid ? errorId : undefined}>
      <legend className="text-sm font-medium">{q.title}</legend>
      {q.hint ? <p className="mt-1 text-xs text-muted-foreground">{q.hint}</p> : null}
      {q.terms ? <TermNotes terms={q.terms} /> : null}
      <ChoiceChips
        options={q.options}
        value={value}
        multi={q.multi}
        max={q.max}
        exclusive={q.exclusive}
        invalid={invalid}
        onChange={(v) => dispatch({ type: 'setField', field: q.id, value: v })}
      />
      {other && selected.includes(other.trigger) ? (
        other.multiline ? (
          <Textarea
            className="mt-2"
            rows={3}
            maxLength={other.max}
            placeholder={other.placeholder}
            aria-label={other.placeholder}
            value={otherValue}
            onChange={(e) => dispatch({ type: 'setField', field: other.field, value: e.target.value })}
          />
        ) : (
          <Input
            className="mt-2"
            maxLength={other.max}
            placeholder={other.placeholder}
            aria-label={other.placeholder}
            value={otherValue}
            onChange={(e) => dispatch({ type: 'setField', field: other.field, value: e.target.value })}
          />
        )
      ) : null}
      {invalid ? (
        <p id={errorId} className="mt-1.5 text-xs text-destructive">
          {briefCopy.errors.required}
        </p>
      ) : null}
    </fieldset>
  )
}
