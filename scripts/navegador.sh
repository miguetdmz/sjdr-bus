#!/usr/bin/env bash
# M-08: corre las pruebas en navegador (Playwright + Chromium, gratuitos) sobre la
# app ya compilada en web/dist. Si falta el navegador de prueba, dice cómo
# instalarlo gratis y falla.
set -euo pipefail
cd "$(dirname "$0")/.."
if [ ! -f web/dist/index.html ]; then
  echo "Falta la app compilada: corre «npm run build» antes" >&2
  exit 1
fi
if ! node -e "const {chromium}=require('@playwright/test');require('fs').accessSync(chromium.executablePath())" 2>/dev/null; then
  echo "Falta el navegador de prueba (Chromium de Playwright). Se instala gratis con:" >&2
  echo "  npx playwright install chromium" >&2
  exit 1
fi
npx playwright test --trace off "$@"
