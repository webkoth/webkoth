"use client";
import { useState } from "react";
import Link from "next/link";
import { copy, type Lang } from "./copy-i18n";
import { CaseCard } from "./case-card";
import { StaggerGroup, StaggerItem } from "./stagger";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type AudienceFilter = "all" | "founder" | "smb" | "agency";

const FILTERS: AudienceFilter[] = ["all", "founder", "smb", "agency"];

const filterLabels: Record<Lang, Record<AudienceFilter, string>> = {
  ru: { all: "Все", founder: "Фаундеру", smb: "SMB", agency: "Агентству" },
  en: { all: "All", founder: "Founder", smb: "SMB", agency: "Agency" },
};

export function CaseGrid({ lang }: { lang: Lang }) {
  const t = copy[lang].cases;
  const eyebrow = lang === "ru" ? "ПОРТФОЛИО" : "PORTFOLIO";
  const sub =
    lang === "ru"
      ? "Кейсы по аудитории — для фаундеров, SMB и агентств."
      : "Cases by audience — founders, SMB and agencies.";
  const [filter, setFilter] = useState<AudienceFilter>("all");

  const visible =
    filter === "all"
      ? t.items
      : t.items.filter((item) => item.audienceTag === filter);

  return (
    <section id="cases" className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_bottom_left,color-mix(in_oklab,var(--chart-2)_7%,transparent),transparent_55%)]"
      />
      <div className="mx-auto max-w-6xl px-4 md:px-8 py-20 md:py-28">
        <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <div className="mb-2 font-mono text-xs uppercase tracking-widest text-primary">
              {eyebrow}
            </div>
            <h2 className="mb-3 text-2xl md:text-4xl font-semibold tracking-tight">{t.title}</h2>
            <p className="text-muted-foreground">{sub}</p>
          </div>

          <Tabs value={filter} onValueChange={(v) => setFilter(v as AudienceFilter)}>
            <TabsList className="h-10 p-1">
              {FILTERS.map((f) => (
                <TabsTrigger key={f} value={f} className="px-3.5 text-sm">
                  {filterLabels[lang][f]}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <StaggerGroup
          key={filter}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {visible.map((item) => (
            <StaggerItem key={item.id}>
              <CaseCard
                item={item}
                tagLabel={item.audienceTag ? t.tagLabels[item.audienceTag] : undefined}
              />
            </StaggerItem>
          ))}
        </StaggerGroup>

        <div className="mt-10 text-sm text-muted-foreground">
          <Link href={`/${lang}/minasarkisyan`} className="underline underline-offset-4 hover:text-foreground">
            {t.moreLink}
          </Link>
        </div>
      </div>
    </section>
  );
}
