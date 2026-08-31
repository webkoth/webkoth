import type { Lang } from '@/app/data/evolution/types'
import type { VerdictFlag, VerdictForm } from '@/lib/standard/verdict'

// Копия квиза вердикта: вопросы повторяют схему стандарта один в один, результатные
// тексты — таблицу решений AIAS-00. Логика — в lib/standard/verdict.ts; здесь только слова.
export const verdictPath = (lang: Lang): string => `/${lang}/standard/verdict`

export type QuizOption<V extends string> = { value: V; label: string; hint?: string }

export type QuizCopy = {
  meta: { title: string; description: string }
  eyebrow: string
  pageLinkLabel: string
  title: string
  lead: string
  disclaimer: string
  progressLabel: string
  backLabel: string
  restartLabel: string
  questions: {
    hasEtalon: { title: string; hint: string; options: QuizOption<'yes' | 'no'>[] }
    dataReady: { title: string; hint: string; options: QuizOption<'yes' | 'no'>[] }
    useful: { title: string; hint: string; options: QuizOption<'no' | 'rare' | 'yes'>[] }
    rule: { title: string; hint: string; options: QuizOption<'full' | 'freeInput' | 'judgment'>[] }
    check: { title: string; hint: string; options: QuizOption<'auto' | 'quick' | 'expert'>[] }
    singleRun: { title: string; hint: string; options: QuizOption<'yes' | 'no'>[] }
    consequences: {
      title: string
      hint: string
      sideEffect: { label: string; options: QuizOption<'read' | 'notify' | 'write'>[] }
      irreversible: { label: string; options: QuizOption<'yes' | 'no'>[] }
      personalData: { label: string; options: QuizOption<'yes' | 'no'>[] }
    }
  }
  result: {
    heading: string
    autonomyTitle: string
    autonomyStages: { collect: string; analyze: string; decide: string; act: string }
    demandsTitle: string
    flags: Record<VerdictFlag, string>
    forms: Record<
      VerdictForm,
      { tag: string; title: string; text: string; demands: string[]; library?: { label: string; href: string }[] }
    >
    templatesLabel: string
    templatesHref: string
    ctaHint: string
  }
}

const REPO = 'https://github.com/webkoth/ai-automation-standard'

export const verdictQuizData: Record<Lang, QuizCopy> = {
  ru: {
    meta: {
      title: 'Вердикт по вашему процессу · AIAS',
      description:
        'Восемь вопросов стандарта AIAS к одному шагу процесса: кому его отдать. Программе, конвейеру с ИИ-шагом, агенту или человеку. Три минуты, без регистрации.',
    },
    eyebrow: 'AIAS · вердикт онлайн · 3 минуты',
    pageLinkLabel: 'Пройти вердикт онлайн: 8 вопросов, 3 минуты',
    title: 'Кому отдать шаг процесса?',
    lead:
      'Возьмите один конкретный шаг одного процесса, не процесс целиком. Ответьте на вопросы схемы и получите вердикт, профиль автономии и требования приёмки.',
    disclaimer:
      'Опросник устроен как таблица решений стандарта, без ИИ: правило записано полностью, поэтому это код. Ответы никуда не отправляются.',
    progressLabel: 'вопрос',
    backLabel: 'Назад',
    restartLabel: 'Пройти заново',
    questions: {
      hasEtalon: {
        title: 'Есть пример правильного результата?',
        hint: 'Эталон: «вот так выглядит правильно». Файл, документ, образец. Без него задачу нечем проверить и некому делегировать.',
        options: [
          { value: 'yes', label: 'Да, есть образец' },
          { value: 'no', label: 'Нет, «увидим и поймём»' },
        ],
      },
      dataReady: {
        title: 'Данные существуют и доступны?',
        hint: 'Через API, базу или файлы, а не «в головах и чатах». Качество известно.',
        options: [
          { value: 'yes', label: 'Да, есть источник' },
          { value: 'no', label: 'Нет, данные разрознены или их нет' },
        ],
      },
      useful: {
        title: 'Шаг нужен, частый или дорогой?',
        hint: 'Самая дорогая ошибка: автоматизировать то, что делается раз в месяц за двадцать минут.',
        options: [
          { value: 'no', label: 'Результат шага никто не использует' },
          { value: 'rare', label: 'Реже раза в неделю и дешевле получаса' },
          { value: 'yes', label: 'Часто или дорого' },
        ],
      },
      rule: {
        title: 'Записывается ли правило полностью?',
        hint: 'Тест: двое независимых людей с этим правилом дадут одинаковый результат. Умещается в таблицу решений без графы «по ситуации».',
        options: [
          { value: 'full', label: 'Да, правило полное', hint: 'условия → результат' },
          {
            value: 'freeInput',
            label: 'Правило чёткое, но вход свободный',
            hint: 'письмо, документ, фото, запись',
          },
          { value: 'judgment', label: 'Нет, нужно суждение' },
        ],
      },
      check: {
        title: 'Насколько дёшево проверить результат?',
        hint: 'Проверяем не «сделано ли», а «сделано ли правильно».',
        options: [
          { value: 'auto', label: 'Автоматически', hint: 'схема, сверка, тест' },
          { value: 'quick', label: 'Человек за 10 секунд', hint: 'черновик перед отправкой' },
          { value: 'expert', label: 'Только эксперт, и долго' },
        ],
      },
      singleRun: {
        title: 'Укладывается ли в один прогон?',
        hint: 'Примерно до десяти шагов, без человека посередине и без ожиданий в днях.',
        options: [
          { value: 'yes', label: 'Да, один заход' },
          { value: 'no', label: 'Нет, это длинная цепочка' },
        ],
      },
      consequences: {
        title: 'Последствия',
        hint: 'Эти три ответа определяют автономию и требования приёмки.',
        sideEffect: {
          label: 'Что шаг меняет снаружи?',
          options: [
            { value: 'read', label: 'Только читает' },
            { value: 'notify', label: 'Уведомляет' },
            { value: 'write', label: 'Пишет: кабинет, платёж, отправка' },
          ],
        },
        irreversible: {
          label: 'Есть необратимое действие?',
          options: [
            { value: 'yes', label: 'Да: деньги, документы, публикация' },
            { value: 'no', label: 'Нет, всё можно отменить' },
          ],
        },
        personalData: {
          label: 'Есть персональные данные?',
          options: [
            { value: 'yes', label: 'Да' },
            { value: 'no', label: 'Нет' },
          ],
        },
      },
    },
    result: {
      heading: 'Вердикт',
      autonomyTitle: 'Автономия по стадиям на старте',
      autonomyStages: { collect: 'сбор', analyze: 'анализ', decide: 'решение', act: 'действие' },
      demandsTitle: 'Что требовать при приёмке',
      flags: {
        irreversible:
          'Необратимое действие: исполняет код, утверждает человек. Для денег и документов навсегда.',
        personalData:
          'Персональные данные: допустимый контур модели или маскирование до отправки. Это ворота, а не пожелание.',
        rope: 'Верёвка: лимит выпуска в день ≤ мощность того, кто утверждает. Иначе очередь превратит утверждение в «одобрить всё».',
      },
      forms: {
        stopEtalon: {
          tag: 'СТОП',
          title: 'У человека, пока нет эталона',
          text: 'Без примера правильного результата задачу нечем проверить, кроме чтения глазами. Сначала эталон, потом любой разговор об автоматизации. Это находка, а не отказ: прошлые попытки, скорее всего, умерли именно здесь.',
          demands: [
            'Соберите 5–10 пар «вход → правильный выход»: это и эталон, и будущие тесты',
            'Пока эталона нет, работает человек с ИИ-помощником в диалоге (F1)',
          ],
        },
        stopData: {
          tag: 'СТОП',
          title: 'Сначала данные',
          text: 'Агент поверх хаоса выдаёт уверенные ошибки. Сначала F3-работа с данными: источник, снимок, справочник, сверка. Потом возвращайтесь к этому вопросу.',
          demands: [
            'Один источник правды: снимок данных «как есть», расчёты читают из него',
            'Качество измеримо: полнота загрузок, сверка с источником',
          ],
          library: [{ label: 'Карточка 07 · Снимок продаж → витрины', href: `${REPO}/blob/main/library/07-snimok-prodazh-vitriny.md` }],
        },
        f0: {
          tag: 'F0',
          title: 'Убрать шаг',
          text: 'Результат никто не использует, а лучшая автоматизация та, которой нет. Проверьте, нельзя ли изменить соседний шаг так, чтобы этот исчез совсем.',
          demands: ['Убедитесь, что шаг не держит скрытых потребителей', 'Удалите, а не «оставим на всякий случай»'],
        },
        f1: {
          tag: 'F0 · F1',
          title: 'Не трогать / помощник',
          text: 'Редкое и дешёвое не окупает разработку и поддержку никогда. Делайте руками, с ИИ-помощником в диалоге, если хочется быстрее.',
          demands: ['Вернитесь к вопросу, если частота вырастет', 'Не стройте здесь ничего «на вырост»'],
        },
        f3: {
          tag: 'F3',
          title: 'Программа, без ИИ в рантайме',
          text: 'Правило записывается полностью, а значит это детерминированный код: одинаково, быстро, почти бесплатно. ИИ уместен при создании программы, но не внутри неё. Канонические цифры считает только код.',
          demands: [
            'Правило записано таблицей решений, которую правит владелец процесса',
            'Тесты на правиле = эталон; исключения уходят человеку с контекстом',
            'Две среды и путь в боевую только через проверку',
          ],
          library: [
            { label: 'Карточка 01 · Заявки на оплату', href: `${REPO}/blob/main/library/01-zayavki-na-oplatu.md` },
            { label: 'Карточка 02 · Сверка выплат', href: `${REPO}/blob/main/library/02-sverka-vyplat-marketpleysa.md` },
          ],
        },
        f4: {
          tag: 'F4',
          title: 'Конвейер с ИИ-шагом',
          text: 'Ходом управляет код; модель делает один шаг: переводит свободный вход в структуру по схеме. Всё, что вернулось не по схеме, отклоняется и уходит в исключения, а не «чинится».',
          demands: [
            'Манифест ИИ-шага: вход, роль, инструкция MUST/MUST NOT, схема выхода, эталон',
            'Очередь исключений: посчитана мощность разбирающего (правило 80 %)',
            'Журнал прогонов и эталонный набор при смене промпта или модели',
          ],
          library: [
            { label: 'Карточка 13 · Счёт из письма → заявка', href: `${REPO}/blob/main/library/13-schet-iz-pisma-v-zayavku.md` },
            { label: 'Карточка 08 · Дайджест рекламы', href: `${REPO}/blob/main/library/08-daydzhest-reklamy-i-stavki.md` },
          ],
        },
        f1f2: {
          tag: 'F1 · F2',
          title: 'Эксперт с помощником',
          text: 'Проверить результат может только эксперт. Значит, ИИ помогает эксперту, а не заменяет его. Повторяемую часть упакуйте в регламент, запускаемый одной командой.',
          demands: [
            'Эксперт остаётся автором: модель готовит, он решает',
            'Повторяемое уходит в регламент (F2) с версией в репозитории',
          ],
        },
        split: {
          tag: 'SPLIT',
          title: 'Разбить на цепочку',
          text: '«Агент, который ведёт процесс неделю» не агент, а процесс без карты. Разложите на шаги с контрольными точками и прогоните каждый шаг через эти же вопросы.',
          demands: [
            'Каждый шаг цепочки получает свой вердикт',
            'Между шагами проверяемые артефакты, не «агент помнит»',
          ],
        },
        f5: {
          tag: 'F5',
          title: 'Агент',
          text: 'Шаги заранее не записываются, проверка дешёвая: здесь агент уместен. Он думает и готовит; код исполняет; человек утверждает необратимое. Всё, что агент производит, остаётся черновиком, пока карточка не говорит иначе.',
          demands: [
            'Инструменты только из реестра с уровнями read / notify / write',
            'Бюджет, лимиты прогона, журнал действий, выключатель без деплоя',
            'Рост автономии идёт по правилу трёх: n = 3 / допустимая ошибка',
          ],
          library: [
            { label: 'Карточка 15 · Триаж почты', href: `${REPO}/blob/main/library/15-triazh-pochty.md` },
            { label: 'Карточка 09 · Транскрибация созвона', href: `${REPO}/blob/main/library/09-transkribaciya-sozvona.md` },
          ],
        },
      },
      templatesLabel: 'Шаблоны: паспорт, карточка, манифест, приёмка',
      templatesHref: `${REPO}/tree/main/templates`,
      ctaHint: 'Хотите тот же разбор целого процесса с человеком? 30 минут, бесплатно.',
    },
  },
  en: {
    meta: {
      title: 'Verdict for your process · AIAS',
      description:
        'The eight AIAS questions for one process step: does it go to a program, an LLM pipeline, an agent, or a human. Three minutes, no sign-up.',
    },
    eyebrow: 'AIAS · verdict online · 3 minutes',
    pageLinkLabel: 'Take the verdict quiz: 8 questions, 3 minutes',
    title: 'Who should own this step?',
    lead:
      'Take one concrete step of one process, not the whole process. Answer the questions from the diagram and get a verdict, an autonomy profile and acceptance demands.',
    disclaimer:
      'This quiz is the standard’s decision table, no AI involved: the rule is written down in full, so it is code. Your answers are not sent anywhere.',
    progressLabel: 'question',
    backLabel: 'Back',
    restartLabel: 'Start over',
    questions: {
      hasEtalon: {
        title: 'Is there an example of a correct result?',
        hint: 'A reference: “this is what correct looks like”. Without it the task cannot be tested or delegated.',
        options: [
          { value: 'yes', label: 'Yes, we have a sample' },
          { value: 'no', label: 'No, “we’ll know it when we see it”' },
        ],
      },
      dataReady: {
        title: 'Does the data exist and is it accessible?',
        hint: 'Via API, database or files, not “in heads and chats”. Quality is known.',
        options: [
          { value: 'yes', label: 'Yes, there is a source' },
          { value: 'no', label: 'No, data is scattered or missing' },
        ],
      },
      useful: {
        title: 'Is the step needed, frequent or expensive?',
        hint: 'The costliest mistake is automating something done once a month in twenty minutes.',
        options: [
          { value: 'no', label: 'Nobody uses the result' },
          { value: 'rare', label: 'Less than weekly and under half an hour' },
          { value: 'yes', label: 'Frequent or expensive' },
        ],
      },
      rule: {
        title: 'Can the rule be written down in full?',
        hint: 'Test: two independent people with this rule produce the same result. It fits a decision table with no “it depends” row.',
        options: [
          { value: 'full', label: 'Yes, the rule is complete', hint: 'conditions → result' },
          { value: 'freeInput', label: 'Rule is clear, input is free-form', hint: 'email, document, photo, audio' },
          { value: 'judgment', label: 'No, judgment is needed' },
        ],
      },
      check: {
        title: 'How cheap is it to verify the result?',
        hint: 'Verification is not “is it done” but “is it correct”.',
        options: [
          { value: 'auto', label: 'Automatically', hint: 'schema, reconciliation, test' },
          { value: 'quick', label: 'A human in 10 seconds', hint: 'a draft before sending' },
          { value: 'expert', label: 'Only an expert, and slowly' },
        ],
      },
      singleRun: {
        title: 'Does it fit into a single run?',
        hint: 'Roughly up to ten tool steps, no human in the middle, no multi-day waits.',
        options: [
          { value: 'yes', label: 'Yes, one pass' },
          { value: 'no', label: 'No, it is a long chain' },
        ],
      },
      consequences: {
        title: 'Consequences',
        hint: 'These three answers set the autonomy profile and acceptance demands.',
        sideEffect: {
          label: 'What does the step change externally?',
          options: [
            { value: 'read', label: 'Read only' },
            { value: 'notify', label: 'Notifies' },
            { value: 'write', label: 'Writes: account, payment, sending' },
          ],
        },
        irreversible: {
          label: 'Is there an irreversible action?',
          options: [
            { value: 'yes', label: 'Yes: money, documents, publishing' },
            { value: 'no', label: 'No, everything can be undone' },
          ],
        },
        personalData: {
          label: 'Is personal data involved?',
          options: [
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' },
          ],
        },
      },
    },
    result: {
      heading: 'Verdict',
      autonomyTitle: 'Starting autonomy by stage',
      autonomyStages: { collect: 'collect', analyze: 'analyze', decide: 'decide', act: 'act' },
      demandsTitle: 'What to demand at acceptance',
      flags: {
        irreversible:
          'Irreversible action: code executes, a human approves. Permanently for money and documents.',
        personalData:
          'Personal data: an approved model perimeter or masking before sending. A gate, not a wish.',
        rope: 'The rope: daily output limit ≤ the approver’s capacity; otherwise the queue turns approval into “approve all”.',
      },
      forms: {
        stopEtalon: {
          tag: 'STOP',
          title: 'Stays with a human: no reference yet',
          text: 'Without an example of a correct result the task can only be checked by reading every run. First the reference, then any automation talk. This is a finding, not a refusal: previous attempts likely died right here.',
          demands: [
            'Collect 5–10 “input → correct output” pairs: the reference and the future tests',
            'Until then: a human with an AI assistant (F1)',
          ],
        },
        stopData: {
          tag: 'STOP',
          title: 'Data first',
          text: 'An agent on top of chaos is a generator of confident errors. First the data work: source, snapshot, reference tables, reconciliation. Then return to this question.',
          demands: ['One source of truth: an as-is snapshot; calculations read from it', 'Measurable quality: load completeness, reconciliation'],
          library: [{ label: 'Card 07 · Sales snapshot → data marts', href: `${REPO}/blob/main/library/07-snimok-prodazh-vitriny.md` }],
        },
        f0: {
          tag: 'F0',
          title: 'Remove the step',
          text: 'Nobody uses the result, and the best automation is the one that does not exist. Check whether a neighbouring step can change so this one disappears.',
          demands: ['Make sure no hidden consumers depend on it', 'Delete it, don’t keep it “just in case”'],
        },
        f1: {
          tag: 'F0 · F1',
          title: 'Leave it / assistant',
          text: 'Rare and cheap never pays back development and maintenance. Do it by hand, with an AI assistant if you want it faster.',
          demands: ['Revisit if frequency grows', 'Build nothing here “for the future”'],
        },
        f3: {
          tag: 'F3',
          title: 'A program, no AI at runtime',
          text: 'The rule is complete, so this is deterministic code: identical, fast, nearly free. AI belongs in building the program, not inside it. Canonical numbers are computed by code only.',
          demands: [
            'The rule as a decision table maintained by the process owner',
            'Tests on the rule = the reference; exceptions go to a human with context',
            'Two environments; production only through review',
          ],
          library: [
            { label: 'Card 01 · Payment requests', href: `${REPO}/blob/main/library/01-zayavki-na-oplatu.md` },
            { label: 'Card 02 · Payout reconciliation', href: `${REPO}/blob/main/library/02-sverka-vyplat-marketpleysa.md` },
          ],
        },
        f4: {
          tag: 'F4',
          title: 'A pipeline with an LLM step',
          text: 'Code drives the flow; the model does one step: turning free-form input into a schema-valid structure. Anything off-schema is rejected into the exception queue, not “fixed”.',
          demands: [
            'An AI-step manifest: input, role, MUST/MUST NOT instruction, output schema, reference set',
            'Exception queue: the reviewer’s capacity computed (the 80 % rule)',
            'Run log and a regression set for every prompt or model change',
          ],
          library: [
            { label: 'Card 13 · Invoice email → payment request', href: `${REPO}/blob/main/library/13-schet-iz-pisma-v-zayavku.md` },
            { label: 'Card 08 · Ads digest', href: `${REPO}/blob/main/library/08-daydzhest-reklamy-i-stavki.md` },
          ],
        },
        f1f2: {
          tag: 'F1 · F2',
          title: 'An expert with an assistant',
          text: 'Only an expert can verify the result, so AI assists the expert rather than replacing them. Package the repeatable part as a one-command playbook.',
          demands: ['The expert stays the author: the model drafts, they decide', 'Repeatable parts → a versioned playbook (F2)'],
        },
        split: {
          tag: 'SPLIT',
          title: 'Split into a chain',
          text: '“An agent running the process for a week” is not an agent; it is a process without a map. Split into steps with checkpoints and run each step through these same questions.',
          demands: ['Every chain step gets its own verdict', 'Between steps: verifiable artifacts, not “the agent remembers”'],
        },
        f5: {
          tag: 'F5',
          title: 'An agent',
          text: 'Steps cannot be scripted in advance and verification is cheap: an agent fits. It thinks and drafts; code executes; a human approves the irreversible. Everything an agent produces is a draft until the card says otherwise.',
          demands: [
            'Tools only from a registry with read / notify / write levels',
            'Budget, run limits, action log, a kill switch without a deploy',
            'Autonomy grows by the rule of three: n = 3 / acceptable error rate',
          ],
          library: [
            { label: 'Card 15 · Inbox triage', href: `${REPO}/blob/main/library/15-triazh-pochty.md` },
            { label: 'Card 09 · Call transcription', href: `${REPO}/blob/main/library/09-transkribaciya-sozvona.md` },
          ],
        },
      },
      templatesLabel: 'Templates: passport, card, manifest, acceptance',
      templatesHref: `${REPO}/tree/main/templates`,
      ctaHint: 'Want the same breakdown of a whole process with a human? 30 minutes, free.',
    },
  },
}
