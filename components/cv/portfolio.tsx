"use client";

import { CVData } from "@/app/data/cv";
import { Users, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PortfolioProps {
  data: CVData;
  lang?: "en" | "ru";
}

export function Portfolio({ data }: PortfolioProps) {
  return (
    <section className="space-y-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {data.portfolio.map((project, index) => {
          const allBadges = Array.from(
            new Set([...project.stack, ...project.technologies]),
          );
          return (
            <div
              key={index}
              className="group relative rounded-xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40"
            >
              <div className="mb-3 flex items-start justify-between gap-2">
                <h3 className="text-base font-bold text-foreground">
                  {project.title}
                </h3>
                {project.aiTag ? (
                  <span
                    className={
                      project.aiTag === "AI"
                        ? "flex-shrink-0 rounded-full bg-primary/15 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-primary"
                        : "flex-shrink-0 rounded-full bg-muted/60 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground"
                    }
                  >
                    {project.aiTag}
                  </span>
                ) : null}
              </div>

              <div className="mb-4 flex items-start gap-2">
                <Zap className="mt-0.5 size-4 shrink-0 text-primary" />
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {project.functionality}
                </p>
              </div>

              <div className="mb-4 flex items-center gap-2 text-xs text-muted-foreground">
                <Users className="size-3.5" />
                <span>{project.team}</span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {allBadges.map((tech) => (
                  <Badge
                    key={tech}
                    variant="secondary"
                    className="border-primary/20 bg-primary/10 px-2 py-0.5 text-xs text-primary"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
