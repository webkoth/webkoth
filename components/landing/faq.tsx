"use client";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { copy, type Lang } from "./copy-i18n";
import { FaqCodeSnippet } from "./faq-code-snippet";

export function Faq({ lang }: { lang: Lang }) {
  const t = copy[lang].faq;
  const codeQuestionIndex = 1;
  return (
    <section id="faq" className="border-t border-border">
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-20 md:py-28">
        <h2 className="text-2xl md:text-4xl font-semibold tracking-tight mb-12">{t.title}</h2>
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
