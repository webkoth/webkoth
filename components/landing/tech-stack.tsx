"use client";

import type { Lang } from "./copy-i18n";
import { copy } from "./copy-i18n";
import { MermaidDiagram } from "./mermaid-diagram";

const CASCADE_CHART = `flowchart LR
  C[Client] --> R[Router]
  R -->|primary| A[Claude]
  R -->|fallback 1| G[Gemini]
  R -->|fallback 2| K[Groq]
  A --> S[Structured Output]
  G --> S
  K --> S
  S --> O[Audit Log]
  S --> U[User]`;

export function TechStack({ lang }: { lang: Lang }) {
  const t = copy[lang].techStack;

  return (
    <section id="tech-stack" className="border-t border-border">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-20 md:py-28">
        <div className="mb-12 max-w-2xl">
          <div className="mb-2 font-mono text-xs uppercase tracking-widest text-primary">
            {t.eyebrow}
          </div>
          <h2 className="text-2xl md:text-4xl font-semibold tracking-tight mb-3">{t.title}</h2>
          <p className="text-muted-foreground">{t.sub}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {t.categories.map((cat) => (
            <div
              key={cat.name}
              className="rounded-xl border border-border bg-card/60 p-5"
            >
              <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {cat.name}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {cat.items.map((item) => (
                  <span
                    key={item}
                    className="rounded-full bg-muted/60 px-2.5 py-1 text-xs font-mono"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-border bg-card/60 p-6">
          <div className="mb-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {t.diagramTitle}
          </div>
          <MermaidDiagram chart={CASCADE_CHART} />
        </div>
      </div>
    </section>
  );
}
