# Momentos, decisiones y hallazgos

Dentro de un blueprint ya cortado, cómo se decide cada pieza. Un momento es una
unidad de intención del cliente, y lo que la organización hace mientras tanto
es todo lo que haga falta, sin tope.

## 1. Un momento

Un momento empieza cuando cambia lo que el cliente hace o espera:

- hace algo distinto que antes;
- pasa tiempo sin que haga nada: es una espera, y de las más valiosas;
- cambia quién lo atiende o el canal: casi siempre momento nuevo y casi siempre
  dolor;
- llega a un punto sin retorno: firma, paga, envía.

Cuando el cliente espera y la organización encadena tareas, cada tarea es su
propio momento de tipo `interno`, uno después del otro, debajo de la misma
espera. Así el orden y el tiempo de cada tarea quedan en el modelo y no se
pierden adentro de una lista. Las tareas que pasan a la vez, en cambio, van
juntas en el mismo momento. El patrón queda: una espera, varios internos, y el
momento donde el cliente vuelve a hacer algo.

Cada momento tiene **una sola** acción o espera del cliente (`cliente` es un
objeto, no una lista). Si aparecen dos:

- si una sigue a la otra, son dos momentos;
- si pasan a la vez con la misma intención, se escriben como una acción;
- si pasan a la vez con intenciones distintas, son dos journeys: volver a la
  arquitectura.

## 2. Esperas

Una espera es un momento de tipo `espera` donde el cliente no hace nada. Se
detectan por el salto en el relato: "mandé el mail y a la semana me llamaron"
tiene una semana de espera que nadie narró.

Toda espera lleva lo que pasa detrás. Una espera con backstage vacío es una de
dos cosas, y hay que decir cuál: nadie está haciendo nada (el dolor más caro) o
nadie relevó qué pasa (una pregunta). El `check` lo marca.

## 3. Decisión, variante o blueprint

La pregunta es **qué cambia después**.

| Si después de la bifurcación | Es |
|---|---|
| No cambia ningún momento siguiente | Variante. Nota en el momento, no decisión |
| Cambia uno o varios momentos y después se vuelve al mismo camino | Decisión con ramas que reconvergen |
| Cambia el final del recorrido | Decisión con ramas que terminan en salidas distintas |
| Cambia más de un tercio, o el actor, o la cadencia | Otro blueprint |

Una decisión completa tiene:

- `pregunta`: lo que se decide, en palabras del negocio;
- `decide`: quién decide. Si decide el cliente, el momento es suyo; si decide la
  organización, el cliente casi siempre está esperando y no lo sabe;
- `criterio`: con qué se decide. "A criterio de la ejecutiva" es un criterio, y
  suele ser el hallazgo;
- `ramas`, cada una con `va_a` y fuente. `volumen` si el material lo dice.

Toda rama llega a un momento o a una salida (`sale: true` o tipo `fin`). Una
rama sin destino es un recorrido que se corta sin que nadie lo decida, que es
justo lo que hay que mirar. Si el final es "deja de responder", eso es un
momento de tipo `fin` con su label, no un hueco.

## 4. Puntos de falla y momentos de la verdad

Son dos cosas distintas y las dos van declaradas.

Un **punto de falla** (Shostack) es un momento donde el servicio se rompe, no
donde molesta. Se reconoce por lo que hace el cliente: abandona, repite el paso,
llama para destrabar, escala. Va en `fallas` con el momento, esa señal y la
fuente. Entre todos los dolores de un blueprint, los puntos de falla son los
que producen decisiones en el taller, así que tienen que estar separados del
resto.

Las **esperas** (los wait points de Shostack) ya son momentos de tipo `espera`
y no hace falta marcarlas aparte.

### Momentos de la verdad

Uno o dos por blueprint: donde se define si el cliente confía, vuelve o se va.
Casi siempre el primer contacto real, el momento de pagar o cobrar, el error y el
cierre. Van en `verdad` con el momento, el porqué y la fuente. Si no se puede
decir por qué con una fuente, es una opinión y no va.

## 5. Capas y las tres líneas

Las capas del modelo son los carriles clásicos de Shostack y Bitner, y lo que
las separa son las tres líneas del blueprint. La pregunta de ubicación es
siempre sobre la línea, no sobre el puesto de quien lo hace:

- **Línea de interacción**, entre `cliente` y `frontstage`: ¿lo hace el cliente
  o lo hace la organización con el cliente delante?
- **Línea de visibilidad**, entre `frontstage` y `backstage`: ¿el cliente lo ve?
- **Línea de interacción interna**, entre `backstage` y `soporte`: ¿empieza por
  este caso o ya venía pasando?

Para cada momento:

| Capa | Pregunta | Regla |
|---|---|---|
| `cliente` | ¿Qué hace o espera? | Con sus palabras. Nunca lo que hace el sistema |
| `frontstage` | ¿Quién de la organización está delante y qué hace? | Siempre con actor. Una persona o un sistema que responde |
| `backstage` | ¿Qué pasa detrás para que eso sea posible? | Siempre con actor. Empieza por este caso |
| `soporte` | ¿Qué tuvo que existir antes? | Siempre con actor. Ya venía pasando, no arranca por este caso |
| `evidencia` | ¿Qué ve o se lleva el cliente? | Una cosa, no una acción. Si no hay nada en un momento con contacto, `sin_evidencia` con la razón |

Lo que ubica una acción es si el cliente la ve, no quién la hace. El mismo actor
puede estar en frontstage y en backstage.

Una acción es una acción. Si tiene "y" entre dos verbos y pasan una después de la
otra, son dos acciones en la misma capa, en orden. La explicación de una acción
no es parte de la acción: es una nota.

## 6. Hallazgos con fuente

No hay tope de hallazgos por momento: el filtro es que cada uno tenga fuente y
esté en el momento que lo genera. Tres preguntas ayudan a decidir si va en el
modelo o solo en el registro:

1. ¿Cambia una decisión de rediseño? Si no, va al registro y no al modelo.
2. ¿Está en el momento que lo genera? Un dolor que no se puede anclar a un
   momento es un insight transversal y va a `NOTAS.md` o a la arquitectura.
3. ¿Tiene fuente? Si es inferencia, se marca, y no se presenta como hallazgo
   hasta validarlo.

Tipos: `dolor`, `oportunidad`, `nota`, `cita`, `dato`, `pregunta`.

- Dolor y oportunidad llevan `id` del registro. El registro numera, el modelo
  referencia.
- Cada oportunidad dice qué dolores resuelve en `resuelve`.
- Citas textuales, sin nombre propio, con la fuente.
- Datos con unidad y con la diferencia entre medido y estimado.

Un blueprint sin preguntas abiertas casi siempre está rellenando lo que no se
sabía. Las preguntas son la agenda del próximo taller o de la próxima salida a
campo.

## 7. Secciones opcionales

Antes de modelar se le pregunta a la persona qué secciones quiere, y la
respuesta va en `arquitectura.secciones`. Las obligatorias son las cuatro capas
de acción. Las opcionales:

| Sección | Dónde va | Qué pide |
|---|---|---|
| `pensamiento` | `cliente.pensamiento` | Lo que el cliente se dice en ese momento, con sus palabras y fuente |
| `emocion` | `cliente.emocion` | Cómo se siente, en una o dos palabras y con la cita o la observación que lo sostiene |
| `tiempo` | `momento.tiempo` | Duración en rango con unidad |
| `evidencia` | `momento.evidencia` | Lo que el cliente ve o se lleva |
| `canales` | `canal` en cualquier acción | Por dónde pasa la acción |
| `metricas` | hallazgos `dato` | Números medidos o estimados |
| `regulaciones` | hallazgos `regulacion` | Lo que no se puede cambiar y por qué |

Emoción y pensamiento vienen del journey map y son capas plenas del modelo
cuando se piden: dicen qué vive el cliente en cada momento y explican por qué un
punto de falla duele o un momento de la verdad decide. Entran con la misma regla
que todo lo demás: fuente o inferencia. Una emoción sin cita ni observación es
una suposición y no va.

## 8. Tiempo y métricas

`tiempo` en el momento, en rango con unidad y con fuente, cuando la duración es
parte del problema. El salto de escala entre momentos (de minutos a semanas) es
en sí mismo un hallazgo. Las métricas van como `dato` en el momento que miden.
Si no hay número, una pregunta que diga qué habría que medir vale más que un
número inventado.
