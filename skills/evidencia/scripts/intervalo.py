#!/usr/bin/env python3
"""
Dice si la diferencia entre dos grupos es real o se confunde con el ruido.
Intervalo de confianza del 95% (aproximación normal).

Tipos:
  nps     cada grupo: n,promotores,detractores      (resultado en puntos de NPS)
  prop    cada grupo: n,casos                       (resultado en puntos porcentuales)
  media   cada grupo: n,promedio,desvio             (resultado en la unidad de la nota)

Uso:
  python intervalo.py nps --a 210,126,25 --b 150,83,20 --nombres individual,corporativo
  python intervalo.py prop --a 120,80 --b 95,41
  python intervalo.py media --a 150,4.1,1.3 --b 90,3.6,1.6
  python intervalo.py nps --a 210,126,25            (un solo grupo: su propio intervalo)
"""
import argparse, math, sys

Z = 1.96


def grupo(tipo, txt):
    v = [float(x) for x in txt.split(",")]
    n = v[0]
    if n <= 0:
        sys.exit("n tiene que ser mayor que cero")
    if tipo == "nps":
        p, d = v[1] / n, v[2] / n
        val = p - d
        err = math.sqrt(max(p + d - val ** 2, 0) / n)
        return n, val * 100, err * 100
    if tipo == "prop":
        p = v[1] / n
        return n, p * 100, math.sqrt(p * (1 - p) / n) * 100
    if tipo == "media":
        return n, v[1], v[2] / math.sqrt(n)
    sys.exit("tipo desconocido")


def aviso(nombre, n):
    if n < 10:
        return f"{nombre}: {int(n)} respuestas, menos de 10. Solo se citan casos, no se compara."
    if n < 30:
        return f"{nombre}: {int(n)} respuestas, entre 10 y 29. Solo referencia, sin rankear."
    return None


def f(x):
    return f"{x:.1f}".replace(".", ",")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("tipo", choices=["nps", "prop", "media"])
    ap.add_argument("--a", required=True)
    ap.add_argument("--b")
    ap.add_argument("--nombres", default="A,B")
    a_ = ap.parse_args()
    na, nb = (a_.nombres.split(",") + ["B"])[:2]

    n1, v1, e1 = grupo(a_.tipo, a_.a)
    print(f"{na}: {f(v1)} (intervalo {f(v1 - Z * e1)} a {f(v1 + Z * e1)}, n={int(n1)})")
    avisos = [aviso(na, n1)]
    if a_.b:
        n2, v2, e2 = grupo(a_.tipo, a_.b)
        print(f"{nb}: {f(v2)} (intervalo {f(v2 - Z * e2)} a {f(v2 + Z * e2)}, n={int(n2)})")
        avisos.append(aviso(nb, n2))
        dif = v1 - v2
        err = math.sqrt(e1 ** 2 + e2 ** 2)
        lo, hi = dif - Z * err, dif + Z * err
        print(f"Diferencia {na} - {nb}: {f(dif)} (intervalo del 95%: {f(lo)} a {f(hi)})")
        if lo > 0 or hi < 0:
            print("Veredicto: la diferencia es real. Se puede afirmar.")
        else:
            print("Veredicto: no se distingue del ruido. No afirmar que hay diferencia.")
    for x in avisos:
        if x:
            print("Aviso: " + x)


if __name__ == "__main__":
    main()
