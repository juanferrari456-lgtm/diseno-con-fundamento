# The `.json` format | spec `bp/2`

The blueprint is a JSON file. One field, one piece of data: no tables, no
`<br>`, no emoji that mean something, no micro syntax inside a cell.

**Why JSON.** `JSON.parse` ships with the runtime: no parser of our own, no
ambiguity, no silent warnings. And the round trip is exact: what goes in is
what comes out.

---

## Skeleton

```json
{
  "spec": "bp/2",
  "meta":      { "titulo": "", "variante": "", "subtitulo": "", "estado": "", "version": "", "fuentes": "" },
  "actores":   [ { "id": "server", "label": "Server", "color": "#047857" } ],
  "canales":   [ { "id": "table", "label": "Table", "color": "#FDE68A", "italica": false } ],
  "carriles":  [ { "id": "EV", "label": "Evidence", "estilo": "evidencia", "desc": "", "lineaAbajo": "Line of interaction" } ],
  "fases":     [ { "id": "F1", "label": "Arrival" } ],
  "pasos":     [ ],
  "conexiones":[ { "de": "cj2", "a": "fs1", "tipo": "flecha", "label": "" } ]
}
```

Field names are in Spanish because that is what the parser reads. Values are
yours, in any language.

`carriles` is optional: leave it out and you get the five classic lanes with
their three lines, in the language of the panel. `estilo` is `journey`,
`evidencia` or `actor`, and it decides how the cards in that lane look.
`color` is optional on actors and channels; anything missing gets a stable
colour from the palette and the validator tells you.

## A step

```json
{
  "id": "s3",
  "fase": "F2",
  "label": "Ordering",
  "tiempo": "10 min",
  "carriles": {
    "EV": [ { "id": "ev3", "texto": "The laminated menu and the chalkboard with today's specials" } ],
    "CJ": [ { "id": "cj3", "actor": "guest", "canal": "menu",
              "texto": "Picks a pizza from the menu" } ],
    "BS": [ { "id": "bs2", "actor": "server", "canal": "ticket",
              "texto": "Clips the slip to the pass" } ]
  },
  "hallazgos": [
    { "id": "P3", "tipo": "dolor", "texto": "The specials board cannot be read from the middle of the room", "ref": "ev3" },
    { "tipo": "pregunta", "texto": "How many guests order the special without ever reading it?" }
  ]
}
```

### Card

| field     | required | what it is |
|---|---|---|
| `id`      | yes (or generated) | unique in the whole file, yours, stable |
| `texto`   | yes | the action, short, in the present tense, third person |
| `actor`   | no  | id of an actor. Drawn as a chip riding the top edge |
| `canal`   | no  | id of a channel. Drawn as a chip at the bottom |
| `tipo`    | no  | `accion` (default) or `espera` |
| `span`    | no  | `espera` only: how many columns the bar covers. Leave those columns empty in that lane, or it gets trimmed |
| `unhappy` | no  | `true` draws the red unhappy-path outline |

### Finding

`tipo` is one of `dolor`, `oportunidad`, `nota`, `cita`, `dato`, `pregunta`
(pain, opportunity, note, quote, fact, question). `id` is optional but worth
writing on pains and opportunities: it is what lets a blueprint cross reference
other documents. `ref` points at a card id, and the finding gets a left edge in
that lane's colour.

### Decision step

```json
{
  "id": "d1", "fase": "F1", "tipo": "decision",
  "pregunta": "Eating in or taking it away?",
  "ramas": [
    { "id": "A", "label": "Stays for dinner", "detalle": "7 out of 10 parties", "sigue": "s3" },
    { "id": "B", "label": "Orders takeaway",  "detalle": "3 out of 10 parties", "unhappy": false }
  ]
}
```

### Connections

The journey chains itself, decisions included. `conexiones` is only for arrows
that cross lanes or jump out of sequence. `tipo` is `flecha`, `doble` or
`punteada` (arrow, both ways, dashed).

---

## Optional fields (plugin build 14 and later)

All optional: a file written before draws the same.

| where | field | what it does |
|---|---|---|
| card | `fuente` | string or list of source ids (`["E3", "E7"]`), drawn as a small line under the text |
| card | `marca` | `inferido` (deduced, nobody said it) or `sin_evidencia`. Dashed outline |
| customer card | `pensamiento`, `emocion`, `tiempo` | string or `{ "texto": "", "fuente": [] }`. Drawn inside the card |
| step | `decide`, `criterio` | who makes a decision and on what criterion |
| step | `fin`, `sale`, `verdad` | end of the journey, outcome handed to another blueprint, moment of truth (tints the column) |
| finding | `tipo` | also `regulacion`, `tiempo`, `falla`, `verdad`, `posta` |
| finding | `fuente`, `etiqueta`, `chips` | sources, a label for a hand-off (`Viene de`), and links to other blueprints |
| actor | `tipo` | `cliente`, `organizacion`, `tercero` or `sistema`: sets the dot colour |
| root | `flujo` | `[{ "de": "", "a": "", "label": "" }]`. Replaces the implicit journey chain. Ends are a card, a decision step or a branch (`stepId-branchId`) |
| meta | `encabezado` | `kicker`, `tarjetas` (`label`, `texto`, `nota`, `chips`), `foco`, `pie`: the header of the board |

A finding id may repeat across steps: the same pain in two moments is the same
id on purpose.

## Reading `pbp/1` directly

If the material is already a `pensar-blueprints` model (`arquitectura.json` and
one file per blueprint, spec `pbp/1`), there is no `.bp.json` to write: drop all
the files in the plugin at once. It uses the architecture as a catalogue and
draws it as the discovery cover, and translates each blueprint in memory.

---

## What the plugin checks before drawing

**Errors, it will not draw:** `spec` other than `bp/2`; a file with no steps; a
duplicate step, card or finding id; a card with no text; a step pointing at a
phase that does not exist; a decision with no branches.

**Warnings, it draws anyway and tells you:** a card over 120 characters; an
actor or channel that was never declared; a `ref` or a connection pointing at
something that is not there; an empty step; an `espera` whose `span` was trimmed
so it would not cover another column.

**Info:** steps with pains and no opportunity.

Every message names the step it came from.

---

## What the board keeps

Every node carries `sharedPluginData` in the `blueprint` namespace (`id`,
`lane`, `paso`, `tipo`, `actor`, `canal`, `ref`), and the section stores the
whole file, split into chunks (`modelo.0`, `modelo.1`, … `modelo.trozos`).

`sharedPluginData` is readable by any plugin and by any script, unlike the
private `setPluginData`. That is the groundwork for reading an edited board back
into a file. The reader (`extras/35-sync.js`) is not part of the published
plugin yet.

---

# El formato en castellano

Los nombres de campo están en castellano porque es lo que lee el parser. Los
valores son tuyos, en el idioma que quieras.

`meta` lleva el título, la variante que va después de la barra, el subtítulo, el
estado, la versión y las fuentes. Todos opcionales menos el título.

`actores` y `canales` son catálogos: los declarás una vez y el board sale
consistente. La columna `color` es opcional, lo que falte recibe un color
estable de la paleta.

`carriles` es opcional. Sin él salen los cinco clásicos con sus tres líneas.
`estilo` es `journey`, `evidencia` o `actor` y decide cómo se ven las tarjetas.

`pasos` es el corazón. Un paso es una columna, o sea un momento del recorrido.
Adentro, `carriles` es un objeto donde cada clave es el id de un carril y el
valor es la pila de tarjetas de ese carril en ese momento. Si tres cosas pasan
al mismo tiempo en backstage, son tres tarjetas apiladas en la misma columna.

Las cuatro reglas que hacen que esto se mantenga consistente:

1. **Un paso es una columna.** Mismo momento, misma columna; lo que pasa una
   cosa después de la otra va en columnas contiguas, aunque sea del mismo actor.
2. **Los ids los escribís vos y no se renumeran nunca.** Insertar una tarjeta no
   rompe ninguna referencia.
3. **Una tarjeta es una acción**, escrita en presente y tercera persona ("arma
   la pizza"). Arriba de 120 caracteres el validador avisa, porque casi siempre
   son dos acciones metidas en una.
4. **Los hallazgos no viven en un carril.** Viven en el paso y opcionalmente
   apuntan a una tarjeta con `ref`. Se dibujan en su propia banda abajo,
   alineados por columna.

Nada de color ni de coordenadas en el archivo. Eso vive en el `DS` del plugin.
