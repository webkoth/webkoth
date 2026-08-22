// Типы данных главной страницы (RU `/`, EN `/en`). Компоненты текста не содержат:
// весь текст — в `ru.ts` и `en.ts`, структура одинаковая, проверяется этим типом.

export type Lang = 'ru' | 'en'

/** `note` — пояснение «как считалось», показывается в HoverCard на цифре. */
export type Fact = { value: string; label: string; note?: string }

/** Узлы схемы ProductionStack в hero; подписи узлов английские, описания — в языке страницы. */
export type StackNodeKey =
  | 'client'
  | 'frontend'
  | 'backend'
  | 'api'
  | 'ai'
  | 'ai1'
  | 'ai2'
  | 'ai3'
  | 'queue'
  | 'worker'
  | 'db'

export type EvolutionBlock = {
  /** Якорь секции и ключ навигации. */
  id: string
  /** Порядковый номер шага («01» … «06»). */
  step: string
  /** Постулат — он же пункт навигации и заголовок блока. */
  slogan: string
  /** Симптом: как проблема болит у клиента сейчас. */
  symptom: string
  description: string[]
  /** Плашка кейса: главная цифра крупно, остальные — мельче. */
  caseLabel: string
  caseBody: string
  mainFact: Fact
  facts: Fact[]
}

export type HubNodeKey =
  | 'chrome'
  | 'next'
  | 'queue'
  | 'parser'
  | 'docparser'
  | 'ai'
  | 'bronze'
  | 'silver'
  | 'telegram'

export type HubNodeCopy = { label: string; sub: string; badge?: string; description: string }

export type RoadmapStep = { num: string; title: string; body: string; pill: string }

/** Подписи внутри SVG-сцен и их aria-описания. */
export type AnimationCopy = {
  fragments: { aria: string }
  fog: {
    aria: string
    title: string
    subtitle: string
    kpi: [Fact, Fact, Fact]
    recon: string
    bank: string
    ledger: string
  }
  noise: { aria: string }
  conveyor: { aria: string; routine: string; outputs: [string, string, string] }
  timeline: {
    aria: string
    market: string
    weeks: string
    here: string
    day: string
    stack: string
    commits: string
    flow: string
  }
  cells: { aria: string; growth: string; legendSystem: string; legendPeople: string }
  sprouts: {
    aria: string
    /** Префикс номера захода: «№» или «#». */
    attempt: string
    branches: [string, string, string, string, string, string]
  }
}

/** Фрагмент текста со ссылкой на Telegram посередине. */
export type LinkedText = { before: string; link: string; after: string }

export type EvolutionData = {
  lang: Lang
  brand: string
  meta: {
    title: string
    description: string
    ogTitle: string
    ogDescription: string
    twitterDescription: string
    jsonLd: { name: string; serviceType: string; description: string; area: string }
  }
  nav: { cta: string; stepsAria: string; palette: string; theme: string; font: string }
  labels: {
    step: string
    symptom: string
    caseTag: string
    /** aria-подпись полосы прогресса чтения под шапкой. */
    readingProgress: string
    copy: string
    copied: string
    /** Вкладка «все» в табах таблицы запусков. */
    all: string
    /** Подсказка у цифры факта: «как считалось». */
    factHint: string
  }
  hero: {
    line1: string
    line2: string
    seal: string
    sub: string
    cta: string
    scrollHint: string
    stackHint: string
    stackNodes: Record<StackNodeKey, string>
  }
  blocks: {
    system: EvolutionBlock
    money: EvolutionBlock
    decisions: EvolutionBlock
    automation: EvolutionBlock
    speed: EvolutionBlock
    resources: EvolutionBlock
  }
  exhibits: {
    /** Блок 3: схема «источники → хранилище → отчёт». */
    dataFlow: { nodes: string[]; note: string }
    /** Блок 4: до/после — ручная операция и та же операция кнопкой. */
    beforeAfter: { beforeTitle: string; before: string[]; afterTitle: string; after: string }
    /** Блок 5: таблица «первый коммит → прод-конвейер». */
    launchTable: { head: [string, string, string, string]; rows: [string, string, string, string][] }
    /** Блок 6: три доли крупно, без имён. */
    shares: { value: string; role: string; detail: string }[]
  }
  /** Именованный кейс — собственный продукт. Ненумерованная секция после шага 06. */
  hubmarket: {
    eyebrow: string
    /** Заголовок целиком; `linkText` — та его часть, что становится ссылкой на продукт. */
    title: string
    linkText: string
    url: string
    sub: string
    frame: string[]
    hint: string
    flowLabel: string
    diagramAria: string
    nodes: Record<HubNodeKey, HubNodeCopy>
    stack: string[]
    screenshotsTitle: string
    screenshots: { src: string; alt: string; caption: string }[]
  }
  /** «От идеи до прода» — как выполняется план со страницы. */
  roadmap: {
    eyebrow: string
    title: string
    sub: string
    steps: RoadmapStep[]
  }
  finale: {
    step: string
    slogan: string
    description: string[]
    manifesto: string
    graveyard: {
      title: string
      head: [string, string, string, string]
      rows: [string, string, string, string][]
      note: string
    }
    form: {
      label: string
      title: string
      sub: string
      takeawaysTitle: string
      takeaways: string[]
      telegramCta: string
      orBelow: string
      fields: { name: string; contact: string; answer: string }
      placeholders: { name: string; contact: string; answer: string }
      /** Ключи совпадают с кодами сообщений в `lib/evolution/schemas.ts`. */
      errors: Record<string, string>
      rateLimited: LinkedText
      failed: LinkedText
      /** Тосты (sonner) об исходе отправки; ссылка на Telegram — кнопка-действие. */
      toast: {
        success: string
        successBody: string
        action: string
        error: string
        errorBody: string
        rateLimited: string
        rateLimitedBody: string
      }
      submit: string
      submitting: string
      success: { title: string; body: string; link: string }
    }
  }
  animations: AnimationCopy
  footer: { owner: string; cv: string; llms: string }
}
