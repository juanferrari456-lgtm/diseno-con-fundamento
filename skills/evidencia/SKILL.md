---
name: evidencia
description: "Busca y lee la evidencia que sostiene un problema, un hallazgo, una oportunidad o una decisión: decide qué tipos de fuente hacen falta, ayuda a descubrir cuáles hay a mano si la persona no sabe, arma el pedido o la consulta, analiza lo que vuelve (reclamos, comentarios, encuestas, analítica, datos operativos) y dice cuánto aguanta cada número. Sirve con cualquier herramienta. Usar cuando se pregunte qué dicen los datos, con qué se sostiene algo, cuántos reclamos o casos hay, cómo leer un NPS o un CSAT, si una diferencia entre grupos es real, qué fuentes existen en la organización, o cuando se suba un export, un CSV o un reporte, aunque no se nombre la palabra evidencia."
---

# Evidencia

Dos trabajos en uno:

1. **Criterio:** ante una pregunta, un hallazgo o una decisión, decir qué evidencia hace falta para sostenerlo, de qué tipos de fuente sale y qué no va a poder responder ninguna.
2. **Ejecución:** conseguirla (consulta propia o pedido a otro equipo), leer lo que vuelve y decir cuánto aguanta.

La skill guarda el método, no datos. Lo propio de cada organización (qué fuentes hay, quién da acceso, qué trampas tiene cada una) vive en `contexto.md` y en las fichas de fuente que se van armando.

Principios del paquete en `references/principios.md`. Escala de certeza y muestras en `references/certeza-y-muestras.md`.

## Cuándo usarla y cuándo no

- **Sí:** para sostener la pregunta 1 de un encuadre, para dimensionar un dolor, antes de afirmar que un grupo está peor que otro, para leer un export o un reporte, y para descubrir qué evidencia hay en una organización.
- **No:** para diseñar una encuesta (es trabajo de research; ver `references/analisis.md`, sección "Si te toca revisar una encuesta") ni para procesar entrevistas (va `sintesis-de-entrevistas`).

## Qué necesita para arrancar

Qué se quiere sostener y quién va a decidir con eso. Y saber qué fuentes hay a mano: de `contexto.md`, de lo que diga la persona o del modo guiado.

Según cómo llega el pedido (principio P1):

- **Completo** (trae la pregunta, las fuentes o el archivo): ir directo al paso 2 o 3.
- **Con huecos:** preguntar lo que más cambia el resultado. Casi siempre: qué se quiere sostener y para qué decisión.
- **De alguien que no sabe qué evidencia tiene:** modo guiado, en `references/descubrir-fuentes.md`. Recorre los tipos de fuente con preguntas en lenguaje llano ("¿hay algún lugar donde se ve qué hace la gente, aunque no lo diga?"), nombra herramientas solo como ejemplos y deja escrito qué hay, quién da acceso y qué falta. Al terminar, ofrecer guardarlo en `contexto.md`.

## Térmica

| Si pasa esto | Saltar a |
|---|---|
| No está claro qué problema se quiere sostener | `encuadre-del-problema`, pregunta 1 |
| Ninguna fuente existente responde y hace falta escuchar a personas | `guia-de-entrevista` o `plan-de-observacion` |
| La evidencia va a un árbol de oportunidades | `arbol-de-oportunidades`, con tipo de fuente, origen y período de cada pieza |
| Se sube una transcripción de entrevista | `sintesis-de-entrevistas` |

## Proceso

### 1 | De la pregunta a las fuentes

Escribir en una línea qué se quiere sostener y quién va a decidir con eso. Después elegir los tipos de fuente:

| Pregunta | Tipos de fuente |
|---|---|
| ¿Qué le pasa a la gente? ¿De qué se queja? | Voz: reclamos, comentarios de encuestas, reseñas, conversaciones de atención |
| ¿Qué tan conforme queda? ¿Vuelve? | Salud: NPS, CSAT, recompra, bajas |
| ¿Cuánto pesa? ¿A cuántos les pasa? | Comportamiento y operativo, cruzado con voz |
| ¿Qué hace la gente? ¿Dónde abandona? | Comportamiento: analítica de producto o web, embudos |
| ¿Qué pasa en el lugar donde se presta el servicio? | Operativo y observación de campo |
| ¿Por qué hubo un pico? | Operativo por día, registro de incidentes, comunicaciones internas |
| ¿Quién es? ¿Es nuevo? | Contexto: segmento, antigüedad, plan |

**Triangular desde el principio.** Para recomendar con posición hacen falta tres fuentes o más, con al menos una de voz y una de comportamiento. Si la pregunta solo se puede responder con un tipo, decirlo antes de consultar: el resultado va a ser un indicio, no una conclusión.

**Lo que ninguna fuente responde también es un resultado.** Se escribe como evidencia que falta, de dónde podría salir y quién la tiene.

**Freno.** Mostrar la línea de qué se quiere sostener, los tipos de fuente elegidos y la certeza máxima que pueden dar, y esperar el ok. Si el pedido ya trae la pregunta y las fuentes, seguir.

### 2 | Conseguir los datos

Según quién tiene acceso (principio P3):

- **La persona consulta sola:** ayudar a armar la consulta o el filtro en su herramienta, en el orden de `references/consultar.md`: que los datos lleguen al período, descubrir los valores reales de los filtros, contar el volumen, extraer, y verificar que las sumas cierren.
- **Lo tiene otro equipo:** armar el pedido con la plantilla de `references/consultar.md`: qué se quiere saber y para qué decisión, período, cortes, campos, formato y para cuándo. Un pedido claro vuelve más rápido y mejor.

Si una fuente se usa más de una vez, armar su ficha con `references/ficha-de-fuente.md`: qué responde, qué no, cómo se cruza y qué trampas tiene. Ofrecer guardarla junto a `contexto.md`.

### 3 | Leer lo que vuelve

Seguir `references/analisis.md`:

- Reclamos y casos de atención: perfilar antes de leer, codificar por motivo, separar lo que pidió la persona de lo que hizo el agente y de si se resolvió, declarar los límites.
- Encuestas: distribución antes que promedio, cortes antes que totales, sesgos de la propia encuesta, y la sección "qué no pueden decir estos datos".
- Tasas por volumen (reclamos cada 1.000 pedidos, ventas o visitas): numerador sin duplicados, denominador bien contado.
- **Antes de escribir cualquier comparación:** toda diferencia entre grupos pasa por `scripts/intervalo.py`. Si el intervalo incluye el cero, no es un hallazgo.
- **Antes de escribir cualquier hallazgo:** declarar la certeza con la escala del paquete.

## Formato de salida

```
Qué se quería sostener: [en una línea]
Hallazgo: [afirmación] | [número, período, fuente] | Certeza: [nivel]
Contradicciones: [si hay]
Lo que falta: [evidencia que no se pudo conseguir, de dónde saldría y qué decisión cambia]
Posición: [qué haríamos con esto y con qué costo]
```

Si va a un deck, el contenido se trabaja con `creador-de-contenido`.

## La regla que no se negocia

Ningún número sin período, fuente y tamaño de muestra al lado, y ninguna diferencia afirmada sin su intervalo. Un número sin eso es una opinión con decimales.

## Errores que existe para evitar

- Contar con un filtro mal escrito y confundir "cero filas" con "no pasó".
- Cruzar dos fuentes por una llave que parecía la correcta y no lo era.
- Tomar valores por defecto ("NA", "Unknown", "false", vacíos) como datos.
- Reportar un promedio que esconde dos experiencias opuestas.
- Usar como argumento una diferencia que la muestra no sostiene.
- Leer la versión del agente como si fuera la voz del usuario.

## Referencias

- `references/descubrir-fuentes.md`: modo guiado para quien no sabe qué evidencia tiene.
- `references/consultar.md`: orden de consulta y plantilla de pedido a otro equipo.
- `references/ficha-de-fuente.md`: plantilla para documentar una fuente.
- `references/analisis.md`: cómo leer reclamos, encuestas y tasas, intervalos y certeza.
- `scripts/intervalo.py`: intervalo del 95% para NPS, proporciones y promedios.
- `references/principios.md` y `references/certeza-y-muestras.md`: principios y escala del paquete.
