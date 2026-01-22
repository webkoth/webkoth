import { CVData } from "@/app/data/cv";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderOpen } from "lucide-react";
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
      <CardContent className="p-6 space-y-6">
        {data.portfolio.map((project, index) => (
          <div key={index} className="border-b border-border pb-6 last:border-b-0 last:pb-0">
            <h3 className="font-bold text-lg mb-3">{project.title}</h3>
            
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-semibold text-primary">
                  {lang === "en" ? "Stack:" : "Стек:"}
                </span>{" "}
                <span className="text-muted-foreground">{project.stack.join(" | ")}</span>
              </div>
              
              <div>
                <span className="font-semibold text-primary">
                  {lang === "en" ? "Team:" : "Команда:"}
                </span>{" "}
                <span className="text-muted-foreground">{project.team}</span>
              </div>
              
              <div>
                <span className="font-semibold text-primary">
                  {lang === "en" ? "Functionality:" : "Функционал:"}
                </span>{" "}
                <span className="text-muted-foreground">{project.functionality}</span>
              </div>
              
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="font-semibold text-primary text-sm">
                  {lang === "en" ? "Technologies:" : "Технологии:"}
                </span>
                {project.technologies.map((tech, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
