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
        { icon: "search", title: "RAG", sub: "Поиск по вашим документам и базе знаний", anchor: "#case-hubmarket" },
        { icon: "bot", title: "LLM-агенты", sub: "Tool use, оркестрация, workflow с автоматическими действиями", anchor: "#case-mcp" },
        { icon: "plug", title: "MCP", sub: "Подключаю ваш API/сервис к Claude и другим агентам", anchor: "#case-mcp" },
        { icon: "scale", title: "Multi-provider cascade", sub: "Claude → Gemini → Groq с фолбэком, без вендор-лока", anchor: "#case-hubmarket" },
        { icon: "doc", title: "Документ-пайплайны", sub: "OCR → LLM → структурированные данные", anchor: "#case-skolkovo" },
        { icon: "sparkles", title: "AI-фичи в существующий продукт", sub: "Без переписывания, аккуратная интеграция", anchor: "#case-landing" },
      ],
    },
    roadmap: {
      title: "Как происходит работа",
      sub: "Прозрачный процесс — без сюрпризов и аккаунт-менеджеров.",
      steps: [
        { num: "01", title: "Discovery", time: "Бесплатно · 15 мин", body: "Короткий созвон: что у вас за задача, какие данные, ожидания по срокам и метрикам. Если не совпадаем — сразу скажу." },
        { num: "02", title: "Аудит", time: "1 день · 80 000 ₽", body: "Глубокий разбор задачи, выбор стека и моделей, roadmap и оценка MVP. На выходе — документ и конкретный следующий шаг." },
        { num: "03", title: "MVP", time: "1 неделя · от 600 000 ₽", body: "Архитектура → реализация одного AI-сценария → передача в прод с документацией. Один контракт, без накладных." },
        { num: "04", title: "Поддержка", time: "От 200k ₽/мес · опционально", body: "Развитие функций, эксплуатация, эволюция промптов и моделей. SLA по согласованию." },
      ],
    },
    pricing: {
      title: "Как мы работаем",
      packages: {
        audit: {
          name: "Аудит",
          pill: "Старт за 1 день",
          items: ["Созвон 1-2 ч", "Roadmap внедрения", "Оценка MVP", "Рекомендация стека"],
          cta: "Заказать",
        },
        mvp: {
          name: "MVP",
          pill: "Самое популярное",
          items: ["Архитектура + стек", "Реализация одного сценария", "Передача в прод", "Документация"],
          cta: "Обсудить",
        },
        support: {
          name: "Поддержка",
          pill: "5+ продуктов на support",
          items: ["Развитие функций", "Эксплуатация", "Эволюция моделей", "SLA по согласованию"],
          cta: "Обсудить",
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
      ],
      stack: ["Next.js 16", "React 19", "Hono", "Prisma", "pg-boss", "Vercel AI SDK", "Python/FastAPI", "Playwright", "ЮKassa", "Cloudflare Workers"],
    },
    cases: {
      title: "Ещё кейсы",
      moreLink: "Полное портфолио и опыт → /minasarkisyan",
      items: [
        { id: "case-skolkovo", title: "AI OCR ⇢ GPT", sub: "Skolkovo · Yandex stack · async queues", stack: ["Laravel 12", "Yandex OCR", "Yandex GPT"] },
        { id: "case-landing", title: "AI Landing builder", sub: "Skolkovo · dual-provider", stack: ["Vue 3", "GPT-4o-mini", "NanoBanano"] },
        { id: "case-mcp", title: "timeweb-mcp-server", sub: "Open-source · npm · GitHub", stack: ["Node.js", "TypeScript", "MCP SDK"], openSource: { npmPkg: "timeweb-mcp-server", ghOwner: "webkoth", ghRepo: "timeweb-mcp-server" } },
        { id: "case-lenderkit", title: "Lenderkit fintech", sub: "Justcoded · team-lead", stack: ["PHP 8", "Laravel", "PostgreSQL"] },
        { id: "case-erp", title: "ERP oil & gas", sub: "Itpelag · 500+ users", stack: ["Laravel", "Oracle", "Docker"] },
        { id: "case-mpstats", title: "1+ TB analytics", sub: "MPSTATS · −20% latency, +30% throughput", stack: ["Laravel", "ClickHouse", "Pandas"] },
      ] as ReadonlyArray<{
        id: string;
        title: string;
        sub: string;
        stack: string[];
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
        { icon: "search", title: "RAG", sub: "Search across your docs and knowledge base", anchor: "#case-hubmarket" },
        { icon: "bot", title: "LLM agents", sub: "Tool use, orchestration, workflows with autonomous actions", anchor: "#case-mcp" },
        { icon: "plug", title: "MCP", sub: "Connect your API/service to Claude and other agents", anchor: "#case-mcp" },
        { icon: "scale", title: "Multi-provider cascade", sub: "Claude → Gemini → Groq with fallback, no vendor lock-in", anchor: "#case-hubmarket" },
        { icon: "doc", title: "Document pipelines", sub: "OCR → LLM → structured data", anchor: "#case-skolkovo" },
        { icon: "sparkles", title: "AI features in existing products", sub: "No rewrites — clean integration", anchor: "#case-landing" },
      ],
    },
    roadmap: {
      title: "How the work happens",
      sub: "A transparent process — no surprises, no account managers.",
      steps: [
        { num: "01", title: "Discovery", time: "Free · 15 min", body: "Short call: your task, your data, expectations on timing and metrics. If we don't fit — I'll say so on the spot." },
        { num: "02", title: "Audit", time: "1 day · $1,000", body: "Deep dive into the task, stack and model selection, roadmap, MVP estimate. Output: a document and a concrete next step." },
        { num: "03", title: "MVP", time: "1 week · from $7,500", body: "Architecture → implementation of one AI scenario → handover to prod with documentation. One contract, zero overhead." },
        { num: "04", title: "Support", time: "From $2,500/mo · optional", body: "Feature development, operations, prompt and model evolution. SLA on agreement." },
      ],
    },
    pricing: {
      title: "How we work",
      packages: {
        audit: { name: "Audit", pill: "Start in 1 day", items: ["1-2h call", "Implementation roadmap", "MVP estimate", "Stack recommendation"], cta: "Order" },
        mvp: { name: "MVP", pill: "Most popular", items: ["Architecture + stack", "Single-scenario delivery", "Handover to prod", "Documentation"], cta: "Discuss" },
        support: { name: "Support", pill: "5+ products on support", items: ["Feature development", "Operations", "Model evolution", "SLA on agreement"], cta: "Discuss" },
      },
    },
    featured: {
      title: "Case: HubMarket",
      sub: "AI-SaaS for marketplace sellers · Founder + sole developer · production",
      metrics: ["3 marketplaces (WB, Ozon, Yandex Market)", "0 LLM downtime via cascade", "End-to-end, one person"],
      stack: ["Next.js 16", "React 19", "Hono", "Prisma", "pg-boss", "Vercel AI SDK", "Python/FastAPI", "Playwright", "YooKassa", "Cloudflare Workers"],
    },
    cases: {
      title: "More cases",
      moreLink: "Full portfolio & background → /minasarkisyan",
      items: [
        { id: "case-skolkovo", title: "AI OCR ⇢ GPT", sub: "Skolkovo · Yandex stack · async queues", stack: ["Laravel 12", "Yandex OCR", "Yandex GPT"] },
        { id: "case-landing", title: "AI Landing builder", sub: "Skolkovo · dual-provider", stack: ["Vue 3", "GPT-4o-mini", "NanoBanano"] },
        { id: "case-mcp", title: "timeweb-mcp-server", sub: "Open-source · npm · GitHub", stack: ["Node.js", "TypeScript", "MCP SDK"], openSource: { npmPkg: "timeweb-mcp-server", ghOwner: "webkoth", ghRepo: "timeweb-mcp-server" } },
        { id: "case-lenderkit", title: "Lenderkit fintech", sub: "Justcoded · team-lead", stack: ["PHP 8", "Laravel", "PostgreSQL"] },
        { id: "case-erp", title: "ERP oil & gas", sub: "Itpelag · 500+ users", stack: ["Laravel", "Oracle", "Docker"] },
        { id: "case-mpstats", title: "1+ TB analytics", sub: "MPSTATS · −20% latency, +30% throughput", stack: ["Laravel", "ClickHouse", "Pandas"] },
      ] as ReadonlyArray<{
        id: string;
        title: string;
        sub: string;
        stack: string[];
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
