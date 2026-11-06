# Way of working | 15 entrevistas sin quemar tokens

Tres momentos: preparar el Project una vez, procesar una entrevista por chat, y
consultar después sin cargar documentos enteros.

## 0 | Preparar el Project (una vez)

**Qué vive en el conocimiento del Project**

| Archivo | Para qué |
|---|---|
| `corpus.json` | mapeo de dolores y recurrencia. Sin esto no hay continuidad |
| `ACUMULADO.md` | lo que Claude busca para responder preguntas |
| `NOTAS.md` | insights transversales escritos a mano |
| `fichas/*.md` | la fuente, con citas y flujo |
| blueprints, `data.js` | artefactos, se consultan con `mapa.js` |

**Qué no vive en el Project**

- Transcripciones. Se suben al chat de su entrevista y nada más.
- El acumulado escrito a mano y handoffs viejos, una vez migrados. Duplican
  información y ensucian la búsqueda.

**Tabla de códigos cerrada antes de arrancar.** Una fila por entrevista con
código, entrevistado, fecha y archivo de transcripción. Resolver huecos (una E14
que no existe) y códigos que cambiaron de dueño antes de la primera ficha:
renumerar después obliga a reprocesar.

**Instrucción del Project** (pegar en instrucciones):

```
[Proyecto]. Para procesar entrevistas o responder sobre lo que
dijeron los entrevistados usar la skill sintesis-de-entrevistas.
No abrir ACUMULADO.md ni fichas completas: buscar en el conocimiento del Project
o usar corpus.js query. Toda afirmación con su código E0N.
```

## 1 | Migrar lo que ya existe (un chat, sin transcripciones)

1. `init` desde el Project y `migrar` del acumulado viejo si todavía no hay
   `corpus.json`.
2. Copiar las secciones narrativas a `NOTAS.md`.
3. Si ya hay fichas escritas (E10 a E13), `add` + `map` de cada una. Es barato:
   no hay transcripción que leer, solo el mapeo.
4. Entregar `corpus.json`, `ACUMULADO.md`, `NOTAS.md` y subirlos al Project.
   Borrar del Project el acumulado viejo.

## 2 | Una entrevista, un chat

**Prompt de arranque**

```
/sintesis-de-entrevistas [Proyecto] | E07
```
con la transcripción adjunta como archivo. Si falta metadata, sumarla en la misma
línea (fecha, entrevistado) en vez de contestar después: cada ida y vuelta
reenvía la transcripción.

**Qué hace Claude**: init, limpiar, leer una vez, ficha a archivo, check, add,
map, build, entregar. Respuesta de 5 a 10 líneas.

**Qué hacés vos al terminar** (sin esto se rompe la cadena):

1. Descargar los tres archivos.
2. En el Project: reemplazar `corpus.json` y `ACUMULADO.md`, sumar la ficha.
3. Si usás un tablero, subir la ficha.
4. Contestar las preguntas en el mismo chat solo si cambian la ficha. Si no,
   anotarlas para la próxima ronda.

**Qué no hacer en ese chat**: pedir un deck, un blueprint o preguntas generales
del corpus. Eso va en otro chat, con la transcripción fuera del contexto.

**Dentro de las 24 horas.** Procesar la entrevista mientras quien condujo todavía
puede completar lo que la transcripción no tiene. Pasado ese plazo, la memoria se
acomoda a lo que esperábamos escuchar.

**Orden sugerido**: cronológico. El mapeo es más estable si los consolidados se
arman en el orden en que aparecieron.

## 3 | Presupuesto

Estimación por entrevista con v3 (tokens aproximados).

| | 30 min | 60 min |
|---|---|---|
| Skill + referencia | 3k | 3k |
| Transcripción limpia | 7k | 13k |
| Ficha | 3,5k | 5k |
| add, map, build, cierre | 2k | 2,5k |
| Total | ~16k | ~24k |

Con v2 la misma entrevista de 60 min rondaba 45k y el mapeo crecía con cada
entrevista. Quince entrevistas de una hora: ~360k con v3 contra ~700k con v2, y
cada chat queda acotado, sin arrastrar lo anterior.

**Señales de que algo se desvió**: Claude abre `ACUMULADO.md`, lee la
transcripción original, o procesa dos entrevistas en
el mismo chat. Cortar y pedir que siga la skill.

## 4 | Cierre de lote (un chat)

1. `init`, `build`.
2. `query --top 30` y `query --vacios` para escribir `NOTAS.md` con las reglas de
   cierre de lote de la SKILL.md (base de evidencia, denominadores, contraejemplos,
   insights con tensión).
3. `build` final y subir al Project.

## 5 | Preguntarle a Claude después

Tres tipos de pregunta, tres caminos. Un tema por chat.

| Tipo | Ejemplo | Camino | Costo |
|---|---|---|---|
| Abierta | "¿Qué dicen de la lista de espera?" | búsqueda en conocimiento del Project | bajo, trae fragmentos |
| Conteo o trazabilidad | "¿Cuántos perfiles hablan de cancelaciones y con qué citas?" | `init` + `query --buscar` / `--dc` | muy bajo, exacto |
| Artefacto | "Armá el journey de reserva con los dolores" | `query --top` + `mapa.js abrir --seccion 02` | medio, solo lo usado |

**Prompts que rinden**

```
Con el corpus del Project: qué dolores de cancelación hay, cuántos perfiles, con cita. Respuesta corta con códigos.
Usá corpus.js query --dc DC13 y resumime las diferencias entre perfiles.
Top 10 dolores por recurrencia en tabla, sin comentarios.
¿Qué quedó sin preguntar sobre la lista de espera? (query --vacios --buscar)
```

**Reglas para que no explote**

- Nunca "leé todo el corpus y decime". Pedir el recorte.
- Para decks, `ACUMULADO.md` se adjunta al artefacto, no se lee en el chat.
- Si la respuesta no trae códigos `E0N`, pedirlos: sin ancla no entra al entregable.
- Chat largo de consultas: cortar y abrir otro. El corpus es el puente, no el historial.
