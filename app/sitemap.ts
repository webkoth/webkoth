import { MetadataRoute } from "next";
import { casePath } from "@/app/data/cases";
import { SHOWN_CASE_SLUGS } from "@/app/data/avtomatizaciya";

// С 25.10.2026 в карте только главная-оффер, кейсы её направлений и политика.
// Резюме открывается по прямой ссылке и в карту не входит.
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://webkoth.com";
  const now = new Date();

  const cases: MetadataRoute.Sitemap = SHOWN_CASE_SLUGS.map((slug) => ({
    url: `${baseUrl}${casePath("ru", slug)}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [
    { url: `${baseUrl}/`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    ...cases,
    { url: `${baseUrl}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];
}
