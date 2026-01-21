import { CVData } from "@/app/data/cv";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";

interface AboutProps {
  data: CVData;
  lang: "en" | "ru";
}

export function About({ data, lang }: AboutProps) {
  return (
    <Card>
      <CardHeader className="bg-primary/10 border-b border-primary/20">
        <CardTitle className="flex items-center gap-2 text-primary">
          <User className="w-5 h-5" />
          {lang === "en" ? "About Me" : "Обо мне"}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <p className="leading-relaxed text-muted-foreground">
          {data.about}
        </p>
      </CardContent>
    </Card>
  );
}
