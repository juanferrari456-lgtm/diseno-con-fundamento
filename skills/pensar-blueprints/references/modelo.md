# El formato del modelo | spec `pbp/1`

Una carpeta por proyecto y estado. As-is y to-be son carpetas distintas.

```
blueprints-as-is/
  arquitectura.json          el conjunto: fuentes, actores, segmentos, ciclo, blueprints, cortes, sincronizaciones
  BP1-<slug>.json            un archivo por blueprint: momentos, hallazgos, verdad, preguntas
  BP2-<slug>.json
  ARQUITECTURA.md            lo escribe render, no se edita
  BP1.md, BP2.md             lo escribe render, no se edita
```

JSON porque el `check` lo puede leer sin ambigüedad. Lo que se lee y se comparte
son los `.md` que escribe `render`. El molde completo está en `assets/ejemplo/`.

## arquitectura.json

```json
{
  "spec": "pbp/1",
  "proyecto": "", "estado": "as-is", "version": "",
  "encuadre": { "pregunta": "", "decision": "", "audiencia": "" },
  "secciones": { "emocion": false, "pensamiento": false, "tiempo": true, "evidencia": true, "canales": true, "metricas": true, "regulaciones": false },
  "fuentes":   [ { "id": "E13", "label": "", "perspectiva": "backstage", "segmento": ["A"] } ],
  "huecos":    [ "Perspectiva que falta, en una línea" ],
  "actores":   [ { "id": "cliente", "label": "Cliente", "tipo": "cliente", "area": "" } ],
  "canales":   [ { "id": "whatsapp", "label": "WhatsApp" } ],
  "segmentos": [ { "id": "A", "label": "", "criterio": "" } ],
  "ciclo":     [ { "id": "C1", "label": "Llegar", "descripcion": "" } ],
  "blueprints": [ {
    "id": "BP1", "archivo": "BP1-alta.json", "titulo": "",
    "actor": "cliente", "intencion": "Qué quiere lograr el actor en este recorrido",
    "co_clientes": [], "segmentos": ["A"], "cadencia": "una vez", "ciclo": ["C1"],
    "zoom_de": null, "validacion": [ { "con": "", "fecha": "", "que_cambio": "" } ],
    "entrada": { "disparador": "", "viene_de": [] },
    "salida":  { "resultado": "", "recibe": "programacion", "va_a": ["BP2"] }
  } ],
  "cortes":          [ { "decision": "", "por_que": "", "descartado": "la alternativa que se consideró y por qué no", "fuente": [] } ],
  "sincronizaciones":[ { "de": "BP3.m4", "a": "BP1.m6", "tipo": "desbloquea", "texto": "", "fuente": [] } ],
  "fuera_de_alcance":[ { "segmento": "F", "que": "", "por_que": "", "fuentes": ["E20"] } ],
  "deriva_de":       "ruta de la carpeta as-is, solo en un to-be",
  "preguntas":       [ { "texto": "" } ]
}
```

- `actores[].tipo` es `cliente`, `organizacion`, `tercero` o `sistema`. El actor
  principal de cada blueprint es de tipo `cliente`, aunque sea un área interna
  que recibe el servicio.
- `co_clientes` es para recorridos con más de un cliente real (el que paga y el
  que usa). Usarlo poco: casi siempre son dos blueprints.
- `secciones` dice qué capas opcionales lleva este modelo. Se le pregunta a la
  persona antes de modelar y el `check` avisa si falta, si se usa una apagada o
  si una pedida quedó vacía. Las obligatorias (cliente, frontstage, backstage,
  soporte) no se apagan.
- `intencion` es obligatoria: qué quiere lograr el actor. Es lo que define el
  blueprint y lo que separa un recorrido de otro.
- `cadencia` en palabras: "una vez", "por pedido", "por turno", "continuo".
- `zoom_de: "BP2.m4"` declara un blueprint que detalla un momento de otro. Es la
  forma de hacer zoom sin partir el blueprint padre.
- `validacion` registra con quién se validó el modelo y qué cambió. Un
  blueprint sin validación es un borrador y se presenta como tal.
- `canales` es un catálogo opcional. Si una acción lleva `canal`, tiene que estar
  acá.
- `fuera_de_alcance[].fuentes` lista entrevistas leídas que no aportan al
  modelo, para que `check --corpus` no las reclame.

## BPn-slug.json

```json
{
  "spec": "pbp/1", "id": "BP1",
  "subtitulo": "Actor y escenario en una línea",
  "foco": "Para qué se mira este recorrido",
  "fases": [ { "id": "F1", "label": "" } ],
  "journey": [ "Una línea por cosa que hace o espera el cliente" ],
  "inicio": "m1",
  "momentos": [ ],
  "hallazgos": [ ],
  "fallas": [ { "momento": "m3", "senal": "Qué hace el cliente cuando falla: abandona, repite, llama, escala", "fuente": [] } ],
  "verdad": [ { "momento": "m4", "por_que": "", "fuente": [] } ],
  "preguntas": [ { "texto": "", "momento": "m3" } ]
}
```

### Momento

```json
{ "id": "m3", "label": "Diagnóstico", "fase": "F2", "tipo": "espera",
  "cliente":    { "texto": "Espera el diagnóstico sin saber cuándo llega", "fuente": ["E01"],
                  "pensamiento": { "texto": "Si no me llaman hoy, lo llevo a otro lado", "fuente": ["E01"] },
                  "emocion":     { "texto": "Inquieto, sin saber a quién preguntar", "fuente": ["E01"] } },
  "frontstage": [ { "actor": "recepcion", "texto": "", "fuente": [] } ],
  "backstage":  [ { "actor": "mecanico", "texto": "", "fuente": ["E04"] } ],
  "soporte":    [ { "actor": "proveedor", "texto": "", "inferencia": "base de la inferencia" } ],
  "evidencia":  [ { "texto": "", "fuente": [] } ],
  "sin_evidencia": "Razón, si hay contacto y no queda nada",
  "tiempo":     { "texto": "1 a 4 días", "fuente": ["DOC1"] },
  "sigue": "m4" }
```

- `tipo`: `accion` (por defecto), `espera`, `interno`, `decision` o `fin`.
  `interno` es un paso de la organización mientras el cliente sigue esperando:
  no lleva `cliente` y solo puede venir después de una espera o de otro
  interno.
- `sigue`: el momento siguiente. Uno solo. Si son varios, es una decisión.
- `sale: true` marca el momento con el que el blueprint entrega su resultado.
- `repite: true` en un momento que puede volver a ocurrir (un ciclo declarado).
- Cualquier elemento de una capa acepta `canal` y `unhappy: true` (camino no
  feliz).
- `ref: "BP2.m4"` en un elemento dice que su dueño es otro blueprint y este solo
  lo menciona. El `check` no lo cuenta como repetido.
- `cambio: ["O3"]` en un momento de un to-be dice qué oportunidades del as-is
  aplica. Solo en to-be.

### Decisión

```json
{ "id": "m5", "label": "Quién aprueba", "tipo": "decision",
  "decision": {
    "pregunta": "¿Lo paga el cliente o lo cubre el seguro?",
    "decide": "cliente", "criterio": "Si tiene póliza para ese daño",
    "ramas": [
      { "label": "Paga el cliente", "volumen": "", "va_a": "m6", "fuente": ["E01"] },
      { "label": "Lo cubre el seguro", "va_a": "m7", "fuente": ["E02"] }
    ] } }
```

### Hallazgo

```json
{ "id": "P1", "tipo": "dolor", "momento": "m3", "texto": "", "fuente": ["E01", "E03"] }
{ "id": "O1", "tipo": "oportunidad", "momento": "m3", "texto": "", "resuelve": ["P1"], "fuente": ["E03"] }
```

## Fuentes

`fuente` es una lista de ids declarados en `arquitectura.fuentes`. Se acepta un
sub id con guion o dos puntos si la base está declarada: `E13-D4`, `BI-H4`,
`MAIL:3`. `inferencia` es texto con la base de la inferencia. Uno de los dos es
obligatorio en cliente, capas, tiempo, ramas, hallazgos, momentos de la verdad,
cortes y sincronizaciones.

## Lo que revisa el check

| Regla | Qué mira | Nivel |
|---|---|---|
| A0 | Secciones opcionales declaradas, y uso coherente con lo declarado | aviso e info |
| A1 | Encuadre con pregunta y decisión; estado as-is o to-be | error |
| A2 | Cada blueprint con archivo, actor cliente, disparador, resultado y quién lo recibe | error |
| A3 | `viene_de` y `va_a` existen y son recíprocos | error y aviso |
| A4 | Segmentos declarados y cubiertos o fuera de alcance | error y aviso |
| A5 | Cadencia declarada; dos blueprints del mismo actor, cadencia, segmento y etapa sin sincronización | aviso |
| A6 | Sincronizaciones que apuntan a momentos que existen | error |
| A7 | Fuentes sin duplicar; con `--corpus`, entrevistas no usadas ni descartadas | error y aviso |
| A8 | `zoom_de` apunta a un momento que existe | error |
| A9 | Un to-be declara `deriva_de` y marca momentos con `cambio` | aviso |
| B0 | Journey en prosa presente | aviso |
| B1 | La acción del cliente la hace el actor principal | error |
| B2 | Una sola acción del cliente por momento; un solo `sigue` fuera de decisiones; internos solo después de una espera | error |
| B3 | Grafo: destinos válidos, todo alcanzable, sin callejones, sin ciclos no declarados, con salida | error |
| B4 | Decisión con pregunta, dos ramas o más, destinos distintos, quién y con qué criterio | error y aviso |
| B6 | Fuente o inferencia en todo; porcentaje de inferencia por capa | error, aviso e info |
| B7 | Fuentes citadas declaradas | error |
| B8 | Actor en frontstage, backstage y soporte, y declarado; canal declarado si se usa | error y aviso |
| B9 | Esperas sin nada detrás | info |
| B10 | Momentos con contacto sin evidencia ni `sin_evidencia` | aviso |
| B11 | Hallazgos anclados, con id, oportunidades con `resuelve` | error y aviso |
| B12 | Uno o más momentos de la verdad con porqué | aviso |
| B14 | Preguntas abiertas | aviso |
| B15 | Puntos de falla con momento, señal y fuente | error, aviso e info |
| X1 | La misma acción en dos blueprints sin `ref` | aviso |
| X2 | El mismo id de hallazgo con textos distintos | error |

`auditar` corre sobre `.bp.json` la parte de estas reglas que el formato `bp/2`
permite ver (B1, B2, B3, B4, B5, B11, A7, X1) más una propia: **B5**, ramas que
en el board lineal desembocan una en la otra.
