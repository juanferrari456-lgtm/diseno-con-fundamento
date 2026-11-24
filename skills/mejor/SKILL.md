---
name: mejor
description: "Reescribe un pedido para que lo resuelva un profesional de primer nivel del campo: más profundo, no más grande. Usar solo cuando la persona la llama por nombre (/mejor o \"mejor\")."
---

# Mejor: profundizar un pedido

Una versión más profunda de la tarea, no una más grande: más cerca de cómo la haría alguien de primer nivel en ese campo, con los mismos entregables o menos. El entregable es el prompt reescrito, no la tarea hecha.

Las demás skills del paquete la ofrecen cuando un pedido llega chato o genérico, pero corre solo si la persona la llama por nombre. Principios del paquete en `references/principios.md`; para el punto 5, la escala de `references/certeza-y-muestras.md` dice cuánta evidencia alcanza para cada nivel de certeza.

## Entrada

El pedido a profundizar. Si no viene en el mensaje, el último pedido de la conversación. Si no hay ninguno, preguntar cuál, con una sola pregunta.

Antes de responder, juntar lo que ya se sabe: la conversación, los archivos adjuntos y `contexto.md` si existe (fuentes de evidencia de la organización, quién hace qué, convenciones). Lo que el contexto ya responde no se deja genérico: si `contexto.md` dice dónde viven los reclamos, el punto 3 nombra ese lugar.

## Primero, cinco preguntas

Nombrar el campo y el rol que se toma de vara (por ejemplo: investigadora de servicio senior, analista de riesgo crediticio, editor de no ficción). Todo lo que sigue, concreto para esta tarea y ese rol.

1. **Qué haría ese profesional que el pedido no pide.** Entre 2 y 4 cosas, cada una con una línea de por qué cambia el resultado. Si la frase sirve para cualquier tarea ("investigar más", "pensar en el usuario"), no sirve para esta.
2. **Qué sacaría.** Una o dos cosas del pedido que ese profesional dejaría afuera o pospondría, y por qué. Es lo que hace lugar para el punto 1 sin agrandar la tarea. Si no hay nada para sacar, decirlo.
3. **El material más crudo.** La fuente primaria en lugar de lo ya digerido (resúmenes, informes, dashboards, lo que pegó la persona): qué es, dónde vive y cómo se consigue. Si en esta sesión no hay acceso, marcarlo.
4. **Métodos y herramientas con nombre propio.** Técnica, marco, consulta, plantilla, software o skill instalada. Que se puedan ejecutar, no solo nombrar. Si una skill instalada cubre el método, nombrarla.
5. **Qué mostraría que el resultado está bien, aparte de Claude o de la persona.** Un criterio externo y verificable: un dato para contrastar, una prueba, alguien del campo, un comportamiento observado, una fuente oficial. Con umbral cuando se pueda.

## Después, reescribir el prompt

El prompt nuevo pide lo que salió de las cinco respuestas: desde qué material arrancar, con qué métodos, qué queda afuera y contra qué se valida. Además:

- Abre con la tarea y para qué se va a usar el resultado. El para qué es lo que deja decidir bien lo que el prompt no dice; si no se sabe, queda como hueco visible para completar, no se inventa.
- Numera pasos solo si el orden cambia el resultado. Si no, da el objetivo y el criterio de bien hecho y deja el cómo; los métodos del punto 4 van con su nombre aunque no estén numerados.
- Si el resultado se apoya en material, pide que cada afirmación diga de qué parte sale y que marque lo que falta en vez de completarlo.
- Si el criterio de bien hecho es difícil de describir, pide como paso previo casos reales ya resueltos para usarlos de ejemplo. No los inventa.
- Si mezcla piezas de distinto tipo (contexto, material, instrucciones, ejemplos, validación), cada una va en su etiqueta XML con un nombre que diga lo que envuelve, y el prompt se refiere a ellas por ese nombre. El material largo va arriba de las instrucciones; varios documentos van cada uno en su `<documento>` con `<fuente>`. Si el prompt es corto y de una sola pieza, sin etiquetas: ordenan, no agregan.

## Antes de entregar, controlar

- **Mismo tamaño o menor.** Contar los entregables del original y del reescrito. Si el reescrito tiene más, sacar algo o justificar el cambio en una línea.
- **Nada fingido.** Lo que el punto 3 o el 4 necesita y no está disponible figura en el prompt como paso previo ("conseguir X"), no como si ya estuviera.
- **Cada agregado se defiende.** Cada instrucción nueva sale de una de las cinco respuestas; si no sale de ninguna, se borra.

Si el pedido ya está a nivel profesional, decirlo en una o dos líneas, señalar lo único que cambiaría si hay algo, y no reescribirlo.

## Formato de salida

1. Una línea con el campo y el rol de referencia.
2. Las cinco respuestas, cada una con su título en negrita y en pocas líneas.
3. El prompt reescrito en un bloque de código para copiar.
4. Una línea final con el cambio de tamaño ("mismos 2 entregables" o "de 3 a 2: saqué X") y la oferta de correrlo.

No ejecutar la tarea. Responder en el idioma de la persona, sin guiones largos.

## Ejemplo de la vara

Pedido: "Armame una encuesta de satisfacción para los clientes de la app."

- **Qué haría:** fijar antes qué decisión va a mover la encuesta; preguntar por el último uso concreto y no por la satisfacción en general.
- **Qué sacaría:** la escala de satisfacción por pantalla: veinte preguntas bajan la tasa de respuesta y ninguna decisión las usa.
- **Material crudo:** los reclamos del último trimestre y las reseñas de la tienda, que ya dicen dónde duele.
- **Métodos:** preguntas de incidente crítico, una pregunta de esfuerzo (CES) en el momento que importa, piloto con cinco personas.
- **Validación:** que las respuestas abiertas del piloto repitan los temas de los reclamos; si no, la encuesta pregunta por otra cosa.

Sigue siendo una encuesta, más corta. Eso es profundo, no grande.
