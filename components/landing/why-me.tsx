// components/landing/why-me.tsx
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { copy, type Lang } from "./copy-i18n";

export function WhyMe({ lang }: { lang: Lang }) {
  const t = copy[lang].why;
  return (
    <section id="why" className="border-t border-border">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-20 md:py-28">
        <h2 className="text-2xl md:text-4xl font-semibold tracking-tight mb-12">{t.title}</h2>
        <div className="space-y-12 md:space-y-16">
          {t.items.map((item, i) => {
            const proofProps = item.proofHref
              ? { href: item.proofHref, target: "_blank", rel: "noreferrer" }
              : { href: item.proofAnchor ?? "#" };
            const num = String(i + 1).padStart(2, "0");
            return (
              <article key={item.title} className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8">
                <div className="md:col-span-1">
                  <span
                    aria-hidden
                    className="font-serif italic text-4xl md:text-5xl text-muted-foreground/40 leading-none tabular-nums"
                  >
                    {num}
                  </span>
                </div>
                <div className="md:col-span-4 border-l-2 border-primary/40 pl-5">
                  <h3 className="text-lg md:text-xl font-medium">{item.title}</h3>
                </div>
                <div className="md:col-span-7 space-y-3">
                  <p className="text-muted-foreground leading-relaxed">{item.body}</p>
                  <Link {...proofProps} className="inline-flex items-center gap-1 text-sm hover:underline">
                    {item.proofLabel} <ArrowRight className="size-3.5" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
