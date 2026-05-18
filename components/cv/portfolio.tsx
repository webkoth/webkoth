"use client"

import { CVData } from "@/app/data/cv";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderOpen, Users, Code, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PortfolioProps {
  data: CVData;
  lang: "en" | "ru";
}

export function Portfolio({ data, lang }: PortfolioProps) {
  return (
    <Card className="p-0 gap-0">
      <CardHeader className="bg-primary/10 border-b border-primary/20 px-6 py-4">
        <CardTitle className="flex items-center gap-2 text-primary">
          <FolderOpen className="w-5 h-5" />
          {lang === "en" ? "Portfolio" : "Портфолио"}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.portfolio.map((project, index) => (
            <div
              key={index}
              className="group relative bg-card border border-border rounded-lg p-5 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              style={{
                animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
              }}
            >
              {/* Project Title - Prominent */}
              <h3 className="font-bold text-lg mb-3 text-primary group-hover:text-primary/90 transition-colors">
                {project.title}
              </h3>

              {/* Functionality - Highlighted as Value Proposition */}
              <div className="mb-4">
                <div className="flex items-start gap-2 mb-2">
                  <Zap className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <p className="text-sm font-medium text-foreground leading-relaxed">
                    {project.functionality}
                  </p>
                </div>
              </div>

              {/* Stack - Visual Badges */}
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

              {/* Team Size - Quick Info */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                <Users className="w-3.5 h-3.5" />
                <span>{project.team}</span>
              </div>

              {/* Technologies - Collapsible on Hover */}
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

              {/* Hover Effect Overlay */}
              <div className="absolute inset-0 rounded-lg bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>
          ))}
        </div>

        <style jsx>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </CardContent>
    </Card>
  );
}
