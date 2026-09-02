'use client'

import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowUpRight, RotateCcw } from 'lucide-react'
import type { Lang } from '@/app/data/evolution/types'
import { verdictQuizData } from '@/app/data/standard-quiz'
import { decideVerdict, type QuizInput, type Verdict } from '@/lib/standard/verdict'
import { useLeadDialog } from '@/components/evolution/lead-dialog'
import type { LandingCopy, LandingSlug, QuizPreset, QuizPresetId } from '@/app/data/landings'
import { ymGoal } from '@/lib/analytics/ym'
import { buildLeadContext, summarizeAnswers } from '@/lib/standard/quiz-summary'

// Квиз вердикта: экраны — вопросы схемы, порядок и пропуски повторяют лестницу
// стандарта. Логика вынесена в lib/standard/verdict.ts и покрыта тестами; здесь
// только последовательность экранов и отрисовка. Ответы живут в состоянии
// компонента и никуда не отправляются.

// Режим лендинга: шаг 0 «какой процесс разбираем», подсказки пресета, абзац
// «что это значит для вас» и заявка с контекстом. Без него квиз работает как
// на странице стандарта.
export type QuizLandingMode = {
  slug: LandingSlug
  title: string
  copy: LandingCopy['quiz']
  presets: QuizPreset[]
  initialPresetId?: QuizPresetId
}

type ChosenPreset = { id?: QuizPresetId; label: string; hints: QuizPreset['hints']; library: QuizPreset['library'] }

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

function PresetStep({
  copy,
  presets,
  onPick,
}: {
  copy: LandingCopy['quiz']
  presets: QuizPreset[]
  onPick: (p: ChosenPreset) => void
}) {
  const [own, setOwn] = useState('')
  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">0 / {TOTAL_STEPS}</p>
      <h2 className="mt-2 text-xl font-semibold tracking-tight md:text-2xl">{copy.presetQuestion}</h2>
      <div className="mt-5 grid gap-3">
        {presets.map((p) => (
          <OptionButton key={p.id} label={p.label} onClick={() => onPick({ id: p.id, label: p.label, hints: p.hints, library: p.library })} />
        ))}
        <form
          className="rounded-xl border border-dashed border-border p-4"
          onSubmit={(e) => {
            e.preventDefault()
            const label = own.trim()
            if (label.length < 3) return
            onPick({ label, hints: {}, library: [] })
          }}
        >
          <label htmlFor="quiz-own-process" className="block text-sm font-medium">
            {copy.ownLabel}
          </label>
          <div className="mt-2 flex gap-2">
            <input
              id="quiz-own-process"
              value={own}
              onChange={(e) => setOwn(e.target.value)}
              placeholder={copy.ownPlaceholder}
              maxLength={120}
              className="min-w-0 flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm"
            />
            <button
              type="submit"
              disabled={own.trim().length < 3}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-40"
            >
              {copy.ownSubmit}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function ResultView({
  lang,
  answers,
  ctaLabel,
  onRestart,
  landing,
  preset,
}: {
  lang: Lang
  answers: Answers
  ctaLabel: string
  onRestart: () => void
  landing?: QuizLandingMode
  preset?: ChosenPreset | null
}) {
  const copy = verdictQuizData[lang].result
  const verdict: Verdict = decideVerdict(toInput(answers))
  const form = copy.forms[verdict.form]
  const lead = useLeadDialog()
  const linkCls =
    'inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.16em] text-foreground/80 transition hover:text-primary'

  useEffect(() => {
    ymGoal('quiz_result')
  }, [])

  const library = preset && preset.library.length > 0 ? preset.library : form.library
  const openLead = () => {
    if (!landing || !preset) {
      lead.open()
      return
    }
    lead.open({
      answer: buildLeadContext({
        landingTitle: landing.title,
        presetLabel: preset.label,
        formTag: form.tag,
        formTitle: form.title,
        summary: summarizeAnswers(answers, verdictQuizData[lang]),
      }),
      source: { landing: landing.slug, preset: preset.id, verdict: form.tag },
    })
  }

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
      {landing ? (
        <p className="mt-4 rounded-xl border border-primary/30 bg-primary/5 p-4 text-sm leading-relaxed">
          {landing.copy.meaning[verdict.form]}
        </p>
      ) : null}

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
        {library?.map((l) => (
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
          onClick={openLead}
          className="mt-3 w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          {landing ? landing.copy.cta : ctaLabel}
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

export function VerdictQuiz({ lang, ctaLabel, landing }: { lang: Lang; ctaLabel: string; landing?: QuizLandingMode }) {
  const copy = verdictQuizData[lang]
  const [answers, setAnswers] = useState<Answers>({})
  const [history, setHistory] = useState<Answers[]>([])
  const [preset, setPreset] = useState<ChosenPreset | null>(() => {
    const initial = landing?.presets.find((p) => p.id === landing.initialPresetId)
    return initial ? { id: initial.id, label: initial.label, hints: initial.hints, library: initial.library } : null
  })
  const [started, setStarted] = useState(false)

  const needPreset = !!landing && preset === null
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
    if (!started) {
      setStarted(true)
      ymGoal('quiz_start')
    }
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
    if (landing) setPreset(null)
    setAnswers({})
    setHistory([])
  }

  const q = copy.questions
  // Подсказка пресета перекрывает общую подсказку вопроса, если она есть.
  const hint = (key: keyof QuizInput, fallback: string) => preset?.hints[key] ?? fallback

  return (
    <div className="rounded-2xl border border-border bg-card/70 p-5 backdrop-blur-sm md:p-8">
      {needPreset && landing ? (
        <PresetStep
          copy={landing.copy}
          presets={landing.presets}
          onPick={(p) => {
            setPreset(p)
            if (!started) {
              setStarted(true)
              ymGoal('quiz_start')
            }
          }}
        />
      ) : null}

      {!needPreset && step === 'hasEtalon' && (
        <QuestionShell step={stepIndex} title={q.hasEtalon.title} hint={hint('hasEtalon', q.hasEtalon.hint)} progressLabel={copy.progressLabel}>
          {q.hasEtalon.options.map((o) => (
            <OptionButton key={o.value} label={o.label} hint={o.hint} onClick={() => set({ hasEtalon: o.value === 'yes' })} />
          ))}
        </QuestionShell>
      )}

      {!needPreset && step === 'dataReady' && (
        <QuestionShell step={stepIndex} title={q.dataReady.title} hint={hint('dataReady', q.dataReady.hint)} progressLabel={copy.progressLabel}>
          {q.dataReady.options.map((o) => (
            <OptionButton key={o.value} label={o.label} hint={o.hint} onClick={() => set({ dataReady: o.value === 'yes' })} />
          ))}
        </QuestionShell>
      )}

      {!needPreset && step === 'useful' && (
        <QuestionShell step={stepIndex} title={q.useful.title} hint={hint('useful', q.useful.hint)} progressLabel={copy.progressLabel}>
          {q.useful.options.map((o) => (
            <OptionButton key={o.value} label={o.label} hint={o.hint} onClick={() => set({ useful: o.value })} />
          ))}
        </QuestionShell>
      )}

      {!needPreset && step === 'rule' && (
        <QuestionShell step={stepIndex} title={q.rule.title} hint={hint('rule', q.rule.hint)} progressLabel={copy.progressLabel}>
          {q.rule.options.map((o) => (
            <OptionButton key={o.value} label={o.label} hint={o.hint} onClick={() => set({ rule: o.value })} />
          ))}
        </QuestionShell>
      )}

      {!needPreset && step === 'check' && (
        <QuestionShell step={stepIndex} title={q.check.title} hint={hint('check', q.check.hint)} progressLabel={copy.progressLabel}>
          {q.check.options.map((o) => (
            <OptionButton key={o.value} label={o.label} hint={o.hint} onClick={() => set({ check: o.value })} />
          ))}
        </QuestionShell>
      )}

      {!needPreset && step === 'singleRun' && (
        <QuestionShell step={stepIndex} title={q.singleRun.title} hint={hint('singleRun', q.singleRun.hint)} progressLabel={copy.progressLabel}>
          {q.singleRun.options.map((o) => (
            <OptionButton key={o.value} label={o.label} hint={o.hint} onClick={() => set({ singleRun: o.value === 'yes' })} />
          ))}
        </QuestionShell>
      )}

      {!needPreset && step === 'consequences' && (
        <QuestionShell step={stepIndex} title={q.consequences.title} hint={q.consequences.hint} progressLabel={copy.progressLabel}>
          <ConsequencesForm lang={lang} onDone={(patch) => set(patch)} />
        </QuestionShell>
      )}

      {!needPreset && step === 'result' && (
        <ResultView lang={lang} answers={answers} ctaLabel={ctaLabel} onRestart={restart} landing={landing} preset={preset} />
      )}

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
