import Script from 'next/script'

// Счётчик подключается только при заданном NEXT_PUBLIC_YM_ID: в dev и в
// тестовых сборках переменной нет, и страница отдаётся без внешнего скрипта.
// Код вставки стандартный из кабинета Метрики; webvisor выключен намеренно.
export function YandexMetrika() {
  const id = Number(process.env.NEXT_PUBLIC_YM_ID)
  if (!id) return null
  return (
    <>
      <Script id="yandex-metrika" strategy="afterInteractive">
        {`(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
ym(${id}, "init", { clickmap:true, trackLinks:true, accurateTrackBounce:true, webvisor:false });`}
      </Script>
      <noscript>
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`https://mc.yandex.ru/watch/${id}`} style={{ position: 'absolute', left: '-9999px' }} alt="" />
        </div>
      </noscript>
    </>
  )
}
