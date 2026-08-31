import type { Metadata } from "next";
import { JsonLdPerson } from "@/components/json-ld-person";
import { cvData } from "@/app/data/cv";
import { use } from "react";

type Props = {
  params: Promise<{ lang: string }>;
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const lang = (rawLang === "ru" ? "ru" : "en") as "en" | "ru";
  const data = cvData[lang];
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://webkoth.com';

  return {
    title: {
      default: lang === "en"
        ? "Minas Sarkisyan · Senior Fullstack & AI Engineer | Python, MCP, RAG, LLM"
        : "Минас Саркисян · Senior Fullstack & AI Engineer | Python, MCP, RAG, LLM",
      template: "%s | Minas Sarkisyan"
    },
    description: lang === "en"
      ? "Senior Fullstack / AI Engineer. 10+ years in production. Python, FastAPI, TypeScript, React, PHP. 2.5 years deep with LLMs: MCP (7 npm servers, including 3 for marketplaces), multi-provider cascade, RAG, agents. Currently: HubMarket (AI-SaaS founder). Open to roles and contract work."
      : "Senior Fullstack / AI-инженер. 10+ лет опыта. Python, FastAPI, TypeScript, React, PHP. 2.5 года плотно с LLM: MCP (7 npm-серверов, включая 3 для маркетплейсов), multi-provider cascade, RAG, агенты. Сейчас: Сколково (5+ продуктов) + HubMarket (AI-SaaS founder). Открыт к вакансиям и контрактной работе.",
    keywords: [
      "Senior Fullstack Engineer",
      "AI Engineer",
      "Python",
      "FastAPI",
      "asyncio",
      "TypeScript",
      "Node.js",
      "React",
      "Next.js",
      "PHP",
      "Laravel",
      "LLM",
      "Anthropic Claude",
      "OpenAI",
      "MCP",
      "Model Context Protocol",
      "RAG",
      "pgvector",
      "vector database",
      "Multi-provider cascade",
      "tool calling",
      "structured output",
      "Docker",
      "PostgreSQL",
      "production AI",
      "open to relocation",
      "remote",
      lang === "en" ? "Krasnodar" : "Краснодар",
    ],
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
    alternates: {
      canonical: `${baseUrl}/${lang}/minasarkisyan`,
      languages: {
        'en': `${baseUrl}/en/minasarkisyan`,
        'ru': `${baseUrl}/ru/minasarkisyan`,
        'x-default': `${baseUrl}/en/minasarkisyan`,
      },
    },
    openGraph: {
      type: 'website',
      locale: lang === "en" ? 'en_US' : 'ru_RU',
      alternateLocale: lang === "en" ? ['ru_RU'] : ['en_US'],
      url: `${baseUrl}/${lang}/minasarkisyan`,
      siteName: 'Minas Sarkisyan - CV',
      title: `${data.name} - ${data.role}`,
      description: data.about,
      images: [
        {
          url: `${baseUrl}/images/profile.jpg`,
          width: 400,
          height: 400,
          alt: data.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${data.name} - ${data.role}`,
      description: data.about,
      images: [`${baseUrl}/images/profile.jpg`],
      creator: '@minasarkisyan',
    },
  };
}

export default function LangLayout({ params, children }: Props) {
  const { lang: rawLang } = use(params);
  const lang = (rawLang === "ru" ? "ru" : "en") as "en" | "ru";
  const data = cvData[lang];

  return (
    <>
      <JsonLdPerson data={data} lang={lang} />
      {children}
    </>
  );
}
