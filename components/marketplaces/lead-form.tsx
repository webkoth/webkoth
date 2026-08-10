'use client'

import { useRef, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Send, Check, Loader2, CircleAlert, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { contacts } from '@/lib/landing/contacts'
import {
  marketplacesLeadSchema,
  type MarketplacesLeadInput,
  type MarketplaceId,
  type CatalogSize,
  type Role,
} from '@/lib/marketplaces/schemas'

const MARKETPLACE_OPTIONS: { id: MarketplaceId; label: string }[] = [
  { id: 'wb', label: 'Wildberries' },
  { id: 'ozon', label: 'Ozon' },
  { id: 'ym', label: 'Яндекс.Маркет' },
]
const CATALOG_OPTIONS: { id: CatalogSize; label: string }[] = [
  { id: 'lt100', label: 'до 100' },
  { id: '100_1000', label: '100–1000' },
  { id: 'gt1000', label: 'больше 1000' },
]
const ROLE_OPTIONS: { id: Role; label: string }[] = [
  { id: 'owner', label: 'Владелец' },
  { id: 'manager', label: 'Менеджер' },
  { id: 'other', label: 'Другое' },
]

// mode='toggle' — независимый переключатель (площадки, их можно выбрать несколько),
// mode='radio' — взаимоисключающий выбор внутри role="radiogroup".
// Оформление общее: разметка для скринридера различается, вид — нет.
function Chip({
  active,
  mode = 'toggle',
  onClick,
  onKeyDown,
  tabIndex,
  ref,
  children,
}: {
  active: boolean
  mode?: 'toggle' | 'radio'
  onClick: () => void
  onKeyDown?: React.KeyboardEventHandler<HTMLButtonElement>
  tabIndex?: number
  ref?: React.Ref<HTMLButtonElement>
  children: React.ReactNode
}) {
  return (
    <button
      ref={ref}
      type="button"
      role={mode === 'radio' ? 'radio' : undefined}
      aria-pressed={mode === 'toggle' ? active : undefined}
      aria-checked={mode === 'radio' ? active : undefined}
      tabIndex={tabIndex}
      onClick={onClick}
      onKeyDown={onKeyDown}
      className={cn(
        'rounded-full border px-4 py-2 text-sm transition',
        active
          ? 'border-primary bg-primary/10 text-primary'
          : 'border-border text-muted-foreground hover:border-primary/40',
      )}
    >
      {children}
    </button>
  )
}

// Roving tabindex: в группу Tab заводит один раз — на выбранный чип, дальше
// выбор двигают стрелки. Так ведёт себя нативная группа radio, и так скринридер
// сообщает «выбрано 1 из 3», а не три независимых кнопки-переключателя.
function ChipRadioGroup<T extends string>({
  labelId,
  options,
  value,
  onChange,
}: {
  labelId: string
  options: { id: T; label: string }[]
  value: T
  onChange: (id: T) => void
}) {
  const chipRefs = useRef<(HTMLButtonElement | null)[]>([])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    const step =
      e.key === 'ArrowRight' || e.key === 'ArrowDown'
        ? 1
        : e.key === 'ArrowLeft' || e.key === 'ArrowUp'
          ? -1
          : 0
    if (step === 0) return
    e.preventDefault()
    const next = (index + step + options.length) % options.length
    onChange(options[next].id)
    chipRefs.current[next]?.focus()
  }

  return (
    <div role="radiogroup" aria-labelledby={labelId} className="flex flex-wrap gap-2">
      {options.map((o, i) => (
        <Chip
          key={o.id}
          mode="radio"
          active={value === o.id}
          tabIndex={value === o.id ? 0 : -1}
          ref={(el) => {
            chipRefs.current[i] = el
          }}
          onClick={() => onChange(o.id)}
          onKeyDown={(e) => handleKeyDown(e, i)}
        >
          {o.label}
        </Chip>
      ))}
    </div>
  )
}

type SubmitState = 'idle' | 'submitting' | 'success' | 'error' | 'rate_limited'

// Пропов нет: заголовок и подпись секции рисует page.tsx, форма отвечает только за поля.
export function LeadForm() {
  const [state, setState] = useState<SubmitState>('idle')

  // Момент монтирования — анти-бот метка: роут отсекает отправки быстрее 1.5 с.
  // Ленивый useState, а не useRef: значение вычисляется один раз и переживает
  // ре-рендеры, при этом не читается из ref во время рендера (react-hooks/refs).
  const [mountedAt] = useState(() => Date.now())

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MarketplacesLeadInput>({
    resolver: zodResolver(marketplacesLeadSchema),
    defaultValues: {
      name: '',
      phone: '',
      contact: '',
      marketplaces: [],
      catalogSize: 'lt100',
      role: 'owner',
      comment: '',
      website: '',
      filledAtMs: 1,
    },
  })

  const onSubmit = async (values: MarketplacesLeadInput) => {
    setState('submitting')
    try {
      const res = await fetch('/api/marketplaces/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, filledAtMs: mountedAt }),
      })
      // 429 — отдельное состояние: бакет отдаёт 5 попыток на 10 минут, и совет
      // «попробуйте ещё раз» здесь гарантированно не сработает.
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
      <div role="status" className="rounded-2xl border border-primary/40 bg-card/50 p-6">
        <div className="flex items-center gap-2 text-primary">
          <Check className="size-5" aria-hidden />
          <p className="text-base font-semibold">Заявка получена</p>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          Напишу в течение дня. Если нужно быстрее —{' '}
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

      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label htmlFor="mp-name" className="mb-1.5 block text-sm font-medium">
            Имя
          </label>
          <Input
            id="mp-name"
            {...register('name')}
            placeholder="Иван"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'mp-name-error' : undefined}
          />
          {errors.name ? (
            <p id="mp-name-error" className="mt-1 text-xs text-destructive">
              {errors.name.message}
            </p>
          ) : null}
        </div>
        <div>
          <label htmlFor="mp-phone" className="mb-1.5 block text-sm font-medium">
            Телефон
          </label>
          <Input
            id="mp-phone"
            {...register('phone')}
            placeholder="+7 999 123-45-67"
            inputMode="tel"
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? 'mp-phone-error' : undefined}
          />
          {errors.phone ? (
            <p id="mp-phone-error" className="mt-1 text-xs text-destructive">
              {errors.phone.message}
            </p>
          ) : null}
        </div>
        <div>
          <label htmlFor="mp-contact" className="mb-1.5 block text-sm font-medium">
            Telegram или email
          </label>
          <Input
            id="mp-contact"
            {...register('contact')}
            placeholder="@ivan"
            aria-invalid={!!errors.contact}
            aria-describedby={errors.contact ? 'mp-contact-error' : undefined}
          />
          {errors.contact ? (
            <p id="mp-contact-error" className="mt-1 text-xs text-destructive">
              {errors.contact.message}
            </p>
          ) : null}
        </div>
      </div>

      <div>
        <span id="mp-marketplaces-label" className="mb-2 block text-sm font-medium">
          Площадки
        </span>
        <Controller
          control={control}
          name="marketplaces"
          render={({ field }) => (
            // Множественный выбор — остаётся group + aria-pressed, это верная семантика.
            <div
              role="group"
              aria-labelledby="mp-marketplaces-label"
              className="flex flex-wrap gap-2"
            >
              {MARKETPLACE_OPTIONS.map((o) => {
                const active = field.value.includes(o.id)
                return (
                  <Chip
                    key={o.id}
                    active={active}
                    onClick={() =>
                      field.onChange(
                        active ? field.value.filter((v) => v !== o.id) : [...field.value, o.id],
                      )
                    }
                  >
                    {o.label}
                  </Chip>
                )
              })}
            </div>
          )}
        />
        {errors.marketplaces ? (
          <p className="mt-1 text-xs text-destructive">{errors.marketplaces.message}</p>
        ) : null}
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <span id="mp-catalog-label" className="mb-2 block text-sm font-medium">
            Размер каталога
          </span>
          <Controller
            control={control}
            name="catalogSize"
            render={({ field }) => (
              <ChipRadioGroup
                labelId="mp-catalog-label"
                options={CATALOG_OPTIONS}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </div>
        <div>
          <span id="mp-role-label" className="mb-2 block text-sm font-medium">
            Ваша роль
          </span>
          <Controller
            control={control}
            name="role"
            render={({ field }) => (
              <ChipRadioGroup
                labelId="mp-role-label"
                options={ROLE_OPTIONS}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </div>
      </div>

      <div>
        <label htmlFor="mp-comment" className="mb-1.5 block text-sm font-medium">
          Комментарий (необязательно)
        </label>
        <Textarea
          id="mp-comment"
          {...register('comment')}
          rows={3}
          maxLength={4000}
          placeholder="Что сейчас болит больше всего?"
          aria-invalid={!!errors.comment}
          aria-describedby={errors.comment ? 'mp-comment-error' : undefined}
        />
        {errors.comment ? (
          <p id="mp-comment-error" className="mt-1 text-xs text-destructive">
            {errors.comment.message}
          </p>
        ) : null}
      </div>

      {state === 'rate_limited' ? (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-xl border border-destructive/40 p-4 text-sm"
        >
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
        <div
          role="alert"
          className="flex items-start gap-2 rounded-xl border border-destructive/40 p-4 text-sm"
        >
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
          <Loader2 className="size-4 animate-spin" aria-hidden />
        ) : (
          <Send className="size-4" aria-hidden />
        )}
        {state === 'submitting' ? 'Отправляю…' : 'Записаться на разбор'}
      </Button>
    </form>
  )
}
