export type Lang = "en" | "ru";

export const copy = {
  ru: {
    nav: { brand: "webkoth · AI Integration" },
    hero: {
      h1: "Production AI в вашем продукте — за дни, не за кварталы.",
      sub: "AI-агенты, RAG, MCP на готовом стеке. Стартапу — MVP за неделю. SMB — production-каскад. Агентству — MCP-разработка whitelabel. Прямой контакт с разработчиком.",
      specs: ["RAG", "LLM-агенты", "MCP", "multi-provider cascade"],
      ctaPrimary: "Заказать аудит",
      ctaSecondary: "Обсудить проект",
      metrics: [
        { value: 9, suffix: "+", label: "лет fullstack" },
        { value: 2.5, suffix: "", label: "года production AI" },
        { value: 3, suffix: "", label: "MCP-сервера на npm" },
        { value: 5, suffix: "+", label: "продуктов в проде" },
      ],
    },
    tasks: {
      title: "Какие задачи я закрываю",
      items: [
        {
          icon: "search",
          title: "RAG",
          trigger: "Саппорт спрашивает «как обработать случай X»",
          action: "AI находит ответ в 500-страничном регламенте, цитирует пункт",
          outcome: "30 секунд вместо 15 минут",
          anchor: "#case-hubmarket",
        },
        {
          icon: "bot",
          title: "LLM-агенты",
          trigger: "Клиент пишет «где мой возврат?»",
          action: "Агент дёргает CRM и платёжку, отвечает по статусу",
          outcome: "Закрыт без человека, эскалация только в спорных кейсах",
          anchor: "#case-mcp",
        },
        {
          icon: "plug",
          title: "MCP",
          trigger: "Разработчик хочет деплоить из Claude Code",
          action: "MCP-сервер открывает доступ к вашему CI/CD",
          outcome: "«Задеплой v1.2.3 на staging» — готово, без терминала",
          anchor: "#case-mcp",
        },
        {
          icon: "scale",
          title: "Multi-provider cascade",
          trigger: "Anthropic упал в 14:32",
          action: "Автоматический фолбэк на Gemini",
          outcome: "0 downtime LLM с момента запуска HubMarket",
          anchor: "#case-hubmarket",
        },
        {
          icon: "doc",
          title: "Документ-пайплайны",
          trigger: "Студент загрузил PDF-документ",
          action: "OCR извлёк текст, LLM разобрал поля",
          outcome: "Запись в БД, привязка к программе — без ручного ввода (в проде в Сколково)",
          anchor: "#case-skolkovo",
        },
        {
          icon: "sparkles",
          title: "AI-фичи в существующий продукт",
          trigger: "У вас Vue 3 + Laravel",
          action: "Встроенный AI-виджет хука к существующему API",
          outcome: "Релиз в пятницу, ни строчки переписанного фронта",
          anchor: "#case-landing",
        },
      ],
    },
    roadmap: {
      eyebrow: "КАК МЫ РАБОТАЕМ",
      title: "От идеи до прода — за 4 шага",
      sub: "Прозрачный процесс — без сюрпризов и аккаунт-менеджеров.",
      steps: [
        {
          num: "01",
          title: "Discovery",
          body: "Короткий созвон: что у вас за задача, какие данные, ожидания по срокам и метрикам. Если не совпадаем — сразу скажу.",
          pill: "БЕСПЛАТНО · 15 МИНУТ",
        },
        {
          num: "02",
          title: "Аудит",
          body: "Глубокий разбор задачи, выбор стека и моделей, roadmap и оценка MVP. На выходе — документ и конкретный следующий шаг.",
          pill: "1 ДЕНЬ · 80 000 ₽ · ОБЯЗАТЕЛЕН ДЛЯ A · ОПЦИОНАЛЕН ДЛЯ B",
        },
        {
          num: "03",
          title: "MVP",
          body: "Два формата под аудиторию: AI-MVP Sprint для фаундера (1 сценарий из 3 шаблонов); Production AI Integration для SMB (интеграция в ваш стек, multi-provider cascade, observability).",
          pill: "SPRINT 7 ДНЕЙ · INTEGRATION 2-4 НЕДЕЛИ",
        },
        {
          num: "04",
          title: "Передача + страховка",
          body: "Handover-документ, исходники, доступы. Первый месяц minimal support — бесплатно: бакфиксы, мониторинг, мелкие доработки. Дальше — по договорённости.",
          pill: "+ 1 МЕСЯЦ FREE MINIMAL SUPPORT",
        },
      ],
    },
    pricing: {
      title: "Пакеты",
      subtitle: "Под аудиторию. Audit (1 день, 80 000 ₽) — обязательный шаг для Production AI Integration, опционален для AI-MVP Sprint.",
      excludesLabel: "Не входит",
      packages: {
        sprint: {
          name: "AI-MVP Sprint",
          audience: "Фаундеру",
          pill: "150 000 ₽ · 7 дней",
          items: [
            "1 AI-сценарий в проде из 3 шаблонов",
            "RAG-чат-бот / агент с tool calling / AI-фича в существующее приложение",
            "Готовый стек: Next.js + Hono + Vercel AI SDK + Claude/Gemini fallback",
            "Handover: код, доки, доступы",
          ],
          excludes: ["Дизайн UI с нуля", "Поддержка после релиза", "Fine-tuning моделей", "Оплата токенов LLM"],
          cta: "Обсудить Sprint",
        },
        integration: {
          name: "Production AI Integration",
          audience: "SMB / mid-market",
          pill: "от 600 000 ₽ · 2-4 недели · +1 мес free support",
          items: [
            "Адаптация к вашему стеку (PHP/Laravel, Python/FastAPI, Node, Go)",
            "Multi-provider fallback (без вендор-лока)",
            "Observability: Sentry / pino / структурированные логи",
            "Аудит-лог промптов и ответов",
            "Handover-документ + 1 месяц minimal support бесплатно",
          ],
          excludes: ["Дообучение моделей", "Дизайн UI с нуля", "Оплата токенов LLM", "Перевод продукта на новый стек"],
          cta: "Заказать аудит",
        },
        subcontract: {
          name: "Subcontract / Whitelabel",
          audience: "Агентству",
          pill: "от 120 000 ₽ · 2-3 недели · ad-hoc 3 500 ₽/час",
          items: [
            "1 MCP-сервер под клиентский API — от 120 000 ₽ за 2 недели",
            "RAG / агент / AI-фича — от 150 000 ₽ за 2-3 недели",
            "Ad-hoc консалтинг по AI / MCP — от 3 500 ₽/час",
            "Whitelabel default + опционально 'AI engineer on team'",
            "NDA до начала. Коммуникация через вас.",
          ],
          excludes: ["Прямая работа с конечным клиентом без согласования", "Минимум на проект — 20 часов"],
          cta: "Обсудить сабконтракт",
        },
      },
    },
    featured: {
      title: "Кейс: HubMarket",
      sub: "AI-SaaS для селлеров маркетплейсов · Founder + sole developer · production",
      metrics: [
        "3 marketplaces (WB, Ozon, Yandex Market)",
        "0 LLM downtime через cascade",
        "End-to-end один человек",
        "Цикл «запрос фичи → прод»: 3-4 дня",
      ],
      stack: ["Next.js 16", "React 19", "Hono", "Prisma", "pg-boss", "Vercel AI SDK", "Python/FastAPI", "Playwright", "ЮKassa", "Cloudflare Workers"],
    },
    cases: {
      title: "Ещё кейсы",
      moreLink: "Полное портфолио и опыт → /minasarkisyan",
      tagLabels: {
        founder: "Для фаундера",
        smb: "Для SMB",
        agency: "Для агентств",
      },
      items: [
        { id: "case-skolkovo", title: "AI OCR ⇢ GPT", sub: "Skolkovo · Yandex stack · async queues", stack: ["Laravel 12", "Yandex OCR", "Yandex GPT"], audienceTag: "smb" },
        { id: "case-landing", title: "AI Landing builder", sub: "Skolkovo · dual-provider", stack: ["Vue 3", "GPT-4o-mini", "NanoBanano"], audienceTag: "founder" },
        { id: "case-hubmarket-stocksync", title: "Маркетплейс-синхронизация остатков", sub: "HubMarket · запрос фаундера → прод за 3 дня", stack: ["Next.js", "Hono", "Playwright", "pg-boss"], audienceTag: "founder", link: "/ru/cases/hubmarket-stocksync" },
        { id: "case-mcp", title: "timeweb-mcp-server", sub: "Open-source · npm · GitHub", stack: ["Node.js", "TypeScript", "MCP SDK"], openSource: { npmPkg: "timeweb-mcp-server", ghOwner: "webkoth", ghRepo: "timeweb-mcp-server" }, audienceTag: "agency" },
        { id: "case-lenderkit", title: "Lenderkit fintech", sub: "Justcoded · team-lead", stack: ["PHP 8", "Laravel", "PostgreSQL"], audienceTag: "smb" },
        { id: "case-erp", title: "ERP oil & gas", sub: "Itpelag · 500+ users", stack: ["Laravel", "Oracle", "Docker"], audienceTag: "smb" },
        { id: "case-mpstats", title: "1+ TB analytics", sub: "MPSTATS · −20% latency, +30% throughput", stack: ["Laravel", "ClickHouse", "Pandas"], audienceTag: "smb" },
      ] as ReadonlyArray<{
        id: string;
        title: string;
        sub: string;
        stack: string[];
        audienceTag: "founder" | "smb" | "agency";
        link?: string;
        openSource?: { npmPkg: string; ghOwner: string; ghRepo: string };
      }>,
    },
    why: {
      title: "Почему именно так",
      items: [
        { title: "Один контракт от идеи до прода", body: "Нет передачи между фронт/бэк/AI/DevOps — это я весь. В HubMarket это уже доказано: Founder + sole dev.", proofLabel: "→ HubMarket", proofAnchor: "#featured" },
        { title: "Production-уровень, не «PoC и до свидания»", body: "Multi-provider cascade, очереди, наблюдаемость, откаты. Не «работает на демо», а «не падает в проде».", proofLabel: "→ Skolkovo loyalty", proofAnchor: "#case-skolkovo" },
        { title: "Я живу в AI-стеке", body: "3 опубликованных MCP-сервера на npm. Ежедневно в Claude Code и Cursor. Это не курсы — рабочие инструменты.", proofLabel: "→ npm", proofHref: "https://www.npmjs.com/~webkoth" },
      ] as ReadonlyArray<{
        title: string;
        body: string;
        proofLabel: string;
        proofAnchor?: string;
        proofHref?: string;
      }>,
    },
    form: {
      title: "Заявка на предварительный просчёт",
      fields: {
        name: "Имя",
        contact: "Контакт (Telegram или email)",
        package: "Какой пакет",
        packageOptions: { audit: "Аудит", mvp: "MVP", support: "Поддержка", unsure: "Не уверен" },
        message: "О задаче",
        budget: "Бюджет (необязательно)",
        budgetOptions: { unknown: "Не определён", under500: "до 500k ₽", to2m: "500k–2M ₽", over2m: "2M+ ₽", usd: "USD-эквивалент" },
      },
      submit: "Отправить заявку",
      hint: "Ответ — в течение суток, обычно — в часы.",
      success: { title: "Спасибо, заявка получена", body: "Я уже вижу её в Telegram. Свяжусь в течение суток." },
      error: { title: "Не удалось отправить", body: "Напишите напрямую в Telegram: @abnorsky" },
      altChannels: {
        intro: "Или быстрее — забронируйте 15-мин Discovery:",
        calendar: "Google Calendar",
        telegram: "Telegram",
      },
    },
    faq: {
      title: "Частые вопросы",
      items: [
        { q: "Как вы успеваете MVP за неделю?", a: "Готовая методология, повторяющиеся паттерны (RAG / агент / multi-provider cascade), готовый Next.js + Hono бойлерплейт, AI-tooling (Claude Code) в ежедневной работе. Если задача не укладывается — на аудите честно говорю и предлагаю реалистичный срок." },
        { q: "Чем вы отличаетесь от агентства/студии?", a: "Один контакт, нулевые накладные расходы, без передачи. Видите код — это мой код. Цены не включают аккаунт-менеджера." },
        { q: "Какие модели используете и почему?", a: "Claude — основной для генерации/агентов. Gemini и Groq — фолбэк и cost-optimization. Yandex GPT — для проектов с требованиями к локализации. Выбор обосновываю на аудите." },
        { q: "Можно ли подключить свою инфру / on-premise?", a: "Да. Self-hosted LLM (Llama/Mistral через Ollama/vLLM), pgvector вместо managed vector DB, развёртывание на ваших серверах. На аудите фиксируем требования." },
        { q: "NDA и безопасность данных?", a: "NDA подписываю до начала аудита. Для чувствительных данных — multi-provider только через self-hosted/EU-инстансы, аудит-лог промптов и ответов." },
        { q: "Сколько параллельных проектов?", a: "Максимум 2 активных. Поддержку не считаю активной, если она не требует постоянной разработки." },
        { q: "Английский?", a: "Intermediate. Письменно — без проблем (включая техдоки). Голосовые встречи на английском — могу, но эффективнее на русском." },
        { q: "Что если задача исследовательская, а не «внедрить готовое»?", a: "Беру, если граница MVP определима. Чистый R&D без целевой метрики — не моё." },
      ],
      codeSnippetTitle: "Пример: минимальный MCP-сервер на TypeScript",
      codeSnippet: `import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new Server(
  { name: "my-tool", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler("tools/list", async () => ({
  tools: [{ name: "ping", description: "returns pong", inputSchema: { type: "object" } }],
}));

server.setRequestHandler("tools/call", async (req) => {
  if (req.params.name === "ping") return { content: [{ type: "text", text: "pong" }] };
});

await server.connect(new StdioServerTransport());`,
    },
    footer: {
      brand: "webkoth · Минас Саркисян · Краснодар · Remote / Hybrid",
      links: { cv: "CV", github: "GitHub", telegram: "Telegram", youtube: "YouTube" },
      copyright: "© 2026",
    },
  },
  en: {
    nav: { brand: "webkoth · AI Integration" },
    hero: {
      h1: "Production AI in your product — in days, not quarters.",
      sub: "AI agents, RAG, MCP on a ready stack. Founders — MVP in a week. SMB — production cascade. Agencies — whitelabel MCP development. Direct contact with the developer.",
      specs: ["RAG", "LLM agents", "MCP", "multi-provider cascade"],
      ctaPrimary: "Get an audit",
      ctaSecondary: "Discuss a project",
      metrics: [
        { value: 9, suffix: "+", label: "yrs fullstack" },
        { value: 2.5, suffix: "", label: "yrs production AI" },
        { value: 3, suffix: "", label: "npm MCP servers" },
        { value: 5, suffix: "+", label: "products live" },
      ],
    },
    tasks: {
      title: "What I solve",
      items: [
        {
          icon: "search",
          title: "RAG",
          trigger: "Support asks «how do we handle case X»",
          action: "AI finds the answer in a 500-page playbook, cites the section",
          outcome: "30 seconds instead of 15 minutes",
          anchor: "#case-hubmarket",
        },
        {
          icon: "bot",
          title: "LLM agents",
          trigger: "Customer asks «where is my refund?»",
          action: "Agent calls CRM and payment API, answers with status",
          outcome: "Closed without a human, escalation only on disputes",
          anchor: "#case-mcp",
        },
        {
          icon: "plug",
          title: "MCP",
          trigger: "Your dev wants to deploy from Claude Code",
          action: "MCP server exposes your CI/CD",
          outcome: "«Deploy v1.2.3 to staging» — done, no terminal",
          anchor: "#case-mcp",
        },
        {
          icon: "scale",
          title: "Multi-provider cascade",
          trigger: "Anthropic went down at 14:32",
          action: "Automatic fallback to Gemini",
          outcome: "0 LLM downtime since HubMarket launch",
          anchor: "#case-hubmarket",
        },
        {
          icon: "doc",
          title: "Document pipelines",
          trigger: "Student uploads a PDF document",
          action: "OCR extracts text, LLM parses fields",
          outcome: "DB record + program linkage — no manual entry (in prod at Skolkovo)",
          anchor: "#case-skolkovo",
        },
        {
          icon: "sparkles",
          title: "AI features in existing product",
          trigger: "You have Vue 3 + Laravel",
          action: "AI widget hooks into your existing API",
          outcome: "Release Friday, zero frontend rewrites",
          anchor: "#case-landing",
        },
      ],
    },
    roadmap: {
      eyebrow: "HOW WE WORK",
      title: "From idea to prod in 4 steps",
      sub: "A transparent process — no surprises, no account managers.",
      steps: [
        {
          num: "01",
          title: "Discovery",
          body: "Short call: your task, your data, expectations on timing and metrics. If we don't fit — I'll say so on the spot.",
          pill: "FREE · 15 MINUTES",
        },
        {
          num: "02",
          title: "Audit",
          body: "Deep dive into the task, stack and model selection, roadmap, MVP estimate. Output: a document and a concrete next step.",
          pill: "1 DAY · $1,000 · REQUIRED FOR A · OPTIONAL FOR B",
        },
        {
          num: "03",
          title: "MVP",
          body: "Two formats by audience: AI-MVP Sprint for founders (1 scenario from 3 templates); Production AI Integration for SMB (integration into your stack, multi-provider cascade, observability).",
          pill: "SPRINT 7 DAYS · INTEGRATION 2-4 WEEKS",
        },
        {
          num: "04",
          title: "Handover + safety net",
          body: "Handover doc, source code, access. First month of minimal support — free: bugfixes, monitoring, small refinements. After — by agreement.",
          pill: "+ 1 MONTH FREE MINIMAL SUPPORT",
        },
      ],
    },
    pricing: {
      title: "Packages",
      subtitle: "By audience. Audit (1 day, $1,000) — required for Production AI Integration, optional for AI-MVP Sprint.",
      excludesLabel: "Not included",
      packages: {
        sprint: {
          name: "AI-MVP Sprint",
          audience: "For founders",
          pill: "$1,500 · 7 days",
          items: [
            "1 AI scenario in prod from 3 templates",
            "RAG chatbot / tool-calling agent / AI feature in existing app",
            "Ready stack: Next.js + Hono + Vercel AI SDK + Claude/Gemini fallback",
            "Handover: code, docs, access",
          ],
          excludes: ["Custom UI design", "Post-release support", "Model fine-tuning", "LLM token costs"],
          cta: "Discuss Sprint",
        },
        integration: {
          name: "Production AI Integration",
          audience: "For SMB / mid-market",
          pill: "from $6,000 · 2-4 weeks · +1 mo free support",
          items: [
            "Adaptation to your stack (PHP/Laravel, Python/FastAPI, Node, Go)",
            "Multi-provider fallback (no vendor lock-in)",
            "Observability: Sentry / pino / structured logs",
            "Prompt + response audit log",
            "Handover doc + 1 month free minimal support",
          ],
          excludes: ["Model fine-tuning", "Custom UI design", "LLM token costs", "Migration to new stack"],
          cta: "Order an audit",
        },
        subcontract: {
          name: "Subcontract / Whitelabel",
          audience: "For agencies",
          pill: "from $1,200 · 2-3 weeks · ad-hoc $35/h",
          items: [
            "1 MCP server for client API — from $1,200 in 2 weeks",
            "RAG / agent / AI feature — from $1,500 in 2-3 weeks",
            "Ad-hoc consulting on AI / MCP — from $35/h",
            "Whitelabel default + optional 'AI engineer on team'",
            "NDA before start. Communication through you.",
          ],
          excludes: ["Direct work with end-client without approval", "Minimum 20h per project"],
          cta: "Discuss subcontract",
        },
      },
    },
    featured: {
      title: "Case: HubMarket",
      sub: "AI-SaaS for marketplace sellers · Founder + sole developer · production",
      metrics: [
        "3 marketplaces (WB, Ozon, Yandex Market)",
        "0 LLM downtime via cascade",
        "End-to-end, one person",
        "Feature request → prod cycle: 3-4 days",
      ],
      stack: ["Next.js 16", "React 19", "Hono", "Prisma", "pg-boss", "Vercel AI SDK", "Python/FastAPI", "Playwright", "YooKassa", "Cloudflare Workers"],
    },
    cases: {
      title: "More cases",
      moreLink: "Full portfolio & background → /minasarkisyan",
      tagLabels: {
        founder: "For founders",
        smb: "For SMB",
        agency: "For agencies",
      },
      items: [
        { id: "case-skolkovo", title: "AI OCR ⇢ GPT", sub: "Skolkovo · Yandex stack · async queues", stack: ["Laravel 12", "Yandex OCR", "Yandex GPT"], audienceTag: "smb" },
        { id: "case-landing", title: "AI Landing builder", sub: "Skolkovo · dual-provider", stack: ["Vue 3", "GPT-4o-mini", "NanoBanano"], audienceTag: "founder" },
        { id: "case-hubmarket-stocksync", title: "Marketplace stock sync", sub: "HubMarket · founder request → prod in 3 days", stack: ["Next.js", "Hono", "Playwright", "pg-boss"], audienceTag: "founder", link: "/en/cases/hubmarket-stocksync" },
        { id: "case-mcp", title: "timeweb-mcp-server", sub: "Open-source · npm · GitHub", stack: ["Node.js", "TypeScript", "MCP SDK"], openSource: { npmPkg: "timeweb-mcp-server", ghOwner: "webkoth", ghRepo: "timeweb-mcp-server" }, audienceTag: "agency" },
        { id: "case-lenderkit", title: "Lenderkit fintech", sub: "Justcoded · team-lead", stack: ["PHP 8", "Laravel", "PostgreSQL"], audienceTag: "smb" },
        { id: "case-erp", title: "ERP oil & gas", sub: "Itpelag · 500+ users", stack: ["Laravel", "Oracle", "Docker"], audienceTag: "smb" },
        { id: "case-mpstats", title: "1+ TB analytics", sub: "MPSTATS · −20% latency, +30% throughput", stack: ["Laravel", "ClickHouse", "Pandas"], audienceTag: "smb" },
      ] as ReadonlyArray<{
        id: string;
        title: string;
        sub: string;
        stack: string[];
        audienceTag: "founder" | "smb" | "agency";
        link?: string;
        openSource?: { npmPkg: string; ghOwner: string; ghRepo: string };
      }>,
    },
    why: {
      title: "Why this works",
      items: [
        { title: "One contract from idea to prod", body: "No handoffs between front/back/AI/DevOps — that's all me. Proven on HubMarket: Founder + sole dev.", proofLabel: "→ HubMarket", proofAnchor: "#featured" },
        { title: "Production-grade, not 'PoC and bye'", body: "Multi-provider cascade, queues, observability, rollbacks. Doesn't 'work on demo' — doesn't fall in prod.", proofLabel: "→ Skolkovo loyalty", proofAnchor: "#case-skolkovo" },
        { title: "I live in the AI stack", body: "3 published MCP servers on npm. Daily in Claude Code and Cursor. Not courses — actual tools.", proofLabel: "→ npm", proofHref: "https://www.npmjs.com/~webkoth" },
      ] as ReadonlyArray<{
        title: string;
        body: string;
        proofLabel: string;
        proofAnchor?: string;
        proofHref?: string;
      }>,
    },
    form: {
      title: "Project inquiry",
      fields: {
        name: "Name",
        contact: "Contact (Telegram or email)",
        package: "Which package",
        packageOptions: { audit: "Audit", mvp: "MVP", support: "Support", unsure: "Not sure" },
        message: "About the task",
        budget: "Budget (optional)",
        budgetOptions: { unknown: "Not defined", under500: "under $5k", to2m: "$5k–$25k", over2m: "$25k+", usd: "RUB-equivalent" },
      },
      submit: "Send inquiry",
      hint: "Reply within 24h, usually hours.",
      success: { title: "Thank you, got it", body: "I see it in Telegram already. Will reply within 24h." },
      error: { title: "Failed to send", body: "Drop a message on Telegram: @abnorsky" },
      altChannels: {
        intro: "Or faster — book a 15-min Discovery:",
        calendar: "Google Calendar",
        telegram: "Telegram",
      },
    },
    faq: {
      title: "FAQ",
      items: [
        { q: "How do you ship MVP in a week?", a: "Established methodology, repeating patterns (RAG / agent / multi-provider cascade), Next.js + Hono boilerplate, AI-tooling (Claude Code) in daily work. If a task doesn't fit — I say so honestly at the audit and propose a realistic timeline." },
        { q: "How are you different from an agency?", a: "One contact, zero overhead, no handoffs. The code you see is my code. Pricing doesn't include an account manager." },
        { q: "Which models do you use and why?", a: "Claude is primary for generation/agents. Gemini and Groq — fallback and cost optimization. Yandex GPT — for locale-bound projects. I justify the choice at the audit." },
        { q: "Can you use my infra / on-premise?", a: "Yes. Self-hosted LLM (Llama/Mistral via Ollama/vLLM), pgvector instead of managed vector DB, deployment on your servers. Locked in at the audit." },
        { q: "NDA and data security?", a: "NDA signed before audit. For sensitive data — multi-provider only via self-hosted/EU instances, prompt+response audit log." },
        { q: "How many parallel projects?", a: "Max 2 active. Support is not 'active' unless it requires ongoing development." },
        { q: "English level?", a: "Intermediate. Written — fine (incl. tech docs). Voice meetings in English — workable, but Russian is more efficient." },
        { q: "Research tasks vs implementation?", a: "I take it if the MVP boundary is definable. Pure R&D without a target metric — not for me." },
      ],
      codeSnippetTitle: "Example: minimal MCP server in TypeScript",
      codeSnippet: `import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new Server(
  { name: "my-tool", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler("tools/list", async () => ({
  tools: [{ name: "ping", description: "returns pong", inputSchema: { type: "object" } }],
}));

server.setRequestHandler("tools/call", async (req) => {
  if (req.params.name === "ping") return { content: [{ type: "text", text: "pong" }] };
});

await server.connect(new StdioServerTransport());`,
    },
    footer: {
      brand: "webkoth · Minas Sarkisyan · Krasnodar · Remote / Hybrid",
      links: { cv: "CV", github: "GitHub", telegram: "Telegram", youtube: "YouTube" },
      copyright: "© 2026",
    },
  },
} as const;
