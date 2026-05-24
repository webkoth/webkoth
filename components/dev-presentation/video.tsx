import { Video as VideoIcon } from 'lucide-react'
import { SectionLabel } from './section-label'

export function Video({
  data,
}: {
  data: { title: string; youtubeId: string }
}) {
  return (
    <section className="mx-auto max-w-5xl border-t border-border px-4 py-12 md:px-8 md:py-16">
      <SectionLabel icon={VideoIcon}>06 · Видео</SectionLabel>
      <h2 className="mb-4 text-xl font-bold tracking-tight md:text-2xl">
        {data.title}
      </h2>
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
    </section>
  )
}
