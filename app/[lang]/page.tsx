import type { Lang } from "@/components/landing/copy-i18n";
import { Hero } from "@/components/landing/hero";
import { TaskGrid } from "@/components/landing/task-grid";
import { FeaturedCase } from "@/components/landing/featured-case";
import { CaseGrid } from "@/components/landing/case-grid";
import { ClientVoices } from "@/components/landing/client-voices";
import { WhyMe } from "@/components/landing/why-me";
import { ProcessPricing } from "@/components/landing/process-pricing";
import { Faq } from "@/components/landing/faq";
import { LeadForm } from "@/components/landing/lead-form";
import { Footer } from "@/components/landing/footer";
import { SectionReveal } from "@/components/landing/section-reveal";
import { StickyCta } from "@/components/landing/sticky-cta";

type Props = { params: Promise<{ lang: string }> };

export default async function Home({ params }: Props) {
  const { lang: rawLang } = await params;
  const lang = (rawLang === "ru" ? "ru" : "en") as Lang;

  return (
    <main className="min-h-screen bg-background">
      <Hero lang={lang} />
      <SectionReveal><TaskGrid lang={lang} /></SectionReveal>
      <SectionReveal><FeaturedCase lang={lang} /></SectionReveal>
      <SectionReveal><CaseGrid lang={lang} /></SectionReveal>
      <SectionReveal><ClientVoices lang={lang} /></SectionReveal>
      <SectionReveal><WhyMe lang={lang} /></SectionReveal>
      <SectionReveal><ProcessPricing lang={lang} /></SectionReveal>
      <SectionReveal><Faq lang={lang} /></SectionReveal>
      <SectionReveal><LeadForm lang={lang} /></SectionReveal>
      <Footer lang={lang} />
      <StickyCta lang={lang} />
    </main>
  );
}
