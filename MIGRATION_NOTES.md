# Migration notes — from webkoth → webkoth-next

Перенесено из репозитория `/Users/minas/projects/webkoth` (2026-05-18).

## Что перенесено

**Структура страниц:**
- `app/[lang]/page.tsx` — лендинг (главная)
- `app/[lang]/layout.tsx` — landing metadata + JSON-LD ProfessionalService
- `app/[lang]/minasarkisyan/page.tsx` — CV
- `app/[lang]/minasarkisyan/layout.tsx` — CV metadata + JSON-LD Person
- `app/api/lead/route.ts` — POST endpoint в Telegram-бот
- `app/sitemap.ts`, `app/robots.ts`, `app/icon.svg`
- `app/page.tsx` — root redirect → `/en`
- `app/data/cv.ts` — данные CV (двуязычно)
- `middleware.ts` — locale routing

**Компоненты:**
- `components/landing/*` — 19 файлов (Hero, Tasks, Pricing, Roadmap, FeaturedCase
  с Mermaid, CaseGrid, WhyMe, LeadForm, FAQ, Footer + ai-background, magnetic,
  spotlight-card, stagger, section-reveal, hero-code-mockup, copy-i18n etc.)
- `components/cv/*` — 8 файлов
- `components/{language-toggle,mode-toggle,theme-provider,
  json-ld-person,json-ld-professional-service,llm-docs-button}.tsx`

**lib/landing:** `pricing.ts`, `telegram.ts`, `rate-limit.ts`

**public/images/profile.jpg**

**.env.example** — шаблон для `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `NEXT_PUBLIC_BASE_URL`

## Что НЕ перенесено (намеренно)

- `app/globals.css` — у вас своя тема (preset `base-vega` / baseColor `mist`)
- `app/layout.tsx` — у вас уже свой root layout с font/theme провайдером
- `components/ui/*` — у вас своя shadcn-сборка (пока только `button.tsx`)
- `package.json`, `components.json`, `tsconfig.json`, `next.config.mjs`, `postcss.config.mjs` — все свои в webkoth-next
- Деплой-артефакты (`.deploy.yml`, `ecosystem.config.js`, `nginx-webkoth.conf`)
- `.github/workflows`, `.next/`, `node_modules/`, старые CV PDF/JPG в корне
- Спеки/планы (`docs/superpowers/`)

## Что нужно сделать в новой сессии

### 1. Доустановить shadcn UI компоненты
В импортах перенесённых файлов используются: badge, card, accordion, input, textarea, select, tooltip, alert-dialog, dropdown-menu, separator.

```bash
npx shadcn@latest add badge card accordion input textarea select tooltip alert-dialog dropdown-menu separator
```

### 2. Доустановить npm-зависимости (используются в landing-компонентах)

```bash
npm install framer-motion mermaid react-hook-form @hookform/resolvers zod shiki
```

### 3. Возможные точки несовместимости

- **lucide-react** в webkoth-next версия `^1.16.0`, в старом проекте была `^0.562.0`. Имена иконок могут отличаться — будут TS-ошибки на импортах в `task-grid.tsx` (Search/Bot/Plug/Scale/FileText/Sparkles), `why-me.tsx` (ArrowRight), `pricing-grid.tsx` (Check), `cv/*`. Если иконка не найдена — посмотреть в новом lucide и заменить.
- **Base UI** обновлён в новом проекте — API `Tooltip`/`Accordion`/`Button` (asChild → render prop) уже учтён в старом коде, но при апдейте preset могут быть микро-изменения.
- **Тема** — все компоненты используют CSS-vars (`--primary`, `--muted-foreground`, `--chart-2/3` etc.). Новый preset `base-vega` / `mist` — другая палитра, но вся структура CSS-vars совпадает по именам, так что компоненты будут адаптированы автоматически. Возможно `--chart-2`/`--chart-3` в aurora-blob'ах (`ai-background.tsx`) дадут другой оттенок — это нормально для нового бренда.
- **Telegram secrets** — `.env.example` создан, нужен `.env.local` с `TELEGRAM_BOT_TOKEN` и `TELEGRAM_CHAT_ID`.

### 4. Первый smoke

```bash
npm install
npm run build
npm run dev
```

Открыть `http://localhost:3000/en` и `http://localhost:3000/ru`.

## Структура секций лендинга (для напоминания)

1. Hero — 2 cols (текст + IDE-mockup), AI-фон, метрики-бар
2. Tasks — 6 cards
3. Pricing — 3 пакета (Аудит 80k₽ / MVP от 600k₽ / Support от 200k/мес)
4. Roadmap — 4 шага с italic-serif нумерацией (Instrument Serif — нужно подключить
   в новом layout)
5. FeaturedCase — HubMarket + Mermaid-диаграмма
6. CaseGrid — 6 карточек + live npm/GH badges
7. WhyMe — 3 аргумента с нумерацией 01/02/03
8. LeadForm → Telegram
9. FAQ — 8 вопросов, в одном — shiki-snippet
10. Footer
