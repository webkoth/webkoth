import { PlayCircle } from 'lucide-react'
import { SectionLabel } from '@/components/dev-presentation/section-label'
import { Card } from '@/components/ui/card'
import type { MarketplacesData } from '@/app/data/marketplaces'

export function VideoQuestions({ data }: { data: MarketplacesData['video'] }) {
  return (
    <section
      id="video"
      className="mx-auto max-w-5xl border-t border-border px-4 py-12 md:px-8 md:py-16"
    >
      <SectionLabel icon={PlayCircle}>01 · Как это работает</SectionLabel>
      <h2 className="mb-6 text-xl font-bold tracking-tight md:text-2xl">{data.title}</h2>

      {data.youtubeId ? (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="aspect-video w-full">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${data.youtubeId}?rel=0`}
              title={data.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              className="h-full w-full"
              loading="lazy"
            />
          </div>
        </div>
      ) : null}

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {data.questions.map((q) => (
          <Card key={q.q} className="block p-5">
            <p className="text-base font-semibold">«{q.q}»</p>
            <p className="mt-3 text-sm text-muted-foreground">{q.how}</p>
            <p className="mt-3 border-l-2 border-primary/40 pl-3 text-sm">{q.sees}</p>
          </Card>
        ))}
      </div>

      {data.upcoming ? (
        <p className="mt-6 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{data.upcoming.title}</span>{' '}
          {data.upcoming.note}
        </p>
      ) : null}
    </section>
  )
}
