#!/usr/bin/env python3
"""
Busca en el paquete lo que no debería publicarse: nombres de una organización real,
IDs, contactos y caracteres que el paquete no usa.

Los términos propios (empresa, marcas, clientes, personas, tablas) van en un archivo
local que NO se sube al repo: .terminos-privados.txt en la raíz, uno por línea.
Así la lista de lo que se quiere esconder no queda publicada.

Uso:
  python3 herramientas/barrer-datos.py
  python3 herramientas/barrer-datos.py --terminos otra-lista.txt

Sale con 1 si encuentra términos privados, contactos o caracteres prohibidos.
Las cifras y los IDs largos se informan como aviso: hay que leerlos y decidir.
"""
import argparse
import re
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
EXT = {".md", ".js", ".py", ".json", ".html", ".txt"}
IGNORAR = {"node_modules", "instalar", ".git", "__pycache__"}
# Archivos que mencionan los caracteres prohibidos a propósito, para explicarlos.
EXCEPCIONES_CARACTERES = {"principios.md", "deck-kit.js", "barrer-datos.py", "README.md"}

BLOQUEANTES = {
    "mail": re.compile(r"[\w.+-]+@[\w-]+\.[\w.-]+"),
    "teléfono": re.compile(r"\+\d{2,3}[\s-]?\d{2,4}[\s-]?\d{3,4}[\s-]?\d{3,4}"),
    "uuid": re.compile(r"\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b", re.I),
}
CARACTERES = {"punto medio": "\u00b7", "raya larga": "\u2014"}
AVISOS = {
    "id largo": re.compile(r"\b\d{7,}\b"),
    "id de encuesta o tabla": re.compile(r"\b(SV|SR|TBL|DB)_[A-Za-z0-9]{6,}\b"),
    "url": re.compile(r"https?://(?!claude\.ai|github\.com|www\.figma\.com/community|fonts\.googleapis\.com|fonts\.gstatic\.com|creativecommons\.org|opensource\.org|docs\.claude\.com)[^\s)\"']+"),
}


def archivos():
    for f in RAIZ.rglob("*"):
        if f.is_file() and f.suffix in EXT and not any(p in IGNORAR for p in f.relative_to(RAIZ).parts):
            yield f


def cargar_terminos(ruta: Path):
    if not ruta.exists():
        return []
    return [t.strip() for t in ruta.read_text(encoding="utf-8").splitlines() if t.strip() and not t.startswith("#")]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--terminos", default=str(RAIZ / ".terminos-privados.txt"))
    args = ap.parse_args()

    terminos = cargar_terminos(Path(args.terminos))
    patrones_terminos = [(t, re.compile(rf"(?<![\w]){re.escape(t)}(?![\w])", re.I)) for t in terminos]
    if not terminos:
        print(f"aviso: no hay lista de términos privados en {args.terminos}. Solo se buscan contactos, IDs y caracteres.\n")

    errores = avisos = 0
    for f in sorted(archivos()):
        rel = f.relative_to(RAIZ)
        if rel.name == Path(args.terminos).name:
            continue
        for n, linea in enumerate(f.read_text(encoding="utf-8", errors="ignore").splitlines(), 1):
            for t, p in patrones_terminos:
                if p.search(linea):
                    print(f"x  {rel}:{n}  término privado '{t}'"); errores += 1
            for nombre, p in BLOQUEANTES.items():
                for m in p.findall(linea):
                    if nombre == "mail" and m.endswith(("anthropic.com", "example.com", "ejemplo.com")):
                        continue
                    print(f"x  {rel}:{n}  {nombre}: {m}"); errores += 1
            if rel.name not in EXCEPCIONES_CARACTERES:
                for nombre, c in CARACTERES.items():
                    if c in linea:
                        print(f"x  {rel}:{n}  {nombre}"); errores += 1
            for nombre, p in AVISOS.items():
                for m in p.findall(linea):
                    print(f"?  {rel}:{n}  {nombre}: {m}"); avisos += 1

    print(f"\n{errores} bloqueantes, {avisos} avisos para leer.")
    sys.exit(1 if errores else 0)


if __name__ == "__main__":
    main()
