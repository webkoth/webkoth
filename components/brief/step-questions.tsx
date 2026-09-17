import type { Dispatch } from 'react'
import type { QuestionDef } from '@/app/data/brief/questions'
import type { BriefAnswers } from '@/lib/brief/schema'
import type { BriefAction } from '@/lib/brief/state'
import { QuestionBlock } from './question-block'

// Шаги 1 и 2: список вопросов с вариантами.

export function StepQuestions({
  title,
  questions,
  answers,
  dispatch,
  invalid,
}: {
  title: string
  questions: readonly QuestionDef[]
  answers: BriefAnswers
  dispatch: Dispatch<BriefAction>
  invalid: readonly string[]
}) {
  return (
    <section className="space-y-7">
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      {questions.map((q) => (
        <QuestionBlock key={q.id} q={q} answers={answers} dispatch={dispatch} invalid={invalid.includes(q.id)} />
      ))}
    </section>
  )
}
