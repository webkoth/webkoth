import { buildAvtomatizaciyaMarkdown } from '@/app/data/avtomatizaciya'

export const dynamic = 'force-static'

// Markdown-версия главной для LLM-агентов и парсеров.
export function GET() {
  const body = [
    '# webkoth.com - Автоматизация и внедрение ИИ для продавцов на маркетплейсах',
    '',
    '> Содержимое главной в Markdown для LLM.',
    '',
    buildAvtomatizaciyaMarkdown(),
  ].join('\n')

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
