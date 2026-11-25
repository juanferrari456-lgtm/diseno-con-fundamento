---
name: mejor
description: "Usar solo cuando el usuario la llame por nombre (/mejor o \"mejor\"): reescribe un pedido para hacerlo más profundo, no más grande."
---

# Mejor: profundizar un pedido

Objetivo: una versión más profunda de la tarea, no una más grande. Más cerca de cómo la haría alguien de primer nivel en ese campo, sin sumar entregables.

Las demás skills del paquete la ofrecen cuando un pedido llega chato o genérico, pero corre solo si la persona la llama por nombre.

Principios del paquete en `references/principios.md`. Para el punto 4, la escala de `references/certeza-y-muestras.md` dice cuánta evidencia alcanza para cada nivel de certeza.

## Entrada

El pedido o prompt a profundizar. Si no viene en el mensaje, tomar el último pedido de la conversación. Si no hay ninguno, preguntar cuál (una sola pregunta).

Si quien pide está arrancando (pide que lo guíen o no sabe qué tiene a mano), explicar en una línea para qué sirve cada uno de los cuatro bloques y, donde haya que elegir, ofrecer dos o tres opciones concretas en lugar de una pregunta abierta.

Si el pedido llega como una solución ya decidida ("hagamos una encuesta", "sumá un botón") y no hay un problema encuadrado, el prompt reescrito arranca por encuadrarlo con `encuadre-del-problema`. Si esa skill no está instalada, el prompt pide como paso previo escribir el problema en tres líneas: actor, necesidad y consecuencia.

## Antes de reescribir, responder cuatro cosas

Todo concreto para este campo y esta tarea. Nombrar primero el campo y el rol profesional que se toma como referencia (por ejemplo: investigadora de servicio senior, analista de datos de riesgo, editor de no ficción).

Lo que se propone en los puntos 1 a 3 es criterio, no evidencia: va marcado como hipótesis, en la escala de `references/certeza-y-muestras.md`. Si una propuesta sale de algo que la persona compartió, decir de qué.

1. **Qué haría un profesional top que no estoy pidiendo.** Entre 2 y 4 cosas, cada una con una línea de por qué cambia el resultado. Prohibido lo genérico ("investigar más", "considerar al usuario").
2. **El material más crudo.** De qué fuente primaria arrancaría en lugar de lo ya digerido (resúmenes, informes, dashboards, lo que pegó el usuario). Decir dónde vive y cómo se consigue. Si en esta sesión no hay acceso, marcarlo.
3. **Métodos y herramientas específicos.** Con nombre propio: técnica, marco, software, consulta, plantilla. Que se puedan ejecutar, no solo nombrar.
4. **Qué, aparte de Claude o del usuario, mostraría que el resultado es correcto.** Un criterio externo y verificable: un dato contra el que contrastar, una prueba, una persona del campo, un comportamiento observado, una fuente oficial, un benchmark. Con umbral cuando aplique.

## Después, reescribir el prompt

El prompt nuevo pide exactamente lo que salió de los cuatro puntos: desde qué material arrancar, con qué métodos, y contra qué se valida.

Además, el prompt reescrito:
- Abre con la tarea y para qué se va a usar el resultado. El para qué es lo que deja decidir bien lo que el prompt no dice.
- Numera pasos solo cuando el orden cambia el resultado (por ejemplo, leer el formulario antes que el croquis). Si no, pide el objetivo y el criterio de bien hecho y deja el cómo. Los métodos del punto 3 se mantienen con nombre propio aunque no vayan numerados.
- Si el resultado se apoya en material, pide que cada afirmación diga de qué parte sale, y que diga qué falta en lugar de completarlo.
- Si el criterio de bien hecho es difícil de describir, pide como paso previo casos reales difíciles ya resueltos y los pone en <ejemplos>. No los inventa.
- Si el material es largo, cierra con una oración que repite la tarea y la regla que más importa.

Estructura del prompt reescrito:
- Si mezcla piezas de distinto tipo (contexto, material de entrada, instrucciones, ejemplos, criterio de validación), separar cada una en su etiqueta XML: <contexto>, <material>, <instrucciones>, <ejemplos>, <validacion>. Los nombres describen lo que envuelven; no hay etiquetas "correctas".
- Usar los mismos nombres en todo el prompt y nombrarlos al referirse al contenido ("con el material de <material>...").
- Anidar cuando hay jerarquía: si el material son varios documentos, cada uno va en su <documento indice="n"> dentro de <material>, con <fuente> y <contenido>.
- Si el material de entrada es largo, va arriba, antes de las instrucciones.
- Si pide una salida con partes, indicar en qué etiqueta va cada una (por ejemplo <hallazgos> y <recomendaciones>).
- Si el prompt es corto y de una sola pieza, no agregar etiquetas.

## Reglas

- Profundo, no grande: el prompt reescrito no tiene más entregables que el original. Si suma algo, saca otra cosa o justifica el cambio en una línea.
- Si el pedido ya está a nivel profesional, decirlo y no inflarlo.
- Las etiquetas ordenan, no agregan: no son una excusa para sumar secciones que el pedido no necesita.
- Si lo que pide el punto 2 o el 3 no está disponible en esta sesión, decirlo en el prompt como paso previo (conseguir X) en vez de fingir que está.
- No ejecutar la tarea: el entregable es el prompt. Ofrecer correrlo en una línea al final.
- Responder en el idioma del usuario. No usar guiones largos.

## Formato de salida

Cuatro bloques cortos, uno por pregunta, con su título en negrita. Después el prompt reescrito en un bloque de código para copiar. Nada más.
