import type { Lang } from '@/app/data/evolution/types'

// Страница /[lang]/standard: открытый стандарт AIAS. Вся копия - здесь,
// компонент только раскладывает её; ссылки ведут в канонический репозиторий,
// PDF и схема лежат в public/standard и отдаются со своего домена.
export const standardPath = (lang: Lang): string => `/${lang}/standard`

export const AIAS_REPO_URL = 'https://github.com/webkoth/ai-automation-standard'
export const AIAS_PDF_PATH = '/standard/aias-gid-vladelca-v1.2.pdf'
export const AIAS_DIAGRAM_PATH = '/standard/verdikt.html'

export type StandardCard = { title: string; text: string; href: string; linkLabel: string }

export type StandardData = {
  meta: { title: string; description: string }
  eyebrow: string
  title: string
  lead: string
  badges: string[]
  aiNote: string
  contents: { title: string; cards: StandardCard[] }
  diagram: { title: string; note: string; iframeTitle: string }
  start: { title: string; steps: string[]; offer: string }
  guide: { title: string; text: string; readLabel: string; pdfLabel: string }
  langNote?: string
}

export const standardData: Record<Lang, StandardData> = {
  ru: {
    meta: {
      title: 'AIAS — стандарт автоматизации задач',
      description:
        'Открытый стандарт: кому отдать шаг процесса — программе, конвейеру с ИИ-шагом, агенту или человеку. Спецификация, гид владельца, шаблоны, библиотека процессов.',
    },
    eyebrow: 'AIAS · открытый стандарт · v1.0.0-draft · CC BY-NC-SA 4.0',
    title: 'Стандарт автоматизации задач',
    lead:
      'Кому отдать шаг процесса — программе, конвейеру с ИИ-шагом, агенту или человеку — и чем «внедрено» отличается от «навайбкодили». Восемь вопросов, карточка задачи, контур production.',
    badges: ['спецификация из 6 модулей', 'гид владельца · 40 минут', '15 карточек процессов'],
    aiNote:
      '«AI» в названии — про эпоху, не про то, что ИИ ставится в каждый шаг: стандарт так же часто запрещает ИИ, как назначает.',
    contents: {
      title: 'Что внутри',
      cards: [
        {
          title: 'Спецификация AIAS-00…05',
          text: 'Ядро (формы F0–F5, восемь вопросов вердикта), роли и автономия A0–A5, манифест ИИ-шага, шлюзы, HITL и контур production, жизненный цикл.',
          href: `${AIAS_REPO_URL}/tree/main/spec`,
          linkLabel: 'Читать спеку',
        },
        {
          title: 'Гид владельца',
          text: 'То же содержание на языке собственника, без техники: тест «нужно ли», правило «кому отдать», чеклист приёмки, вопросы подрядчику.',
          href: `${AIAS_REPO_URL}/blob/main/guide/gid-vladelca-v1.2.md`,
          linkLabel: 'Читать гид',
        },
        {
          title: 'Библиотека процессов',
          text: 'Карточки реальных и типовых процессов с вердиктами по шагам: заявки на оплату, сверка выплат маркетплейса, этикетки, транскрибация созвонов и другие.',
          href: `${AIAS_REPO_URL}/tree/main/library`,
          linkLabel: 'Смотреть карточки',
        },
        {
          title: 'Шаблоны',
          text: 'Паспорт задачи на 15 минут, карточка задачи (ICOM), манифест ИИ-шага, чеклист приёмки «предупредить / отреагировать / триггер».',
          href: `${AIAS_REPO_URL}/tree/main/templates`,
          linkLabel: 'Взять шаблоны',
        },
        {
          title: 'Референсный стек',
          text: 'Инструменты автора с честными статусами и таблица альтернатив по формам — стандарт нейтрален к инструментам.',
          href: `${AIAS_REPO_URL}/tree/main/stack`,
          linkLabel: 'Смотреть стек',
        },
        {
          title: 'Весь репозиторий',
          text: 'Канонический источник стандарта: версии, история изменений, лицензия. Выпущенные версии не редактируются.',
          href: AIAS_REPO_URL,
          linkLabel: 'github.com/webkoth/ai-automation-standard',
        },
      ],
    },
    diagram: {
      title: 'Схема вердикта',
      note:
        'Восемь вопросов к каждому шагу процесса: ворота → взвешивание → последствия. Схема интерактивная — темы, фокус, экспорт.',
      iframeTitle: 'Интерактивная схема: кому отдать шаг',
    },
    start: {
      title: 'С чего начать',
      steps: [
        'Заполните паспорт одного процесса — 15 минут, на вашем языке.',
        'Пройдите восемь вопросов по схеме — получите вердикт по шагам.',
        'Сверьтесь с ближайшей карточкой библиотеки — что требовать при внедрении и приёмке.',
      ],
      offer:
        'Или короче: разбор одного вашего процесса по стандарту — бесплатно, 30 минут. Паспорт, вердикт и что с ним делать — останутся у вас.',
    },
    guide: {
      title: 'Гид владельца',
      text: 'Читается за 40 минут. Печатная версия — 20 страниц A4 с содержанием.',
      readLabel: 'Читать на GitHub',
      pdfLabel: 'Скачать PDF',
    },
  },
  en: {
    meta: {
      title: 'AIAS — AI Automation Standard',
      description:
        'An open standard for deciding which step of a business process goes to deterministic code, an LLM step, an agent, or a human — with templates and a process library.',
    },
    eyebrow: 'AIAS · open standard · v1.0.0-draft · CC BY-NC-SA 4.0',
    title: 'AI Automation Standard',
    lead:
      'Which step of a process goes to a program, a pipeline with an LLM step, an agent, or a human — and what separates a production system from an abandoned prototype. Eight questions, a task card, a production contour.',
    badges: ['6-module specification', 'owner’s guide · 40 min', '15 process cards'],
    aiNote:
      '“AI” in the name is about the era, not about putting AI into every step: the standard forbids AI as often as it assigns it.',
    contents: {
      title: 'What is inside',
      cards: [
        {
          title: 'Specification AIAS-00…05',
          text: 'Core (forms F0–F5, the eight verdict questions), roles and autonomy A0–A5, AI-step manifest, gateways, HITL and the production contour, lifecycle.',
          href: `${AIAS_REPO_URL}/tree/main/spec`,
          linkLabel: 'Read the spec',
        },
        {
          title: 'Owner’s guide',
          text: 'The same content in the owner’s language, no tech: the “do we need it” test, the “who does the step” rule, an acceptance checklist, questions for any contractor.',
          href: `${AIAS_REPO_URL}/blob/main/guide/gid-vladelca-v1.2.md`,
          linkLabel: 'Read the guide',
        },
        {
          title: 'Process library',
          text: 'Cards of real and typical processes with per-step verdicts: payment requests, marketplace payout reconciliation, labels, call transcription and more.',
          href: `${AIAS_REPO_URL}/tree/main/library`,
          linkLabel: 'Browse the cards',
        },
        {
          title: 'Templates',
          text: 'A 15-minute task passport, the ICOM task card, the AI-step manifest, the “prevent / respond / trigger” acceptance checklist.',
          href: `${AIAS_REPO_URL}/tree/main/templates`,
          linkLabel: 'Get the templates',
        },
        {
          title: 'Reference stack',
          text: 'The author’s tools with honest statuses and a table of alternatives per form — the standard is tool-agnostic.',
          href: `${AIAS_REPO_URL}/tree/main/stack`,
          linkLabel: 'See the stack',
        },
        {
          title: 'Full repository',
          text: 'The canonical home of the standard: versions, changelog, license. Released versions are never edited.',
          href: AIAS_REPO_URL,
          linkLabel: 'github.com/webkoth/ai-automation-standard',
        },
      ],
    },
    diagram: {
      title: 'The verdict flow',
      note:
        'Eight questions for every process step: gates → weighing → consequences. The diagram is interactive — themes, focus, export.',
      iframeTitle: 'Interactive diagram: who gets the step',
    },
    start: {
      title: 'Where to start',
      steps: [
        'Fill in the passport for one process — 15 minutes, in your own words.',
        'Walk the eight questions on the diagram — get a per-step verdict.',
        'Compare with the closest library card — what to demand at delivery and acceptance.',
      ],
      offer:
        'Or shorter: a free 30-minute breakdown of one of your processes by the standard. The passport, the verdict and the next steps stay with you.',
    },
    guide: {
      title: 'Owner’s guide',
      text: 'A 40-minute read. Print version — 20 A4 pages with a table of contents.',
      readLabel: 'Read on GitHub',
      pdfLabel: 'Download PDF',
    },
    langNote: 'The standard is currently written in Russian; an English translation is planned.',
  },
}
