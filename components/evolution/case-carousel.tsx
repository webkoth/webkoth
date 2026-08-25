'use client'

import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useReducedMotionSafe } from './animations/use-reduced-motion'
import { TOUCH_INTENT_PX, WHEEL_INTENT_PX, isHorizontalIntent } from './carousel-gesture'

// Семь секунд на карточку: при трёх-четырёх карточках это 21-28 секунд на блок -
// примерно столько же читается сам блок, так что круг проходит один раз и не
// начинает идти по второму, пока читатель ещё здесь.
const INTERVAL_MS = 7000

// Тишина после последнего события scroll, по которой снимается индекс. Ранний
// съём безвреден: если долгая задача разорвала плавную прокрутку и таймер успел
// сработать на полпути, промежуточное значение поправит следующая осадка. На
// решение «читатель взял управление» индекс не влияет - оно приходит от жеста.
const SETTLE_MS = 120

// Доля карусели в кадре, начиная с которой автопрокрутке есть кому листать.
// Просто isIntersecting не годится: он остаётся true, пока виден хоть один
// пиксель, а карточка высотой 700 px «видна» и тогда, когда читатель ушёл
// блоком ниже.
const IN_VIEW_RATIO = 0.2

const ARROW_CLASS =
  'inline-flex size-8 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:border-primary/40 hover:text-primary focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none'

export type CarouselLabels = {
  /** Уже с именем шага: каруселей на странице шесть, и общая подпись ничего не различает. */
  aria: string
  prev: string
  next: string
  counter: string // «{i} из {n}»
  goTo: string // «Кейс {i}»
}

// Карусель кейсов: одна карточка на всю ширину, листание - нативный scroll-snap.
// Без внешней библиотеки и без подмены содержимого: все карточки лежат в DOM,
// поэтому блок индексируется, читается скринридером целиком и листается без JS.
// Автопрокрутка встаёт при наведении, при фокусе внутри, когда карусель вне
// кадра или вкладка в фоне, навсегда - как только читатель взял управление
// (стрелка, точка, горизонтальный свайп, фокус в карточке), и не запускается
// при prefers-reduced-motion.
export function CaseCarousel({ items, labels }: { items: ReactNode[]; labels: CarouselLabels }) {
  const trackRef = useRef<HTMLUListElement>(null)
  const [index, setIndex] = useState(0)
  const [hover, setHover] = useState(false)
  const [focused, setFocused] = useState(false)
  const [inView, setInView] = useState(false)
  const [stopped, setStopped] = useState(false)
  const reduce = useReducedMotionSafe()
  const trackId = useId()
  const count = items.length

  // Последний осевший индекс. Ход таймера считается от него, а не от состояния:
  // так на очередь эффектов не влияет ни промежуточный кадр прокрутки, ни то,
  // успел ли React перерисовать счётчик.
  const settledRef = useRef(0)
  // Начало касания - чтобы у touchmove было с чем сравнивать.
  const touchRef = useRef<{ x: number; y: number } | null>(null)

  // instant - для ходов, которые не стоит показывать движением; reduce делает
  // мгновенными все.
  const scrollTo = useCallback(
    (i: number, instant = false) => {
      const el = trackRef.current
      if (!el || el.clientWidth === 0) return
      // Счётчик и точки двигаются сразу, не дожидаясь конца прокрутки: осевший
      // индекс придёт через SETTLE_MS и совпадёт с этим же значением. Заодно
      // подряд идущие нажатия стрелки считаются от цели, а не от того места,
      // где прокрутку застало нажатие.
      setIndex(i)
      // instant, а не auto: при auto scrollTo берёт scroll-behavior из CSS и
      // умеет оказаться плавным, а при reduce плавного быть не должно.
      el.scrollTo({ left: i * el.clientWidth, behavior: reduce || instant ? 'instant' : 'smooth' })
    },
    [reduce],
  )

  // Индекс ведём по факту прокрутки, а не по состоянию: свайп пальцем не
  // проходит через наши обработчики. Читаем по осадке, а не каждый кадр, -
  // промежуточные значения плавной прокрутки в счётчике не нужны.
  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    let timer = 0
    const onScroll = () => {
      window.clearTimeout(timer)
      timer = window.setTimeout(() => {
        if (el.clientWidth === 0) return
        const observed = Math.min(count - 1, Math.max(0, Math.round(el.scrollLeft / el.clientWidth)))
        settledRef.current = observed
        setIndex(observed)
      }, SETTLE_MS)
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.clearTimeout(timer)
      el.removeEventListener('scroll', onScroll)
    }
  }, [count])

  // Первое наблюдение приходит сразу после observe(), поэтому карусель,
  // открытая в кадре, стартует сама, без прокрутки страницы. Берём последнюю
  // запись пачки: при быстрой прокрутке их приходит несколько, и первая -
  // самая старая.
  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => setInView(entries[entries.length - 1].intersectionRatio >= IN_VIEW_RATIO),
      { threshold: [0, IN_VIEW_RATIO] },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (reduce || stopped || hover || focused || !inView || count < 2) return
    const id = window.setInterval(() => {
      // Вкладка в фоне: таймер там всё равно идёт, но листать некому - вернувшись,
      // читатель нашёл бы карусель на случайной карточке.
      if (document.hidden) return
      const next = (settledRef.current + 1) % count
      // Возврат с последней карточки на первую - единственный ход, который едет
      // назад, да ещё через весь блок: три ширины за секунду против одной за
      // шестьсот миллисекунд у обычного шага. Показанный движением, он читается
      // как «что-то отскочило», а не «круг пошёл заново». Мгновенный переход
      // говорит ровно то, что произошло: карусель начала сначала. Ручное
      // листание стрелкой остаётся плавным даже на этом ходу - там движение
      // отвечает на нажатие и объясняет само себя.
      scrollTo(next, next === 0)
    }, INTERVAL_MS)
    return () => window.clearInterval(id)
  }, [reduce, stopped, hover, focused, inView, count, scrollTo])

  const go = (i: number) => {
    setStopped(true)
    scrollTo((i + count) % count)
  }

  if (count === 0) return null

  const counterText = labels.counter.replace('{i}', String(index + 1)).replace('{n}', String(count))

  return (
    <div
      className="mt-10 md:mt-14"
      // pointerenter вместо mouseenter: iOS шлёт mouseenter по тапу и может не
      // прислать mouseleave, и тогда пауза по наведению зависает навсегда.
      onPointerEnter={(e) => {
        if (e.pointerType === 'mouse') setHover(true)
      }}
      onPointerLeave={(e) => {
        if (e.pointerType === 'mouse') setHover(false)
      }}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(e) => {
        // focusout прилетает и когда фокус переходит между двумя ссылками внутри
        // карусели, поэтому смотрим, куда он ушёл: остался внутри - пауза держится.
        if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false)
      }}
    >
      {count > 1 ? (
        <div className="mb-3 flex items-center justify-between gap-3">
          {/* Счётчик - зрячему читателю; скринридеру его читает живой регион ниже,
              и только когда есть что сказать. */}
          <p
            aria-hidden
            className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground"
          >
            {counterText}
          </p>
          {/* Регион живой всегда, а наполняется только после того, как читатель
              взял управление: тогда смена карточки - его действие, и её стоит
              озвучить. Включать aria-live тем же изменением DOM, которое меняет
              текст, нельзя - первое объявление обычно теряется. Пока идёт
              автопрокрутка, регион пуст и молчит, иначе он перебивал бы чтение
              карточки каждые семь секунд. */}
          <p className="sr-only" aria-live="polite">
            {stopped ? counterText : ''}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              aria-label={labels.prev}
              aria-controls={trackId}
              onClick={() => go(index - 1)}
              className={ARROW_CLASS}
            >
              <ChevronLeft className="size-4" aria-hidden />
            </button>
            <button
              type="button"
              aria-label={labels.next}
              aria-controls={trackId}
              onClick={() => go(index + 1)}
              className={ARROW_CLASS}
            >
              <ChevronRight className="size-4" aria-hidden />
            </button>
          </div>
        </div>
      ) : null}

      {/* role="list" вручную: preflight снимает маркеры, а с ними Safari снимает
          и роль списка - и «список из 4 элементов», единственная подсказка, что
          за первой карточкой есть ещё три, пропадает.

          Управление отдаётся по жесту, а не по факту прокрутки: «наша плавная
          прокрутка проходит мимо второй карточки» и «читатель свайпнул на вторую
          и остановился» - геометрически одно и то же, по scrollLeft их не
          различить. Ведущая ось различает. Фокус, попавший в карточку, - то же
          самое ручное листание: клавиатурный читатель дошёл до карточки сам, и
          отбирать у него место так же нечестно, как после свайпа. Фокус на
          стрелке или точке сюда не попадает - он только ставит паузу.

          items-start, а не растяжка по умолчанию: каждая карточка стоит на
          своей высоте. Высоту самой дорожки это не меняет - её всё так же
          задаёт самая высокая карточка блока, и страница при листании не
          прыгает, - но запас уходит под короткую карточку, а не внутрь неё.
          Видно всегда одну карточку, и та, что ниже, читается как «здесь
          меньше сказано»; та же пустота посреди карточки читалась бы как
          поломка вёрстки. */}
      <ul
        ref={trackRef}
        id={trackId}
        role="list"
        aria-label={labels.aria}
        onFocusCapture={() => setStopped(true)}
        onTouchStart={(e) => {
          const t = e.touches[0]
          touchRef.current = t ? { x: t.clientX, y: t.clientY } : null
        }}
        onTouchMove={(e) => {
          const from = touchRef.current
          const t = e.touches[0]
          if (!from || !t) return
          if (isHorizontalIntent(t.clientX - from.x, t.clientY - from.y, TOUCH_INTENT_PX)) {
            touchRef.current = null
            setStopped(true)
          }
        }}
        onWheel={(e) => {
          if (isHorizontalIntent(e.deltaX, e.deltaY, WHEEL_INTENT_PX)) setStopped(true)
        }}
        className="flex snap-x snap-mandatory items-start overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {/* Индекс в key: карточки блока собраны из статических данных, список не
            перемешивается и не фильтруется, так что позиция здесь и есть
            тождество элемента. grid при items-start ничего не растягивает, но и
            не стоит ничего: он вернёт растяжку сам, если дорожка когда-нибудь
            снова начнёт тянуть карточки по высоте. */}
        {items.map((item, i) => (
          <li key={i} className="grid w-full shrink-0 snap-start">
            {item}
          </li>
        ))}
      </ul>

      {count > 1 ? (
        <div className="mt-4 flex justify-center gap-1.5">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={labels.goTo.replace('{i}', String(i + 1))}
              aria-current={i === index ? 'true' : undefined}
              aria-controls={trackId}
              onClick={() => go(i)}
              className={cn(
                'h-1.5 rounded-full transition-all focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none',
                // Неактивная точка сплошным muted-foreground: это единственный
                // знак, что за первой карточкой есть ещё три, и на светлой теме
                // полупрозрачная давала 1.34:1 - её попросту не видно.
                // Активную отличают ширина и цвет, так что прозрачность не нужна.
                i === index ? 'w-5 bg-primary' : 'w-1.5 bg-muted-foreground hover:bg-foreground',
              )}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}
