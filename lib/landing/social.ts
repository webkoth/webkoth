// Единый список соцсетей владельца: шапка (иконки у фото) и футер (иконка + подпись).
// Хэндлы везде одни и те же — minasarkisyan; личный Telegram — @abnorsky, канал — @webkoth.

export type SocialKey = 'github' | 'telegram' | 'youtube' | 'instagram' | 'threads' | 'linkedin' | 'x' | 'telegramChannel' | 'facebook'

export type SocialLink = { key: SocialKey; href: string; label: { ru: string; en: string } }

export const SOCIAL_LINKS: SocialLink[] = [
  { key: 'github', href: 'https://github.com/webkoth', label: { ru: 'GitHub', en: 'GitHub' } },
  { key: 'telegram', href: 'https://t.me/abnorsky', label: { ru: 'Telegram', en: 'Telegram' } },
  { key: 'youtube', href: 'https://www.youtube.com/@msarkisyan', label: { ru: 'YouTube', en: 'YouTube' } },
  { key: 'instagram', href: 'https://www.instagram.com/minasarkisyan/', label: { ru: 'Instagram', en: 'Instagram' } },
  // { key: 'facebook', href: 'https://www.facebook.com/sarkisyanminas', label: { ru: 'Facebook', en: 'Facebook' } },
  { key: 'threads', href: 'https://www.threads.com/@minasarkisyan', label: { ru: 'Threads', en: 'Threads' } },
  { key: 'linkedin', href: 'https://www.linkedin.com/in/minasarkisyan-web-developer/', label: { ru: 'LinkedIn', en: 'LinkedIn' } },
  { key: 'x', href: 'https://x.com/minasarkisyan', label: { ru: 'X', en: 'X' } },
  { key: 'telegramChannel', href: 'https://t.me/webkoth', label: { ru: 'Telegram-канал', en: 'Telegram channel' } },
]

export const SOCIAL_LINKS_HEADER: SocialLink[] = [
  { key: 'telegram', href: 'https://t.me/abnorsky', label: { ru: 'Telegram', en: 'Telegram' } },
  { key: 'github', href: 'https://github.com/webkoth', label: { ru: 'GitHub', en: 'GitHub' } },
  { key: 'youtube', href: 'https://www.youtube.com/@msarkisyan', label: { ru: 'YouTube', en: 'YouTube' } },
  { key: 'instagram', href: 'https://www.instagram.com/minasarkisyan/', label: { ru: 'Instagram', en: 'Instagram' } },
  { key: 'telegramChannel', href: 'https://t.me/webkoth', label: { ru: 'Telegram-канал', en: 'Telegram channel' } },
]
