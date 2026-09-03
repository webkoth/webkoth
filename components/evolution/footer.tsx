import Link from 'next/link'
import { FileText } from 'lucide-react'
import { contacts } from '@/lib/landing/contacts'
import { cvPath } from '@/app/data/evolution'
import type { EvolutionData } from '@/app/data/evolution/types'
import { CopyButton } from './copy-button'
import { SOCIAL_ICONS } from './social-icons'
import { SOCIAL_LINKS } from '@/lib/landing/social'

const telegramHandle = '@' + contacts.telegram.replace(/\/$/, '').split('/').pop()

export function Footer({ data }: { data: EvolutionData }) {
  const linkCls = 'inline-flex items-center gap-1.5 text-foreground/80 transition hover:text-primary'
  return (
    <footer className="border-t border-border">
      {/* pb-20 до lg - место под плавающую кнопку: она висит в 16 px от низа
          и высотой около 43 px, а прежние 40 px отступа закрывались ею вместе
          со строкой копирайта. От lg кнопки на странице кейса нет, а на главной
          внизу её прячет inline-форма - там отступ прежний. */}
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 pt-10 pb-20 md:flex-row md:items-center md:justify-between md:px-8 lg:pb-10">
        <div className="flex flex-wrap items-center gap-4 text-sm">
          {/* <Link href={cvPath(data.lang)} className={linkCls}>
            <FileText className="size-4" aria-hidden />
            {data.footer.cv}
          </Link> */}
          {/* Единый список соцсетей (lib/landing/social.ts) — тот же, что у фото в шапке. */}
          {SOCIAL_LINKS.map((s) => {
            const Icon = SOCIAL_ICONS[s.key]
            return (
              <span key={s.key} className="inline-flex items-center gap-1.5">
                <a href={s.href} target="_blank" rel="noopener noreferrer" className={linkCls}>
                  <Icon className="size-4" aria-hidden />
                  {s.label[data.lang]}
                </a>
                {s.key === 'telegram' ? (
                  <CopyButton value={telegramHandle} label={data.labels.copy} done={data.labels.copied} className="size-7" />
                ) : null}
              </span>
            )
          })}
        </div>
        <div className="flex flex-col gap-1 font-mono text-xs text-muted-foreground md:items-end">
          <p>
            &copy; {new Date().getFullYear()} {data.footer.owner} ·{' '}
            <Link href="/privacy" className="underline underline-offset-2 transition hover:text-primary">
              {data.footer.privacy}
            </Link>
          </p>
          {/* Реквизиты рекламодателя: модерация Директа требует данные продавца на сайте. */}
          <p>{data.footer.legal}</p>
        </div>
      </div>
    </footer>
  )
}
