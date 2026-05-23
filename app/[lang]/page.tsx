import type { Lang } from "@/components/landing/copy-i18n";
import { Hero } from "@/components/landing/hero";
import { TaskGrid } from "@/components/landing/task-grid";
import { FeaturedCase } from "@/components/landing/featured-case";
import { CaseGrid } from "@/components/landing/case-grid";
import { ClientVoices } from "@/components/landing/client-voices";
import { WhyMe } from "@/components/landing/why-me";
import { TechStack } from "@/components/landing/tech-stack";
import { RoadmapTimeline } from "@/components/landing/roadmap-timeline";
import { ProcessPricing } from "@/components/landing/process-pricing";
import { Faq } from "@/components/landing/faq";
import { LeadFormModalProvider } from "@/components/landing/lead-form-modal";
import { CommandPalette } from "@/components/landing/command-palette";
import { Footer } from "@/components/landing/footer";
import { SectionReveal } from "@/components/landing/section-reveal";
import { StickyCta } from "@/components/landing/sticky-cta";

type Props = { params: Promise<{ lang: string }> };

export default async function Home({ params }: Props) {
  const { lang: rawLang } = await params;
  const lang = (rawLang === "ru" ? "ru" : "en") as Lang;

  return (
    <LeadFormModalProvider lang={lang}>
      <main className="relative z-[1] min-h-screen">
        <Hero lang={lang} />
        <SectionReveal><TaskGrid lang={lang} /></SectionReveal>
        <SectionReveal><FeaturedCase lang={lang} /></SectionReveal>
        <SectionReveal><CaseGrid lang={lang} /></SectionReveal>
        <SectionReveal><ClientVoices lang={lang} /></SectionReveal>
        <SectionReveal><WhyMe lang={lang} /></SectionReveal>
        <SectionReveal><TechStack lang={lang} /></SectionReveal>
        <SectionReveal><RoadmapTimeline lang={lang} /></SectionReveal>
        <SectionReveal><ProcessPricing lang={lang} /></SectionReveal>
        <SectionReveal><Faq lang={lang} /></SectionReveal>
        <Footer lang={lang} />
        <StickyCta lang={lang} />
        <CommandPalette lang={lang} />
      </main>
    </LeadFormModalProvider>
  );
}
