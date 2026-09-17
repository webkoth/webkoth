import json, sys, urllib.request, re
cfg=json.load(open('/Users/minas/projects/yandex/projects.json')); items=cfg if isinstance(cfg,list) else cfg['projects']
TOK=[p for p in items if p['id']=='webkoth'][0]['token']
def api(base, service, params):
    r=urllib.request.Request(f'https://api.direct.yandex.com/json/{base}/{service}',data=json.dumps({"method":"get","params":params}).encode(),method='POST',headers={'Authorization':'Bearer '+TOK,'Accept-Language':'ru','Content-Type':'application/json; charset=utf-8'})
    raw=urllib.request.urlopen(r,timeout=60).read().decode()
    raw=re.sub(r'(:\s*)(\d{16,})', r'\1"\2"', raw)  # длинные id как строки
    d=json.loads(raw)
    if 'error' in d: raise SystemExit(f"{service}: {d['error']}")
    return d['result']
import os
created=json.load(open(os.path.join(os.path.dirname(__file__),'created-2026-09-17.json')))
cids=[v['campaignId'] for v in created.values() if v.get('campaignId')]
cs=api('v501','campaigns',{"SelectionCriteria":{"Ids":cids},"FieldNames":["Id","Name","State","Status","StatusPayment","Type","StartDate","TimeTargeting","NegativeKeywords"],"UnifiedCampaignFieldNames":["BiddingStrategy","CounterIds","Settings"]})
for c in cs['Campaigns']:
    bs=c['UnifiedCampaign']['BiddingStrategy']
    net=bs['Network']; wl=int(net.get('WbMaximumClicks',{}).get('WeeklySpendLimit',0))/1e6
    days=[s.split(',') for s in c['TimeTargeting']['Schedule']['Items']]
    hours={d[0]: sum(1 for x in d[1:] if x!='0') for d in days}
    print(f"{c['Id']} «{c['Name']}» тип {c['Type']} | статус {c['Status']} / состояние {c['State']} | поиск {bs['Search']['BiddingStrategyType']} | сети {net['BiddingStrategyType']} {wl:.0f} ₽/нед | часы {hours} | минус-слов {len(c['NegativeKeywords']['Items'])} | счётчик {c['UnifiedCampaign']['CounterIds']['Items']}")
    ags=api('v501','adgroups',{"SelectionCriteria":{"CampaignIds":[c['Id']]},"FieldNames":["Id","Name","Status","RegionIds"]})['AdGroups']
    ads=api('v501','ads',{"SelectionCriteria":{"CampaignIds":[c['Id']]},"FieldNames":["Id","AdGroupId","Status","State","Type"],"ResponsiveAdFieldNames":["Titles","Texts","Href","SitelinkSetId","AdExtensions","AdImages"]})['Ads']
    kws=api('v5','keywords',{"SelectionCriteria":{"CampaignIds":[c['Id']]},"FieldNames":["Id","AdGroupId","Keyword","State"]})['Keywords']
    for g in ags:
        ga=[a for a in ads if str(a['AdGroupId'])==str(g['Id'])]
        gk=[k for k in kws if str(k['AdGroupId'])==str(g['Id'])]
        a=ga[0] if ga else {}
        ra=a.get('ResponsiveAd',{})
        print(f"   группа {g['Id']} «{g['Name']}» {g['Status']} регионы {g['RegionIds']} | объявлений {len(ga)} статус {a.get('Status')}/{a.get('State')} заголовков {len(ra.get('Titles',[]))} текстов {len(ra.get('Texts',[]))} картинок {len((ra.get("AdImages") or {}).get("Items",[]))} уточнений {len(ra.get('AdExtensions') or [])} быстрые ссылки {bool(ra.get('SitelinkSetId'))} | фраз {len([k for k in gk if k['Keyword']!='---autotargeting'])} + автотаргетинг {any(k['Keyword']=='---autotargeting' for k in gk)}")
