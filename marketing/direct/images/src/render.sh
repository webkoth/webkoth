#!/bin/sh
# Рендер баннеров Контура из kontur.html безголовым Chrome: node не нужен.
set -e
cd "$(dirname "$0")"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
shot() { # формат, сюжет, ширина, высота, файл
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
    --window-size="$3,$4" --screenshot="../$5" "file://$PWD/kontur.html?f=$1&v=$2" >/dev/null 2>&1
}
shot 1x1 scheme 1080 1080 kontur-1x1.png
shot 4x3 scheme 1200 900 kontur-4x3.png
shot 16x9 table 1920 1080 kontur-16x9.png
shot 9x16 scheme 1080 1920 kontur-9x16.png
shot 1x1 table 1080 1080 kontur-1x1-table.png
