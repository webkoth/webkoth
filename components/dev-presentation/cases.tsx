import { FolderOpen, ArrowUpRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { SectionLabel } from './section-label'
import type { DevPresentationData } from '@/app/data/dev-presentation'

export function Cases({
  data,
}: {
  data: DevPresentationData['cases']
}) {
  return (
    <section className="mx-auto max-w-5xl border-t border-border px-4 py-12 md:px-8 md:py-16">
      <SectionLabel icon={FolderOpen}>04 · Кейсы</SectionLabel>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {data.map((c) => (
          <div
            key={c.title}
            className="group relative rounded-xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40"
          >
            <div className="mb-3 flex items-start justify-between gap-2">
              <h3 className="text-base font-bold text-foreground">{c.title}</h3>
              {c.aiTag ? (
                <span
                  className={
                    c.aiTag === 'AI'
                      ? 'flex-shrink-0 rounded-full bg-primary/15 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-primary'
                      : 'flex-shrink-0 rounded-full bg-muted/60 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground'
                  }
                >
                  {c.aiTag}
                </span>
              ) : null}
            </div>

            <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
              {c.what}
            </p>

            <div className="mb-4 flex flex-wrap gap-1.5">
              {c.stack.map((tech) => (
                <Badge
                  key={tech}
                  variant="secondary"
                  className="border-primary/20 bg-primary/10 px-2 py-0.5 text-xs text-primary"
                >
                  {tech}
                </Badge>
              ))}
            </div>

            {c.link ? (
              <a
                href={c.link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                {c.link.label}
                <ArrowUpRight className="size-3.5" aria-hidden />
              </a>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  )
}
