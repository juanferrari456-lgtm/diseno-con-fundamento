---
name: guia-de-entrevista
description: "Arma la guía de entrevista de un discovery o una investigación de servicio: hipótesis con criterio para confirmarlas o refutarlas, bloques de preguntas que abren con un pedido de historia, repreguntas, apertura con consentimiento, cierre y tiempos, y el plan de campo en una página (decisiones que alimenta, métodos, muestra, calendario y quién hace qué). Sale en el formato que lee sintesis-de-campo. Usar cuando haya que preparar entrevistas, 'qué le pregunto a los usuarios', 'armá la guía', 'tengo entrevistas la semana que viene', 'necesito un plan de investigación', o antes de salir a campo, aunque no se diga la palabra guía."
---

# Guía de entrevista

Una buena guía no es un cuestionario leído en voz alta. Es un mapa de temas a visitar, con preguntas que llevan a la persona a contar lo que pasó y no lo que suena razonable. "Contame la última vez que reservaste una clase" trae una historia. "¿Usarías una app más rápida?" trae cortesía.

Esta guía además sirve para decidir: cada hipótesis tiene su criterio para confirmarla o refutarla, y así la síntesis puede dar un veredicto en lugar de una impresión.

Principios del paquete en `references/principios.md`.

## Cuándo usarla y cuándo no

- **Sí:** antes de entrevistas de discovery, de validación o de guerrilla, y para armar el plan de campo de una investigación.
- **No:** para encuestas (es otro método y suele ser de research) ni para procesar entrevistas ya hechas (va `sintesis-de-entrevistas` o `sintesis-de-campo`).

## Qué necesita para arrancar

- El problema encuadrado y los supuestos ordenados.
- Lo que la evidencia existente ya responde y lo que solo responde la investigación nueva.
- A quién se va a entrevistar, aunque sea en borrador.
- Cuánto dura cada entrevista.

Según cómo llega el pedido (principio P1):

- **Completo:** armar la guía y el plan de campo.
- **Con huecos:** preguntar primero qué decisión tiene que informar esta investigación. Sin eso, la guía no tiene centro.
- **De alguien que arranca:** explicar en una línea qué es una hipótesis ("algo que creemos y que la entrevista puede confirmar o tirar abajo") y armarlas juntos a partir del pedido.

## Térmica

| Si falta esto | Saltar a |
|---|---|
| Problema encuadrado o supuestos | `encuadre-del-problema`, bloque A y supuestos ordenados |
| Saber qué ya responden los datos existentes | `evidencia`, para no preguntar lo que ya se sabe |
| A quién entrevistar y cuántos | `muestra-y-reclutamiento` |
| La investigación incluye ir a ver el servicio funcionando | `plan-de-observacion` |

Si la skill de destino no está, hacer la versión corta de ese paso y decirlo.

## Proceso

1. **Decisiones e hipótesis.** Escribir qué decisiones alimenta esta investigación. Pasar los supuestos ordenados a hipótesis numeradas (`H1`, `H2`), cada una con su driver (el tema que agrupa) y su estado: "esta ronda" o "pendiente". Hasta 8 en esta ronda.
2. **Criterios.** Para cada hipótesis de esta ronda: "Confirma si" y "Refuta si", escritos como algo que se puede escuchar en una entrevista. "Confirma si cuenta al menos una cancelación en el último mes por falta de horario" se puede escuchar; "confirma si le importa el horario" no.
3. **Bloques.** De 2 a 4 bloques temáticos. Cada uno abre con un pedido de historia amplio y baja con repreguntas. Preguntas numeradas por bloque (`2.1`, `2.2`) y con prioridad: P1 se pregunta siempre, P2 si hay tiempo, P3 si sobra.
4. **Las preguntas.** En pasado y concretas: "la última vez que", "contame cómo fue", "¿qué hiciste después?". Sacar todo hipotético ("¿usarías?", "¿te serviría?"), toda pregunta que trae la respuesta adentro y toda pregunta doble. Cada pregunta P1 pasa por los criterios de `references/preguntas.md`.
5. **Repreguntas por bloque:** el silencio, "contame más", "¿y qué hiciste entonces?", y permiso para seguir una sorpresa fuera del guion. Cuando la persona pide una función, la repregunta es por el problema: "¿qué pasó la última vez que lo necesitaste?".
6. **Apertura y cierre.** Apertura con presentación, consentimiento (grabación, uso de la información, derecho a cortar) y una o dos preguntas fáciles. Cierre con "¿qué no te pregunté que debería haberte preguntado?" y "¿con quién más tendría que hablar?".
7. **Trazabilidad.** Tabla que une cada hipótesis con las preguntas P1 que la responden y sus criterios. Si una hipótesis de esta ronda no tiene pregunta P1, falta una pregunta.
8. **Ajuste por segmento.** Qué hipótesis cubre cada segmento de la muestra y qué preguntas propias tiene (con ID `EX1`, `EX2`).
9. **Tiempos.** Minutos por bloque para el largo de la entrevista (30, 45 o 60) y qué bloque se corta primero si no alcanza.
10. **Freno.** Mostrar decisiones, hipótesis y criterios antes de escribir las preguntas: son la parte de criterio y no conviene cambiarlas a mitad de muestra.
11. **Plan de campo.** Cerrar con la página de `references/plan-de-campo.md`.

## Formato de salida

La guía sigue `references/formato-guia.md`, que es el formato que lee `sintesis-de-campo`. Nombre de archivo: la convención de `contexto.md` o, si no hay, `Guia-de-Entrevistas_{Proyecto}_{AAAAMM}.md`. Mantener `Guia-de-Entrevistas` en el nombre: es como la encuentra `sintesis-de-campo`.

Arriba de todo, una línea: la guía sirve a la conversación, no al revés.

## La regla que no se negocia

La guía existe para que una persona escuche a otra. No se simulan entrevistas ni se generan "respuestas probables" para adelantar resultados. La guía está terminada cuando las entrevistas están en el calendario.

## Errores que existe para evitar

- Hipótesis sin criterio: después no hay forma de decir si se confirmó.
- Preguntas en hipotético o que traen la respuesta adentro.
- Una guía que no entra en el tiempo de la entrevista.
- Cambiar hipótesis o criterios a mitad de la muestra sin registrar desde qué entrevista rige el cambio.
- Un plan que esconde el tiempo de reclutamiento y de síntesis.

## Referencias

- `references/formato-guia.md`: plantilla de la guía, compatible con `sintesis-de-campo`.
- `references/preguntas.md`: cómo escribir y revisar preguntas.
- `references/plan-de-campo.md`: el plan en una página.
- `references/ejemplo-ficticio.md`: una guía completa de un caso inventado.
- `references/principios.md` y `references/certeza-y-muestras.md`: principios del paquete.
