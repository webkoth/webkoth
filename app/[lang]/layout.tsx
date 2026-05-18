import type { Metadata } from "next";
import { JsonLdProfessionalService } from "@/components/json-ld-professional-service";

type Props = {
  params: Promise<{ lang: string }>;
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const lang = (rawLang === "ru" ? "ru" : "en") as "en" | "ru";
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://webkoth.com";

  const titleRu = "Минас Саркисян — внедрение ИИ в продукты";
  const titleEn = "Minas Sarkisyan — AI integration for products";
  const descRu = "Аудит за день, MVP за неделю. RAG, LLM-агенты, MCP, multi-provider cascade.";
  const descEn = "Audit in a day, MVP in a week. RAG, LLM agents, MCP, multi-provider cascade.";

  return {
    title: { default: lang === "ru" ? titleRu : titleEn, template: "%s | Minas Sarkisyan" },
    description: lang === "ru" ? descRu : descEn,
    alternates: {
      canonical: `${baseUrl}/${lang}`,
      languages: { en: `${baseUrl}/en`, ru: `${baseUrl}/ru`, "x-default": `${baseUrl}/en` },
    },
    openGraph: {
      type: "website",
      locale: lang === "en" ? "en_US" : "ru_RU",
      alternateLocale: lang === "en" ? ["ru_RU"] : ["en_US"],
      url: `${baseUrl}/${lang}`,
      siteName: lang === "ru" ? titleRu : titleEn,
      title: lang === "ru" ? titleRu : titleEn,
      description: lang === "ru" ? descRu : descEn,
    },
    twitter: {
      card: "summary_large_image",
      title: lang === "ru" ? titleRu : titleEn,
      description: lang === "ru" ? descRu : descEn,
      creator: "@minasarkisyan",
    },
  };
}

export default async function LangLayout({ params, children }: Props) {
  const { lang: rawLang } = await params;
  const lang = (rawLang === "ru" ? "ru" : "en") as "en" | "ru";
  return (
    <>
      <JsonLdProfessionalService lang={lang} />
      {children}
    </>
  );
}
