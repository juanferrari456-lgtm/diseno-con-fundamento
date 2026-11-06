#!/usr/bin/env python3
"""
Copia compartido/ dentro de cada skill y arma un .zip por skill en instalar/.

compartido/ es la única fuente de los principios: se edita ahí y este script lo
reparte. Así el plugin y los .zip nunca se desincronizan.

Uso:
  python3 herramientas/armar-zips.py            copia y arma los .zip
  python3 herramientas/armar-zips.py --check    solo verifica, no escribe (sale con 1 si algo está desincronizado)
"""
import argparse
import re
import shutil
import sys
import zipfile
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
COMPARTIDO = RAIZ / "compartido"
SKILLS = RAIZ / "skills"
INSTALAR = RAIZ / "instalar"

# Qué recibe cada skill de compartido/. "*" vale para todas.
REPARTO = {
    "*": ["principios.md", "certeza-y-muestras.md"],
    "inicio": ["contexto-plantilla.md", "contexto-ejemplo-ficticio.md"],
}

IGNORAR = {"node_modules", "__pycache__", ".DS_Store"}
IGNORAR_EXT = {".pptx", ".pdf", ".pyc"}
MAX_DESCRIPCION = 1024


def archivos_para(skill: str):
    return REPARTO["*"] + REPARTO.get(skill, [])


def frontmatter(skill_md: Path):
    texto = skill_md.read_text(encoding="utf-8")
    m = re.match(r"^---\n(.*?)\n---\n", texto, re.S)
    if not m:
        return None
    datos = {}
    for linea in m.group(1).splitlines():
        if ":" in linea:
            k, v = linea.split(":", 1)
            datos[k.strip()] = v.strip().strip('"')
    return datos


def validar(skill_dir: Path):
    errores = []
    md = skill_dir / "SKILL.md"
    if not md.exists():
        return [f"{skill_dir.name}: falta SKILL.md"]
    fm = frontmatter(md)
    if not fm:
        return [f"{skill_dir.name}: SKILL.md sin frontmatter"]
    if fm.get("name") != skill_dir.name:
        errores.append(f"{skill_dir.name}: el name del frontmatter ({fm.get('name')}) no coincide con la carpeta")
    desc = fm.get("description", "")
    if not desc:
        errores.append(f"{skill_dir.name}: falta description")
    elif len(desc) > MAX_DESCRIPCION:
        errores.append(f"{skill_dir.name}: description de {len(desc)} caracteres (máximo {MAX_DESCRIPCION})")
    return errores


def incluir(p: Path) -> bool:
    if any(parte in IGNORAR for parte in p.parts):
        return False
    return p.suffix.lower() not in IGNORAR_EXT


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--check", action="store_true", help="solo verificar")
    args = ap.parse_args()

    skills = sorted(d for d in SKILLS.iterdir() if d.is_dir())
    problemas = []

    for d in skills:
        problemas += validar(d)
        refs = d / "references"
        for nombre in archivos_para(d.name):
            fuente = COMPARTIDO / nombre
            destino = refs / nombre
            if args.check:
                if not destino.exists() or destino.read_bytes() != fuente.read_bytes():
                    problemas.append(f"{d.name}: references/{nombre} desincronizado con compartido/")
            else:
                refs.mkdir(exist_ok=True)
                shutil.copyfile(fuente, destino)

    if args.check:
        for p in problemas:
            print("x", p)
        print(f"{len(skills)} skills revisadas, {len(problemas)} problemas.")
        sys.exit(1 if problemas else 0)

    if problemas:
        for p in problemas:
            print("x", p)
        sys.exit(1)

    INSTALAR.mkdir(exist_ok=True)
    for d in skills:
        destino = INSTALAR / f"{d.name}.zip"
        with zipfile.ZipFile(destino, "w", zipfile.ZIP_DEFLATED) as z:
            for f in sorted(d.rglob("*")):
                if f.is_file() and incluir(f.relative_to(d)):
                    z.write(f, Path(d.name) / f.relative_to(d))
        print(f"ok  instalar/{destino.name}")
    print(f"{len(skills)} skills empaquetadas.")


if __name__ == "__main__":
    main()
