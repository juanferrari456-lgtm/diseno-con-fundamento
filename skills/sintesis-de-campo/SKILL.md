---
name: sintesis-de-campo
description: "Procesa entrevistas y sesiones de observación de una investigación que sale a campo con una guía de hipótesis: arma la ficha con sintesis-de-entrevistas y le suma el veredicto de cada hipótesis contra los criterios de la guía, el contraste con los dolores del blueprint, los espejos entre personas de una misma organización, la cobertura por segmento y un tablero que se actualiza con cada sesión. Propone ajustes a la guía sin romper la comparabilidad y ordena los cortes de síntesis. Usar cuando la entrevista sigue una guía con hipótesis H e IDs de pregunta, cuando pidan el tablero de hipótesis, qué hipótesis se confirman, qué quedó sin cubrir, cuántas entrevistas faltan por segmento o cómo ajustar la guía entre entrevistas."
---

# Síntesis de campo con guía de hipótesis

Se apoya en `sintesis-de-entrevistas` y no la modifica. Esa skill hace la ficha 01 a 10, el corpus de dolores y el acumulado. Esta suma lo que necesita un campo con hipótesis: veredictos, cobertura, contraste con el blueprint y aprendizaje entre sesiones.

**Rigor.** Un veredicto se decide contra el criterio "confirma si" o "refuta si" de la guía, con cita. La lectura propia va a inferencias. Un dolor nuevo no se numera en la ficha: lo numera el registro.

**Economía.** De la guía se lee el recorte que da `campo.js guia`, nunca la guía entera. El tablero lo genera el script.

Principios del paquete en `references/principios.md`.

```bash
B=<carpeta de la skill sintesis-de-entrevistas>
C=$B/scripts/corpus.js
P=<carpeta de esta skill>/scripts/campo.js
W=./corpus
```

## Cuándo usarla y cuándo no

- **Sí:** entrevistas u observaciones que siguen una guía con hipótesis, tablero de hipótesis, cobertura por segmento, ajustes a la guía, cortes de síntesis.
- **No:** entrevistas sin guía de hipótesis (alcanza con `sintesis-de-entrevistas`) ni reuniones internas (`sintesis-de-reuniones`).

## Qué necesita para arrancar

- La transcripción, las notas o la hoja de observación.
- La guía con sus secciones Hipótesis, Trazabilidad y Ajuste por segmento (formato de `guia-de-entrevista`). El nombre del archivo tiene que contener `Guia-de-Entrevistas`, o se pasa con `--guia`.
- Si hay blueprint, su registro de dolores (`*Registro*Dolores*` o `--registro`).

Según cómo llega el pedido (principio P1):

- **Completo:** procesar.
- **Con huecos:** si no hay guía, preguntar si existe. Si no existe, procesar solo con `sintesis-de-entrevistas` y ofrecer armar la guía para las próximas.
- **De alguien que arranca:** explicar en una línea qué es un veredicto ("decir si lo que escuchamos confirma, refuta o matiza lo que creíamos, según el criterio que fijamos antes") y procesar.

## Térmica

| Si pasa esto | Saltar a |
|---|---|
| No está la skill base | Avisar y frenar: sin ella no hay ficha ni corpus |
| No hay guía con hipótesis | `guia-de-entrevista` para las próximas; esta sesión va solo con `sintesis-de-entrevistas` |
| Un segmento queda sin cubrir | `muestra-y-reclutamiento` |
| Termina la muestra y hay que decidir qué hacer | `arbol-de-oportunidades` o `encuadre-del-problema`, modo reencuadre |

## Qué agrega

| Qué | Dónde | Quién lo escribe |
|---|---|---|
| Filas de campo en la tabla de inicio | ficha | Claude |
| Sección 11, Contraste con la guía | ficha | Claude |
| Tablero de hipótesis y cobertura por segmento | `TABLERO.md` | `campo.js build` |

## Proceso de una sesión

### 1 | Preparar

Leer `$B/SKILL.md` y `$B/references/ficha.md` (reglas de la base) y `references/campo.md` (esta skill). Después:

```bash
node $C init <origen> --dir $W
node $C limpiar <transcripcion> --out $W/t.md
node $P guia --cliente "<cliente>" [--segmento <letra>]
```

`guia` devuelve las hipótesis con estado y criterios, las que la guía asigna al segmento y toda fila que nombra al cliente. Para el texto de una pregunta puntual, `grep -n "^| 2.1 " <guia>`.

### 2 | Escribir la ficha

Ficha 01 a 10 como dice la base, más las filas de campo y la sección 11 como dice `references/campo.md`. Código E correlativo al último del corpus. Si es una sesión de observación, seguir la sección "Observación de campo" de `references/campo.md`.

### 3 | Validar y consolidar

```bash
node $C check $W/fichas/<ficha>.md --dir $W
node $P check $W/fichas/<ficha>.md --dir $W
node $C add   $W/fichas/<ficha>.md --dir $W
node $C map ... --dir $W
node $C build --dir $W
node $P build --dir $W
```

Corregir los avisos de los dos `check` con ediciones puntuales. Después `node $C auditar --perfil E22 --dir $W`, resuelto contra la transcripción antes de cerrar.

### 4 | Entregar

Ficha, `corpus.json`, `ACUMULADO.md` y `TABLERO.md`, por el canal del entorno. Nada de lo que dijeron los entrevistados va a ninguna memoria.

Mensaje final, esta forma y nada más:

```
E22 procesada | 14 dolores, 9 consolidados nuevos, 5 mapeados.
Hipótesis | H1 ✅ H9 ✅ H6 ❌ H2 🔶 | sin cubrir: H5 (segmento), H10
Cobertura | A 4 de 6, B 1 de 5
Blueprint | 4 P confirmados, 1 contradicho (P53), 2 dolores nuevos para el registro
Archivos guardados en <carpeta>.

Ajustes para la próxima
- [hasta 3, cada uno con su evidencia]

Acciones
- [solo si hay: lo que el entrevistado ofreció compartir, con dueño]

Supuestos
- [solo si hay]

Preguntas
1. [hasta 3]
```

Sin resumen de hallazgos. Secciones vacías se omiten.

## Ajustes entre sesiones

Cada entrevista mejora la siguiente, pero lo que hace comparable la muestra no se toca a mitad de camino. Qué se puede ajustar y qué no, y los criterios que tiene que pasar toda repregunta nueva, en `references/campo.md`. Los ajustes se proponen en el mensaje, nunca en la ficha. Los aceptados los versiona la persona en la guía, con desde qué entrevista rigen.

## Cortes

1. **Corte 1**, al cerrar el primer segmento completo o a las 5 entrevistas: `NOTAS.md` con insights, capa cliente del blueprint (P confirmados y dolores nuevos al registro primero) e hipótesis saturadas.
2. **Corte 2**, al terminar la muestra: entregable por driver y por decisión, blueprint final, cada afirmación con código E y P.

En los dos cortes valen las reglas de cierre de lote de `sintesis-de-entrevistas`: base de evidencia arriba, recurrencia con denominador por segmento, insights con tensión, contraejemplos y una sola voz no es insight. La cobertura por segmento del tablero dice qué segmentos sostienen cada conclusión.

**Freno antes de redactar.** Proponer primero la estructura, una línea por punto con sus códigos E, H y P, y esperar el ok. Las conclusiones de campo son lo que llega a quien decide: se acuerdan antes de escribirlas.

```bash
node $P h H9 --dir $W        # una hipótesis con toda su evidencia
node $P p P53 --dir $W       # un dolor del blueprint visto desde el campo
node $C query --top 15 --dir $W
```

## La regla que no se negocia

El veredicto se decide contra el criterio que se fijó antes de salir a campo, no contra lo que hoy parece razonable. Si el criterio estaba mal, se cambia en un corte y se registra desde cuándo rige; no se reinterpreta en silencio.

## Errores que existe para evitar

- Dar un veredicto sin cita.
- Contar como confirmación un asentimiento a una idea de quien condujo.
- Respuestas muy positivas sin repregunta por la excepción, contadas como confirmación plena.
- Cambiar criterios a mitad de la muestra sin versionar la guía.
- Sacar conclusiones generales de un segmento que tiene una sola entrevista.

## Referencias

- `references/campo.md`: filas de inicio, sección 11, veredictos, ajustes, cortes y observación de campo.
- Skill base `sintesis-de-entrevistas`: ficha 01 a 10, corpus, mapeo y consultas.
- `references/principios.md` y `references/certeza-y-muestras.md`: principios del paquete.
