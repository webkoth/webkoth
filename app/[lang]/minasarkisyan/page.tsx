"use client";

import { cvData } from "@/app/data/cv";
import { Header } from "@/components/cv/header";
import { Chips } from "@/components/cv/chips";
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

const SECTION_LABELS = {
  en: {
    snapshot: "01 · Snapshot",
    productionAI: "02 · Production AI",
    openSource: "03 · Open Source",
    skills: "04 · Skills",
    experience: "05 · Experience",
    portfolio: "06 · Portfolio",
    education: "07 · Education",
    content: "08 · Content",
  },
  ru: {
    snapshot: "01 · Профиль",
    productionAI: "02 · Production AI",
    openSource: "03 · Open Source",
    skills: "04 · Навыки",
    experience: "05 · Опыт",
    portfolio: "06 · Портфолио",
    education: "07 · Образование",
    content: "08 · Контент",
  },
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-6 text-[11px] font-mono uppercase tracking-[0.18em] text-muted-foreground">
      {children}
    </div>
  );
}

export default function MinasarkisyanPage() {
  const params = useParams();
  const lang = (params?.lang as "en" | "ru") || "en";
  const data = cvData[lang];
  const labels = SECTION_LABELS[lang];

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <main className="min-h-screen bg-background">
      <div className="border-b border-border">
        <div className="mx-auto flex max-w-5xl items-center justify-end gap-2 px-4 py-3 md:px-8">
          <LLMDocsButton data={data} lang={lang} />
          <LanguageToggle currentLang={lang} />
          <ModeToggle />
        </div>
      </div>

      <section className="mx-auto max-w-5xl px-4 py-10 md:px-8 md:py-14">
        <SectionLabel>{labels.snapshot}</SectionLabel>
        <div className="space-y-8">
          <Header data={data} />
          <Chips groups={data.chipGroups} />
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 md:px-8">
        <div className="border-t border-border py-12 md:py-16">
          <SectionLabel>{labels.productionAI}</SectionLabel>
          <ProductionAI data={data} lang={lang} />
        </div>
        <div className="border-t border-border py-12 md:py-16">
          <SectionLabel>{labels.openSource}</SectionLabel>
          <OpenSource data={data} lang={lang} />
        </div>
        <div className="border-t border-border py-12 md:py-16">
          <SectionLabel>{labels.skills}</SectionLabel>
          <Skills data={data} lang={lang} />
        </div>
        <div className="border-t border-border py-12 md:py-16">
          <SectionLabel>{labels.experience}</SectionLabel>
          <Experience data={data} lang={lang} />
        </div>
        <div className="border-t border-border py-12 md:py-16">
          <SectionLabel>{labels.portfolio}</SectionLabel>
          <Portfolio data={data} lang={lang} />
        </div>
        <div className="border-t border-border py-12 md:py-16">
          <SectionLabel>{labels.content}</SectionLabel>
          <ContentGrid data={data} lang={lang} />
        </div>
      </div>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-2 px-4 py-8 text-center text-sm text-muted-foreground md:flex-row md:justify-between md:px-8 md:text-left">
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
            webkoth.com
          </Link>
        </div>
      </footer>
    </main>
  );
}
