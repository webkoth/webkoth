import { testimonials } from "@/app/data/testimonials";
import { Card, CardContent } from "@/components/ui/card";
import type { Lang } from "./copy-i18n";

const sectionCopy = {
  ru: { title: "Что говорят клиенты" },
  en: { title: "Client voices" },
} as const;

export function ClientVoices({ lang }: { lang: Lang }) {
  if (testimonials.length === 0) return null;

  return (
    <section id="voices" className="border-t border-border">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-20 md:py-28">
        <h2 className="text-2xl md:text-4xl font-semibold tracking-tight mb-12">
          {sectionCopy[lang].title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.map((t) => (
            <Card key={t.id} className="h-full">
              <CardContent className="p-6 flex flex-col gap-4 h-full">
                <p className="text-sm leading-relaxed flex-1">«{t.quote[lang]}»</p>
                <div className="text-sm">
                  <div className="font-semibold">{t.author}</div>
                  <div className="text-muted-foreground text-xs mt-0.5">{t.role[lang]}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
