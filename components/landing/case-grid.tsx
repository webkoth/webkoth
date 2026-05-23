"use client";
import { useState } from "react";
import Link from "next/link";
import { Briefcase } from "lucide-react";
import { copy, type Lang } from "./copy-i18n";
import { CaseCard } from "./case-card";
import { StaggerGroup, StaggerItem } from "./stagger";
import { SectionHeader } from "./section-header";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type GroupFilter = "all" | "ai" | "production";
const FILTERS: GroupFilter[] = ["all", "ai", "production"];

export function CaseGrid({ lang }: { lang: Lang }) {
  const t = copy[lang].cases;
  const eyebrow = lang === "ru" ? "ПОРТФОЛИО" : "PORTFOLIO";
  const [filter, setFilter] = useState<GroupFilter>("all");

  const visible =
    filter === "all" ? t.items : t.items.filter((item) => item.group === filter);

  return (
    <section id="cases" className="relative">
      <div className="mx-auto max-w-7xl px-4 md:px-8 py-20 md:py-28">
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeader
            icon={Briefcase}
            eyebrow={eyebrow}
            title={t.title}
            sub={t.sub}
            className="mb-0"
          />

          <Tabs value={filter} onValueChange={(v) => setFilter(v as GroupFilter)}>
            <TabsList>
              {FILTERS.map((f) => {
                const count =
                  f === "all"
                    ? t.items.length
                    : t.items.filter((i) => i.group === f).length;
                return (
                  <TabsTrigger key={f} value={f}>
                    {t.groupLabels[f]}
                    <span className="font-mono text-[10px] text-muted-foreground data-[selected]:text-foreground/70">
                      {count}
                    </span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>
        </div>

        <StaggerGroup
          key={filter}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {visible.map((item) => (
            <StaggerItem key={item.id}>
              <CaseCard item={item} groupLabel={t.groupLabels[item.group]} />
            </StaggerItem>
          ))}
        </StaggerGroup>

        <div className="mt-10 text-sm text-muted-foreground">
          <Link
            href={`/${lang}/minasarkisyan`}
            className="underline underline-offset-4 hover:text-foreground"
          >
            {t.moreLink}
          </Link>
        </div>
      </div>
    </section>
  );
}
