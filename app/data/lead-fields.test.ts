import { describe, expect, it } from 'vitest'
import { LEAD_LANDINGS, leadSourceSchema } from '@/lib/evolution/schemas'
import { landingCopy } from '@/app/data/landings'
import { AVTOMATIZACIYA_SLUG, avtomatizaciya } from '@/app/data/avtomatizaciya'
import { leadFieldsFor } from './lead-fields'

describe('источник заявки', () => {
  it('схема принимает заявку с новой страницы', () => {
    expect(leadSourceSchema.safeParse({ landing: AVTOMATIZACIYA_SLUG }).success).toBe(true)
  })

  it('новая страница отдаёт свои необязательные поля', () => {
    expect(leadFieldsFor(AVTOMATIZACIYA_SLUG)).toBe(avtomatizaciya.lead.fields)
  })

  it('старый лендинг отдаёт свои поля, как раньше', () => {
    expect(leadFieldsFor('kontur')).toBe(landingCopy.kontur.lead.fields)
  })

  it('для каждого источника схемы поля находятся без ошибки', () => {
    for (const landing of LEAD_LANDINGS) expect(() => leadFieldsFor(landing)).not.toThrow()
  })
})
