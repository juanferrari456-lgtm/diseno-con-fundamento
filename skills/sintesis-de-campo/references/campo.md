# Campo con guía de hipótesis

La ficha 01 a 10 es la de `sintesis-de-entrevistas` y no cambia. Esta skill
suma filas a la tabla de inicio y una sección 11. `corpus.js` la ignora y
`campo.js` la lee para armar `TABLERO.md`.

## Tabla de inicio

Debajo de Organización:

```markdown
| Cliente | [nombre de la organización entrevistada] |
| Segmento | [letra y nombre, como en la guía: "A Reserva seguido"] |
| Vínculo | [condición del vínculo, como en la guía] |
| Rol en la guía | [el rol real: quien usa, quien decide, quien opera, otro] |
| Sesgo | [solo si la guía lo pide: negociación abierta, vínculo societario] |
```

Dos personas de una misma organización (por ejemplo, quien opera y quien decide)
llevan códigos E propios y el mismo valor en Cliente: así `campo.js` los cruza en
espejos.

## Sección 11

```markdown
## 11. Contraste con la guía

### Hipótesis
| H | Veredicto | Preguntas | Evidencia |
|---|---|---|---|
| H1 | Confirma | 5.1 | [E22] "cita corta" |

### Blueprint
| P | Relación | Dolor | Nota |
|---|---|---|---|
| P53 | Confirma | E22-D3 | [opcional, menos de 90 caracteres] |
| nuevo | Nuevo | E22-D5 | [qué dolor es, como sticky] |

### Espejos
| Tema | Lectura |
|---|---|
| Problemas | [qué dice este rol y cómo choca con el otro, con su código] |

### Fuera de la guía
- [tema que apareció solo y no tiene hipótesis]

### Puntas
- [dato útil para otra iniciativa, con el prefijo que use la guía]
```

Subsecciones vacías se omiten, salvo Hipótesis, que va siempre.

## Reglas

**Hipótesis.** Una fila por cada hipótesis de "esta ronda", aunque no se haya
tocado. Las que el ajuste por segmento asigna al segmento del entrevistado no
pueden ir como No aplica. Las pendientes solo si aparecieron solas, con "espontáneo" en Preguntas.

| Veredicto | Cuándo |
|---|---|
| Confirma | Lo dicho cumple el criterio "Confirma si" de la guía |
| Refuta | Cumple el criterio "Refuta si" |
| Matiza | Parte sí y parte no, o se cumple con una condición. La condición va en la nota de 10 |
| Sin evidencia | Se preguntó y la respuesta no permite decidir |
| No preguntada | No se llegó a preguntar |
| No aplica | La guía la excluye para este segmento o rol |

- El veredicto se decide contra el criterio de la guía, no contra la lectura propia.
  Si la lectura propia difiere, va a la sección 10 con `[INFERENCIA]`.
- Confirma, Refuta y Matiza llevan cita textual. Sin cita, es Sin evidencia.
- Preguntas: el ID de la guía (`4.4`, `EX3`) donde salió la evidencia, o "espontáneo".
- Respuesta muy positiva sin repregunta de "la última vez que no pasó": Matiza como
  techo, por sesgo de cortesía.
- Si la ficha tiene Sesgo, el veredicto se pone igual. El tablero lo marca.
- Evidencia que es un asentimiento a una propuesta de quien condujo: como mucho
  Matiza, y la nota de 10 lo dice.
- Evidencia de un período anterior que el entrevistado da por resuelto:
  el veredicto se decide sobre lo vigente, y el período va en la cita.

**Blueprint.** Solo dolores de la sección 03 que tocan un P del registro de
dolores. Relación: Confirma, Contradice, Matiza o Nuevo. Un dolor sin P es Nuevo y
en la columna P va "nuevo": el número lo pone el registro, nunca la ficha. Ante la
duda entre dos P, poner el más cercano y `[VERIFICAR]` en la nota. Si el dolor es de
un período anterior o el cliente lo da por resuelto, la nota lo dice ("el año
pasado, resuelto según el cliente"): un Nuevo sin período entra al registro como
dolor vigente.

**Espejos.** Solo si ya está la ficha de la otra persona de la misma
organización. La diferencia es un hallazgo, no un error de ninguno.

**Fuera de la guía.** Lo que no entra en ninguna hipótesis y tiene peso. Si se
repite en dos entrevistas, es candidato a hipótesis nueva en el próximo corte.

## Comandos

```bash
P=<carpeta de esta skill>/scripts/campo.js
node $P guia --cliente "Sede Norte"             # hipótesis, criterios, segmento y filas del cliente
node $P check $W/fichas/<ficha>.md --dir $W     # metadata, veredictos, ids P contra el registro
node $P build --dir $W                          # TABLERO.md
node $P h H9 --dir $W                           # una hipótesis con toda su evidencia
node $P p P53 --dir $W                          # un dolor del blueprint visto desde el campo
```

Guía y registro se buscan solos por nombre en `$W` y en `/mnt/project`
(`*Guia-de-Entrevistas*`, `*Registro*Trazabilidad*`). Si no, `--guia` y `--registro`.

## Ajustes a la guía entre entrevistas

Se proponen en el mensaje de cierre, nunca en la ficha. Hasta 3, cada uno con la
evidencia que lo motiva (código E y H o fila de cobertura).

| Se puede ajustar | No se toca a mitad de muestra |
|---|---|
| Repreguntas y ejemplos | Preguntas P1 |
| P2 y P3, orden dentro del bloque | Redacción de las hipótesis de la ronda |
| Pregunta propia de un cliente | Criterios de confirma y refuta |
| Orden de agenda | |
| Pasar una pendiente a esta ronda si apareció sola en dos entrevistas | |

Lo de la derecha, si hay que cambiarlo, se cambia en un corte y la guía registra
desde qué entrevista rige. Las entrevistas anteriores quedan con su versión.

Toda repregunta o pregunta nueva que se proponga pasa por las cuatro características
de una pregunta poderosa. Tiene que cumplir al menos dos:

- Genera curiosidad: el entrevistado no tiene la respuesta armada.
- Saca un supuesto a la superficie, nuestro o del entrevistado.
- Invita a una posibilidad, no solo al dolor ("¿qué cambiaría si...?").
- Hace avanzar una hipótesis: su respuesta puede confirmarla o refutarla.

Una pregunta que solo confirma lo que el entrevistado ya dijo, o que trae la
respuesta adentro, no se propone.

Cuando el entrevistado pide una función, la repregunta es siempre por el problema:
"¿qué pasó la última vez que lo necesitaste?" y "¿cómo lo resolviste?". Si lo pedido
puede existir ya, sumar "¿lo probaste o te lo ofrecieron?". Sin eso, el pedido queda
`[SIN PROBLEMA]` en la ficha y el dueño del sistema no tiene cómo saber si falta,
si no llega o si no sirve.

Además, toda pregunta nueva va en pasado y concreta ("la última vez que...",
"contame cómo fue") y nunca en hipotético ("¿usarías...?", "¿te serviría...?"): el
hipotético mide cortesía.

Ejemplo: "¿Le sirve el reporte mensual?" trae la respuesta adentro. "¿Qué es lo
primero que mira cuando cierra el mes, y de dónde lo saca?" saca a la superficie
qué usa de verdad y si nuestro reporte está en ese camino.

## Cortes

| Corte | Cuándo | Qué sale |
|---|---|---|
| 1 | Al cerrar el primer segmento completo o a las 5 entrevistas | `NOTAS.md` con IN, capa cliente del blueprint (P confirmados y nuevos al registro), hipótesis saturadas |
| 2 | Al terminar la muestra | Entregable por driver y por decisión, blueprint final, cada afirmación con E y P |

En un corte se adjunta `TABLERO.md`, no las fichas. Una hipótesis se abre con
`campo.js h`, un dolor con `campo.js p`.

## Observación de campo

Las hojas de registro de `plan-de-observacion` entran al mismo corpus y al mismo
tablero, como fuente de comportamiento:

- Una ficha por sesión de observación, con código E correlativo y en la tabla de
  inicio `Fuente | observación de campo`, `Perfil | Observación: [lugar y momento]`.
- Sección 02 con lo que pasó en orden, sección 03 con los dolores vistos (la
  evidencia es la nota con su hora, no una cita), sección 04 con los atajos
  observados. Lo que alguien dijo durante la observación va como cita corta.
- Sección 11 igual que una entrevista: veredicto de las hipótesis que tocó la
  observación, contra los mismos criterios. Lo que no se pudo ver queda como
  Sin evidencia, no como No preguntada.
- En la lectura del tablero, una hipótesis confirmada por entrevistas y por
  observación tiene voz y comportamiento: sube de certeza.
