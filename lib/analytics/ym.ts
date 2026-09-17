// Цели Яндекс Метрики. Три события на все страницы: старт квиза, показ
// результата, отправка заявки. Без счётчика (нет NEXT_PUBLIC_YM_ID или
// скрипт не загрузился) вызов ничего не делает: аналитика не должна ронять
// страницу и не должна требовать моков в тестах компонентов.
export type YmGoal =
  | 'quiz_start'
  | 'quiz_result'
  | 'lead_sent'
  // Клик по Telegram: кнопки через window.open автоцель «Мессенджер» не ловит
  | 'tg_click'
  // Бриф: где бросают заполнение (спека брифа, раздел 12)
  | 'brief_start'
  | 'brief_step_1'
  | 'brief_step_2'
  | 'brief_step_3'
  | 'brief_step_4'
  | 'brief_step_5'
  | 'brief_submit'
  | 'brief_pdf'

type YmFn = (id: number, action: 'reachGoal', goal: string) => void

export function ymGoal(goal: YmGoal): void {
  if (typeof window === 'undefined') return
  const id = Number(process.env.NEXT_PUBLIC_YM_ID)
  const ym = (window as unknown as { ym?: YmFn }).ym
  if (!id || typeof ym !== 'function') return
  ym(id, 'reachGoal', goal)
}
