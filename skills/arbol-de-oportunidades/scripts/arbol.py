#!/usr/bin/env python3
"""
Valida un arbol.json, calcula la certeza de cada oportunidad y la comparación del
outcome, y genera una de dos versiones:

  presentar    HTML en lenguaje llano para el equipo: sin IDs, sin jerga, sin intervalos.
  repositorio  Markdown con todo el detalle: IDs, orígenes, intervalos y criterios.

Uso:
  python arbol.py arbol.json --version presentar --out arbol.html
  python arbol.py arbol.json --version repositorio --out arbol.md
  python arbol.py arbol.json --version presentar --modo apertura --out apertura.html

--modo cierre (por defecto): árbol completo con evidencia.
--modo apertura: métrica, resultado buscado y oportunidades como hipótesis a validar.
Sale con código 1 y lista los errores si el árbol no pasa la validación.
"""
import argparse, json, math, re, sys
from pathlib import Path

TIPOS = {"entrevistas", "tickets", "health", "analytics", "campo"}
VOZ = {"entrevistas", "tickets", "health"}
COMPORTAMIENTO = {"analytics", "campo"}
URGENCIAS = {"alta", "media", "baja"}
CONTROL = {"alto", "medio", "bajo"}
PROHIBIDOS = re.compile("[\u2014\u2013\u00b7]")
PLANTILLA = Path(__file__).resolve().parent.parent / "assets" / "presentar.html"

# Lenguaje llano para la versión de presentar
CERTEZA_LLANA = {
    "Hipótesis": "Es una idea: todavía no hay datos que la muestren",
    "Indicio": "Lo muestra una sola fuente",
    "Patrón": "Lo muestran dos fuentes distintas",
    "Evidencia sólida": "Lo muestran tres fuentes o más, incluido lo que la gente hace",
}
URGENCIA_LLANA = {
    "alta": "Grave: puede dejar a la persona sin el servicio, sin su plata o sin salida",
    "media": "Molesto: obliga a pedir ayuda o a hacer algo de más",
    "baja": "Menor: incomoda, pero no tiene consecuencia",
}
CONTROL_LLANO = {
    "alto": "Lo podemos resolver nosotros",
    "medio": "Depende en parte de otros",
    "bajo": "Depende de otros",
}
TIPO_LLANO = {
    "entrevistas": "entrevistas",
    "tickets": "casos de atención",
    "health": "encuestas",
    "analytics": "datos de uso",
    "campo": "observación en el lugar",
}


def f1(x):
    return f"{x:.1f}".replace(".", ",")


def f0(x):
    return str(int(round(x)))


# ---------------------------------------------------------------- cálculos

def certeza(tipos):
    if not tipos:
        return "Hipótesis"
    if len(tipos) == 1:
        return "Indicio"
    if len(tipos) >= 3 and tipos & VOZ and tipos & COMPORTAMIENTO:
        return "Evidencia sólida"
    return "Patrón"


def tipos_de(o, ev):
    return {ev[r]["tipo"] for r in o.get("evidencia", []) if r in ev}


def grupo_nps(g):
    n = g["n"]
    p, d = g["promotores"] / n, g["detractores"] / n
    v = p - d
    return v * 100, math.sqrt(max(p + d - v * v, 0) / n) * 100


def comparar(c):
    """c = {"a": {"nombre","n","promotores","detractores"}, "b": {...}}. Devuelve todo calculado."""
    va, ea = grupo_nps(c["a"])
    vb, eb = grupo_nps(c["b"])
    dif = va - vb
    err = math.sqrt(ea * ea + eb * eb)
    lo, hi = dif - 1.96 * err, dif + 1.96 * err
    real = lo > 0 or hi < 0
    mayor, menor = (c["a"]["nombre"], c["b"]["nombre"]) if dif >= 0 else (c["b"]["nombre"], c["a"]["nombre"])
    if real:
        lo_abs, hi_abs = sorted((abs(lo), abs(hi)))
        llano = (f"Con esta cantidad de respuestas no es casualidad. La diferencia real puede estar entre "
                 f"{f0(lo_abs)} y {f0(hi_abs)} puntos, pero en ningún caso {menor} queda arriba.")
        veredicto = "La diferencia es real"
    else:
        llano = (f"Con esta cantidad de respuestas puede ser casualidad: si se repitiera la encuesta, "
                 f"la diferencia podría desaparecer o incluso darse vuelta.")
        veredicto = "Puede ser casualidad"
    tecnico = (f"{c['a']['nombre']} {f1(va)} (n={c['a']['n']}) contra {c['b']['nombre']} {f1(vb)} "
               f"(n={c['b']['n']}). Diferencia {f1(dif)} puntos, intervalo del 95% de {f1(lo)} a {f1(hi)}. "
               f"{'Se distingue del ruido.' if real else 'No se distingue del ruido.'}")
    return {"a": {"nombre": c["a"]["nombre"], "valor": f1(va), "n": c["a"]["n"]},
            "b": {"nombre": c["b"]["nombre"], "valor": f1(vb), "n": c["b"]["n"]},
            "diferencia": f0(abs(dif)), "mayor": mayor, "menor": menor, "real": real,
            "veredicto": veredicto, "llano": llano, "tecnico": tecnico}


# ---------------------------------------------------------------- validación

def validar(a, version):
    err = []
    if PROHIBIDOS.search(json.dumps(a, ensure_ascii=False)):
        err.append('Hay raya larga (em dash o en dash) o punto medio. Reemplazar por "|", "-" o ",".')
    for nivel in ("metrica", "outcome"):
        n = a.get(nivel) or {}
        for campo in ("texto", "linea_base", "periodo", "fuente"):
            if not str(n.get(campo, "")).strip():
                err.append(f"{nivel}: falta {campo}")
    comp = (a.get("outcome") or {}).get("comparacion")
    if comp:
        for g in ("a", "b"):
            x = comp.get(g) or {}
            for campo in ("nombre", "n", "promotores", "detractores"):
                if campo not in x:
                    err.append(f"outcome.comparacion.{g}: falta {campo}")
    ev_ids = set()
    for e in a.get("evidencia", []):
        eid = e.get("id")
        if eid in ev_ids:
            err.append(f"Evidencia duplicada: {eid}")
        ev_ids.add(eid)
        if e.get("tipo") not in TIPOS:
            err.append(f"{eid}: tipo '{e.get('tipo')}' no válido ({', '.join(sorted(TIPOS))})")
        for campo in ("origen", "texto", "periodo"):
            if not str(e.get(campo, "")).strip():
                err.append(f"{eid}: falta {campo}")
        if version == "presentar" and not str(e.get("fuente_simple", "")).strip():
            err.append(f"{eid}: falta fuente_simple (cómo se nombra la fuente para el equipo)")
    ops = a.get("oportunidades", [])
    if not ops:
        err.append("No hay oportunidades")
    for o in ops:
        oid = o.get("id", "?")
        for campo in ("necesidad", "actor", "momento", "impacto"):
            if not str(o.get(campo, "")).strip():
                err.append(f"{oid}: falta {campo}")
        if o.get("urgencia") not in URGENCIAS:
            err.append(f"{oid}: urgencia tiene que ser alta, media o baja, por consecuencia")
        if o.get("control") not in CONTROL:
            err.append(f"{oid}: control tiene que ser alto, medio o bajo")
        for ref in o.get("evidencia", []):
            if ref not in ev_ids:
                err.append(f"{oid}: la evidencia {ref} no existe")
        v = o.get("vinculo_outcome") or {}
        if v.get("estado") not in ("dato", "hipotesis"):
            err.append(f"{oid}: vinculo_outcome.estado tiene que ser dato o hipotesis")
        if v.get("estado") == "hipotesis" and not str(v.get("nota", "")).strip():
            err.append(f"{oid}: vínculo con el outcome en hipótesis sin decir qué lo probaría")
        if o.get("prioridad"):
            sols = o.get("soluciones", [])
            if len(sols) < 2:
                err.append(f"{oid}: es prioritaria y tiene {len(sols)} solución(es); hacen falta dos o más")
            for i, s in enumerate(sols, 1):
                for campo in ("texto", "supuesto", "como_testear"):
                    if not str(s.get(campo, "")).strip():
                        err.append(f"{oid}, solución {i}: falta {campo}")
    if version == "presentar":
        for campo in ("titular", "bajada", "lectura"):
            if not str((a.get("presentar") or {}).get(campo, "")).strip():
                err.append(f"presentar.{campo}: falta (la versión para el equipo necesita titular, bajada y lectura)")
    return err


# ---------------------------------------------------------------- versión repositorio

def repositorio(a, modo):
    ev = {e["id"]: e for e in a.get("evidencia", [])}
    m, oc = a["metrica"], a["outcome"]
    comp = comparar(oc["comparacion"]) if oc.get("comparacion") else None
    L = [f"# Árbol de oportunidades | {a.get('titulo', m['texto'])}", ""]
    if modo == "apertura":
        L += ["Versión de apertura: las oportunidades son hipótesis de partida, a validar en el discovery.", ""]
    L += [f"**1. Métrica:** {m['texto']} | línea base {m['linea_base']} | {m['periodo']} | {m['fuente']}", ""]
    L += [f"**2. Outcome:** {oc['texto']} | línea base {oc['linea_base']} | {oc['periodo']} | {oc['fuente']}", ""]
    if comp:
        L += [f"Comparación calculada por `arbol.py`: {comp['tecnico']}", ""]
    if a.get("explicaciones_alternativas"):
        L += ["**Explicaciones alternativas del outcome:**", ""] + [f"- {x}" for x in a["explicaciones_alternativas"]] + [""]

    L += ["## Árbol", "", f"- **{m['texto']}** | {m['linea_base']}", f"  - **{oc['texto']}** | {oc['linea_base']}"]
    for o in a["oportunidades"]:
        c = "Hipótesis" if modo == "apertura" else certeza(tipos_de(o, ev))
        L.append(f"    - **{o['id']}** {o['necesidad']} [{c}]" + (" | PRIORIDAD" if o.get("prioridad") and modo != "apertura" else ""))
        if modo != "apertura":
            L += [f"      - {s['texto']}" for s in o.get("soluciones", [])]
    L.append("")

    if modo == "apertura":
        L += ["## Qué vamos a validar", "", "| Oportunidad | Actor | Momento | Qué la confirmaría |", "|---|---|---|---|"]
        L += [f"| {o['id']} {o['necesidad']} | {o['actor']} | {o['momento']} | {o['vinculo_outcome'].get('nota', '')} |" for o in a["oportunidades"]]
        return "\n".join(L) + "\n"

    L += ["## Oportunidades", "",
          "| ID | Necesidad | Actor | Momento | Urgencia | Fuentes | Certeza | Vínculo con el outcome | Control | Prioridad |",
          "|---|---|---|---|---|---|---|---|---|---|"]
    for o in a["oportunidades"]:
        t = tipos_de(o, ev)
        L.append(f"| {o['id']} | {o['necesidad']} | {o['actor']} | {o['momento']} | {o['urgencia']} | "
                 f"{', '.join(sorted(t)) or 'ninguna'} | {certeza(t)} | "
                 f"{'dato' if o['vinculo_outcome']['estado'] == 'dato' else 'hipótesis'} | {o['control']} | "
                 f"{'sí' if o.get('prioridad') else 'no'} |")
    L.append("")
    for o in a["oportunidades"]:
        t = tipos_de(o, ev)
        n_ev, n_t = len(o.get("evidencia", [])), len(t)
        L += [f"### {o['id']} | {o['necesidad']}", "",
              f"Certeza: {certeza(t)} ({n_ev} {'pieza' if n_ev == 1 else 'piezas'}, {n_t} {'tipo' if n_t == 1 else 'tipos'} de fuente). "
              f"Urgencia: {o['urgencia']}. Control: {o['control']}. Impacto: {o['impacto']}", "",
              f"Vínculo con el outcome: {'dato' if o['vinculo_outcome']['estado'] == 'dato' else 'hipótesis'}. {o['vinculo_outcome'].get('nota', '')}".strip(), ""]
        if o.get("evidencia"):
            L += ["Evidencia:", ""]
            for r in o["evidencia"]:
                e = ev[r]
                L.append(f"- {r} ({e['tipo']}) {e['texto']}" + (f" | {e['dato']}" if e.get("dato") else "") + f" | {e['origen']} | {e['periodo']}")
            L.append("")
        if o.get("soluciones"):
            L += ["| Solución | Supuesto a testear | Cómo se testea |", "|---|---|---|"]
            L += [f"| {s['texto']} | {s.get('supuesto', '')} | {s.get('como_testear', '')} |" for s in o["soluciones"]]
            L.append("")
    if a.get("contradicciones"):
        L += ["## Contradicciones", ""] + [f"- {x}" for x in a["contradicciones"]] + [""]
    if a.get("evidencia_a_conseguir"):
        L += ["## Evidencia a conseguir", ""] + [f"{i}. {x}" for i, x in enumerate(a["evidencia_a_conseguir"], 1)] + [""]
    L += ["## Criterios", "",
          "- Certeza por tipos de fuente distintos: ninguno, hipótesis; uno, indicio; dos, patrón; tres o más con voz y comportamiento, evidencia sólida.",
          "- Urgencia por consecuencia: alta deja a la persona sin el servicio, hace perder plata o datos, o no tiene salida; media obliga a un contacto o esfuerzo extra; baja es molestia sin consecuencia.",
          "- Diferencias de NPS con intervalo del 95%, calculado por el script: se afirman solo si no incluyen el cero.", ""]
    cnt = {}
    for o in a["oportunidades"]:
        k = certeza(tipos_de(o, ev))
        cnt[k] = cnt.get(k, 0) + 1
    L += ["## Resumen", "", " | ".join(f"{k}: {v}" for k, v in cnt.items())]
    if not any(o["vinculo_outcome"]["estado"] == "dato" for o in a["oportunidades"]):
        L += ["", "Ninguna oportunidad tiene probado su vínculo con el outcome. Antes de comprometer soluciones, conseguir la evidencia de arriba."]
    return "\n".join(L) + "\n"


# ---------------------------------------------------------------- versión presentar

def vista(a, modo):
    """Textos en lenguaje llano para la plantilla HTML. Sin IDs ni jerga."""
    ev = {e["id"]: e for e in a.get("evidencia", [])}
    m, oc, p = a["metrica"], a["outcome"], a["presentar"]
    comp = comparar(oc["comparacion"]) if oc.get("comparacion") else None
    ops = []
    for i, o in enumerate(a["oportunidades"], 1):
        t = tipos_de(o, ev)
        c = "Hipótesis" if modo == "apertura" else certeza(t)
        clase = {"Hipótesis": "hip", "Indicio": "ind", "Patrón": "pat", "Evidencia sólida": "sol"}[c]
        sabemos = o["vinculo_outcome"]["estado"] == "dato"
        ops.append({
            "num": i,
            "necesidad": o["necesidad"],
            "clase": clase,
            "certeza": CERTEZA_LLANA[c],
            "fuentes": ", ".join(TIPO_LLANO[x] for x in sorted(t)) if t and modo != "apertura" else "",
            "quien": o["actor"],
            "momento": o["momento"],
            "gravedad": URGENCIA_LLANA[o["urgencia"]],
            "control": CONTROL_LLANO[o["control"]],
            "impacto": o["impacto"],
            "prioridad": bool(o.get("prioridad")) and modo != "apertura",
            "explica": sabemos,
            "explica_texto": ("Sí, hay datos que lo muestran. " if sabemos else "Todavía no lo sabemos. ") + o["vinculo_outcome"].get("nota", ""),
            "evidencia": [] if modo == "apertura" else [
                {"texto": ev[r]["texto"], "dato": ev[r].get("dato", ""), "fuente": ev[r]["fuente_simple"], "periodo": ev[r]["periodo"]}
                for r in o.get("evidencia", [])],
            "soluciones": [] if modo == "apertura" else [
                {"texto": s["texto"], "supuesto": s.get("supuesto", ""), "prueba": s.get("como_testear", "")}
                for s in o.get("soluciones", [])],
        })
    return {
        "modo": modo,
        "migas": p.get("migas", "Árbol de oportunidades"),
        "titular": p["titular"],
        "bajada": p["bajada"],
        "lectura": p["lectura"],
        "lectura_titulo": p.get("lectura_titulo", "Antes de decidir qué hacer"),
        "metrica": {"texto": m["texto"], "valor": m.get("valor", ""), "detalle": p.get("metrica_detalle", f"{m['linea_base']}, {m['periodo']}")},
        "outcome": {"texto": oc["texto"], "comparacion": comp, "alternativa": p.get("alternativa", "")},
        "oportunidades": ops,
        "a_conseguir": p.get("a_conseguir") or a.get("evidencia_a_conseguir", []),
        "pie": p.get("pie", f"Fuente: {m['fuente']}, {m['periodo']}."),
    }


def presentar(a, modo):
    html = PLANTILLA.read_text(encoding="utf-8")
    datos = json.dumps(vista(a, modo), ensure_ascii=False).replace("</", "<\\/")
    return html.replace("__VISTA__", datos)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("archivo")
    ap.add_argument("--version", choices=["presentar", "repositorio"], required=True)
    ap.add_argument("--modo", choices=["cierre", "apertura"], default="cierre")
    ap.add_argument("--out", required=True)
    args = ap.parse_args()
    a = json.load(open(args.archivo, encoding="utf-8"))
    err = validar(a, args.version)
    if err:
        print("El árbol no pasa la validación:")
        for e in err:
            print("ERROR  " + e)
        sys.exit(1)
    salida = presentar(a, args.modo) if args.version == "presentar" else repositorio(a, args.modo)
    if PROHIBIDOS.search(salida):
        print("ERROR  La salida tiene raya larga o punto medio.")
        sys.exit(1)
    Path(args.out).write_text(salida, encoding="utf-8")
    print(f"OK | {args.version} | {args.out}")
    if a["outcome"].get("comparacion"):
        print("Comparación: " + comparar(a["outcome"]["comparacion"])["tecnico"])


if __name__ == "__main__":
    main()
