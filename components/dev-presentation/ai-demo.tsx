'use client'

import { useState } from 'react'
import { Sparkles, Loader2, ArrowRight, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { SectionLabel } from './section-label'
import { FlowDiagram } from './flow-diagram'

const EXAMPLES = [
  'привет нужен мне разработчик уровня сеньор для проекта',
  'мы небольшая команда у нас есть mvp надо допилить fullstack там react next typescript node',
  'есть задача интегрировать ai в наш продукт хотим чтобы ассистент помогал клиентам с поддержкой',
] as const

export function AiDemo() {
  const [text, setText] = useState<string>(EXAMPLES[0])
  const [polished, setPolished] = useState<string | null>(null)
  const [provider, setProvider] = useState<string | null>(null)
  const [state, setState] = useState<'idle' | 'loading' | 'error'>('idle')

  const onPolish = async () => {
    setState('loading')
    setPolished(null)
    setProvider(null)
    try {
      const res = await fetch('/api/ai/polish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = (await res.json()) as { polished: string; provider: string }
      setPolished(data.polished)
      setProvider(data.provider)
      setState('idle')
    } catch {
      setState('error')
    }
  }

  const onReset = () => {
    setText(EXAMPLES[Math.floor(Math.random() * EXAMPLES.length)])
    setPolished(null)
    setProvider(null)
    setState('idle')
  }

  return (
    <section className="mx-auto max-w-5xl border-t border-border px-4 py-12 md:px-8 md:py-16">
      <SectionLabel icon={Sparkles}>05 · AI · попробуйте прямо здесь</SectionLabel>

      <div className="mb-6 max-w-3xl">
        <h2 className="mb-2 text-xl font-bold tracking-tight md:text-2xl">
          Живой AI-helper
        </h2>
        <p className="text-sm text-muted-foreground md:text-base">
          Та же кнопка, что и в форме ниже. Запрос идёт через прокси Next.js
          в собственный AI-микросервис, который держит multi-provider cascade.
          Если Claude недоступен — автоматически Gemini, затем Groq.
        </p>
      </div>

      <div className="mb-6">
        <FlowDiagram />
      </div>

      <div className="rounded-2xl border border-border bg-card/50 p-5 md:p-6">
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label
                htmlFor="ai-demo-input"
                className="font-mono text-xs uppercase tracking-wider text-muted-foreground"
              >
                Черновик
              </label>
              <button
                type="button"
                onClick={onReset}
                className="inline-flex items-center gap-1 text-xs text-muted-foreground transition hover:text-primary"
                title="Другой пример"
              >
                <RotateCcw className="size-3" />
                Другой пример
              </button>
            </div>
            <Textarea
              id="ai-demo-input"
              rows={6}
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={state === 'loading'}
              placeholder="Напишите черновик и нажмите «Полировать»"
            />
            <Button
              type="button"
              className="mt-3 w-full"
              onClick={onPolish}
              disabled={state === 'loading' || text.trim().length < 30}
            >
              {state === 'loading' ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  AI отвечает…
                </>
              ) : (
                <>
                  <Sparkles className="size-4" />
                  Полировать
                  <ArrowRight className="size-3.5 opacity-60" />
                </>
              )}
            </Button>
            {text.trim().length < 30 ? (
              <p className="mt-1.5 text-xs text-muted-foreground">
                Минимум 30 символов
              </p>
            ) : null}
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                После AI
              </span>
              {provider ? (
                <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  provider: {provider}
                </span>
              ) : null}
            </div>
            <div
              className="min-h-[148px] rounded-lg border border-border bg-background p-3 text-sm leading-relaxed"
              aria-live="polite"
            >
              {state === 'loading' ? (
                <span className="text-muted-foreground">Обрабатываю запрос…</span>
              ) : state === 'error' ? (
                <span className="text-destructive">
                  AI временно недоступен — попробуйте позже.
                </span>
              ) : polished ? (
                <span className="whitespace-pre-wrap">{polished}</span>
              ) : (
                <span className="text-muted-foreground">
                  Результат появится здесь. Сравните до/после — содержание то же, тон чище.
                </span>
              )}
            </div>
            {polished ? (
              <p className="mt-2 text-xs text-muted-foreground">
                Это тот же endpoint, что внутри формы. Реальные провайдеры, реальный
                cascade, реальный токен.
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
