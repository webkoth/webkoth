"""Проверка Jev на русском: заказчик или подрядчик по тексту вакансий hh.ru.

Jev не видит отрасль из hh; сравниваем с эвристикой analyze.mjs (любая отрасль вне ИТ -> заказчик).
"""
import json, os, re, sys, time, collections, urllib.request
from concurrent.futures import ThreadPoolExecutor

DATA = "/Users/minas/projects/webkoth/marketing/vacancies/data"
OUT = os.path.join(DATA, "jev-roles.jsonl")
KEY = os.environ["TYPESAFE_API_KEY"]
IT = re.compile(r"информационные технологии|системная интеграция|интернет", re.I)

def clean(html, n):
    t = re.sub(r"<[^>]+>", " ", html or "")
    return re.sub(r"\s+", " ", t).strip()[:n]

employers = {}
for l in open(f"{DATA}/employers.jsonl"):
    e = json.loads(l); employers[e["id"]] = e

vac = collections.defaultdict(list)
for l in open(f"{DATA}/vacancies.jsonl"):
    v = json.loads(l); vac[str(v["companyId"])].append(v)

def heuristic(e):
    ind = e["industries"]
    if not ind: return None
    return "customer" if any(not IT.search(i) for i in ind) else "contractor"

QUESTION = {
    "role": {
        "type": "choice",
        "instructions": "Кем является компания `company` по отношению к ИИ-проектам, судя по её вакансиям `vacancies`?",
        "criteria": {
            "customer": "Отраслевая компания (ритейл, банк, производство, логистика, медицина, госорган и т.п.), которая нанимает людей, чтобы внедрять ИИ в собственный бизнес",
            "contractor": "ИТ-компания: интегратор, веб-студия, аутсорс-разработка, разработчик ИТ-продукта или SaaS, которая делает ИИ-решения для чужих клиентов или продаёт свой софт",
        },
    }
}

def ask(eid):
    e = employers[eid]
    vs = vac.get(eid, [])[:3]
    state = {
        "company": e["name"],
        "site": e.get("site"),
        "vacancies": [{"title": v["name"], "description": clean(v.get("description"), 900)} for v in vs],
    }
    body = json.dumps({"state": state, "model": "jev-latest", "questions": QUESTION}).encode()
    req = urllib.request.Request("https://api.typesafe.ai/v1/systemone", data=body, method="POST",
        headers={"Authorization": f"Bearer {KEY}", "Content-Type": "application/json"})
    for attempt in range(4):
        try:
            t0 = time.time()
            r = json.load(urllib.request.urlopen(req, timeout=30))
            a = r["answers"]["role"]
            return {"id": eid, "name": e["name"], "industries": e["industries"], "heur": heuristic(e),
                    "jev": a["choice"], "conf": a["confidence"], "p_contr": a["probabilities"]["contractor"],
                    "tokens": r["usage"]["input_tokens"], "sec": round(time.time() - t0, 3), "nvac": len(vs)}
        except Exception as ex:
            err = str(ex); time.sleep(2 ** attempt)
    return {"id": eid, "name": e["name"], "error": err}

ids = list(employers)
if len(sys.argv) > 1: ids = ids[: int(sys.argv[1])]
with ThreadPoolExecutor(8) as ex, open(OUT, "w") as f:
    for res in ex.map(ask, ids):
        f.write(json.dumps(res, ensure_ascii=False) + "\n")
print("готово", len(ids), "->", OUT)
