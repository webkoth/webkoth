"use client";

import { CVData } from "@/app/data/cv";
import { Users, Code, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PortfolioProps {
  data: CVData;
  lang: "en" | "ru";
}

export function Portfolio({ data, lang }: PortfolioProps) {
  const title = lang === "en" ? "Portfolio" : "Портфолио";

  return (
    <section className="space-y-5">
      <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">{title}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.portfolio.map((project, index) => (
          <div
            key={index}
            className="group relative rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/40 hover:-translate-y-0.5"
          >
            <div className="mb-3 flex items-start justify-between gap-2">
              <h3 className="font-bold text-base text-foreground">
                {project.title}
              </h3>
              {project.aiTag ? (
                <span
                  className={
                    project.aiTag === "AI"
                      ? "flex-shrink-0 rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-primary"
                      : "flex-shrink-0 rounded-full bg-muted/60 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-muted-foreground"
                  }
                >
                  {project.aiTag}
                </span>
              ) : null}
            </div>

            <div className="mb-4 flex items-start gap-2">
              <Zap className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <p className="text-sm leading-relaxed text-muted-foreground">
                {project.functionality}
              </p>
            </div>

            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Code className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs font-semibold text-muted-foreground uppercase">
                  {lang === "en" ? "Tech Stack" : "Технологии"}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {project.stack.slice(0, 4).map((tech, i) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className="text-xs px-2 py-0.5 bg-primary/10 text-primary border-primary/20"
                  >
                    {tech}
                  </Badge>
                ))}
                {project.stack.length > 4 && (
                  <Badge variant="secondary" className="text-xs px-2 py-0.5">
                    +{project.stack.length - 4}
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
              <Users className="w-3.5 h-3.5" />
              <span>{project.team}</span>
            </div>

            <div className="mt-4 pt-3 border-t border-border">
              <div className="flex flex-wrap gap-1.5 opacity-70 group-hover:opacity-100 transition-opacity">
                {project.technologies.slice(0, 3).map((tech, i) => (
                  <Badge key={i} variant="outline" className="text-xs">
                    {tech}
                  </Badge>
                ))}
                {project.technologies.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{project.technologies.length - 3}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
