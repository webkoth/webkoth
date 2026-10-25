import { ru } from './ru'
import { glavnayaPath } from './path'

export type {
  AvtomatizaciyaCopy,
  CaseOwner,
  Direction,
  DirectionCase,
  DirectionId,
  IllustrationKind,
  Price,
  Stat,
  Step,
} from './types'

export { AVTOMATIZACIYA_SLUG, avtomatizaciyaPath, glavnayaPath } from './path'
export const avtomatizaciya = ru

/** Кейсы, которые остались на сайте: те, что стоят в направлениях главной. Порядок — как на странице. */
export const SHOWN_CASE_SLUGS = ru.directions.items.flatMap((d) => d.cases.map((k) => k.slug))

// Markdown главной для модалки «документация для LLM» и для /llms.txt.
export function buildAvtomatizaciyaMarkdown(): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://webkoth.com'
  const c = ru
  return [
    `## ${c.hero.title}`,
    '',
    `URL: ${baseUrl}${glavnayaPath}`,
    '',
    c.hero.sub,
    '',
    c.hero.proof,
    '',
    `### ${c.directions.title}`,
    '',
    ...c.directions.items.flatMap((d) => [
      `#### ${d.label}. ${d.title}`,
      '',
      d.body,
      '',
      ...d.cases.map(
        (k) =>
          `- **${c.directions.owners[k.owner]}. ${k.title}.** ${c.directions.labels.before}: ${k.before} ${c.directions.labels.after}: ${k.after} (${baseUrl}/ru/cases/${k.slug})`,
      ),
      '',
    ]),
    `### ${c.how.title}`,
    ...c.how.steps.map((s, i) => `${i + 1}. **${s.title}.** ${s.body}`),
    '',
    `### ${c.pricing.title}`,
    ...c.pricing.items.map((p) => `- **${p.title}:** ${p.price}. ${p.body}`),
    '',
    `### ${c.faq.title}`,
    ...c.faq.items.map((f) => `- **${f.q}** ${f.a}`),
    '',
  ].join('\n')
}
