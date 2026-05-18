export type Package = "audit" | "mvp" | "support";

export const packages: {
  id: Package;
  priceRu: string;
  priceEn: string;
  duration: { ru: string; en: string };
}[] = [
  {
    id: "audit",
    priceRu: "80 000 ₽",
    priceEn: "$1,000",
    duration: { ru: "1 день", en: "1 day" },
  },
  {
    id: "mvp",
    priceRu: "от 600 000 ₽",
    priceEn: "from $7,500",
    duration: { ru: "1 неделя", en: "1 week" },
  },
  {
    id: "support",
    priceRu: "от 200 000 ₽/мес",
    priceEn: "from $2,500/mo",
    duration: { ru: "по согласованию", en: "discuss" },
  },
];
