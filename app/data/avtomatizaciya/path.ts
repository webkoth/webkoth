// Лёгкий модуль без текстов страницы: его тянут маршруты и тумблер языка,
// поэтому сюда нельзя импортировать ./ru — иначе копия страницы попадёт в общий бандл.

/** Источник заявки и имя страницы; дублируется строкой в lib/evolution/schemas.ts. */
export const AVTOMATIZACIYA_SLUG = 'avtomatizaciya' as const
/** Прежний адрес оффера: с 25.10.2026 перенаправляется на главную (next.config.mjs). */
export const avtomatizaciyaPath = '/avtomatizaciya'
/** Оффер живёт на главной. */
export const glavnayaPath = '/'
