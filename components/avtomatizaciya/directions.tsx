import Link from 'next/link'
import { ArrowUpRight, Sparkle } from 'lucide-react'
import type { AvtomatizaciyaCopy, Direction, DirectionCase } from '@/app/data/avtomatizaciya'
import { casePath } from '@/app/data/cases'
import { evolutionData } from '@/app/data/evolution'
import { ProductionStack } from '@/components/evolution/production-stack'
import { cn } from '@/lib/utils'
import { Illustration } from './illustrations'
import { GlassPanel, Reveal } from './motion'

type Copy = AvtomatizaciyaCopy['directions']

// Шесть направлений. Вступление — одна стеклянная карточка в центре на тумане (как Elasti),
// дальше каждое направление — стеклянная рамка с плитками прямо на небе сайта (как Eagle Ridge):
// плитка текста, плитка живой иллюстрации и плитки кейсов. Иллюстрация чередуется слева и справа.
export function Directions({ copy }: { copy: Copy }) {
  const total = String(copy.items.length).padStart(2, '0')
  const [lead, ...rest] = copy.title.split('. ')
  return (
    <section id="services" className="mx-auto max-w-7xl scroll-mt-28 px-3 md:px-8">
      <div className="py-16 md:py-28">
        <GlassPanel className="mx-auto flex min-h-[320px] max-w-2xl flex-col rounded-[32px] p-8 md:min-h-[380px] md:p-10">
          <Sparkle className="size-7 text-foreground/80" strokeWidth={1.25} aria-hidden />
          <p className="micro mt-6 text-muted-foreground">{copy.eyebrow}</p>
          <h2 className="mt-3 text-3xl leading-[1.1] font-medium tracking-[-0.03em] md:text-[2.6rem]">{lead}.</h2>
          {rest.length ? <p className="mt-auto pt-10 text-lg text-muted-foreground">{rest.join('. ')}</p> : null}
        </GlassPanel>
      </div>
      <div className="space-y-6 md:space-y-10">
        {copy.items.map((d, i) => (
          <DirectionBlock key={d.id} d={d} index={i} total={total} copy={copy} />
        ))}
      </div>
    </section>
  )
}

// Направление без общего контейнера (слово собственника 26.10; практика Liquid Glass — не класть
// стекло на стекло): текст прямо на небе, иллюстрация и кейсы — отдельными стеклянными плашками.
function DirectionBlock({ d, index, total, copy }: { d: Direction; index: number; total: string; copy: Copy }) {
  const flip = index % 2 === 1
  const data = d.id === 'data'
  const stack = evolutionData.ru.hero
  return (
    <article id={d.id} className="scroll-mt-28 py-10 md:py-16">
      <div className={cn('grid items-center gap-4 md:gap-6', data ? 'lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]' : 'lg:grid-cols-2')}>
        <Reveal className={cn('min-w-0 px-1 md:px-2', flip && 'lg:order-2 lg:pl-8')}>
          <p className="micro text-muted-foreground">
            {String(index + 1).padStart(2, '0')} / {total} · {d.label}
          </p>
          <h3 className="mt-5 text-3xl leading-[1.1] font-medium tracking-[-0.03em] text-balance md:text-[2.5rem]">{d.title}</h3>
          <div className="my-6 h-px bg-foreground/15" />
          <p className="text-base leading-relaxed text-muted-foreground md:text-[17px]">{d.body}</p>
        </Reveal>
        <GlassPanel className={cn('min-w-0 rounded-[28px] p-5 md:p-6', flip && 'lg:order-1')} delay={0.1}>
          {data ? (
            <>
              <p className="micro text-muted-foreground">Хранилище данных · работает</p>
              <div className="mt-3">
                <ProductionStack copy={{ hint: stack.stackHint, nodes: stack.stackNodes }} />
              </div>
            </>
          ) : (
            <Illustration kind={d.illustration} exampleLabel={copy.labels.example} />
          )}
        </GlassPanel>
      </div>
      <ul
        className={cn(
          'mt-4 grid gap-4 md:mt-6 md:gap-6',
          d.cases.length > 1 && 'md:grid-cols-2',
          d.cases.length > 2 && 'lg:grid-cols-3',
        )}
      >
        {d.cases.map((k, i) => (
          <DirectionCaseCard key={k.slug} k={k} copy={copy} delay={0.06 * i} />
        ))}
      </ul>
    </article>
  )
}

export function DirectionCaseCard({
  k,
  copy,
  delay = 0,
  variant = 'glass',
}: {
  k: DirectionCase
  copy: Copy
  delay?: number
  /** `tile` — плитка внутри стеклянной рамки, `glass` — отдельная стеклянная карточка. */
  variant?: 'tile' | 'glass'
}) {
  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <h4 className="text-lg leading-snug font-medium tracking-[-0.01em]">{k.title}</h4>
        <span className="micro mt-1 shrink-0 text-muted-foreground">{copy.owners[k.owner]}</span>
      </div>
      <dl className="mt-4 space-y-3 text-sm leading-relaxed">
        <div>
          <dt className="micro text-muted-foreground">{copy.labels.before}</dt>
          <dd className="mt-1 text-muted-foreground">{k.before}</dd>
        </div>
        <div>
          <dt className="micro text-foreground/70">{copy.labels.after}</dt>
          <dd className="mt-1">{k.after}</dd>
        </div>
      </dl>
      <Link
        href={casePath('ru', k.slug)}
        className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-medium transition hover:gap-2.5"
      >
        {copy.labels.more}
        <ArrowUpRight className="size-4 text-[#00b8db]" aria-hidden />
      </Link>
    </>
  )
  if (variant === 'tile') return <li className="tile flex flex-col rounded-[28px] p-5 md:p-6">{body}</li>
  return (
    <GlassPanel as="li" className="flex flex-col rounded-[28px] p-5 md:p-6" delay={delay}>
      {body}
    </GlassPanel>
  )
}
