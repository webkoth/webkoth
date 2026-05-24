import { Workflow, Sparkles } from 'lucide-react'
import { SectionLabel } from './section-label'
import type { DevPresentationData } from '@/app/data/dev-presentation'

function Bullet({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40">
      <h3 className="mb-2 text-base font-bold text-foreground">{title}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>
    </div>
  )
}

export function HowIWork({
  data,
}: {
  data: DevPresentationData['howIWork']
}) {
  return (
    <section className="mx-auto max-w-5xl border-t border-border px-4 py-12 md:px-8 md:py-16">
      <SectionLabel icon={Workflow}>03 · Как я работаю</SectionLabel>

      <div className="mb-10">
        <h2 className="mb-4 text-xl font-bold tracking-tight md:text-2xl">
          Подход к задачам
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {data.approach.map((b) => (
            <Bullet key={b.title} title={b.title} body={b.body} />
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-4 flex items-center gap-2 text-xl font-bold tracking-tight md:text-2xl">
          <Sparkles className="size-5 text-primary" aria-hidden />
          AI в работе
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {data.aiHabits.map((b) => (
            <Bullet key={b.title} title={b.title} body={b.body} />
          ))}
        </div>
      </div>
    </section>
  )
}
