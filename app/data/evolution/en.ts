// English copy of the home page (`/en`). Mirrors `ru.ts` block for block; the
// structure is enforced by `EvolutionData`. Tone — first person («I»), same as RU.
// Case figures are the same anonymised git numbers; ₽ amounts stay in rubles —
// it is a Russian case.

import type { EvolutionData } from './types'

export const en: EvolutionData = {
  lang: 'en',
  brand: 'webkoth.com',

  meta: {
    title: 'Business evolution: from chaos to system, from routine to automation | Minas Sarkisyan',
    description:
      'I solve business problems once — with a system, not a hire. Transparent money, precise decisions, faster processes, freer resources. First step — an audit: a review of your prototypes and a process map.',
    ogTitle: 'Business evolution: from chaos to system, from routine to automation',
    ogDescription:
      'I solve business problems once — with a system, not a hire. Systems are built by the company’s own domain experts under engineering supervision.',
    twitterDescription: 'I solve business problems once — with a system, not a hire.',
    jsonLd: {
      name: 'Business evolution: from chaos to system, from routine to automation',
      serviceType: 'Audit and building of AI-powered business systems by the company’s own domain experts',
      description:
        'I solve business problems once — with a system, not a hire. First step — an audit: a review of existing prototypes and a process map.',
      area: 'Worldwide, remote',
    },
  },

  nav: { cta: 'Review my situation', stepsAria: 'Steps', palette: 'Palette', theme: 'Theme', font: 'Mono font' },
  labels: {
    step: 'Step',
    symptom: 'How it hurts today',
    caseTag: 'Case',
    readingProgress: 'Read',
    copy: 'Copy',
    copied: 'Copied',
    all: 'All',
    factHint: 'how it was counted',
  },

  hero: {
    line1: 'From chaos to system: transparent money, precise decisions.',
    line2: 'From routine to automation: faster processes, freer resources.',
    seal: 'Business evolution',
    sub: 'I solve business problems once — with a system, not a hire.',
    cta: 'Review my situation',
    scrollHint: 'This page is the work plan itself: six steps, in the order they happen',
    stackHint: 'hover a node to see what it does',
    stackNodes: {
      client: 'Users: browser, extension, Telegram — wherever requests come from.',
      frontend: 'Next.js: UI and server routes; changes ship the same day.',
      backend: 'Business logic and orchestration: queues, access, integrations.',
      api: 'External APIs: marketplaces, banks, payments — unstable, hence behind a queue with retries.',
      ai: 'AI router: picks the model for the task and budget, watches the limits.',
      ai1: 'Primary model (Claude): hard tasks, generation and document parsing.',
      ai2: 'Fallback (Gemini): kicks in on an error or rate limit of the primary.',
      ai3: 'Fast cheap lane (Groq): bulk simple requests and RAG over database data.',
      queue: 'Job queue on top of Postgres: nothing is lost, a failure means a retry.',
      worker: 'Workers: drain the queue, write results to the database.',
      db: 'Postgres: the single source of truth for every screen and report.',
    },
  },

  blocks: {
    system: {
      id: 'system',
      step: '01',
      slogan: 'From chaos to system',
      symptom:
        'Data is smeared across ten Google Sheets, Telegram DMs and people’s heads. When a key person leaves, access and context leave with them.',
      description: [
        'Order comes first — without it nothing else makes sense: automated chaos is just faster chaos.',
        'Scattered spreadsheets, chats and «someone knows» turn into one system with roles, permissions and a single source of truth.',
      ],
      caseLabel: 'Company IT-infrastructure inventory',
      caseBody:
        'The inventory lived in a legacy system and scattered notes. In one month a new system was built: data models, pages, roles and permissions. Production delivery pipeline — on launch day.',
      mainFact: { value: '1 month', label: 'from first commit to a working system', note: 'From the first commit in the repository to the day the system went into daily use.' },
      facts: [
        { value: '16', label: 'data models', note: 'Entities in the database schema: servers, services, access, owners and the links between them.' },
        { value: '23', label: 'pages', note: 'Application screens: lists, cards, forms, reports — counted by routes in code.' },
        { value: '432', label: 'commits', note: 'Commits on the main branch over one month, from git history.' },
        { value: '29,643', label: 'lines of code', note: 'Lines of TypeScript/TSX, excluding dependencies and generated code.' },
      ],
    },

    money: {
      id: 'money',
      step: '02',
      slogan: 'Transparent money',
      symptom:
        'Nobody knows today’s real account balances or net profit for sure. Payment requests get approved in chats, and the risk of a cash gap never goes away.',
      description: [
        'The first thing a system gives you is visibility of money. Cash flow, budget, payment requests with an approval route, reconciliation — not in ten files held by three people, but on one screen that adds up.',
      ],
      caseLabel: 'Management finance loop of a trading company',
      caseBody:
        'Built in a month: cash flow, budget vs actuals with variances, payment requests with an approval route, «Day summary», reconciliation, reference books. The market alternative — a custom-built system from 3–8M ₽ and 7–13 weeks for a single basic module.',
      mainFact: { value: '48', label: 'data models — and all of it adds up on one screen', note: 'Models in the schema: accounts, line items, payment requests, approval routes, reconciliation, reference books.' },
      facts: [
        { value: '40', label: 'pages', note: 'Screens: cash flow, budget, payment requests, daily summary, reconciliation, reference books and their cards.' },
        { value: '14', label: 'API routes', note: 'Server integration points: statement import, approvals, exports.' },
        { value: '19', label: 'test files', note: 'Automated tests on calculations and approval routes — that is what trust in the numbers rests on.' },
        { value: '3–8M ₽', label: 'market alternative', note: 'Custom-development benchmark for one basic finance module: 7–13 weeks and 3–8M ₽ by public contractor estimates.' },
      ],
    },

    decisions: {
      id: 'decisions',
      step: '03',
      slogan: 'Precise decisions',
      symptom:
        'Margins are estimated roughly or after the fact. Hidden marketplace fees and penalties quietly burn through net profit.',
      description: [
        'When data reconciles down to a single unit, decisions stop being a clash of opinions.',
        'Margin per marketplace account and per SKU is not a feeling but a number you can trust — because it is reconciled with the source.',
      ],
      caseLabel: 'Sales data warehouse + margin calculation',
      caseBody:
        'A sales data warehouse reconciled with the marketplace down to a single unit. On top of it — margin calculation per account with honest edge-case handling: cost lines never disappear, and the per-account view warns when something is missing.',
      mainFact: { value: 'to the unit', label: 'reconciliation with the marketplace matches', note: 'Every sales row is matched to the marketplace report by SKU and quantity — discrepancies are visible line by line.' },
      facts: [
        { value: '57', label: 'test files guarantee the numbers add up', note: 'Test files covering ingestion, reconciliation and margin calculation.' },
        { value: '53,618', label: 'lines in the data warehouse', note: 'Rows in the warehouse tables at the time of measurement.' },
      ],
    },

    automation: {
      id: 'automation',
      step: '04',
      slogan: 'From routine to automation',
      symptom:
        'Managers spend hours copying product cards, assembling labels and PDFs by hand. Human error and typos in SKUs cost penalties and returns.',
      description: [
        'Only what is ordered can be automated — that is why this step comes second, not first.',
        'Repetitive manual operations — cards, labels, documents, file conversion — go to the system entirely: what was done by hand every day starts happening by itself.',
      ],
      caseLabel: 'Product portal instead of an external PLM',
      caseBody:
        'Catalogue, label printing, PDF generation, image conversion. Built in days, production pipeline — on launch day. A detail that builds trust: the colour reference runs on the PowerShell built into Windows — used by people with no IT environment at all.',
      mainFact: { value: 'days', label: 'to replace an external PLM system', note: 'From the first commit to using the portal instead of the external PLM — a few days.' },
      facts: [
        { value: '1 day', label: 'to the production pipeline', note: 'The delivery pipeline — CI, auto-deploy, auto-rollback — was assembled on day one.' },
        { value: '0', label: 'dependencies for the colour reference: built-in PowerShell', note: 'The colour reference is a script on PowerShell built into Windows: nothing to install.' },
      ],
    },

    speed: {
      id: 'speed',
      step: '05',
      slogan: 'Faster processes',
      symptom:
        'Any IT change drags on for months. Contractors miss deadlines and inflate estimates, and the business loses its pace of testing hypotheses.',
      description: [
        'Speed is a consequence, not a slogan: it appears once the system sits on a pipeline.',
        'From idea to an application running in production — a day, not months. Changes reach users the same day, with automated checks and automatic rollback.',
      ],
      caseLabel: 'Project generator and delivery pipeline',
      caseBody:
        'One command scaffolds an application with a database, auth and roles, tests, CI and auto-deploy to two environments — with a smoke check and automatic rollback. The result over one month: seven applications, three of them in production on their very first day.',
      mainFact: { value: '1 day', label: 'from first commit to production', note: 'Of seven applications in a month, three reached production on the day of their first commit.' },
      facts: [
        { value: '7', label: 'applications in a month', note: 'Applications scaffolded by the generator within one calendar month.' },
        { value: '~217,000', label: 'lines of code', note: 'Total lines of code across seven repositories, excluding dependencies.' },
        { value: '1,808', label: 'commits', note: 'Total commits across seven repositories in a month.' },
      ],
    },

    resources: {
      id: 'resources',
      step: '06',
      slogan: 'Freer resources',
      symptom:
        'Growth runs into the scarcity and cost of developers. Payroll swells while tasks pile up in an endless backlog.',
      description: [
        'The main resource set free is people.',
        'Systems are built not by hired programmers but by the company’s own domain experts — a finance analyst, a product specialist, a content manager — under engineering supervision. Growth stops depending on hiring.',
      ],
      caseLabel: 'Three working systems, three domain experts',
      caseBody:
        'In three working systems, 43–73 % of changes are made not by programmers but by domain specialists. One of them went from a first commit with reference-book schemas to margin calculation in a single month.',
      mainFact: { value: '43–73 %', label: 'of changes are made by domain experts, not programmers', note: 'Share of commits by domain experts across three systems: 339 of 784, 67 of 92, 11 of 15.' },
      facts: [
        { value: '1 month', label: 'from reference-book schemas to margin calculation', note: 'One finance analyst’s path: first commit with reference-book schemas → working margin calculation.' },
        { value: '3', label: 'roles: finance analyst, product specialist, content manager', note: 'Three roles — three different systems; the domain part was done by no hired programmer.' },
      ],
    },
  },

  exhibits: {
    dataFlow: {
      nodes: ['Marketplace accounts', 'Data warehouse', 'Unit-level reconciliation', 'Margin per account'],
      note: '57 test files stand between the source and the report — a number in the report cannot silently diverge from the source.',
    },
    beforeAfter: {
      beforeTitle: 'Before: by hand, every day',
      before: [
        'Open the external PLM',
        'Find the product, copy its attributes',
        'Paste into the label template',
        'Convert the image to the right format',
        'Assemble the PDF, send to print',
      ],
      afterTitle: 'After: one button',
      after: 'Print label',
    },
    launchTable: {
      head: ['System', 'First commit', 'Prod pipeline ready', 'Gap'],
      rows: [
        ['Finance loop', '13 Jul', '14 Jul', '1 day'],
        ['IT-infrastructure inventory', '17 Jul', '17 Jul', 'same day'],
        ['Product portal', '23 Jul', '23 Jul', 'same day'],
      ],
    },
    shares: [
      { value: '43 %', role: 'finance analyst', detail: '339 of 784 commits' },
      { value: '73 %', role: 'product specialist', detail: '67 of 92 commits' },
      { value: '73 %', role: 'content manager', detail: '11 of 15 commits' },
    ],
  },

  hubmarket: {
    eyebrow: 'Named case',
    title: 'Case: HubMarket.ru',
    linkText: 'HubMarket.ru',
    url: 'https://hubmarket.ru',
    sub: 'AI SaaS for marketplace sellers',
    frame: [
      'My own product, which I run as founder and sole developer. Everything described in the six steps above — queues, an AI cascade with fallback, a data warehouse with reconciliation, a production pipeline from day one — runs here for external users.',
    ],
    hint: 'hover any node — a description appears',
    flowLabel: 'data flow',
    diagramAria: 'HubMarket architecture',
    nodes: {
      chrome: {
        label: 'Chrome MV3',
        sub: 'Seller extension',
        description: 'Chrome extension — snapshots data from marketplace dashboards.',
      },
      next: {
        label: 'Next.js 16',
        sub: 'App Router · API Routes · Prisma',
        badge: 'Monolith',
        description: 'Next.js 16 monolith: dashboard, billing, job orchestration.',
      },
      queue: {
        label: 'pg-boss',
        sub: 'Queues on top of Postgres',
        description: 'Job queues on top of Postgres — no separate infrastructure.',
      },
      parser: {
        label: 'hubmarket-parser',
        sub: 'Hono + Playwright',
        badge: 'Microservice',
        description: 'Scrapes 4 marketplaces where the API is unstable.',
      },
      docparser: {
        label: 'hubmarket-doc-parser',
        sub: 'FastAPI · self-employed tax',
        badge: 'Microservice',
        description: 'Parses Wildberries financial documents and calculates the self-employed tax.',
      },
      ai: {
        label: 'hubmarket-ai',
        sub: 'Hono · LLM cascade',
        badge: 'Microservice',
        description: 'Multi-provider cascade with automatic LLM fallback.',
      },
      bronze: {
        label: 'Bronze lake',
        sub: 'raw JSON',
        description: 'Raw JSON from marketplaces — append-only, nothing is lost.',
      },
      silver: {
        label: 'Silver lake',
        sub: 'Prisma tables',
        description: 'Normalised Prisma tables — the source for analytics and AI.',
      },
      telegram: {
        label: 'Telegram bot',
        sub: 'Alerts · AI replies',
        description: 'Alerts, AI replies to reviews, daily revenue digests.',
      },
    },
    stack: [
      'Next.js 16',
      'React 19',
      'Prisma 7',
      'PostgreSQL',
      'pg-boss',
      'Hono',
      'AI SDK',
      'Claude',
      'Gemini',
      'Groq',
      'Python · FastAPI',
      'Playwright',
      'Sentry · pino',
      'YooKassa',
    ],
    screenshotsTitle: 'Product interface',
    screenshots: [
      {
        src: '/images/hubmarket-dashboard-summary.png',
        alt: 'HubMarket — summary: revenue, profit, business health',
        caption: 'Summary: revenue, profit, business health',
      },
      {
        src: '/images/hubmarket-unit-economics.png',
        alt: 'HubMarket — unit economics per SKU',
        caption: 'Unit economics per SKU',
      },
      {
        src: '/images/hubmarket-reviews-ai-replies.png',
        alt: 'HubMarket — reviews with AI-drafted replies',
        caption: 'Reviews: AI-drafted replies',
      },
      {
        src: '/images/hubmarket-seasonality-forecast.png',
        alt: 'HubMarket — seasonality and demand forecast',
        caption: 'Seasonality: demand forecast',
      },
    ],
  },

  roadmap: {
    eyebrow: 'How it happens',
    title: 'From idea to production',
    sub: 'The page above is the work plan. Here is how it gets executed.',
    steps: [
      {
        num: '01',
        title: 'Review',
        body: 'Three questions: what you have already tried with AI and what of it works; who you plan to hire and why you haven’t yet; who in the company understands the painful process best. If the scheme doesn’t fit you — I’ll say so right away.',
        pill: 'free · 30–45 min',
      },
      {
        num: '02',
        title: 'Audit and map',
        body: 'A review of the prototype graveyard: what works, who owns it, on what data, what breaks. A process map: what goes into an application, what to an agent, what to a person with AI, what not to touch at all. Choosing the first process and measuring the baseline. Some prototypes get fixed in hours — quick wins already during the audit.',
        pill: '2–3 weeks · a document with a map and priorities',
      },
      {
        num: '03',
        title: 'Launching the first process',
        body: 'The pipeline is set up on day one: project generator, CI, two delivery environments, auto-check and auto-rollback. Your domain expert builds the domain part with Claude Code within strict stack boundaries; I take it to production: data, exceptions, failures, monitoring, access. The system owner stays inside the company.',
        pill: '4–6 weeks · a working application + a trained employee',
      },
      {
        num: '04',
        title: 'Support',
        body: 'Reviewing the changes your specialists make, shipping to production, the next processes. The only path to production is through review — so the system doesn’t fall apart when non-programmers grow it.',
        pill: 'ongoing · growth without hiring',
      },
    ],
  },

  finale: {
    step: '07',
    slogan: 'This is what business evolution is',
    description: [
      'An honest line to set me apart: the path did not work the first time. Of four attempts at one task, three were stopped — and I know exactly why the fourth one lives: methodology, not technology.',
      'That is why I sell not «AI adoption» but getting to the result.',
    ],
    manifesto:
      'You already have AI. It just doesn’t work. I know what separates an attempt that will die from one that will run.',
    graveyard: {
      title: 'Four attempts at one task',
      head: ['Attempt', 'Period', 'Commits', 'Outcome'],
      rows: [
        ['#1', '29 May – 5 Jun', '67', 'stopped'],
        ['#2', '19 Jun – 9 Jul', '48', 'stopped'],
        ['#3', '9 Jul – 25 Jul', '53', 'stopped'],
        ['#4', '13 Jul – 14 Aug', '784', 'running and growing'],
      ],
      note: 'In attempt #2 most changes were already made by domain experts — and the project still stopped. The difference between it and the fourth: strict stack boundaries, mandatory design before code, a single path to production through review, and a delivery pipeline from day one.',
    },
    form: {
      label: 'Request',
      title: 'Review my situation',
      sub: 'The first step is a free diagnostic review (30–45 min) of your current processes and prototypes.',
      takeawaysTitle: 'What you get from the review:',
      takeaways: [
        'A map of bottlenecks and hidden losses in your current processes and spreadsheets.',
        'An audit: why previous attempts to roll out software or AI stalled.',
        'A step-by-step plan: how to digitise a key loop in one month with your own team.',
      ],
      telegramCta: 'Message me directly on Telegram',
      orBelow: 'or leave your contact in the form below:',
      fields: {
        name: 'Name',
        contact: 'Telegram, email or phone',
        answer: 'What is the main process or finance problem you want to solve? What have you already tried?',
      },
      placeholders: {
        name: 'Jane',
        contact: '@jane',
        answer: 'E.g.: margin per SKU doesn’t reconcile with the marketplace; we tried writing bots, nobody uses them…',
      },
      errors: {
        name_min: 'At least 2 characters',
        contact_min: 'Telegram, email or phone',
        answer_min: 'A couple of words is enough — even «nothing»',
        no_newline: 'No line breaks',
      },
      rateLimited: {
        before:
          'Too many submissions from your address. The limit is temporary, but retrying now is pointless — message me on ',
        link: 'Telegram',
        after: ', I will answer there.',
      },
      failed: { before: 'Could not send. Try again or message me on ', link: 'Telegram', after: '.' },
      toast: {
        success: 'Request received',
        successBody: 'I will reply within a day to agree on a time for the review.',
        action: 'Message on Telegram',
        error: 'Could not send',
        errorBody: 'Try again or message me on Telegram.',
        rateLimited: 'Too many submissions',
        rateLimitedBody: 'Retrying now is pointless — message me on Telegram.',
      },
      submit: 'Book a review',
      submitting: 'Sending…',
      success: {
        title: 'Request received',
        body: 'I will get in touch within a day to agree on a convenient time for the review. If you need it faster —',
        link: 'Telegram',
      },
    },
  },

  animations: {
    fragments: { aria: 'Scattered spreadsheets, messages and files line up into the layout of a single application' },
    fog: {
      aria: 'Blurred scattered reports merge into one sharp cash-flow screen with a reconciliation row where the numbers match',
      title: 'Cash flow',
      subtitle: 'today · all accounts',
      // Illustrative figures, not real client data.
      kpi: [
        { label: 'Inflows', value: '4 812 300' },
        { label: 'Outflows', value: '3 106 450' },
        { label: 'Balance', value: '1 705 850' },
      ],
      recon: 'Reconciliation',
      bank: 'bank',
      ledger: 'ledger',
    },
    noise: { aria: 'A cloud of noisy points through which a trend line with decision markers emerges' },
    conveyor: {
      aria: 'Conveyor: task cards that used to be moved by hand one at a time now travel on their own and stack into finished labels, PDFs and product cards',
      routine: 'routine',
      outputs: ['label', 'PDF', 'card'],
    },
    timeline: {
      aria: 'Timeline: a 7–13-week line compresses into a one-day segment; a stream of commits turns into deploy checkmarks',
      market: 'Custom development · basic module',
      weeks: '7–13 weeks',
      here: 'Here · from first commit to production',
      day: '1 day',
      stack: 'db · roles · tests · CI · two environments',
      commits: 'Changes ship the same day: auto-check, auto-deploy, auto-rollback',
      flow: 'commit → check → production',
    },
    cells: {
      aria: 'A grid of operations: most cells switch to «auto» mode, and the people from them move to the growth cells',
      growth: 'growth',
      legendSystem: 'done by the system',
      legendPeople: 'stays with people — and moves to growth',
    },
    sprouts: {
      aria: 'Four sprouts: three wilt, the fourth grows into a tree with six branches — system, money, decisions, automation, speed, resources',
      attempt: '#',
      branches: ['system', 'money', 'decisions', 'automation', 'speed', 'resources'],
    },
  },

  footer: { owner: 'Minas Sarkisyan', cv: 'CV', llms: 'llms.txt' },
}
