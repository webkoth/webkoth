import type { Metadata } from "next";
import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const jetbrainsMono = JetBrains_Mono({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://webkoth.com';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Minas Sarkisyan - Fullstack Engineer | CV",
    template: "%s | Minas Sarkisyan"
  },
  description: "Fullstack Engineer with 9+ years of experience in building complex web applications (ERP, CRM, Marketplaces). Specializing in Laravel ecosystem and modern JavaScript frameworks (Vue, React).",
  keywords: [
    "Minas Sarkisyan",
    "Fullstack Engineer",
    "Backend Developer",
    "PHP Developer",
    "Laravel Developer",
    "Fullstack PHP",
    "Laravel",
    "Symfony",
    "Vue.js",
    "React",
    "Next.js",
    "TypeScript",
    "PostgreSQL",
    "MySQL",
    "Microservices",
    "REST API",
    "ERP",
    "CRM",
    "Marketplace Development",
    "Web Development",
    "Software Engineer",
    "CV",
    "Resume"
  ],
  authors: [{ name: "Minas Sarkisyan", url: baseUrl }],
  creator: "Minas Sarkisyan",
  publisher: "Minas Sarkisyan",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['ru_RU'],
    url: baseUrl,
    siteName: 'Minas Sarkisyan - CV',
    title: 'Minas Sarkisyan - Fullstack Engineer',
    description: 'Fullstack Engineer with 9+ years of experience in building complex web applications (ERP, CRM, Marketplaces). Specializing in Laravel ecosystem and modern JavaScript frameworks.',
    images: [
      {
        url: `${baseUrl}/images/profile.jpg`,
        width: 400,
        height: 400,
        alt: 'Minas Sarkisyan',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Minas Sarkisyan - Fullstack Engineer',
    description: 'Fullstack Engineer with 9+ years of experience in building complex web applications (ERP, CRM, Marketplaces).',
    images: [`${baseUrl}/images/profile.jpg`],
    creator: '@minasarkisyan',
  },
  alternates: {
    canonical: baseUrl,
    languages: {
      'en': `${baseUrl}/en`,
      'ru': `${baseUrl}/ru`,
      'x-default': baseUrl,
    },
  },
  category: 'technology',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={jetbrainsMono.variable}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
