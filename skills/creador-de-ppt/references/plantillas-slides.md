# Catálogo de arquetipos

Cada método de `deck-kit.js` corresponde a un arquetipo. Elegir por **qué hace el
contenido**, no por cuántas cosas hay que poner.

Convenciones comunes a todos:

- `breadcrumb`: string o array. `['Contexto', 'Origen']` → `Contexto | **Origen**`.
- `notes`: string, va a las notas del orador.
- Texto enriquecido: donde dice "texto" se acepta un string o un array de partes:
  `['normal ', { t: 'resaltado', b: true }, ' y ', { t: 'en acento', c: C.accent }]`.
  Partes: `t` texto, `c` color, `b` bold, `i` itálica, `size` tamaño.
- `image`: `{ path: 'ruta.jpg' }` o `{ data: 'image/png;base64,...' }`. Si no se pasa,
  queda un bloque gris con la palabra "imagen": **eso no se entrega así**: o se
  consigue la imagen o se usa un arquetipo sin imagen.
- `illustration`: una ilustración propia (PNG o SVG), opcional, en los arquetipos de la lista de abajo.
  `{ path | data, size: 's' | 'm' | 'l', side: 'left' | 'right' }`. Sin `illustration`
  el slide queda exactamente igual; si el archivo no existe, se omite. Reglas y tamaños
  en `sistema-visual.md` § Ilustraciones.

## Arquetipos que aceptan spot

Lista para planificar las ilustraciones, si el deck las usa. El primer
tamaño es el default.

| Arquetipo | Tamaños | Lado | Dónde va | Spot que conviene |
|---|---|---|---|---|
| `cover` | `l`, `m` | derecha | parado sobre la banda negra; el logo sube arriba a la derecha | saluda, alegría |
| `finding` | `m`, `s`, `l` | derecha (mejor) o izquierda | columna propia bajo el filete, base en el final del contenido | la emoción del hallazgo |
| `statement` mint o paper | `m`, `l` | los dos | al costado, centrado en el alto del statement | sorpresa, duda, alivio |
| `stats` | `m`, `s` | los dos | al costado de la fila de cifras, base al final de las etiquetas | el que señala hacia las cifras |
| `bigStat` | `m`, `s` | dentro de la columna de la cifra | debajo de la bajada, base alineada con la tarjeta de la cita | sorpresa, frustración |
| `cards` | avatar fijo | arriba a la izquierda | en la tarjeta del actor (`card: i`), antes de la etiqueta | busto en círculo |
| `quotes` | `s`, `m` | izquierda (mejor) o derecha | columna propia, base al final de la cita (`quote: i`) | busto en círculo |
| `voice` | avatar fijo | | en el círculo del autor del posteo | busto en círculo |
| `steps` | `s` | dentro de la tarjeta | en el paso crítico (`step: i`), sobre su borde inferior | la emoción de ese paso |
| `stage` | `m`, `s` | derecha | a la derecha del diagnóstico, sobre la tarjeta del escenario deseado | la emoción de la etapa |
| `closing` | avatar fijo | | círculo mint en el lugar de la foto, solo sin foto | saluda |

No aceptan spot: `section`, `agenda`, `statement` ink, `journey` y
`painsOpportunities` (no hay lugar sin apretar el contenido), y los arquetipos densos de
relevamiento (`waves`, `scopeGrid`, `scenarios`, `scenario`, `breakdown`, `scale`,
`profiles`, `conclusions`, `matrix`, `tree`, `sources`). `textImage`, `caseStudy`,
`linkCard` y `annotatedScreen` usan una escena en su lugar de imagen, no un spot.

---

## `cover` | portada
Dos líneas de titular a tamaño enorme (la primera en acento, la segunda en negro) sobre
blanco, y una banda negra abajo con la descripción y los créditos.

```js
deck.cover({ titleTop, titleBottom, blurb, presenter, presenterLabel, date, dateLabel, logo, illustration })
```
Con `illustration`, un spot `l` (o `m`) a la derecha, parado sobre la banda negra; el
titular se angosta para dejarle lugar y el logo sube a la esquina superior derecha.
`presenter` acepta string o array (varias personas presentando). `logo` es
`{ path }` o `{ data }` y se ubica solo a la derecha del titular.
El tamaño del titular se calcula solo según la línea más larga. Partir el nombre en dos
líneas con sentido: marca arriba, tipo de entregable abajo. `presenter` y `date` se
omiten si no se saben, no inventarlos.

## `agenda` | índice
Panel negro a la izquierda con la palabra "Agenda", índice numerado `01.` a la derecha.

```js
deck.agenda({ title = 'Agenda', items: ['Contexto', 'Hallazgos', ...] })
```
Entre 4 y 8 ítems. Deben coincidir textualmente con los títulos de los divisores.

## `section` | divisor de sección
Negro a sangre. Número arriba, título gigante, subtemas en gris abajo.

```js
deck.section({ number: '01', title: 'Contexto', items: ['Origen', 'Problema', 'Objetivo'] })
```
Uno por sección, siempre. Es lo que da respiración al deck.

## `statement` | una idea sola
Para el momento en que hay que parar y decir una sola cosa.

```js
deck.statement({ theme: 'ink' | 'mint' | 'paper', eyebrow, text, support, breadcrumb, illustration })
```
`illustration` solo en `mint` y `paper` (en `ink` se ignora): spot `m` o `l` al costado,
centrado en el alto del texto.
- `ink`: fondo negro, barra de acento a la izquierda, `eyebrow` gris arriba. Para
  disclaimers, reglas de juego y afirmaciones fuertes.
- `mint`: fondo mint a sangre, texto negro grande, `support` opcional debajo. Para
  cerrar una sección con su conclusión.
- Máximo dos oraciones. Si necesita tres, no es un statement.

## `textImage` | explicación con imagen
Texto a la izquierda, foto a la derecha (o `imageSide: 'left'`). El título va en la
columna del texto y baja de 36 a 30 o 26 pt si es largo (más de 48 u 80 caracteres); el
cuerpo arranca debajo del alto real del título. Acepta una escena de ilustración como
`image`.

```js
deck.textImage({ breadcrumb, title, body: ['párrafo', ...], image, imageSide, source })
```
Dos o tres párrafos como máximo, con lo esencial en negrita.

## `cards` | comparación de perspectivas
Fila de 2 a 4 tarjetas, cada una con etiqueta versalita, titular y cuerpo.

```js
deck.cards({ breadcrumb, title, lede, cards: [{ eyebrow, title, body, dark }], source, illustration })
```
`illustration: { path, card: 0 }` pone un avatar (busto en círculo) en la tarjeta del actor cuyo
journey se analiza; todas las tarjetas bajan su contenido igual para que las etiquetas
queden alineadas. No va en tarjetas oscuras.
El uso canónico es "el mismo problema visto por cada actor". `dark: true` pone la
tarjeta en índigo profundo: reservarlo para la que concluye, y solo una por fila.
Igualar el largo de los textos: tarjetas de cuerpos muy dispares se ven rotas.

## `steps` | método o proceso
Tarjetas numeradas con filete de acento arriba. Para "cómo lo hicimos" o etapas.

```js
deck.steps({ breadcrumb, title, lede, steps: [{ number, title, body }], source, illustration })
```
`illustration: { path, step: 1, side }` pone un spot `s` dentro de la tarjeta del paso
crítico, apoyado en su borde inferior. Con 5 pasos el spot se achica al ancho de la
tarjeta.
3 a 5 pasos. `number` se autocompleta como `01`, `02`, …

## `stats` | fila de cifras
2 a 4 cifras grandes con su lectura debajo.

```js
deck.stats({ breadcrumb, title, lede, stats: [{ value, label, accent, size }], source, illustration })
```
Con `illustration`, un spot `s` o `m` al costado de la fila, mirando o señalando hacia
las cifras. La cifra en acento, la más lejana al spot.
`accent: true` en **una sola** cifra, la que importa. El `label` explica qué mide el
número; una cifra sin unidad ni fuente no va al deck.

## `bigStat` | el dato que cambia la conversación
Una cifra enorme en acento a la izquierda; a la derecha, la hipótesis previa, cómo la
desafía el dato y qué sigue sin resolverse. Cita opcional abajo.

```js
deck.bigStat({ breadcrumb, value, caption, body: [...], quote, author, source, illustration })
```
Con `illustration`, un spot `s` o `m` en la columna de la cifra, debajo de la bajada.
Uno por deck, como mucho dos. Pierde fuerza si se repite.

## `caseStudy` | ficha de benchmark
Tres columnas: imagen, tarjeta gris con descripción y "cómo funciona", tarjeta índigo
profundo con "qué nos enseña".

```js
deck.caseStudy({ breadcrumb, name, meta, image, description, howTitle, how, learnTitle, learn })
```
`meta` es un array que se muestra separado por puntos: `['Mercado', 'Categoría',
'Modelo', 'Tecnología']`. `how` son 3 a 5 bullets cortos. `learn` son 2 o 3 párrafos y
es lo más importante del slide: qué se transfiere a nuestro caso, incluyendo el riesgo
que el caso ya dejó a la vista. Un benchmark sin `learn` es una ficha de producto.

## `finding` | hallazgo
Título-afirmación grande, filete fino, y bloques etiquetados abajo.

```js
deck.finding({ breadcrumb, title, blocks: [{ label, text }], source, illustration })
```
Con `illustration`, el spot toma una columna bajo el filete y los bloques se angostan.
`m` por defecto; `l` cuando los bloques son cortos. Mejor del lado derecho, después de
la recomendación.
El par canónico es `Observación` / `Recomendación`: la observación dice qué se vio con
su evidencia y **no** propone nada; la recomendación propone algo acotado a lo que el
equipo controla. Un slide por hallazgo. El `breadcrumb` suele marcar el momento del
recorrido (`['Hallazgos', 'Antes']`, `'Durante'`, `'Después'`).

## `matrix` | matriz 2×2
Leyenda numerada a la izquierda, cuadrante punteado a la derecha, banda de lectura abajo.

```js
deck.matrix({ breadcrumb, title, legend: [{ title, note }], points: [{ n, x, y, highlight }],
              axisX: ['- Complejidad', '+ Complejidad'], axisY: ['+ Valor', '- Valor'], banner })
```
`x` e `y` van de 0 a 1 (`y: 1` es arriba). `highlight: true` en la opción recomendada,
una sola. El `banner` dice la conclusión en una línea: sin eso, la matriz es un dibujo.

## `flow` | flujos high level
Cadena horizontal de pasos con flechas. Uno o dos flujos por slide.

```js
deck.flow({ breadcrumb, title, lede, flows: [{ label, tag, steps: ['...'] }] })
```
`tag` va en índigo medio al lado del nombre (`'MVP recomendado'`). Hasta 7 pasos por fila;
más que eso se parte en dos filas. Pasos de 2 a 4 palabras: no son descripciones.

## `closing` | cierre
Negro, mensaje de cierre, foto circular opcional, nombre y rol.

```js
deck.closing({ text, name, role, photo, illustration })
```
Sin `photo`, `illustration` pone el spot dentro de un círculo mint en el lugar de la
foto: es el único slide negro que acepta ilustración.

## `blank` | escotilla de escape
Slide vacío con el fondo elegido y breadcrumb opcional, para algo que no encaja en
ningún arquetipo. Antes de usarlo, revisar si `statement` o `cards` resuelven el caso:
cada slide dibujado a mano es un slide que se va a ver distinto al resto.

```js
deck.blank({ background, breadcrumb })  // devuelve el slide de pptxgenjs
```


---

## `pillars` | ejes o pilares
2 a 4 columnas de texto con filete corto de acento arriba. Sin tarjeta: más liviano que
`cards`, para cuando los tres bloques son facetas de una misma idea y no comparación
entre actores.

```js
deck.pillars({ breadcrumb, title, lede, pillars: [{ title, body }], source })
```
Uso canónico: el desarrollo de un highlight (`breadcrumb: ['Highlights', '01']`), donde
el título es el eje, la bajada lo enuncia y las columnas lo desarman en consecuencias.

## `journey` | recorrido end-to-end
Bandas de momento arriba, etapas numeradas sobre una línea, y un contador opcional
debajo de cada etapa.

```js
deck.journey({ breadcrumb, title, footnote,
               moments: [{ label: 'Antes', span: 3 }, { label: 'Durante', span: 1 }],
               stages: [{ n: 1, name: 'Negociación', meta: '3/46 pain points' }] })
```
`span` es cuántas etapas cubre ese momento; la suma de los `span` tiene que dar el total
de etapas. Las bandas se pintan con tintes decrecientes del acento, así que el recorrido
se lee de claro a oscuro, para cualquier cantidad de momentos. Sirve también para la
línea de tiempo de un evento o el ciclo de vida de un cliente B2B. Repetir este slide como separador antes de cada etapa detallada
ayuda a no perder el mapa.

## `stage` | ficha de etapa
Número y nombre, diagnóstico, escenario deseado en tarjeta gris, y chips de actores y
herramientas.

```js
deck.stage({ breadcrumb, number, name, diagnosis, toBe, actors: [], tools: [], illustration })
```
Con `illustration`, un spot `m` o `s` a la derecha del diagnóstico, apoyado sobre la
tarjeta del escenario deseado.
El `diagnosis` dice qué pasa hoy y por qué; el `toBe` describe el escenario deseado sin
prometer solución técnica. Los chips de herramientas suelen ser la evidencia más elocuente
del problema (Mail, WhatsApp, Excel).

## `quotes` | voz textual
Una o dos citas grandes con barra de acento y atribución en versalita.

```js
deck.quotes({ breadcrumb, quotes: [{ text, author }], illustration })
```
`illustration: { path, size, side, quote: 0 }` pone un avatar (busto en círculo) en una columna
propia, con su base al final de esa cita. Mejor del lado izquierdo.
La cita va textual, sin corregir el registro. `author` es el rol o el equipo, no el nombre
propio, salvo que la persona haya aceptado aparecer identificada.

## `painsOpportunities` | dolores y oportunidades enfrentados
Dos columnas: a la izquierda los puntos de dolor con su criticidad, a la derecha las
oportunidades con sus etiquetas de clasificación.

```js
deck.painsOpportunities({ breadcrumb, number, name,
  pains: [{ text, level: 'Alta' }],
  opportunities: [{ text, tags: ['Producto', 'Automatización', 'Q2'] }] })
```
Hasta 4 filas por slide: más que eso hay que partirlo en dos, no achicar la tipografía.
Cada dolor debería tener enfrente su oportunidad, y las `tags` (tipo de solución, eje,
horizonte temporal) tienen que usar el mismo vocabulario en todo el deck.

## `linkCard` | anexo o material enlazado
Título a la izquierda con enlace subrayado, línea divisoria y miniatura del material a la
derecha.

```js
deck.linkCard({ breadcrumb, kicker: 'Anexo 1', title, linkText, url, image })
```
Para mandar el detalle largo (planillas, fichas de rol, mapeos) fuera del deck principal.
Si se pasa `url`, el texto queda clickeable en PowerPoint.

## `voice` | voz externa
Un posteo, reseña o mensaje real a la izquierda, como tarjeta, y la lectura a la derecha.

```js
deck.voice({ breadcrumb, post: { author, channel, text, meta }, takeaway, support: [], source, illustration })
```
`illustration` reemplaza el círculo gris del autor por un avatar (busto en círculo).
Sirve para validar el dolor con la voz de alguien de afuera antes de proponer. `author` es
un rol ("Usuaria de la app"), nunca un nombre, usuario de red ni foto real. Si el texto se
parafraseó, decirlo en `meta`. Una vez por deck, dos como mucho.

## `annotatedScreen` | misma pantalla, anotaciones que se suman
Captura a la izquierda con marcas numeradas y, a la derecha, qué funciona, qué genera
duda y qué se rompe.

```js
deck.annotatedScreen({ breadcrumb, title, image, frame: 'phone' | 'wide', labels: { ok, duda, mal },
  marks: [{ x: 0.5, y: 0.2, status: 'ok' | 'duda' | 'mal', text }] })
```
`frame: 'wide'` saca el marco de celular para capturas de escritorio, planos de un predio,
fotos de campo o documentos. `labels` cambia las tres lecturas cuando no es usabilidad
(`{ ok: 'Fluye', duda: 'Se demora', mal: 'Se traba' }` sobre un plano de accesos).
`x` e `y` van de 0 a 1 sobre la imagen. Para el efecto progresivo, repetir el slide con
la misma imagen sumando una o dos marcas por vez: la sala recorre la pantalla con
nosotros. Hasta 5 marcas.

## `tree` | árbol de oportunidades en cuatro columnas
Lo que medimos, lo que queremos lograr, problemas de la gente e ideas para probar.

```js
deck.tree({ breadcrumb, title, metric: { label, value, detail },
  outcome: { label, detail },
  opportunities: [{ text, evidence: 'idea' | 'una' | 'dos' | 'tres', priority, linked }],
  solutions: [{ of: 0, text }], evidenceLabels, priorityLabel, source })
```
`heads`, `evidenceLabels` y `priorityLabel` dejan usarlo como árbol de causas de un número
operativo o desglose de una meta en palancas, no solo como árbol de oportunidades.
El contenido sale de `arbol-de-oportunidades`. El borde dice cuánta evidencia tiene
cada problema (punteado: idea sin datos; lleno y gris: dos fuentes o más); la línea
punteada dice que todavía no sabemos si explica el resultado. Hasta 5 problemas y 6
ideas. En un discovery va dos veces: en la apertura sin ideas y en el cierre completo.

## `sources` | fuentes lado a lado
Qué dice cada fuente sobre el mismo hallazgo, y abajo cuánto aguanta junto.

```js
deck.sources({ breadcrumb, title, sources: [{ type, data, finding, period }],
  verdict: { level, text } })
```
Hasta 4 fuentes. `verdict.level` en palabras simples ("Lo muestran dos fuentes
distintas") y `verdict.text` con qué alcanza para decidir y qué falta. Es el slide que
hace visible la triangulación.

## Variante: tarjetas negras
`cards` acepta `fill` por tarjeta. `fill: '000000'` con etiqueta en acento es la variante
para próximos pasos o cierres de sección, y funciona bien en fila de tres. Una sola
variante por slide: o todas negras o todas grises.

---

## Otros usos de cada arquetipo

Cada arquetipo nació para un caso, pero se elige por lo que hace el contenido. Los
ejemplos de usos fuera del caso de origen están en la sección "Otros usos" de cada
componente del design system Deck Discovery.

## Arquetipos de relevamiento y propuesta

Para decks que mapean algo existente (un backoffice, un proceso, un catálogo de
servicios), deciden el alcance, recomiendan un camino entre varios y proponen cómo se
gobierna. Contenido y criterio en `creador-de-contenido`, cortes 6, 10 y 11 y
`references/recomendacion-y-alcance.md`. Ejemplo completo en
`scripts/ejemplo-relevamiento.js`.

## `scopeGrid` | alcance
Un cuadro por sección, pintado según qué se decidió con ella, y a la derecha el tamaño
del cambio.

```js
deck.scopeGrid({ breadcrumb, title, leftLabel, rightLabel,
  groups: [{ label: 'se migran', count: 20, style: 'solid', names }],
  stats: [{ value: '147', label: 'cambios identificados', accent }], takeaway, perRow: 12, source })
```
`style`: `solid` (negro) para lo que va, `muted` (gris) para lo que no va, `outline`
(punteado) para lo que queda a definir y `accent` para el grupo que se quiere mirar,
uno solo. `names` nombra las excepciones: lo que no se migra o queda a definir siempre
lleva nombre. La primera cifra va grande; `accent` en una sola, y no en la misma slide
que un grupo `accent`. Reemplaza veinte flujos del as is: el mapeo ya dice qué conviene.

## `scenarios` | escenarios lado a lado
2 a 4 caminos con su lógica y su secuencia, uno recomendado, y el porqué en una banda.

```js
deck.scenarios({ breadcrumb, title, lede, recommended: 0, recommendedLabel,
  scenarios: [{ tag, name, logic, steps: [] }], whyLabel, why, source })
```
`lede` dice lo que comparten todos los escenarios ("Los tres terminan igual: ..."):
achica la decisión a lo que de verdad cambia. `why` lleva el criterio, no un adjetivo.
Nunca sin `recommended`: si el contenido no trae una, se pregunta antes de maquetar.
Hasta 5 pasos por escenario.

## `scenario` | ficha de escenario
En qué consiste, pros, contras y el orden por etapas.

```js
deck.scenario({ breadcrumb, title, what, pros: [], cons: [],
  baseline: { label: 'Ola 0', name, text }, stages: [{ label, name, items: [] }], source })
```
Una por escenario, también para los no recomendados y con el mismo nivel de detalle. Las
contras van en la tarjeta negra: en la recomendada son las que hacen creíble la
recomendación. `baseline` es la etapa cero, lo que existe o tiene que estar antes de
arrancar. Hasta 5 etapas y 5 o 6 ítems cortos por etapa.

## `waves` | tablero por olas o niveles
El detalle de un escenario: qué entra en cada etapa, cuánto cambia y qué equipos lo usan.

```js
deck.waves({ breadcrumb, title, baseline: { label, name },
  columns: [{ label: 'Ola 1', name, note, items: [{ name, improve, add, teams: ['F'], status, divider }] }],
  teams: [{ code: 'F', name: 'Finanzas' }], focus, teamsLabel, improveLabel, addLabel, source })
```
- `improve` y `add` son dos contadores por ítem (gris y tinte del acento): mejoras y
  nuevos, dolores y oportunidades, abiertos y cerrados. `improveLabel` y `addLabel` los
  nombran en la leyenda; se puede usar uno solo.
- Sirve para cualquier plan por columnas: roadmap por trimestre, fases de un evento,
  dolores por etapa del journey.
- Los equipos van como inicial en círculo negro, nunca con un color por equipo: el
  sistema tiene un solo acento. `teams` arma la leyenda.
- `divider: true` dibuja una línea punteada antes del ítem, para subgrupos dentro de la
  ola. `status: 'definir'` lo deja con borde punteado: queda a definir.
- `note` es la nota al pie de la columna (un asterisco que explica una condición).
- **Construcción progresiva:** `focus: 0` muestra solo la primera columna y apaga el
  resto; repetir el slide subiendo `focus` hasta mostrar todas, como el
  `annotatedScreen`. La sala recorre el plan ola por ola.

Hasta 5 columnas y 6 ítems por columna. Más que eso, partir en dos slides.

## `breakdown` | desglose de un total
La cifra total a la izquierda y sus partes a la derecha.

```js
deck.breakdown({ breadcrumb, title, total: { value, label, body: [] },
  partsLabel, parts: [{ value, title, body }], perRow, note, source })
```
Para "de 1 rol que ve todo a 12 roles en 5 grupos", "31 secciones en 3 tipos", "38
roles hoy". Hasta 4 partes van en grilla; con 5 o más, una fila por parte. `note` es la
lectura en banda: el objetivo o la condición que el desglose habilita.

## `scale` | escala ordenada
Niveles de menos a más, con píldoras del tinte más claro al índigo profundo.

```js
deck.scale({ breadcrumb, title, lede, bodyLabel: 'Alcance:', levels: [{ name, lead, body }], source })
```
Niveles de permiso, de madurez, de servicio. El color dice el orden, no una
valoración: no pintar un nivel en rojo y otro en verde. 3 a 5 niveles.

## `profiles` | fichas de perfil
Grilla de hasta 3 x 2 tarjetas: qué rol, a cuántas secciones entra, cuáles y para qué.

```js
deck.profiles({ breadcrumb, title, cols: 3, profiles: [{ name, count, body, tag }], source })
```
`body` acepta texto enriquecido: en negrita las secciones que más usa. `tag` dice el tipo
de uso con el mismo vocabulario en todas las tarjetas. Más de 6 perfiles: dos slides.

## `conclusions` | conclusiones con decisiones
Dos columnas numeradas: a lo que llegamos y lo que tiene que decidir el otro equipo, más
un pedido en banda negra.

```js
deck.conclusions({ breadcrumb, title, done: { label, items: [] }, next: { label, items: [] }, ask, source })
```
La columna `next` se escribe como decisiones ("Si sigue el escenario recomendado o
prefiere otro"), nunca como tareas ni material para leer. `ask` es lo que necesitamos
para que el otro equipo avance bien, por ejemplo el espacio de Product Design antes de
diseñar. Hasta 5 ítems por columna.

## Arquetipos de síntesis

Para cerrar un discovery: qué se confirmó, cómo lo vive cada uno, por qué pasa y qué falta
saber. Todos llevan la base de evidencia a la vista (cuántas entrevistas, de quién) y
separan el conteo directo de lo inferido, como pide `references/certeza-y-muestras.md`.
Ejemplo completo en `scripts/ejemplo-sintesis.js`.

## `rainbow` | gráfico arcoíris
Cada entrevista contra cada hipótesis, agrupadas por perfil, con una columna de cierre.

```js
deck.rainbow({ breadcrumb, title, lede, groups: [{ name, color }], columns: [{ label, group }],
  rows: [{ id, label, values: ['C','R','M','S','N',''], result: 'distinta' | 'como' | 'abierta' }], source })
```
C confirma, R refuta, M matiza, S sin evidencia, N no se preguntó, vacío no aplica a ese
perfil. "No se preguntó" y "sin evidencia" no son lo mismo: el primero es un hueco de la
guía, el segundo una respuesta. Hasta 8 hipótesis y 16 entrevistas por slide.

## `emotionCurve` | curva emocional
Una línea por segmento a lo largo del recorrido, en tres bandas: funciona, fricción, dolor.

```js
deck.emotionCurve({ breadcrumb, title, stages: [], series: [{ name, color, values: [2, 1, null, 0] }],
  levels, levelNotes, reading, source })
```
`null` es una etapa sin dato: la línea la cruza punteada. No completar un hueco con lo que
"seguramente" pasa. `reading` es la lectura en una línea, no una descripción del gráfico.
Hasta 4 series y 7 etapas.

## `hypothesisBoard` | tablero de hipótesis
Una ficha por hipótesis coloreada por resultado, y tarjetas de resumen.

```js
deck.hypothesisBoard({ breadcrumb, title, hypotheses: [{ id, result }], summary: [{ value, label, body, highlight }], footnote })
```
Va antes del arcoíris cuando la audiencia no necesita el detalle por entrevista.

## `ecosystem` | ecosistema
El actor u objeto al centro, quienes lo tocan alrededor y un panel con cifras y una cita.

```js
deck.ecosystem({ breadcrumb, title, center: { label }, nodes: [{ name, note, body, highlight }],
  panel: { label, stats: [{ value, label, source }], footnote }, quote: { label, text, author } })
```
Hasta 6 nodos. Cada cifra del panel dice de dónde sale en `source`.

## `archetypes` | elenco
Una columna por arquetipo con su color, lo que lo define, los casos y la base.

```js
deck.archetypes({ breadcrumb, title, archetypes: [{ name, color, image, claim, examples, base }], footnote })
```
Hasta 4. `base` es el conteo ("3 de 6 socios"). Con pocas entrevistas, el pie lo dice: un
arquetipo con una sola persona detrás es una hipótesis. Ver la skill `arquetipos`.

## `perSegment` | cómo lo vive cada uno
El mismo problema leído por cada segmento, con su titular, su lectura y una o dos citas.

```js
deck.perSegment({ breadcrumb, title, segments: [{ name, color, who, image, headline, body, quotes: [{ text, author }] }], source })
```
Hasta 4 segmentos. Las citas van textuales y con su código de entrevista.

## `insight` | insight a sangre
El insight solo, a gran tamaño, con su sustento, la evidencia y dos llamados opcionales.

```js
deck.insight({ eyebrow, text, support, evidence, gap: { label, text }, clue: { label, text } })
```
`gap` es lo que falta medir para sostenerlo; `clue` una pista en datos que ya existen. El
alto del texto se ajusta solo: con más de 90 caracteres baja de tamaño. Si no entra en dos
líneas, probablemente son dos insights.

## `causalChain` | cadena causal
Tres o cuatro eslabones con flecha y una banda para lo que los cruza a todos.

```js
deck.causalChain({ breadcrumb, title, links: [{ label, title, body, evidence, tone: 'ink' | 'alert' | 'accent' | 'surface' }], band, bandLabel })
```
Cada eslabón lleva su evidencia. Un eslabón sin evidencia directa se marca `[INFERIDO]`.

## `unknowns` | lo que todavía no sabemos
Vacíos por etapa, cada uno con lo que lo cerraría.

```js
deck.unknowns({ breadcrumb, title, items: [{ stage, question, closes }], closesLabel, footer })
```
`closes` es una acción concreta y barata (un dato, una prueba, más entrevistas), no
"investigar más". Hasta 6 vacíos.

## Arquetipos de recomendación y anexo

Para pasar de lo que encontramos a lo que pedimos: qué tan firme es, quién es dueño de
qué, cómo se va a medir y qué hay que decidir. El anexo deja a la vista la muestra y las
citas. Mismo ejemplo: `scripts/ejemplo-sintesis.js`.

## `triangulation` | triangulación
Un hallazgo, las fuentes que lo miran y el nivel de certeza al que llega.

```js
deck.triangulation({ breadcrumb, title, finding, sources: [{ type, detail, says, agrees: 'si' | 'parcial' | 'no' }],
  level: 'hipotesis' | 'indicio' | 'patron' | 'solida', levelText, source })
```
La escala es la de `references/certeza-y-muestras.md`. `levelText` dice qué falta para
subir un nivel. Una fuente que contradice se muestra, no se saca. Hasta 4 fuentes.

## `comparisonStat` | cifra contra cifra
Dos números que juntos cuentan la tensión, y la lectura abajo.

```js
deck.comparisonStat({ breadcrumb, title, left: { value, label, source }, right: { value, label, source }, connector, reading })
```
Las dos cifras tienen que medir lo mismo sobre la misma base, o la comparación engaña.
Cada una lleva su fuente; una inferida se marca `[INFERIDO]`.

## `ownerCheck` | qué ya tiene dueño
Lo que surgió, en tres columnas: ya existe, reconocido sin dueño, afuera del alcance.

```js
deck.ownerCheck({ breadcrumb, title, lede, items: [{ name, status: 'existe' | 'reconocido' | 'afuera', body }], columns, source })
```
Evita proponer lo que otro equipo ya tiene en marcha. La columna del medio es la que
importa. `columns` permite cambiar nombres y notas. Hasta 6 ítems por columna.

## `ownershipMatrix` | matriz de responsabilidades
Actividades contra equipos, con el rol de cada uno. Por defecto RACI.

```js
deck.ownershipMatrix({ breadcrumb, title, lede, columns: [], rows: [{ label, cells: ['R', 'A', 'C', 'I', ''] }], keys, ownerCode, gapLabel, source })
```
La fila sin `ownerCode` (por defecto `A`) se marca "Sin dueño" sola. Si la organización
usa otro modelo, se pasa en `keys: [{ code, label, color }]`. Hasta 8 filas y 6 equipos.

## `keyResults` | resultados clave
Un objetivo y sus métricas con hoy, meta y fuente.

```js
deck.keyResults({ breadcrumb, title, objective, results: [{ metric, baseline, target, source }], headers, pendingLabel, footnote })
```
Sin `baseline`, la fila muestra "Pendiente de medir": nunca se inventa la línea de base.
Una meta que no está acordada se aclara en `footnote`. Hasta 5 resultados.

## `decisionAsk` | decisiones que pedimos
Una tarjeta por decisión: la pregunta, las opciones, la que recomendamos, por qué, quién
decide y para cuándo.

```js
deck.decisionAsk({ breadcrumb, title, lede, decisions: [{ question, options: [], recommended, why, owner, by }], labels, footnote })
```
Sin `owner` o `by` la tarjeta dice `[PENDIENTE]`: una decisión sin dueño ni fecha es la
primera cosa a resolver en la reunión. Hasta 3 decisiones; con más, el deck pide demasiado.

## `sampleTable` | tabla de muestra
Quiénes participaron, con totales arriba.

```js
deck.sampleTable({ breadcrumb, title, lede, totals: [{ value, label }], headers: [], rows: [[]], colW, source })
```
Sin nombres reales: códigos (`E1`) y atributos que importan para leer la muestra. Hasta
14 filas; con más, se parte en dos slides o se agrupa por perfil.

## `verbatimGrid` | verbatims
Grilla de citas textuales sobre un tema, con código y etiqueta de perfil.

```js
deck.verbatimGrid({ breadcrumb, title, lede, tags: [{ name, color }], quotes: [{ text, author, tag }], source })
```
Hasta 6 citas. Textuales, sin recortarlas para que digan más. Con 4 o menos se arma en
dos columnas.
