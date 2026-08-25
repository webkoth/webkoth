'use client'

import { useLeadDialog } from '@/components/evolution/lead-dialog'

// Единственный клиентский кусок панели фактов: кнопка, открывающая модалку
// с формой. Вынесена отдельно, чтобы сама панель осталась серверной - иначе
// в клиентский payload уезжали бы целиком `meta` и `copy` кейса (около 4.8 тыс.
// знаков на страницу) ради одного обработчика клика.
export function CaseCtaButton({ label }: { label: string }) {
  const lead = useLeadDialog()

  return (
    <button
      type="button"
      onClick={lead.open}
      className="mt-4 w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
    >
      {label}
    </button>
  )
}
