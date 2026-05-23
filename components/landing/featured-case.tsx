"use client";
import { useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { copy, type Lang } from "./copy-i18n";

type NodeKey =
  | "chrome"
  | "next"
  | "hono"
  | "queue"
  | "playwright"
  | "fastapi"
  | "bronze"
  | "silver"
  | "cascade"
  | "telegram";

type Node = {
  key: NodeKey;
  x: number;
  y: number;
  label: string;
  sub?: string;
  variant?: "default" | "ai" | "store" | "out";
};

type Edge = {
  from: NodeKey;
  to: NodeKey;
  d: string;
  speed?: number;
  branch: NodeKey[];
};

// Layout grid — larger nodes + breathing room
const NW = 168;
const NH = 64;
const COL_GAP = 50;
const COL: Record<number, number> = {
  0: 40,
  1: 40 + NW + COL_GAP,
  2: 40 + 2 * (NW + COL_GAP),
  3: 40 + 3 * (NW + COL_GAP),
  4: 40 + 4 * (NW + COL_GAP),
  5: 40 + 5 * (NW + COL_GAP),
};
const ROW_TOP = 60;
const ROW_MID = 240;
const ROW_BOT = 420;

const W = COL[5] + NW + 40;
const H = ROW_BOT + NH + 50;

const NODES: Node[] = [
  { key: "chrome", x: COL[0], y: ROW_MID, label: "Chrome MV3", sub: "extension" },
  { key: "next", x: COL[1], y: ROW_MID, label: "Next.js 16", sub: "app router" },
  { key: "hono", x: COL[2], y: ROW_MID, label: "Hono API", sub: "edge runtime" },
  { key: "queue", x: COL[3], y: ROW_MID, label: "pg-boss", sub: "queues" },
  { key: "playwright", x: COL[4], y: ROW_TOP, label: "Playwright", sub: "WB · Ozon · YM" },
  { key: "fastapi", x: COL[4], y: ROW_MID, label: "FastAPI", sub: "NPD parser" },
  { key: "bronze", x: COL[5], y: ROW_TOP, label: "Bronze lake", variant: "store" },
  { key: "silver", x: COL[5], y: ROW_MID, label: "Silver lake", variant: "store" },
  {
    key: "cascade",
    x: COL[4],
    y: ROW_BOT,
    label: "LLM cascade",
    sub: "Claude → Gemini → Groq",
    variant: "ai",
  },
  { key: "telegram", x: COL[5], y: ROW_BOT, label: "Telegram bot", variant: "out" },
];

const NODE_DESCRIPTIONS: Record<NodeKey, { ru: string; en: string }> = {
  chrome: {
    ru: "Браузерное расширение — точка входа для селлера. Подтягивает токены и снимает данные из кабинетов маркетплейсов.",
    en: "Browser extension — seller's entry point. Pulls tokens and scrapes data from marketplace dashboards.",
  },
  next: {
    ru: "Frontend на Next.js 16 + React 19. Дашборд, аналитика и конфигурация интеграций — всё в app router.",
    en: "Frontend on Next.js 16 + React 19. Dashboard, analytics and integration config — all on app router.",
  },
  hono: {
    ru: "API-слой на Hono с edge runtime. Auth, биллинг через ЮKassa, оркестрация задач в очередь.",
    en: "Hono API on edge runtime. Auth, YooKassa billing, orchestration into the queue.",
  },
  queue: {
    ru: "Очереди задач поверх PostgreSQL — без отдельной инфры (Redis / Kafka). Шедулинг, ретраи, идемпотентные дедупы.",
    en: "Job queues on top of PostgreSQL — no separate infra (Redis / Kafka). Scheduling, retries, idempotent dedupes.",
  },
  playwright: {
    ru: "Парсер маркетплейсов (WB · Ozon · Yandex Market). Снимает данные с UI там, где API недоступен или нестабилен.",
    en: "Marketplace parser (WB · Ozon · Yandex Market). Scrapes the UI where the API is missing or unstable.",
  },
  fastapi: {
    ru: "Python-сервис парсинга НПД-чеков. ML-pipeline извлекает товарные позиции и суммы из изображений.",
    en: "Python service for parsing NPD receipts. ML pipeline extracts line items and totals from images.",
  },
  bronze: {
    ru: "Сырые данные с маркетплейсов в исходном виде — append-only лог дельт без модификаций.",
    en: "Raw marketplace data in original form — append-only delta log, no modifications.",
  },
  silver: {
    ru: "Дедуплицированные и обогащённые данные. Источник для аналитики, LLM-задач и Telegram-уведомлений.",
    en: "Deduplicated and enriched data. Source for analytics, LLM jobs and Telegram notifications.",
  },
  cascade: {
    ru: "Multi-provider каскад: Claude → Gemini → Groq. 0 downtime LLM за 8 месяцев в проде — если падает основной провайдер, автоматический fallback за секунды.",
    en: "Multi-provider cascade: Claude → Gemini → Groq. 0 LLM downtime in 8 months — if the primary fails, automatic fallback in seconds.",
  },
  telegram: {
    ru: "Канал уведомлений селлеру: алерты по остаткам, AI-ответы на отзывы, дневной дайджест по выручке и заказам.",
    en: "Notification channel: stock alerts, AI replies to reviews, daily digest of revenue and orders.",
  },
};

const centerR = (n: Node) => ({ x: n.x + NW, y: n.y + NH / 2 });
const centerL = (n: Node) => ({ x: n.x, y: n.y + NH / 2 });
const centerT = (n: Node) => ({ x: n.x + NW / 2, y: n.y });
const centerB = (n: Node) => ({ x: n.x + NW / 2, y: n.y + NH });

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

function vertical(from: NodeKey, to: NodeKey): string {
  const a = centerB(nodeBy(from));
  const b = centerT(nodeBy(to));
  return `M${a.x},${a.y} L${b.x},${b.y}`;
}

const EDGES: Edge[] = [
  { from: "chrome", to: "next", d: straight("chrome", "next"), branch: [] },
  { from: "next", to: "hono", d: straight("next", "hono"), branch: [] },
  { from: "hono", to: "queue", d: straight("hono", "queue"), branch: [] },
  {
    from: "queue",
    to: "playwright",
    d: curve("queue", "playwright"),
    branch: ["playwright", "bronze", "silver", "cascade", "telegram"],
    speed: 3.2,
  },
  {
    from: "queue",
    to: "fastapi",
    d: straight("queue", "fastapi"),
    branch: ["fastapi", "cascade", "telegram"],
    speed: 3.8,
  },
  {
    from: "queue",
    to: "cascade",
    d: curve("queue", "cascade"),
    branch: ["cascade", "telegram"],
    speed: 3.4,
  },
  {
    from: "playwright",
    to: "bronze",
    d: straight("playwright", "bronze"),
    branch: ["bronze", "silver", "cascade", "telegram"],
    speed: 2.6,
  },
  {
    from: "bronze",
    to: "silver",
    d: vertical("bronze", "silver"),
    branch: ["silver", "cascade", "telegram"],
    speed: 2.4,
  },
  {
    from: "silver",
    to: "cascade",
    d: curve("silver", "cascade"),
    branch: ["cascade", "telegram"],
    speed: 2.8,
  },
  {
    from: "fastapi",
    to: "cascade",
    d: curve("fastapi", "cascade"),
    branch: ["cascade", "telegram"],
    speed: 2.8,
  },
  {
    from: "cascade",
    to: "telegram",
    d: straight("cascade", "telegram"),
    branch: ["telegram"],
    speed: 2.2,
  },
];

const VARIANT_STYLES: Record<NonNullable<Node["variant"]>, string> = {
  default: "fill-card stroke-border",
  ai: "fill-primary/10 stroke-primary/60",
  store: "fill-muted/40 stroke-border",
  out: "fill-emerald-500/10 stroke-emerald-500/60",
};

export function FeaturedCase({ lang }: { lang: Lang }) {
  const t = copy[lang].featured;
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

  const hoveredNode = hovered ? nodeBy(hovered) : null;
  const hoveredDesc = hovered ? NODE_DESCRIPTIONS[hovered][lang] : null;

  return (
    <section id="featured" className="bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
        <header className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <h2 className="text-2xl font-semibold tracking-tight md:text-4xl">{t.title}</h2>
            <p className="mt-3 text-muted-foreground md:text-lg">{t.sub}</p>
            <p className="mt-4 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              {isRu
                ? "наведи на компонент — увидишь пояснение и связанную ветку"
                : "hover a component — see the description and related branch"}
            </p>
          </div>
          <div className="lg:col-span-5">
            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {t.metrics.map((m) => (
                <li key={m} className="border-l-2 border-primary pl-3 text-sm">
                  {m}
                </li>
              ))}
            </ul>
          </div>
        </header>

        <div className="mt-10 overflow-hidden rounded-2xl border border-border bg-background md:mt-12">
          <div className="p-4 md:p-8">
            <svg
              viewBox={`0 0 ${W} ${H}`}
              className="h-auto w-full"
              role="img"
              aria-label={isRu ? "Архитектура HubMarket" : "HubMarket architecture"}
            >
              <defs>
                <marker
                  id="arrow"
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
                      markerEnd="url(#arrow)"
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
                          dur={`${e.speed ?? 3}s`}
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
                const variant = n.variant ?? "default";
                const active = isNodeActive(n.key);
                const isHovered = hovered === n.key;
                return (
                  <g
                    key={n.key}
                    transform={`translate(${n.x}, ${n.y})`}
                    onMouseEnter={() => setHovered(n.key)}
                    onMouseLeave={() => setHovered(null)}
                    onFocus={() => setHovered(n.key)}
                    onBlur={() => setHovered(null)}
                    tabIndex={0}
                    className={cn(
                      "cursor-help outline-none transition-opacity duration-300",
                      active ? "opacity-100" : "opacity-35",
                    )}
                  >
                    <rect
                      width={NW}
                      height={NH}
                      rx={12}
                      ry={12}
                      strokeWidth={isHovered ? 2 : 1.5}
                      className={cn(VARIANT_STYLES[variant], "transition-all")}
                    />
                    <text
                      x={NW / 2}
                      y={n.sub ? 27 : 38}
                      textAnchor="middle"
                      className="fill-foreground text-[16px] font-medium"
                      style={{ fontFamily: "var(--font-geist-sans)" }}
                    >
                      {n.label}
                    </text>
                    {n.sub && (
                      <text
                        x={NW / 2}
                        y={47}
                        textAnchor="middle"
                        className="fill-muted-foreground text-[12px]"
                        style={{ fontFamily: "var(--font-geist-mono)" }}
                      >
                        {n.sub}
                      </text>
                    )}
                  </g>
                );
              })}

              <g transform={`translate(20, ${H - 22})`}>
                <circle cx={5} cy={0} r={4} className="fill-primary" />
                <text
                  x={18}
                  y={4}
                  className="fill-muted-foreground text-[12px]"
                  style={{ fontFamily: "var(--font-geist-mono)" }}
                >
                  {isRu ? "поток данных" : "data flow"}
                </text>
              </g>
            </svg>
          </div>

          {/* Hover info panel */}
          <div className="border-t border-border bg-muted/30 px-4 py-5 md:px-8 md:py-6">
            <div className="min-h-[88px] md:min-h-[72px]">
              {hoveredNode ? (
                <div className="flex flex-col gap-2 md:flex-row md:items-start md:gap-5">
                  <div className="flex shrink-0 items-baseline gap-2 md:w-56">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                      {isRu ? "компонент" : "component"}
                    </span>
                    <span className="font-semibold">{hoveredNode.label}</span>
                    {hoveredNode.sub && (
                      <span className="font-mono text-xs text-muted-foreground">
                        · {hoveredNode.sub}
                      </span>
                    )}
                  </div>
                  <p className="text-sm leading-relaxed text-foreground/85 md:text-base">
                    {hoveredDesc}
                  </p>
                </div>
              ) : (
                <div className="flex h-full items-center text-sm text-muted-foreground md:text-base">
                  {isRu
                    ? "Наведи или сфокусируйся на любом компоненте схемы — здесь появится пояснение, что он делает и как связан с остальным."
                    : "Hover or focus any component on the diagram — its role and connections will appear here."}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-1.5">
          {t.stack.map((s) => (
            <Badge key={s} variant="secondary" className="font-mono text-[11px]">
              {s}
            </Badge>
          ))}
        </div>
      </div>
    </section>
  );
}
