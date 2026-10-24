import { landingCopy, type LeadField } from '@/app/data/landings'
import { AVTOMATIZACIYA_SLUG, avtomatizaciya } from '@/app/data/avtomatizaciya'
import type { LeadSource } from '@/lib/evolution/schemas'

// Подписи необязательных полей заявки по источнику: клиент присылает только ключи,
// подписи для уведомления берутся из данных страницы.
export function leadFieldsFor(landing: LeadSource['landing']): readonly LeadField[] | undefined {
  if (landing === AVTOMATIZACIYA_SLUG) return avtomatizaciya.lead.fields
  return landingCopy[landing].lead.fields
}
