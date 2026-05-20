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

export default function MinasarkisyanPage() {
  const params = useParams();
  const lang = (params?.lang as "en" | "ru") || "en";
  const data = cvData[lang];

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <main className="min-h-screen bg-background">
      {/* Top Controls */}
      <div className="mx-auto flex max-w-4xl items-center justify-end gap-2 px-4 pt-6 md:px-8">
        <LLMDocsButton data={data} lang={lang} />
        <LanguageToggle currentLang={lang} />
        <ModeToggle />
      </div>

      {/* FIRST SCREEN (above the fold) */}
      <section className="mx-auto max-w-4xl space-y-8 px-4 py-10 md:px-8 md:py-14">
        <Header data={data} />
        <Chips groups={data.chipGroups} />
        <HireCta data={data} />
      </section>

      {/* DEEP SECTIONS */}
      <div className="mx-auto max-w-4xl space-y-14 px-4 pb-16 md:space-y-20 md:px-8 md:pb-24">
        <ProductionAI data={data} lang={lang} />
        <OpenSource data={data} lang={lang} />
        <Skills data={data} lang={lang} />
        <Experience data={data} lang={lang} />
        <Portfolio data={data} lang={lang} />
        <Education data={data} lang={lang} />
        <ContentGrid data={data} lang={lang} />
        <HireCta data={data} />
      </div>

      <footer className="mx-auto max-w-4xl border-t border-border px-4 py-8 text-center text-sm text-muted-foreground md:px-8">
        <p>&copy; {new Date().getFullYear()} {data.name}</p>
        <p className="mt-1 text-xs">
          {lang === "en" ? "English: Intermediate" : "Английский: Средний"}
        </p>
      </footer>
    </main>
  );
}
