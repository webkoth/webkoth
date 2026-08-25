// English texts of the cases - mirror of `ru.ts`, same structure and same numbers.
// Client systems stay anonymised: no client name, no employee names, no revenue.
// Roles only: finance analyst, product specialist, content manager, warehouse operator.

import type { CaseKind, CaseStatus } from './types'
import type { CasesCopy } from './registry'

/** Kind and status labels live per locale, not per system: both are derived from `meta`. */
export const kindLabels: Record<CaseKind, string> = {
  internal: 'Internal system',
  product: 'Own product',
  oss: 'Open source',
}

export const statusLabels: Record<CaseStatus, string> = {
  production: 'In production',
  pilot: 'Pilot',
}

export const en: CasesCopy = {
  // ── finance-loop ──
  'finance-loop': {
    title: 'Management finance loop',
    angles: {
      system: {
        headline: 'Every number the company has - in one system',
        pain: 'The numbers lived in ten spreadsheets, private chats and the heads of three people. When key people left, both access and context left with them.',
        outcome: 'One source: cash flow, budget, payment requests, reconciliation and reference books in a single application with roles and permissions.',
        chips: [
          { icon: 'time', label: 'Timeline', value: 'one month' },
          { icon: 'replaced', label: 'Replaced', value: 'ten spreadsheets and a chat thread' },
          { icon: 'coverage', label: 'Coverage', value: 'cash flow, budget, requests, reconciliation' },
        ],
      },
      money: {
        headline: 'Money becomes visible: balance, profit, cash gap',
        pain: 'Nobody knew today’s real account balance or net profit for sure. Payment requests were approved in chats, and the risk of a cash gap never went away.',
        outcome: 'Cash flow, budget and reconciliation on one screen, payment requests travel an approval route, and the numbers on that screen add up.',
        chips: [
          {
            icon: 'money',
            label: 'Market alternative',
            value: '3–8M ₽',
            note: 'Custom-development benchmark for one basic finance module: 7–13 weeks and 3–8M ₽ by public contractor estimates. This is a market benchmark, not my price.',
          },
          { icon: 'trust', label: 'Verified against', value: 'the bank statement' },
        ],
      },
      speed: {
        headline: 'A report in half an hour instead of weeks',
        pain: 'Management reporting was assembled by hand over weeks: exports, merging, double-checking.',
        outcome: 'The report comes together in half an hour, data pulls itself in, and budget variances are visible immediately.',
        chips: [
          { icon: 'time', label: 'Before → after', value: 'weeks → half an hour' },
          { icon: 'auto', label: 'Data collection', value: 'pulls itself in' },
        ],
      },
      resources: {
        headline: 'A finance analyst develops it, not a programmer',
        pain: 'Every change ran into hiring and a queue to the developer: growth depended on whether a person could be found.',
        outcome: 'The finance analyst extends the system directly; the engineer owns review and the release to production.',
        chips: [
          { icon: 'people', label: 'Maintained by', value: 'a finance analyst' },
          { icon: 'time', label: 'Specialist’s path', value: 'one month to margin calculation' },
        ],
        bar: {
          filled: 339,
          total: 784,
          caption: '43 % of changes are made by a company specialist, not a programmer',
        },
      },
    },
    detail: {
      lead: 'The management finance loop of a trading company: cash flow, budget with variances, payment requests on an approval route, «Day summary», reconciliation and reference books. Built in one month by the company’s finance analyst and one engineer.',
      effects: [
        { block: 'system', text: 'Pulled every financial number into one source with roles and permissions' },
        { block: 'money', text: 'Balance, profit and reconciliation are visible on one screen' },
        { block: 'speed', text: 'Reporting comes together in half an hour instead of weeks' },
        { block: 'resources', text: 'The finance analyst develops the system: 43 % of the changes are theirs' },
      ],
      value: [
        'The real account balance is visible at any moment, not after exports are merged.',
        'A payment request travels an approval route instead of getting lost in a chat.',
        'Budget variances show up the moment they appear.',
        'Growing the system no longer depends on hiring a developer.',
      ],
      diagramNodes: ['Bank statements', 'Cash-flow and budget reference books', 'Finance loop', 'Requests and approvals', 'Reporting and «Day summary»'],
      diagramNote: 'Automated tests on calculations and approval routes stand between input and report: a number in the report cannot silently diverge from its source.',
      how: [
        'The production delivery pipeline was ready the day after the first commit: CI, tests and deployment to two environments existed before the domain part did.',
        'The domain part is run by the finance analyst through Claude Code within a strict stack; code reaches production only through engineering review.',
      ],
      owner: 'The company’s finance analyst. The engineer owns review, data, failures and the release to production.',
      facts: [
        { label: 'Timeline', value: 'one month to a working system' },
        { label: 'Maintained by', value: 'a finance analyst' },
        { label: 'Replaced', value: 'ten spreadsheets and a chat thread' },
      ],
      screenshots: [],
      metaTitle: 'Case: a management finance loop built in a month | Minas Sarkisyan',
      metaDescription:
        'Cash flow, budget, payment requests with approvals and reconciliation in one system. Built in a month; 43 % of the changes are made by a finance analyst.',
    },
  },

  // ── data-platform ──
  'data-platform': {
    title: 'Data platform',
    angles: {
      system: {
        headline: 'One source of truth instead of everyone’s own report',
        pain: 'Every department exported marketplace data its own way, so meetings started with an argument about whose spreadsheet was right. Last year’s history did not exist at all.',
        outcome: 'The platform collects data on a schedule and takes it through layers up to ready-made data marts. From there everyone - people, applications and agents - takes the numbers from the same marts.',
        chips: [
          { icon: 'scale', label: 'Collection', value: '33 data domains', note: 'A domain is a separate marketplace entity: orders, sales, stock, supplies, deductions, advertising, reviews and so on. Each is collected on a schedule, each with its own pagination strategy.' },
          { icon: 'coverage', label: 'Coverage', value: '4 doors out', note: 'BI and direct SQL, a REST API for applications, Claude Code, MCP tools for AI agents. Each door has its own database role, all of them read-only.' },
          { icon: 'replaced', label: 'Replaced', value: 'manual exports in every department' },
        ],
      },
      money: {
        headline: 'Marketplace payouts and fees reconcile to the kopeck',
        pain: 'Fees, logistics, storage and penalties are only visible in the marketplace’s own reports. There was nothing to check them against, so margin was taken on faith.',
        outcome: 'A dedicated data mart compares our weekly totals with the totals the marketplace itself calculated. An empty result means everything matches; a row with a difference shows exactly where it does not.',
        chips: [
          { icon: 'trust', label: 'Verified against', value: 'buyouts and returns - to the kopeck', note: 'Buyouts, returns and the payable amount were checked against the marketplace response for a full day: an exact match on every figure.' },
          { icon: 'auto', label: 'Reconciliation', value: 'runs itself, every week' },
        ],
      },
      decisions: {
        headline: 'The number is verified against the source down to a single unit',
        pain: 'Data went through four processing layers and nobody compared the result with what the marketplace shows. Decisions rested on a number with nothing to check it against.',
        outcome: 'Orders, cancellations and stock reconcile with the marketplace down to a single unit, money down to the kopeck, and the check can be repeated any day with one command.',
        chips: [
          { icon: 'trust', label: 'Verified against', value: 'the marketplace, unit by unit', note: 'Orders, cancellations and warehouse stock were checked against a direct marketplace response for a full day - an exact match, not «within tolerance».' },
          { icon: 'coverage', label: 'Data marts', value: 'sales, stock, presence, P&L, reconciliation' },
        ],
      },
    },
    detail: {
      lead: 'The data platform of a trading company: scheduled collection from marketplace accounts, an archive of every response before parsing, raw → staging → core layers and data marts facing outward. This is not «a sales warehouse for margin calculation» but a foundation: the same marts feed dashboards, applications and AI agents.',
      effects: [
        { block: 'system', text: 'Pulled marketplace data into one source everyone counts from' },
        { block: 'money', text: 'Payouts, fees and deductions reconcile with marketplace totals weekly' },
        { block: 'decisions', text: 'The number in a mart is verified against the source down to a single unit' },
      ],
      value: [
        'History is kept forever, even though the marketplace only stores 90 days of it.',
        'Everyone’s reports agree, because they come from the same marts rather than personal exports.',
        'A gap against marketplace payouts shows up within the week, not at the end of the quarter.',
        'A cost line never goes missing quietly: the per-account view warns that the data is incomplete instead of completing the margin on its own.',
        'A new application or AI agent connects to ready-made marts instead of writing its own data collection.',
      ],
      diagramNodes: ['Marketplace APIs', 'Raw archive', 'raw → staging → core', 'Data marts', 'BI · REST API · Claude · MCP agents'],
      diagramNote: 'Every marketplace response goes into the archive before parsing: if a field is parsed wrong, we re-read the archive instead of begging the marketplace for history again. It keeps 90 days; our archive keeps everything.',
      how: [
        'The layers are separated deliberately: raw is an «as it arrived» journal, the next layer removes duplicates, then business entities, and only then data marts. Counting on raw is wrong, so raw is closed by permissions rather than by agreement.',
        'The response format is validated on the way in: a new marketplace field does not break collection, while a disappeared one raises a Telegram alert - and the load still does not stop.',
        'Automatic reconciliation appeared after a real miss: one logistics field was read from a key the current API no longer has and was silently zero - margin was overstated by the entire delivery cost. The error survived unnoticed precisely because the system was only ever checked against itself.',
        'Four doors lead outward and all four are read-only: writing is blocked both by permissions and by the database mode. An AI agent gets a set of tools with a row limit and a timeout, not raw access.',
      ],
      owner: 'The engineer. The company’s analysts and applications are connected read-only, each with its own account.',
      facts: [
        { label: 'Collection', value: '33 domains on a schedule' },
        { label: 'Doors out', value: 'BI and SQL, REST API, Claude Code, MCP' },
        { label: 'Verified against', value: 'the marketplace, to the unit and the kopeck' },
        { label: 'Archive', value: 'raw responses stored before parsing' },
      ],
      screenshots: [],
      metaTitle: 'Case: a data platform verified down to a single unit | Minas Sarkisyan',
      metaDescription:
        'Scheduled marketplace collection, a raw archive kept before parsing, data marts and four doors out. Numbers verified against the source to the unit.',
    },
  },

  // ── product-portal ──
  'product-portal': {
    title: 'Product portal',
    angles: {
      automation: {
        headline: 'Catalogue, labels and PDFs - one button',
        pain: 'Every label was assembled by hand, in five steps through the external PLM. A typo in an SKU turned into a penalty and a return.',
        outcome: 'The product catalogue, label printing, PDF generation and image conversion live in one portal. Five manual steps collapsed into a single «Print label» button.',
        chips: [
          { icon: 'auto', label: 'Label printing', value: 'one button instead of five steps' },
          { icon: 'coverage', label: 'Coverage', value: 'catalogue, labels, PDFs, conversion' },
          { icon: 'replaced', label: 'Replaced', value: 'an external PLM system' },
        ],
      },
      speed: {
        headline: 'An external PLM replaced in days',
        pain: 'Product data lived in someone else’s system: nothing in it could be changed, and any modification meant months of waiting.',
        outcome: 'An in-house portal replaced the external PLM in a few days of work. The production delivery pipeline was ready on the day of the first commit, so changes reach people the same day.',
        chips: [
          { icon: 'time', label: 'Timeline', value: 'days to replace an external PLM', note: 'Four active working days from the first commit to the portal that replaced the external PLM.' },
          { icon: 'auto', label: 'Delivery pipeline', value: 'ready on the day of the first commit' },
          { icon: 'replaced', label: 'Replaced', value: 'an external PLM system' },
        ],
      },
      resources: {
        headline: 'A product specialist runs it: 73 % of changes are theirs',
        pain: 'A fix in product data had to be ordered: from the PLM vendor as a paid modification, internally as a ticket to a developer. Either way it meant a queue.',
        outcome: 'The portal is run by the product specialist - the person who fills in the product cards every day. The engineer owns review and the release to production, not the next card attribute.',
        chips: [
          { icon: 'people', label: 'Maintained by', value: 'a product specialist' },
          { icon: 'time', label: 'Specialist’s path', value: 'days to a working portal' },
        ],
        bar: {
          filled: 67,
          total: 92,
          caption: '73 % of changes are made by the product specialist',
        },
      },
    },
    detail: {
      lead: 'A product portal instead of an external PLM system: product catalogue, label printing, PDF generation and image conversion. Built in a few days with the production pipeline ready on day one; 73 % of changes are made by the company’s product specialist.',
      effects: [
        { block: 'automation', text: 'Five manual steps to a label collapsed into one button' },
        { block: 'speed', text: 'The external PLM was replaced in days; changes now ship the same day' },
        { block: 'resources', text: 'The product specialist runs the portal: 73 % of changes are theirs' },
      ],
      value: [
        'Product data belongs to the company, not to the vendor of someone else’s system.',
        'A label is printed by a button, so there is nowhere for an SKU typo to come from.',
        'A missing attribute or export format is added by the person who needs it, not by a queue to a developer.',
        'The colour reference runs on the PowerShell built into Windows - used by people with no IT environment at all.',
      ],
      diagramNodes: ['Product card', 'Portal catalogue', 'Label template', 'Image conversion', 'PDF and printing'],
      diagramNote: 'Attributes come from the catalogue rather than being carried over by hand: the label and the PDF are assembled from the same card the product specialist maintains.',
      beforeAfter: {
        before: [
          'Open the external PLM',
          'Find the product, copy its attributes',
          'Paste into the label template',
          'Convert the image to the right format',
          'Assemble the PDF, send to print',
        ],
        after: 'Print label',
      },
      how: [
        'Database, auth with roles, tests and auto-deploy to two environments existed on the day of the first commit: the delivery pipeline was assembled before the domain part rather than bolted on after it.',
        'The domain part - catalogue, label templates, export formats - is run by the product specialist through Claude Code; code reaches production only through engineering review.',
      ],
      owner: 'The company’s product specialist. The engineer owns review and the release to production.',
      facts: [
        { label: 'Timeline', value: 'days to replace an external PLM' },
        { label: 'Maintained by', value: 'a product specialist' },
        { label: 'Replaced', value: 'an external PLM system' },
      ],
      screenshots: [],
      metaTitle: 'Case: a product portal replacing an external PLM in days | Minas Sarkisyan',
      metaDescription:
        'Catalogue, label printing, PDF generation and image conversion in one portal. An external PLM replaced in days; 73 % of changes are the product specialist’s.',
    },
  },

  // ── project-generator ──
  'project-generator': {
    title: 'Starter application template',
    angles: {
      speed: {
        headline: 'From the first commit to a production pipeline - one day',
        pain: 'Between «the first screen is written» and «people can use this» there are usually weeks of setup, and it is assembled again on every project.',
        outcome: 'One command scaffolds not an empty skeleton but a configured workspace: stack, database, auth with roles, tests, CI and two environments with automatic production rollback.',
        chips: [
          { icon: 'time', label: 'Timeline', value: 'one day to a production pipeline' },
          { icon: 'coverage', label: 'In the box', value: 'database, auth with roles, tests, CI, two environments' },
        ],
        bar: {
          filled: 2,
          total: 3,
          caption: 'two of the three systems - on the day of the first commit',
        },
      },
      resources: {
        headline: 'Seven applications in a month with one team',
        pain: 'Every new project started with a week of setup, and only an engineer could do it. The queue to that engineer was the real ceiling on speed.',
        outcome: 'Setup stopped being the bottleneck: the order those three production systems were built in is folded into a single command. In that same month one team launched seven applications.',
        chips: [
          { icon: 'scale', label: 'Launched', value: 'seven applications in a month', note: 'Seven repositories one team worked in over a single calendar month, counted by the dates of their first commits. Three of them run in production on this stack, and the template was extracted from two of those.' },
          { icon: 'people', label: 'Maintained by', value: 'an engineer and company specialists' },
          { icon: 'auto', label: 'Workspace', value: 'skills and commands for daily work' },
        ],
      },
    },
    detail: {
      lead: 'A starter application template: one command and there is a project with a database, login-and-password auth, roles and permissions, tests, CI and auto-deploy to two environments. It is not an invented ideal: the template was extracted from systems already running in production, and what it packages is not an idea but an order of work - the delivery pipeline is assembled before the domain part.',
      effects: [
        { block: 'speed', text: 'The production delivery pipeline is ready on the day of the first commit - the order proven on three systems' },
        { block: 'resources', text: 'The order proven on three systems is folded into a single command; in that same month one team launched seven applications' },
      ],
      value: [
        'The «and how do we ship this» question is answered before the first page is written.',
        'Every application is released the same way, so one engineer can fix them all instead of one person per project.',
        'A bad production release rolls itself back - on a smoke check, not on a user’s phone call.',
        'The stack rules arrive with the project, so a company specialist works inside boundaries instead of inventing their own.',
      ],
      diagramNodes: ['One command', 'Project with a stack and a database', 'Auth, roles and permissions', 'Tests and CI', 'Dev and production with auto-rollback'],
      diagramNote: 'Checks stand between the development branch and production: formatting, linting, types, unit tests and a smoke test on login. Production only updates through review, and a bad release rolls itself back.',
      how: [
        'It is more than a generator - it is a configured workspace. The stack rules, skills and six everyday commands arrive with the project: /ship (release), /status (environment health), /logs (logs), /reset-dev (sandbox reset), /request-prod (a production request) and /onboarding (bringing a new person in).',
        'The template was extracted from two systems already running in production rather than built as a «reference for the future»: when their approach changes, the template follows.',
        'The two environments are separate on purpose: the sandbox updates from the development branch, production only through review, with a smoke check and automatic rollback.',
      ],
      owner: 'Me. The template follows the systems it was extracted from.',
      facts: [
        { label: 'Timeline', value: 'one day to a production pipeline' },
        { label: 'Maintained by', value: 'an engineer' },
        { label: 'Replaced', value: 'a week of setup on every project' },
      ],
      screenshots: [],
      metaTitle: 'Case: a starter template with a production pipeline in a day | Minas Sarkisyan',
      metaDescription:
        'One command scaffolds a project with a database, auth with roles, tests, CI and auto-deploy to two environments. Extracted from systems already in production.',
    },
  },

  // ── ads-agents ──
  'ads-agents': {
    title: 'Advertising management agents',
    angles: {
      decisions: {
        headline: 'Bids move on data: the DRR plan is ≤ 10 %',
        pain: 'Bids were moved on yesterday’s report and on a hunch. But «yesterday» does not show what actually happened, and a market-wide drop is easily mistaken for your own mistake.',
        outcome: 'A decision is assembled in order: market regime, product health, the fair target DRR for this item, and only then the bid itself. Metrics come from a matured window; the DRR plan is ≤ 10 %.',
        chips: [
          {
            icon: 'money',
            label: 'DRR',
            value: 'plan ≤ 10 %',
            note: 'Share of advertising spend in revenue. This is the planned threshold the agents decide against, not an achieved result.',
          },
          { icon: 'coverage', label: 'Decision order', value: 'market regime → product health → target DRR → bid' },
          {
            icon: 'trust',
            label: 'Metrics window',
            value: 'matured, not «yesterday»',
            note: 'Marketplace statistics keep filling in for 5–7 days, so metrics are counted on a window that ends 4–5 days ago.',
          },
        ],
      },
      automation: {
        headline: 'The operator’s daily cycle runs itself',
        pain: 'The morning started with a manual round of the accounts: spend, DRR, campaigns spending without orders, bids in a spreadsheet. It ate half a day.',
        outcome: 'Calibration, the scanner and bid proposals run overnight; in the morning one command gives the operator the whole summary. The agents themselves never write into the account: a human confirms first.',
        chips: [
          { icon: 'auto', label: 'Overnight cycle', value: 'calibration, scanner, bid proposals' },
          {
            icon: 'scale',
            label: 'Operator commands',
            value: '11 agents, from the digest to bids',
            note: 'Eleven Claude Code commands: the orchestrator, market regime, morning digest, campaign check, product health, bid calculator, auto-pause, two-stage bids and three supporting ones.',
          },
          {
            icon: 'trust',
            label: 'Write into the account',
            value: 'two contours, different rules',
            note: 'There are two contours. Changes from the operator’s agents reach the account only after a human confirms them. The scheduled contour has no confirmation step at all, so it is bounded differently: auto-apply is seeded as «propose only», an unattended run outside the permitted window is hard-blocked, and a daily spend kill-switch shuts the contour down.',
          },
        ],
      },
    },
    detail: {
      lead: 'Managing a trading company’s own advertising on a marketplace: an analytics portal, a service that executes decisions and eleven operator agents in Claude Code. The system calculates and prepares proposals overnight and the operator works through them in the morning. Changes from the agents reach the account only after a human confirms them; auto-pause and scheduled auto-apply are a separate contour, with time windows, a daily spend kill-switch and auto mode off by default.',
      effects: [
        { block: 'decisions', text: 'A bid moves along a decision tree rather than on yesterday’s report' },
        { block: 'automation', text: 'The overnight calculation and the morning summary run themselves; the decision stays with the human' },
      ],
      value: [
        'A market-wide drop is told apart from your own mistake: the market regime is established before any bid is touched.',
        'Metrics are counted on a matured window, so decisions are not made on statistics that have not filled in yet.',
        'Campaigns spending without orders are found by the system, not by a human eye at the end of the week.',
        'A bid from an agent never reaches the account bypassing a person, and the automatic contour is bounded another way: permitted windows, a daily spend kill-switch and «propose only» as the default mode.',
      ],
      diagramNodes: ['Marketplace and stock data', 'Scheduled overnight calculation', 'Decision tree', 'Queue of proposals', 'Operator confirmation or a schedule window → the account'],
      diagramNote: 'A fresh marketplace response is fetched before a bid is written: the database lags behind the account, and a decision on a stale row is a bid in the wrong place.',
      beforeAfter: {
        before: [
          'Collect yesterday’s spend across accounts',
          'Calculate DRR for every campaign',
          'Find campaigns spending without orders',
          'Sketch bids in a spreadsheet',
          'Type the changes into the account by hand',
        ],
        after: 'A morning summary from one command',
      },
      how: [
        'The order of the modules was chosen after a real collapse in orders: the marketplace’s own signals move sales harder than our bids do, and aggressive edits during a crisis only deepen the spiral. So the first step is the market regime, and in a crisis regime raises and new campaign launches are forbidden.',
        'Duplicate statistics batches are cut off on the way in: without that, spend was overstated several times over and the whole decision tree counted on an invented number.',
        'Some brands are declared untouchable: the agents change no bids, no pauses and no negative keywords on them. The filter is hard-wired into the pause and recommendation scripts, but not into the bid-apply path - there the rule rests on the operating procedure and the agent’s prompt. The repository’s own audit says so rather than papering over it.',
        'Reading agents and writing ones are separated on purpose: the digest, the campaign check and the bid calculator never write to the account at all, and the writing commands are not on the allowed list, so the system’s confirmation prompt always comes up before them. The overnight contour is built differently: there is no human beside it, and instead of a confirmation it is held by permitted windows, a daily spend kill-switch and auto mode being off by default.',
      ],
      owner: 'The engineer owns the engines and the agents. The decision belongs to the advertising operator: the system proposes, the human confirms.',
      facts: [
        { label: 'Rhythm', value: 'overnight calculation, morning review' },
        { label: 'Maintained by', value: 'an advertising operator' },
        { label: 'Replaced', value: 'a manual round of the accounts every morning' },
      ],
      screenshots: [],
      metaTitle: 'Case: agents running marketplace advertising | Minas Sarkisyan',
      metaDescription:
        'An overnight calculation and a decision tree from market regime to bid, eleven operator agents. The DRR plan is ≤ 10 %; agent changes need a confirmation.',
    },
  },

  // ── store-to-claude ──
  'store-to-claude': {
    title: 'Marketplace stores in Claude',
    angles: {
      decisions: {
        headline: 'An answer about the store - in words, without a dashboard',
        pain: 'To understand what is happening in a store, a seller walks three marketplace accounts and merges reports in a spreadsheet. A dashboard answers only what was built into it.',
        outcome: 'The seller asks in plain words - «what is running out», «is the advertising paying off», «how much will land on my account» - and Claude goes into the marketplace API with their key.',
        chips: [
          {
            icon: 'coverage',
            label: 'Coverage',
            value: '3 marketplaces, 48 tools',
            note: 'Wildberries, Ozon and Yandex Market. 39 ready-made tools cover prices, stock, turnover, orders, payouts, advertising, reviews and ratings; three more per marketplace are the API catalogue: find a method, inspect its parameters, call it.',
          },
          {
            icon: 'trust',
            label: 'Marketplace keys',
            value: 'encrypted, one marketplace’s key opens no other',
            note: 'Store keys are stored in the database encrypted, and the encryption key lives in the process environment. Each marketplace has its own connector, and ownership of a store is checked on every call.',
          },
          { icon: 'auto', label: 'Tabular report', value: 'downloaded for you and read as rows' },
        ],
        bar: {
          filled: 945,
          total: 962,
          caption: 'measured in August 2026: 945 of 962 operations callable through the API catalogue',
        },
      },
      automation: {
        headline: 'Routine checks close with a question in chat',
        pain: 'The daily checks - what is running out, what is blocked, what arrived in payouts - mean walking three accounts by hand. Nobody does that every day, and problems surface late.',
        outcome: 'A check turns into a question in chat: Claude calls the marketplace methods it needs and answers to the point. A writing call does not go out first time: a preview first, the send on a second call.',
        chips: [
          { icon: 'auto', label: 'Daily check', value: 'a question in chat instead of a round of accounts' },
          {
            icon: 'trust',
            label: 'A writing call',
            value: 'never goes out first time: a preview comes first',
            note: 'The tool rejects a writing call that carries no explicit confirmation flag and returns a preview of what would be sent. Sending happens only on the second call.',
          },
          {
            icon: 'coverage',
            label: 'A read-only key',
            value: 'on Wildberries the marketplace rejects writes itself',
            note: 'A Wildberries key carries a «read only» box: with it the marketplace rejects writing methods on its own side, the catalogue keeps 187 reading methods out of 286, and the ready-made reading tools work in full. On the other marketplaces key permissions are arranged differently, and there it is the preview step rather than the key that stands in the way of a write.',
          },
        ],
      },
    },
    detail: {
      lead: 'An own product: the service connects a seller’s marketplace stores to Claude as a connector. 48 tools across three marketplaces, an API catalogue on top of the specifications, marketplace keys encrypted in the database, and a writing call that takes two steps: a preview first, then the send.',
      effects: [
        { block: 'decisions', text: 'A question about the store is closed by an answer in words, not by merging reports' },
        { block: 'automation', text: 'The daily round of three accounts collapses into one question in chat' },
      ],
      value: [
        'The answer is assembled from the marketplace API right now, not from an export a week old.',
        'You can ask what no dashboard holds: the API catalogue opens almost any method of the specification.',
        'One marketplace’s key opens no other marketplace’s stores - checked on every call, not declared.',
        'Even with full access to the database, other people’s keys cannot be extracted: they are stored encrypted.',
      ],
      diagramNodes: ['A question in plain words', 'The marketplace connector', 'Tools and the API catalogue', 'Marketplace API with the seller’s key', 'An answer as rows, not a file'],
      diagramNote: 'Each marketplace has its own connector with its own address and access key. A writing call does not go out first time: the tool returns a preview, and the send happens only on a second call.',
      how: [
        'The API catalogue is built from snapshots of the marketplace specifications, so almost any method is available to Claude: find it by words, inspect its parameters, call it.',
        'Before every release, watchdogs compare the methods the service calls from code against the specification snapshots: if a method is marked deprecated or has disappeared, the release stops. The rule appeared after a method turned out to be deleted after the code for it was written - three times in a row: the tests went into a mock, the mock answered in the shape of a dead endpoint, and everything was green.',
        'The marketplace hands tabular reports over as files; the service downloads them and shows them as rows: the first two hundred as text, up to five thousand in a structured answer, the rest by paging.',
      ],
      owner: 'Me. This is an own product rather than a client system: the key stays under the seller’s control - held in the database encrypted and revocable by them at any moment - and access to the service is granted by an invite code.',
      facts: [
        { label: 'Coverage', value: '3 marketplaces, 48 tools' },
        { label: 'Keys', value: 'encrypted in the database' },
        { label: 'Replaced', value: 'walking the accounts and merging reports' },
      ],
      screenshots: [],
      metaTitle: 'Case: marketplace stores connected to Claude over MCP | Minas Sarkisyan',
      metaDescription:
        'A seller’s stores on three marketplaces in Claude: 48 tools, an API catalogue covering almost any method, encrypted keys and a preview before every write.',
    },
  },

  // ── it-inventory ──
  'it-inventory': {
    title: 'IT infrastructure inventory',
    angles: {
      system: {
        headline: 'Services, access and owners - in one place',
        pain: 'The inventory lived in a legacy panel and scattered notes: who is connected to what, what runs where, who owns it. When a person left, access and context left with them.',
        outcome: 'One panel: a service tree, the «who has access to what» matrix, keys and portals, tasks, problems, changes and an audit log. Login under your own account, sections visible by role.',
        chips: [
          {
            icon: 'coverage',
            label: 'Sections',
            value: 'seven sections',
            note: 'A tree of services and servers, the «who has access to what» matrix, SSH keys and portals, tasks, problems, changes and the audit log.',
          },
          {
            icon: 'time',
            label: 'Timeline',
            value: '11 days to a working system',
            note: 'From the first commit on 17 July to delivery into production on 28 July - 11 days; the system holds 16 data models and 23 pages. The production delivery pipeline came together on the day of the first commit: CI and both deployment environments appeared 2 hours 13 minutes after it.',
          },
          { icon: 'replaced', label: 'Replaced', value: 'a legacy panel of 35 tabs' },
        ],
      },
    },
    detail: {
      lead: 'An internal IT infrastructure panel: a tree of services and servers, an access matrix, SSH keys and portals, tasks, problems, changes and an audit log. It replaced a legacy panel of 35 tabs; from the first commit to delivery into production took 11 days, and the system holds 16 data models and 23 pages.',
      effects: [{ block: 'system', text: 'Services, access and owners are gathered into one source with roles and an audit log' }],
      value: [
        'A person leaving no longer takes access and context with them: it is visible who is connected to what and who owns it.',
        'The question «what do we switch off when someone leaves» is answered by the access matrix, not by a round of the administrators.',
        'Every change of permissions stays in the audit log, so «who granted this» is a question with an answer.',
        'Only the logic was carried over from the legacy panel: the screens were built anew, and the old interface was not dragged along.',
      ],
      diagramNodes: ['Servers and services', 'People and roles', 'Access grants', 'Keys and portals', 'Tasks, problems, audit'],
      diagramNote: 'The service tree is curated by hand, while facts from the collector are laid over it as a separate layer: the gap between «what is declared» and «what is actually there» stays visible instead of being silently overwritten.',
      how: [
        'The destructive operations of the panel - importing employees and importing facts - go into a separate database in tests, and without its address the tests simply refuse to run. The rule appeared after a run against the working database: it switched off every real person at once, and the people lists in tasks went empty.',
        'The delivery pipeline came together first: CI and deployment to both the sandbox and production appeared a little over two hours after the first commit, and auth with roles and tests the same day. The «how do we ship this» question was closed before the domain part existed.',
      ],
      owner: 'The engineer. The panel is run by the company’s IT team: tasks, problems and changes are entered by the people who work with them.',
      facts: [
        { label: 'Timeline', value: '11 days to a working system' },
        { label: 'Maintained by', value: 'the company’s IT team' },
        { label: 'Replaced', value: 'a legacy panel of 35 tabs' },
      ],
      screenshots: [],
      metaTitle: 'Case: an IT infrastructure inventory built in 11 days | Minas Sarkisyan',
      metaDescription:
        'A service tree, access, keys, tasks, problems and an audit log in one panel with roles. In production in 11 days, replacing a legacy panel of 35 tabs.',
    },
  },

  // ── legacy-db-map ──
  'legacy-db-map': {
    title: 'Map of the legacy warehouse',
    angles: {
      system: {
        headline: 'What sits in the legacy database is now known',
        pain: 'The legacy warehouse arrived as a black box: several databases, hundreds of tables and views, an OLAP cube, no description at all. Every question started with excavation.',
        outcome: 'A reusable client, a CLI for queries and a data map rebuilt by one command: databases, tables, views, columns, with a map of the cube beside it. Plus a check that the data can be trusted.',
        chips: [
          {
            icon: 'coverage',
            label: 'Map coverage',
            value: '5 databases, ~427 tables and 329 views',
            note: 'An auto-generated map of the SQL layer. Next to it is a map of the OLAP cube: 102 tables and 429 measures with their formulas, relations and lineage.',
          },
          { icon: 'auto', label: 'Updating', value: 'the map is rebuilt by one command' },
          { icon: 'trust', label: 'Data check', value: 'cube freshness and cube-against-SQL reconciliation' },
        ],
      },
    },
    detail: {
      lead: 'Tooling for a trading company’s legacy warehouse: a reusable client, a CLI for SQL and for the OLAP cube, auto-generated data maps and a check of how trustworthy the data is. The repository is deliberately local: the maps hold internal addresses and the full schema, and they do not leave.',
      effects: [{ block: 'system', text: 'The legacy warehouse stopped being a black box: the data now has a map and a check' }],
      value: [
        'A question about the data starts with the map instead of digging through the database.',
        'The traps are written down next to the data: where cost is also stamped on logistics rows, where a price sits in the document’s currency and a broken rate overstates it a hundredfold.',
        'The trustworthiness check returns an exit code, so «the data can be trusted» is a run, not an opinion.',
        'The maps are rebuilt by a command and do not go stale behind the schema.',
      ],
      diagramNodes: ['Legacy databases and the cube', 'Client and CLI', 'Auto-generated maps', 'Trustworthiness check', 'Calculations and reports'],
      diagramNote: 'The maps are assembled from the database itself rather than written by hand: when the schema changes, the same command rebuilds the map and the difference shows up in the git diff.',
      how: [
        'There is one reusable client: both the CLI and the calculation scripts reach the database through it, so credentials and response parsing do not scatter across copies.',
        'The findings are written up as separate documents: where the business-logic layer turned out to have bugs, how the load schedule is arranged and how it fails, where cost comes from and in which of the eight chains it is understated.',
        'Outliers in the data are handled rather than ignored: a suspicious currency rate in a document is replaced with the nearest sane one, otherwise a single row from the accounting system overstates the calculation by an order of magnitude.',
      ],
      owner: 'The engineer. The repository stays local with no public remote: the map contains internal addresses and the full schema.',
      facts: [
        { label: 'Coverage', value: '5 databases, ~427 tables and 329 views' },
        { label: 'Maintained by', value: 'an engineer' },
        { label: 'Replaced', value: 'digging through the database and one person’s memory' },
      ],
      screenshots: [],
      metaTitle: 'Case: mapping a legacy data warehouse | Minas Sarkisyan',
      metaDescription:
        'A client, a CLI for SQL and the OLAP cube, an auto-generated map of 5 databases, ~427 tables and 329 views. The legacy warehouse is no longer a black box.',
    },
  },

  // ── payout-documents ──
  'payout-documents': {
    title: 'Marketplace payout documents',
    angles: {
      money: {
        headline: 'You can see what will arrive and what goes to tax',
        pain: 'The marketplace hands financial documents over as a pile of files. To work out the year’s income and the tax on it, a seller opens them one by one and adds them up.',
        outcome: 'The service fetches a year of documents itself, parses PDFs and spreadsheets, lays amounts out by month and calculates the tax: 4 % from individuals, 6 % from companies.',
        chips: [
          {
            icon: 'money',
            label: 'Tax',
            value: '4 % and 6 %, by type of buyer',
            note: 'The Russian self-employment tax: 4 % on receipts from individuals, 6 % on receipts from companies. Counted month by month and for the year as a whole.',
          },
          { icon: 'trust', label: 'Regime limit', value: '2.4M ₽ a year, the remainder in plain sight' },
          { icon: 'auto', label: 'Fetching documents', value: 'pulled from the account by the service' },
        ],
      },
    },
    detail: {
      lead: 'A microservice of my own platform for marketplace sellers: it fetches a year of the marketplace’s financial documents, parses weekly reports in PDF and buyout notifications in spreadsheets, adds income up by month and calculates the self-employment tax.',
      effects: [{ block: 'money', text: 'The year’s income and tax are assembled from marketplace documents rather than from a calculator' }],
      value: [
        'The question «how much will arrive and how much goes to tax» is answered from the marketplace’s own source documents.',
        'Income is laid out by month, so it is visible not only what the total is but how it built up.',
        'The remainder of the annual limit is visible in advance, not at the moment the limit is already exceeded.',
        'A parsing error on one document does not sink the calculation: it lands in a list of errors next to the result.',
      ],
      diagramNodes: ['A year of marketplace documents', 'Parsing PDFs and spreadsheets', 'Amounts by month', 'Tax at 4 % and 6 %', 'Remainder of the limit'],
      diagramNote: 'Downloading runs with a pause between files and a retry when the marketplace refuses on its request limit: a year’s pile arrives whole instead of breaking off halfway.',
      how: [
        'The calculation is arranged as a background task: the start returns a task id, the stage and progress are visible from there, and the result is fetched by a separate request - a year of documents does not run into a timeout.',
        'Documents are split by category: weekly reports go into income from individuals, buyout notifications into income from companies, and the tax rate is chosen by that split.',
      ],
      owner: 'Me. Part of my own platform for marketplace sellers, not a client system.',
      facts: [
        { label: 'What it parses', value: 'reports in PDF and notifications in spreadsheets' },
        { label: 'Maintained by', value: 'an engineer' },
        { label: 'Replaced', value: 'adding documents up by hand in a calculator' },
      ],
      screenshots: [],
      metaTitle: 'Case: parsing marketplace payout documents and the tax on them | Minas Sarkisyan',
      metaDescription:
        'The service fetches a year of marketplace financial documents, parses PDFs and spreadsheets, calculates tax at 4 % and 6 % and shows the annual limit left.',
    },
  },

  // ── marketplace-knowledge ──
  'marketplace-knowledge': {
    title: 'Marketplace knowledge base for agents',
    angles: {
      decisions: {
        headline: 'The agent answers by the marketplaces’ rules, not from memory',
        pain: 'When an AI agent designs logic against a marketplace’s rules, it leans on memory. Tariffs and limits change, memory does not, and errors surface in money, not at review.',
        outcome: 'A knowledge base of three marketplaces sits next to the project as ordinary markdown files: one per API method plus the seller help. The agent reads the source, not a retelling.',
        chips: [
          {
            icon: 'scale',
            label: 'The base',
            value: '1,628 files across three marketplaces',
            note: 'Wildberries, Ozon and Yandex Market: 931 files on API methods, 695 seller help articles and legal documents. Every file header carries the marketplace, the type, a link to the source and the date it changed.',
          },
          {
            icon: 'trust',
            label: 'The build',
            value: 'no model involved: texts are carried over verbatim',
            note: 'There is not a single LLM step in the build pipeline: tariffs and legal texts must not be distorted, and the diffs have to be reproducible.',
          },
          { icon: 'auto', label: 'Updating', value: 'one command, the git diff as the change report' },
        ],
      },
    },
    detail: {
      lead: 'An open knowledge base of three marketplaces for AI agents: a tree of markdown files in git, one file per API method plus the seller help articles. Not a service: the agent reads the files directly while designing an application’s business logic.',
      effects: [{ block: 'decisions', text: 'A marketplace rule is taken from the source, with a link and a date, rather than from a model’s memory' }],
      value: [
        'A decision about application logic rests on the text of the rule, not on a retelling of it.',
        'After an update, the git diff shows exactly what the marketplace changed in its rules.',
        'The pipeline is deterministic, so a repeated build with nothing changed produces an empty diff.',
        'It plugs into a project as a neighbouring folder: no service, no index and no vector database to stand up.',
      ],
      diagramNodes: ['Marketplace specifications and help', 'Deterministic build', 'Markdown with a link to the source', 'Indexes for the agent', 'The git diff as a report'],
      diagramNote: 'A file is rewritten only when its content has changed, so the diff after an update is a list of real changes in the marketplace’s rules rather than noise from dates.',
      how: [
        'The original idea - a vector database, embeddings, a reranker and a web service - was dropped during review: an agent with a well-structured corpus does fine with file search and reading, and determinism matters more here than recall.',
        'API documents are built from the specifications rather than scraped: two of the marketplaces’ portals are closed off by bot protection at the connection level, so the sources are an official repository and specification mirrors.',
        'Help is taken from a curated list of sections - commissions, tariffs, penalties, returns, fulfilment schemes, card requirements - and tables are kept as tables. One marketplace’s help is behind bot protection entirely, so it is covered by API method descriptions alone; that is written down in the decisions rather than papered over.',
      ],
      owner: 'Me. Open source, refreshed by one command from a working machine.',
      facts: [
        { label: 'Size', value: '1,628 files across three marketplaces' },
        { label: 'Maintained by', value: 'an engineer' },
        { label: 'Replaced', value: 'an agent guessing at the marketplace’s rules' },
      ],
      screenshots: [],
      metaTitle: 'Case: a marketplace knowledge base for AI agents | Minas Sarkisyan',
      metaDescription:
        'An open markdown base of three marketplaces’ rules: 1,628 files linked to their sources, a deterministic build with no LLM, the git diff as the report.',
    },
  },

  // ── stock-sync ──
  'stock-sync': {
    title: 'Warehouse stock sync',
    angles: {
      automation: {
        headline: 'Warehouse stock reaches the store on its own',
        pain: 'Warehouse stock and the online store’s catalogue lived apart: a buyer saw availability the warehouse no longer had, and fixing it meant doing it by hand, item by item.',
        outcome: 'A run takes fresh warehouse stock and brings the store catalogue in line with it. The state is recalculated in full, so discrepancies never accumulate, and only the items that changed are written.',
        chips: [
          { icon: 'scale', label: 'Catalogue', value: '~22,000 products' },
          { icon: 'auto', label: 'The run', value: 'a full recalculation, one command' },
          {
            icon: 'trust',
            label: 'Circuit breaker',
            value: 'a suspicious share of zeroings halts the write',
            note: 'A broken or truncated warehouse feed would zero stock wholesale. If the share of changes or zeroings is too large, the write stops until a human looks at it.',
          },
        ],
      },
    },
    detail: {
      lead: 'A one-way sync: the fulfilment warehouse is the source of truth, the online store only receives stock. A full run across a catalogue of about 22,000 products, and stock only: prices, orders and product cards are left alone.',
      effects: [{ block: 'automation', text: 'Reconciling warehouse stock with the store catalogue left human hands' }],
      value: [
        'A buyer sees the availability the warehouse actually has, not what was left in the catalogue last week.',
        'Every run reads both sides afresh, so a missed day does not turn into an accumulated discrepancy.',
        'Only changed items are written: there are no needless writes into a live store.',
        'Items with no counterpart are shown separately - that is a question for the business, not a silent sync error.',
      ],
      diagramNodes: ['Warehouse feeds', 'Store catalogue', 'Comparison and delta', 'Circuit breaker', 'Writing the stock'],
      diagramNote: 'Without an explicit flag the run only shows the plan and writes nothing. A real write is a deliberate step, and on a suspicious share of changes the circuit breaker stops it until someone looks.',
      how: [
        'Barcodes are written differently on the two sides: fourteen digits with a leading zero in the store, thirteen without it in the feeds. Matching is done on strings with the zero stripped, and that is what makes them meet: without stripping, about 13 % of the catalogue matched, with it about 95 %.',
        'Stock from the two legal entities is added up per barcode; if an item is in neither feed its stock goes to zero - the feed is authoritative.',
        'The physical quantity from the warehouse is what gets written, while the reserve held by orders is the store’s own count - the sync does not touch it.',
        'A truncated feed never goes into work: the file is checked for completeness. An item the store rejects is pulled out of the batch and the rest are re-sent, and on a rate-limit refusal the run waits and retries.',
      ],
      owner: 'The company’s content manager. The warehouse operator is left with the run log: intervention is needed when the circuit breaker fires or the tokens expire.',
      facts: [
        { label: 'Rhythm', value: 'a full run, started on a schedule or by command' },
        { label: 'Direction', value: 'warehouse → store, stock only' },
        { label: 'Replaced', value: 'editing stock by hand, item by item' },
      ],
      screenshots: [],
      metaTitle: 'Case: stock sync between warehouse and store | Minas Sarkisyan',
      metaDescription:
        'Fulfilment warehouse stock reaches the online store on its own: a full run across ~22,000 products, with a circuit breaker that stops wholesale zeroing.',
    },
  },

  // ── deploy-from-chat ──
  'deploy-from-chat': {
    title: 'Deploy from chat',
    angles: {
      speed: {
        headline: 'A release without manual SSH, straight from chat',
        pain: 'Between «the code is ready» and «people are using it» sits manual fiddling: SSH, a server, a web server, a certificate, a DNS record. Every time from scratch and from memory.',
        outcome: 'The plugin and the MCP server give Claude Code direct access to the cloud: a server, a database, DNS, a certificate and the release itself are done by a command in chat.',
        chips: [
          { icon: 'time', label: 'A release', value: 'a command in chat instead of manual SSH' },
          {
            icon: 'coverage',
            label: 'In the plugin',
            value: '12 commands, 5 agents, 3 skills',
            note: 'Commands - setup, a readiness check, release, logs, health, rollback, servers, SSH keys, DNS, certificates. Agents - for Node.js, Python, PHP and static sites, plus a validator. Skills - database, web server, certificates.',
          },
          { icon: 'auto', label: 'Infrastructure', value: 'server, database, DNS, certificate - by a tool call' },
        ],
      },
    },
    detail: {
      lead: 'Open source: a plugin for Claude Code and an MCP server for a cloud provider. Servers, database clusters, object storage, domains and DNS, SSH keys and the application release itself - by a tool call from chat, with no manual SSH. The package is published on npm, and the plugin installs from the plugin marketplace.',
      effects: [{ block: 'speed', text: 'The path from finished code to a working address shrank to a command in chat' }],
      value: [
        'The «how do we ship this» question is settled where the code was written - in the same chat.',
        'Infrastructure is created by a tool call, so the steps are neither forgotten nor done from memory.',
        'A readiness check runs before the release, health and logs after it, and a bad release is rolled back by a command.',
        'It is open source and a public package: anyone can plug it in, not only me.',
      ],
      diagramNodes: ['A command in chat', 'An agent for the project’s stack', 'MCP to the cloud', 'Server, database, DNS, certificate', 'Release, logs, rollback'],
      diagramNote: 'The provider token lives in the environment and never reaches the chat: the tool calls the API itself, and Claude only sees the result of the call.',
      how: [
        'The tools cover servers, database clusters, Kubernetes, object storage, domains and DNS, SSH keys, floating addresses, pricing and the account balance: the provider’s API in full, not a slice cut for one scenario.',
        'The agents are split by stack - Node.js and Next.js, Python, PHP, static - and a separate agent checks that the release can go through at all before anything changes on the server.',
        'The MCP server runs through npx and takes its token from the environment, while the plugin installs from the Claude Code plugin marketplace with one command.',
      ],
      owner: 'Me. Open source under the MIT licence, with the package published on npm.',
      facts: [
        { label: 'How it installs', value: 'the plugin from the marketplace, the server through npx' },
        { label: 'Maintained by', value: 'an engineer' },
        { label: 'Replaced', value: 'manual SSH and server setup from memory' },
      ],
      screenshots: [],
      metaTitle: 'Case: releasing an application from chat, without manual SSH | Minas Sarkisyan',
      metaDescription:
        'A Claude Code plugin and an MCP server for the cloud: server, database, DNS, certificate and release by a tool call from chat. Twelve commands, five agents.',
    },
  },

  // ── seller-workspace ──
  'seller-workspace': {
    title: 'Seller workspace',
    angles: {
      resources: {
        headline: 'A seller runs sales without hiring an analyst',
        pain: 'Going through sales, unit economics, the funnel, card SEO, ABC analysis, competitors - that is a job for a separate person. A small store has nothing to hire them with.',
        outcome: 'An open template: one clone per store, keys in the environment, connectors to three marketplaces and seven commands for those questions. Intended so; how far it replaces an analyst I have not measured.',
        chips: [
          { icon: 'coverage', label: 'Commands', value: 'report, unit economics, funnel, SEO, ABC, competitors' },
          {
            icon: 'people',
            label: 'Model',
            value: 'one clone - one store',
            note: 'The purpose of the template rather than a measured result: how much analyst work it takes off is known from store owners’ own words, and I have no measurement of it.',
          },
          { icon: 'trust', label: 'Changing a price', value: '«before → after» first, confirmation after' },
        ],
      },
    },
    detail: {
      lead: 'An open Claude Code workspace template for a marketplace seller: connectors to three marketplaces, seven ready commands - from the weekly report to ABC analysis - and a knowledge base inside the repository itself. One clone, one store.',
      effects: [{ block: 'resources', text: 'The questions people hire an analyst for are packaged as commands of the template' }],
      value: [
        'The report, unit economics, the funnel, an SEO audit, ABC and competitors are called by a command instead of being assembled from scratch each time.',
        'The store keys stay with the owner: they live in the environment of their clone, not in someone else’s service.',
        'Critical operations require confirmation and, without it, only show a «before → after» preview.',
        'Improvements go back into the template rather than staying inside one store’s clone.',
      ],
      diagramNodes: ['A clone per store', 'Marketplace keys in the environment', 'Connectors to three marketplaces', 'Commands and knowledge base', 'An answer in chat'],
      diagramNote: 'Changing a price or stock, or replying to a review, only shows a preview without an explicit confirmation: a live store does not change on a careless phrasing.',
      how: [
        'The usage model is one clone per store: keys, logs and caches are not versioned, while improvements come back into the shared template as a separate change.',
        'The phrase «without hiring an analyst» is the purpose of the template and an assessment from store owners’ own words. I have no measurement of how much work it takes off, so for now it is an intent rather than a result.',
      ],
      owner: 'Me. Open source; the store is run by its owner inside their own clone.',
      facts: [
        { label: 'Commands', value: 'seven, from the report to ABC analysis' },
        { label: 'Maintained by', value: 'the store owner' },
        { label: 'Replaced', value: 'collecting reports across the accounts by hand' },
      ],
      screenshots: [],
      metaTitle: 'Case: a workspace for a marketplace seller | Minas Sarkisyan',
      metaDescription:
        'An open Claude Code template for a seller: connectors to three marketplaces, seven commands from the weekly report to ABC analysis, keys stay with the owner.',
    },
  },

  // ── agents-platform ──
  'agents-platform': {
    title: 'The company’s agent platform',
    angles: {
      automation: {
        headline: 'Routine is ordered on a form, not filed as a developer’s task',
        pain: 'Repetitive manual work settled in chat threads: someone asked for it to be automated, the request got lost between people, and nobody saw the next team asking for the same.',
        outcome: 'An employee files a request on a form, in the language of their own work. An agent is one file with a prompt and no code of its own, and requests are visible to all, so identical asks stop drifting apart.',
        chips: [
          {
            icon: 'auto',
            label: 'A new agent',
            value: 'a file with a prompt and no code',
            note: 'An agent is a file: settings in the header, the prompt in the body. It runs through the core’s shared loop - call the model, run a tool, take the next step - so no code is written for a particular agent at all.',
          },
          {
            icon: 'trust',
            label: 'The audit gate',
            value: 'held by the database, not the interface',
            note: 'A request cannot be taken into work until three questions about it are answered and a verdict is set: an agent, a script, split it, or decline. The rule is a constraint on the requests table, so it cannot be walked around outside the application.',
          },
          {
            icon: 'coverage',
            label: 'What agents may do',
            value: 'read and notify; writing is forbidden',
            note: 'Every tool in the registry carries its own access mode. Agents are allowed to read and to send messages only; a config asking for write access is rejected by the loader - until there is a queue where a human confirms.',
          },
        ],
      },
    },
    detail: {
      lead: 'The agent platform of a company trading on marketplaces: a core with one shared agent loop, a tool registry with access modes, a dashboard over the database and a request flow with a mandatory audit. A new agent here is a file with a prompt, not a new service.',
      effects: [{ block: 'automation', text: 'An employee’s routine becomes an agent through a request rather than through the queue to a developer' }],
      value: [
        'The request is written by the person it hurts, in the language of their work, not in the terms of a developer’s ticket.',
        'Requests are visible to every employee: someone else’s request shows what is already being automated, and that removes duplicates.',
        'The audit is mandatory, so some asks are honestly closed by a script or split up instead of becoming an agent for the sake of it.',
        'A new agent needs neither its own service nor code written for it - only a file and a release.',
        'An agent cannot change data in an account: reading and notifications are all it has.',
      ],
      diagramNodes: ['An employee’s request', 'Audit and verdict', 'The agent file with its prompt', 'The tool registry', 'Scheduled runs and the log'],
      diagramNote: 'Runs and model calls are written to the database, and the dashboard reads it directly: spend, model routing and task status live on the same screens instead of three separate consoles.',
      how: [
        'There are two levels of execution. The everyday «watch X, count Y, report to Z» is a file with a prompt; heavy data processing stays a pipeline in code. To the schedule and the dashboard the two are indistinguishable: one run log and one model-call log.',
        'A broken agent file fails the core on start-up deliberately: falling over at release beats silently losing an agent from the schedule.',
        'A tool error does not kill the agent: the model receives the error text and decides what to do next, while an oversized response is not truncated but returned as an error that forbids drawing conclusions from it: out of a broken fragment the model would compute a total and report a plausible wrong number as a success.',
        'Having the model draft a config from the request was dropped on purpose: a request should be nothing more than a record in the database, visible to all. The implementation is still in the repository history and can be brought back if the decision changes.',
      ],
      owner: 'An engineer. Agents are written by the IT team; employees order them on a form and use the results.',
      facts: [
        { label: 'On the schedule', value: 'one agent' },
        { label: 'Maintained by', value: 'the company’s IT team' },
        { label: 'Replaced', value: 'asking for automation in chat threads' },
      ],
      screenshots: [],
      metaTitle: 'Case: a company’s agent platform | Minas Sarkisyan',
      metaDescription:
        'An employee orders automation on a form; the agent is a file with a prompt. The audit gate is held by the database, and agents may only read and notify.',
    },
  },

  // ── frontend-factory ──
  'frontend-factory': {
    title: 'Frontend factory',
    angles: {
      speed: {
        headline: 'A screen is assembled from ready blocks, not drawn from scratch',
        pain: 'Every new screen started from nothing: its own components, colours and spacing. A block that worked did not travel to the next project - it was nailed to its own theme.',
        outcome: 'A library of authored sections and template pages on top of stock shadcn components. A block transfers as a file: data arrives through props and the colour comes from the receiving app’s theme.',
        chips: [
          {
            icon: 'scale',
            label: 'In the kit',
            value: '143 blocks and 76 template pages',
            note: 'Blocks are authored sections across ten areas, from the storefront and dashboards to billing and ops. Template pages wire them together and own their data. All of it stands on 60 stock shadcn components that are never edited.',
          },
          {
            icon: 'trust',
            label: 'Portability',
            value: 'checked on every build',
            note: 'Blocks and pages may use semantic theme tokens only. Raw palette classes, hex colours and literal oklch() are forbidden and fail the check - that is exactly what lets a block repaint itself into the receiving app’s theme.',
          },
          {
            icon: 'auto',
            label: 'A project’s foundation',
            value: 'one command, a byte-identical config',
            note: 'One command with the kit’s own preset reproduces its foundation: the style, the base colour, the theme, the icons and the radius scale. The resulting config is byte-identical to the kit’s, so the components and primitives of the new project line up with the blocks.',
          },
        ],
      },
    },
    detail: {
      lead: 'A personal frontend kit: the full set of stock shadcn components, an authored library of blocks and template pages on top of it, and a gallery to preview all of it. The kit sits on disk next to the project rather than being installed from a remote registry.',
      effects: [{ block: 'speed', text: 'A new screen is assembled from ready blocks instead of being built from scratch on every project' }],
      value: [
        'A block transfers by copying a file: it drags along neither fixtures nor a foreign theme.',
        'Stock components are never edited, so an update from the official registry stays a safe operation rather than turning into conflict resolution.',
        'The theme is the parameter and the structure is the product: the same block looks its own way in every application.',
        'A new project’s foundation is reproduced by one command instead of being assembled from memory.',
        'Two other systems have already taken the theme and the layer model from here: this is a kit already in use, not an ideal for the future.',
      ],
      diagramNodes: ['A description of the screen', 'The nearest reference page', 'Blocks and stock components', 'The token check', 'The screen in the project'],
      diagramNote: 'A description of a screen is first matched to the nearest of some two hundred reference pages and only then assembled from blocks: that way the screen has a model to follow rather than only an idea of one.',
      how: [
        'The layers are kept strictly apart: stock components are never customized, authored blocks take data through props only and never import fixtures, and template pages own their data. Customization is blocks and pages, never an edit to the stock layer.',
        'Token discipline is not a matter of taste but the condition of portability: a block with a raw colour inside stays foreign in someone else’s theme. So the ban is enforced by a separate command over blocks and pages, while the stock layer is exempt.',
        'The primitives here are Base UI, not Radix, and a separate warning says so: examples from training data are almost always Radix. A button rendered as a link without the right flag only complains in a live browser - neither types nor the linter will catch it.',
        'The kit is not installed from a remote registry: it lies on disk nearby, and Claude Code reads the block source and carries it into the project by the recipe - reinstalling the stock components on the receiving side. What is published as an open registry is something else - this site’s theme and components: the showcase behind the link shows them live, while a machine reads them at /r/registry.json.',
      ],
      owner: 'Me. The kit repository is private; what is open is this site’s showcase of the theme and the components - it carries the install command too.',
      facts: [
        { label: 'In the kit', value: '143 blocks, 76 template pages' },
        { label: 'Maintained by', value: 'an engineer' },
        { label: 'Replaced', value: 'building every screen from scratch' },
      ],
      screenshots: [],
      metaTitle: 'Case: a frontend factory for assembling screens | Minas Sarkisyan',
      metaDescription:
        '143 authored blocks and 76 template pages on top of stock shadcn components. A block transfers as a file and repaints itself into the target project’s theme.',
    },
  },

  // ── content-factory ──
  'content-factory': {
    title: 'Content factory',
    angles: {
      resources: {
        headline: 'A video from script to subtitles - without contractors',
        pain: 'Video means a scriptwriter, a motion designer, an editor and someone to lay the text out across platforms. For one author that is a contract per video, or no videos at all.',
        outcome: 'A workshop in a repository: commands write the script in blocks, overlays and diagrams are built in code, and a local Whisper does the transcription. Filming, editing and publishing stay with the human.',
        chips: [
          {
            icon: 'coverage',
            label: 'In the workshop',
            value: '7 commands and 3 video skills',
            note: 'The commands cover a script draft and its review, finding a topic, research, taking a site apart, and laying the texts out per platform. The main-flow skills cover Remotion production, motion design and writing composition scripts. Four image-generation skills sit alongside them but are not part of the main flow right now.',
          },
          {
            icon: 'scale',
            label: 'The graphics library',
            value: '110 Remotion compositions',
            note: 'Sources for overlays, cards, thumbnails and titles; most have a horizontal and a vertical variant, 234 entries in the registry in total. Heavy renders are not kept in the repository - only the sources are.',
          },
          {
            icon: 'auto',
            label: 'Subtitles',
            value: 'a local Whisper, no keys and no billing',
            note: 'Transcription runs through a local Whisper command, then Remotion draws the captions and ffmpeg composites them. No external recognition service is wired in at all.',
          },
        ],
        bar: {
          filled: 9,
          total: 11,
          caption: 'nine videos taken through to publication, two still in progress',
        },
      },
    },
    detail: {
      lead: 'My video workshop: a repository holding the scripts, the Remotion graphics sources, the diagrams and the platform rules. Claude Code writes the script and assembles the materials, filming and editing stay with the human, and publishing is done by hand.',
      effects: [{ block: 'resources', text: 'The work of a scriptwriter, a motion designer and a social media manager is gathered into one repository with commands' }],
      value: [
        'A video does not hinge on a contractor: script, graphics and subtitles are put together on the spot.',
        'Graphics are reused: branded overlays are rendered once and laid over any footage.',
        'Transcription runs locally, so subtitles cost neither a per-minute fee nor an API key.',
        'A command prepares the texts per platform, but a human posts them - there is no auto-posting at all.',
      ],
      diagramNodes: ['A description of the video', 'A script in blocks', 'Overlays, diagrams, slides', 'Filming and editing', 'Subtitles and platform texts'],
      diagramNote: 'The script marks every block with its recording mode: a voiced block carries the words verbatim, a screen block carries what is open and which actions to show. One shared template would give either an unreadable script or improvisation off a sheet of paper.',
      how: [
        'Each kind of material has its own tool, and a table says which: a branded overlay is Remotion, a diagram is a single Excalidraw canvas, a list of points is slides, an interface is a live walkthrough. Otherwise one tool gets dragged where another works better.',
        'Auto-posting was removed deliberately: the social posting servers are gone and the command only prepares the texts per platform. One external connection is left - Telegram search for research, not distribution.',
        'Heavy renders are not tracked in the repository: what is published lives on the platforms, and what stays here are the composition sources and the scripts - the things everything is rebuilt from.',
        'After publication a video’s folder moves to a separate directory: its state is visible from where it sits rather than from a status line someone forgets to change.',
      ],
      owner: 'Me. This is my own workshop rather than a service for sale: the repository is not published.',
      facts: [
        { label: 'Coverage', value: 'script, graphics, subtitles, platform texts' },
        { label: 'Maintained by', value: 'the author' },
        { label: 'Replaced', value: 'contracting out the script, graphics and editing' },
      ],
      screenshots: [],
      metaTitle: 'Case: a content factory for video | Minas Sarkisyan',
      metaDescription:
        'Scripts, Remotion graphics and subtitles by a local Whisper in one repository. Seven commands, three video skills, 110 compositions; publishing stays by hand.',
    },
  },

  // ── data-marts ──
  'data-marts': {
    title: 'Marts on top of the data lake',
    angles: {
      decisions: {
        headline: 'Margin per product - and, separately, what does not land on it',
        pain: 'Product economics were counted off the marketplace report. Cost price sits on logistics rows too, and there are far more of those - it came out an order of magnitude high.',
        outcome: 'Two marts: one holds what honestly lands on a product, the other storage, intake, penalties and withholdings that do not spread across items. On screen they are a separate block, not profit that is absent.',
        chips: [
          {
            icon: 'trust',
            label: 'The operation-type filter',
            value: 'without it cost price is an order of magnitude high',
            note: 'Cost price is filled in on every row of the report, logistics rows included, and there are about five times more of those than product rows. The list of operation types is taken from a working script over the legacy warehouse rather than invented.',
          },
          {
            icon: 'time',
            label: 'What the dashboard answers from',
            value: 'its own mart, not the source',
            note: 'Background jobs move the aggregates into the application’s own database on a schedule: the product-economics mart refreshes once a day, the sales mart once an hour. That buys an answer in tens of milliseconds instead of seconds, a dashboard that works while the source is down, and a freshness date the user can see.',
          },
          {
            icon: 'coverage',
            label: 'The period ceiling',
            value: 'equal to the depth of the mart',
            note: 'The mart holds a hundred-day window, and the maximum period in the API equals it. Allowing a year while storing a hundred days would mean silently handing back a truncated series instead of an honest refusal.',
          },
        ],
        bar: {
          filled: 57,
          total: 387,
          caption: '15 % of the source’s non-empty tables serve data older than a week, and the catalogue does not tell them from the live ones',
        },
      },
    },
    detail: {
      lead: 'An application with dashboards over two sources: the data lake and the corporate warehouse. It does not compute on the fly - background jobs move aggregates into its own database, and the screen reads a mart whose freshness date is visible.',
      effects: [{ block: 'decisions', text: 'A decision about a product rests on a figure that carries both its date and what was left out of it' }],
      value: [
        'The dashboard answers even while the source is unavailable, and it always shows what moment the data is from.',
        'A product with no cost price does not look like a product with a great margin: revenue without cost price travels to the screen as a metric of its own.',
        'Costs that do not land on an item are shown separately rather than smeared across products by an invented rule.',
        'A request for a period deeper than the mart gets an honest refusal instead of a silently truncated series.',
        'The application builds no data collection of its own: it takes the ready lake and keeps a short mart on top of it for the speed of the screen.',
      ],
      diagramNodes: ['The data lake', 'The corporate warehouse', 'Scheduled background jobs', 'Marts of our own', 'Dashboards with a freshness date'],
      diagramNote: 'Only the background job reaches into the sources - it sits inside the protected perimeter. The interface and the API read nothing but their own database, so where they run does not depend on the source’s network.',
      how: [
        'There are two marts on purpose. Storage, intake, penalties and withholdings are zero on product rows, and the withholdings themselves are tied to no item on any row. Spreading them across products takes an invented rule; staying silent means showing profit that is not there.',
        'The source is read from a view rather than the base table: the view normalises the signs on returns and adds the cost price and the link to the accounting system’s item, neither of which the table itself carries.',
        'The source was surveyed before anything was built, and the survey checked not only metadata but freshness, dependencies and schedules. One in seven non-empty tables turned out to carry data older than a week - the catalogue does not tell those from the live ones, because monitoring watches the job status rather than the completeness of the data.',
        'The job queue lives in the same database as the application’s data: enqueueing a job and the business change land in one transaction, so «saved it, lost the job» cannot happen. No separate storage for the queue was needed.',
      ],
      owner: 'An engineer. Both sources are connected read-only; the application can write to its own database and nowhere else.',
      facts: [
        { label: 'Rhythm', value: 'the mart refreshes on a schedule' },
        { label: 'Maintained by', value: 'an engineer' },
        { label: 'Replaced', value: 'counting off the raw marketplace report' },
      ],
      screenshots: [],
      metaTitle: 'Case: marts and dashboards on top of a data lake | Minas Sarkisyan',
      metaDescription:
        'The dashboard reads its own mart with a freshness date, not the source. Two marts: what lands on a product and what does not - storage, penalties, withholdings.',
    },
  },

  // ── yandex-mcp ──
  'yandex-mcp': {
    title: 'Ads and SEO from chat',
    angles: {
      money: {
        headline: 'The ad budget changes by the rules, not by guesswork',
        pain: 'Budgets and bids live in an account where an edit applies at once. A mistake costs a weekly budget burned over the days that are left, and a strategy’s training reset halfway.',
        outcome: 'An open MCP server: 125 tools across Direct, Metrika and Webmaster. A writing call previews what would be sent, the change percentage is capped per project, and the weekend rule brings its own warning.',
        chips: [
          {
            icon: 'scale',
            label: 'Tools',
            value: '125: ads, analytics, search',
            note: '52 Webmaster tools, 46 for Direct, 25 for Metrika and two for switching projects. On top of them, six ready workflows - from a campaign audit to a training check - and an autostrategy playbook handed to the assistant as a server resource.',
          },
          {
            icon: 'trust',
            label: 'A writing call',
            value: 'a preview first, confirmation after',
            note: 'Without a confirmation the tool sends nothing: it returns the request itself - the method and its parameters - along with the declared budget and bid changes and any limits they break. The current values in that answer come from the caller, not from the account. Maximum change percentages are set per project; going past them takes a separate flag.',
          },
          {
            icon: 'money',
            label: 'The weekend rule',
            value: 'a warning from Friday through Sunday',
            note: 'Direct recalculates the weekly budget over the days left in the calendar week and ignores what has already been spent. A significant edit on Friday to Sunday means trying to burn the sum over the remainder of the week, so the server names the day before sending.',
          },
        ],
      },
    },
    detail: {
      lead: 'An open MCP server for three Yandex accounts - Direct, Metrika and Webmaster - with 125 tools in a single process. The assistant answers about ads, traffic and search in words, while edits to an account pass through a preview, limits and warnings.',
      effects: [{ block: 'money', text: 'Ad spend becomes visible in words, and a budget edit passes through a preview and a limit' }],
      value: [
        'An answer about spend, bids and conversions is assembled from the API right now, not from yesterday’s export.',
        'A budget or bid edit does not go through on the first call: what exactly will change is visible first.',
        'The maximum change percentage is set per project, so a typo that multiplies a number does not pass silently.',
        'One process serves several accounts: each has its own token and its own maximum change percentages.',
        'Until access to the ads API is approved, the project switches to the marketplace sandbox and the whole workflow can still be checked.',
      ],
      diagramNodes: ['A question in words', 'The MCP server', 'Direct · Metrika · Webmaster', 'Preview and limits', 'An answer or a confirmed edit'],
      diagramNote: 'The token lives in the project settings and never reaches the conversation: the tool calls the API itself, and the assistant only sees the result of the call.',
      how: [
        'The methodology is split into two layers. Platform mechanics are hard rules that must not be broken; heuristics are starting values to be tested against the project’s own data. Some of the hard rules are wired into the server as checks rather than left to the assistant’s discipline.',
        'Direct returns partial failures inside a successful response: a 200 code with some rows carrying errors. So the result of a writing call is summarised per item, and a partial failure shows up separately instead of hiding behind the word «applied».',
        'The playbook is handed to the assistant as a server resource, and six workflows come as ready prompts: a campaign audit, a weekly report, a launch, budget scaling, an SEO audit and a strategy training check.',
        'The tools cover the working surface of each account rather than one scenario: the recrawl queue and diagnostics in Webmaster, raw visit logs and offline conversion uploads in Metrika, campaigns, bids and reports in Direct.',
      ],
      owner: 'Me. Open source under the MIT licence; the repository is published, the npm package is not out yet.',
      facts: [
        { label: 'Coverage', value: '125 tools across three accounts' },
        { label: 'Maintained by', value: 'an engineer' },
        { label: 'Replaced', value: 'walking the Yandex accounts by hand' },
      ],
      screenshots: [],
      metaTitle: 'Case: Yandex ads, analytics and SEO from chat | Minas Sarkisyan',
      metaDescription:
        'An MCP server for Direct, Metrika and Webmaster: 125 tools, a preview before writing, a per-project change limit and a warning about the weekend rule.',
    },
  },
}
