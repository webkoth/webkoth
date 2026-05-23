"use client";
import { Award } from "lucide-react";
import { copy, type Lang } from "./copy-i18n";
import { StaggerGroup, StaggerItem } from "./stagger";
import { SectionHeader } from "./section-header";

type Item = {
  title: string;
  body: string;
};

function WhyCard({ item, num }: { item: Item; num: string }) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-border bg-card/80 p-5 shadow-sm backdrop-blur md:p-6">
      <div className="mb-2 font-mono text-xs text-primary">{num}</div>
      <h3 className="mb-2 text-lg font-semibold md:text-xl">{item.title}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
        {item.body}
      </p>
    </div>
  );
}

export function WhyMe({ lang }: { lang: Lang }) {
  const t = copy[lang].why;
  const eyebrow = lang === "ru" ? "ПОЧЕМУ Я" : "WHY ME";
  const sub =
    lang === "ru"
      ? "Несколько причин, почему я вам подойду"
      : "A few reasons people pick me — with proof under each one.";

  return (
    <section id="why" className="relative">
      <div className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
        <SectionHeader icon={Award} eyebrow={eyebrow} title={t.title} sub={sub} />

        <div className="relative">
          {/* Desktop: horizontal rail (line + 3 dots) */}
          <div className="relative mb-8 hidden md:block">
            <div className="relative grid grid-cols-3">
              <div
                aria-hidden
                className="pointer-events-none absolute left-[16.667%] right-[16.667%] top-1/2 h-px -translate-y-1/2 bg-border"
              />
              {t.items.map((_, i) => (
                <div key={i} className="relative z-10 flex justify-center">
                  <div className="size-3 rounded-full border-2 border-primary bg-background" />
                </div>
              ))}
            </div>
          </div>

          <StaggerGroup className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
            {t.items.map((item, i) => {
              const num = String(i + 1).padStart(2, "0");
              return (
                <StaggerItem key={item.title}>
                  <WhyCard item={item} num={num} />
                </StaggerItem>
              );
            })}
          </StaggerGroup>
        </div>
      </div>
    </section>
  );
}
