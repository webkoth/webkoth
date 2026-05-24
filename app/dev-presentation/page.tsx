import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { PageBackground } from '@/components/landing/page-background'
import { Hero } from '@/components/dev-presentation/hero'
import { AboutStack } from '@/components/dev-presentation/about-stack'
import { HowIWork } from '@/components/dev-presentation/how-i-work'
import { Cases } from '@/components/dev-presentation/cases'
import { Contacts } from '@/components/dev-presentation/contacts'
import { devPresentationData as data } from '@/app/data/dev-presentation'

export default function DevPresentationPage() {
  return (
    <>
      <PageBackground />
      <main className="relative z-[1] min-h-screen" lang="ru">
        {/* Minimal header */}
        <header className="border-b border-border">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 md:px-8">
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
              dev-presentation · test task
            </span>
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-sm text-foreground/80 transition hover:text-primary"
            >
              <ArrowLeft className="size-3.5" />
              webkoth.com
            </Link>
          </div>
        </header>

        <Hero data={data.hero} />
        <AboutStack data={data.about} />
        <HowIWork data={data.howIWork} />
        <Cases data={data.cases} />
        <Contacts data={data.contacts} />

        <footer className="border-t border-border">
          <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-8 md:flex-row md:items-center md:justify-between md:px-8">
            <p className="font-mono text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} {data.hero.name}
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <Link href="/" className="text-foreground/80 transition hover:text-primary">
                webkoth.com
              </Link>
              <a
                href={data.contacts.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/80 transition hover:text-primary"
              >
                GitHub
              </a>
            </div>
          </div>
        </footer>
      </main>
    </>
  )
}
