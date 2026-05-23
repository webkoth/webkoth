"use client";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { PaletteToggle } from "@/components/palette-toggle";
import { copy, type Lang } from "./copy-i18n";
import { MetricsBar } from "./metrics-bar";
import { HeroServicesMockup } from "./hero-services-mockup";
import { useLeadForm } from "./lead-form-modal";
import { Magnetic } from "./magnetic";
import { LandingLLMDocsButton } from "./landing-llm-docs-button";

export function Hero({ lang }: { lang: Lang }) {
  const t = copy[lang];
  const { open } = useLeadForm();
  return (
    <section id="hero" className="relative">
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-6 pb-16 md:pb-24">
        <nav className="flex items-center justify-between mb-16 md:mb-24">
          <span className="font-mono text-sm text-muted-foreground">{t.nav.brand}</span>
          <div className="flex items-center gap-2">
            <LandingLLMDocsButton lang={lang} />
            <LanguageToggle currentLang={lang} />
            <PaletteToggle />
            <ModeToggle />
          </div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <div className="lg:col-span-7">
            <h1 className="text-4xl md:text-7xl lg:text-[5rem] lg:leading-[1.02] font-extrabold tracking-tighter">
              {t.hero.h1}
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl">{t.hero.sub}</p>

            <p className="mt-6 font-mono text-sm md:text-base text-muted-foreground">
              {t.hero.specs.join(" · ")}
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-3">
              <Magnetic className="inline-block">
                <Button
                  size="lg"
                  onClick={() => open({ package: "auditOnly" })}
                >
                  {t.hero.ctaSecondary}
                </Button>
              </Magnetic>
            </div>
          </div>

          <div className="lg:col-span-5 lg:scale-[1.1] lg:origin-right">
            <HeroServicesMockup />
          </div>
        </div>

        <MetricsBar lang={lang} />
      </div>
    </section>
  );
}
