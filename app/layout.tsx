import { Suspense } from "react"
import { Inter, JetBrains_Mono } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { YandexMetrika } from "@/components/analytics/yandex-metrika"
import { RouteTracker } from "@/components/analytics/route-tracker"
import { cn } from "@/lib/utils";

// Шрифты как в роликах finstock: Inter для текста и заголовков (500/600),
// JetBrains Mono для кода и мелких моно-подписей.
const fontInter = Inter({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
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
        fontInter.variable,
        fontJetBrains.variable,
        "font-sans",
      )}
    >
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
        {/* Метки рекламы для заявки и хиты Метрики при переходах внутри сайта. */}
        <Suspense fallback={null}>
          <RouteTracker />
        </Suspense>
      </body>
    </html>
  )
}
