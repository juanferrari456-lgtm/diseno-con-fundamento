---
name: "pensar-blueprints"
description: "Piensa los service blueprints sin ningún formato de destino: lee toda la evidencia de la carpeta del proyecto (fichas, corpus.json, tablero de campo, registro de dolores, hojas de observación, datos, documentos), decide cuántos blueprints hacen falta y dónde se corta cada uno, y arma un modelo trazable por blueprint, sin formato de dibujo, donde cada acción y cada hallazgo tiene fuente, cada blueprint tiene un solo journey, las decisiones deciden algo y los blueprints no se pisan y se pasan la posta. Usar siempre antes de dibujar un blueprint, y cuando pidan armar, repensar, revisar o auditar blueprints, mapear un servicio de punta a punta, pasar un discovery o un lote de entrevistas a blueprints, decidir cuántos blueprints hacen falta, actualizar blueprints con entrevistas nuevas, o cuando un blueprint existente se siente flojo, repetido o sin fundamento, aunque no nombren la palabra modelo."
---

# Pensar los blueprints

Un blueprint de valor se decide en el pensamiento, no en el dibujo. Cuántos
recorridos hay, dónde empieza y termina cada uno, quién es el cliente de cada
uno, qué cambia según el segmento, qué pasa en paralelo, qué siente y piensa el
cliente, y de qué fuente sale cada cosa. Si eso se piensa adentro de un formato,
el formato decide por vos: se corta un blueprint porque no entra, se pega otro
porque quedaba corto, una decisión se dibuja aunque todas sus ramas vayan al
mismo lugar, y la fuente queda afuera del archivo.

Esta skill hace el pensamiento y deja un **modelo**: una carpeta con
`arquitectura.json`, un archivo por blueprint y un `.md` legible de cada uno.
El modelo es un grafo de momentos con fuente en cada elemento, y no responde a
ningún formato de destino: ni columnas, ni topes, ni carriles fijos, ni campos
que falten en otro lado. Mientras se piensa, no se piensa en cómo se va a
dibujar. Las skills de representación se adaptan al modelo, nunca al revés.

```bash
M=<carpeta de esta skill>/scripts/modelo.js
node $M check    <carpeta> [--corpus corpus.json]   # el pensamiento, no la forma
node $M render   <carpeta>                          # ARQUITECTURA.md y un .md por blueprint
node $M auditar  *.bp.json [--corpus corpus.json]   # revisa blueprints bp/2 que ya existen
```

## Cuándo usarla y cuándo no

- **Sí:** antes de dibujar cualquier blueprint o journey, para decidir cuántos hacen falta, para revisar o auditar blueprints existentes y para actualizarlos con evidencia nueva.
- **No:** para dibujar (el modelo se suelta en el plugin de FigJam, o va `service-blueprint-json` si hace falta un `.bp.json` a mano) ni para un process map interno de un área.

## Qué necesita para arrancar

Evidencia en una carpeta: fichas, corpus, tablero, observaciones, datos o documentos. Cuanta más, mejor; con poca, el modelo sale como hipótesis y lo dice.

Según cómo llega el pedido (principio P1, en `references/principios.md`):

- **Completo:** seguir el proceso con sus tres frenos.
- **Con huecos:** si no hay encuadre, hacer el bloque A y B primero. Si falta saber qué secciones opcionales lleva, preguntarlo en el freno del encuadre.
- **De alguien que arranca:** explicar en una línea qué es un blueprint ("el recorrido de la persona, con lo que pasa adelante y detrás del mostrador para que funcione") y por qué se piensa antes de dibujar.

## Térmica

| Si pasa esto | Saltar a |
|---|---|
| El pedido no está encuadrado | `encuadre-del-problema`, bloques A y B |
| Hay entrevistas sin procesar | `sintesis-de-entrevistas` |
| El carril del cliente es mayoría inferencia | `guia-de-entrevista` o `plan-de-observacion` para salir a campo |
| No están claros los segmentos | `arquetipos` o `muestra-y-reclutamiento` |
| El modelo está y hay que dibujarlo | Plugin de FigJam "Blueprint from .json", que lee la carpeta directo. `service-blueprint-json` solo si hace falta un `.bp.json` a mano |
| Hay que priorizar los dolores | `arbol-de-oportunidades` |

## Reglas de escritura

- Sin punto medio ni raya larga en ningún texto, ni en el modelo ni en la
  entrega. Usar "|", "-" o comas.
- Acciones en presente y tercera persona, con el sujeto en `actor`.
- En el cliente, las palabras del cliente. En la organización, las de quien lo hace.
- Lo que nadie dijo va con `inferencia` y su base. Nunca sin marca.

## Las cinco condiciones de un modelo pensado

Son las que el `check` hace cumplir. Las demás reglas de esta skill existen para
llegar a estas cinco.

1. **Trazable.** Cada acción, rama, tiempo, sincronización y hallazgo lleva
   `fuente` con ids declarados en la arquitectura, o `inferencia` con la base.
   Si el carril del cliente es mayoría inferencia, el blueprint es una hipótesis
   y se presenta como tal.
2. **Un journey por blueprint.** Un actor principal, una intención, una sola
   secuencia del cliente. Si el cliente hace dos cosas a la vez con intenciones
   distintas, son dos blueprints que se sincronizan, no dos tarjetas en el mismo
   momento.
3. **Decisiones que deciden.** Una decisión tiene pregunta, quién decide, con
   qué criterio y ramas que van a lugares distintos. Si todas las ramas llegan
   al mismo momento, es una variante y va como nota. Toda rama termina en un
   momento o en una salida.
4. **No se pisan.** Cada momento y cada acción tiene un solo blueprint dueño.
   Si otro lo necesita, lo referencia con `ref`. Un mismo id de dolor dice lo
   mismo en todos lados.
5. **Se pasan la posta.** Cada blueprint declara qué lo dispara, qué resultado
   deja y quién lo recibe. La salida de uno es la entrada de otro o es el final
   declarado. Los recorridos paralelos declaran dónde se esperan o se
   desbloquean.

## Proceso

Hay tres frenos donde se espera el ok de la persona: el encuadre si no vino
dado, la arquitectura y el journey de cada blueprint. Son las decisiones caras
de revertir. Entre frenos, no se pide permiso.

### 1 | Leer toda la evidencia

Antes de pensar un solo momento, inventariar la carpeta del proyecto entera
(los archivos del proyecto de Claude, la carpeta conectada o la que indique la persona). No leer todo de
punta a punta: clasificar y abrir lo justo.

- **Fichas y corpus.** Si hay `corpus.json`, usar el motor de
  `sintesis-de-entrevistas` (`corpus.js query --top`, `--perfil`, `--buscar`,
  `--vacios`, `--datos`) y abrir solo la sección 02 (flujo as-is) de las fichas.
- **Tablero de campo** de `sintesis-de-campo`: segmentos, veredictos de
  hipótesis, contraste con blueprints anteriores y dolores nuevos desde el
  cliente.
- **Registro de dolores y oportunidades**, que es quien numera P y O.
- **Hojas de observación** de `plan-de-observacion`: lo que pasó por momento y
  por puesto, frontstage y backstage, con su hora.
- **Arquetipos** de `arquetipos`, si existen: son la mejor base para los segmentos.
- **Datos** (`evidencia`), dashboards, correos, contratos, matrices de permisos,
  propuestas comerciales.
- **Blueprints anteriores**, como evidencia a contrastar, nunca como molde.
  Pasarlos por `auditar` antes de reusar nada.

Cada fuente se declara en `arquitectura.json` con su perspectiva (cliente,
frontstage, backstage, soporte, negocio) y el segmento que cubre. Las
perspectivas vacías van a `huecos`. `check --corpus` avisa qué entrevistas del
corpus el modelo no usa.

`references/evidencia.md` tiene cómo leer cada tipo de fuente, los niveles de
certeza y qué hacer con las contradicciones.

### 2 | Encuadrar y elegir las secciones

Qué pregunta responden los blueprints y qué decisión habilitan. Si el pedido no
viene encuadrado, pasarlo por `encuadre-del-problema` (bloques A y B). Va en
`arquitectura.encuadre`. Un modelo sin decisión que habilitar se discute para
siempre.

En el mismo freno, **preguntar qué secciones opcionales lleva el blueprint**:
pensamientos y emoción del cliente, tiempo, evidencia, canales, métricas,
regulaciones. Las cuatro capas de acción (cliente, frontstage, backstage,
soporte) van siempre. La respuesta va en `arquitectura.secciones` y el `check`
avisa si una sección pedida quedó vacía o si se usa una que no se pidió. Si la
persona ya lo dijo en el pedido, no se vuelve a preguntar.

### 3 | Arquitectura: cuántos blueprints y dónde se corta cada uno

Es donde más valor se pierde.

1. **El ciclo de la relación** de punta a punta, en etapas de negocio (llegar,
   acordar, operar, cobrar, continuar), sin pensar todavía en blueprints.
2. **Los segmentos** que cambian el recorrido, con el criterio que los separa.
   Salen del campo, no del organigrama.
3. **Los cortes.** Un blueprint es un actor con una intención, desde un
   disparador hasta un resultado que recibe alguien. La intención se escribe en
   `intencion` y es obligatoria. Cuando un momento merece detalle propio, se abre
   un blueprint hijo con `zoom_de`, no se parte el padre. Se corta cuando cambia el
   actor, cuando cambia la intención, cuando cambia la cadencia (una vez, por
   pedido, continuo) o cuando un segmento cambia más de un tercio del recorrido.
   **Nunca se corta por largo ni por cómo se va a ver.** El largo de un
   recorrido es el que tiene.
4. **Traspasos y paralelos.** Entrada y salida de cada blueprint, y las
   sincronizaciones entre los que corren a la vez.
5. **Fuera de alcance**, con el porqué, y por cada corte la alternativa que se
   descartó. Un segmento que no tiene blueprint y no
   está declarado afuera es un hueco que alguien va a encontrar en la reunión.

**Freno.** Mostrar la arquitectura como tabla (blueprint, actor, segmentos,
cadencia, entra cuando, sale con, va a) más los cortes con su fundamento, y
esperar el ok. Corregir la arquitectura después es rehacer todo.

`references/arquitectura.md` tiene los tests de corte, la regla del tercio
aplicada a segmentos, cómo declarar un paralelo y los antipatrones que salieron
de auditar blueprints reales.

### 4 | Journey por blueprint

Para cada blueprint, la secuencia del cliente en prosa, una línea por cosa que
hace o espera, agrupada en fases con nombres de negocio. Una línea por cosa que hace o espera
el cliente. Marcar dónde bifurca y por qué.

**Freno.** Mostrarlo y esperar el ok antes de bajar a capas. Si la arquitectura
tiene varios blueprints, mostrar los journeys juntos: así se ve si dos cuentan lo
mismo.

### 5 | Bajar capas y hallazgos

Por cada momento, en este orden: qué hace o espera el cliente, quién de la
organización está delante, qué pasa detrás, qué tuvo que existir antes, qué ve
o se lleva el cliente, más las secciones que se pidieron. Cada elemento con
fuente. Lo que no se sabe no se rellena: queda vacío y se anota la pregunta.

Cada paso es su propio momento. Cuando el cliente espera y la organización
encadena tareas, cada tarea es un momento `interno` debajo de esa espera, en
orden, y no una lista adentro de un solo momento.

Cada dolor va al momento que lo genera, con id del registro, y cada oportunidad
dice qué dolor resuelve. No hay tope de hallazgos por momento: el filtro es la
fuente y el momento. Aparte de los dolores, se declaran los
**puntos de falla** (dónde el servicio se rompe y qué hace el cliente cuando
pasa) y uno o dos **momentos de la verdad**, con el porqué.

`references/momentos.md` tiene cómo se decide un momento, una espera, una
decisión frente a una variante, los momentos de la verdad y el filtro de
hallazgos. `references/modelo.md` tiene el formato campo por campo.

### 6 | Chequear, renderizar y pasar la posta

```bash
node $M check <carpeta> --corpus corpus.json
node $M render <carpeta>
```

Sin errores no hay entrega. Los avisos se corrigen o se explican en la entrega.
`render` escribe `ARQUITECTURA.md` y un `.md` por blueprint con la fuente al
lado de cada línea: es lo que se lee, se comparte y se sube al repo.

**Validar con quien presta el servicio.** El modelo armado desde evidencia es
una hipótesis hasta que lo vio alguien que opera. Los `.md` son el material para
esa validación, y lo que cambia queda en `validacion` del blueprint. Un
blueprint sin validación se presenta como borrador.

Después, según lo que se pida:

- **Registro de dolores:** los P y O nuevos entran primero al registro, que es
  quien numera, y después al modelo.
- **Árbol de oportunidades:** `arbol-de-oportunidades` toma los dolores con
  su momento y su fuente.
- **Deck o readout:** `creador-de-contenido` toma `ARQUITECTURA.md` y los
  momentos de la verdad.
- **Representación visual:** se sueltan `arquitectura.json` y los archivos de
  cada blueprint juntos en el plugin de FigJam "Blueprint from .json", que lee
  `pbp/1` directo y dibuja la portada y un board por blueprint. El plugin se
  adapta al modelo, nunca al revés.

`references/conexiones.md` tiene el mapa completo de skills, quién numera cada
id y qué no tiene que rehacer cada una.

## To-be

El to-be es otra carpeta, con `estado: "to-be"` y `deriva_de` apuntando al
as-is. Se construye a partir de las oportunidades del as-is: cada momento nuevo
o modificado lleva `cambio` con los ids de oportunidad que aplica, y conserva
los ids de momento del as-is cuando el momento es el mismo, para poder ponerlos
al lado. Lo que no cambia se copia con su fuente. Lo nuevo lleva `inferencia`
con la base, porque todavía no pasó, o la fuente del prototipo o del taller
donde se decidió.

## Auditar blueprints que ya existen

Cuando pidan revisar blueprints hechos, o antes de reusarlos:

```bash
node $M auditar *.bp.json --corpus corpus.json
```

Detecta decisiones que no deciden, ramas que el formato lineal mezcla,
blueprints que arrancan con una decisión huérfana, dos acciones del cliente en
un paso, acciones repetidas entre archivos, hallazgos sin tarjeta y entrevistas
del corpus que el blueprint no cita. Lo que encuentra no se arregla tocando el
`.bp.json`: se vuelve al paso 3 y se rearma la arquitectura.

## Actualizar con evidencia nueva

Cuando entra una entrevista o un dato nuevo, no se rehace el modelo. Se declara
la fuente, se mira qué momentos toca (`corpus.js query --perfil`, el contraste
del tablero), y se cambia solo eso: una acción confirmada suma fuente, una
contradicha cambia y deja nota, un segmento nuevo pasa por los tests de corte.
Si cambia la arquitectura, vuelve el freno del paso 3. Correr `check` y
`render` y decir en la entrega qué cambió y por qué.

## Entrega

Los archivos del modelo en la carpeta de trabajo, más un resumen corto:

- cuántos blueprints, el porqué del corte y la cadena de traspasos;
- qué segmentos quedan afuera;
- cuánto de cada carril del cliente es inferencia;
- los momentos de la verdad;
- los avisos de `check` que quedaron y su explicación;
- las preguntas abiertas, que son la agenda del próximo taller o de la próxima
  salida a campo.

## La regla que no se negocia

El modelo no se acomoda al formato de dibujo. Un blueprint no se corta por largo ni se pega por corto, y una etapa que no se investigó se marca como "no investigada", no se completa con un recorrido plausible. Donde las personas vivieron cosas distintas, el modelo muestra la bifurcación, no un promedio.

## Errores que existe para evitar

- Cortar un blueprint porque no entra en el formato.
- Una decisión con ramas que llegan todas al mismo lugar.
- El mismo tramo contado en tres blueprints.
- Un carril del cliente escrito desde entrevistas internas y presentado como si viniera del cliente.
- Oportunidades escritas como soluciones: van como oportunidad del dolor que resuelven.
- Presentar como final un blueprint que nadie que opera el servicio validó.

## Referencias

- `references/arquitectura.md`: ciclo, segmentos, tests de corte, paralelos,
  traspasos y antipatrones. Leer siempre en el paso 3.
- `references/evidencia.md`: inventario de la carpeta, certeza, inferencia,
  contradicciones y huecos. Leer en el paso 1.
- `references/momentos.md`: momentos, esperas, decisiones, momentos de la verdad
  y síntesis de hallazgos. Leer en el paso 5.
- `references/modelo.md`: el formato de los archivos, campo por campo, y lo que
  revisa cada regla del `check`.
- `references/conexiones.md`: las otras skills y quién numera qué.
- `assets/ejemplo/`: un modelo completo de un taller mecánico con tres
  blueprints, una decisión que reconverge, un journey paralelo sincronizado,
  puntos de falla y una validación registrada.
  Copiar la estructura, no el contenido.
