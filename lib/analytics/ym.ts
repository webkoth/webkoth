// Цели Яндекс Метрики. Три события на все страницы: старт квиза, показ
// результата, отправка заявки. Без счётчика (нет NEXT_PUBLIC_YM_ID или
// скрипт не загрузился) вызов ничего не делает: аналитика не должна ронять
// страницу и не должна требовать моков в тестах компонентов.
export type YmGoal = 'quiz_start' | 'quiz_result' | 'lead_sent'

type YmFn = (id: number, action: 'reachGoal', goal: string) => void

export function ymGoal(goal: YmGoal): void {
  if (typeof window === 'undefined') return
  const id = Number(process.env.NEXT_PUBLIC_YM_ID)
  const ym = (window as unknown as { ym?: YmFn }).ym
  if (!id || typeof ym !== 'function') return
  ym(id, 'reachGoal', goal)
}
