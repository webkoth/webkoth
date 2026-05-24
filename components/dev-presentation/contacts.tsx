import { Send, Mail, CalendarClock, Code } from 'lucide-react'
import { SectionLabel } from './section-label'
import { LeadFormTest } from './lead-form-test'
import type { DevPresentationData } from '@/app/data/dev-presentation'

export function Contacts({
  data,
}: {
  data: DevPresentationData['contacts']
}) {
  return (
    <section
      id="contacts"
      className="mx-auto max-w-5xl scroll-mt-8 border-t border-border px-4 py-12 md:px-8 md:py-16"
    >
      <SectionLabel icon={Send}>05 · Контакты</SectionLabel>

      <div className="mb-8 grid gap-3 md:grid-cols-2">
        <a
          href={`mailto:${data.email}`}
          className="group inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2.5 text-sm font-medium transition-all hover:-translate-y-0.5 hover:border-primary/40"
        >
          <Mail className="size-4 text-primary" strokeWidth={1.75} />
          <span>{data.email}</span>
        </a>
        <a
          href={data.telegramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2.5 text-sm font-medium transition-all hover:-translate-y-0.5 hover:border-primary/40"
        >
          <Send className="size-4 text-primary" strokeWidth={1.75} />
          <span>Telegram: {data.telegram}</span>
        </a>
        <a
          href={data.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2.5 text-sm font-medium transition-all hover:-translate-y-0.5 hover:border-primary/40"
        >
          <Code className="size-4 text-primary" strokeWidth={1.75} />
          <span>{data.github}</span>
        </a>
        <a
          href={data.calendarUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2.5 text-sm font-medium transition-all hover:-translate-y-0.5 hover:border-primary/40"
        >
          <CalendarClock className="size-4 text-primary" strokeWidth={1.75} />
          <span>15-мин звонок (Google Calendar)</span>
        </a>
      </div>

      <div className="rounded-2xl border border-border bg-card/50 p-6 md:p-8">
        <LeadFormTest />
      </div>
    </section>
  )
}
