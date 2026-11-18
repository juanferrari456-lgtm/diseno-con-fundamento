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

## Antes de reescribir, responder cuatro cosas

Todo concreto para este campo y esta tarea. Nombrar primero el campo y el rol profesional que se toma como referencia (por ejemplo: investigadora de servicio senior, analista de datos de riesgo, editor de no ficción).

1. **Qué haría un profesional top que no estoy pidiendo.** Entre 2 y 4 cosas, cada una con una línea de por qué cambia el resultado. Prohibido lo genérico ("investigar más", "considerar al usuario").
2. **El material más crudo.** De qué fuente primaria arrancaría en lugar de lo ya digerido (resúmenes, informes, dashboards, lo que pegó el usuario). Decir dónde vive y cómo se consigue. Si en esta sesión no hay acceso, marcarlo.
3. **Métodos y herramientas específicos.** Con nombre propio: técnica, marco, software, consulta, plantilla. Que se puedan ejecutar, no solo nombrar.
4. **Qué, aparte de Claude o del usuario, mostraría que el resultado es correcto.** Un criterio externo y verificable: un dato contra el que contrastar, una prueba, una persona del campo, un comportamiento observado, una fuente oficial, un benchmark. Con umbral cuando aplique.

## Después, reescribir el prompt

El prompt nuevo pide exactamente lo que salió de los cuatro puntos: desde qué material arrancar, con qué métodos, y contra qué se valida.

## Reglas

- Profundo, no grande: el prompt reescrito no tiene más entregables que el original. Si suma algo, saca otra cosa o justifica el cambio en una línea.
- Si el pedido ya está a nivel profesional, decirlo y no inflarlo.
- Si lo que pide el punto 2 o el 3 no está disponible en esta sesión, decirlo en el prompt como paso previo (conseguir X) en vez de fingir que está.
- No ejecutar la tarea: el entregable es el prompt. Ofrecer correrlo en una línea al final.
- Responder en el idioma del usuario. No usar guiones largos.

## Formato de salida

Cuatro bloques cortos, uno por pregunta, con su título en negrita. Después el prompt reescrito en un bloque de código para copiar. Nada más.