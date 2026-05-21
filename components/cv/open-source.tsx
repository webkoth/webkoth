"use client";

import type { CVData } from "@/app/data/cv";
import { LiveNpmBadge } from "@/components/landing/live-npm-badge";
import { LiveGhStars } from "@/components/landing/live-gh-stars";

type Props = { data: CVData; lang: "en" | "ru" };

const TOTAL_PUBLISHED = 7;

export function OpenSource({ data, lang }: Props) {
  const title = "Open Source / MCP";
  const sub =
    lang === "en"
      ? "Published packages. Public proof — clickable, verifiable."
      : "Опубликованные пакеты. Публичное доказательство — кликабельно, проверяемо.";

  const featuredLabel =
    lang === "en"
      ? `Featured below — full list of ${TOTAL_PUBLISHED} packages (including 3 marketplace MCPs) on`
      : `Ниже — featured; полный список ${TOTAL_PUBLISHED} пакетов (включая 3 marketplace MCP) на`;

  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {sub}{" "}
          <span>
            {featuredLabel}{" "}
            <a
              href="https://www.npmjs.com/~webkoth"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-4"
            >
              npmjs.com/~webkoth
            </a>
            .
          </span>
        </p>
      </div>
      <div className="space-y-4">
        {data.openSource.map((p) => (
          <div key={p.name} className="rounded-xl border border-border bg-card p-5">
            <div className="mb-2 flex flex-wrap items-center gap-3 min-h-[28px]">
              <h3 className="font-mono text-lg font-semibold">{p.name}</h3>
              {p.npmPkg ? <LiveNpmBadge pkg={p.npmPkg} /> : null}
              <LiveGhStars owner={p.ghOwner} repo={p.ghRepo} />
            </div>
            <p className="mb-3 text-sm leading-relaxed text-muted-foreground">{p.description}</p>
            <div className="mb-3 flex flex-wrap gap-2">
              {p.highlights.map((h) => (
                <span
                  key={h}
                  className="rounded-full bg-muted/60 px-2.5 py-1 text-xs font-mono"
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
