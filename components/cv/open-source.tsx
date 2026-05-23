"use client";

import type { CVData } from "@/app/data/cv";

type Props = { data: CVData; lang?: "en" | "ru" };

export function OpenSource({ data }: Props) {
  return (
    <section className="space-y-5">
      <div className="space-y-4">
        {data.openSource.map((p) => (
          <div key={p.name} className="rounded-xl border border-border bg-card p-5">
            <div className="mb-2 flex flex-wrap items-center gap-3">
              <h3 className="font-mono text-lg font-semibold">{p.name}</h3>
            </div>
            <p className="mb-3 text-sm leading-relaxed text-muted-foreground">{p.description}</p>
            <div className="mb-3 flex flex-wrap gap-2">
              {p.highlights.map((h) => (
                <span
                  key={h}
                  className="rounded-full bg-muted/60 px-2.5 py-1 font-mono text-xs"
                >
                  {h}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-4 text-sm">
              {p.npmPkg ? (
                <a
                  href={`https://www.npmjs.com/package/${p.npmPkg}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-4"
                >
                  npm
                </a>
              ) : null}
              <a
                href={`https://github.com/${p.ghOwner}/${p.ghRepo}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-4"
              >
                GitHub
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
