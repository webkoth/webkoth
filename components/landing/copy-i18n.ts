export type Lang = "en" | "ru";

export const copy = {
  ru: {
    nav: { brand: "Minas Sarkisyan · AI Integration" },
    hero: {
      h1: "MVP в production за 5 дней",
      sub: "AI-агенты, RAG, MCP. MVP за неделю. Прямой контакт с разработчиком.",
      specs: [
        "RAG", 
        "LLM-агенты", 
        "MCP", 
        "multi-provider cascade",
        "RAG по PDF/таблицам",
        "интеграция через Claude Code, MCP",
        "latency LLM",
        "Продуктовый аудит"
      ],
      ctaPrimary: "Заказать аудит",
      ctaSecondary: "Обсудить проект",
      metrics: [
        { value: 10, suffix: "+", label: "лет опыта fullstack разработки" },
        { value: 2, suffix: "", label: "года внедрения production AI" },
        { value: 10, suffix: "", label: "реализованных MCP-сервера" },
        { value: 20, suffix: "+", label: "продуктов в продакшене" },
      ],
    },
    tasks: {
      title: "Пример закрытых задач",
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
          outcome: "Запись в БД, привязка к программе — без ручного ввода",
          anchor: "#case-skolkovo",
        },
        {
          icon: "sparkles",
          title: "AI-фичи в существующий продукт",
          trigger: "Генерация описания карточик товара",
          action: "Встроенный AI-виджет к существующему API",
          outcome: "Бесшовная интеграция в существующую кастомную CRM систему",
          anchor: "#case-landing",
        },
      ],
    },
    roadmap: {
      eyebrow: "КАК МЫ РАБОТАЕМ",
      title: "От идеи до прода",
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
          pill: "1 ДЕНЬ · ОБЯЗАТЕЛЕН ДЛЯ A · ОПЦИОНАЛЕН ДЛЯ B",
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
    featured: {
      title: "Кейс: HubMarket.ru",
      sub: "AI-SaaS для селлеров маркетплейсов",
      stack: [
        "Next.js 16",
        "React 19",
        "Prisma 7",
        "PostgreSQL",
        "pg-boss",
        "Hono",
        "AI SDK",
        "Claude",
        "Gemini",
        "Groq",
        "Python · FastAPI",
        "Playwright",
        "Sentry · pino",
        "ЮKassa",
      ],
    },
    cases: {
      title: "Ещё кейсы",
      sub: "AI-проекты (RAG, LLM, агенты, OCR-пайплайны) и тяжёлый production: fintech, ERP, big-data аналитика.",
      moreLink: "Полное портфолио и опыт: /minasarkisyan",
      groupLabels: {
        all: "Все",
        ai: "AI / LLM",
        production: "Production / High-load",
      },
      items: [
        { id: "case-hubmarket-stocksync", title: "Маркетплейс-синхронизация остатков", sub: "HubMarket · парсер 4 площадок + pipeline на pg-boss · запрос фаундера в прод за 3 дня", stack: ["Next.js", "Hono", "Playwright", "pg-boss"], group: "ai", link: "/ru/cases/hubmarket-stocksync" },
        { id: "case-skolkovo", title: "OCR-пайплайн для заявок", sub: "EdTech-заказчик · скан → Yandex OCR → Yandex GPT → структурированная запись в БД", stack: ["Laravel 12", "Yandex OCR", "Yandex GPT"], group: "ai" },
        { id: "case-landing", title: "AI-генератор лендингов", sub: "EdTech-заказчик · dual-provider генерация текста + картинок по брифу", stack: ["Vue 3", "GPT-4o-mini", "NanoBanano"], group: "ai" },
        { id: "case-mcp", title: "timeweb-mcp-server", sub: "Open-source MCP-сервер: управление Timeweb-инфрой из Claude Code, Cursor и других агентов", stack: ["Node.js", "TypeScript", "MCP SDK"], openSource: { npmPkg: "timeweb-mcp-server", ghOwner: "webkoth", ghRepo: "timeweb-mcp-server" }, group: "ai" },
        { id: "case-mpstats", title: "Big-data аналитика 1+ TB", sub: "MPSTATS · ClickHouse-pipeline · −20% latency, +30% throughput", stack: ["Laravel", "ClickHouse", "Pandas"], group: "production" },
        { id: "case-lenderkit", title: "Lenderkit fintech", sub: "Justcoded · team-lead на платформе p2p-кредитования", stack: ["PHP 8", "Laravel", "PostgreSQL"], group: "production" },
        { id: "case-erp", title: "ERP для нефтегаза", sub: "Itpelag · 500+ users · learning Oracle stack, Docker-окружение", stack: ["Laravel", "Oracle", "Docker"], group: "production" },
      ] as ReadonlyArray<{
        id: string;
        title: string;
        sub: string;
        stack: string[];
        group: "ai" | "production";
        link?: string;
        openSource?: { npmPkg: string; ghOwner: string; ghRepo: string };
      }>,
    },
    why: {
      title: "Почему именно так",
      items: [
        { title: "От идеи до прода — без передач", body: "Работает один и тот же человек на всех слоях — фронт, бэк, AI, DevOps.", proofAnchor: "#featured" },
        { title: "Production-уровень", body: "Multi-provider cascade, очереди, наблюдаемость, откаты.", proofAnchor: "#case-skolkovo" },
        { title: "AI-стек — основная экспертиза", body: "7 опубликованных MCP-серверов на npm (включая 3 для маркетплейсов).", proofLabel: "npm", proofHref: "https://www.npmjs.com/~webkoth" },
      ] as ReadonlyArray<{
        title: string;
        body: string;
        proofLabel?: string;
        proofAnchor?: string;
        proofHref?: string;
      }>,
    },
    techStack: {
      eyebrow: "СТЕК",
      title: "Работаю в вашем стеке",
      sub: "Без «давайте перепишем на новое». Адаптируюсь к вашему бэкенду, фронту, AI-провайдеру и инфре.",
      diagramTitle: "Пример архитектуры: multi-provider cascade",
      categories: [
        {
          name: "Бэкенд",
          items: ["PHP / Laravel", "Node.js / Hono", "Python / FastAPI", "Go (touch)"],
        },
        {
          name: "Фронтенд",
          items: ["React / Next.js", "Vue 3 / Inertia", "TypeScript", "Tailwind", "shadcn/ui"],
        },
        {
          name: "AI-провайдеры",
          items: ["Anthropic Claude", "OpenAI", "Google Gemini", "Groq", "Yandex GPT", "self-hosted (Ollama / vLLM)"],
        },
        {
          name: "AI-стек",
          items: ["Vercel AI SDK", "MCP", "pgvector", "structured output", "tool calling", "RAG"],
        },
        {
          name: "Базы и кэш",
          items: ["PostgreSQL", "MySQL", "ClickHouse", "Redis", "MongoDB"],
        },
        {
          name: "Инфра и эксплуатация",
          items: ["Docker", "Nginx", "Cloudflare", "Vercel", "Linux", "Sentry", "pg-boss / Horizon"],
        },
      ],
    },
    form: {
      title: "Заявка на предварительный просчёт",
      altChannelsTop: "Если короче — забронируйте 15-мин Discovery:",
      progressLabel: "Заполнено",
      fields: {
        audience: "Вы…",
        audienceOptions: {
          founder: "Фаундер / стартап",
          smb: "Tech lead / CTO в SMB",
          agency: "Агентство / студия",
          other: "Другое",
        },
        name: "Имя",
        contact: "Контакт (Telegram или email)",
        package: "Какой пакет интересует?",
        packageOptions: {
          sprint: "AI-MVP Sprint (7 дней)",
          integration: "Production AI Integration (2-4 недели)",
          subcontract: "Subcontract / Whitelabel",
          auditOnly: "Только Аудит (1 день)",
          unsure: "Не уверен — обсудим",
        },
        message: "О задаче",
        budget: "Бюджет (необязательно)",
        budgetOptions: {
          under200: "До 200k ₽",
          to600: "200k – 600k ₽",
          to12m: "600k – 1.2M ₽",
          over12m: "1.2M+ ₽",
          usd: "В USD-эквиваленте",
          unknown: "Не определён",
        },
      },
      submit: "Отправить заявку",
      hint: "Ответ в течении часа",
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
        { q: "А если моя AI-задача не вписывается в 3 шаблона AI-MVP Sprint?", a: "Тогда это не Sprint. На бесплатной 15-минутной Discovery скажу прямо: либо реально вписывается с правками — берём Sprint, либо нет — обсуждаем Production AI Integration (2-4 недели). Не натягиваю несовместимое ради чек-листа." },
        { q: "Чем вы отличаетесь от агентства/студии?", a: "Прямой контакт с разработчиком, нулевые накладные расходы, без передачи. Видите код — это мой код. Цены не включают аккаунт-менеджера." },
        { q: "Whitelabel — как это работает на практике?", a: "По умолчанию: код передаётся вам, конечный клиент со мной не контактирует, я не упоминаю проект публично. Опционально по согласованию: указание «AI engineer on team» в публичной части — меняет рамки публичности, но не структуру сделки." },
        { q: "Какие модели используете и почему?", a: "Claude — основной для генерации/агентов. Gemini и Groq — фолбэк и cost-optimization. Yandex GPT — для проектов с требованиями к локализации. Выбор обосновываю на аудите." },
        { q: "Можно ли подключить свою инфру / on-premise?", a: "Да. Self-hosted LLM (Llama/Mistral через Ollama/vLLM), pgvector вместо managed vector DB, развёртывание на ваших серверах. На аудите фиксируем требования." },
        { q: "NDA и безопасность данных?", a: "NDA подписываю до начала аудита. Для чувствительных данных — multi-provider только через self-hosted/EU-инстансы, аудит-лог промптов и ответов." },
        { q: "Кто владеет кодом после релиза?", a: "Всегда вы. Передаю исходники, документацию, доступы. У меня остаётся только право упомянуть проект как кейс — с вашего письменного согласия. NDA подписываю до начала работы." },
        { q: "Сколько параллельных проектов?", a: "Максимум 2 активных. Поддержку не считаю активной, если она не требует постоянной разработки." },
        { q: "Английский?", a: "Intermediate. Письменно — без проблем (включая техдоки). Голосовые встречи на английском — могу, но эффективнее на русском." },
        { q: "Что если задача исследовательская, а не «внедрить готовое»?", a: "Беру, если граница MVP определима. Чистый R&D без целевой метрики — не моё." },
        { q: "Что будет после первого бесплатного месяца minimal support?", a: "Обсуждается индивидуально по факту: либо продолжаю поддержку на согласованных условиях, либо вы забираете её in-house или другому подрядчику. В handover-документе — всё, что нужно для самостоятельной эксплуатации." },
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
        { value: 7, suffix: "", label: "npm MCP servers" },
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
          outcome: "DB record + program linkage — no manual entry (in prod at an EdTech client)",
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
    featured: {
      title: "Case: HubMarket",
      sub: "AI-SaaS for marketplace sellers · Founder + sole developer · production",
      stack: [
        "Next.js 16",
        "React 19",
        "Prisma 7",
        "PostgreSQL",
        "pg-boss",
        "Hono",
        "AI SDK",
        "Claude",
        "Gemini",
        "Groq",
        "Python · FastAPI",
        "Playwright",
        "Sentry · pino",
        "YooKassa",
      ],
    },
    cases: {
      title: "More cases",
      sub: "AI projects (RAG, LLM, agents, OCR pipelines) and heavy production: fintech, ERP, big-data analytics.",
      moreLink: "Full portfolio & background: /minasarkisyan",
      groupLabels: {
        all: "All",
        ai: "AI / LLM",
        production: "Production / High-load",
      },
      items: [
        { id: "case-hubmarket-stocksync", title: "Marketplace stock sync", sub: "HubMarket · 4-marketplace scraper + pg-boss pipeline · founder request to prod in 3 days", stack: ["Next.js", "Hono", "Playwright", "pg-boss"], group: "ai", link: "/en/cases/hubmarket-stocksync" },
        { id: "case-skolkovo", title: "OCR pipeline for applications", sub: "EdTech client · scan → Yandex OCR → Yandex GPT → structured DB record", stack: ["Laravel 12", "Yandex OCR", "Yandex GPT"], group: "ai" },
        { id: "case-landing", title: "AI landing generator", sub: "EdTech client · dual-provider text + image generation from a brief", stack: ["Vue 3", "GPT-4o-mini", "NanoBanano"], group: "ai" },
        { id: "case-mcp", title: "timeweb-mcp-server", sub: "Open-source MCP server: manage Timeweb infra from Claude Code, Cursor and other agents", stack: ["Node.js", "TypeScript", "MCP SDK"], openSource: { npmPkg: "timeweb-mcp-server", ghOwner: "webkoth", ghRepo: "timeweb-mcp-server" }, group: "ai" },
        { id: "case-mpstats", title: "1+ TB big-data analytics", sub: "MPSTATS · ClickHouse pipeline · −20% latency, +30% throughput", stack: ["Laravel", "ClickHouse", "Pandas"], group: "production" },
        { id: "case-lenderkit", title: "Lenderkit fintech", sub: "Justcoded · team-lead on a p2p-lending platform", stack: ["PHP 8", "Laravel", "PostgreSQL"], group: "production" },
        { id: "case-erp", title: "ERP for oil & gas", sub: "Itpelag · 500+ users · Oracle stack, Docker-based environment", stack: ["Laravel", "Oracle", "Docker"], group: "production" },
      ] as ReadonlyArray<{
        id: string;
        title: string;
        sub: string;
        stack: string[];
        group: "ai" | "production";
        link?: string;
        openSource?: { npmPkg: string; ghOwner: string; ghRepo: string };
      }>,
    },
    why: {
      title: "Why this works",
      items: [
        { title: "From idea to prod — no handoffs", body: "The same person works across all layers — front, back, AI, DevOps.", proofAnchor: "#featured" },
        { title: "Production-grade", body: "Multi-provider cascade, queues, observability, rollbacks.", proofAnchor: "#case-skolkovo" },
        { title: "AI stack is my core expertise", body: "7 published MCP servers on npm (including 3 for marketplaces).", proofHref: "https://www.npmjs.com/~webkoth" },
      ] as ReadonlyArray<{
        title: string;
        body: string;
        proofLabel?: string;
        proofAnchor?: string;
        proofHref?: string;
      }>,
    },
    techStack: {
      eyebrow: "STACK",
      title: "I work in your stack",
      sub: "No «let's rewrite to the new shiny thing». I adapt to your backend, frontend, AI provider, and infra.",
      diagramTitle: "Example architecture: multi-provider cascade",
      categories: [
        {
          name: "Backend",
          items: ["PHP / Laravel", "Node.js / Hono", "Python / FastAPI", "Go (touch)"],
        },
        {
          name: "Frontend",
          items: ["React / Next.js", "Vue 3 / Inertia", "TypeScript", "Tailwind", "shadcn/ui"],
        },
        {
          name: "AI providers",
          items: ["Anthropic Claude", "OpenAI", "Google Gemini", "Groq", "Yandex GPT", "self-hosted (Ollama / vLLM)"],
        },
        {
          name: "AI stack",
          items: ["Vercel AI SDK", "MCP", "pgvector", "structured output", "tool calling", "RAG"],
        },
        {
          name: "Databases & cache",
          items: ["PostgreSQL", "MySQL", "ClickHouse", "Redis", "MongoDB"],
        },
        {
          name: "Infra & ops",
          items: ["Docker", "Nginx", "Cloudflare", "Vercel", "Linux", "Sentry", "pg-boss / Horizon"],
        },
      ],
    },
    form: {
      title: "Project inquiry",
      altChannelsTop: "If shorter — book a 15-min Discovery:",
      progressLabel: "Completed",
      fields: {
        audience: "You are…",
        audienceOptions: {
          founder: "Founder / startup",
          smb: "Tech lead / CTO at SMB",
          agency: "Agency / studio",
          other: "Other",
        },
        name: "Name",
        contact: "Contact (Telegram or email)",
        package: "Which package?",
        packageOptions: {
          sprint: "AI-MVP Sprint (7 days)",
          integration: "Production AI Integration (2-4 weeks)",
          subcontract: "Subcontract / Whitelabel",
          auditOnly: "Audit only (1 day)",
          unsure: "Not sure — let's discuss",
        },
        message: "About the task",
        budget: "Budget (optional)",
        budgetOptions: {
          under200: "Under $2k",
          to600: "$2k – $6k",
          to12m: "$6k – $12k",
          over12m: "$12k+",
          usd: "RUB-equivalent",
          unknown: "Not defined",
        },
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
        { q: "What if my AI task doesn't fit one of the 3 Sprint templates?", a: "Then it's not a Sprint. On the free 15-min Discovery I'll say directly: either it fits with tweaks — we take Sprint, or it doesn't — we discuss Production AI Integration (2-4 weeks). I don't force incompatible scope to tick a box." },
        { q: "How are you different from an agency?", a: "Direct contact with the developer, zero overhead, no handoffs. The code you see is my code. Pricing doesn't include an account manager." },
        { q: "Whitelabel — how does it work in practice?", a: "By default: code is delivered to you, end client doesn't contact me, I don't mention the project publicly. Optionally by agreement: «AI engineer on team» mention publicly — changes publicity boundary, not the deal structure." },
        { q: "Which models do you use and why?", a: "Claude is primary for generation/agents. Gemini and Groq — fallback and cost optimization. Yandex GPT — for locale-bound projects. I justify the choice at the audit." },
        { q: "Can you use my infra / on-premise?", a: "Yes. Self-hosted LLM (Llama/Mistral via Ollama/vLLM), pgvector instead of managed vector DB, deployment on your servers. Locked in at the audit." },
        { q: "NDA and data security?", a: "NDA signed before audit. For sensitive data — multi-provider only via self-hosted/EU instances, prompt+response audit log." },
        { q: "Who owns the code after release?", a: "You — always. I hand over the source, docs, and access. I retain only the right to mention the project as a case — with your written consent. NDA before start." },
        { q: "How many parallel projects?", a: "Max 2 active. Support is not 'active' unless it requires ongoing development." },
        { q: "English level?", a: "Intermediate. Written — fine (incl. tech docs). Voice meetings in English — workable, but Russian is more efficient." },
        { q: "Research tasks vs implementation?", a: "I take it if the MVP boundary is definable. Pure R&D without a target metric — not for me." },
        { q: "What happens after the first free month of minimal support?", a: "Discussed individually by the time it ends: either I continue support on agreed terms, or you take it in-house or to another contractor. The handover doc contains everything needed for independent operation." },
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
      links: { cv: "CV", github: "GitHub", telegram: "Telegram", youtube: "YouTube" },
      copyright: "© 2026",
    },
  },
} as const;
