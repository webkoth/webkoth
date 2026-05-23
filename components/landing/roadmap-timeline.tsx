"use client";

import type { Lang } from "./copy-i18n";
import { copy } from "./copy-i18n";
import { StaggerGroup, StaggerItem } from "./stagger";

type Step = {
  num: string;
  title: string;
  body: string;
  pill: string;
};

function StepCard({ step }: { step: Step }) {
  return (
    <div className="rounded-2xl border border-border bg-card/80 p-5 md:p-6 backdrop-blur shadow-sm">
      <div className="mb-2 font-mono text-xs text-primary">{step.num}</div>
      <h3 className="mb-2 text-lg font-semibold md:text-xl">{step.title}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground md:text-base">{step.body}</p>
      <div className="mt-4 inline-block rounded-full bg-primary/10 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-primary">
        {step.pill}
      </div>
    </div>
  );
}

export function RoadmapTimeline({ lang }: { lang: Lang }) {
  const t = copy[lang].roadmap;

  return (
    <section
      id="roadmap"
      className="relative overflow-hidden"
    >
      {/* Subtle peach corner gradient */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(255,180,120,0.05),transparent_60%),radial-gradient(circle_at_bottom_right,rgba(180,170,255,0.04),transparent_60%)]"
      />

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-20 md:py-28">
        <div className="mb-14 max-w-2xl">
          <div className="mb-2 font-mono text-xs uppercase tracking-widest text-primary">
            {t.eyebrow}
          </div>
          <h2 className="text-2xl md:text-4xl font-semibold tracking-tight mb-3">{t.title}</h2>
          <p className="text-muted-foreground">{t.sub}</p>
        </div>

        <div className="relative">
          {/* Center vertical line — desktop only */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-border md:block"
          />

          <StaggerGroup className="flex flex-col gap-10 md:gap-16">
            {t.steps.map((step, i) => {
              const isLeft = i % 2 === 0;
              return (
                <StaggerItem key={step.num}>
                  <div className="relative md:flex md:items-start md:gap-8">
                    {/* Mobile: single column */}
                    <div className="md:hidden">
                      <StepCard step={step} />
                    </div>

                    {/* Desktop: zigzag */}
                    <div
                      className={`hidden md:block md:w-1/2 ${isLeft ? "md:pr-10" : "md:pr-10 md:invisible"}`}
                    >
                      {isLeft && <StepCard step={step} />}
                    </div>

                    {/* Center node */}
                    <div
                      aria-hidden
                      className="absolute left-1/2 top-4 hidden size-3 -translate-x-1/2 rounded-full border-2 border-primary bg-background md:block"
                    />

                    <div
                      className={`hidden md:block md:w-1/2 ${!isLeft ? "md:pl-10" : "md:pl-10 md:invisible"}`}
                    >
                      {!isLeft && <StepCard step={step} />}
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerGroup>
        </div>
      </div>
    </section>
  );
}
