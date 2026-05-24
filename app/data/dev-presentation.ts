// Self-contained content for /dev-presentation page (RU only).
// Compiled from app/data/cv.ts + new "how I work" copy.
// Intentionally not importing cvData to keep this page decoupled.

export type Metric = { value: number; suffix: string; label: string }
export type ChipGroup = { groupLabel: string; chips: string[] }
export type CaseItem = {
  title: string
  what: string
  stack: string[]
  link?: { label: string; url: string }
  aiTag?: 'AI' | 'AI-adjacent' | null
}

export type DevPresentationData = {
  hero: {
    name: string
    role: string
    pitch: string
    metrics: Metric[]
  }
  about: {
    paragraph?: string
    directions: { title: string; body: string }[]
    chipGroups: ChipGroup[]
  }
  howIWork: {
    approach: { title: string; body: string }[]
    aiHabits: { title: string; body: string }[]
  }
  cases: CaseItem[]
  contacts: {
    email: string
    telegram: string
    telegramUrl: string
    github: string
    githubUrl: string
    calendarUrl: string
  }
}

export const devPresentationData: DevPresentationData = {
  hero: {
    name: 'Минас Саркисян',
    role: 'Senior Fullstack | AI Engineer',
    pitch:
      '10+ лет fullstack-разработки. 2+ года плотно с LLM в проде. Закрываю задачи всех уровней — от разработки функциональности до архитектуры.',
    metrics: [
      { value: 10, suffix: '+', label: 'лет fullstack' },
      { value: 2, suffix: '+', label: 'года production AI' },
      { value: 7, suffix: '', label: 'MCP-серверов на npm' },
      { value: 5, suffix: '+', label: 'продуктов в проде' },
    ],
  },
  about: {
    paragraph:
      '10+ лет fullstack-разработки в продакшене. 2+ года плотно с LLM: каскады (Claude + Gemini + Groq), RAG, AI-агенты, 20+ MCP-серверов.',
    directions: [
      { title: 'AI-фичи в существующих продуктах', body: 'RAG, агенты, ассистенты, классификаторы — без переписывания основного приложения.' },
      { title: 'Multi-provider LLM-каскады', body: 'Claude → Gemini → Groq с graceful fallback и автоматическим cost-tracking-ом.' },
      { title: 'MCP-серверы для агентной автоматизации', body: '7 пакетов на npm. Подключаются к Claude Code / Cursor одной строкой.' },
      { title: 'Document pipelines', body: 'OCR → LLM → structured output. Заменил ручной ввод в EdTech-сервисе end-to-end.' },
      { title: 'Full-stack веб', body: 'Next.js / React + Hono / FastAPI / Laravel + Postgres / ClickHouse + Docker.' },
      { title: 'Data & performance', body: 'ETL/ELT, BI-API, SQL-оптимизация, ClickHouse-аналитика на 1+ ТБ.' },
    ],
    chipGroups: [
      {
        groupLabel: 'Backend',
        chips: ['PHP / Laravel', 'Python / FastAPI', 'Node.js / Hono', 'TypeScript'],
      },
      {
        groupLabel: 'AI / LLM',
        chips: [
          'Anthropic Claude',
          'OpenAI',
          'Google Gemini',
          'Groq',
          'MCP (7 серверов)',
          'Multi-provider cascade',
          'RAG / pgvector',
          'tool calling',
        ],
      },
      {
        groupLabel: 'Frontend',
        chips: ['React 19 / Next.js 16', 'Vue 3', 'Tailwind', 'shadcn/ui'],
      },
      {
        groupLabel: 'Data & Infra',
        chips: ['PostgreSQL', 'ClickHouse', 'MongoDB', 'Redis', 'Docker', 'Linux', 'CI/CD'],
      },
      {
        groupLabel: 'Tooling',
        chips: ['Claude Code (ежедневно)', 'Cursor (ежедневно)', 'Sentry', 'pino', 'PostHog'],
      },
    ],
  },
  howIWork: {
    approach: [
      {
        title: 'Spec-driven development',
        body: 'Брейншторм → письменный спек с целями/не-целями/контрактами → разбивка на bite-sized таски с приёмочными критериями → код. Каждый шаг — отдельный коммит. Эта же страница сделана по этому пайплайну: docs/superpowers/specs/ и docs/superpowers/plans/ лежат в репо рядом с кодом, их можно открыть и пройтись по ним.',
      },
      {
        title: 'Маленькие PR, прод-first',
        body: 'Лучше 5 PR по 200 строк чем 1 на 1000. Ранний smoke в проде ловит то, что unit-тесты не ловят (например — что Timeweb блочит SMTP исходящий, как было здесь).',
      },
      {
        title: 'Документирую решения',
        body: 'ADR / README / inline-комментарии где важно «почему». Следующему мне (или вам) будет проще понять причину выбора без археологии в git blame.',
      },
    ],
    aiHabits: [
      {
        title: 'Claude Code + Cursor каждый день',
        body: 'Брейншторм, генерация кода, ревью своих изменений. Не «AI пишет за меня», а «AI ускоряет цикл».',
      },
      {
        title: 'Свой AI-микросервис',
        body: 'hubmarket-ai на Hono + AI SDK с каскадом Claude → Gemini → Groq. Любой проект подключается за 30 минут (как эта форма).',
      },
      {
        title: '7 MCP-серверов на npm',
        body: 'Открытый инструмент для агентной автоматизации: timeweb-mcp-server и др. Реальная агентная инфра в production.',
      },
    ],
  },
  cases: [
    {
      title: 'HubMarket — AI-SaaS для селлеров маркетплейсов',
      what:
        'Founder + единственный разработчик. Аналитика и автоматизация для WB / Ozon / Yandex Market. Bronze-Silver data lake, мульти-провайдерный LLM-каскад, Playwright-парсер, Telegram-бот, ЮKassa-подписки, Chrome MV3 расширение. 0 downtime LLM за 8 месяцев.',
      stack: ['Next.js 16', 'Vercel AI SDK', 'Hono', 'Python / FastAPI', 'PostgreSQL', 'pg-boss'],
      aiTag: 'AI',
    },
    {
      title: 'HubMarket stocksync (B-Sprint case)',
      what:
        'Founder-driven спринт: запрос фаундера → архитектура → реализация → передача в прод за 3 дня. Синхронизация остатков по 3 маркетплейсам для клиента HubMarket.',
      stack: ['Next.js', 'Hono', 'Playwright', 'pg-boss', 'PostgreSQL'],
      link: { label: 'Полный writeup', url: 'https://webkoth.com/ru/cases/hubmarket-stocksync' },
      aiTag: null,
    },
    {
      title: 'timeweb-mcp-server (open source)',
      what:
        'Полная поддержка Timeweb Cloud API через MCP-протокол. Серверы, БД (PostgreSQL/MySQL/MongoDB/Redis/ClickHouse), Kubernetes, S3, DNS, домены. Используется AI-агентами из Claude Code / Cursor для автоматизации деплоев.',
      stack: ['Node.js', 'TypeScript', 'MCP SDK'],
      link: { label: 'npm + GitHub', url: 'https://www.npmjs.com/package/timeweb-mcp-server' },
      aiTag: 'AI-adjacent',
    },
    {
      title: 'AI-сервис распознавания документов (EdTech-заказчик)',
      what:
        'PDF проходит через Yandex OCR → Yandex GPT (structured output) → запись в БД с привязкой к образовательным программам. Заменил ручной ввод end-to-end. Async-очереди, admin-panel.',
      stack: ['PHP / Laravel', 'Yandex OCR', 'Yandex GPT', 'PostgreSQL'],
      aiTag: 'AI',
    },
  ],
  contacts: {
    email: 'webkoth@gmail.com',
    telegram: '@abnorsky',
    telegramUrl: 'https://t.me/abnorsky',
    github: 'github.com/webkoth',
    githubUrl: 'https://github.com/webkoth',
    calendarUrl: 'https://calendar.app.google/jY324Q2AHe1apJo79',
  },
}
