import Link from "next/link";
import { copy, type Lang } from "./copy-i18n";
import { cvData } from "@/app/data/cv";

export function Footer({ lang }: { lang: Lang }) {
  const t = copy[lang].footer;
  const contacts = cvData[lang].contacts;
  return (
    <footer className="border-t border-border">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-12 space-y-6">
        <p className="text-sm text-muted-foreground">{t.brand}</p>
        <div className="flex flex-wrap gap-4 text-sm">
          <Link href={`/${lang}/minasarkisyan`} className="hover:text-foreground">{t.links.cv}</Link>
          <a href={`https://${contacts.github}`} target="_blank" rel="noreferrer" className="hover:text-foreground">{t.links.github}</a>
          <a href={`https://t.me/${contacts.telegram.replace("@", "")}`} target="_blank" rel="noreferrer" className="hover:text-foreground">{t.links.telegram}</a>
          <a href="https://www.youtube.com/@webkoth" target="_blank" rel="noreferrer" className="hover:text-foreground">{t.links.youtube}</a>
        </div>
        <p className="text-xs text-muted-foreground">{t.copyright}</p>
      </div>
    </footer>
  );
}
