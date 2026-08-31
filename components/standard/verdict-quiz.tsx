'use client'

import { useState } from 'react'
import { ArrowLeft, ArrowUpRight, RotateCcw } from 'lucide-react'
import type { Lang } from '@/app/data/evolution/types'
import { verdictQuizData } from '@/app/data/standard-quiz'
import { decideVerdict, type QuizInput, type Verdict } from '@/lib/standard/verdict'
import { useLeadDialog } from '@/components/evolution/lead-dialog'

// Квиз вердикта: экраны — вопросы схемы, порядок и пропуски повторяют лестницу
// стандарта. Логика вынесена в lib/standard/verdict.ts и покрыта тестами; здесь
// только последовательность экранов и отрисовка. Ответы живут в состоянии
// компонента и никуда не отправляются.

type Step =
  | 'hasEtalon'
  | 'dataReady'
  | 'useful'
  | 'rule'
  | 'check'
  | 'singleRun'
  | 'consequences'
  | 'result'

type Answers = Partial<QuizInput>

const TOTAL_STEPS = 7

// Следующий экран из уже данных ответов — лестница стандарта в один взгляд.
function nextStep(a: Answers): Step {
  if (a.hasEtalon === undefined) return 'hasEtalon'
  if (!a.hasEtalon) return 'result'
  if (a.dataReady === undefined) return 'dataReady'
  if (!a.dataReady) return 'result'
  if (a.useful === undefined) return 'useful'
  if (a.useful !== 'yes') return 'result'
  if (a.rule === undefined) return 'rule'
  if (a.rule === 'judgment') {
    if (a.check === undefined) return 'check'
    if (a.check === 'expert') return 'result'
    if (a.singleRun === undefined) return 'singleRun'
    if (!a.singleRun) return 'result'
  }
  if (a.sideEffect === undefined || a.irreversible === undefined || a.personalData === undefined)
    return 'consequences'
  return 'result'
}

// Неспрошенные поля добиваются нейтральными значениями: на вердикт ранних
// исходов они не влияют, а функция решения требует полный вход.
function toInput(a: Answers): QuizInput {
  return {
    hasEtalon: a.hasEtalon ?? true,
    dataReady: a.dataReady ?? true,
    useful: a.useful ?? 'yes',
    rule: a.rule ?? 'judgment',
    check: a.check ?? 'auto',
    singleRun: a.singleRun ?? true,
    sideEffect: a.sideEffect ?? 'read',
    irreversible: a.irreversible ?? false,
    personalData: a.personalData ?? false,
  }
}

const optionCls =
  'w-full rounded-xl border border-border bg-card/70 p-4 text-left backdrop-blur-sm transition hover:border-primary focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none'

function OptionButton({
  label,
  hint,
  onClick,
  selected,
}: {
  label: string
  hint?: string
  onClick: () => void
  selected?: boolean
}) {
  return (
    <button type="button" onClick={onClick} className={optionCls} aria-pressed={selected}>
      <span className={`block text-sm font-medium ${selected ? 'text-primary' : ''}`}>{label}</span>
      {hint ? <span className="mt-1 block text-xs text-muted-foreground">{hint}</span> : null}
    </button>
  )
}

function QuestionShell({
  step,
  title,
  hint,
  progressLabel,
  children,
}: {
  step: number
  title: string
  hint: string
  progressLabel: string
  children: React.ReactNode
}) {
  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
        {progressLabel} {step} / {TOTAL_STEPS}
      </p>
      <h2 className="mt-2 text-xl font-semibold tracking-tight md:text-2xl">{title}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{hint}</p>
      <div className="mt-5 grid gap-3">{children}</div>
    </div>
  )
}

function ResultView({ lang, answers, ctaLabel, onRestart }: { lang: Lang; answers: Answers; ctaLabel: string; onRestart: () => void }) {
  const copy = verdictQuizData[lang].result
  const verdict: Verdict = decideVerdict(toInput(answers))
  const form = copy.forms[verdict.form]
  const lead = useLeadDialog()
  const linkCls =
    'inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.16em] text-foreground/80 transition hover:text-primary'

  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
        {copy.heading}
      </p>
      <div className="mt-3 flex items-center gap-3">
        <span className="rounded-md border border-primary/50 bg-primary/10 px-2.5 py-1 font-mono text-sm font-semibold text-primary">
          {form.tag}
        </span>
        <h2 className="text-xl font-semibold tracking-tight md:text-2xl">{form.title}</h2>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{form.text}</p>

      {verdict.autonomy ? (
        <div className="mt-5">
          <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            {copy.autonomyTitle}
          </h3>
          <ul className="mt-2 flex flex-wrap gap-2">
            {(
              [
                ['collect', verdict.autonomy.collect],
                ['analyze', verdict.autonomy.analyze],
                ['decide', verdict.autonomy.decide],
                ['act', verdict.autonomy.act],
              ] as const
            ).map(([stage, level]) => (
              <li
                key={stage}
                className="rounded-full border border-border bg-card/70 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground"
              >
                {copy.autonomyStages[stage]} · {level}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {verdict.flags.length > 0 ? (
        <ul className="mt-5 space-y-2">
          {verdict.flags.map((flag) => (
            <li key={flag} className="border-l-2 border-primary/60 pl-3 text-sm text-muted-foreground">
              {copy.flags[flag]}
            </li>
          ))}
        </ul>
      ) : null}

      <h3 className="mt-6 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
        {copy.demandsTitle}
      </h3>
      <ul className="mt-2 space-y-2">
        {form.demands.map((d) => (
          <li key={d} className="flex gap-2 text-sm leading-relaxed">
            <span className="text-primary">—</span>
            <span>{d}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex flex-col gap-2">
        {form.library?.map((l) => (
          <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className={linkCls}>
            {l.label}
            <ArrowUpRight className="size-3.5" aria-hidden />
          </a>
        ))}
        <a href={copy.templatesHref} target="_blank" rel="noopener noreferrer" className={linkCls}>
          {copy.templatesLabel}
          <ArrowUpRight className="size-3.5" aria-hidden />
        </a>
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-card/70 p-4 backdrop-blur-sm">
        <p className="text-sm text-muted-foreground">{copy.ctaHint}</p>
        <button
          type="button"
          onClick={lead.open}
          className="mt-3 w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          {ctaLabel}
        </button>
      </div>

      <button
        type="button"
        onClick={onRestart}
        className="mt-4 inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground transition hover:text-primary"
      >
        <RotateCcw className="size-3.5" aria-hidden />
        {verdictQuizData[lang].restartLabel}
      </button>
    </div>
  )
}

export function VerdictQuiz({ lang, ctaLabel }: { lang: Lang; ctaLabel: string }) {
  const copy = verdictQuizData[lang]
  const [answers, setAnswers] = useState<Answers>({})
  const [history, setHistory] = useState<Answers[]>([])

  const step = nextStep(answers)
  const stepIndex =
    step === 'hasEtalon' ? 1
    : step === 'dataReady' ? 2
    : step === 'useful' ? 3
    : step === 'rule' ? 4
    : step === 'check' ? 5
    : step === 'singleRun' ? 6
    : 7

  const set = (patch: Answers) => {
    setHistory((h) => [...h, answers])
    setAnswers((a) => ({ ...a, ...patch }))
  }
  const back = () => {
    setHistory((h) => {
      if (h.length === 0) return h
      setAnswers(h[h.length - 1])
      return h.slice(0, -1)
    })
  }
  const restart = () => {
    setAnswers({})
    setHistory([])
  }

  const q = copy.questions

  return (
    <div className="rounded-2xl border border-border bg-card/70 p-5 backdrop-blur-sm md:p-8">
      {step === 'hasEtalon' && (
        <QuestionShell step={stepIndex} title={q.hasEtalon.title} hint={q.hasEtalon.hint} progressLabel={copy.progressLabel}>
          {q.hasEtalon.options.map((o) => (
            <OptionButton key={o.value} label={o.label} hint={o.hint} onClick={() => set({ hasEtalon: o.value === 'yes' })} />
          ))}
        </QuestionShell>
      )}

      {step === 'dataReady' && (
        <QuestionShell step={stepIndex} title={q.dataReady.title} hint={q.dataReady.hint} progressLabel={copy.progressLabel}>
          {q.dataReady.options.map((o) => (
            <OptionButton key={o.value} label={o.label} hint={o.hint} onClick={() => set({ dataReady: o.value === 'yes' })} />
          ))}
        </QuestionShell>
      )}

      {step === 'useful' && (
        <QuestionShell step={stepIndex} title={q.useful.title} hint={q.useful.hint} progressLabel={copy.progressLabel}>
          {q.useful.options.map((o) => (
            <OptionButton key={o.value} label={o.label} hint={o.hint} onClick={() => set({ useful: o.value })} />
          ))}
        </QuestionShell>
      )}

      {step === 'rule' && (
        <QuestionShell step={stepIndex} title={q.rule.title} hint={q.rule.hint} progressLabel={copy.progressLabel}>
          {q.rule.options.map((o) => (
            <OptionButton key={o.value} label={o.label} hint={o.hint} onClick={() => set({ rule: o.value })} />
          ))}
        </QuestionShell>
      )}

      {step === 'check' && (
        <QuestionShell step={stepIndex} title={q.check.title} hint={q.check.hint} progressLabel={copy.progressLabel}>
          {q.check.options.map((o) => (
            <OptionButton key={o.value} label={o.label} hint={o.hint} onClick={() => set({ check: o.value })} />
          ))}
        </QuestionShell>
      )}

      {step === 'singleRun' && (
        <QuestionShell step={stepIndex} title={q.singleRun.title} hint={q.singleRun.hint} progressLabel={copy.progressLabel}>
          {q.singleRun.options.map((o) => (
            <OptionButton key={o.value} label={o.label} hint={o.hint} onClick={() => set({ singleRun: o.value === 'yes' })} />
          ))}
        </QuestionShell>
      )}

      {step === 'consequences' && (
        <QuestionShell step={stepIndex} title={q.consequences.title} hint={q.consequences.hint} progressLabel={copy.progressLabel}>
          <ConsequencesForm lang={lang} onDone={(patch) => set(patch)} />
        </QuestionShell>
      )}

      {step === 'result' && <ResultView lang={lang} answers={answers} ctaLabel={ctaLabel} onRestart={restart} />}

      {step !== 'result' && history.length > 0 ? (
        <button
          type="button"
          onClick={back}
          className="mt-5 inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground transition hover:text-primary"
        >
          <ArrowLeft className="size-3.5" aria-hidden />
          {copy.backLabel}
        </button>
      ) : null}
    </div>
  )
}

// Три коротких выбора одним экраном: побочный эффект, необратимость, персданные.
// Кнопка «получить вердикт» активна, когда выбраны все три.
function ConsequencesForm({
  lang,
  onDone,
}: {
  lang: Lang
  onDone: (patch: Answers) => void
}) {
  const c = verdictQuizData[lang].questions.consequences
  const [sideEffect, setSideEffect] = useState<QuizInput['sideEffect'] | undefined>()
  const [irreversible, setIrreversible] = useState<boolean | undefined>()
  const [personalData, setPersonalData] = useState<boolean | undefined>()
  const ready = sideEffect !== undefined && irreversible !== undefined && personalData !== undefined

  const group = (label: string, children: React.ReactNode) => (
    <fieldset>
      <legend className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </legend>
      <div className="mt-2 grid gap-2 sm:grid-cols-3">{children}</div>
    </fieldset>
  )

  return (
    <div className="grid gap-5">
      {group(
        c.sideEffect.label,
        c.sideEffect.options.map((o) => (
          <OptionButton key={o.value} label={o.label} selected={sideEffect === o.value} onClick={() => setSideEffect(o.value)} />
        )),
      )}
      {group(
        c.irreversible.label,
        c.irreversible.options.map((o) => (
          <OptionButton key={o.value} label={o.label} selected={irreversible === (o.value === 'yes')} onClick={() => setIrreversible(o.value === 'yes')} />
        )),
      )}
      {group(
        c.personalData.label,
        c.personalData.options.map((o) => (
          <OptionButton key={o.value} label={o.label} selected={personalData === (o.value === 'yes')} onClick={() => setPersonalData(o.value === 'yes')} />
        )),
      )}
      <button
        type="button"
        disabled={!ready}
        onClick={() => ready && onDone({ sideEffect, irreversible, personalData })}
        className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-40 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
      >
        {verdictQuizData[lang].result.heading} →
      </button>
    </div>
  )
}
