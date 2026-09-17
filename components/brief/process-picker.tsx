'use client'

import { useId, type Dispatch } from 'react'
import { briefCopy } from '@/app/data/brief/copy'
import { GROUP_ORDER, processGroups, processesByGroup } from '@/app/data/brief/processes'
import { hoursOptions } from '@/app/data/brief/questions'
import { Input } from '@/components/ui/input'
import type { HoursBand } from '@/lib/brief/ids'
import type { BriefAnswers } from '@/lib/brief/schema'
import { MAX_DEEP, type BriefAction } from '@/lib/brief/state'
import { cn } from '@/lib/utils'
import { ChoiceChips } from './choice-chips'
import { TermNotes } from './term-notes'

// Шаг 3: отметить процессы, указать часы, при >3 выбрать до трёх для подробного разбора.

export function ProcessPicker({
  answers,
  dispatch,
  invalid,
}: {
  answers: BriefAnswers
  dispatch: Dispatch<BriefAction>
  invalid: readonly string[]
}) {
  const hoursOf = new Map(answers.picked.map((p) => [p.id, p.hours]))
  const needChoice = answers.picked.length > MAX_DEEP
  const c = briefCopy.time
  const uid = useId()
  const pickedBad = invalid.includes('picked')
  const choiceBad = invalid.includes('deepChoice')
  const customBad = invalid.includes('customLabel')
  const pickedErrorId = `${uid}-picked-error`
  const choiceErrorId = `${uid}-deepChoice-error`
  const customErrorId = `${uid}-customLabel-error`

  return (
    <section className="space-y-7">
      <div>
        <h1 tabIndex={-1} className="text-2xl font-semibold tracking-tight outline-none">
          {briefCopy.stepTitles.time}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{c.lead}</p>
      </div>

      {needChoice ? (
        <p
          data-invalid={choiceBad ? 'true' : undefined}
          tabIndex={choiceBad ? -1 : undefined}
          className={cn('rounded-xl border p-3 text-sm outline-none', choiceBad ? 'border-destructive/60' : 'border-primary/40 bg-primary/5')}
        >
          {c.deepBanner(answers.picked.length)}
        </p>
      ) : null}

      {GROUP_ORDER.map((group) => (
        <div key={group}>
          <h3 className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{processGroups[group]}</h3>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {processesByGroup(group).map((p) => {
              const hours = hoursOf.get(p.id)
              const on = hours !== undefined
              const chosen = answers.deepChoice.includes(p.id)
              const cardBad = p.id === 'custom' && customBad
              return (
                <div
                  key={p.id}
                  data-invalid={cardBad ? 'true' : undefined}
                  className={cn('min-w-0 rounded-xl border p-3 transition', on ? 'border-primary bg-primary/5' : 'border-border bg-card/70')}
                >
                  <button
                    type="button"
                    aria-pressed={on}
                    aria-describedby={pickedBad ? pickedErrorId : undefined}
                    onClick={() => dispatch({ type: 'toggleProcess', id: p.id })}
                    className="w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                  >
                    <span className="block text-sm font-medium">{p.label}</span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">{p.example}</span>
                  </button>
                  {p.terms ? <TermNotes terms={p.terms} /> : null}
                  {on ? (
                    <div className="mt-3">
                      {p.id === 'custom' ? (
                        <>
                          <Input
                            maxLength={80}
                            placeholder={c.customPlaceholder}
                            value={answers.customLabel ?? ''}
                            aria-label={c.customAria}
                            aria-invalid={customBad}
                            aria-describedby={customBad ? customErrorId : undefined}
                            onChange={(e) => dispatch({ type: 'setField', field: 'customLabel', value: e.target.value })}
                          />
                          {customBad ? (
                            <p id={customErrorId} className="mt-1 text-xs text-destructive">
                              {briefCopy.errors.customLabel}
                            </p>
                          ) : null}
                        </>
                      ) : null}
                      <p className="mt-2 text-xs text-muted-foreground">{c.hoursLabel}</p>
                      <ChoiceChips
                        options={hoursOptions}
                        value={hours}
                        label={`${c.hoursLabel}: ${p.label}`}
                        onChange={(v) => {
                          if (typeof v === 'string') dispatch({ type: 'setHours', id: p.id, hours: v as HoursBand })
                        }}
                      />
                      {needChoice ? (
                        <label className="mt-3 flex items-center gap-2 text-xs">
                          <input
                            type="checkbox"
                            className="size-4 accent-[var(--primary)]"
                            checked={chosen}
                            disabled={!chosen && answers.deepChoice.length >= MAX_DEEP}
                            aria-describedby={choiceBad ? choiceErrorId : undefined}
                            onChange={() => dispatch({ type: 'toggleDeepChoice', id: p.id })}
                          />
                          <span>
                            {c.deepToggle}
                            <span className="sr-only">: {p.label}</span>
                          </span>
                        </label>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              )
            })}
          </div>
        </div>
      ))}

      {pickedBad ? (
        <p id={pickedErrorId} className="text-sm text-destructive">
          {briefCopy.errors.picked}
        </p>
      ) : null}
      {choiceBad ? (
        <p id={choiceErrorId} className="text-sm text-destructive">
          {briefCopy.errors.deepChoice}
        </p>
      ) : null}
    </section>
  )
}
