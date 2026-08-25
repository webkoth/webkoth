import { MetadataRoute } from "next";
import { CASE_SLUGS, casePath } from "@/app/data/cases";
import { LANGS } from "@/app/data/evolution";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://webkoth.com";
  const now = new Date();

  // Страницы кейсов: 18 систем × 2 локали. Собираются из реестра, а не
  // перечисляются руками - иначе новая система появится на сайте, но не в карте.
  const cases: MetadataRoute.Sitemap = LANGS.flatMap((lang) =>
    CASE_SLUGS.map((slug) => ({
      url: `${baseUrl}${casePath(lang, slug)}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  );

  return [
    { url: `${baseUrl}/`, lastModified: now, changeFrequency: "monthly", priority: 1.0 },
    { url: `${baseUrl}/en`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/ru/minasarkisyan`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/en/minasarkisyan`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    ...cases,
  ];
}
