'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Send, Check, LoaderCircle, CircleAlert, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { contacts } from '@/lib/landing/contacts'
import { evolutionLeadSchema, type EvolutionLeadInput } from '@/lib/evolution/schemas'
import type { EvolutionData } from '@/app/data/evolution'

type SubmitState = 'idle' | 'submitting' | 'success' | 'error' | 'rate_limited'

// Минимум полей: имя, контакт и один вопрос — он же первый квалифицирующий
// вопрос оффера. Заголовок и подпись секции рисует page.tsx.
export function LeadForm({ copy }: { copy: EvolutionData['finale']['form'] }) {
  const [state, setState] = useState<SubmitState>('idle')

  // Момент монтирования — анти-бот метка: роут отсекает отправки быстрее 1.5 с.
  // Ленивый useState: считается один раз и не читается из ref во время рендера.
  const [mountedAt] = useState(() => Date.now())

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EvolutionLeadInput>({
    resolver: zodResolver(evolutionLeadSchema),
    defaultValues: { name: '', contact: '', answer: '', website: '', filledAtMs: 1 },
  })

  const onSubmit = async (values: EvolutionLeadInput) => {
    setState('submitting')
    try {
      const res = await fetch('/api/evolution/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, filledAtMs: mountedAt }),
      })
      // 429 — отдельное состояние: совет «попробуйте ещё раз» тут не сработает.
      if (res.status === 429) {
        setState('rate_limited')
        return
      }
      if (!res.ok) throw new Error(String(res.status))
      setState('success')
      reset()
    } catch {
      setState('error')
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
            Telegram
          </a>
          .
        </p>
      </div>
    )
  }

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
          <label htmlFor="evo-name" className="mb-1.5 block text-sm font-medium">
            {copy.fields.name}
          </label>
          <Input
            id="evo-name"
            {...register('name')}
            placeholder={copy.placeholders.name}
            autoComplete="name"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'evo-name-error' : undefined}
          />
          {errors.name ? (
            <p id="evo-name-error" className="mt-1 text-xs text-destructive">
              {errors.name.message}
            </p>
          ) : null}
        </div>
        <div>
          <label htmlFor="evo-contact" className="mb-1.5 block text-sm font-medium">
            {copy.fields.contact}
          </label>
          <Input
            id="evo-contact"
            {...register('contact')}
            placeholder={copy.placeholders.contact}
            aria-invalid={!!errors.contact}
            aria-describedby={errors.contact ? 'evo-contact-error' : undefined}
          />
          {errors.contact ? (
            <p id="evo-contact-error" className="mt-1 text-xs text-destructive">
              {errors.contact.message}
            </p>
          ) : null}
        </div>
      </div>

      <div>
        <label htmlFor="evo-answer" className="mb-1.5 block text-sm font-medium">
          {copy.fields.answer}
        </label>
        <Textarea
          id="evo-answer"
          {...register('answer')}
          rows={4}
          maxLength={4000}
          placeholder={copy.placeholders.answer}
          aria-invalid={!!errors.answer}
          aria-describedby={errors.answer ? 'evo-answer-error' : undefined}
        />
        {errors.answer ? (
          <p id="evo-answer-error" className="mt-1 text-xs text-destructive">
            {errors.answer.message}
          </p>
        ) : null}
      </div>

      {state === 'rate_limited' ? (
        <div role="alert" className="flex items-start gap-2 rounded-xl border border-destructive/40 p-4 text-sm">
          <Clock className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden />
          <span>
            Слишком много отправок с вашего адреса. Ограничение временное, но повторять сейчас
            бесполезно — напишите в{' '}
            <a href={contacts.telegram} className="text-primary hover:underline">
              Telegram
            </a>
            , отвечу там.
          </span>
        </div>
      ) : null}

      {state === 'error' ? (
        <div role="alert" className="flex items-start gap-2 rounded-xl border border-destructive/40 p-4 text-sm">
          <CircleAlert className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden />
          <span>
            Не получилось отправить. Попробуйте ещё раз или напишите в{' '}
            <a href={contacts.telegram} className="text-primary hover:underline">
              Telegram
            </a>
            .
          </span>
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
