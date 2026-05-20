"use client";

import type { CVData } from "@/app/data/cv";
import { Youtube, Github, Send, Package, FileText, type LucideIcon } from "lucide-react";

const IconMap: Record<string, LucideIcon> = {
  youtube: Youtube,
  github: Github,
  npm: Package,
  telegram: Send,
  blog: FileText,
};

type Props = { data: CVData; lang: "en" | "ru" };

export function ContentGrid({ data, lang }: Props) {
  const title = lang === "en" ? "Content & Channels" : "Контент и каналы";

  return (
    <section className="space-y-5">
      <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">{title}</h2>
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
        {data.content.map((c) => {
          const Icon = IconMap[c.platform] ?? FileText;
          return (
            <a
              key={c.url}
              href={c.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-border bg-card p-4 transition hover:border-primary"
            >
              <div className="mb-2 flex items-center gap-2">
                <Icon className="size-4 text-primary" />
                <span className="text-sm font-semibold">{c.label}</span>
              </div>
              {c.caption ? (
                <p className="text-xs text-muted-foreground">{c.caption}</p>
              ) : null}
            </a>
          );
        })}
      </div>
    </section>
  );
}
