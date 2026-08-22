'use client'

import { useEffect, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Sparkles, Send, Loader2, CheckCircle2, AlertCircle, ChevronDown, CalendarClock } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { leadSchema, type LeadInput, type AiSummary } from '@/lib/dev-presentation/schemas'

type SubmitState =
  | { kind: 'idle' }
  | { kind: 'polishing' }
  | { kind: 'submitting' }
  | { kind: 'success'; aiSummary: AiSummary | null }
  | { kind: 'partial'; aiSummary: AiSummary | null; missing: string[] }
  | { kind: 'error' }

export function LeadFormTest() {
  const [state, setState] = useState<SubmitState>({ kind: 'idle' })
  const [summaryOpen, setSummaryOpen] = useState(false)

  const form = useForm<LeadInput>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      message: '',
      website: '',
      filledAtMs: 0,
    },
  })

  // Set filledAtMs on mount (client-only)
  useEffect(() => {
    form.setValue('filledAtMs', Date.now())
  }, [form])

  const messageValue = useWatch({ control: form.control, name: 'message' }) ?? ''
  const polishDisabled =
    state.kind !== 'idle' || messageValue.trim().length < 30

  const onPolish = async () => {
    setState({ kind: 'polishing' })
    try {
      const res = await fetch('/api/ai/polish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: messageValue }),
      })
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null
        const errCode = data?.error ?? 'unknown'
        if (errCode === 'rate_limit') {
          toast.error('Слишком частые запросы', { description: 'Попробуйте через минуту' })
        } else {
          toast.error('AI временно недоступен', { description: 'Отправляйте сообщение как есть' })
        }
        setState({ kind: 'idle' })
        return
      }
      const data = (await res.json()) as { polished: string; provider: string }
      form.setValue('message', data.polished, { shouldValidate: true })
      toast.success('Готово', { description: `Провайдер: ${data.provider}` })
      setState({ kind: 'idle' })
    } catch {
      toast.error('AI временно недоступен', { description: 'Отправляйте сообщение как есть' })
      setState({ kind: 'idle' })
    }
  }

  const onSubmit = async (values: LeadInput) => {
    setState({ kind: 'submitting' })
    try {
      const res = await fetch('/api/dev-presentation/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      const data = await res.json().catch(() => null)

      if (res.status === 429) {
        toast.error('Слишком частые отправки', { description: 'Попробуйте через минуту' })
        setState({ kind: 'idle' })
        return
      }

      if (res.status === 400) {
        const issues = data?.issues?.fieldErrors as Record<string, string[]> | undefined
        if (issues) {
          for (const [field, msgs] of Object.entries(issues)) {
            if (msgs?.[0]) {
              form.setError(field as keyof LeadInput, { message: msgs[0] })
            }
          }
        }
        toast.error('Проверьте поля формы')
        setState({ kind: 'idle' })
        return
      }

      if (!res.ok || !data?.ok) {
        setState({ kind: 'error' })
        toast.error('Не удалось доставить сообщение', {
          description: 'Попробуйте ещё раз или напишите в Telegram',
        })
        return
      }

      // Success or partial
      const aiSummary = (data.aiSummary ?? null) as AiSummary | null
      if (data.partial) {
        setState({ kind: 'partial', aiSummary, missing: data.missing ?? [] })
      } else {
        setState({ kind: 'success', aiSummary })
      }
      toast.success('Сообщение отправлено', {
        description: `На ${values.email} ушла копия`,
      })
    } catch {
      setState({ kind: 'error' })
      toast.error('Не удалось отправить', {
        description: 'Проверьте интернет и попробуйте ещё раз',
      })
    }
  }

  // Success / partial view
  if (state.kind === 'success' || state.kind === 'partial') {
    const email = form.getValues('email')
    const aiSummary = state.aiSummary
    return (
      <div className="py-2 text-center">
        <div className="mx-auto mb-4 inline-flex size-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
          <CheckCircle2 className="size-6" />
        </div>
        <h3 className="mb-2 text-xl font-semibold tracking-tight md:text-2xl">
          Письмо отправлено
        </h3>
        <p className="mb-2 text-muted-foreground">
          На <span className="font-medium text-foreground">{email}</span> ушла копия.
        </p>
        <p className="mb-6 text-sm text-muted-foreground">
          Проверьте папку «Промоакции» / Спам, иногда туда улетает.
        </p>

        {state.kind === 'partial' ? (
          <div className="mx-auto mb-6 max-w-md rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-left text-xs text-amber-700 dark:text-amber-400">
            <strong>Важно:</strong> копию на ваш адрес не доставили
            ({state.missing.join(', ')}). Письмо владельцу ушло — он ответит вручную.
          </div>
        ) : null}

        {aiSummary ? (
          <div className="mx-auto mb-6 max-w-md">
            <button
              type="button"
              onClick={() => setSummaryOpen((v) => !v)}
              className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-muted-foreground transition hover:text-primary"
            >
              <ChevronDown
                className={`size-3.5 transition-transform ${summaryOpen ? 'rotate-0' : '-rotate-90'}`}
              />
              Как ваш запрос понял AI (опц.)
            </button>
            {summaryOpen ? (
              <div className="mt-3 rounded-lg border border-border bg-card p-4 text-left text-sm">
                <p className="mb-2">{aiSummary.tldr}</p>
                <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  Intent: <span className="text-primary">{aiSummary.intent}</span>{' '}
                  · Urgency: <span className="text-primary">{aiSummary.urgency}</span>
                </p>
              </div>
            ) : null}
          </div>
        ) : null}

        <div className="mx-auto flex max-w-md flex-wrap justify-center gap-2">
          <Button render={<a href="https://t.me/abnorsky" target="_blank" rel="noopener noreferrer" />} variant="outline" size="sm">
            <Send className="size-3.5" />
            Telegram @abnorsky
          </Button>
          <Button render={<a href="https://calendar.app.google/jY324Q2AHe1apJo79" target="_blank" rel="noopener noreferrer" />} variant="outline" size="sm">
            <CalendarClock className="size-3.5" />
            15-мин звонок
          </Button>
        </div>
      </div>
    )
  }

  // Idle / polishing / submitting / error
  const isSubmitting = state.kind === 'submitting'
  const isPolishing = state.kind === 'polishing'
  const fieldsDisabled = isSubmitting

  return (
    <div>
      <div className="mb-5">
        <h3 className="text-xl font-semibold tracking-tight md:text-2xl">
          Напишите мне
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Имя, контакт, пара слов о задаче — отвечу в течение 24ч.
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {/* honeypot */}
        <input
          type="text"
          {...form.register('website')}
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
        />

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="dp-name" className="mb-1.5 block text-sm">
              Имя
            </label>
            <Input
              id="dp-name"
              {...form.register('name')}
              disabled={fieldsDisabled}
              aria-invalid={!!form.formState.errors.name}
              aria-describedby={form.formState.errors.name ? 'dp-name-err' : undefined}
            />
            {form.formState.errors.name ? (
              <p id="dp-name-err" className="mt-1 text-xs text-destructive">
                {form.formState.errors.name.message}
              </p>
            ) : null}
          </div>

          <div>
            <label htmlFor="dp-phone" className="mb-1.5 block text-sm">
              Телефон
            </label>
            <Input
              id="dp-phone"
              type="tel"
              placeholder="+7 999 123 45 67"
              {...form.register('phone')}
              disabled={fieldsDisabled}
              aria-invalid={!!form.formState.errors.phone}
              aria-describedby={form.formState.errors.phone ? 'dp-phone-err' : undefined}
            />
            {form.formState.errors.phone ? (
              <p id="dp-phone-err" className="mt-1 text-xs text-destructive">
                {form.formState.errors.phone.message}
              </p>
            ) : null}
          </div>

          <div className="md:col-span-2">
            <label htmlFor="dp-email" className="mb-1.5 block text-sm">
              Email
            </label>
            <Input
              id="dp-email"
              type="email"
              placeholder="you@example.com"
              {...form.register('email')}
              disabled={fieldsDisabled}
              aria-invalid={!!form.formState.errors.email}
              aria-describedby={form.formState.errors.email ? 'dp-email-err' : undefined}
            />
            {form.formState.errors.email ? (
              <p id="dp-email-err" className="mt-1 text-xs text-destructive">
                {form.formState.errors.email.message}
              </p>
            ) : null}
          </div>

          <div className="md:col-span-2">
            <label htmlFor="dp-message" className="mb-1.5 block text-sm">
              Сообщение
            </label>
            <Textarea
              id="dp-message"
              rows={5}
              placeholder="Кратко опишите задачу: что нужно, в какие сроки, какой бюджет..."
              {...form.register('message')}
              disabled={fieldsDisabled || isPolishing}
              aria-invalid={!!form.formState.errors.message}
              aria-describedby={form.formState.errors.message ? 'dp-message-err' : undefined}
            />
            {form.formState.errors.message ? (
              <p id="dp-message-err" className="mt-1 text-xs text-destructive">
                {form.formState.errors.message.message}
              </p>
            ) : null}
            <div className="mt-2 flex items-center justify-between gap-2">
              <span className="text-xs text-muted-foreground">
                {messageValue.length} / 4000
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onPolish}
                disabled={polishDisabled}
                title={
                  messageValue.trim().length < 30
                    ? 'Минимум 30 символов'
                    : 'AI перепишет яснее и вежливее'
                }
              >
                {isPolishing ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Sparkles className="size-3.5" />
                )}
                {isPolishing ? 'Полирую…' : 'Сформулировать чище'}
              </Button>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={isSubmitting || isPolishing}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Отправляю…
            </>
          ) : (
            <>
              <Send className="size-4" />
              Отправить
            </>
          )}
        </Button>

        {state.kind === 'error' ? (
          <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <div>
              <p className="font-medium">Не удалось доставить сообщение</p>
              <p className="mt-1 text-xs">
                Попробуйте ещё раз или напишите напрямую в{' '}
                <a
                  href="https://t.me/abnorsky"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  Telegram
                </a>
                .
              </p>
            </div>
          </div>
        ) : null}
      </form>
    </div>
  )
}
