#!/usr/bin/env python3
"""
Dibuja las dos imágenes del README a partir del conteo real de conexiones:
  docs/img/portada.png        2400 x 1254
  docs/img/mapa-de-skills.png 2160 x 1800

Las conexiones salen de contar-conexiones.py --lista, así que las imágenes
siempre dicen lo mismo que el README. La posición de cada skill está fija en
NODOS: una skill nueva se agrega ahí, con su etapa y su etiqueta.

Necesita Python 3 con playwright (y su Chromium) y la fuente Inter instalada.
La fuente mono es JetBrains Mono: pasarle la ruta al .woff2 con --mono; si no,
usa la mono del sistema.

Uso:
  python3 herramientas/dibujar-imagenes.py [--mono ruta/jetbrains-mono.woff2]
"""
import argparse
import hashlib
import math
import re
import subprocess
import sys
import tempfile
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
IMG = RAIZ / "docs" / "img"
CENTRO = "encuadre-del-problema"

COLOR = {
    "encuadrar": "#f28c33", "sintetizar": "#34c37c", "definir": "#9b7bf7",
    "idear": "#4f8ef7", "comunicar": "#ec5d93", "base": "#858a96",
}
AMARILLO = "#f7c744"
FONDO = "#0e1014"
TEXTO = "#e9e9ec"
GRIS = "#8b8f99"

# Posiciones en un lienzo de 2000 x 1440 (solo el grafo, sin títulos ni pie).
NODOS = {
    "encuadre-del-problema":     (362, 130, "encuadrar", None),
    "mapa-de-stakeholders":      (285, 397, "encuadrar", "Mapa\nde stakeholders"),
    "evidencia":                 (285, 557, "encuadrar", "Evidencia"),
    "guia-de-entrevista":        (285, 718, "encuadrar", "Guía\nde entrevista"),
    "muestra-y-reclutamiento":   (285, 878, "encuadrar", "Muestra\ny reclutamiento"),
    "plan-de-observacion":       (285, 1038, "encuadrar", "Plan\nde observación"),
    "sintesis-de-entrevistas":   (648, 267, "sintetizar", "Síntesis\nde entrevistas"),
    "sintesis-de-campo":         (648, 610, "sintetizar", "Síntesis\nde campo"),
    "sintesis-de-reuniones":     (648, 953, "sintetizar", "Síntesis\nde reuniones"),
    "arquetipos":                (1011, 198, "definir", "Arquetipos"),
    "arbol-de-oportunidades":    (1011, 430, "definir", "Árbol\nde oportunidades"),
    "pensar-blueprints":         (1011, 687, "definir", "Pensar\nblueprints"),
    "service-blueprint-json":    (1011, 945, "definir", "Blueprint\na .json"),
    "ideacion":                  (1374, 267, "idear", "Ideación"),
    "priorizacion-de-conceptos": (1374, 610, "idear", "Priorización\nde conceptos"),
    "prueba-de-conceptos":       (1374, 953, "idear", "Prueba\nde conceptos"),
    "creador-de-contenido":      (1734, 362, "comunicar", "Contenido"),
    "creador-de-ppt":            (1734, 840, "comunicar", "Presentaciones"),
    "inicio":                    (560, 1245, "base", "Inicio"),
    "markdown-converter":         (1060, 1245, "base", "Conversor\na Markdown"),
    "mejor":                     (1560, 1245, "base", "Mejor"),
}
ETAPAS = [(285, "encuadrar", "ENCUADRAR\nY PREPARAR"), (648, "sintetizar", "SINTETIZAR"),
          (1011, "definir", "DEFINIR"), (1374, "idear", "IDEAR Y PROBAR"),
          (1734, "comunicar", "COMUNICAR")]
LINEA_BASE = 1162


def conexiones():
    out = subprocess.run([sys.executable, str(RAIZ / "herramientas" / "contar-conexiones.py"), "--lista"],
                         capture_output=True, text=True, check=True).stdout
    pares = re.findall(r"^([a-z0-9-]+) -> ([a-z0-9-]+)$", out, re.M)
    faltan = {s for p in pares for s in p} - set(NODOS)
    if faltan:
        sys.exit(f"Faltan en NODOS: {', '.join(sorted(faltan))}. Agregalas con posición y etapa.")
    sin_uso = set(NODOS) - {s for p in pares for s in p}
    if sin_uso:
        sys.exit(f"Sobran en NODOS (no existen o no tienen conexiones): {', '.join(sorted(sin_uso))}")
    return pares


def curva(a, b, desvio=0.12):
    (x1, y1), (x2, y2) = a, b
    mx, my = (x1 + x2) / 2, (y1 + y2) / 2
    dx, dy = x2 - x1, y2 - y1
    largo = math.hypot(dx, dy) or 1
    signo = 1 if int(hashlib.md5(f"{a}{b}".encode()).hexdigest(), 16) % 2 else -1
    cx, cy = mx - dy / largo * largo * desvio * signo, my + dx / largo * largo * desvio * signo
    return (x1, y1, cx, cy, x2, y2)


def recortar(x1, y1, cx, cy, x2, y2, r):
    """Acorta el final de la curva para que la flecha toque el borde del nodo."""
    dx, dy = x2 - cx, y2 - cy
    d = math.hypot(dx, dy) or 1
    return x2 - dx / d * r, y2 - dy / d * r


def svg_grafo(pares):
    radio = {s: (30 if s == CENTRO else 26 if s == "inicio" else 17) for s in NODOS}
    pos = {s: (v[0], v[1]) for s, v in NODOS.items()}
    grises, amarillas = [], []
    for a, b in pares:
        x1, y1, cx, cy, x2, y2 = curva(pos[a], pos[b])
        if CENTRO in (a, b):
            ex, ey = recortar(x1, y1, cx, cy, x2, y2, radio[b] + (10 if b == CENTRO else 4))
            amarillas.append(f'<path d="M{x1:.0f},{y1:.0f} Q{cx:.0f},{cy:.0f} {ex:.0f},{ey:.0f}" '
                             f'stroke="{AMARILLO}" stroke-width="3.2" fill="none" marker-end="url(#f)"/>')
        else:
            grises.append(f'<path d="M{x1:.0f},{y1:.0f} Q{cx:.0f},{cy:.0f} {x2:.0f},{y2:.0f}" '
                          f'stroke="#343841" stroke-width="1.4" fill="none" opacity=".8"/>')
    nodos, etiquetas = [], []
    for s, (x, y, etapa, etiqueta) in NODOS.items():
        r = radio[s]
        if s == CENTRO:
            nodos.append(f'<circle cx="{x}" cy="{y}" r="{r + 13}" fill="{FONDO}" stroke="{AMARILLO}" stroke-width="6"/>')
            etiquetas.append(f'<text x="{x - 230}" y="{y - 70}" fill="{AMARILLO}" font-size="38" font-weight="700">Encuadre del problema</text>')
        nodos.append(f'<circle cx="{x}" cy="{y}" r="{r}" fill="{COLOR[etapa]}"/>')
        if etiqueta:
            for i, linea in enumerate(etiqueta.split("\n")):
                etiquetas.append(f'<text x="{x}" y="{y + r + 40 + i * 38}" text-anchor="middle" fill="{TEXTO}" '
                                 f'font-size="31" font-weight="600" paint-order="stroke" stroke="{FONDO}" '
                                 f'stroke-width="7">{linea}</text>')
    etapas = []
    for x, etapa, texto in ETAPAS:
        lineas = texto.split("\n")
        for i, linea in enumerate(lineas):
            y = -70 + i * 42 + (21 if len(lineas) == 1 else 0)
            etapas.append(f'<text x="{x}" y="{y}" text-anchor="middle" fill="{COLOR[etapa]}" font-size="33" '
                          f'font-weight="700" letter-spacing="3.5">{linea}</text>')
    base = (f'<line x1="150" y1="{LINEA_BASE}" x2="1840" y2="{LINEA_BASE}" stroke="#4a4e57" stroke-width="2" '
            f'stroke-dasharray="10 9"/><text x="1000" y="{LINEA_BASE - 20}" text-anchor="middle" fill="{GRIS}" '
            f'font-size="25" font-weight="700" letter-spacing="4">BASE</text>')
    defs = (f'<defs><marker id="f" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" '
            f'orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="{AMARILLO}"/></marker></defs>')
    return defs + "".join(grises) + base + "".join(amarillas) + "".join(nodos) + "".join(etapas) + "".join(etiquetas)


def html(cuerpo, ancho, alto, mono):
    fuente = f"@font-face{{font-family:'Mono';src:url('file://{mono}')}}" if mono else ""
    return (f"<!doctype html><meta charset=utf-8><style>{fuente}"
            f"body{{margin:0;background:{FONDO};width:{ancho}px;height:{alto}px;overflow:hidden;"
            f"font-family:Inter,sans-serif;color:{TEXTO}}} .m{{font-family:Mono,'DejaVu Sans Mono',monospace}}"
            f"svg text{{font-family:Inter,sans-serif}}</style>{cuerpo}")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--mono", help="ruta a un .woff2 de JetBrains Mono")
    args = ap.parse_args()
    pares = conexiones()
    total = len(pares)
    entran = sum(1 for a, b in pares if b == CENTRO)
    salen = sum(1 for a, b in pares if a == CENTRO)
    skills = len(NODOS)
    grafo = svg_grafo(pares)

    mapa = html(
        f'<svg width="1080" height="836" viewBox="60 -140 1900 1500">{grafo}</svg>'
        f'<div class="m" style="position:absolute;left:0;right:0;top:852px;text-align:center;font-size:17px;color:{GRIS}">'
        f'{total} conexiones · en amarillo, las {entran + salen} de <span style="color:{AMARILLO}">{CENTRO}</span>: '
        f'{entran} entran y {salen} salen</div>', 1080, 900, args.mono)

    portada = html(
        f'<div style="position:absolute;left:44px;top:96px;width:380px">'
        f'<div class="m" style="font-size:16px;color:{TEXTO}">diseno-con-fundamento <span style="color:{GRIS}">/ skills</span></div>'
        f'<div style="font-family:\'Inter Display\',Inter;font-weight:800;font-size:46px;line-height:1.02;'
        f'letter-spacing:-1.2px;margin-top:26px">{skills} skills que<br><span style="color:{AMARILLO}">se llaman entre sí</span></div>'
        f'<div style="font-size:18.5px;line-height:1.32;color:#b9bbc2;margin-top:24px">Skills de Claude para diseñar '
        f'servicios. En español y gratis. Toda afirmación con fuente, ninguna persona inventada.</div>'
        f'<div class="m" style="font-size:15px;line-height:1.5;color:#b9bbc2;margin-top:24px">{total} conexiones · la más conectada:'
        f'<br><span style="color:{AMARILLO}">{CENTRO}</span></div>'
        f'<div style="font-size:16px;margin-top:22px"><b style="font-weight:600">Juan Ferrari</b>'
        f'<span style="color:{GRIS}"> · Service Designer</span></div></div>'
        f'<svg style="position:absolute;left:440px;top:24px" width="740" height="584" viewBox="60 -140 1900 1500">{grafo}</svg>',
        1200, 627, args.mono)

    from playwright.sync_api import sync_playwright
    with tempfile.TemporaryDirectory() as tmp, sync_playwright() as p:
        nav = p.chromium.launch()
        for nombre, contenido, (w, h) in (("mapa-de-skills.png", mapa, (1080, 900)),
                                           ("portada.png", portada, (1200, 627))):
            f = Path(tmp) / (nombre + ".html")
            f.write_text(contenido, encoding="utf-8")
            pag = nav.new_page(viewport={"width": w, "height": h}, device_scale_factor=2)
            pag.goto(f.as_uri())
            pag.wait_for_timeout(300)
            pag.screenshot(path=str(IMG / nombre))
            print(f"{nombre}: {w * 2} x {h * 2}")
        nav.close()
    print(f"{total} conexiones, {skills} skills, {CENTRO}: {entran} entran y {salen} salen.")


if __name__ == "__main__":
    main()
