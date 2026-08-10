'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Send, Check, Loader2, CircleAlert } from 'lucide-react'
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

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
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

type SubmitState = 'idle' | 'submitting' | 'success' | 'error'

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
      if (!res.ok) throw new Error(String(res.status))
      setState('success')
      reset()
    } catch {
      setState('error')
    }
  }

  if (state === 'success') {
    return (
      <div className="rounded-2xl border border-primary/40 bg-card/50 p-6">
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
          <label className="mb-1.5 block text-sm font-medium">Имя</label>
          <Input {...register('name')} placeholder="Иван" />
          {errors.name ? <p className="mt-1 text-xs text-destructive">{errors.name.message}</p> : null}
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Телефон</label>
          <Input {...register('phone')} placeholder="+7 999 123-45-67" inputMode="tel" />
          {errors.phone ? <p className="mt-1 text-xs text-destructive">{errors.phone.message}</p> : null}
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Telegram или email</label>
          <Input {...register('contact')} placeholder="@ivan" />
          {errors.contact ? <p className="mt-1 text-xs text-destructive">{errors.contact.message}</p> : null}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Площадки</label>
        <Controller
          control={control}
          name="marketplaces"
          render={({ field }) => (
            <div role="group" className="flex flex-wrap gap-2">
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
          <label className="mb-2 block text-sm font-medium">Размер каталога</label>
          <Controller
            control={control}
            name="catalogSize"
            render={({ field }) => (
              <div role="group" className="flex flex-wrap gap-2">
                {CATALOG_OPTIONS.map((o) => (
                  <Chip key={o.id} active={field.value === o.id} onClick={() => field.onChange(o.id)}>
                    {o.label}
                  </Chip>
                ))}
              </div>
            )}
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium">Ваша роль</label>
          <Controller
            control={control}
            name="role"
            render={({ field }) => (
              <div role="group" className="flex flex-wrap gap-2">
                {ROLE_OPTIONS.map((o) => (
                  <Chip key={o.id} active={field.value === o.id} onClick={() => field.onChange(o.id)}>
                    {o.label}
                  </Chip>
                ))}
              </div>
            )}
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium">Комментарий (необязательно)</label>
        <Textarea {...register('comment')} rows={3} placeholder="Что сейчас болит больше всего?" />
      </div>

      {state === 'error' ? (
        <div className="flex items-start gap-2 rounded-xl border border-destructive/40 p-4 text-sm">
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
