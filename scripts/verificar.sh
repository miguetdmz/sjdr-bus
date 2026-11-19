#!/usr/bin/env bash
# Puerta de calidad antes de cada push (D-11). Se detiene en el primer paso que falle.
set -euo pipefail
cd "$(dirname "$0")/.."

paso() { printf '\n=== %s ===\n' "$1"; }

paso "1/5 reglas del proyecto"; node scripts/reglas.mjs
paso "2/5 licencias (solo open source)"; node scripts/licencias.mjs
paso "3/5 pruebas (incluye el validador GTFS de MobilityData)"; node --test "scripts/pruebas/*.test.mjs"
paso "4/5 compilación de la app (web/)"
if [ ! -d node_modules ]; then
  echo "Faltan las dependencias de la app: corre «npm ci» (gratis, solo open source)" >&2
  exit 1
fi
npm run build
paso "5/5 gitleaks (secretos)"
if ! command -v gitleaks >/dev/null; then
  echo "gitleaks no está instalado: brew install gitleaks" >&2
  exit 1
fi
# a) Todo el historial de commits (si ya hay alguno).
if git rev-parse --verify -q HEAD >/dev/null; then
  gitleaks git --no-banner --redact .
fi
# b) Los archivos que git puede subir, con o sin commit. Se copian a una carpeta
#    temporal para no escanear lo ignorado (referencias/, node_modules, .env.local).
copia="$(mktemp -d)"
trap 'rm -rf "$copia"' EXIT
git ls-files -co --exclude-standard -z | while IFS= read -r -d '' archivo; do
  [ -f "$archivo" ] || continue
  mkdir -p "$copia/$(dirname "$archivo")"
  cp "$archivo" "$copia/$archivo"
done
gitleaks dir --no-banner --redact "$copia"

printf '\nPUERTA DE CALIDAD: TODO PASÓ\n'
