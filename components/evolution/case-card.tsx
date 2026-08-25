import Link from 'next/link'
import { ArrowRight, Check, Link2, X } from 'lucide-react'
import { CASE_KIND_LABELS, CASE_STATUS_LABELS, casePath, type BlockAngle, type CaseBar, type ChipIcon } from '@/app/data/cases'
import type { EvolutionData, Lang } from '@/app/data/evolution/types'
import { cn } from '@/lib/utils'
import { caseLinkItems } from '@/components/cases/case-links'
import { CHIP_ICONS } from './chip-icons'
import { NoteHover } from './note-hover'

// Шкала доли: всегда 12 делений, независимо от знаменателя, - «339 из 784»
// и «2 из 3» должны читаться одинаково. Прижаты оба конца, потому что
// округление врёт в обе стороны: полная шкала обязана значить «все», а «945 из
// 962» - это 11.8 деления, и без прижатия она рисуется полной прямо над
// подписью, которая говорит обратное; пустая шкала не должна значить
// «сколько-то», поэтому у честной, но маленькой доли закрашено одно деление.
const BAR_CELLS = 12

function CaseBarStrip({ bar }: { bar: CaseBar }) {
  const ratio = bar.filled / bar.total
  const filled = ratio >= 1 ? BAR_CELLS : Math.min(BAR_CELLS - 1, Math.max(1, Math.round(ratio * BAR_CELLS)))
  return (
    <div>
      <div className="flex gap-1" aria-hidden>
        {Array.from({ length: BAR_CELLS }, (_, i) => (
          <span key={i} className={cn('h-1.5 flex-1 rounded-full', i < filled ? 'bg-primary' : 'bg-border')} />
        ))}
      </div>
      <p className="mt-1.5 text-[11px] leading-snug text-muted-foreground">{bar.caption}</p>
    </div>
  )
}

// Ряд «характеристика → значение»: иконка и моно-подпись, под ними значение.
// Иконка необязательна - у фактов страницы кейса её нет, а форма ряда та же.
// `relative z-10` на подсказке нужен в карточке, где сверху лежит растянутая
// ссылка; в других местах он безвреден.
export function CaseFactRow({
  icon,
  label,
  value,
  note,
  hint,
}: {
  icon?: ChipIcon
  label: string
  value: string
  note?: string
  hint: string
}) {
  const Icon = icon ? CHIP_ICONS[icon] : null
  return (
    <div>
      <dt className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
        {Icon ? <Icon className="size-3.5 shrink-0" aria-hidden /> : null}
        {label}
      </dt>
      <dd className={cn('mt-0.5 font-mono text-[13px] font-medium leading-snug tabular-nums', Icon && 'pl-5')}>
        <NoteHover note={note} hint={hint} className="relative z-10">
          {value}
        </NoteHover>
      </dd>
    </div>
  )
}

// Карточка кейса: бейдж «тип · статус» и имя системы → заголовок-результат →
// «болело/стало» знаками без заливки → панель характеристик (пары
// «характеристика → значение» и, если есть, шкала доли) → пометка связи углов
// и внешние ссылки → футер-ссылка. Вся карточка кликабельна растянутой
// ссылкой на заголовке; внешние ссылки поднимаются над ней через relative z-10.
// Высота - по содержимому, без h-full: в карусели видна одна карточка за раз,
// и короткая читается как «здесь меньше сказано». Растянутая на высоту самой
// высокой карточки блока, она вместо этого получала бы пустую полосу между
// панелью характеристик и футером - на 390 px до 300 px, а это уже читается
// как поломка.
export function CaseCard({
  entry,
  lang,
  labels,
}: {
  entry: BlockAngle
  lang: Lang
  labels: Pick<
    EvolutionData['labels'],
    'casePain' | 'caseOutcome' | 'caseMore' | 'caseAlsoIn' | 'caseAlsoInOne' | 'factHint'
  >
}) {
  const { slug, meta, copy, angle, otherBlocks } = entry
  const labelsByKind = CASE_KIND_LABELS[lang]
  const labelsByStatus = CASE_STATUS_LABELS[lang]
  const href = casePath(lang, slug)

  const links = caseLinkItems(meta.links)

  return (
    <article className="relative flex flex-col rounded-2xl border border-border bg-card/70 backdrop-blur-sm transition hover:border-primary/40">
      <header className="border-b border-border px-5 py-4 md:px-6 md:py-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          {labelsByKind[meta.kind]} · {labelsByStatus[meta.status]}
        </p>
        {/* Имя системы: без него «та же система» в пометке связи не к чему
            отнести, а четыре карточки блока читаются как четыре не связанных
            результата - и на странице кейса читатель видит заголовок, которого
            в карточке не было. */}
        <p className="mt-1 text-[13px] leading-snug text-muted-foreground">{copy.title}</p>
        <h3 className="mt-2 text-lg font-bold tracking-tight md:text-xl">
          <Link href={href} className="rounded-sm outline-none after:absolute after:inset-0 focus-visible:ring-2 focus-visible:ring-ring/50">
            {angle.headline}
          </Link>
        </h3>
      </header>

      <div className="flex flex-1 flex-col gap-4 px-5 py-4 md:px-6 md:py-5">
        {/* Знак цветной, подпись - нет: два одинаково набранных заголовка, разные
            только значком, читаются как пара «до/после», а не как два акцента. */}
        <dl className="space-y-3">
          <div>
            <dt className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              <X className="size-3.5 shrink-0 text-destructive" aria-hidden />
              {labels.casePain}
            </dt>
            <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">{angle.pain}</dd>
          </div>
          <div>
            <dt className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              <Check className="size-3.5 shrink-0 text-primary" aria-hidden />
              {labels.caseOutcome}
            </dt>
            <dd className="mt-1 text-sm leading-relaxed">{angle.outcome}</dd>
          </div>
        </dl>

        {/* Значение чипа - редко число: 76 % значений длиннее 22 знаков (медиана
            30 в ru и 33 в en, максимум 52 и 54), а рядом с подписью на 390 px
            помещается примерно 22. Поэтому подпись стоит над значением: и
            «месяц», и «база, вход с ролями, тесты, CI, два контура» получают
            одну форму. Панель отделяет данные от прозы «болело/стало». */}
        <div className="rounded-xl border border-border bg-muted p-3.5">
          <dl className="space-y-2.5">
            {angle.chips.map((chip) => (
              <CaseFactRow
                key={chip.label}
                icon={chip.icon}
                label={chip.label}
                value={chip.value}
                note={chip.note}
                hint={labels.factHint}
              />
            ))}
          </dl>
          {angle.bar ? (
            <div className="mt-3 border-t border-border pt-3">
              <CaseBarStrip bar={angle.bar} />
            </div>
          ) : null}
        </div>

        {/* Пометки связи и ссылок может не быть ни одной: семь систем из
            тринадцати живут в одном блоке, у обезличенных ссылок нет. Тогда
            низ карточки просто не рисуется, а не остаётся пустой полосой.
            mt-auto при своей высоте прижимать не к чему, но он ничего не стоит
            и вернёт прижатие, если карточку снова начнут тянуть по высоте. */}
        {otherBlocks.length > 0 || links.length > 0 ? (
          <div className="mt-auto flex flex-col items-start gap-2 pt-1">
            {/* Своя форма для одного шага: подстановка дала бы «ещё по 1 шагам»,
                а таких углов шесть из двадцати трёх. */}
            {otherBlocks.length > 0 ? (
              <p className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/5 px-2.5 py-1 text-[11px] leading-snug text-primary">
                <Link2 className="size-3 shrink-0" aria-hidden />
                {otherBlocks.length === 1
                  ? labels.caseAlsoInOne
                  : labels.caseAlsoIn.replace('{n}', String(otherBlocks.length))}
              </p>
            ) : null}
            {links.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {links.map((l) => (
                  <a
                    key={l.key}
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative z-10 inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-[11px] text-muted-foreground transition hover:border-primary/40 hover:text-primary"
                  >
                    {l.icon}
                    {l.label}
                  </a>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      <footer className="border-t border-border px-5 py-3 text-center md:px-6">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
          {labels.caseMore}
          <ArrowRight className="size-3.5" aria-hidden />
        </span>
      </footer>
    </article>
  )
}
