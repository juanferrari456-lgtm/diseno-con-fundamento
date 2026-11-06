---
name: sintesis-de-entrevistas
description: "Convierte transcripciones o notas de entrevistas de investigación (discovery, validación, guerrilla, grupales o shadowing) en una ficha .md con evidencia anclada y mantiene un corpus consultable del proyecto: dolores consolidados por causa, recurrencia, contradicciones, vacíos e insights al cierre de cada lote. Usar cuando llegue una transcripción, desgrabación, VTT o notas crudas de una entrevista, para cerrar un lote de entrevistas, y para consultar lo que dijeron los entrevistados antes de un blueprint, un journey, un árbol, un deck o un taller. Para reuniones internas de trabajo va sintesis-de-reuniones; si la entrevista sigue una guía con hipótesis, sumar sintesis-de-campo."
---

# Síntesis de entrevistas

**Rigor.** Nada entra a una salida si no se puede señalar dónde se dijo. Lo inferido va marcado, lo que falta va declarado.

**Economía.** La transcripción se limpia y se lee una vez. La ficha se escribe a archivo. El acumulado lo genera el script. Lo derivado no vuelve al contexto ni se pega en el chat: es lo que hace que la entrevista 15 cueste lo mismo que la 1.

Principios del paquete en `references/principios.md`.

```bash
C=<carpeta de esta skill>/scripts/corpus.js
W=./corpus          # carpeta de trabajo
```

## Cuándo usarla y cuándo no

- **Sí:** una entrevista nueva, un lote para cerrar, una consulta sobre lo que dijeron.
- **No:** reuniones internas (va `sintesis-de-reuniones`). Si la entrevista sigue una guía con hipótesis, esta skill hace la ficha y `sintesis-de-campo` suma el veredicto y el tablero.

## Qué necesita para arrancar

- La transcripción o las notas.
- Dónde vive el corpus del proyecto, si ya existe.
- Metadata (proyecto, fecha, perfil, quién condujo): se infiere del material y se listan los supuestos al cierre.

Según cómo llega el pedido (principio P1):

- **Completo:** procesar sin frenar.
- **Con huecos:** si falta el código de entrevista o el proyecto, preguntarlo en una línea antes de escribir la ficha: cambiar códigos después obliga a reprocesar.
- **De alguien que arranca:** explicar en una línea qué es el corpus ("cada entrevista suma a una base que después se puede consultar sin releer todo") y proponer la carpeta y la tabla de códigos antes de la primera ficha (`references/way-of-working.md`).

## Térmica

| Si pasa esto | Saltar a |
|---|---|
| La entrevista sigue una guía con hipótesis H e IDs de pregunta | `sintesis-de-campo`, después de la ficha |
| Son notas de observación, no de entrevista | `sintesis-de-campo`, que las toma como fuente de comportamiento |
| Es una reunión interna | `sintesis-de-reuniones` |
| El entrevistado ofreció un contacto | Sumarlo a `mapa-de-stakeholders` con la entrevista como fuente |
| Cerró el lote y se pide qué hacer con todo esto | `arbol-de-oportunidades` o `arquetipos` |

## Arquitectura

| Qué | Dónde | Quién lo escribe |
|---|---|---|
| Ficha | `fichas/*.md` | Claude, una vez, a archivo |
| Corpus | `corpus.json` | `add` y `map` |
| Acumulado | `ACUMULADO.md` | `build` (no se edita) |
| Análisis transversal | `NOTAS.md` | Claude, al cerrar el lote, con ok |

## Dónde viven los archivos

`init <origen>` trae `corpus.json`, `NOTAS.md` y las fichas a `$W`. El origen es donde la persona guarda el corpus:

- **Carpeta conectada de su computadora:** es la fuente. Al terminar, escribir la ficha, `corpus.json` y `ACUMULADO.md` de vuelta en esa carpeta.
- **Archivos de un proyecto de Claude:** `/mnt/project` o la ruta que corresponda. Al terminar, la persona reemplaza los archivos en el proyecto.
- **Nada todavía:** arrancar un corpus nuevo.

`corpus.json` es lo único que guarda el mapeo de dolores a consolidados. Si no vuelve a la fuente después de cada entrevista, la siguiente arranca sin recurrencia.

## Proceso de una entrevista

Idealmente dentro de las 24 horas, mientras quien condujo puede completar lo que la transcripción no tiene.

### 1 | Preparar

```bash
node $C init <origen> --dir $W
node $C limpiar <transcripcion> --out $W/t.md
```

Si llega `.docx`, `.pdf`, `.vtt` o `.srt`, convertir antes con `markdown-converter`. `limpiar` une turnos, saca asentimientos y abrevia hablantes (alrededor de 30% menos). Leer `$W/t.md` entero, una vez.

### 2 | Escribir la ficha a archivo

Plantilla y reglas en `references/ficha.md`, la única referencia que hace falta en el proceso normal. Nombre: la convención de `contexto.md` o, si no hay, `Entrevista_{E0N}-{Perfil}_{Proyecto}.md`.

La ficha lleva el nombre del entrevistado solo en la tabla de inicio: la relación entre código y persona vive ahí y en ningún otro lado.

### 3 | Check, add, map, build

```bash
node $C check $W/fichas/<ficha>.md --dir $W
node $C add   $W/fichas/<ficha>.md --dir $W     # imprime hasta 25 candidatos
node $C map E15-D1=DC1 "E15-D2=+Texto consolidado nuevo" ... --dir $W
node $C build --dir $W
```

Corregir los avisos de `check` con ediciones puntuales. Después, `node $C auditar --perfil E15 --dir $W` y resolver cada aviso contra la transcripción, que todavía está en contexto.

Mapeo: mismo consolidado si comparten **causa**, no síntoma ni etapa. Ante la duda, consolidado nuevo. Mientras un consolidado tenga una sola fuente, conserva su período y alcance; se generaliza recién cuando otra entrevista lo comparte, con `renombrar`.

Contradicciones con otros perfiles: sección 10 con `[CONTRADICCIÓN]` y los códigos involucrados. Contradicciones de la misma persona: `[CONTRADICCIÓN INTERNA]` con las dos citas. Sorpresas contra los supuestos del encuadre: `[SORPRESA]`. No se resuelven: decidir quién tiene razón es trabajo del equipo.

### 4 | Entregar

Ficha, `corpus.json` y `ACUMULADO.md` por el canal del entorno: carpeta conectada o archivo en el chat.

No escribir citas, nombres ni hallazgos de entrevistados en ninguna memoria: el corpus es la fuente (`references/memoria.md`).

Mensaje final, esta forma y nada más:

```
E15 procesada | 19 dolores, 13 consolidados nuevos, 6 mapeados.
Ficha, corpus.json y ACUMULADO.md guardados en <carpeta>.

Acciones
- [solo si hay: lo que el entrevistado ofreció compartir (documento, dato, contacto), con dueño]

Supuestos
- [solo si hay]

Preguntas
1. [hasta 3: contradicciones, cifras dudosas, severidades inferidas]
```

Sin resumen de hallazgos, sin tabla de mapeo, sin explicar los comandos.

## Reglas de extracción

- Cuantificadores vagos se quedan vagos: "muchas veces" no se convierte en un número.
- El vocabulario del entrevistado se respeta.
- Las causas que no se dijeron no se atribuyen. La lectura propia va en la sección 10 con `[INFERENCIA]`.
- Vacíos en la sección 09 con `[NO DICHO]` o `[NO PREGUNTADO]`.
- Severidad solo con evidencia de frecuencia o impacto; si no, `[SIN DATO]`.
- Un dolor por fila. La fusión la hace el mapeo.
- Cita textual solo en evidencia de dolores, datos con cifra y 3 a 6 citas ancla.

## Cierre de lote

Se pueden procesar varias entrevistas en una conversación, de a una y en orden cronológico: ficha, `check`, `add`, `map` y `build` de la primera antes de leer la segunda. Si la conversación ya viene cargada, seguir en una nueva: el corpus es el puente, no el historial.

Al cerrar el lote: `init`, `build`, `query --top 30` y `query --vacios`. Después:

1. **Base de evidencia arriba de `NOTAS.md`:** cuántas entrevistas, cuántas con transcripción y cuántas solo con notas, de qué segmentos y qué segmentos faltan.
2. **Recurrencia con denominador,** total y por segmento: "4 de 15, 3 de 5 del segmento A". Nunca "los usuarios dicen".
3. **Insights con tensión:** "quieren X pero hacen Y porque Z". Z sale de los datos; si no, se escribe "causa sin dato" y pasa a pregunta de investigación. Cada insight con sus códigos E y DC.
4. **Contraejemplos buscados a propósito:** por cada insight, quién lo vivió distinto. Va dentro del insight, no en una nota al pie.
5. **Una sola voz no es insight:** lo que sostiene una sola entrevista se llama observación de una sola voz.
6. **Orden:** primero los insights que más cambian lo que el equipo iba a hacer. Lo que el equipo ya creía va aparte, como confirmación.

**Freno.** Proponer la lista de insights, una línea cada uno con sus códigos, y esperar el ok: son la decisión de criterio del lote. Recién ahí escribir `NOTAS.md` (insights `IN1`, `IN2`, sin repetir números) y un `build` final.

## Revisar fichas ya procesadas

Cuando aparece un error que puede repetirse, se revisa el corpus, no se regenera: regenerar renumera los dolores y rompe las referencias.

1. `init` y `node $C auditar --dir $W`: lista por ficha con códigos T tiempo, M marco, H hipotético, R referido, C cifra, S severidad, A alcance del consolidado.
2. De a una ficha, con su transcripción: confirmar o descartar cada aviso.
3. Ediciones puntuales con los mismos IDs. Un dolor no se borra: si no se sostiene, se reescribe o pasa a inferencias con nota.
4. `add` de la ficha (conserva el mapeo), `renombrar` los consolidados afectados, `build`.

## Consultar el corpus

Primero `init`, después pedir lo justo.

```bash
node $C query --top 12 --dir $W              # dolores por recurrencia
node $C query --dc DC2 --dir $W              # menciones de un dolor, con citas
node $C query --perfil E13 --dir $W
node $C query --buscar "lista de espera" --max 20 --dir $W   # AND de palabras
node $C query --vacios --dir $W
node $C query --datos --dir $W
node $C auditar [--perfil E13] --dir $W
node $C renombrar DC12 "Texto" --dir $W
```

Si el proyecto ya tiene blueprints, mapas y otros artefactos además de fichas, ver `references/artefactos.md` para trabajar con un índice en lugar de cargar todo.

## La regla que no se negocia

Las palabras del entrevistado quedan como las dijo. No se mejora una cita, no se juntan dos frases en una mejor, no se completa lo que la persona "quiso decir". Si el registro no es claro, la ficha dice que no es claro.

## Errores que existe para evitar

- Convertir un hipotético o algo de oídas en dolor.
- Cortar una cita antes de lo que le cambia el sentido.
- Fusionar dolores por síntoma y no por causa, e inflar la recurrencia.
- Escribir "los usuarios dicen" donde hay 2 de 15.
- Regenerar fichas y romper los IDs que ya citan otros artefactos.

## Referencias

- `references/ficha.md`: plantilla y reglas de la ficha.
- `references/corpus.md`: el corpus, sus comandos y el mapeo.
- `references/way-of-working.md`: cómo organizar un proyecto de muchas entrevistas.
- `references/artefactos.md`: índice cuando hay blueprints, mapas y otros artefactos.
- `references/memoria.md`: qué puede ir a una memoria y qué nunca.
- `references/principios.md` y `references/certeza-y-muestras.md`: principios del paquete.
