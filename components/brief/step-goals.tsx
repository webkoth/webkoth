'use client'

import Link from 'next/link'
import type { Dispatch } from 'react'
import { briefCopy } from '@/app/data/brief/copy'
import { goalsQuestions } from '@/app/data/brief/questions'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import type { BriefAnswers } from '@/lib/brief/schema'
import type { BriefAction } from '@/lib/brief/state'
import { QuestionBlock } from './question-block'

// Шаг 5: цели, рамки, свободный текст, контакты и согласие. Ловушка для ботов
// спрятана так же, как в форме заявки (components/evolution/lead-form.tsx).

export function StepGoals({
  answers,
  dispatch,
  invalid,
  onHoneypot,
}: {
  answers: BriefAnswers
  dispatch: Dispatch<BriefAction>
  invalid: readonly string[]
  onHoneypot: (value: string) => void
}) {
  const c = briefCopy.goals
  const e = briefCopy.errors

  return (
    <section className="space-y-7">
      <h2 className="text-2xl font-semibold tracking-tight">{briefCopy.stepTitles.goals}</h2>
      {goalsQuestions.map((q) => (
        <QuestionBlock key={q.id} q={q} answers={answers} dispatch={dispatch} invalid={invalid.includes(q.id)} />
      ))}

      <div>
        <label htmlFor="brief-notes" className="text-sm font-medium">
          {c.notesTitle}
        </label>
        <Textarea
          id="brief-notes"
          className="mt-2"
          rows={4}
          maxLength={1000}
          placeholder={c.notesPlaceholder}
          value={answers.notes ?? ''}
          onChange={(ev) => dispatch({ type: 'setField', field: 'notes', value: ev.target.value })}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="min-w-0">
          <label htmlFor="brief-name" className="text-sm font-medium">
            {c.nameTitle}
          </label>
          <Input
            id="brief-name"
            className="mt-2"
            maxLength={80}
            autoComplete="name"
            aria-invalid={invalid.includes('name')}
            value={answers.name ?? ''}
            onChange={(ev) => dispatch({ type: 'setField', field: 'name', value: ev.target.value })}
          />
          {invalid.includes('name') ? <p className="mt-1 text-xs text-destructive">{e.name}</p> : null}
        </div>
        <div className="min-w-0">
          <label htmlFor="brief-contact" className="text-sm font-medium">
            {c.contactTitle}
          </label>
          <Input
            id="brief-contact"
            className="mt-2"
            maxLength={120}
            aria-invalid={invalid.includes('contact')}
            value={answers.contact ?? ''}
            onChange={(ev) => dispatch({ type: 'setField', field: 'contact', value: ev.target.value })}
          />
          {invalid.includes('contact') ? <p className="mt-1 text-xs text-destructive">{e.contact}</p> : null}
        </div>
      </div>

      <div>
        <label className="flex items-start gap-3 text-sm">
          <input
            type="checkbox"
            className="mt-0.5 size-4 accent-[var(--primary)]"
            checked={answers.consent}
            onChange={(ev) => dispatch({ type: 'setConsent', value: ev.target.checked })}
          />
          <span>
            {c.consentBefore}
            <Link href="/privacy" target="_blank" className="underline underline-offset-2 hover:text-primary">
              {c.consentLink}
            </Link>
          </span>
        </label>
        {invalid.includes('consent') ? <p className="mt-1 text-xs text-destructive">{e.consent}</p> : null}
      </div>

      {/* honeypot: скрыт от людей, виден ботам */}
      <input
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
        onChange={(ev) => onHoneypot(ev.target.value)}
      />
    </section>
  )
}
