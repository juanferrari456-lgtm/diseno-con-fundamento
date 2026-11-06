---
name: prueba-de-conceptos
description: "Diseña y lee la prueba más barata que responde la pregunta sobre un concepto: elige el formato de prototipo según la pregunta (papel, storyboard, puerta falsa, mago de Oz, concierge, role play del servicio), fija un tope de días y el umbral de evidencia antes de probar, escribe el guion de la sesión con tareas y no recorridos, y sintetiza las sesiones con el comportamiento por encima de la opinión y un veredicto por supuesto: seguir, pivotar o estacionar. Usar cuando pidan planificar un prototipo, 'cómo probamos esto barato', 'armemos un MVP', un guion de prueba de usabilidad o de concepto, un storyboard, un role play o walkthrough de servicio, 'el jueves mostramos el prototipo', o sintetizar los resultados de las pruebas."
---

# Prueba de conceptos

Un prototipo es una pregunta disfrazada, no un producto chico. Tiene un olor cuando falla: tres semanas adentro del "prototipo", alguien discute la pantalla de configuración. Si el prototipo tarda más que la prueba, es un producto.

Esta skill cubre las tres partes de probar: el plan, el guion y la lectura de lo que pasó.

Principios del paquete en `references/principios.md`.

## Cuándo usarla y cuándo no

- **Sí:** con un concepto elegido y su supuesto más riesgoso, antes de construir, y después de las sesiones para decidir.
- **No:** para elegir entre conceptos (va `priorizacion-de-conceptos`) ni para investigar el problema (va `guia-de-entrevista`).

## Qué necesita para arrancar

El concepto, el supuesto a probar y, si existe, la ficha de concepto y la priorización.

Según cómo llega el pedido (principio P1):

- **Completo:** plan, guion y, después de las sesiones, síntesis.
- **Con huecos:** si no está claro qué supuesto se prueba, preguntarlo. Sin pregunta, el prototipo crece hasta ser un producto.
- **De alguien que arranca:** explicar en una línea la idea ("armamos lo mínimo para ver cómo reacciona la gente de verdad, antes de construir") y elegir el formato juntos con la tabla de `references/formatos.md`.

## Térmica

| Si falta esto | Saltar a |
|---|---|
| El supuesto más riesgoso | `priorizacion-de-conceptos` |
| Personas para las sesiones | `muestra-y-reclutamiento` |
| El servicio actual mapeado, para un role play | `pensar-blueprints` |
| Las sesiones terminaron y hay que presentar | `creador-de-contenido` |

## Proceso

### 1 | Plan

1. **La pregunta.** Reescribir el supuesto como la única pregunta que este prototipo tiene que responder.
2. **El formato** según la pregunta, no según el orgullo, con `references/formatos.md`. Gana el formato más barato que produce comportamiento real.
3. **Tope de días.** En días, no en semanas. Recortar el alcance hasta que entre. Todo lo que no hace falta para responder la pregunta es alcance de más.
4. **Umbral de evidencia, antes de probar:** qué comportamiento observado, de cuántas personas, movería el supuesto. Decidirlo después de ver los datos es cómo todo prototipo "sale bien".
5. **Sesiones:** quiénes (personas reales del segmento), cuántas, haciendo qué, observadas cómo.
6. **Qué no puede responder** este prototipo, para que nadie lea una prueba en papel como validación de precio.

**Freno.** Mostrar pregunta, formato, tope y umbral antes de armar nada.

### 2 | Guion

Con `references/guion.md`: apertura con consentimiento, tareas y no recorridos, pensar en voz alta, preguntas que no inducen, hoja de observación atada al umbral y tiempos.

### 3 | Síntesis de las sesiones

Con `references/sintesis-de-prueba.md`:

1. Separar por sesión lo que las personas **hicieron** de lo que **dijeron**. Cuando no coinciden, manda el comportamiento y la contradicción es un hallazgo.
2. Contar con honestidad: "4 de 6 completaron la tarea, 2 con ayuda de quien condujo".
3. Veredicto por supuesto contra el umbral fijado antes: sostenido, contradicho o no claro, con su evidencia. "No claro" es un veredicto válido y dice qué lo aclararía.
4. Recomendación: seguir, pivotar o estacionar, con la cadena de razonamiento a la vista, qué la daría vuelta y la próxima prueba más barata si se sigue.

**Freno.** La recomendación es del equipo. La skill la propone con su razonamiento.

## Formato de salida

- Plan: `Prueba_{Concepto}_{Proyecto}.md` con pregunta, formato y porqué, alcance con tope de días, umbral, plan de sesiones y lo que no puede responder.
- Guion: en el mismo archivo o aparte, listo para conducir.
- Síntesis: base de evidencia, comportamiento contra opinión con conteos y citas, veredicto por supuesto, recomendación y preguntas abiertas.

## La regla que no se negocia

Un prototipo solo es una prueba cuando lo encuentran personas reales. Ningún recorrido interno, revisión de expertos ni reacción simulada lo reemplaza, y el veredicto se toma contra el umbral fijado antes de ver los datos. "Contradicho" no se suaviza a "señales mixtas" para salvar un plan.

## Errores que existe para evitar

- Construir el producto para averiguar si alguien lo quiere.
- Fijar el umbral después de ver los resultados.
- Recorridos guiados ("ahora tocá acá y fijate qué fácil") en lugar de tareas.
- Preguntar "¿lo usarías?": mide cortesía.
- Contar como validación a tres personas amables que fallaron la tarea.
- Presentar un role play del equipo como si fuera investigación con usuarios.

## Referencias

- `references/formatos.md`: qué formato responde qué pregunta, incluidos storyboard y role play de servicio.
- `references/guion.md`: el guion de la sesión.
- `references/sintesis-de-prueba.md`: cómo leer las sesiones.
- `references/principios.md` y `references/certeza-y-muestras.md`: principios del paquete.
