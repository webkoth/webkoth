// Размеры холстов и безопасные зоны обложек соцсетей. Отдельный модуль без
// 'use client': его импортирует и серверная страница /banner (выбор варианта),
// и клиентский компонент Banner. Из 'use client'-файла сервер получил бы не
// объект, а клиентскую ссылку — и `v in BANNER_SPECS` всегда было бы false.

export type BannerVariant = 'youtube' | 'facebook' | 'linkedin' | 'x'

type Spec = {
  width: number
  height: number
  /** Левый край и ширина текстового блока (с учётом аватара и мобильной обрезки сети). */
  textLeft: number
  textWidth: number
  /** Вертикальный центр текстового блока (по умолчанию — середина холста). */
  textCenterY?: number
  seal: number
  headline: number
  lead: number
  /** Схема: ширина и сдвиг правого края (отрицательный — уходит за холст). */
  stackWidth: number
  stackRight: number
  stackOpacity: number
}

// Размеры и зоны по актуальным рекомендациям сетей:
// YouTube 2560×1440, на всех устройствах видна только центральная полоса 1546×423;
// X 1500×500, слева внизу ложится аватар, сверху/снизу ~60px могут обрезаться;
// LinkedIn (профиль) 1584×396, аватар слева внизу; Facebook 1640×624, на телефоне
// видна центральная часть шириной ~1110px.
export const BANNER_SPECS: Record<BannerVariant, Spec> = {
  youtube: {
    width: 2560,
    height: 1440,
    textLeft: 560,
    textWidth: 1040,
    seal: 22,
    headline: 64,
    lead: 28,
    stackWidth: 980,
    stackRight: -110,
    stackOpacity: 0.32,
  },
  facebook: {
    width: 1640,
    height: 624,
    textLeft: 300,
    textWidth: 840,
    seal: 17,
    headline: 50,
    lead: 23,
    stackWidth: 720,
    stackRight: 60,
    stackOpacity: 0.3,
  },
  linkedin: {
    width: 1584,
    height: 396,
    textLeft: 440,
    textWidth: 640,
    seal: 14,
    headline: 42,
    lead: 19,
    stackWidth: 520,
    stackRight: 40,
    stackOpacity: 0.28,
  },
  x: {
    width: 1500,
    height: 500,
    textLeft: 440,
    textWidth: 720,
    seal: 15,
    headline: 42,
    lead: 20,
    stackWidth: 560,
    stackRight: 10,
    stackOpacity: 0.3,
  },
}
