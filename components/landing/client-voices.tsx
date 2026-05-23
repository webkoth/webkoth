import { MessageSquare } from "lucide-react";
import { testimonials } from "@/app/data/testimonials";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { Lang } from "./copy-i18n";
import { SectionHeader } from "./section-header";

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

const sectionCopy = {
  ru: {
    eyebrow: "ОТЗЫВЫ",
    title: "Что говорят клиенты",
    sub: "Живые впечатления от тех, с кем уже довели задачу до прода.",
  },
  en: {
    eyebrow: "TESTIMONIALS",
    title: "Client voices",
    sub: "Real impressions from people I've shipped with.",
  },
} as const;

export function ClientVoices({ lang }: { lang: Lang }) {
  if (testimonials.length === 0) return null;
  const s = sectionCopy[lang];

  return (
    <section id="voices" className="relative">
      <div className="mx-auto max-w-7xl px-4 md:px-8 py-20 md:py-28">
        <SectionHeader icon={MessageSquare} eyebrow={s.eyebrow} title={s.title} sub={s.sub} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.map((t) => (
            <Card key={t.id} className="h-full">
              <CardContent className="p-6 flex flex-col gap-5 h-full">
                <p className="text-sm leading-relaxed flex-1">«{t.quote[lang]}»</p>
                <div className="flex items-center gap-3">
                  <Avatar className="size-10 ring-1 ring-primary/15">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {getInitials(t.author)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 text-sm">
                    <div className="font-semibold truncate">{t.author}</div>
                    <div className="text-muted-foreground text-xs mt-0.5 truncate">{t.role[lang]}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
