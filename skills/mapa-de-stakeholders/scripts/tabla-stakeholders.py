#!/usr/bin/env python3
"""Genera la tabla de stakeholders (.xlsx con filtros + .csv espejo) desde un JSON.

Uso:
    python tabla-stakeholders.py mapa.json --salida /mnt/user-data/outputs/
    python tabla-stakeholders.py mapa.json --salida ./ --nombre Mapa-Stakeholders_Proyecto_202611

El esquema del JSON está documentado en references/tabla.md.
"""

import argparse
import csv
import json
import re
import sys
from pathlib import Path

from openpyxl import Workbook
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.utils import get_column_letter

FUENTE = "Arial"
AMBAR = "FFF2CC"
GRIS = "E7E6E6"
NEGRO = "000000"

COLUMNAS = [
    ("nombre", "Nombre / rol", 28),
    ("rol", "Cargo", 26),
    ("area", "Área / organización", 24),
    ("tipo", "Tipo", 12),
    ("nivel", "Nivel", 30),
    ("poder", "Poder", 8),
    ("interes", "Interés", 8),
    ("cuadrante", "Cuadrante", 22),
    ("estrategia", "Estrategia", 22),
    ("postura", "Postura", 14),
    ("que_espera", "Qué espera", 40),
    ("que_teme", "Qué teme", 40),
    ("que_aporta", "Qué aporta", 34),
    ("tension", "Tensión / riesgo", 34),
    ("accion", "Próxima acción", 34),
    ("fuente", "Fuente", 28),
    ("confianza", "Confianza", 14),
]

ESCALA_PODER = [
    ("5", "Puede cancelar o financiar el proyecto por decisión propia"),
    ("4", "Aprueba entregables, prioriza, tiene veto sobre su ámbito"),
    ("3", "Su rechazo obliga a rediseñar; no puede frenar el conjunto"),
    ("2", "Influye por opinión o por acceso a información"),
    ("1", "Se ve afectado, no tiene palanca formal"),
]

ESCALA_INTERES = [
    ("5", "Le cambia el trabajo diario o el número que le miden"),
    ("4", "Lo afecta de forma directa aunque no sea su prioridad"),
    ("3", "Le importa por proximidad con quien sí lo sufre"),
    ("2", "Consecuencias indirectas"),
    ("1", "Enterado, sin consecuencias prácticas"),
]

CUADRANTES = [
    ("Poder alto | Interés alto", "Colaborar de cerca", "Co-construir, entrevistar primero, validar decisiones"),
    ("Poder alto | Interés bajo", "Mantener conforme", "Informar corto y a tiempo; evitar la sorpresa que dispara el veto"),
    ("Poder bajo | Interés alto", "Mantener informado", "Fuente clave de dolor operativo: entrevistar aunque no decida"),
    ("Poder bajo | Interés bajo", "Monitorear", "Chequear cada tanto, no invertir esfuerzo"),
]


def cuadrante(poder, interes):
    """Deriva cuadrante y estrategia. Alto = 4-5. Devuelve ('', '') si falta un dato."""
    if not isinstance(poder, int) or not isinstance(interes, int):
        return "", ""
    p_alto, i_alto = poder >= 4, interes >= 4
    if p_alto and i_alto:
        return "Poder alto | Interés alto", "Colaborar de cerca"
    if p_alto:
        return "Poder alto | Interés bajo", "Mantener conforme"
    if i_alto:
        return "Poder bajo | Interés alto", "Mantener informado"
    return "Poder bajo | Interés bajo", "Monitorear"


def slug(texto):
    texto = re.sub(r"[^\w\s-]", "", texto, flags=re.UNICODE).strip()
    return re.sub(r"\s+", "-", texto) or "mapa"


def preparar(data):
    """Normaliza filas y ordena por nivel (en el orden declarado) y luego por poder."""
    orden_niveles = {n.get("nombre", ""): i for i, n in enumerate(data.get("niveles", []))}
    filas = []
    for s in data.get("stakeholders", []):
        fila = dict(s)
        cuad, estr = cuadrante(s.get("poder"), s.get("interes"))
        fila["cuadrante"] = cuad
        fila["estrategia"] = s.get("estrategia") or estr
        filas.append(fila)
    filas.sort(
        key=lambda f: (
            orden_niveles.get(f.get("nivel", ""), 999),
            -(f.get("poder") if isinstance(f.get("poder"), int) else 0),
            -(f.get("interes") if isinstance(f.get("interes"), int) else 0),
        )
    )
    return filas


def estilar_encabezado(ws, ncols):
    borde = Side(style="thin", color="BFBFBF")
    for col in range(1, ncols + 1):
        celda = ws.cell(row=1, column=col)
        celda.font = Font(name=FUENTE, bold=True, color="FFFFFF", size=10)
        celda.fill = PatternFill("solid", fgColor=NEGRO)
        celda.alignment = Alignment(vertical="center", wrap_text=True)
        celda.border = Border(bottom=borde)
    ws.row_dimensions[1].height = 30


def hoja_mapa(wb, filas):
    ws = wb.create_sheet("Mapa")
    ws.append([titulo for _, titulo, _ in COLUMNAS])
    for fila in filas:
        ws.append([fila.get(clave, "") for clave, _, _ in COLUMNAS])

    estilar_encabezado(ws, len(COLUMNAS))
    for i, (_, _, ancho) in enumerate(COLUMNAS, start=1):
        ws.column_dimensions[get_column_letter(i)].width = ancho

    idx_confianza = [c for c, _, _ in COLUMNAS].index("confianza") + 1
    relleno = PatternFill("solid", fgColor=AMBAR)
    for r in range(2, ws.max_row + 1):
        for c in range(1, len(COLUMNAS) + 1):
            celda = ws.cell(row=r, column=c)
            celda.font = Font(name=FUENTE, size=10)
            celda.alignment = Alignment(vertical="top", wrap_text=True)
        valor = str(ws.cell(row=r, column=idx_confianza).value or "").upper()
        if "VERIFICAR" in valor:
            for c in range(1, len(COLUMNAS) + 1):
                ws.cell(row=r, column=c).fill = relleno

    ws.freeze_panes = "A2"
    if ws.max_row >= 1:
        ws.auto_filter.ref = f"A1:{get_column_letter(len(COLUMNAS))}{ws.max_row}"
    return ws


def hoja_niveles(wb, data):
    ws = wb.create_sheet("Niveles")
    ws.append(["Orden", "Nivel", "Definición (criterio de pertenencia)"])
    for i, nivel in enumerate(data.get("niveles", []), start=1):
        ws.append([i, nivel.get("nombre", ""), nivel.get("definicion", "")])
    estilar_encabezado(ws, 3)
    for col, ancho in zip("ABC", (8, 38, 70)):
        ws.column_dimensions[col].width = ancho
    for r in range(2, ws.max_row + 1):
        for c in range(1, 4):
            ws.cell(row=r, column=c).font = Font(name=FUENTE, size=10)
            ws.cell(row=r, column=c).alignment = Alignment(vertical="top", wrap_text=True)


def hoja_leyenda(wb, data):
    ws = wb.create_sheet("Leyenda")
    negrita = Font(name=FUENTE, bold=True, size=10)
    normal = Font(name=FUENTE, size=10)

    def bloque(titulo, filas, encabezados):
        ws.append([titulo])
        ws.cell(row=ws.max_row, column=1).font = negrita
        ws.append(list(encabezados))
        for c in range(1, len(encabezados) + 1):
            ws.cell(row=ws.max_row, column=c).font = negrita
            ws.cell(row=ws.max_row, column=c).fill = PatternFill("solid", fgColor=GRIS)
        for fila in filas:
            ws.append(list(fila))
            for c in range(1, len(fila) + 1):
                ws.cell(row=ws.max_row, column=c).font = normal
                ws.cell(row=ws.max_row, column=c).alignment = Alignment(vertical="top", wrap_text=True)
        ws.append([])

    ws.append([f"Mapa de stakeholders, {data.get('proyecto', '')}"])
    ws.cell(row=1, column=1).font = Font(name=FUENTE, bold=True, size=12)
    ws.append([f"Fecha: {data.get('fecha', '')}"])
    ws.cell(row=2, column=1).font = normal
    ws.append([])

    bloque("Escala de poder, capacidad de habilitar o frenar", ESCALA_PODER, ("Valor", "Ancla"))
    bloque("Escala de interés, cuánto le cambia el resultado", ESCALA_INTERES, ("Valor", "Ancla"))
    bloque("Cuadrantes (alto = 4-5)", CUADRANTES, ("Cuadrante", "Estrategia", "Qué implica"))
    bloque(
        "Confianza del dato",
        [
            ("confirmado", "Dato con fuente verificada", ""),
            ("VERIFICAR", "Inferido o incompleto, fila resaltada en ámbar, confirmar antes de usar", ""),
        ],
        ("Valor", "Significado", ""),
    )

    for col, ancho in zip("ABC", (26, 62, 46)):
        ws.column_dimensions[col].width = ancho


def escribir_csv(ruta, filas):
    with open(ruta, "w", newline="", encoding="utf-8-sig") as f:
        writer = csv.writer(f)
        writer.writerow([titulo for _, titulo, _ in COLUMNAS])
        for fila in filas:
            writer.writerow([fila.get(clave, "") for clave, _, _ in COLUMNAS])


def main():
    parser = argparse.ArgumentParser(description="Genera la tabla de stakeholders (.xlsx + .csv)")
    parser.add_argument("json", help="Ruta al JSON de stakeholders")
    parser.add_argument("--salida", default=".", help="Directorio de salida")
    parser.add_argument("--nombre", default=None, help="Nombre base del archivo, sin extensión")
    args = parser.parse_args()

    data = json.loads(Path(args.json).read_text(encoding="utf-8"))
    filas = preparar(data)
    if not filas:
        print("El JSON no tiene stakeholders.", file=sys.stderr)
        return 1

    salida = Path(args.salida)
    salida.mkdir(parents=True, exist_ok=True)
    base = args.nombre or f"Mapa-Stakeholders_{slug(data.get('proyecto', 'proyecto'))}_{data.get('fecha', '')}".rstrip("_")

    wb = Workbook()
    wb.remove(wb.active)
    hoja_mapa(wb, filas)
    hoja_niveles(wb, data)
    hoja_leyenda(wb, data)
    ruta_xlsx = salida / f"{base}.xlsx"
    wb.save(ruta_xlsx)

    ruta_csv = salida / f"{base}.csv"
    escribir_csv(ruta_csv, filas)

    sin_confirmar = [f.get("nombre", "?") for f in filas if "VERIFICAR" in str(f.get("confianza", "")).upper()]
    print(f"OK  {ruta_xlsx}")
    print(f"OK  {ruta_csv}")
    print(f"{len(filas)} stakeholders | {len(data.get('niveles', []))} niveles")
    if sin_confirmar:
        print(f"[VERIFICAR] pendientes ({len(sin_confirmar)}): {', '.join(sin_confirmar)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
