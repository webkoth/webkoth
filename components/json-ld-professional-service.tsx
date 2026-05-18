import { packages } from "@/lib/landing/pricing";

export function JsonLdProfessionalService({ lang }: { lang: "en" | "ru" }) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://webkoth.com";

  const data = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: lang === "ru" ? "Минас Саркисян — внедрение ИИ в продукты" : "Minas Sarkisyan — AI integration for products",
    description: lang === "ru"
      ? "Услуги внедрения LLM, RAG, агентов и MCP в продукты. Аудит за день, MVP за неделю."
      : "LLM, RAG, agents and MCP integration into products. Audit in a day, MVP in a week.",
    url: `${baseUrl}/${lang}`,
    provider: {
      "@type": "Person",
      name: "Minas Sarkisyan",
      url: `${baseUrl}/${lang}/minasarkisyan`,
      sameAs: ["https://github.com/webkoth", "https://t.me/abnorsky"],
    },
    areaServed: { "@type": "Place", name: lang === "ru" ? "Россия и зарубежные удалённые проекты" : "Russia and worldwide remote" },
    offers: packages.map((p) => ({
      "@type": "Offer",
      name: p.id,
      price: lang === "ru" ? p.priceRu : p.priceEn,
      priceCurrency: lang === "ru" ? "RUB" : "USD",
    })),
  };

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
