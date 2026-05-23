"use client";

import { useState } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Lang } from "./copy-i18n";
import { copy } from "./copy-i18n";

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
  default: "fill-card stroke-border",
  "ai-primary": "fill-primary/15 stroke-primary",
  "ai-soft": "fill-primary/[0.06] stroke-primary/40",
  proc: "fill-sky-500/[0.07] stroke-sky-500/50",
  out: "fill-emerald-500/10 stroke-emerald-500/60",
  store: "fill-muted/50 stroke-border",
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

  const hoveredNode = hovered ? nodeBy(hovered) : null;
  const hoveredDesc = hovered ? NODE_DESCRIPTIONS[hovered][lang] : null;

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-background">
      <div className="p-4 md:p-7">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="h-auto w-full"
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
                  className={cn(VARIANT_STYLES[n.variant], "transition-all")}
                />
                <text
                  x={NW / 2}
                  y={n.sub ? 25 : 35}
                  textAnchor="middle"
                  className="fill-foreground text-[15px] font-medium"
                  style={{ fontFamily: "var(--font-geist-sans)" }}
                >
                  {n.label}
                </text>
                {n.sub && (
                  <text
                    x={NW / 2}
                    y={43}
                    textAnchor="middle"
                    className="fill-muted-foreground text-[11px]"
                    style={{ fontFamily: "var(--font-geist-mono)" }}
                  >
                    {n.sub}
                  </text>
                )}
              </g>
            );
          })}

          <g transform={`translate(20, ${H - 20})`}>
            <circle cx={5} cy={0} r={4} className="fill-primary" />
            <text
              x={18}
              y={4}
              className="fill-muted-foreground text-[12px]"
              style={{ fontFamily: "var(--font-geist-mono)" }}
            >
              {isRu ? "поток запроса" : "request flow"}
            </text>
          </g>
        </svg>
      </div>

      <div className="border-t border-border bg-muted/30 px-4 py-5 md:px-7 md:py-6">
        <div className="min-h-[88px] md:min-h-[72px]">
          {hoveredNode ? (
            <div className="flex flex-col gap-2 md:flex-row md:items-start md:gap-5">
              <div className="flex shrink-0 items-baseline gap-2 md:w-52">
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
                ? "Наведи или сфокусируйся на компоненте — увидишь, что он делает и как связан с остальным."
                : "Hover or focus a component — see its role and connections."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function TechStack({ lang }: { lang: Lang }) {
  const t = copy[lang].techStack;

  return (
    <section id="tech-stack" className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_bottom_right,color-mix(in_oklab,var(--primary)_8%,transparent),transparent_50%)]"
      />
      <div className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
        <div className="mb-12 max-w-2xl">
          <div className="mb-2 font-mono text-xs uppercase tracking-widest text-primary">
            {t.eyebrow}
          </div>
          <h2 className="mb-3 text-2xl font-semibold tracking-tight md:text-4xl">{t.title}</h2>
          <p className="text-muted-foreground">{t.sub}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {t.categories.map((cat) => (
            <div key={cat.name} className="rounded-xl border border-border bg-card/60 p-5">
              <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {cat.name}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {cat.items.map((item) => (
                  <span
                    key={item}
                    className="rounded-full bg-muted/60 px-2.5 py-1 font-mono text-xs"
                  >
                    {item}
                  </span>
                ))}
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
