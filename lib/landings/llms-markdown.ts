// lib/landings/llms-markdown.ts
import type { LandingCopy, LandingSlug } from '@/app/data/landings'
import { landingPath } from '@/app/data/landings'

// Короткая markdown-версия лендинга для /llms.txt: заголовок, суть, шаги, цены.
// Квиз и кейсы в текст не попадают: у них свои страницы.
export function buildLandingMarkdown(slug: LandingSlug, c: LandingCopy): string {
  return [
    `## ${c.hero.title}`,
    '',
    `URL: https://webkoth.com${landingPath(slug)}`,
    '',
    c.hero.sub,
    '',
    `### ${c.how.title}`,
    ...c.how.steps.map((s, i) => `${i + 1}. **${s.title}.** ${s.body}`),
    '',
    `### ${c.pricing.title}`,
    ...c.pricing.steps.map((s) => `- ${s.title}: ${s.price}. ${s.body}`),
    '',
    `### ${c.faq.title}`,
    ...c.faq.items.map((f) => `- **${f.q}** ${f.a}`),
    '',
  ].join('\n')
}
