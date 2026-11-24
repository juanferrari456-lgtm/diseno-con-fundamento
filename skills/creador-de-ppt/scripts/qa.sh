#!/usr/bin/env bash
# QA del deck: valida el .pptx (si encuentra el validador de la skill pptx),
# lo convierte a PDF y lo renderiza en un JPG por slide para mirarlo.
#
# Uso: bash qa.sh salida.pptx [carpeta-de-salida]
# Imprime la ruta de cada slide renderizado. Sale con 1 si falta algo, con el motivo.

set -euo pipefail

PPTX="${1:-}"
OUT="${2:-qa}"
[ -n "$PPTX" ] || { echo "Uso: bash qa.sh salida.pptx [carpeta-de-salida]" >&2; exit 1; }
[ -f "$PPTX" ] || { echo "No existe $PPTX" >&2; exit 1; }
mkdir -p "$OUT"

# 1. Validador de la skill pptx: es opcional, porque el render ya muestra los desbordes.
VALIDADOR=""
for base in /mnt/skills/public/pptx "$HOME"/.claude/skills/pptx "$HOME"/.claude/skills/*/pptx; do
  if [ -f "$base/scripts/office/validate.py" ]; then VALIDADOR="$base/scripts/office/validate.py"; break; fi
done
if [ -n "$VALIDADOR" ]; then
  python3 "$VALIDADOR" "$PPTX"
else
  echo "Aviso: no encontré validate.py de la skill pptx. Sigo solo con el render." >&2
fi

# 2. PDF con LibreOffice. Se prefiere el wrapper de la skill pptx si está, porque
#    resuelve el entorno sin pantalla; si no, soffice directo.
NOMBRE="$(basename "${PPTX%.*}")"
WRAPPER="$(dirname "${VALIDADOR:-/nada/x}")/soffice.py"
if [ -f "$WRAPPER" ]; then
  python3 "$WRAPPER" --headless --convert-to pdf --outdir "$OUT" "$PPTX" >/dev/null
elif command -v soffice >/dev/null 2>&1; then
  soffice --headless --convert-to pdf --outdir "$OUT" "$PPTX" >/dev/null
else
  echo "Falta LibreOffice (soffice). Instalarlo antes de seguir: sin render no hay QA." >&2
  exit 1
fi
[ -f "$OUT/$NOMBRE.pdf" ] || { echo "La conversión a PDF no generó $OUT/$NOMBRE.pdf" >&2; exit 1; }

# 3. Un JPG por slide. 150 dpi alcanza para leer texto de cuerpo sin archivos pesados.
command -v pdftoppm >/dev/null 2>&1 || { echo "Falta pdftoppm (poppler-utils)." >&2; exit 1; }
rm -f "$OUT"/slide-*.jpg
pdftoppm -jpeg -r 150 "$OUT/$NOMBRE.pdf" "$OUT/slide"
ls -1 "$(cd "$OUT" && pwd)"/slide-*.jpg
