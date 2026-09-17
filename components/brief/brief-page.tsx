'use client'

import { useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { briefCopy } from '@/app/data/brief/copy'
import { nowQuestions, shopQuestions } from '@/app/data/brief/questions'
import { Button } from '@/components/ui/button'
import { ymGoal } from '@/lib/analytics/ym'
import { buildMap } from '@/lib/brief/build-map'
import { postBrief } from '@/lib/brief/client'
import { briefReducer, deepList, initialState, invalidFields, stepNumber, type BriefState, type StepKey } from '@/lib/brief/state'
import { browserStorage, clearState, loadState, saveState } from '@/lib/brief/storage'
import { BriefMapView } from './brief-map'
import { LiveMap } from './live-map'
import type { CaseLinks } from './map-item'
import { ProcessPicker } from './process-picker'
import { StepDeep } from './step-deep'
import { StepGoals } from './step-goals'
import { StepIntro } from './step-intro'
import { StepQuestions } from './step-questions'

// Оболочка брифа: состояние, сохранение в браузере, шаги, отправка. Логика шагов и карты
// живёт в lib/brief и покрыта тестами; здесь только последовательность экранов.

type Boot = 'pending' | 'empty' | 'resume' | 'outdated' | 'unavailable'

const STEP_GOALS = ['brief_step_1', 'brief_step_2', 'brief_step_3', 'brief_step_4'] as const

function Progress({ step, saved }: { step: StepKey; saved: boolean }) {
  const n = stepNumber(step)
  return (
    <div className="mb-8 print:hidden">
      <div className="h-1 rounded-full bg-muted">
        <div className="h-1 rounded-full bg-primary transition-all" style={{ width: `${(n / 6) * 100}%` }} />
      </div>
      <div className="mt-2 flex flex-wrap justify-between gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
        <span>{briefCopy.progress(n, briefCopy.stepTitles[step])}</span>
        <span>{saved ? briefCopy.saved : briefCopy.notSaved}</span>
      </div>
    </div>
  )
}

export function BriefPage({ k, caseLinks }: { k?: string; caseLinks: CaseLinks }) {
  const [state, dispatch] = useReducer(briefReducer, 0, initialState)
  const [boot, setBoot] = useState<Boot>('pending')
  const [resume, setResume] = useState<BriefState | null>(null)
  const [showErrors, setShowErrors] = useState(false)
  const [saved, setSaved] = useState(true)
  const honeypot = useRef('')

  useEffect(() => {
    const r = loadState(browserStorage())
    if (r.status === 'ok') {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage доступен только в браузере, черновик подхватываем один раз после монтирования
      setResume(r.state)
      setBoot('resume')
      return
    }
    if (r.status === 'outdated') clearState(browserStorage())
    setBoot(r.status)
  }, [])

  useEffect(() => {
    if (state.startedAtMs === 0) return
    // eslint-disable-next-line react-hooks/set-state-in-effect -- статус зависит от результата записи во внешнее хранилище (localStorage)
    setSaved(saveState(browserStorage(), state))
  }, [state])

  const map = useMemo(() => buildMap(state.answers), [state.answers])
  const invalid = invalidFields(state)
  const deep = deepList(state.answers)
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  const start = () => {
    clearState(browserStorage())
    dispatch({ type: 'start', now: Date.now() })
    ymGoal('brief_start')
    scrollTop()
  }

  const continueSaved = () => {
    if (resume) dispatch({ type: 'restore', state: resume })
    scrollTop()
  }

  const next = () => {
    if (invalid.length > 0) {
      setShowErrors(true)
      return
    }
    setShowErrors(false)
    const leavesStep = state.step !== 'deep' || state.deepIndex >= deep.length - 1
    const n = stepNumber(state.step)
    if (leavesStep && n >= 1 && n <= 4) ymGoal(STEP_GOALS[n - 1])
    dispatch({ type: 'next' })
    scrollTop()
  }

  const back = () => {
    setShowErrors(false)
    dispatch({ type: 'back' })
    scrollTop()
  }

  const send = async () => {
    dispatch({ type: 'send', status: 'sending' })
    const result = await postBrief({
      answers: state.answers,
      k,
      startedAtMs: state.startedAtMs,
      website: honeypot.current,
    })
    dispatch({ type: 'send', status: result })
    if (result === 'sent') ymGoal('brief_submit')
  }

  const submit = async () => {
    if (invalid.length > 0) {
      setShowErrors(true)
      return
    }
    setShowErrors(false)
    ymGoal('brief_step_5')
    dispatch({ type: 'goto', step: 'map' })
    scrollTop()
    await send()
  }

  const reset = () => {
    clearState(browserStorage())
    setResume(null)
    setBoot('empty')
    dispatch({ type: 'reset' })
    scrollTop()
  }

  if (boot === 'pending') return <div className="min-h-[60vh]" aria-busy />

  if (state.step === 'intro') {
    return (
      <div className="mx-auto max-w-3xl px-4 pb-24 md:px-8">
        <StepIntro
          canResume={boot === 'resume' && resume !== null}
          outdated={boot === 'outdated'}
          unavailable={boot === 'unavailable'}
          onStart={start}
          onResume={continueSaved}
        />
      </div>
    )
  }

  if (state.step === 'map') {
    return (
      <div className="mx-auto max-w-3xl px-4 pb-24 md:px-8">
        <BriefMapView map={map} answers={state.answers} send={state.send} onRetry={send} onReset={reset} caseLinks={caseLinks} />
      </div>
    )
  }

  const errors = showErrors ? invalid : []
  const deepId = deep[state.deepIndex]
  const body =
    state.step === 'shop' ? (
      <StepQuestions title={briefCopy.stepTitles.shop} questions={shopQuestions} answers={state.answers} dispatch={dispatch} invalid={errors} />
    ) : state.step === 'now' ? (
      <StepQuestions title={briefCopy.stepTitles.now} questions={nowQuestions} answers={state.answers} dispatch={dispatch} invalid={errors} />
    ) : state.step === 'time' ? (
      <ProcessPicker answers={state.answers} dispatch={dispatch} invalid={errors} />
    ) : state.step === 'deep' && deepId ? (
      <StepDeep id={deepId} index={state.deepIndex} total={deep.length} answers={state.answers} dispatch={dispatch} invalid={errors} />
    ) : (
      <StepGoals
        answers={state.answers}
        dispatch={dispatch}
        invalid={errors}
        onHoneypot={(v) => {
          honeypot.current = v
        }}
      />
    )

  return (
    <div className="mx-auto max-w-6xl px-4 pb-28 md:px-8 lg:pb-16">
      <Progress step={state.step} saved={saved} />
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        <div className="min-w-0">
          {body}
          <nav className="mt-10 flex items-center justify-between gap-3">
            <Button variant="ghost" onClick={back}>
              {briefCopy.nav.back}
            </Button>
            {state.step === 'goals' ? (
              <Button size="lg" onClick={submit}>
                {briefCopy.nav.submit}
              </Button>
            ) : (
              <Button size="lg" onClick={next}>
                {briefCopy.nav.next}
              </Button>
            )}
          </nav>
        </div>
        <LiveMap map={map} />
      </div>
    </div>
  )
}
