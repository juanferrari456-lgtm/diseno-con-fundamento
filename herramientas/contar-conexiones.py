#!/usr/bin/env python3
"""
Cuenta las conexiones entre skills.

Hay conexión de A hacia B cuando el SKILL.md de A, o algún .md de su carpeta
references/, nombra a B entre comillas de código: `nombre-de-la-skill`.

No cuentan:
  - los archivos que vienen de compartido/, porque están copiados en todas las skills;
  - las palabras sueltas: "evidencia" o "inicio" dentro de una oración no son una mención;
  - que una skill se nombre a sí misma.

Cada par A -> B cuenta una vez, aunque A nombre a B muchas veces.

Uso:
  python3 herramientas/contar-conexiones.py            total y ranking por grado
  python3 herramientas/contar-conexiones.py --lista    además, cada conexión
"""
import argparse
import re
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
COMPARTIDO = RAIZ / "compartido"
SKILLS = RAIZ / "skills"

# Lo que va entre comillas de código y nada más: `nombre`.
MENCION = re.compile(r"`([a-z0-9][a-z0-9-]*)`")


def fuentes(skill_dir: Path, de_compartido: set):
    yield skill_dir / "SKILL.md"
    refs = skill_dir / "references"
    if refs.is_dir():
        for f in sorted(refs.glob("*.md")):
            if f.name not in de_compartido:
                yield f


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--lista", action="store_true", help="mostrar cada conexión")
    args = ap.parse_args()

    de_compartido = {f.name for f in COMPARTIDO.iterdir() if f.is_file()}
    skills = sorted(d.name for d in SKILLS.iterdir() if d.is_dir())
    nombres = set(skills)

    conexiones = set()
    for a in skills:
        for f in fuentes(SKILLS / a, de_compartido):
            if not f.exists():
                continue
            for b in MENCION.findall(f.read_text(encoding="utf-8")):
                if b in nombres and b != a:
                    conexiones.add((a, b))

    salen = {s: 0 for s in skills}
    entran = {s: 0 for s in skills}
    for a, b in conexiones:
        salen[a] += 1
        entran[b] += 1

    print(f"{len(conexiones)} conexiones entre {len(skills)} skills.\n")
    print(f"{'skill':<28}{'grado':>6}{'entran':>8}{'salen':>7}")
    ranking = sorted(skills, key=lambda s: (-(entran[s] + salen[s]), s))
    for s in ranking:
        print(f"{s:<28}{entran[s] + salen[s]:>6}{entran[s]:>8}{salen[s]:>7}")

    if args.lista:
        print("\nConexiones (origen -> destino):")
        for a, b in sorted(conexiones):
            print(f"{a} -> {b}")


if __name__ == "__main__":
    main()
