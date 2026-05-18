"use client";
import { Badge } from "@/components/ui/badge";
import { copy, type Lang } from "./copy-i18n";
import { MermaidDiagram } from "./mermaid-diagram";

const chart = `flowchart LR
    A[Chrome MV3] --> B[Next.js 16]
    B --> C[Hono API]
    C --> D[pg-boss queues]
    D --> E[LLM cascade<br/>Claude→Gemini→Groq]
    D --> F[Playwright<br/>WB/Ozon/YM]
    D --> G[FastAPI<br/>NPD parser]
    F --> H[(Bronze lake)]
    H --> I[(Silver lake)]
    I --> E
    E --> J[Telegram bot]`;

export function FeaturedCase({ lang }: { lang: Lang }) {
  const t = copy[lang].featured;
  return (
    <section id="featured" className="border-t border-border bg-muted/30">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl md:text-4xl font-semibold tracking-tight">{t.title}</h2>
            <p className="text-muted-foreground">{t.sub}</p>
            <ul className="space-y-2">
              {t.metrics.map((m) => (
                <li key={m} className="text-sm border-l-2 border-primary pl-3">{m}</li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-1.5 pt-2">
              {t.stack.map((s) => (
                <Badge key={s} variant="secondary" className="font-mono text-xs">{s}</Badge>
              ))}
            </div>
          </div>
          <div className="lg:col-span-3 rounded-xl border border-border bg-background p-4">
            <MermaidDiagram chart={chart} />
          </div>
        </div>
      </div>
    </section>
  );
}
