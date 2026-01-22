import type { Metadata } from "next";
import { JsonLdPerson } from "@/components/json-ld-person";
import { cvData } from "@/app/data/cv";

type Props = {
  params: { lang: "en" | "ru" };
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = params.lang || "en";
  const data = cvData[lang];
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://webkoth.com';

  return {
    title: {
      default: lang === "en" 
        ? "Minas Sarkisyan - Fullstack Engineer | CV"
        : "Минас Саркисян - Fullstack Engineer | Резюме",
      template: "%s | Minas Sarkisyan"
    },
    description: data.about,
    alternates: {
      canonical: `${baseUrl}/${lang}`,
      languages: {
        'en': `${baseUrl}/en`,
        'ru': `${baseUrl}/ru`,
        'x-default': `${baseUrl}/en`,
      },
    },
    openGraph: {
      type: 'website',
      locale: lang === "en" ? 'en_US' : 'ru_RU',
      alternateLocale: lang === "en" ? ['ru_RU'] : ['en_US'],
      url: `${baseUrl}/${lang}`,
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
  const lang = (params?.lang as "en" | "ru") || "en";
  const data = cvData[lang];

  return (
    <>
      <JsonLdPerson data={data} lang={lang} />
      {children}
    </>
  );
}
