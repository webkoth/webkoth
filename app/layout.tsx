import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { LandingPreferencesScript } from "@/components/landing-preferences-script"
import { Toaster } from "@/components/ui/sonner"
import { YandexMetrika } from "@/components/analytics/yandex-metrika"
import { cn } from "@/lib/utils";

// Два набора шрифтов по тумблеру в шапке (класс `mono-geist` на <html>, см.
// globals.css и FontToggle): по умолчанию JetBrains Mono везде — заголовки,
// текст и моно-слот; альтернатива — Geist + Geist Mono.
const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

const fontJetBrains = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  variable: "--font-jetbrains-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="ru"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontSans.variable,
        fontMono.variable,
        fontJetBrains.variable,
        "font-sans",
      )}
    >
      <head>
        <LandingPreferencesScript />
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
        <YandexMetrika />
      </body>
    </html>
  )
}
