import Link from "next/link";
import { copy, type Lang } from "./copy-i18n";
import { CaseCard } from "./case-card";
import { StaggerGroup, StaggerItem } from "./stagger";

export function CaseGrid({ lang }: { lang: Lang }) {
  const t = copy[lang].cases;
  return (
    <section id="cases" className="border-t border-border">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-20 md:py-28">
        <h2 className="text-2xl md:text-4xl font-semibold tracking-tight mb-12">{t.title}</h2>
        <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {t.items.map((item) => (
            <StaggerItem key={item.id}>
              <CaseCard
                item={item}
                tagLabel={item.audienceTag ? t.tagLabels[item.audienceTag] : undefined}
              />
            </StaggerItem>
          ))}
        </StaggerGroup>
        <div className="mt-10 text-sm text-muted-foreground">
          <Link href={`/${lang}/minasarkisyan`} className="underline underline-offset-4 hover:text-foreground">
            {t.moreLink}
          </Link>
        </div>
      </div>
    </section>
  );
}
