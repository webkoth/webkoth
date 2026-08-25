import { CASE_KIND_LABELS, CASE_STATUS_LABELS, anglesForBlock, casePath } from '@/app/data/cases'
import type { EvolutionData } from '@/app/data/evolution/types'
import { evolutionBlockOrder } from '@/app/data/evolution'

// Markdown-версия главной для `/llms.txt` и LLM-агентов. Только текст из данных -
// ни одной строки, которой нет на странице.

const H = {
  ru: {
    lang: '## Русская версия',
    steps: 'Шаги',
    symptom: 'Симптом',
    casesTag: 'Кейсы шага',
    namedCase: 'Именованный кейс',
    stack: 'Стек',
    process: 'Как это происходит',
    finale: 'Финал',
    attempts: 'Четыре захода на одну задачу',
    contact: 'Контакт',
    contactLine: 'Заявка на бесплатный разбор - форма на странице, Telegram @abnorsky.',
  },
  en: {
    lang: '## English version',
    steps: 'Steps',
    symptom: 'Symptom',
    casesTag: 'Cases for this step',
    namedCase: 'Named case',
    stack: 'Stack',
    process: 'How it happens',
    finale: 'Finale',
    attempts: 'Four attempts at one task',
    contact: 'Contact',
    contactLine: 'Request a free review - the form on the page, or Telegram @abnorsky.',
  },
} as const

export function buildEvolutionMarkdown(d: EvolutionData): string {
  const h = H[d.lang]
  const out: string[] = []
  // Адреса кейсов абсолютные: этот текст читают вне сайта, относительная ссылка там никуда не ведёт.
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://webkoth.com'

  out.push(h.lang, '')
  out.push(`# ${d.hero.seal}`, '')
  // Переносы заголовка - вёрстка; в тексте для LLM фразы идут через точку.
  out.push(d.hero.line1.replace(/\n/g, '. ') + '.', '')
  out.push(d.hero.lead, '')
  out.push(d.hero.sub, '')

  out.push(`## ${h.steps}`, '')
  for (const key of evolutionBlockOrder) {
    const b = d.blocks[key]
    out.push(`### ${b.step} · ${b.slogan}`, '')
    out.push(`_${h.symptom}:_ ${b.symptom}`, '')
    for (const p of b.description) out.push(p, '')
    const angles = anglesForBlock(d.lang, key)
    if (angles.length > 0) {
      out.push(`**${h.casesTag}:**`, '')
      for (const a of angles) {
        out.push(`- **${a.angle.headline}** (${a.copy.title})`)
        // Тип и статус - те же, что в бейдже карточки. Без них открытый код
        // в этом тексте неотличим от обезличенной клиентской системы, а на
        // странице он подписан и ведёт на репозиторий.
        out.push(`  - ${d.labels.caseKindRow}: ${CASE_KIND_LABELS[d.lang][a.meta.kind]} · ${CASE_STATUS_LABELS[d.lang][a.meta.status]}`)
        out.push(`  - ${d.labels.casePain}: ${a.angle.pain}`)
        out.push(`  - ${d.labels.caseOutcome}: ${a.angle.outcome}`)
        for (const c of a.angle.chips) out.push(`  - ${c.label}: ${c.value}`)
        // Ссылки перечисляются значениями `meta.links`, а не тремя полями по
        // имени: четвёртый вид ссылки тогда доедет сюда сам. У клиентских
        // систем список пуст - строки не будет.
        const links = Object.values(a.meta.links).filter((l): l is string => Boolean(l))
        if (links.length > 0) out.push(`  - ${links.join(' · ')}`)
        out.push(`  - ${baseUrl}${casePath(d.lang, a.slug)}`)
      }
      out.push('')
    }
  }

  out.push(`## ${h.namedCase}: ${d.hubmarket.linkText} - ${d.hubmarket.sub}`, '')
  for (const p of d.hubmarket.frame) out.push(p, '')
  for (const n of Object.values(d.hubmarket.nodes)) {
    out.push(`- **${n.label}** (${n.sub}${n.badge ? ` · ${n.badge}` : ''}) - ${n.description}`)
  }
  out.push('', `${h.stack}: ${d.hubmarket.stack.join(', ')}`, '')

  out.push(`## ${h.process}: ${d.roadmap.title}`, '')
  out.push(d.roadmap.sub, '')
  for (const s of d.roadmap.steps) out.push(`${s.num}. **${s.title}** (${s.pill}) - ${s.body}`)
  out.push('')

  out.push(`## ${h.finale}: ${d.finale.slogan}`, '')
  for (const p of d.finale.description) out.push(p, '')
  out.push(`> ${d.finale.manifesto}`, '')
  out.push(`**${h.attempts}**`, '')
  out.push(`| ${d.finale.graveyard.head.join(' | ')} |`)
  out.push(`| ${d.finale.graveyard.head.map(() => '---').join(' | ')} |`)
  for (const r of d.finale.graveyard.rows) out.push(`| ${r.join(' | ')} |`)
  out.push('', d.finale.graveyard.note, '')

  out.push(`## ${h.contact}`, '')
  out.push(d.finale.form.sub, '')
  for (const t of d.finale.form.takeaways) out.push(`- ${t}`)
  out.push('', h.contactLine, '')

  return out.join('\n')
}
