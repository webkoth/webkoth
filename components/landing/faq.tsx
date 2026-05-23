"use client";
import { HelpCircle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { copy, type Lang } from "./copy-i18n";
import { FaqCodeSnippet } from "./faq-code-snippet";
import { SectionHeader } from "./section-header";

export function Faq({ lang }: { lang: Lang }) {
  const t = copy[lang].faq;
  const codeQuestionIndex = 1;
  const eyebrow = "FAQ";
  const sub =
    lang === "ru"
      ? "Самые частые вопросы перед стартом — собрал коротко и по делу."
      : "The most common questions before kickoff — short and to the point.";
  return (
    <section id="faq" className="relative">
      <div className="mx-auto max-w-7xl px-4 md:px-8 py-20 md:py-28">
        <SectionHeader icon={HelpCircle} eyebrow={eyebrow} title={t.title} sub={sub} />
        <Accordion className="w-full max-w-3xl">
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
