'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Check, CircleCheck, Sparkles } from 'lucide-react'
import type { IllustrationKind } from '@/app/data/avtomatizaciya'
import { cn } from '@/lib/utils'
import { CountUp, SPRING, useSeen } from './motion'

// Живые иллюстрации шести направлений: те же сюжеты, что набор «Деньги и учёт» в роликах
// finstock (водопад, сверка, сетка остатков, утренняя сводка, карточка, чат). Цифры условные,
// поэтому в углу панели подпись «Пример». Один акцент на сцену — циан.

const rub = (n: number) => `${n.toLocaleString('ru-RU')} ₽`

export function Illustration({ kind, exampleLabel }: { kind: IllustrationKind; exampleLabel: string }) {
  const Scene = SCENES[kind]
  return (
    <div className="relative">
      <span className="absolute top-0 right-0 rounded-full bg-foreground/5 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
        {exampleLabel}
      </span>
      <Scene />
    </div>
  )
}

// 1. От выручки к прибыли: столбики вычетов «висят» на уровне, где кончился предыдущий.
const WATERFALL = [
  { label: 'Выручка', from: 0, size: 100, tone: 'base' },
  { label: 'Комиссия', from: 76, size: 24, tone: 'cut' },
  { label: 'Логистика', from: 64, size: 12, tone: 'cut' },
  { label: 'Реклама', from: 55, size: 9, tone: 'cut' },
  { label: 'Себест.', from: 28, size: 27, tone: 'cut' },
  { label: 'Прибыль', from: 0, size: 28, tone: 'accent' },
] as const

function Waterfall() {
  const { ref, seen } = useSeen<HTMLDivElement>()
  return (
    <div ref={ref} className="pt-8">
      <p className="text-sm text-muted-foreground">Чехол для iPhone 15 · за месяц</p>
      {/* На телефоне столбики лежат: подписи длинные, в шесть узких колонок не влезают. */}
      <ul className="mt-4 space-y-2 sm:hidden" aria-hidden>
        {WATERFALL.map((b, i) => (
          <li key={b.label} className="grid grid-cols-[5.5rem_minmax(0,1fr)] items-center gap-3">
            <span className={cn('text-xs', b.tone === 'accent' ? 'font-semibold text-primary' : 'text-muted-foreground')}>{b.label}</span>
            <span className="relative h-5">
              <motion.span
                className={cn(
                  'absolute inset-y-0 origin-left rounded-md',
                  b.tone === 'accent' && 'bg-primary',
                  b.tone === 'base' && 'bg-foreground/25',
                  b.tone === 'cut' && 'bg-foreground/10',
                )}
                style={{ left: `${b.from}%`, width: `${b.size}%` }}
                initial={{ scaleX: 0 }}
                animate={seen ? { scaleX: 1 } : { scaleX: 0 }}
                transition={{ ...SPRING, delay: 0.15 + i * 0.14 }}
              />
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-4 hidden h-44 items-stretch gap-2 sm:flex sm:gap-3" aria-hidden>
        {WATERFALL.map((b, i) => (
          <div key={b.label} className="relative min-w-0 flex-1">
            <motion.div
              className={cn(
                'absolute inset-x-0 origin-bottom rounded-lg',
                b.tone === 'accent' && 'bg-primary',
                b.tone === 'base' && 'bg-foreground/25',
                b.tone === 'cut' && 'bg-foreground/10',
              )}
              style={{ bottom: `${b.from}%`, height: `${b.size}%` }}
              initial={{ scaleY: 0 }}
              animate={seen ? { scaleY: 1 } : { scaleY: 0 }}
              transition={{ ...SPRING, delay: 0.15 + i * 0.14 }}
            />
          </div>
        ))}
      </div>
      <div className="mt-2 hidden gap-2 sm:flex sm:gap-3">
        {WATERFALL.map((b) => (
          <span
            key={b.label}
            className={cn('min-w-0 flex-1 truncate text-center text-[11px] sm:text-xs', b.tone === 'accent' ? 'font-semibold text-primary' : 'text-muted-foreground')}
          >
            {b.label}
          </span>
        ))}
      </div>
      <p className="mt-5 text-sm">
        С каждой продажи остаётся <CountUp value={412} format={(n) => rub(n)} className="font-semibold text-primary" />
      </p>
    </div>
  )
}

// 2. Сверка выплаты: две суммы докручиваются, совпадают, рисуется галочка.
function Reconcile() {
  const { ref, seen } = useSeen<HTMLDivElement>()
  const rows = [
    { label: 'Выплата Wildberries за неделю', value: 184260 },
    { label: 'Наш расчёт по заказам', value: 184260 },
  ]
  return (
    <div ref={ref} className="space-y-3 pt-8">
      {rows.map((r) => (
        <div key={r.label} className="flex items-baseline justify-between gap-4 rounded-2xl bg-foreground/[0.04] px-4 py-3">
          <span className="text-sm text-muted-foreground">{r.label}</span>
          <CountUp value={r.value} format={rub} className="text-lg font-semibold" />
        </div>
      ))}
      <div className="flex items-center gap-3 pt-2">
        <svg viewBox="0 0 24 24" className="size-8 text-primary" aria-hidden>
          <motion.circle
            cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.6"
            initial={{ pathLength: 0 }} animate={{ pathLength: seen ? 1 : 0 }} transition={{ duration: 0.6, delay: 1.2 }}
          />
          <motion.path
            d="M7.5 12.5l3 3 6-6.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            initial={{ pathLength: 0 }} animate={{ pathLength: seen ? 1 : 0 }} transition={{ duration: 0.4, delay: 1.7 }}
          />
        </svg>
        <motion.span
          className="rounded-full bg-foreground px-3 py-1 text-sm font-medium text-background"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={seen ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.96 }}
          transition={{ ...SPRING, delay: 1.9 }}
        >
          Сошлось до копейки
        </motion.span>
      </div>
    </div>
  )
}

// 3. Остатки: площадки показывают старые числа и по очереди догоняют склад.
const STOCK = [
  { name: 'Кабель USB-C', stock: 48, stale: [52, 50, 55] },
  { name: 'Чехол iPhone 15', stock: 0, stale: [3, 2, 1] },
  { name: 'Наушники', stock: 17, stale: [20, 17, 19] },
]
const CHANNELS = ['WB', 'Ozon', 'Маркет']

function StockGrid() {
  const { ref, seen } = useSeen<HTMLDivElement>()
  return (
    <div ref={ref} className="pt-8">
      <div className="grid grid-cols-[minmax(0,1.6fr)_repeat(4,minmax(0,1fr))] gap-1.5 text-sm">
        <span />
        <span className="text-center text-xs font-medium text-muted-foreground">Склад</span>
        {CHANNELS.map((c) => (
          <span key={c} className="text-center text-xs font-medium text-muted-foreground">{c}</span>
        ))}
        {STOCK.map((row, r) => (
          <StockRow key={row.name} row={row} r={r} seen={seen} />
        ))}
      </div>
      <motion.p
        className="mt-5 inline-flex items-center gap-2 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: seen ? 1 : 0 }}
        transition={{ delay: 2.4 }}
      >
        <CircleCheck className="size-4 text-primary" aria-hidden />
        Чехол закончился и снят с продажи везде
      </motion.p>
    </div>
  )
}

function StockRow({ row, r, seen }: { row: (typeof STOCK)[number]; r: number; seen: boolean }) {
  return (
    <>
      <span className="py-1 pr-2 text-xs leading-tight sm:py-2 sm:text-sm">{row.name}</span>
      <span className="rounded-xl bg-foreground/[0.06] py-2 text-center font-semibold tabular-nums">{row.stock}</span>
      {row.stale.map((stale, c) => (
        <SyncCell key={c} stale={stale} fresh={row.stock} delay={0.4 + (r * 3 + c) * 0.18} seen={seen} />
      ))}
    </>
  )
}

function SyncCell({ stale, fresh, delay, seen }: { stale: number; fresh: number; delay: number; seen: boolean }) {
  const [synced, setSynced] = useState(false)
  useEffect(() => {
    if (!seen) return
    const t = setTimeout(() => setSynced(true), delay * 1000)
    return () => clearTimeout(t)
  }, [seen, delay])
  return (
    <motion.span
      className="rounded-xl py-2 text-center tabular-nums"
      animate={{
        backgroundColor: synced ? 'color-mix(in oklab, var(--foreground) 9%, transparent)' : 'color-mix(in oklab, var(--foreground) 3%, transparent)',
      }}
      transition={{ duration: 0.4 }}
    >
      <span className={synced ? 'font-medium text-foreground' : 'text-muted-foreground/70'}>{synced ? fresh : stale}</span>
    </motion.span>
  )
}

// 4. Утренняя сводка по рекламе: показатели и три предложения по ставкам.
const PROPOSALS = [
  { name: 'Чехлы iPhone', from: 210, to: 180, why: 'доля рекламы 14 %' },
  { name: 'Кабели USB-C', from: 95, to: 120, why: 'окупается, растёт спрос' },
  { name: 'Наушники', from: 160, to: 0, why: '9 дней без заказов' },
]

function Summary() {
  const { ref, seen } = useSeen<HTMLDivElement>()
  return (
    <div ref={ref} className="pt-8">
      <p className="text-sm text-muted-foreground">Сводка на 08:00</p>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {[
          { label: 'Расход вчера', node: <CountUp value={12480} format={rub} /> },
          { label: 'Доля рекламы', node: <CountUp value={78} format={(n) => `${(n / 10).toLocaleString('ru-RU')} %`} /> },
          { label: 'Без заказов', node: <CountUp value={2} format={(n) => `${n} кампании`} /> },
        ].map((k) => (
          <div key={k.label} className="rounded-2xl bg-foreground/[0.04] px-3 py-2.5">
            <p className="text-[11px] text-muted-foreground">{k.label}</p>
            <p className="mt-1 text-sm font-semibold sm:text-base">{k.node}</p>
          </div>
        ))}
      </div>
      <ul className="mt-4 space-y-2">
        {PROPOSALS.map((p, i) => (
          <motion.li
            key={p.name}
            className="flex items-center gap-3 rounded-2xl bg-foreground/[0.04] px-3 py-2.5 text-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={seen ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ ...SPRING, delay: 0.6 + i * 0.25 }}
          >
            <span className="min-w-0 flex-1">
              <span className="block truncate font-medium">{p.name}</span>
              <span className="block truncate text-xs text-muted-foreground">{p.why}</span>
            </span>
            <span className="inline-flex shrink-0 items-center gap-1 tabular-nums">
              <span className="text-muted-foreground">{p.from}</span>
              <ArrowRight className="size-3.5 text-muted-foreground" aria-hidden />
              <span className="font-semibold text-primary">{p.to === 0 ? 'пауза' : p.to}</span>
            </span>
            <span className="hidden shrink-0 rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground sm:inline">
              Принять
            </span>
          </motion.li>
        ))}
      </ul>
    </div>
  )
}

// 5. Карточка товара: переключатель «Было / Стало» с переезжающей подсветкой и чек-лист.
const CHECKS = ['Главное фото', 'Инфографика', 'Название для поиска', 'Характеристики']

function ProductCard() {
  const { ref, seen, reduce } = useSeen<HTMLDivElement>()
  const [toggled, setAfter] = useState(false)
  // Без анимации сразу показываем итог, переключатель не крутится.
  const after = reduce ? true : toggled
  useEffect(() => {
    if (!seen || reduce) return
    const id = setInterval(() => setAfter((v) => !v), 2600)
    const first = setTimeout(() => setAfter(true), 600)
    return () => {
      clearInterval(id)
      clearTimeout(first)
    }
  }, [seen, reduce])
  return (
    <div ref={ref} className="grid gap-5 pt-8 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div>
        <div className="relative inline-flex rounded-full bg-foreground/[0.06] p-1 text-sm" aria-hidden>
          {['Было', 'Стало'].map((label, i) => (
            <span key={label} className={cn('relative z-[1] px-4 py-1 transition-colors', (i === 1) === after ? 'font-semibold text-primary-foreground' : 'text-muted-foreground')}>
              {(i === 1) === after ? (
                <motion.span layoutId="card-toggle" className="absolute inset-0 -z-[1] rounded-full bg-primary" transition={SPRING} />
              ) : null}
              {label}
            </span>
          ))}
        </div>
        <div className="mt-3 aspect-[3/4] overflow-hidden rounded-[20px] bg-foreground/[0.05] p-4">
          <motion.div
            key={after ? 'after' : 'before'}
            className="flex h-full flex-col"
            initial={{ opacity: 0, filter: 'blur(8px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.45 }}
          >
            {after ? (
              <>
                <div className="flex flex-wrap gap-1.5">
                  <span className="rounded-full bg-foreground px-2 py-0.5 text-[11px] font-medium text-background">Защита камеры</span>
                  <span className="rounded-full bg-foreground/10 px-2 py-0.5 text-[11px]">MagSafe</span>
                </div>
                <div className="mx-auto mt-auto mb-auto aspect-[9/16] w-2/5 rounded-[14px] bg-gradient-to-b from-primary/70 to-primary/20 shadow-lg" />
                <p className="text-sm font-semibold">Чехол для iPhone 15 противоударный</p>
              </>
            ) : (
              <>
                <div className="mx-auto mt-auto mb-auto aspect-[9/16] w-2/5 rounded-[14px] bg-foreground/15" />
                <p className="text-sm text-muted-foreground">Чехол силиконовый</p>
              </>
            )}
          </motion.div>
        </div>
      </div>
      <ul className="space-y-2.5 self-center">
        {CHECKS.map((c, i) => (
          <motion.li
            key={c}
            className="flex items-center gap-2.5 text-sm"
            initial={{ opacity: 0, x: -8 }}
            animate={seen ? { opacity: 1, x: 0 } : { opacity: 0, x: -8 }}
            transition={{ ...SPRING, delay: 0.4 + i * 0.2 }}
          >
            <span className="inline-flex size-6 items-center justify-center rounded-full bg-primary/15 text-primary">
              <Check className="size-3.5" aria-hidden />
            </span>
            {c}
          </motion.li>
        ))}
        <li className="flex items-center gap-2.5 pt-2 text-sm text-muted-foreground">
          <Sparkles className="size-4 text-muted-foreground" aria-hidden />
          Человек только подтверждает
        </li>
      </ul>
    </div>
  )
}

// 6. Чат: вопрос продавца, «печатает…», ответ с цифрами.
function Chat() {
  const { ref, seen } = useSeen<HTMLDivElement>()
  return (
    <div ref={ref} className="flex flex-col gap-3 pt-8 text-sm">
      <motion.p
        className="max-w-[85%] self-end rounded-[20px] rounded-br-md bg-primary px-4 py-2.5 font-medium text-primary-foreground"
        initial={{ opacity: 0, y: 10 }}
        animate={seen ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={{ ...SPRING, delay: 0.2 }}
      >
        Что заканчивается на складах?
      </motion.p>
      <motion.div
        className="max-w-[90%] self-start rounded-[20px] rounded-bl-md bg-foreground/[0.06] px-4 py-3"
        initial={{ opacity: 0, y: 10 }}
        animate={seen ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={{ ...SPRING, delay: 1 }}
      >
        <p>Три товара закончатся за неделю:</p>
        <ul className="mt-2 space-y-1">
          {[
            ['Кабель USB-C, WB', '4 дня'],
            ['Чехол iPhone 15, Ozon', '6 дней'],
            ['Наушники, Маркет', '7 дней'],
          ].map(([name, days]) => (
            <li key={name} className="flex justify-between gap-4">
              <span className="text-muted-foreground">{name}</span>
              <span className="font-semibold text-primary tabular-nums">{days}</span>
            </li>
          ))}
        </ul>
        <p className="mt-2">Подготовить поставку?</p>
      </motion.div>
    </div>
  )
}

const SCENES: Record<IllustrationKind, () => React.JSX.Element> = {
  waterfall: Waterfall,
  reconcile: Reconcile,
  stock: StockGrid,
  summary: Summary,
  card: ProductCard,
  chat: Chat,
}
