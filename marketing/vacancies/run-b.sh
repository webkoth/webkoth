#!/bin/zsh
# Порционный проход B: каждый запуск добирает 100 описаний и завершается, освобождая память.
# Скрипт возобновляемый, повторный запуск пропускает уже собранное.
cd "$(dirname "$0")/../.."
have=$(wc -l < marketing/vacancies/data/vacancies.jsonl)
for target in $(seq $((have + 100)) 100 2000); do
  NODE_OPTIONS="--max-old-space-size=256" node marketing/vacancies/collect.mjs --stage=b --limit=$target --pause=2000 || true
  now=$(wc -l < marketing/vacancies/data/vacancies.jsonl)
  echo "=== порция до $target: собрано $now ==="
  [ "$now" -ge 1926 ] && break
done
echo "ИТОГО: $(wc -l < marketing/vacancies/data/vacancies.jsonl)"
