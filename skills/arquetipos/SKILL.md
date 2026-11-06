---
name: arquetipos
description: "Arma arquetipos (personas) desde investigación real: agrupa a las personas entrevistadas u observadas por lo que de verdad las diferencia, cada arquetipo con los participantes que lo sostienen, sus trabajos por hacer (funcional, emocional y social) y su mapa de empatía (dice, hace, piensa, siente) con el estándar de evidencia de cada cuadrante. Usar cuando pidan personas, arquetipos, perfiles de usuario, jobs to be done, trabajos por hacer, mapa de empatía, '¿quiénes son nuestros usuarios?', 'hablamos con 12 personas, ¿y ahora?', 'por qué la gente usa esto', o cuando el equipo describe funcionalidades y necesita describir el progreso que la gente quiere hacer."
---

# Arquetipos desde evidencia

Un arquetipo es una compresión de la investigación: el resumen con forma de persona de gente que de verdad se estudió. Sin investigación detrás no es compresión, es ficción. Esta skill junta tres herramientas que se suelen hacer por separado: la persona, sus trabajos por hacer y su mapa de empatía.

Principios del paquete en `references/principios.md`.

## Cuándo usarla y cuándo no

- **Sí:** después de un lote de entrevistas u observación, para que el equipo diseñe para personas concretas y no para "el usuario".
- **No:** para segmentar una base de datos (es análisis de datos) ni para inventar personas antes de investigar (ver modo proto-arquetipo).

## Qué necesita para arrancar

El corpus de entrevistas (`sintesis-de-entrevistas`), el tablero de campo si existe, y datos de comportamiento si los hay.

Según cómo llega el pedido (principio P1):

- **Completo:** proponer el corte y esperar el ok.
- **Con huecos:** si no está claro para qué decisión se usan los arquetipos, preguntarlo: cambia qué diferencias importan.
- **De alguien que arranca:** explicar en una línea la diferencia con un perfil demográfico ("no agrupamos por edad, agrupamos por lo que la gente intenta lograr y cómo lo hace") y seguir.

### Modo proto-arquetipo

Si no hay investigación: no se escriben arquetipos. Se pueden escribir **proto-arquetipos**, supuestos del equipo con forma de persona, marcados "sin validar" en cada página, y saltar a `guia-de-entrevista` para validarlos. Cada rasgo de un proto-arquetipo es un supuesto a testear.

## Térmica

| Si pasa esto | Saltar a |
|---|---|
| No hay corpus ni investigación | Modo proto-arquetipo y `guia-de-entrevista` |
| Hay entrevistas sin procesar | `sintesis-de-entrevistas` primero |
| Los arquetipos están y hay que elegir el problema | `encuadre-del-problema`, modo reencuadre |
| Se pide un journey por arquetipo | `pensar-blueprints` |

## Proceso

1. **Base de evidencia.** Cuántas personas, qué métodos, qué segmentos, qué falta. Arriba de todo.
2. **Encontrar las diferencias reales.** Agrupar a las personas por lo que de verdad cambia entre ellas: objetivos, contexto, restricciones, comportamientos. Demografía solo si cambió el comportamiento en los datos.
3. **Proponer el corte.** De 3 a 5 arquetipos, cada uno con los participantes que lo sostienen ("A sale de E02, E05 y E09"). **Freno:** el corte se confirma antes de escribir.
4. **Escribir cada arquetipo** con la plantilla de `references/plantilla.md`:
   - Nombre y una línea de identidad.
   - Su objetivo en sus palabras (una cita real).
   - Contexto y restricciones.
   - Trabajos por hacer, con `references/trabajos-por-hacer.md`.
   - Mapa de empatía, con `references/mapa-de-empatia.md`.
   - Dolores con su evidencia.
   - Qué lo haría dejar la solución actual.
   - Pie de evidencia: cuántas personas, qué métodos, qué es débil.
5. **Marcar los huecos.** Donde la investigación no llegó (nunca se habló con administradores, todos eran de una misma ciudad), el arquetipo lo dice en lugar de completarlo.
6. **Trabajos sin atender.** Listar los trabajos que ninguna solución actual resuelve bien: son espacios de oportunidad para `arbol-de-oportunidades`.

## Formato de salida

`Arquetipos_{Proyecto}.md` (o la convención de `contexto.md`): una tabla resumen arriba (arquetipo, objetivo central, cuántas personas lo sostienen), un arquetipo por página con al menos dos citas reales, y al final los trabajos sin atender.

Si va a un deck, `creador-de-contenido` y `creador-de-ppt`.

## La regla que no se negocia

Ningún usuario inventado presentado como investigación. Cada rasgo de un arquetipo se puede rastrear hasta personas reales; lo que no, se marca como hueco o como supuesto.

## Errores que existe para evitar

- Arquetipos de marketing con hobbies inventados y foto de banco de imágenes.
- Agrupar por demografía cuando lo que cambia es el comportamiento.
- Un mapa de empatía que presenta inferencias como citas.
- Trabajos por hacer que solo nuestro producto podría cumplir: son funcionalidades disfrazadas.
- Un arquetipo sostenido por una sola persona sin decirlo.

## Referencias

- `references/plantilla.md`: plantilla del arquetipo.
- `references/trabajos-por-hacer.md`: cómo escribir trabajos por hacer desde la evidencia.
- `references/mapa-de-empatia.md`: estándar de evidencia por cuadrante.
- `references/principios.md` y `references/certeza-y-muestras.md`: principios del paquete.
