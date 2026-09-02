'use client'

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { MessageSquare, Send } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { useMediaQuery } from '@/hooks/use-media-query'
import { contacts } from '@/lib/landing/contacts'
import type { EvolutionData, Lang } from '@/app/data/evolution/types'
import type { LeadSource } from '@/lib/evolution/schemas'
import { LeadForm } from './lead-form'

export type LeadPrefill = { answer?: string; source?: LeadSource }

type LeadDialogApi = { open: (prefill?: LeadPrefill) => void }

const LeadDialogContext = createContext<LeadDialogApi | null>(null)

// Любая CTA на странице (hero, плавающая кнопка) открывает одну и ту же форму
// заявки: Dialog по центру на десктопе, нижняя панель (Sheet) на мобильном —
// там центрированный диалог режется клавиатурой. Антибот-таймер формы считается
// от момента открытия, а не от загрузки страницы: иначе быстрый клик по hero-CTA
// отсекался бы роутом как «слишком быстрое заполнение».
export function useLeadDialog(): LeadDialogApi {
  const ctx = useContext(LeadDialogContext)
  if (!ctx) throw new Error('useLeadDialog: LeadDialogProvider is missing')
  return ctx
}

export function LeadDialogProvider({
  copy,
  lang,
  children,
}: {
  copy: EvolutionData['finale']['form']
  lang: Lang
  children: ReactNode
}) {
  const [open, setOpen] = useState(false)
  const [openedAt, setOpenedAt] = useState(0)
  const [prefill, setPrefill] = useState<LeadPrefill>({})
  const mobile = useMediaQuery('(max-width: 639px)')

  // Квиз открывает форму с готовым паспортом: ответ и источник. Остальные
  // кнопки открывают пустую; прошлое заполнение не наследуется.
  const openDialog = useCallback((next?: LeadPrefill) => {
    setPrefill(next ?? {})
    setOpenedAt(Date.now())
    setOpen(true)
  }, [])
  const api = useMemo(() => ({ open: openDialog }), [openDialog])
  const close = () => setOpen(false)

  const body = (
    <>
      <a
        href={contacts.telegram}
        target="_blank"
        rel="noopener noreferrer"
        className="mb-5 inline-flex w-fit items-center gap-2 justify-self-start rounded-lg border border-border bg-background px-3.5 py-2 text-xs font-medium text-foreground transition hover:border-primary/50 hover:bg-muted md:text-sm"
      >
        <Send className="size-3.5 text-primary" aria-hidden />
        <span>{copy.telegramCta}</span>
      </a>
      {/* key по openedAt: каждое открытие — чистая форма, без прошлого состояния */}
      <LeadForm
        key={openedAt}
        copy={copy}
        lang={lang}
        startedAt={openedAt}
        defaultAnswer={prefill.answer}
        source={prefill.source}
        onSuccess={close}
      />
    </>
  )

  const eyebrow = (
    <div className="mb-1 inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.18em] text-primary">
      <MessageSquare className="size-3.5" aria-hidden />
      <span>{copy.label}</span>
    </div>
  )

  return (
    <LeadDialogContext.Provider value={api}>
      {children}
      {mobile ? (
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent side="bottom" className="max-h-[92svh] overflow-y-auto px-4 pb-6">
            <SheetHeader className="px-0 pt-5 pb-0 pr-10">
              {eyebrow}
              <SheetTitle className="text-xl">{copy.title}</SheetTitle>
              <SheetDescription>{copy.sub}</SheetDescription>
            </SheetHeader>
            {body}
          </SheetContent>
        </Sheet>
      ) : (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-xl">
            <DialogHeader className="mb-5">
              {eyebrow}
              <DialogTitle>{copy.title}</DialogTitle>
              <DialogDescription>{copy.sub}</DialogDescription>
            </DialogHeader>
            {body}
          </DialogContent>
        </Dialog>
      )}
    </LeadDialogContext.Provider>
  )
}
