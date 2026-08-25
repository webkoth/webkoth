// Язык-независимая структура кейсов: какие системы есть, в каких блоках
// показываются, куда ведут ссылки, на чём построены, какие файлы скриншотов
// подложены. Единственный источник правды о наборе углов - тексты обязаны ему
// соответствовать, и с `CasesCopy` ниже это проверяет уже компилятор.

import type { CaseAngle, CaseCopy, CaseMeta } from './types'

/** Порядок здесь задаёт порядок карточек внутри карусели любого блока. */
export const CASE_SLUGS = [
  'finance-loop',
  'data-platform',
  'product-portal',
  'project-generator',
  'ads-agents',
  'store-to-claude',
  'it-inventory',
  'legacy-db-map',
  'payout-documents',
  'marketplace-knowledge',
  'stock-sync',
  'deploy-from-chat',
  'seller-workspace',
  'agents-platform',
  'frontend-factory',
  'content-factory',
  'data-marts',
  'yandex-mcp',
] as const

export type CaseSlug = (typeof CASE_SLUGS)[number]

// `as const satisfies` - ради `CasesCopy`: `satisfies` проверяет форму,
// `as const` сохраняет литералы, из которых берётся набор углов каждой системы.
export const caseMeta = {
  'finance-loop': {
    kind: 'internal',
    status: 'production',
    blocks: ['system', 'money', 'speed', 'resources'],
    links: {},
    stack: ['Next.js', 'React', 'TypeScript', 'Prisma', 'PostgreSQL', 'Playwright', 'GitHub Actions', 'PM2'],
    screenshots: [],
  },
  'data-platform': {
    kind: 'internal',
    status: 'production',
    blocks: ['system', 'money', 'decisions'],
    links: {},
    stack: ['Python', 'dlt', 'dbt', 'PostgreSQL', 'Dagster', 'MinIO', 'FastAPI', 'MCP', 'Docker'],
    screenshots: [],
  },
  'product-portal': {
    kind: 'internal',
    status: 'production',
    blocks: ['automation', 'speed', 'resources'],
    links: {},
    stack: ['Next.js', 'React', 'TypeScript', 'Prisma', 'PostgreSQL', 'GitHub Actions', 'PM2'],
    screenshots: [],
  },
  'project-generator': {
    kind: 'oss',
    status: 'production',
    blocks: ['speed', 'resources'],
    links: { github: 'https://github.com/webkoth/starter-template-app' },
    stack: ['Next.js 16', 'React 19', 'TypeScript', 'Tailwind 4', 'shadcn/ui', 'Prisma', 'PostgreSQL 18', 'Playwright', 'GitHub Actions', 'PM2'],
    screenshots: [],
  },
  'ads-agents': {
    kind: 'internal',
    status: 'production',
    blocks: ['decisions', 'automation'],
    links: {},
    stack: ['Python', 'FastAPI', 'MS SQL', 'PowerShell', 'ECharts', 'Claude Code', 'cron', 'systemd', 'nginx'],
    screenshots: [],
  },
  'store-to-claude': {
    kind: 'product',
    status: 'production',
    blocks: ['decisions', 'automation'],
    links: { site: 'https://mcp.hubmarket.ru' },
    stack: ['TypeScript', 'MCP', 'Hono', 'Next.js', 'Prisma', 'PostgreSQL', 'Vitest', 'GitHub Actions', 'nginx'],
    screenshots: [],
  },
  'it-inventory': {
    kind: 'internal',
    status: 'production',
    blocks: ['system'],
    links: {},
    stack: ['Next.js', 'React', 'TypeScript', 'Prisma', 'PostgreSQL', 'shadcn/ui', 'Vitest', 'Playwright', 'GitHub Actions'],
    screenshots: [],
  },
  'legacy-db-map': {
    kind: 'internal',
    status: 'production',
    blocks: ['system'],
    links: {},
    stack: ['Python', 'MS SQL', 'SSAS', 'DAX', 'python-tds'],
    screenshots: [],
  },
  'payout-documents': {
    kind: 'product',
    status: 'production',
    blocks: ['money'],
    links: { site: 'https://hubmarket.ru' },
    stack: ['Python', 'FastAPI', 'pdfplumber', 'openpyxl', 'uvicorn', 'PM2'],
    screenshots: [],
  },
  'marketplace-knowledge': {
    kind: 'oss',
    status: 'production',
    blocks: ['decisions'],
    links: { github: 'https://github.com/webkoth/rag-market' },
    stack: ['Python', 'uv', 'OpenAPI', 'httpx', 'trafilatura', 'Markdown', 'Git'],
    screenshots: [],
  },
  'stock-sync': {
    kind: 'internal',
    status: 'production',
    blocks: ['automation'],
    links: {},
    stack: ['Python', 'requests', 'YML', 'Windows Task Scheduler'],
    screenshots: [],
  },
  'deploy-from-chat': {
    kind: 'oss',
    status: 'production',
    blocks: ['speed'],
    links: { github: 'https://github.com/webkoth/claude-code-plugins', npm: 'https://www.npmjs.com/package/@webkoth/mcp-timeweb' },
    stack: ['TypeScript', 'Node.js', 'MCP', 'Claude Code', 'npm', 'Timeweb Cloud API', 'nginx', 'Certbot'],
    screenshots: [],
  },
  'seller-workspace': {
    kind: 'oss',
    status: 'production',
    blocks: ['resources'],
    links: { github: 'https://github.com/webkoth/sellerai' },
    stack: ['Claude Code', 'MCP', 'TypeScript', 'Node.js', 'Markdown'],
    screenshots: [],
  },
  // Пилот, а не прод: в расписании один агент, в файле крона вместо путей
  // стоят плейсхолдеры, контура доставки у репозитория нет.
  'agents-platform': {
    kind: 'internal',
    status: 'pilot',
    blocks: ['automation'],
    links: {},
    stack: ['Python 3.14', 'uv', 'FastAPI', 'Anthropic SDK', 'PostgreSQL', 'Next.js 16', 'React 19', 'Base UI', 'React Flow', 'cron'],
    screenshots: [],
  },
  // Репозиторий набора закрыт, поэтому не `oss`. Ссылка ведёт на витрину темы
  // и компонентов этого сайта - живую страницу, а не на `/r/registry.json`:
  // сам реестр отдаётся статикой, по `/r` маршрута нет, и ссылка была бы 404.
  'frontend-factory': {
    kind: 'product',
    status: 'production',
    blocks: ['speed'],
    links: { site: 'https://webkoth.com/ui-kit' },
    stack: ['Next.js 16', 'React 19', 'TypeScript', 'Tailwind 4', 'shadcn/ui', 'Base UI', 'recharts', 'TanStack Table', 'ESLint', 'Prettier'],
    screenshots: [],
  },
  // `product`, а не `internal`: `internal` в этом реестре означает обезличенную
  // клиентскую систему, а это моя мастерская. Ссылки нет - не опубликована.
  'content-factory': {
    kind: 'product',
    status: 'production',
    blocks: ['resources'],
    links: {},
    stack: ['Remotion 4', 'React 19', 'TypeScript', 'Tailwind 4', 'Claude Code', 'Whisper', 'FFmpeg', 'Excalidraw', 'Python', 'Telethon'],
    screenshots: [],
  },
  // Пилот: контур описан, но следов выката в репозитории нет - только CI.
  'data-marts': {
    kind: 'internal',
    status: 'pilot',
    blocks: ['decisions'],
    links: {},
    stack: ['Python 3.14', 'uv', 'FastAPI', 'SQLAlchemy 2.0', 'Alembic', 'PostgreSQL 18', 'procrastinate', 'python-tds', 'React 19', 'TanStack Query', 'Playwright'],
    screenshots: [],
  },
  // Пакет `@webkoth/yandex-mcp` в npm ещё не выложен, поэтому ссылка одна.
  'yandex-mcp': {
    kind: 'oss',
    status: 'production',
    blocks: ['money'],
    links: { github: 'https://github.com/webkoth/yandex-mcp' },
    stack: ['TypeScript', 'Node.js 22', 'MCP', 'zod', 'Yandex Direct API', 'Yandex Metrika API', 'Yandex Webmaster API'],
    screenshots: [],
  },
} as const satisfies Record<CaseSlug, CaseMeta>

/**
 * Тип текстов локали: у каждой системы ровно те углы, что перечислены в реестре.
 * Лишний угол или забытый - ошибка на месте написания, а не падение теста.
 * Остаётся присваиваемым к `Record<CaseSlug, CaseCopy>`, поэтому выборки
 * и компоненты работают с обычным `CaseCopy`.
 */
export type CasesCopy = {
  [S in CaseSlug]: Omit<CaseCopy, 'angles'> & {
    angles: Record<(typeof caseMeta)[S]['blocks'][number], CaseAngle>
  }
}
