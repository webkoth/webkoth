import { evolutionData, LANGS } from '@/app/data/evolution'
import { buildEvolutionMarkdown } from '@/lib/evolution/llms-markdown'
import { LANDING_SLUGS, landingCopy } from '@/app/data/landings'
import { buildLandingMarkdown } from '@/lib/landings/llms-markdown'

export const dynamic = 'force-static'

// Markdown-версия главной (RU + EN) для LLM-агентов и парсеров.
export function GET() {
  const sections = LANGS.map((lang) => buildEvolutionMarkdown(evolutionData[lang]))

  const body = [
    '# webkoth.com - Business evolution / Эволюция бизнеса',
    '',
    '> Home page content in Markdown, optimised for LLM ingestion.',
    '> Russian (https://webkoth.com/) and English (https://webkoth.com/en) versions are included.',
    '> CV: https://webkoth.com/ru/minasarkisyan · https://webkoth.com/en/minasarkisyan',
    '',
    ...sections,
    '',
    '# Страницы услуг',
    '',
    ...LANDING_SLUGS.map((slug) => buildLandingMarkdown(slug, landingCopy[slug])),
  ].join('\n')

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
