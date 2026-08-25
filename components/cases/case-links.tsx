import type { ReactNode } from 'react'
import { Link2, Package } from 'lucide-react'
import { linkLabel, type CaseLinks } from '@/app/data/cases'
import { SOCIAL_ICONS } from '@/components/evolution/social-icons'

export type CaseLinkItem = { key: string; href: string; icon: ReactNode; label: string }

// Ссылки собираются списком, а не тремя одинаковыми блоками в разметке: ряд
// рисуется, только если хоть одна есть. У обезличенных клиентских систем ссылок
// нет вовсе - у них не должно оставаться пустой полосы.
// Список строится здесь, а не отдельно в карточке и в панели фактов: рисуют они
// его по-разному (пилюли в ряд и колонка), но состав ссылок у них общий, и
// четвёртый вид ссылки должен добавляться один раз, а не в двух местах.
// Иконка GitHub берётся из social-icons: в lucide бренд-иконок больше нет.
export function caseLinkItems(links: CaseLinks): CaseLinkItem[] {
  const GithubMark = SOCIAL_ICONS.github
  return [
    links.github ? { key: 'github', href: links.github, icon: <GithubMark className="size-3.5" />, label: 'GitHub' } : null,
    links.npm ? { key: 'npm', href: links.npm, icon: <Package className="size-3.5" aria-hidden />, label: 'npm' } : null,
    links.site
      ? { key: 'site', href: links.site, icon: <Link2 className="size-3.5" aria-hidden />, label: linkLabel(links.site) }
      : null,
  ].filter((l) => l !== null)
}
