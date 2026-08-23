'use client'

import { useState } from 'react'
import { FileText, Copy, Check, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import type { EvolutionData } from '@/app/data/evolution/types'

// Кнопка «документация для LLM» в шапке — как на странице резюме: модалка с
// Markdown-версией страницы (та же, что отдаёт /llms.txt), копирование в буфер
// и ссылка на сам файл. Markdown собирается на сервере и приходит строкой.
export function LlmDocsButton({
  markdown,
  copy,
  labels,
}: {
  markdown: string
  copy: EvolutionData['nav']['llm']
  labels: Pick<EvolutionData['labels'], 'copy' | 'copied'>
}) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const copyAll = async () => {
    try {
      await navigator.clipboard.writeText(markdown)
      setCopied(true)
      toast.success(labels.copied, { duration: 2000 })
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      toast(copy.copyFailed)
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={copy.title}
        title={copy.title}
        className="relative inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background text-foreground shadow-xs transition hover:bg-muted"
      >
        <FileText className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">{copy.title}</span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="flex max-h-[85vh] max-w-4xl flex-col gap-4">
          <DialogHeader>
            <DialogTitle>{copy.title}</DialogTitle>
            <DialogDescription>{copy.description}</DialogDescription>
          </DialogHeader>
          <div className="min-h-0 flex-1 overflow-auto rounded-lg border border-border bg-muted/60">
            <pre className="p-4 font-mono text-xs leading-relaxed break-words whitespace-pre-wrap md:text-[13px]">
              {markdown}
            </pre>
          </div>
          <div className="flex flex-wrap justify-end gap-2 border-t border-border pt-4">
            <Button variant="outline" nativeButton={false} render={<a href="/llms.txt" target="_blank" rel="noopener noreferrer" />}>
              <ExternalLink aria-hidden />
              {copy.openRaw}
            </Button>
            <Button onClick={copyAll}>
              {copied ? <Check aria-hidden /> : <Copy aria-hidden />}
              {copied ? labels.copied : labels.copy}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
