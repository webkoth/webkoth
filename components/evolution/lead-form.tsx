'use client'

import { useId, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Send, Check, LoaderCircle, CircleAlert, Clock, User, AtSign, MessageSquareText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { contacts } from '@/lib/landing/contacts'
import { evolutionLeadSchema, type EvolutionLeadInput } from '@/lib/evolution/schemas'
import type { EvolutionData, Lang, LinkedText } from '@/app/data/evolution/types'

type SubmitState = 'idle' | 'submitting' | 'success' | 'error' | 'rate_limited'

function TelegramNote({ text }: { text: LinkedText }) {
  return (
    <span>
      {text.before}
      <a href={contacts.telegram} className="text-primary hover:underline">
        {text.link}
      </a>
      {text.after}
    </span>
  )
}

const openTelegram = () => window.open(contacts.telegram, '_blank', 'noopener,noreferrer')

// Минимум полей: имя, контакт и один вопрос — он же первый квалифицирующий
// вопрос оффера. Форма живёт в двух местах — inline в финале и в модалке —
// поэтому id полей берутся из useId. Сообщения валидации приходят из схемы
// кодами и переводятся через `copy.errors`. Исход отправки — тост (sonner);
// inline-плашки ошибок остаются, чтобы текст был рядом с кнопкой.
export function LeadForm({
  copy,
  lang,
  startedAt,
  onSuccess,
}: {
  copy: EvolutionData['finale']['form']
  lang: Lang
  /** Момент, с которого считается антибот-таймер: открытие модалки или монтирование. */
  startedAt?: number
  onSuccess?: () => void
}) {
  const [state, setState] = useState<SubmitState>('idle')
  const uid = useId()
  const id = (field: string) => `lead-${field}-${uid}`

  // Момент монтирования — анти-бот метка: роут отсекает отправки быстрее 1.5 с.
  // Ленивый useState: считается один раз и не читается из ref во время рендера.
  const [mountedAt] = useState(() => Date.now())
  const filledAt = startedAt ?? mountedAt

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EvolutionLeadInput>({
    resolver: zodResolver(evolutionLeadSchema),
    defaultValues: { name: '', contact: '', answer: '', website: '', filledAtMs: 1, lang },
  })

  const msg = (code?: string) => (code ? (copy.errors[code] ?? code) : undefined)

  const onSubmit = async (values: EvolutionLeadInput) => {
    setState('submitting')
    try {
      const res = await fetch('/api/evolution/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, filledAtMs: filledAt, lang }),
      })
      // 429 — отдельное состояние: совет «попробуйте ещё раз» тут не сработает.
      if (res.status === 429) {
        setState('rate_limited')
        toast.warning(copy.toast.rateLimited, {
          description: copy.toast.rateLimitedBody,
          action: { label: copy.toast.action, onClick: openTelegram },
        })
        return
      }
      if (!res.ok) throw new Error(String(res.status))
      setState('success')
      reset()
      toast.success(copy.toast.success, {
        description: copy.toast.successBody,
        duration: 6000,
        action: { label: copy.toast.action, onClick: openTelegram },
      })
      onSuccess?.()
    } catch {
      setState('error')
      toast.error(copy.toast.error, {
        description: copy.toast.errorBody,
        duration: Infinity,
        action: { label: copy.toast.action, onClick: openTelegram },
      })
    }
  }

  if (state === 'success') {
    return (
      <div role="status" className="rounded-2xl border border-primary/40 bg-card/70 p-6">
        <div className="flex items-center gap-2 text-primary">
          <Check className="size-5" aria-hidden />
          <p className="text-base font-semibold">{copy.success.title}</p>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          {copy.success.body}{' '}
          <a href={contacts.telegram} className="text-primary hover:underline">
            {copy.success.link}
          </a>
          .
        </p>
      </div>
    )
  }

  const fieldIcon = 'pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground'

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {/* honeypot: скрыт от людей, виден ботам */}
      <input
        {...register('website')}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor={id('name')} className="mb-1.5 block text-sm font-medium">
            {copy.fields.name}
          </label>
          <div className="relative">
            <User className={fieldIcon} aria-hidden />
            <Input
              id={id('name')}
              {...register('name')}
              placeholder={copy.placeholders.name}
              autoComplete="name"
              className="pl-9"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? id('name-error') : undefined}
            />
          </div>
          {errors.name ? (
            <p id={id('name-error')} className="mt-1 text-xs text-destructive">
              {msg(errors.name.message)}
            </p>
          ) : null}
        </div>
        <div>
          <label htmlFor={id('contact')} className="mb-1.5 block text-sm font-medium">
            {copy.fields.contact}
          </label>
          <div className="relative">
            <AtSign className={fieldIcon} aria-hidden />
            <Input
              id={id('contact')}
              {...register('contact')}
              placeholder={copy.placeholders.contact}
              className="pl-9"
              aria-invalid={!!errors.contact}
              aria-describedby={errors.contact ? id('contact-error') : undefined}
            />
          </div>
          {errors.contact ? (
            <p id={id('contact-error')} className="mt-1 text-xs text-destructive">
              {msg(errors.contact.message)}
            </p>
          ) : null}
        </div>
      </div>

      <div>
        <label htmlFor={id('answer')} className="mb-1.5 flex items-center gap-1.5 text-sm font-medium">
          <MessageSquareText className="size-4 text-muted-foreground" aria-hidden />
          {copy.fields.answer}
        </label>
        <Textarea
          id={id('answer')}
          {...register('answer')}
          rows={4}
          maxLength={4000}
          placeholder={copy.placeholders.answer}
          aria-invalid={!!errors.answer}
          aria-describedby={errors.answer ? id('answer-error') : undefined}
        />
        {errors.answer ? (
          <p id={id('answer-error')} className="mt-1 text-xs text-destructive">
            {msg(errors.answer.message)}
          </p>
        ) : null}
      </div>

      {state === 'rate_limited' ? (
        <div role="alert" className="flex items-start gap-2 rounded-xl border border-destructive/40 p-4 text-sm">
          <Clock className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden />
          <TelegramNote text={copy.rateLimited} />
        </div>
      ) : null}

      {state === 'error' ? (
        <div role="alert" className="flex items-start gap-2 rounded-xl border border-destructive/40 p-4 text-sm">
          <CircleAlert className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden />
          <TelegramNote text={copy.failed} />
        </div>
      ) : null}

      <Button type="submit" size="lg" disabled={state === 'submitting'}>
        {state === 'submitting' ? (
          <LoaderCircle className="size-4 animate-spin" aria-hidden />
        ) : (
          <Send className="size-4" aria-hidden />
        )}
        {state === 'submitting' ? copy.submitting : copy.submit}
      </Button>
    </form>
  )
}
