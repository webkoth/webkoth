"use client";

import { cvData } from "@/app/data/cv";
import { Header } from "@/components/cv/header";
import { Chips } from "@/components/cv/chips";
import { HireCta } from "@/components/cv/hire-cta";
import { ProductionAI } from "@/components/cv/production-ai";
import { OpenSource } from "@/components/cv/open-source";
import { Skills } from "@/components/cv/skills";
import { Experience } from "@/components/cv/experience";
import { Portfolio } from "@/components/cv/portfolio";
import { Education } from "@/components/cv/education";
import { ContentGrid } from "@/components/cv/content-grid";
import { ModeToggle } from "@/components/mode-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { LLMDocsButton } from "@/components/llm-docs-button";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function MinasarkisyanPage() {
  const params = useParams();
  const lang = (params?.lang as "en" | "ru") || "en";
  const data = cvData[lang];

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <main className="min-h-screen bg-background">
      {/* Top Controls — separated by border */}
      <div className="border-b border-border">
        <div className="mx-auto flex max-w-4xl items-center justify-end gap-2 px-4 py-3 md:px-8">
          <LLMDocsButton data={data} lang={lang} />
          <LanguageToggle currentLang={lang} />
          <ModeToggle />
        </div>
      </div>

      {/* FIRST SCREEN (above the fold) */}
      <section className="mx-auto max-w-4xl space-y-7 px-4 py-8 md:px-8 md:py-12">
        <Header data={data} />
        <Chips groups={data.chipGroups} />
        <HireCta data={data} />
      </section>

      {/* DEEP SECTIONS — each with top border for visual chapter separation */}
      <div className="mx-auto max-w-4xl px-4 md:px-8">
        <div className="py-12 md:py-16">
          <ProductionAI data={data} lang={lang} />
        </div>
        <div className="border-t border-border py-12 md:py-16">
          <OpenSource data={data} lang={lang} />
        </div>
        <div className="border-t border-border py-12 md:py-16">
          <Skills data={data} lang={lang} />
        </div>
        <div className="border-t border-border py-12 md:py-16">
          <Experience data={data} lang={lang} />
        </div>
        <div className="border-t border-border py-12 md:py-16">
          <Portfolio data={data} lang={lang} />
        </div>
        <div className="border-t border-border py-12 md:py-16">
          <Education data={data} lang={lang} />
        </div>
        <div className="border-t border-border py-12 md:py-16">
          <ContentGrid data={data} lang={lang} />
        </div>

        {/* Compact CTA before footer */}
        <div className="border-t border-border py-10">
          <HireCta data={data} variant="compact" />
        </div>
      </div>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-2 px-4 py-8 text-center text-sm text-muted-foreground md:flex-row md:justify-between md:px-8 md:text-left">
          <div>
            <p>&copy; {new Date().getFullYear()} {data.name}</p>
            <p className="mt-0.5 text-xs">
              {lang === "en" ? "English: Intermediate" : "Английский: Средний"}
            </p>
          </div>
          <Link
            href={`/${lang}`}
            className="text-xs underline underline-offset-4 hover:text-foreground"
          >
            ← webkoth.com
          </Link>
        </div>
      </footer>
    </main>
  );
}
