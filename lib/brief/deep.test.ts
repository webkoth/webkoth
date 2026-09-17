import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import * as deep from './deep'
import * as state from './state'

describe('deep', () => {
  it('state реэкспортирует те же функции, прежние импорты не меняются', () => {
    expect(state.MAX_DEEP).toBe(deep.MAX_DEEP)
    expect(state.deepList).toBe(deep.deepList)
    expect(state.isDeepComplete).toBe(deep.isDeepComplete)
    expect(state.needsCheck).toBe(deep.needsCheck)
  })

  it('из схемы берутся только типы, данные брифа не тянут редьюсер', () => {
    const src = (file: string) => readFileSync(join(process.cwd(), file), 'utf8')
    expect(src('lib/brief/deep.ts')).not.toMatch(/^import \{[^}]*\} from '\.\/schema'/m)
    expect(src('app/data/brief/questions.ts')).toMatch(/import \{ needsCheck \} from '@\/lib\/brief\/deep'/)
  })
})
