// Лёгкий модуль без текстов страницы: его тянет корневой layout (ThemeProvider),
// поэтому сюда нельзя импортировать ./ru — иначе копия страницы попадёт в общий бандл.

/** Источник заявки и имя страницы; дублируется строкой в lib/evolution/schemas.ts. */
export const AVTOMATIZACIYA_SLUG = 'avtomatizaciya' as const
export const avtomatizaciyaPath = '/avtomatizaciya'
