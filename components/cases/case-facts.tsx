import { Badge } from '@/components/ui/badge'
import { CaseFactRow } from '@/components/evolution/case-card'
import { CASE_KIND_LABELS, CASE_STATUS_LABELS, type CaseCopy, type CaseMeta } from '@/app/data/cases'
import type { EvolutionData, Lang } from '@/app/data/evolution/types'
import { CaseCtaButton } from './case-cta-button'
import { caseLinkItems } from './case-links'

// Паспорт кейса: едет со скроллом, поэтому «что это и куда нажать» видно
// на любой высоте страницы. На узких экранах липкость выключена, а сама панель
// стоит сразу под заголовком - на мобильном она уехала бы в самый низ, за все
// разделы, и до неё дочитал бы не всякий.
// Компонент серверный: клиентская здесь только кнопка. Целиком клиентская
// панель тащила бы `meta` и `copy` в payload каждой из 26 страниц.
// Обёртка - `div`, а не `aside`: панель описывает ровно то, о чём страница,
// и в отрыве от неё бессмысленна, то есть на роль complementary не годится,
// а безымянный ориентир в дереве доступности хуже, чем его отсутствие.
export function CaseFacts({
  meta,
  copy,
  lang,
  labels,
  cta,
}: {
  meta: CaseMeta
  copy: CaseCopy
  lang: Lang
  labels: EvolutionData['labels']
  cta: string
}) {
  const links = caseLinkItems(meta.links)

  return (
    <div className="lg:sticky lg:top-28">
      <div className="rounded-2xl border border-border bg-card/70 p-5 backdrop-blur-sm">
        {/* Ряд тот же, что на карточке: подпись над значением. В колонке шириной
            примерно 17 rem значения вроде «полный прогон, по расписанию или
            командой» рядом с подписью не помещаются ни в одной локали. */}
        <dl className="grid gap-2.5">
          {/* Тип и статус выводим из meta, а не храним в текстах: иначе одна и та же
              строка пишется у каждой системы заново и расходится между локалями. */}
          {[
            { label: labels.caseKindRow, value: CASE_KIND_LABELS[lang][meta.kind] },
            { label: labels.caseStatusRow, value: CASE_STATUS_LABELS[lang][meta.status] },
            ...copy.detail.facts,
          ].map((f) => (
            <CaseFactRow key={f.label} label={f.label} value={f.value} hint={labels.factHint} />
          ))}
        </dl>

        <div className="mt-4 flex flex-wrap gap-1.5 border-t border-border pt-4">
          {meta.stack.map((s) => (
            <Badge key={s} variant="outline" className="border-primary/40 bg-primary/5 font-mono text-[11px] text-primary">
              {s}
            </Badge>
          ))}
        </div>

        {links.length > 0 ? (
          <div className="mt-4 flex flex-col items-start gap-2 border-t border-border pt-4">
            {links.map((l) => (
              <a
                key={l.key}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs text-muted-foreground transition hover:text-primary"
              >
                {l.icon}
                {l.label}
              </a>
            ))}
          </div>
        ) : null}

        <CaseCtaButton label={cta} />
      </div>
    </div>
  )
}
