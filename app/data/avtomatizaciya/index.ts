import { ru } from './ru'
import { avtomatizaciyaPath } from './path'

export type { AvtomatizaciyaCopy, CompanyTile, Price, Service, ServiceIcon, Stat, Step } from './types'

export { AVTOMATIZACIYA_SLUG, avtomatizaciyaPath } from './path'
export const avtomatizaciya = ru

// Markdown страницы для модалки «документация для LLM» и для /llms.txt.
export function buildAvtomatizaciyaMarkdown(): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://webkoth.com'
  const c = ru
  return [
    `## ${c.hero.title}`,
    '',
    `URL: ${baseUrl}${avtomatizaciyaPath}`,
    '',
    c.hero.sub,
    '',
    `### ${c.services.title}`,
    ...c.services.items.map((s) => `- **${s.title}.** ${s.body}`),
    '',
    `### ${c.companies.title}`,
    ...c.companies.items.map((t) => `- **${t.title}** (${t.price}; ${t.support}). ${t.body}`),
    '',
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
