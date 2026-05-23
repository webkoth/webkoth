# Landing Polish — 2026-05-23

Серия общих доработок по лендингу после череды правок по отдельным секциям. Затрагивает копию, единую визуальную систему, темизацию, типографику и интерактив в Hero.

## Цели

1. Убрать всю упоминаемую конкретику Skolkovo / Сколково с **landing-страницы**, заменив на нейтральное «EdTech-заказчик» / «EdTech client». CV (`/[lang]/minasarkisyan`) НЕ трогаем — там это реальный кейс работодателя.
2. Привести фоны секций к единому статичному фону страницы (как Hero, без секционных radial-градиентов и индивидуальных рамок).
3. Сделать заголовки секций (`h2`) ещё жирнее.
4. Добавить Lucide-иконки в нужных местах (eyebrow секций, CTA, ключевые акценты).
5. Добавить кнопку LLM-доки на лендинге: `/llms.txt` route + `LLMDocsButton` в шапке (как на CV).
6. Привести тёмную тему к скриншоту [Image #1]: тёмный сине-серый фон + оранжевый primary акцент + тонкая сетка + свечение в правом верхнем углу. ModeToggle уже есть — переработать палитру под скриншот.
7. Переключить моноширинный шрифт с `Geist Mono` на `JetBrains Mono` (используется во всех `font-mono` / mockup-ах).
8. Hero code mockup → интерактив: typing-эффект построчно, статус «production» pulse, footer-метрики тикают.

## Шаги

### Step 1 — Skolkovo → EdTech (RU + EN)

**Файлы:**
- `components/landing/copy-i18n.ts` — 5 строк (lines 143, 144, 344, 419, 420)
- `components/landing/tech-stack.tsx` — 2 строки (lines 38, 39 в `TECH_DESCRIPTIONS["Vue 3 / Inertia"]`)

ID кейсов (`case-skolkovo`) НЕ переименовываем — это внутренний anchor, пользователю не видно, и есть external proof-anchor refs (`#case-skolkovo` в WhyMe). Меняем только видимый текст.

Замены:
- `"Skolkovo"` → `"EdTech-заказчик"` в RU, `"EdTech client"` в EN
- `"in prod at Skolkovo"` → `"in prod at an EdTech client"`

### Step 2 — Единый статичный фон

**Цель:** убрать индивидуальные `radial-gradient` фоны и `border`-обвязки секций. Один глобальный фон + однотипные секции без отдельных «карточек-обёрток».

**Файлы:**
- `components/landing/cases.tsx` (`case-grid.tsx`) — убрать локальный `radial-gradient` overlay
- `components/landing/why-me.tsx` — убрать локальный `radial-gradient`
- `components/landing/tech-stack.tsx` — убрать локальный `radial-gradient`
- `components/landing/roadmap-timeline.tsx` — убрать два локальных `radial-gradient`
- `components/landing/featured-case.tsx` — убрать `bg-muted/30` обёртку (или сделать прозрачной)
- `app/layout.tsx` или новый global background — вынести единый статичный фон как `body::before` или wrapper в `LandingShell`

**Решение:** добавить статичный глобальный фон через `body` background-image (тёмная тема — сине-серый base + radial peach в углу). Каждая секция остаётся `relative` без своего фона.

### Step 3 — Жирнее заголовки секций

Все `h2` сейчас `font-semibold tracking-tight md:text-4xl`. Меняем на `font-extrabold tracking-tight`. Hero `h1` уже `font-extrabold` — без изменений.

**Файлы:** все секции (`featured-case`, `case-grid`, `client-voices`, `why-me`, `tech-stack`, `roadmap-timeline`, `faq`, `task-grid`).

### Step 4 — Lucide иконки

**Места:**
- В каждом eyebrow секции — мелкая иконка перед UPPERCASE-меткой:
  - Hero — `Sparkles`
  - TaskGrid `ЧТО Я ДЕЛАЮ` — `ListChecks`
  - FeaturedCase (нет eyebrow — добавить или оставить)
  - CaseGrid `ПОРТФОЛИО` — `Briefcase`
  - ClientVoices — `MessageSquare`
  - WhyMe `ПОЧЕМУ Я` — `Award` или `ShieldCheck`
  - TechStack `СТЕК` — `Layers`
  - RoadmapTimeline `КАК МЫ РАБОТАЕМ` — `Workflow`
  - FAQ — `HelpCircle`
- На CTA-кнопках Hero — `ArrowRight` НЕ добавляем (memory: user удалял decorative arrows).
- В Hero nav — оставить как есть (ModeToggle/LangToggle/LLMDocsButton).

### Step 5 — LLM docs кнопка + /llms.txt

**A. `/llms.txt` route**

Создать `app/llms.txt/route.ts` — генерирует Markdown с landing-контентом по обоим языкам (RU+EN, источник — `copy-i18n.ts`). Возвращает `text/plain; charset=utf-8`.

**B. `LLMDocsButton`-аналог для лендинга**

Создать `components/landing/llm-docs-button.tsx` (по аналогии с `components/llm-docs-button.tsx`, который рассчитан на CV). Кнопка с `FileText` иконкой → модалка с markdown-preview + Copy/Download.

**C. Поместить в Hero nav** рядом с `LanguageToggle` + `ModeToggle`.

### Step 6 — Тёмная тема под Image #1

**Что видно на скриншоте:**
- Base background: тёмный desaturated сине-серый (примерно `oklch(0.18 0.02 250)`)
- Primary: яркий оранжевый (как сейчас, видимо — оставить)
- Сетка: тонкие точки/линии 28-30px, очень subtle
- Свечение в правом-верхнем углу: радиальный оранжевый, очень тонкий

**Файлы:**
- `app/globals.css` — обновить `.dark` блок: подправить `--background`, `--card`, `--popover` под скриншот. Сохранить current primary.
- Глобальный фон (см. Step 2) — точно под Image #1.

### Step 7 — JetBrains Mono

**Файлы:**
- `app/layout.tsx` — заменить `Geist_Mono` на `JetBrains_Mono` из `next/font/google`. Сохранить `--font-mono` CSS variable name (Tailwind config / globals.css ссылается на это).

```ts
import { JetBrains_Mono } from "next/font/google";
const fontMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });
```

Проверить:
- `tailwind.config` / `globals.css` — `font-mono` маппится на `var(--font-mono)`
- В `font-mono` стилях по проекту ничего ломаться не должно (это просто другой моноширинный с похожими метриками)
- Особо в `hero-code-mockup.tsx` где код через Shiki — там Shiki использует свой font, наш font-mono на title bar / footer

### Step 8 — Hero code mockup интерактив

**Идея:** код печатается построчно (typing effect) при первом появлении в viewport, потом начинает «работать» — footer log тикает (счётчик calls растёт, иногда меняется fallback count).

**Технически:**
- `useEffect` + `useState` — индекс активной строки. Через `requestAnimationFrame` или `setTimeout` — увеличиваем индекс. Shiki рендерит весь код целиком; для typing-эффекта нужно либо подмаскировать строки выше индекса (CSS-mask), либо подавать прогрессивный текст в Shiki (медленно).
- Простой вариант: после ready Shiki, нарезаем HTML-вывод по строкам (по `<span class="line">`) и через CSS показываем строки одну за другой (opacity 0 → 1 + переезд курсора-блока в конец последней).
- Footer log: `useEffect` интервал 1–3 сек, тикает счётчик calls на случайные +1–5, иногда `fallbacks today` +1. Подсветка → fade.
- Reduced motion: пропускаем typing, сразу показываем код. Footer log тоже статичный.

## Verification

После каждого step:
- `npm run typecheck`
- `npm run lint` (warning-only; ошибки — фикс)
- Визуально на `localhost:3000/ru` и `/en` (там, где dev уже работает на :3000)

После всех:
- `npm run build` — финальный sanity

## Out of scope

- Не трогаем CV (`/[lang]/minasarkisyan`) — Skolkovo там остаётся как реальный заказчик.
- Не переделываем layout страниц вне лендинга.
- Не переименовываем `id` кейсов (внутренние anchors).
