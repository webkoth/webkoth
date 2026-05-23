"use client";

import { useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import type { Lang } from "./copy-i18n";
import { copy } from "./copy-i18n";
import { SectionHeader } from "./section-header";

const TECH_DESCRIPTIONS: Record<string, { ru: string; en: string }> = {
  // Backend
  "PHP / Laravel": {
    ru: "Зрелый ORM Eloquent, очереди Horizon, событийная модель — основной стек 5+ enterprise-проектов.",
    en: "Mature Eloquent ORM, Horizon queues, event model — primary stack for 5+ enterprise projects.",
  },
  "Node.js / Hono": {
    ru: "Лёгкий edge-фреймворк для AI-сервисов и MCP-серверов: hubmarket-ai, hubmarket-parser.",
    en: "Lightweight edge framework for AI services and MCP servers: hubmarket-ai, hubmarket-parser.",
  },
  "Python / FastAPI": {
    ru: "Для парсинга, ML-пайплайнов и Yandex-стека (PDF/OCR, типизированные OpenAPI-схемы).",
    en: "For parsing, ML pipelines and Yandex stack (PDF/OCR, typed OpenAPI schemas).",
  },
  "Go (touch)": {
    ru: "Чтение и правка существующих сервисов с высокой нагрузкой и конкурентными пайплайнами.",
    en: "Reading and patching existing services with high load and concurrent pipelines.",
  },
  // Frontend
  "React / Next.js": {
    ru: "App Router, RSC, Server Actions — основной фронт для HubMarket и webkoth.ru.",
    en: "App Router, RSC, Server Actions — primary frontend for HubMarket and webkoth.ru.",
  },
  "Vue 3 / Inertia": {
    ru: "Для проектов с Laravel-бэкендом, где не нужен полный SPA-сплит (EdTech-проект).",
    en: "For Laravel-backed projects without a full SPA split (EdTech project).",
  },
  TypeScript: {
    ru: "Везде по умолчанию — strict-режим, типизированные API и схемы валидации.",
    en: "Default everywhere — strict mode, typed APIs and validation schemas.",
  },
  Tailwind: {
    ru: "Утилитарный CSS — быстрый прототип, единая дизайн-система через CSS-переменные.",
    en: "Utility CSS — fast prototyping, single design system via CSS variables.",
  },
  "shadcn/ui": {
    ru: "Компоненты копируются в проект, не зависимость — полный контроль над стилем.",
    en: "Components copied into the project, not a dependency — full styling control.",
  },
  // AI providers
  "Anthropic Claude": {
    ru: "Основной провайдер для генерации, агентов и tool use — лучший по reasoning.",
    en: "Primary provider for generation, agents and tool use — best at reasoning.",
  },
  OpenAI: {
    ru: "GPT-4o-mini для быстрых задач, Whisper для транскрипции, embeddings для RAG.",
    en: "GPT-4o-mini for quick tasks, Whisper for transcription, embeddings for RAG.",
  },
  "Google Gemini": {
    ru: "Первый fallback в каскаде, мультимодальная работа с PDF и изображениями.",
    en: "First fallback in the cascade, multimodal handling of PDFs and images.",
  },
  Groq: {
    ru: "LPU-инференс с минимальной латентностью — fallback для real-time задач.",
    en: "LPU inference with minimal latency — fallback for real-time workloads.",
  },
  "Yandex GPT": {
    ru: "Локализованный провайдер для проектов с требованиями к данным в РФ.",
    en: "Localised provider for projects with RU data-residency requirements.",
  },
  "self-hosted (Ollama / vLLM)": {
    ru: "Llama / Mistral на ваших серверах — для NDA, on-premise и чувствительных данных.",
    en: "Llama / Mistral on your servers — for NDA, on-premise and sensitive data.",
  },
  // AI stack
  "Vercel AI SDK": {
    ru: "Единый интерфейс к 5+ провайдерам — основа каскада и стриминга в UI.",
    en: "Single interface to 5+ providers — the basis of cascade and UI streaming.",
  },
  MCP: {
    ru: "Model Context Protocol — подключаю ваш API к Claude Code, Cursor и агентам. 7 серверов на npm.",
    en: "Model Context Protocol — connects your API to Claude Code, Cursor and agents. 7 servers on npm.",
  },
  pgvector: {
    ru: "Векторный поиск прямо в Postgres — без отдельной инфры под RAG.",
    en: "Vector search directly in Postgres — no separate infra for RAG.",
  },
  "structured output": {
    ru: "JSON Schema / Zod на выходе LLM — без regex-парсинга и галлюцинаций полей.",
    en: "JSON Schema / Zod on LLM output — no regex parsing, no field hallucinations.",
  },
  "tool calling": {
    ru: "LLM вызывает ваши функции (CRM, БД, API) с типизированными аргументами.",
    en: "LLM calls your functions (CRM, DB, API) with typed arguments.",
  },
  RAG: {
    ru: "Retrieval-augmented generation: pgvector + embeddings + reranking — ответы по вашим документам.",
    en: "Retrieval-augmented generation: pgvector + embeddings + reranking — answers from your docs.",
  },
  // Databases & cache
  PostgreSQL: {
    ru: "Основная БД во всех новых проектах — JSON, full-text, pgvector, очереди через pg-boss.",
    en: "Primary DB in all new projects — JSON, full-text, pgvector, queues via pg-boss.",
  },
  MySQL: {
    ru: "Для legacy-проектов и Laravel-приложений с MySQL-историей.",
    en: "For legacy projects and Laravel apps with MySQL history.",
  },
  ClickHouse: {
    ru: "Аналитика на 1+ TB — MPSTATS-пайплайны, −20% latency, +30% throughput.",
    en: "Analytics on 1+ TB — MPSTATS pipelines, −20% latency, +30% throughput.",
  },
  Redis: {
    ru: "Кэш, rate-limiting, session-store. Pub/sub для realtime-каналов.",
    en: "Cache, rate-limiting, session store. Pub/sub for realtime channels.",
  },
  MongoDB: {
    ru: "Для проектов со схемой-как-документ и lookup-агрегациями.",
    en: "For projects with document-style schema and lookup aggregations.",
  },
  // Infra & ops
  Docker: {
    ru: "Контейнеризация всего — единое окружение dev → staging → prod, docker-compose.",
    en: "Containerise everything — uniform dev → staging → prod, docker-compose.",
  },
  Nginx: {
    ru: "Reverse proxy, SSL-терминация, static cache. Конфиги под Next.js, Laravel, FastAPI.",
    en: "Reverse proxy, SSL termination, static cache. Configs for Next.js, Laravel, FastAPI.",
  },
  Cloudflare: {
    ru: "CDN, DNS, WAF. Workers для edge-логики и rate-limiting на уровне Cloudflare.",
    en: "CDN, DNS, WAF. Workers for edge logic and rate-limiting at Cloudflare level.",
  },
  Vercel: {
    ru: "Деплой Next.js-проектов в один клик — preview-окружения для каждого PR.",
    en: "One-click Next.js deploys — preview environments per PR.",
  },
  Linux: {
    ru: "Ubuntu / Debian, systemd, journald. Самостоятельная настройка серверов и SRE-задачи.",
    en: "Ubuntu / Debian, systemd, journald. Self-managed servers and SRE tasks.",
  },
  Sentry: {
    ru: "Сбор ошибок, performance-метрики, release-tracking — везде по умолчанию.",
    en: "Error tracking, performance metrics, release tracking — default everywhere.",
  },
  "pg-boss / Horizon": {
    ru: "Очереди задач без отдельной инфры (pg-boss для Node, Horizon для Laravel).",
    en: "Job queues without separate infra (pg-boss for Node, Horizon for Laravel).",
  },
};

type NodeKey =
  | "client"
  | "router"
  | "claude"
  | "gemini"
  | "groq"
  | "structured"
  | "user"
  | "audit";

type Variant = "default" | "ai-primary" | "ai-soft" | "proc" | "out" | "store";

type Node = {
  key: NodeKey;
  x: number;
  y: number;
  label: string;
  sub?: string;
  variant: Variant;
};

type Edge = {
  from: NodeKey;
  to: NodeKey;
  d: string;
  speed: number;
  branch: NodeKey[];
};

const NW = 148;
const NH = 58;
const COL_GAP = 60;
const COL: Record<number, number> = {
  0: 40,
  1: 40 + (NW + COL_GAP),
  2: 40 + 2 * (NW + COL_GAP),
  3: 40 + 3 * (NW + COL_GAP),
  4: 40 + 4 * (NW + COL_GAP),
};
const ROW_TOP = 40;
const ROW_MID = 170;
const ROW_BOT = 300;

const W = COL[4] + NW + 40;
const H = ROW_BOT + NH + 50;

const NODES: Node[] = [
  { key: "client", x: COL[0], y: ROW_MID, label: "Client", sub: "app · api · bot", variant: "default" },
  { key: "router", x: COL[1], y: ROW_MID, label: "Router", sub: "health · budget", variant: "proc" },
  { key: "claude", x: COL[2], y: ROW_TOP, label: "Claude", sub: "primary", variant: "ai-primary" },
  { key: "gemini", x: COL[2], y: ROW_MID, label: "Gemini", sub: "fallback 1", variant: "ai-soft" },
  { key: "groq", x: COL[2], y: ROW_BOT, label: "Groq", sub: "fallback 2", variant: "ai-soft" },
  { key: "structured", x: COL[3], y: ROW_MID, label: "Structured", sub: "JSON · validate", variant: "proc" },
  { key: "user", x: COL[4], y: ROW_TOP, label: "User", sub: "p99 < 4s", variant: "out" },
  { key: "audit", x: COL[4], y: ROW_BOT, label: "Audit log", sub: "tokens · cost", variant: "store" },
];

const NODE_DESCRIPTIONS: Record<NodeKey, { ru: string; en: string }> = {
  client: {
    ru: "Любое приложение, которому нужен AI-результат: бэкенд, чат-бот, MCP-клиент, внутренний сервис.",
    en: "Any app that needs an AI result: backend, chatbot, MCP client, internal service.",
  },
  router: {
    ru: "Решает, к какому провайдеру идти первым. Health-checks, лимиты на токены и бюджет, политика fallback.",
    en: "Decides which provider to call first. Health checks, token/budget caps, fallback policy.",
  },
  claude: {
    ru: "Основной провайдер: Anthropic Claude. Высокое качество, держит основную нагрузку.",
    en: "Primary provider: Anthropic Claude. High quality, carries the main load.",
  },
  gemini: {
    ru: "Первый fallback: Google Gemini. Подключается при отказе или таймауте Claude (по умолчанию 8 c).",
    en: "First fallback: Google Gemini. Engages on Claude failure or timeout (8s default).",
  },
  groq: {
    ru: "Второй fallback: Groq (Llama). Низкая латентность и дешевле — последний рубеж, если оба основных молчат.",
    en: "Second fallback: Groq (Llama). Low latency and cheaper — last line when both primaries are silent.",
  },
  structured: {
    ru: "Парсинг ответа в JSON-схему, валидация. Если ответ невалиден — retry на следующем провайдере.",
    en: "Parses the answer into a JSON schema, validates it. On invalid output — retry the next provider.",
  },
  user: {
    ru: "Готовый структурированный ответ возвращается клиенту. SLA: p99 < 4 с с учётом всех фолбэков.",
    en: "The final structured answer returns to the client. SLA: p99 < 4s including fallbacks.",
  },
  audit: {
    ru: "Полный лог промпта, провайдера, токенов, стоимости и решений роутера. Источник для analytics, дебага и quality-drift.",
    en: "Full log of prompt, provider, tokens, cost and router decisions. Source for analytics, debug and quality-drift checks.",
  },
};

const centerR = (n: Node) => ({ x: n.x + NW, y: n.y + NH / 2 });
const centerL = (n: Node) => ({ x: n.x, y: n.y + NH / 2 });

function nodeBy(k: NodeKey) {
  return NODES.find((n) => n.key === k)!;
}

function straight(from: NodeKey, to: NodeKey): string {
  const a = centerR(nodeBy(from));
  const b = centerL(nodeBy(to));
  return `M${a.x},${a.y} L${b.x},${b.y}`;
}

function curve(from: NodeKey, to: NodeKey): string {
  const a = centerR(nodeBy(from));
  const b = centerL(nodeBy(to));
  const midX = (a.x + b.x) / 2;
  return `M${a.x},${a.y} C${midX},${a.y} ${midX},${b.y} ${b.x},${b.y}`;
}

const EDGES: Edge[] = [
  {
    from: "client",
    to: "router",
    d: straight("client", "router"),
    speed: 2.8,
    branch: ["router", "claude", "gemini", "groq", "structured", "user", "audit"],
  },
  {
    from: "router",
    to: "claude",
    d: curve("router", "claude"),
    speed: 2.6,
    branch: ["claude", "structured", "user", "audit"],
  },
  {
    from: "router",
    to: "gemini",
    d: straight("router", "gemini"),
    speed: 3.4,
    branch: ["gemini", "structured", "user", "audit"],
  },
  {
    from: "router",
    to: "groq",
    d: curve("router", "groq"),
    speed: 3.6,
    branch: ["groq", "structured", "user", "audit"],
  },
  {
    from: "claude",
    to: "structured",
    d: curve("claude", "structured"),
    speed: 2.4,
    branch: ["structured", "user", "audit"],
  },
  {
    from: "gemini",
    to: "structured",
    d: straight("gemini", "structured"),
    speed: 3.2,
    branch: ["structured", "user", "audit"],
  },
  {
    from: "groq",
    to: "structured",
    d: curve("groq", "structured"),
    speed: 3.4,
    branch: ["structured", "user", "audit"],
  },
  {
    from: "structured",
    to: "user",
    d: curve("structured", "user"),
    speed: 2.2,
    branch: ["user"],
  },
  {
    from: "structured",
    to: "audit",
    d: curve("structured", "audit"),
    speed: 2.8,
    branch: ["audit"],
  },
];

const VARIANT_STYLES: Record<Variant, string> = {
  default: "bg-card border-border data-[hover=true]:border-foreground/40",
  "ai-primary": "bg-primary/10 border-primary data-[hover=true]:border-primary",
  "ai-soft": "bg-primary/5 border-primary/40 data-[hover=true]:border-primary/70",
  proc: "bg-sky-500/5 border-sky-500/50 data-[hover=true]:border-sky-500",
  out: "bg-emerald-500/5 border-emerald-500/50 data-[hover=true]:border-emerald-500",
  store: "bg-muted/50 border-border data-[hover=true]:border-foreground/50",
};

function CascadeDiagram({ lang }: { lang: Lang }) {
  const isRu = lang === "ru";
  const reduce = useReducedMotion();
  const [hovered, setHovered] = useState<NodeKey | null>(null);

  const isEdgeActive = (e: Edge) =>
    hovered == null || e.from === hovered || e.to === hovered || e.branch.includes(hovered);

  const isNodeActive = (k: NodeKey) => {
    if (hovered == null) return true;
    if (hovered === k) return true;
    return EDGES.some((e) => e.from === hovered && (e.to === k || e.branch.includes(k)));
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-background">
      <div className="p-4 md:p-7">
        <div className="relative w-full" style={{ aspectRatio: `${W} / ${H}` }}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="xMidYMid meet"
          className="absolute inset-0 h-full w-full"
          role="img"
          aria-label={isRu ? "Multi-provider LLM cascade" : "Multi-provider LLM cascade"}
        >
          <defs>
            <marker
              id="cascade-arrow"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M0,0 L10,5 L0,10 z" className="fill-foreground/45" />
            </marker>
          </defs>

          {EDGES.map((e, i) => {
            const active = isEdgeActive(e);
            return (
              <g key={`edge-${i}`}>
                <path
                  d={e.d}
                  fill="none"
                  strokeWidth={1.75}
                  strokeLinecap="round"
                  className={cn(
                    "transition-[stroke,opacity] duration-300",
                    active ? "stroke-foreground/40" : "stroke-foreground/10",
                  )}
                  strokeDasharray="5 5"
                  markerEnd="url(#cascade-arrow)"
                >
                  {!reduce && (
                    <animate
                      attributeName="stroke-dashoffset"
                      from="0"
                      to="-20"
                      dur="1.4s"
                      repeatCount="indefinite"
                    />
                  )}
                </path>
                {!reduce && active && (
                  <circle r={4} className="fill-primary">
                    <animateMotion
                      dur={`${e.speed}s`}
                      repeatCount="indefinite"
                      path={e.d}
                      rotate="auto"
                    />
                  </circle>
                )}
              </g>
            );
          })}

          {NODES.map((n) => {
            const active = isNodeActive(n.key);
            const isHovered = hovered === n.key;
            return (
              <foreignObject
                key={n.key}
                x={n.x}
                y={n.y}
                width={NW}
                height={NH}
              >
                <HoverCard>
                  <HoverCardTrigger
                    render={
                      <button
                        type="button"
                        onMouseEnter={() => setHovered(n.key)}
                        onMouseLeave={() => setHovered(null)}
                        onFocus={() => setHovered(n.key)}
                        onBlur={() => setHovered(null)}
                        data-hover={isHovered}
                        className={cn(
                          "flex h-full w-full flex-col items-center justify-center rounded-xl border px-2 py-1 text-center shadow-sm outline-none transition-all duration-200",
                          "focus-visible:ring-2 focus-visible:ring-primary/50",
                          VARIANT_STYLES[n.variant],
                          active ? "opacity-100" : "opacity-35",
                          isHovered && "shadow-md",
                        )}
                      >
                        <span className="text-[14px] font-semibold leading-tight tracking-tight text-foreground">
                          {n.label}
                        </span>
                        {n.sub && (
                          <span className="mt-0.5 font-mono text-[11px] leading-tight text-muted-foreground">
                            {n.sub}
                          </span>
                        )}
                      </button>
                    }
                  />
                  <HoverCardContent className="flex w-72 flex-col gap-1">
                    <div className="font-mono text-[13px] font-semibold text-primary">
                      {n.label}
                    </div>
                    <p className="text-sm leading-snug text-muted-foreground">
                      {NODE_DESCRIPTIONS[n.key][lang]}
                    </p>
                  </HoverCardContent>
                </HoverCard>
              </foreignObject>
            );
          })}
        </svg>
        </div>
        <div className="mt-3 flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
          {isRu ? "поток запроса" : "request flow"}
        </div>
      </div>
    </div>
  );
}

export function TechStack({ lang }: { lang: Lang }) {
  const t = copy[lang].techStack;

  return (
    <section id="tech-stack" className="relative">
      <div className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
        <SectionHeader icon={Layers} eyebrow={t.eyebrow} title={t.title} sub={t.sub} />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {t.categories.map((cat) => (
            <div key={cat.name} className="rounded-xl border border-border bg-card/60 p-5">
              <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {cat.name}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {cat.items.map((item) => {
                  const desc = TECH_DESCRIPTIONS[item]?.[lang];
                  return (
                    <HoverCard key={item}>
                      <HoverCardTrigger
                        render={
                          <button
                            type="button"
                            className="rounded-full bg-muted/60 px-2.5 py-1 font-mono text-xs transition-colors hover:bg-primary/10 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                          >
                            {item}
                          </button>
                        }
                      />
                      <HoverCardContent className="flex w-72 flex-col gap-1">
                        <div className="font-mono text-[13px] font-semibold text-primary">
                          {item}
                        </div>
                        <p className="text-sm leading-snug text-muted-foreground">
                          {desc ?? (lang === "ru" ? "Описание скоро будет." : "Description coming soon.")}
                        </p>
                      </HoverCardContent>
                    </HoverCard>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <div className="mb-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {t.diagramTitle}
          </div>
          <CascadeDiagram lang={lang} />
        </div>
      </div>
    </section>
  );
}
