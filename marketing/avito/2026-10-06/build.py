"""Картинки к объявлению на Авито: десять слайдов 4:3 из одного шаблона.

Запуск: python3 build.py — пишет html/NN.html и png/NN.png (рендер headless Chrome).
Формулировки кейсов взяты с сайта, app/data/cases/ru.ts. Ссылок, телефонов и
мессенджеров на картинках нет: площадка такие фото не пропускает.
"""
import base64
import pathlib
import subprocess

HERE = pathlib.Path(__file__).parent
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
CARDS = pathlib.Path("/Users/minas/projects/sai_kotelnikovartifact/site-assets/wb-main-2026-10-02/cards")
W, H = 1600, 1200

CSS = """
*{box-sizing:border-box}
html,body{margin:0;background:#0e1430}
.s{width:1600px;height:1200px;padding:84px 96px 0;position:relative;overflow:hidden;color:#f4f5fa;
  font-family:-apple-system,'SF Pro Display','Helvetica Neue',Arial,sans-serif;
  background:radial-gradient(1200px 700px at 100% 0%,#1d2756 0%,#0e1430 62%)}
.tag{color:#ff7a3d;font-weight:700;letter-spacing:.09em;text-transform:uppercase;font-size:29px}
h1{font-size:88px;line-height:1.05;font-weight:800;margin:26px 0 0;letter-spacing:-.022em;max-width:1340px}
.sub{font-size:39px;color:#b3b9d2;margin-top:26px;line-height:1.3;max-width:1300px}
.foot{position:absolute;left:96px;right:96px;bottom:54px;display:flex;justify-content:space-between;
  font-size:27px;color:#7f87a8;border-top:2px solid #262f5c;padding-top:22px}
.facts{display:grid;grid-template-columns:1fr 1fr;gap:26px;margin-top:54px}
.facts.three{grid-template-columns:1fr 1fr 1fr}
.fact{background:#19214a;border:2px solid #2a3468;border-radius:26px;padding:34px 36px}
.fact b{display:block;font-size:50px;line-height:1.1;color:#fff;font-weight:800;letter-spacing:-.01em}
.fact span{display:block;font-size:30px;color:#b3b9d2;margin-top:12px;line-height:1.3}
.chips{display:flex;flex-wrap:wrap;gap:20px;margin-top:60px;max-width:1380px}
.chip{font-size:35px;font-weight:600;padding:20px 34px;border-radius:999px;background:#19214a;border:2px solid #2a3468}
.chip.hot{background:#ff7a3d;border-color:#ff7a3d;color:#14183a}
table{width:100%;border-collapse:collapse;margin-top:46px;font-size:33px}
th{text-align:right;color:#8a92b4;font-weight:600;padding:16px 18px;border-bottom:2px solid #2a3468;font-size:27px}
th:first-child,td:first-child{text-align:left}
td{text-align:right;padding:22px 18px;border-bottom:2px solid #1c2550;font-variant-numeric:tabular-nums}
td.good{color:#5fe0a0;font-weight:800}td.bad{color:#ff6b6b;font-weight:800}
.note{font-size:27px;color:#7f87a8;margin-top:22px}
.chat{margin-top:44px;display:flex;flex-direction:column;gap:24px}
.msg{font-size:34px;line-height:1.35;padding:28px 34px;border-radius:28px;max-width:1120px}
.msg.q{align-self:flex-end;background:#ff7a3d;color:#14183a;font-weight:600}
.msg.a{background:#19214a;border:2px solid #2a3468}
.msg small{display:block;font-size:25px;color:#8a92b4;margin-bottom:8px;font-weight:600}
.flow{display:flex;align-items:center;gap:26px;margin-top:54px}
.node{flex:1;background:#19214a;border:2px solid #2a3468;border-radius:26px;padding:40px 20px;text-align:center;font-size:40px;font-weight:700}
.node.src{background:#ff7a3d;border-color:#ff7a3d;color:#14183a}
.arrow{font-size:60px;color:#ff7a3d;font-weight:800}
.shots{display:grid;grid-template-columns:repeat(4,1fr);gap:22px;margin-top:40px}
.shots img{width:100%;height:440px;object-fit:cover;border-radius:22px;display:block}
.steps{margin-top:44px;display:flex;flex-direction:column;gap:22px}
.step{display:flex;gap:30px;align-items:center;background:#19214a;border:2px solid #2a3468;border-radius:26px;padding:26px 34px}
.step i{font-style:normal;flex:none;width:76px;height:76px;border-radius:50%;background:#ff7a3d;color:#14183a;
  font-size:42px;font-weight:800;display:flex;align-items:center;justify-content:center}
.step b{font-size:40px;font-weight:800}.step span{display:block;font-size:29px;color:#b3b9d2;margin-top:6px}
.step em{font-style:normal;margin-left:auto;font-size:40px;font-weight:800;color:#ff7a3d;white-space:nowrap}
"""


def fact(big, small):
    return f'<div class="fact"><b>{big}</b><span>{small}</span></div>'


def img(name):
    data = base64.b64encode((CARDS / name).read_bytes()).decode()
    return f'<img src="data:image/png;base64,{data}">'


def shots():
    names = ["wb-1041264341.png", "wb-1068044235.png", "wb-1566842358.png", "wb-1575434029.png"]
    return '<div class="shots">' + "".join(img(n) for n in names) + "</div>"


SLIDES = [
    ("Разработчик · свой магазин на трёх площадках",
     "Автоматизация и ИИ для продавцов маркетплейсов",
     "Wildberries · Ozon · Яндекс Маркет",
     '<div class="chips"><div class="chip hot">Прибыль по артикулу</div><div class="chip">Отчёты и финансы</div>'
     '<div class="chip">Остатки</div><div class="chip">Реклама</div><div class="chip">Отзывы</div>'
     '<div class="chip">Магазин в чате</div><div class="chip">ИИ-агенты</div><div class="chip">Фото карточек</div>'
     '<div class="chip hot">Обучение вайбкодингу</div></div>'),

    ("Услуга 1 · прибыль",
     "Прибыль по каждому артикулу",
     "Комиссия, логистика, хранение, штрафы, реклама и себестоимость в одной таблице",
     "<table><tr><th>Товар</th><th>Продано</th><th>Выручка</th><th>Удержания</th><th>Себестоимость</th><th>Реклама</th><th>Остаётся</th></tr>"
     '<tr><td>Подвеска</td><td>22</td><td>164 800</td><td>58 300</td><td>41 200</td><td>9 400</td><td class="good">55 900</td></tr>'
     '<tr><td>Браслет</td><td>9</td><td>71 100</td><td>26 900</td><td>19 800</td><td>6 100</td><td class="good">18 300</td></tr>'
     '<tr><td>Кольцо</td><td>4</td><td>23 600</td><td>10 700</td><td>8 400</td><td>7 900</td><td class="bad">−3 400</td></tr></table>'
     '<div class="note">Пример отчёта. Видно, какие товары зарабатывают, а какие съедают деньги.</div>'),

    ("Услуга 2 · кейс: финансовый контур торговой компании",
     "Отчёт за полчаса вместо недель",
     "Деньги, бюджет, заявки на оплату и сверка в одной системе",
     '<div class="facts three">' + fact("Месяц", "от начала до рабочей системы")
     + fact("10 таблиц", "и переписку заменила одна система") + fact("43 %", "изменений вносит сам финансист") + "</div>"),

    ("Услуга 3 · остатки",
     "Остатки склада доезжают в магазин сами",
     "Не продаёте то, чего нет. Не правите остатки руками по позициям",
     '<div class="flow"><div class="node src">Склад</div><div class="arrow">→</div><div class="node">Wildberries</div>'
     '<div class="node">Ozon</div><div class="node">Яндекс Маркет</div></div>'
     '<div class="facts">' + fact("22 000 товаров", "каталог в одном из проектов")
     + fact("3 дня", "от запроса до запуска синхронизации на трёх площадках") + "</div>"),

    ("Услуга 4 · кейс: агенты управления рекламой",
     "Реклама под контролем каждый день",
     "Ночной расчёт и утренняя сводка идут сами. Вам остаётся решение",
     '<div class="facts three">' + fact("11 агентов", "от сводки до ставок")
     + fact("По данным", "ставка меняется по цепочке проверок") + fact("Без обхода", "кабинетов каждое утро") + "</div>"),

    ("Услуга 5 · мой продукт",
     "Вопрос в чат вместо обхода трёх кабинетов",
     "",
     '<div class="chat"><div class="msg q">Что вчера с заказами на WB и Ozon и где кончаются остатки?</div>'
     '<div class="msg a"><small>Ответ словами, пример</small>WB: 41 заказ, Ozon: 12. У трёх товаров остаток меньше недели продаж. Показать список и предложить дозаказ?</div></div>'
     '<div class="facts">' + fact("48 инструментов", "на три площадки")
     + fact("Два шага", "любое изменение: предпросмотр, потом отправка") + "</div>"),

    ("Услуга 6 · ИИ-агенты под вашу рутину",
     "Ответы на отзывы без ручной работы",
     "",
     '<div class="chat"><div class="msg a"><small>Отзыв покупателя · ★★★★★</small>Красивая подвеска, пришла быстро, упаковка подарочная. Цепочка коротковата.</div>'
     '<div class="msg q">Спасибо за отзыв! Рады, что подвеска понравилась. Цепочку можно заменить на длинную, напишите нам в чат заказа.</div></div>'
     '<div class="note">Пример. Программа готовит ответ по вашим правилам. Вы подтверждаете его или включаете отправку без проверки.</div>'
     '<div class="facts">' + fact("Сверки и проверки", "агент делает каждый день сам")
     + fact("Новый агент", "это файл с инструкцией, без кода под него") + "</div>"),

    ("Услуга 7 · свой магазин KOTELNIKOVARTIFACT",
     "Фото карточек с помощью нейросетей",
     "Главные фото в едином стиле магазина",
     shots()),

    ("Обучение · от разработчика",
     "Обучение вайбкодингу для специалистов компании",
     "Учу делать свои рабочие приложения с ИИ и доводить их до запуска",
     '<div class="facts">' + fact("43 % изменений", "вносит финансист в свою систему")
     + fact("73 % изменений", "вносит специалист по товару в свой портал")
     + fact("7 приложений", "те же люди запустили за месяц")
     + fact("1 день", "от первой строки кода до рабочей выкладки") + "</div>"),

    ("Как работаем",
     "Сначала разбор, потом внедрение",
     "",
     '<div class="steps">'
     '<div class="step"><i>1</i><div><b>Разбор кабинета и процессов</b><span>Первым трём клиентам. Дальше 50 000 ₽</span></div><em>25 000 ₽</em></div>'
     '<div class="step"><i>2</i><div><b>План</b><span>Что автоматизировать, сколько стоит и что даст. Остаётся у вас</span></div></div>'
     '<div class="step"><i>3</i><div><b>Внедрение по этапам</b><span>Договор с ИП, оплата по этапам</span></div><em>от 200 000 ₽</em></div>'
     '<div class="step"><i>4</i><div><b>Обучение ваших специалистов</b><span>Программа под ваши задачи</span></div></div>'
     "</div>"
     '<div class="note">Напишите в сообщения: на какой площадке продаёте и что отнимает больше всего времени.</div>'),
]


def main():
    (HERE / "html").mkdir(exist_ok=True)
    (HERE / "png").mkdir(exist_ok=True)

    for n, (tag, title, sub, body) in enumerate(SLIDES, 1):
        page = (
            f'<!doctype html><html lang="ru"><meta charset="utf-8"><style>{CSS}</style><div class="s">'
            f'<div class="tag">{tag}</div><h1>{title}</h1>'
            + (f'<div class="sub">{sub}</div>' if sub else "")
            + body
            + f'<div class="foot"><span>Автоматизация и ИИ для селлеров</span><span>{n} / {len(SLIDES)}</span></div></div></html>'
        )
        html = HERE / "html" / f"{n:02d}.html"
        html.write_text(page, encoding="utf-8")
        subprocess.run(
            [CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars", f"--window-size={W},{H}",
             f"--screenshot={HERE / 'png' / f'{n:02d}.png'}", html.as_uri()],
            check=True, capture_output=True, timeout=120,
        )

    sheet = (
        '<!doctype html><meta charset="utf-8"><style>body{margin:0;background:#000;display:grid;'
        'grid-template-columns:repeat(4,400px);gap:6px;padding:6px}img{width:400px;height:300px;display:block}</style>'
        + "".join(f'<img src="../png/{n:02d}.png">' for n in range(1, len(SLIDES) + 1))
    )
    (HERE / "html" / "sheet.html").write_text(sheet, encoding="utf-8")
    subprocess.run(
        [CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--window-size=1630,924",
         f"--screenshot={HERE / 'sheet.png'}", (HERE / "html" / "sheet.html").as_uri()],
        check=True, capture_output=True, timeout=120,
    )


if __name__ == "__main__":
    main()
