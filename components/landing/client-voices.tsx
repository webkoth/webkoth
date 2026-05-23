import { testimonials } from "@/app/data/testimonials";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { Lang } from "./copy-i18n";

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
    <section id="voices" className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,color-mix(in_oklab,var(--chart-1)_8%,transparent),transparent_55%)]"
      />
      <div className="mx-auto max-w-6xl px-4 md:px-8 py-20 md:py-28">
        <div className="mb-12 max-w-2xl">
          <div className="mb-2 font-mono text-xs uppercase tracking-widest text-primary">
            {s.eyebrow}
          </div>
          <h2 className="mb-3 text-2xl md:text-4xl font-semibold tracking-tight">
            {s.title}
          </h2>
          <p className="text-muted-foreground">{s.sub}</p>
        </div>
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
