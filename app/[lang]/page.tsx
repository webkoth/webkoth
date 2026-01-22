"use client"

import { cvData } from "@/app/data/cv";
import { Header } from "@/components/cv/header";
import { Contacts } from "@/components/cv/contacts";
import { About } from "@/components/cv/about";
import { Skills } from "@/components/cv/skills";
import { VideoBlock } from "@/components/cv/video-block";
import { Experience } from "@/components/cv/experience";
import { Education } from "@/components/cv/education";
import { Portfolio } from "@/components/cv/portfolio";
import { ModeToggle } from "@/components/mode-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { LLMDocsButton } from "@/components/llm-docs-button";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const params = useParams();
  const lang = (params?.lang as "en" | "ru") || "en";
  const data = cvData[lang];

  // Update html lang attribute
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <main className="min-h-screen bg-background p-4 md:p-8 lg:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Top Controls */}
        <div className="flex items-center justify-end gap-2 mb-6">
          <div className="flex items-center gap-2">
            <LLMDocsButton data={data} lang={lang} />
            <LanguageToggle currentLang={lang} />
            <ModeToggle />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar (or Top on mobile): Header, Contacts, Skills */}
          <div className="space-y-8 lg:col-span-1">
            <Header data={data} />
            <Contacts data={data} lang={lang} />
            <Skills data={data} lang={lang} />
            <VideoBlock data={data} lang={lang} />
          </div>

          {/* Right Main Content (or Bottom on mobile): Experience, Education, About */}
          <div className="space-y-8 lg:col-span-2">
            <Experience data={data} lang={lang} />
            <Education data={data} lang={lang} />
            <About data={data} lang={lang} />
          </div>
        </div>

        {/* Portfolio Section - Full Width */}
        <div className="mt-12">
          <Portfolio data={data} lang={lang} />
        </div>

        <footer className="text-center text-sm text-muted-foreground pt-8 pb-4 border-t border-border mt-8">
          <p>&copy; {new Date().getFullYear()} {data.name}</p>
          <p className="mt-1 text-xs">
            {lang === "en" ? "English: Intermediate" : "Английский: Средний"}
          </p>
        </footer>
      </div>
    </main>
  );
}
