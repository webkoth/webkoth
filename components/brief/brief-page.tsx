'use client'

import { useEffect, useMemo, useReducer, useRef, useState, type ReactNode } from 'react'
import { briefCopy } from '@/app/data/brief/copy'
import { nowQuestions, shopQuestions } from '@/app/data/brief/questions'
import { Button } from '@/components/ui/button'
import { ymGoal, type YmGoal } from '@/lib/analytics/ym'
import { buildMap } from '@/lib/brief/build-map'
import { postBrief } from '@/lib/brief/client'
import { stepForIssue } from '@/lib/brief/issue-step'
import { briefSubmitSchema, type BriefSubmit } from '@/lib/brief/schema'
import { briefReducer, deepList, initialState, invalidFields, stepNumber, type StepKey } from '@/lib/brief/state'
import { browserStorage, clearState, loadState, saveState, type LoadResult } from '@/lib/brief/storage'
import { BriefMapView } from './brief-map'
import { LiveMap } from './live-map'
import type { CaseLinks } from './map-item'
import { ProcessPicker } from './process-picker'
import { revealFirstInvalid, scrollToTop } from './scroll-focus'
import { StepDeep } from './step-deep'
import { StepGoals } from './step-goals'
import { StepIntro } from './step-intro'
import { StepQuestions } from './step-questions'

// Оболочка брифа: состояние, сохранение в браузере, шаги, отправка. Логика шагов и карты
// живёт в lib/brief и покрыта тестами; здесь только последовательность экранов.
// Рисуется только в браузере (brief-page-client.tsx): черновик читается при первом рендере.
// data-brief-page на корне: по нему globals.css включает стили печати только на странице брифа.

const STEP_GOALS = ['brief_step_1', 'brief_step_2', 'brief_step_3', 'brief_step_4'] as const

/** После «Начать» и «Продолжить» старый черновик больше не предлагается; недоступное хранилище так и остаётся. */
const forgetDraft = (b: LoadResult): LoadResult => (b.status === 'unavailable' || b.status === 'empty' ? b : { status: 'empty' })

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
  const [boot, setBoot] = useState<LoadResult>(() => loadState(browserStorage()))
  const [showErrors, setShowErrors] = useState(false)
  const [saved, setSaved] = useState(true)
  const honeypot = useRef('')
  const reachedGoals = useRef(new Set<YmGoal>())
  const rootRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLDivElement>(null)
  const shownStep = useRef<string | null>(null)

  useEffect(() => {
    if (state.startedAtMs === 0) return
    // eslint-disable-next-line react-hooks/set-state-in-effect -- статус зависит от результата записи во внешнее хранилище (localStorage)
    setSaved(saveState(browserStorage(), state))
  }, [state])

  // Новый шаг: фокус на его заголовок, чтобы диктор прочитал, где человек оказался.
  // Первый показ вводного экрана без фокуса.
  useEffect(() => {
    const key = `${state.step}:${state.deepIndex}`
    const previous = shownStep.current
    shownStep.current = key
    if (previous === null || previous === key) return
    rootRef.current?.querySelector<HTMLElement>('h1')?.focus({ preventScroll: true })
  }, [state.step, state.deepIndex])

  const map = useMemo(() => buildMap(state.answers), [state.answers])
  const invalid = invalidFields(state)
  const deep = deepList(state.answers)
  const inProgress = state.startedAtMs > 0

  /** Цель Метрики не больше одного раза за жизнь страницы. */
  const goal = (g: YmGoal) => {
    if (reachedGoals.current.has(g)) return
    reachedGoals.current.add(g)
    ymGoal(g)
  }

  const showInvalid = () => {
    setShowErrors(true)
    requestAnimationFrame(() => revealFirstInvalid(formRef.current))
  }

  const start = () => {
    clearState(browserStorage())
    setBoot(forgetDraft)
    dispatch({ type: 'start', now: Date.now(), k })
    goal('brief_start')
    scrollToTop()
  }

  const resume = () => {
    if (inProgress) dispatch({ type: 'goto', step: 'shop' })
    else if (boot.status === 'ok') dispatch({ type: 'restore', state: boot.state })
    setBoot(forgetDraft)
    scrollToTop()
  }

  const next = () => {
    if (invalid.length > 0) {
      showInvalid()
      return
    }
    setShowErrors(false)
    const leavesStep = state.step !== 'deep' || state.deepIndex >= deep.length - 1
    const n = stepNumber(state.step)
    if (leavesStep && n >= 1 && n <= 4) goal(STEP_GOALS[n - 1])
    dispatch({ type: 'next' })
    scrollToTop()
  }

  const back = () => {
    setShowErrors(false)
    dispatch({ type: 'back' })
    scrollToTop()
  }

  const submitBody = (): BriefSubmit => ({
    answers: state.answers,
    // Метка из ссылки, иначе запомненная в черновике: вернуться можно и по ссылке без метки.
    k: k ?? state.k,
    startedAtMs: state.startedAtMs,
    website: honeypot.current,
  })

  /**
   * Та же проверка, что на сервере: ответ 400 на экране карты был бы тупиком.
   * Не прошло: вернуть на шаг с первой ошибкой и показать её.
   */
  const rejectedBeforeSend = (body: BriefSubmit): boolean => {
    const parsed = briefSubmitSchema.safeParse(body)
    if (parsed.success) return false
    const target = stepForIssue(parsed.error.issues[0]?.path ?? [], state.answers)
    dispatch({ type: 'goto', step: target.step, deepIndex: target.deepIndex })
    showInvalid()
    return true
  }

  const send = async () => {
    const body = submitBody()
    if (rejectedBeforeSend(body)) return
    dispatch({ type: 'send', status: 'sending' })
    const result = await postBrief(body)
    dispatch({ type: 'send', status: result })
    if (result === 'sent') goal('brief_submit')
  }

  const submit = async () => {
    if (invalid.length > 0) {
      showInvalid()
      return
    }
    // Проверка до перехода на карту: при ошибке экран карты не мелькает.
    if (rejectedBeforeSend(submitBody())) return
    setShowErrors(false)
    goal('brief_step_5')
    dispatch({ type: 'goto', step: 'map' })
    scrollToTop()
    await send()
  }

  const pdf = () => {
    goal('brief_pdf')
    window.print()
  }

  const backToAnswers = () => {
    setShowErrors(false)
    dispatch({ type: 'goto', step: 'goals' })
    scrollToTop()
  }

  const reset = () => {
    clearState(browserStorage())
    setBoot(forgetDraft)
    setShowErrors(false)
    dispatch({ type: 'reset' })
    scrollToTop()
  }

  if (state.step === 'intro') {
    return (
      <div ref={rootRef} data-brief-page className="mx-auto max-w-3xl px-4 pb-24 md:px-8">
        <StepIntro
          canResume={inProgress || boot.status === 'ok'}
          outdated={boot.status === 'outdated'}
          unavailable={boot.status === 'unavailable'}
          onStart={start}
          onResume={resume}
        />
      </div>
    )
  }

  if (state.step === 'map') {
    return (
      <div ref={rootRef} data-brief-page className="mx-auto max-w-3xl px-4 pb-24 md:px-8">
        <BriefMapView
          map={map}
          answers={state.answers}
          send={state.send}
          onRetry={send}
          onBack={backToAnswers}
          onReset={reset}
          onPdf={pdf}
          caseLinks={caseLinks}
        />
      </div>
    )
  }

  const errors = showErrors ? invalid : []
  const deepId = deep[state.deepIndex]
  let body: ReactNode = null
  switch (state.step) {
    case 'shop':
      body = <StepQuestions title={briefCopy.stepTitles.shop} questions={shopQuestions} answers={state.answers} dispatch={dispatch} invalid={errors} />
      break
    case 'now':
      body = <StepQuestions title={briefCopy.stepTitles.now} questions={nowQuestions} answers={state.answers} dispatch={dispatch} invalid={errors} />
      break
    case 'time':
      body = <ProcessPicker answers={state.answers} dispatch={dispatch} invalid={errors} />
      break
    case 'deep':
      // Редьюсер не оставляет шаг без процесса; проверка только для типов.
      body = deepId ? (
        <StepDeep id={deepId} index={state.deepIndex} total={deep.length} answers={state.answers} dispatch={dispatch} invalid={errors} />
      ) : null
      break
    case 'goals':
      body = (
        <StepGoals
          answers={state.answers}
          dispatch={dispatch}
          invalid={errors}
          onHoneypot={(v) => {
            honeypot.current = v
          }}
        />
      )
      break
  }

  return (
    <div ref={rootRef} data-brief-page className="mx-auto max-w-6xl px-4 pb-28 md:px-8 lg:pb-16">
      <Progress step={state.step} saved={saved} />
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        <div ref={formRef} className="min-w-0">
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
