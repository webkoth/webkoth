"use client";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { copy, type Lang } from "./copy-i18n";
import { FaqCodeSnippet } from "./faq-code-snippet";

export function Faq({ lang }: { lang: Lang }) {
  const t = copy[lang].faq;
  const codeQuestionIndex = 1;
  const eyebrow = "FAQ";
  const sub =
    lang === "ru"
      ? "Самые частые вопросы перед стартом — собрал коротко и по делу."
      : "The most common questions before kickoff — short and to the point.";
  return (
    <section id="faq" className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center_top,color-mix(in_oklab,var(--primary)_5%,transparent),transparent_45%)]"
      />
      <div className="mx-auto max-w-3xl px-4 md:px-8 py-20 md:py-28">
        <div className="mb-12">
          <div className="mb-2 font-mono text-xs uppercase tracking-widest text-primary">
            {eyebrow}
          </div>
          <h2 className="mb-3 text-2xl md:text-4xl font-semibold tracking-tight">{t.title}</h2>
          <p className="text-muted-foreground">{sub}</p>
        </div>
        <Accordion className="w-full">
          {t.items.map((item, i) => (
            <AccordionItem key={item.q} value={`q-${i}`}>
              <AccordionTrigger className="text-left">{item.q}</AccordionTrigger>
              <AccordionContent className="space-y-4 text-muted-foreground">
                <p>{item.a}</p>
                {i === codeQuestionIndex && (
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-wide">{t.codeSnippetTitle}</p>
                    <FaqCodeSnippet code={t.codeSnippet} lang="ts" />
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
