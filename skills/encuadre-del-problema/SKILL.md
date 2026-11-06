---
name: encuadre-del-problema
description: "Encuadra un pedido como problema antes de diseñar: lo reescribe en términos de actor, necesidad y consecuencia, detecta qué llegó decidido y qué ya existe, declara la certeza de cada afirmación, ordena los supuestos por riesgo y marca las respuestas débiles. Después de investigar, reencuadra con varias versiones del problema y el costo de cada una. Usar siempre que llegue un pedido, brief, idea de solución ('necesitamos una encuesta', 'hay que sumar un botón', 'queremos una app'), iniciativa nueva o kickoff, antes de armar una guía de entrevista, un blueprint, un journey, un discovery o un árbol de oportunidades, aunque no se nombre la palabra encuadre. También para revisar si un problema está bien planteado, qué estamos suponiendo o qué problema conviene resolver después de una investigación."
---

# Encuadre del problema

Casi todo pedido llega como una solución: "una encuesta", "un botón", "un mail". Esta skill lo reescribe como problema antes de diseñar, con 7 preguntas, y señala lo que está flojo. No bloquea el trabajo: encuadra rápido y deja escrito qué es dato, qué es hipótesis y qué falta.

Principios del paquete en `references/principios.md`. Escala de certeza y muestras en `references/certeza-y-muestras.md`.

## Cuándo usarla y cuándo no

- **Sí:** al llegar un pedido o una idea, antes de un kickoff, antes de mapear un servicio, antes de salir a investigar, y después de investigar para elegir qué problema resolver (modo reencuadre).
- **No:** para mapear actores (va `mapa-de-stakeholders`), para buscar los datos que sostienen el problema (va `evidencia`) ni para priorizar oportunidades (va `arbol-de-oportunidades`).

## Qué necesita para arrancar

El pedido tal como llegó. Con eso alcanza para el bloque A. Si hay `contexto.md`, leerlo.

Según cómo llega el pedido (principio P1):

- **Completo:** encuadrar sin preguntar.
- **Con huecos:** una sola pregunta, la más crítica. Casi siempre es la 1 (para quién) o la 3 (qué ya existe).
- **De alguien que arranca:** explicar en una línea qué es encuadrar ("antes de diseñar, nos aseguramos de estar resolviendo el problema correcto, para la persona correcta") y recorrer el bloque A con opciones: "¿quién sufre esto? ¿la persona que usa el servicio, la que lo opera o la que lo paga?".

## Térmica

| Si pasa esto | Saltar a |
|---|---|
| La pregunta 1 no tiene fuente y hay datos a mano | `evidencia`, para sostener el problema antes de seguir |
| La pregunta 4 o 5 nombra actores que nadie mapeó | `mapa-de-stakeholders` |
| Ya hay investigación y hay que elegir qué problema resolver | Modo reencuadre de esta misma skill |
| El encuadre está y se pide priorizar oportunidades | `arbol-de-oportunidades` |

Otras skills la llaman en su propio paso de encuadre y piden solo el bloque que necesitan:

| Skill | Cuándo | Bloque |
|---|---|---|
| `guia-de-entrevista` | Antes de escribir hipótesis | A y supuestos |
| `plan-de-observacion` | Antes de definir el foco | A |
| `sintesis-de-reuniones` | En un kickoff, para marcar lo que no se definió | A |
| `pensar-blueprints` | Antes de fijar el alcance | A y B |
| `arbol-de-oportunidades` | Para la métrica y el outcome | C |
| `creador-de-contenido` | Para probar el objetivo de un entregable | 1 y 6 |

En esos casos, devolver solo ese bloque, sin la plantilla completa.

## Principios del encuadre

- El pedido trae una solución. Antes de diseñar, se reescribe como problema y resultado esperado.
- Lo decidido no está tallado en piedra. Muchas decisiones se toman con poco contexto. Hay que saber qué llegó decidido, quién lo decidió y qué se puede reabrir.
- Se cuestiona también lo propio: plantillas, procesos y pedidos que escribió el mismo equipo.
- La pregunta no termina en el actor del pedido. Siempre se mira qué pasa después y a quién le llega.
- El dueño de la relación con la persona cambia según el momento del servicio. En un mismo recorrido puede ser la marca, un intermediario o un socio, y la persona puede no saber quién es quién.
- Influimos en la decisión, no la tomamos. Lo que nos da lugar es traer escenarios que nadie contempló, con evidencia.
- Además de cuantificar el dolor, se pregunta qué posibilidad abre la situación.

## Las 7 preguntas

### Bloque A | El pedido

| # | Pregunta | Qué saca a la superficie | Respuesta débil |
|---|---|---|---|
| 1 | ¿Qué problema resuelve esto, para quién, y qué lo sostiene hoy? | Si el pedido es un problema o una solución disfrazada. Se reescribe así: "[actor] no puede [lo que necesita] en [momento], y eso genera [consecuencia]" | Repite la solución con otras palabras, no nombra un actor concreto, nombra uno distinto del que tiene la necesidad, no declara su certeza, no lo puede resolver este equipo, o trae requisitos técnicos camuflados ("con IA", "en la app") |
| 2 | ¿Qué llegó decidido, quién lo decidió, con qué contexto y qué de eso se puede reabrir? | Decisiones heredadas, el contexto que les faltó y el margen real de cambio | "Ya está aprobado" sin saber por quién ni sobre qué base |

### Bloque B | El servicio

| # | Pregunta | Qué saca a la superficie | Respuesta débil |
|---|---|---|---|
| 3 | ¿Qué ya existe (proceso, medición, plantilla, componente, dato, investigación previa) y qué estamos dando por bueno, o por inexistente, sin haberlo mirado? | Supuestos sobre lo ya construido, en las dos direcciones | Nadie miró lo que existe antes de pedir algo nuevo |
| 4 | ¿Quién es dueño de la relación con la persona en este momento y qué marca ve? | Si el punto de contacto suma confianza o genera alerta | Se asume que la persona sabe con quién está tratando |
| 5 | ¿Qué pasa después? ¿Quién es el siguiente actor y qué le llega? | Lo que el pedido deja afuera: quién recibe el resultado y qué hace con eso | El diseño termina cuando la persona toca el botón |

### Bloque C | El resultado

| # | Pregunta | Qué saca a la superficie | Respuesta débil |
|---|---|---|---|
| 6 | ¿Qué cambio en la persona buscamos, cómo nos enteramos si ocurrió y cuál es la línea base? | El resultado y la fuente que lo va a medir | "Que esté conforme", sin métrica, fuente ni punto de partida |
| 7 | ¿Qué posibilidad abre esta situación? | Lo que se puede ganar además de lo que se arregla | Solo se lista lo que está roto |

## Cuánto encuadrar

- Pedido suelto, idea o carga de una iniciativa: bloque A.
- Antes de mapear el servicio (blueprint o journey): bloques A y B.
- Antes de salir a investigar, de un árbol de oportunidades o de un kickoff: las siete y los supuestos.

## Proceso

1. Leer todo el material disponible (mensaje, archivos, minutas, `contexto.md`). Responder con eso todo lo que se pueda. No preguntar lo que ya está escrito.
2. Reescribir el pedido como problema (pregunta 1). Si hay más de un actor posible, escribir una reescritura por actor y decir cuál tiene la necesidad.
3. Responder cada pregunta del bloque que corresponda con dato, fuente y certeza. Lo que no tiene fuente se escribe como hipótesis. Lo que no se sabe se escribe "sin dato".
4. **Pregunta 3 con material previo.** Si hay documentos, estudios o datos anteriores: listar qué afirma cada uno con fuente y fecha, separar lo establecido de lo sugerente (método flojo, muestra chica, de segunda mano o pasado de `UMBRAL_VIGENCIA`, con el motivo en una línea), marcar las contradicciones y cerrar con "lo que solo responde la investigación nueva". Si se buscó y no se encontró nada, escribir "nada encontrado": también es un resultado.
5. Revisar cada respuesta contra la columna "respuesta débil" y marcar las que fallan, en una línea cada una.
6. **Freno.** Si el pedido llegó como solución, mostrar el problema reescrito en una línea (actor, necesidad, consecuencia, certeza) y esperar el ok antes de seguir con el resto. Si llegó como problema o la persona pidió ir directo, seguir.
7. Cerrar con el alcance en tres listas y los supuestos ordenados.

### Supuestos ordenados

Juntar todo lo que el equipo cree y no sabe. Ordenarlo por dos ejes: qué se cae si es falso y qué certeza tiene. Arriba queda lo que mata el proyecto y tiene menos evidencia. Hasta 5, cada uno con:

- El supuesto escrito de forma que pueda resultar falso ("los socios cancelan por falta de horarios", no "a la gente le va a gustar").
- Si es falso: qué se cae, en una frase.
- La prueba más barata y honesta, con su esfuerzo aproximado. Una prueba que solo puede salir bien no es una prueba.

Qué no sube la certeza de un supuesto: ver `references/certeza-y-muestras.md`.

## Modo reencuadre

Después de investigar, el problema del encuadre inicial puede no ser el que conviene resolver. En este modo:

1. Leer lo que dejó la investigación (insights, corpus, árbol, arquetipos si existen).
2. Escribir de 3 a 5 versiones del problema, cada una con un actor concreto (un arquetipo o segmento, no "los usuarios"), una necesidad escrita como verbo y no como funcionalidad ("necesita estar seguro de que la reserva quedó hecha", nunca "necesita un mail de confirmación") y el insight que la sostiene.
3. Pasar cada versión por la columna "respuesta débil" de la pregunta 1.
4. Escribir el costo de cada una: qué vuelve importante, qué deja afuera y qué tan grande es el espacio de soluciones que abre.
5. Recomendar una con el motivo. **Freno:** elegir el problema es decisión del equipo.

## Formato de salida

```
Pedido tal como llegó:

A | El pedido
1. Problema: [actor] no puede [lo que necesita] en [momento], y eso genera [consecuencia]
   Qué lo sostiene: [fuente, período, número] | Certeza: hipótesis / indicio / patrón / evidencia sólida
2. Llegó decidido: [qué] | Quién: [quién] | Contexto: [con qué sabía] | Se puede reabrir: [qué]

B | El servicio
3. Ya existe: [qué] | Lo dábamos por bueno: [qué] | Lo dábamos por inexistente: [qué]
   Material previo: establecido [...] | sugerente [... y por qué] | contradicciones [...]
   Lo que solo responde la investigación nueva: [...]
4. Dueño de la relación: [quién] | Marca que ve la persona: [cuál]
5. Después: [siguiente actor] recibe [qué] y hace [qué]

C | El resultado
6. Cambio en la persona: [cuál] | Cómo nos enteramos: [métrica y fuente] | Línea base: [valor, período]
7. Posibilidad: [cuál]

Respuestas débiles: [pregunta y por qué, una línea cada una]

Alcance
- Adentro:
- Afuera:
- Intocables:

Supuestos ordenados
1. [supuesto] | Si es falso: [qué se cae] | Certeza: [...] | Prueba más barata: [...] ([esfuerzo])
```

Incluir solo los bloques que corresponden. Si la persona pide guardarlo, usar la convención de nombres de `contexto.md`. Si no hay, `Encuadre_{Iniciativa}_{AAAAMM}.md`.

## La regla que no se negocia

No hay solución en el problema. Si el pedido llega como solución, el encuadre dice qué tiene que cambiar para quién. La solución puede ganar después; no se saltea la competencia.

## Errores que existe para evitar

- Encuadrar para el actor equivocado: el que escribió el pedido no siempre es el que tiene la necesidad.
- Diseñar algo que ya existe porque nadie miró la pregunta 3.
- Usar como argumento un número del actor equivocado, o una diferencia que la muestra no sostiene.
- Dejar los supuestos como una lista sin orden: el primero tiene que ser el que más conviene probar.

## Referencias

- `references/caso-ficticio-encuesta.md`: un caso completo. Leerlo cuando haga falta un ejemplo o la persona pregunte cómo se aplica la skill.
- `references/principios.md` y `references/certeza-y-muestras.md`: principios y escala del paquete.
