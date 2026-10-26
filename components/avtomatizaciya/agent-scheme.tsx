'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { Check, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SPRING } from './motion'

// Схема первого экрана (по референсу собственника 26.10, Boltshift): в центре светящийся шар
// ИИ-агента цвета finstock, к нему тонкими линиями подходят стеклянные карточки — слева площадки
// и действия, справа финансы и склад. По линиям бегут световые точки. Всё собрано кодом:
// цифры условные, поэтому в углу подпись «Пример».

const CARD = 'glass flex h-[164px] flex-col rounded-[24px] p-4'

function Card({ title, children, delay, className }: { title: string; children: React.ReactNode; delay: number; className?: string }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={cn(CARD, className)}
      initial={reduce ? false : { opacity: 0, y: 14, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ ...SPRING, delay }}
    >
      <p className="text-[15px] font-medium">{title}</p>
      <div className="mt-3 min-h-0 flex-1">{children}</div>
    </motion.div>
  )
}

function Pill({ children, tone = 'default' }: { children: React.ReactNode; tone?: 'default' | 'done' | 'wait' }) {
  return (
    <span className="tile inline-flex max-w-full items-center gap-1.5 rounded-full px-2.5 py-1 text-xs whitespace-nowrap">
      {tone === 'done' ? (
        <span className="inline-flex size-4 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Check className="size-2.5" strokeWidth={3} aria-hidden />
        </span>
      ) : null}
      {tone === 'wait' ? <Loader2 className="size-3.5 shrink-0 animate-spin text-primary motion-reduce:animate-none" aria-hidden /> : null}
      <span className="truncate">{children}</span>
    </span>
  )
}

function Marketplaces() {
  return (
    <ul className="space-y-1.5 text-xs">
      {[
        ['Wildberries', '214 заказов'],
        ['Ozon', '96 заказов'],
        ['Яндекс Маркет', '41 заказ'],
      ].map(([name, v]) => (
        <li key={name} className="tile flex items-center gap-2 rounded-full px-2.5 py-1">
          <span className="size-1.5 shrink-0 rounded-full bg-primary" />
          <span className="flex-1 truncate">{name}</span>
          <span className="text-muted-foreground">{v}</span>
        </li>
      ))}
    </ul>
  )
}

function Actions() {
  return (
    <div className="flex flex-col items-start gap-1.5">
      <Pill tone="done">Чехол снят с продажи</Pill>
      <Pill tone="wait">Ставка 180 → 210 ₽</Pill>
      <Pill tone="done">Отчёт за неделю отправлен</Pill>
    </div>
  )
}

const BARS = [
  { m: 'июн', v: 38 },
  { m: 'июл', v: 52 },
  { m: 'авг', v: 46 },
  { m: 'сен', v: 64 },
  { m: 'окт', v: 82 },
]

function Finance() {
  const reduce = useReducedMotion()
  return (
    <div className="flex h-full flex-col">
      <span className="tile -mt-9 mb-2 self-end rounded-full px-2 py-0.5 text-[11px] text-muted-foreground">
        <span className="text-primary">↑ 18 %</span> за месяц
      </span>
      <div className="flex flex-1 items-end gap-2">
        {BARS.map((b, i) => (
          <div key={b.m} className="flex flex-1 flex-col items-center gap-1">
            <motion.span
              className={cn('w-full origin-bottom rounded-md', i === BARS.length - 1 ? 'bg-primary' : 'bg-primary/35')}
              style={{ height: `${b.v}px` }}
              initial={reduce ? false : { scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ ...SPRING, delay: 0.9 + i * 0.1 }}
            />
            <span className="text-[10px] text-muted-foreground">{b.m}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function Stock() {
  return (
    <ul className="space-y-1.5 text-xs">
      {[
        ['Кабель USB-C', '48', ''],
        ['Чехол iPhone 15', '0', 'снят'],
        ['Наушники', '17', '4 дня'],
      ].map(([name, v, note]) => (
        <li key={name} className="tile flex items-center gap-2 rounded-full px-2.5 py-1">
          <span className="flex-1 truncate">{name}</span>
          {note ? <span className="text-muted-foreground">{note}</span> : null}
          <span className="w-6 text-right font-medium tabular-nums">{v}</span>
        </li>
      ))}
    </ul>
  )
}

// Шар агента: объём — радиальным градиентом циана finstock, свечение — тенью, вокруг вращаются
// тонкие кольца. Без анимации кольца просто стоят.
function Orb({ className }: { className?: string }) {
  const reduce = useReducedMotion()
  return (
    <div className={cn('relative aspect-square', className)} aria-hidden>
      <div className="absolute inset-[-30%] rounded-full bg-[radial-gradient(circle,rgb(0_184_219/.35),transparent_60%)] blur-2xl" />
      <div
        className="absolute inset-0 rounded-full shadow-[0_0_60px_rgb(0_184_219/.55),inset_0_0_40px_rgb(255_255_255/.25)]"
        style={{
          background:
            'radial-gradient(circle at 34% 28%, #c9f6ff 0%, #4fd8f0 18%, #00b8db 38%, #00708a 66%, #0b2a35 100%)',
        }}
      />
      {[0, 60, 120].map((rot, i) => (
        <motion.svg
          key={rot}
          viewBox="0 0 100 100"
          className="absolute inset-[-6%] overflow-visible"
          style={{ rotate: rot }}
          animate={reduce ? undefined : { rotate: rot + 360 }}
          transition={{ duration: 14 + i * 4, repeat: Infinity, ease: 'linear' }}
        >
          <ellipse cx="50" cy="50" rx="49" ry="17" fill="none" stroke="rgb(220 250 255 / .55)" strokeWidth="0.5" />
        </motion.svg>
      ))}
      <div className="absolute inset-[18%] rounded-full bg-[radial-gradient(circle_at_40%_35%,rgb(255_255_255/.45),transparent_55%)]" />
    </div>
  )
}

// Соединительные линии: от середин карточек к шару. Кривые со скруглёнными углами, точка бежит
// по каждой (SVG animateMotion; при отключённой анимации точки скрыты).
const WIRES = [
  { d: 'M0 82 H24 Q38 82 38 96 V156 Q38 170 52 170 H66', x: 0, y: 82 },
  { d: 'M0 258 H24 Q38 258 38 244 V184 Q38 170 52 170 H66', x: 0, y: 258 },
  { d: 'M300 82 H276 Q262 82 262 96 V156 Q262 170 248 170 H234', x: 300, y: 82 },
  { d: 'M300 258 H276 Q262 258 262 244 V184 Q262 170 248 170 H234', x: 300, y: 258 },
]

function Wires() {
  return (
    <svg viewBox="0 0 300 340" preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden>
      {WIRES.map((w, i) => (
        <g key={w.d}>
          <path d={w.d} fill="none" stroke="rgb(0 184 219 / .55)" strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
          <circle r="2.2" fill="#7fe9ff" className="motion-reduce:hidden">
            <animateMotion dur="2.6s" begin={`${i * 0.55}s`} repeatCount="indefinite" path={w.d} />
          </circle>
          <circle cx={w.x} cy={w.y} r="3" fill="#00b8db" />
        </g>
      ))}
    </svg>
  )
}

export function AgentScheme({ exampleLabel }: { exampleLabel: string }) {
  return (
    <div className="relative">
      {/* Сетка точек под схемой, как в референсе: растворяется к краям. */}
      <div
        aria-hidden
        className="absolute inset-[-10%] -z-10 [background-image:radial-gradient(rgb(0_184_219/.22)_1px,transparent_1px)] [background-size:14px_14px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black,transparent)]"
      />
      <p className="micro mb-3 text-center text-muted-foreground xl:pl-6 2xl:pl-28">{exampleLabel} · так работает агент</p>

      {/* Широкий экран: две колонки карточек и шар с линиями посередине. */}
      <div className="hidden grid-cols-[250px_240px_250px] items-center justify-center lg:grid xl:grid-cols-[226px_196px_226px] xl:justify-end 2xl:grid-cols-[250px_240px_250px]">
        <div className="grid gap-[12px]">
          <Card title="Площадки" delay={0.5}>
            <Marketplaces />
          </Card>
          <Card title="Действия" delay={0.7}>
            <Actions />
          </Card>
        </div>
        <div className="relative h-[340px]">
          <Wires />
          <Orb className="absolute top-1/2 left-1/2 w-[120px] -translate-x-1/2 2xl:w-[140px] -translate-y-1/2" />
        </div>
        <div className="grid gap-[12px]">
          <Card title="Финансы" delay={0.6}>
            <Finance />
          </Card>
          <Card title="Склад" delay={0.8}>
            <Stock />
          </Card>
        </div>
      </div>

      {/* Телефон и планшет: шар сверху, карточки сеткой под ним. */}
      <div className="lg:hidden">
        <Orb className="mx-auto w-[140px]" />
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <Card title="Площадки" delay={0.3}>
            <Marketplaces />
          </Card>
          <Card title="Финансы" delay={0.4}>
            <Finance />
          </Card>
          <Card title="Склад" delay={0.5}>
            <Stock />
          </Card>
          <Card title="Действия" delay={0.6}>
            <Actions />
          </Card>
        </div>
      </div>

      <p className="sr-only">
        Схема: ИИ-агент забирает заказы с Wildberries, Ozon и Яндекс Маркета, считает прибыль по месяцам, следит за
        остатками на складе и сам выполняет действия: снимает товар с продажи, предлагает ставки, отправляет отчёты.
      </p>
    </div>
  )
}
