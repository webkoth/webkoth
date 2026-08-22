const offerData: { name: string; priceRu: string; priceEn: string }[] = [
  { name: "AI-MVP Sprint", priceRu: "150000", priceEn: "1500" },
  { name: "Production AI Integration", priceRu: "600000", priceEn: "6000" },
  { name: "Subcontract / Whitelabel", priceRu: "120000", priceEn: "1200" },
];

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
    offers: offerData.map((o) => ({
      "@type": "Offer",
      name: o.name,
      priceSpecification: {
        "@type": "PriceSpecification",
        minPrice: lang === "ru" ? o.priceRu : o.priceEn,
        priceCurrency: lang === "ru" ? "RUB" : "USD",
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
