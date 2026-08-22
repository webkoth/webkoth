import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://webkoth.com";
  const now = new Date();

  return [
    { url: `${baseUrl}/`, lastModified: now, changeFrequency: "monthly", priority: 1.0 },
    { url: `${baseUrl}/en`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/ru/minasarkisyan`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/en/minasarkisyan`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ];
}
