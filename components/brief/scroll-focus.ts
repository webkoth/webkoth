// Прокрутка и фокус между шагами брифа. Плавно, если человек не просил браузер
// обходиться без анимаций (prefers-reduced-motion).

const FOCUSABLE = [
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"]):not([tabindex="-1"])',
  'textarea:not([disabled])',
  'select:not([disabled])',
  'a[href]',
  '[tabindex]:not([tabindex="-1"])',
].join(', ')

export function scrollBehavior(): ScrollBehavior {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
}

export function scrollToTop(): void {
  window.scrollTo({ top: 0, behavior: scrollBehavior() })
}

/**
 * Первая ошибка шага: прокрутить в центр экрана и поставить фокус в поле, которое
 * надо исправить (сначала поле с aria-invalid, иначе первое фокусируемое внутри,
 * иначе сам блок, если у него есть tabIndex).
 */
export function revealFirstInvalid(root: HTMLElement | null): void {
  const target = root?.querySelector<HTMLElement>('[data-invalid="true"]')
  if (!target) return
  target.scrollIntoView({ block: 'center', behavior: scrollBehavior() })
  const field =
    target.querySelector<HTMLElement>('[aria-invalid="true"]') ??
    target.querySelector<HTMLElement>(FOCUSABLE) ??
    (target.hasAttribute('tabindex') ? target : null)
  field?.focus({ preventScroll: true })
}
