import { briefCopy } from '@/app/data/brief/copy'
import { Button } from '@/components/ui/button'
import { Legend } from './legend'

export function StepIntro({
  canResume,
  outdated,
  unavailable,
  onStart,
  onResume,
}: {
  canResume: boolean
  outdated: boolean
  unavailable: boolean
  onStart: () => void
  onResume: () => void
}) {
  const c = briefCopy.intro
  return (
    <section className="py-6">
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{c.eyebrow}</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">{c.title}</h1>
      <p className="mt-4 text-base leading-relaxed text-muted-foreground">{c.lead}</p>
      <ul className="mt-6 space-y-2">
        {c.points.map((p) => (
          <li key={p} className="border-l-2 border-primary/60 pl-3 text-sm leading-relaxed">
            {p}
          </li>
        ))}
      </ul>
      {outdated ? <p className="mt-4 text-sm text-muted-foreground">{c.outdated}</p> : null}
      {unavailable ? <p className="mt-4 text-sm text-muted-foreground">{c.unavailable}</p> : null}
      <div className="mt-8 flex flex-wrap gap-3">
        {canResume ? (
          <>
            <Button size="lg" onClick={onResume}>
              {c.resume}
            </Button>
            <Button size="lg" variant="outline" onClick={onStart}>
              {c.restart}
            </Button>
          </>
        ) : (
          <Button size="lg" onClick={onStart}>
            {c.start}
          </Button>
        )}
      </div>
      <div className="mt-10">
        <Legend />
      </div>
    </section>
  )
}
