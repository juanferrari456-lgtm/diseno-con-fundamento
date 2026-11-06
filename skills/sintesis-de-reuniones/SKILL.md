---
name: sintesis-de-reuniones
description: "Convierte transcripciones o notas de reuniones internas (alineaciones, seguimientos, kickoffs, priorizaciones, working sessions, retros) en una minuta .md con decisiones, acciones con dueño y plazo, temas abiertos y riesgos anclados a la transcripción, y encadena las reuniones de una iniciativa con un archivo de seguimiento. Usar cuando llegue una transcripción, un resumen automático o notas crudas de una reunión de trabajo, o pregunten qué quedó pendiente, qué se decidió o quién tiene qué en una iniciativa. Para entrevistas de investigación va sintesis-de-entrevistas."
---

# Síntesis de reuniones internas

**Rigor.** Una propuesta no es una decisión. Un "habría que" sin quien lo tome no es una acción. Lo que no se puede señalar en la transcripción no entra a la minuta.

**Economía.** La transcripción se limpia y se lee una vez. La minuta se escribe a archivo. El seguimiento lo genera el script. Lo derivado no vuelve al contexto ni se pega en el chat: es lo que mantiene barata cada reunión nueva de la cadena.

Principios del paquete en `references/principios.md`.

```bash
S=<carpeta de esta skill>/scripts/reuniones.js
W=./reuniones          # carpeta de trabajo
```

## Cuándo usarla y cuándo no

- **Sí:** reuniones de trabajo de una iniciativa, sueltas o en serie, y consultas sobre qué quedó pendiente.
- **No:** entrevistas con usuarios o con personas del servicio (va `sintesis-de-entrevistas`).

## Qué necesita para arrancar

- La transcripción o las notas.
- Si la reunión sigue una serie, el seguimiento de la iniciativa.

Según cómo llega el pedido (principio P1):

- **Completo:** procesar sin frenar e inferir la metadata (iniciativa, fecha, tipo, participantes) de la transcripción y el nombre del archivo, listando los supuestos al cierre.
- **Con huecos:** si no se sabe a qué iniciativa pertenece y hay más de un seguimiento, preguntarlo en una línea.
- **De alguien que arranca:** explicar en una línea qué es la cadena ("cada reunión suma a un seguimiento que dice qué está abierto, sin releer minutas viejas") y ofrecer arrancarla desde esta reunión.

## Térmica

| Si pasa esto | Saltar a |
|---|---|
| Es un kickoff | Pasar lo dicho por `encuadre-del-problema`, bloque A. Lo que la reunión no respondió va a la 11 como `[NO DEFINIDO]` |
| En la reunión aparecen actores nuevos que influyen en la iniciativa | Sugerir sumarlos a `mapa-de-stakeholders` |
| Es una entrevista, no una reunión interna | `sintesis-de-entrevistas` |

## Dónde viven los archivos

El script trabaja sobre `$W` y trae el estado con `init <origen>`. El origen es donde la persona guarda la carpeta de la iniciativa:

- **Carpeta conectada de su computadora:** es la fuente. Al terminar, escribir la minuta y el seguimiento de vuelta ahí.
- **Archivos de un proyecto de Claude:** `/mnt/project` o la ruta que corresponda. Al terminar, la persona reemplaza los archivos.
- **Adjuntos del chat:** la carpeta de uploads.

Si hay más de un origen, pasarlos todos a `init`.

## Dos modos, una plantilla

| | Suelta | Encadenada |
|---|---|---|
| Cuándo | Reunión aislada, o primera sin cadena previa | Hay un `*_Reunion_Seguimiento_*.md` de la iniciativa, o la persona dice que sigue una serie |
| Sale | Minuta | Minuta y seguimiento regenerado |
| Sección 05 | `- No aplica, reunión suelta.` | Estado de lo que venía abierto |

Toda minuta lleva código `R0N` e IDs (`R03-A2`), también las sueltas, para poder sumarla a una cadena después.

El modo se elige sin preguntar: si `init` encuentra seguimiento, encadenada; si no, suelta, salvo que la persona diga que arranca una serie.

## Proceso

### 1 | Preparar

```bash
node $S init <origen> [<origen> ...] --dir $W
node $S limpiar <transcripcion> --out $W/t.md
```

`init` imprime lo abierto de la cadena, las decisiones vigentes, el glosario de personas con sus variantes de nombre y el próximo código. Con eso alcanza: no hace falta abrir el seguimiento ni minutas anteriores. Si hay seguimientos de varias iniciativas, repetir con `--iniciativa "<nombre>"`.

Si llega `.docx`, `.pdf`, `.vtt` o `.srt`, convertir antes con `markdown-converter`. `limpiar` une turnos y saca asentimientos. Si devuelve 0 turnos, son notas sin transcripción: leer el original y anclar la evidencia como `[notas]`.

Leer `$W/t.md` entero, una vez.

### 2 | Escribir la minuta a archivo

Leer `references/minuta.md` antes de escribir: define la plantilla, qué es decisión y qué es acción, nombres y redacción, y es lo que el script parsea.

```
$W/minutas/{Iniciativa}_Reunion_{R0N}-{Tema}_{Periodo}.md
```

Iniciativa y Tema con palabras separadas por `-`, sin tildes ni espacios. Periodo trimestral (`Q12027`) según la fecha de la reunión. Si `contexto.md` define otra convención, agregarla sin perder `_Reunion_R0N-`, que es como el script encuentra las minutas.

### 3 | Check, y en modo encadenado add

```bash
node $S check $W/minutas/<minuta>.md --dir $W
node $S add   $W/minutas/<minuta>.md --dir $W      # solo encadenada
```

Corregir los errores de `check` con ediciones puntuales. Los avisos de "no mencionados" son normales: lo que no se habló queda igual.

### 4 | Entregar

Minuta (y seguimiento, si es encadenada) por el canal del entorno. La cadena vive en el seguimiento, no en ninguna memoria.

Mensaje final, esta forma y nada más:

```
R04 procesada | 3 decisiones, 6 acciones (2 sin dueño), 2 temas abiertos.
Seguimiento: 3 acciones cerradas, 1 estancada (R01-A2).
Minuta y seguimiento guardados en <carpeta>.

Supuestos
- [solo si hay]

Preguntas
1. [hasta 3: nombres a confirmar, decisiones dudosas, contradicciones]
```

En suelta, sin la línea de seguimiento. Sin resumen de la reunión en el chat: está en la minuta.

Si las respuestas cambian la minuta: editar, `check`, `add` de nuevo (reemplaza la versión anterior de esa reunión) y reentregar.

## Varias reuniones

Varias reuniones de la misma iniciativa en una conversación: en orden cronológico y de a una (minuta, `check` y `add` de la primera antes de leer la segunda). Si se procesa una reunión vieja después de una nueva, revisar con `query --id` lo que la nueva pudo haber dejado sin cerrar.

## Consultar una iniciativa

```bash
node $S query --abiertas --dir $W
node $S query --dueno "Laura" --dir $W
node $S query --decisiones --dir $W
node $S query --buscar "lista espera proveedor" --dir $W     # AND de palabras
node $S query --id R02-A3 --dir $W                            # historia de un ítem
```

Toda respuesta con sus IDs. Si hace falta el detalle de una reunión, abrir solo esa minuta.

Para arrancar una cadena con minutas viejas en esta plantilla: `init` y `node $S rebuild --dir $W`. Minutas en otro formato se reprocesan de a una, en orden.

## La regla que no se negocia

Una propuesta no se registra como decisión, y una acción sin dueño queda `[SIN DUEÑO]`. Dueños y plazos salen de lo que dijo la gente, no de un resumen automático.

## Errores que existe para evitar

- Registrar como decisión de esta reunión algo que llegó decidido de antes: va a la 11 como `[HEREDADA]`.
- Completar apellidos que no aparecen: quedan `[A CONFIRMAR]`.
- Meter en la 05 ítems que no se mencionaron.
- Editar el seguimiento a mano: rompe el estado que guarda al final del archivo.
- Terminar una encadenada sin entregar el seguimiento: la próxima reunión arranca sin lo abierto.

## Referencias

- `references/minuta.md`: plantilla, qué es cada cosa, estados, reemplazar o ajustar decisiones, glosario de nombres, redacción.
- `references/way-of-working.md`: cómo armar la carpeta de la iniciativa.
- `references/principios.md` y `references/certeza-y-muestras.md`: principios del paquete.
