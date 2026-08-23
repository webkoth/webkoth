import Link from 'next/link'
import { FileText, Send } from 'lucide-react'
import { contacts } from '@/lib/landing/contacts'
import { cvPath } from '@/app/data/evolution'
import type { EvolutionData } from '@/app/data/evolution/types'
import { CopyButton } from './copy-button'

const telegramHandle = '@' + contacts.telegram.replace(/\/$/, '').split('/').pop()

type IconProps = { className?: string }

function GithubIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.4 3-.405 1.02.005 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  )
}

function YoutubeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  )
}

// Единые хэндлы на весь сайт: Telegram @abnorsky (contacts.ts), GitHub webkoth,
// YouTube @msarkisyan.
const SOCIAL = [
  { key: 'github', href: 'https://github.com/webkoth', label: 'GitHub', Icon: GithubIcon },
  { key: 'telegram', href: contacts.telegram, label: 'Telegram', Icon: Send },
  { key: 'youtube', href: 'https://www.youtube.com/@msarkisyan', label: 'YouTube', Icon: YoutubeIcon },
] as const

export function Footer({ data }: { data: EvolutionData }) {
  const linkCls = 'inline-flex items-center gap-1.5 text-foreground/80 transition hover:text-primary'
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 md:flex-row md:items-center md:justify-between md:px-8">
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <Link href={cvPath(data.lang)} className={linkCls}>
            <FileText className="size-4" aria-hidden />
            {data.footer.cv}
          </Link>
          {SOCIAL.map(({ key, href, label, Icon }) => (
            <span key={key} className="inline-flex items-center gap-1.5">
              <a href={href} target="_blank" rel="noopener noreferrer" className={linkCls}>
                <Icon className="size-4" aria-hidden />
                {label}
              </a>
              {key === 'telegram' ? (
                <CopyButton value={telegramHandle} label={data.labels.copy} done={data.labels.copied} className="size-7" />
              ) : null}
            </span>
          ))}
          <a href="/llms.txt" className={`${linkCls} font-mono text-xs`}>
            {data.footer.llms}
          </a>
        </div>
        <p className="font-mono text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} {data.footer.owner}
        </p>
      </div>
    </footer>
  )
}
