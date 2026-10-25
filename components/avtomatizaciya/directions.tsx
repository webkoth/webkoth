import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import type { AvtomatizaciyaCopy, Direction, DirectionCase } from '@/app/data/avtomatizaciya'
import { casePath } from '@/app/data/cases'
import { cn } from '@/lib/utils'
import { Illustration } from './illustrations'
import { GlassPanel, Reveal } from './motion'

type Copy = AvtomatizaciyaCopy['directions']

// Шесть направлений подряд. Блоков больше четырёх, поэтому вместо вкладок у каждого
// подпись главы «01 / 06» с линией (правило брендбука: TabBar для 3–4, ChapterLabel для больше).
// Иллюстрация чередуется слева и справа, кейсы направления — стеклянными карточками под ней.
export function Directions({ copy }: { copy: Copy }) {
  const total = String(copy.items.length).padStart(2, '0')
  return (
    <section id="services" className="mx-auto max-w-6xl scroll-mt-28 px-4 py-16 md:px-8 md:py-24">
      <Reveal>
        <p className="text-sm font-medium text-primary">{copy.eyebrow}</p>
        <h2 className="mt-3 max-w-3xl text-3xl font-semibold tracking-[-0.03em] md:text-5xl">{copy.title}</h2>
      </Reveal>
      <div className="mt-14 space-y-24 md:mt-20 md:space-y-32">
        {copy.items.map((d, i) => (
          <DirectionBlock key={d.id} d={d} index={i} total={total} copy={copy} />
        ))}
      </div>
    </section>
  )
}

function DirectionBlock({ d, index, total, copy }: { d: Direction; index: number; total: string; copy: Copy }) {
  const flip = index % 2 === 1
  return (
    <article id={d.id} className="scroll-mt-32">
      <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-14">
        <Reveal className={cn('min-w-0', flip && 'lg:order-2')}>
          <p className="flex items-center gap-3 text-sm font-medium text-primary">
            <span className="tabular-nums">
              {String(index + 1).padStart(2, '0')} / {total}
            </span>
            <span aria-hidden className="h-px w-10 bg-primary/60" />
            <span>{d.label}</span>
          </p>
          <h3 className="mt-4 text-2xl font-semibold tracking-[-0.02em] md:text-4xl">{d.title}</h3>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">{d.body}</p>
        </Reveal>
        <GlassPanel className={cn('min-w-0 p-5 md:p-7', flip && 'lg:order-1')} delay={0.1}>
          <Illustration kind={d.illustration} exampleLabel={copy.labels.example} />
        </GlassPanel>
      </div>
      <ul className={cn('mt-8 grid gap-4', d.cases.length > 1 && 'md:grid-cols-2', d.cases.length > 2 && 'lg:grid-cols-3')}>
        {d.cases.map((k, i) => (
          <DirectionCaseCard key={k.slug} k={k} copy={copy} delay={0.08 * i} />
        ))}
      </ul>
    </article>
  )
}

export function DirectionCaseCard({ k, copy, delay }: { k: DirectionCase; copy: Copy; delay: number }) {
  return (
    <GlassPanel as="li" className="flex flex-col p-6" delay={delay}>
      <span
        className={cn(
          'self-start rounded-full px-2.5 py-0.5 text-xs font-medium',
          k.owner === 'shop' ? 'bg-primary/15 text-primary' : 'bg-foreground/[0.07] text-foreground/80',
        )}
      >
        {copy.owners[k.owner]}
      </span>
      <h4 className="mt-3 text-lg font-semibold tracking-[-0.01em]">{k.title}</h4>
      <dl className="mt-4 space-y-3 text-sm leading-relaxed">
        <div>
          <dt className="text-xs font-medium text-muted-foreground">{copy.labels.before}</dt>
          <dd className="mt-0.5 text-muted-foreground">{k.before}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium text-primary">{copy.labels.after}</dt>
          <dd className="mt-0.5">{k.after}</dd>
        </div>
      </dl>
      <Link
        href={casePath('ru', k.slug)}
        className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-medium text-primary transition hover:gap-2.5"
      >
        {copy.labels.more}
        <ArrowUpRight className="size-4" aria-hidden />
      </Link>
    </GlassPanel>
  )
}
