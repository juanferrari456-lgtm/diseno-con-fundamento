# Leer lo que vuelve

## 1. Reclamos y casos de atención

El objetivo es pasar de "hay 300 reclamos de reembolso" a "de 300 reclamos de reembolso, 120 (40%) son por cambio de fecha y 45 (15%) por una política mal informada, con estos casos como evidencia". Lo que vale es el subtema cuantificado y trazable, no el resumen general.

> Los números de este archivo son ejemplos de formato, no datos.

### Perfilar antes de leer

Con código si el archivo es grande:

- Filas totales y período real (mínimo y máximo de la fecha de apertura).
- Volumen por categoría y por canal.
- Porcentaje con descripción útil (más de 30 caracteres) por categoría.
- Casos vinculados o duplicados del mismo reclamo.

Contarlo en tres o cuatro líneas antes del análisis. Si el período o el volumen no coinciden con lo esperado, frenar y revisar filtros.

### Codificar por categoría

Una categoría por vez, empezando por las que pidió la iniciativa o, si no hay pedido, por las de mayor volumen.

- **Hasta 150 casos:** leer todas las descripciones.
- **Más de 150:** leer una muestra de 100 repartida en el período y decir cuántos se leyeron. Si hay reglas automáticas de clasificación, decir cuántos se clasificaron por reglas y qué tan bien coinciden con la lectura.

Para cada subtema:

| Campo | Qué es |
|---|---|
| Nombre | Corto y concreto: "Política de cambios contradictoria", no "Problemas de información" |
| Regla de inclusión | Qué tiene que decir la descripción para caer acá |
| Casos | Cantidad y porcentaje sobre la categoría |
| Evidencia | 2 o 3 números de caso con la descripción parafraseada, sin datos personales |

Un caso va a un solo subtema principal. "Otros" no debería superar el 15%; si lo supera, falta un subtema.

### Separar tres capas

1. **Qué pidió o reportó la persona** (el dolor).
2. **Qué respondió o hizo el agente.**
3. **Si se resolvió en el contacto** ("se resuelve" contra "se deriva", "debe contactarse", "se escala").

La resolución en primer contacto por subtema es muchas veces el hallazgo más accionable: un subtema que siempre se deriva es un proceso que atención no puede cerrar sola. Separar también los motivos que el agente no puede resolver (política y producto) de los que sí: es la diferencia entre una mejora de atención y una de producto.

### Límites que hay que declarar

- La descripción es la versión del agente, no la voz del usuario.
- Solo están quienes contactaron. No mide a quien abandonó sin escribir.
- La categoría la elige el agente y puede estar mal elegida.
- Si la resolución viene vacía, no se puede afirmar cómo terminó el caso.

### Entrega

Tabla de subtemas por categoría (subtema | casos | % | resuelto en contacto | evidencia) y, abajo, hallazgos con número, fuente y certeza. Tomar posición sobre qué subtema pesa más y por qué.

## 2. Encuestas

- **Distribución antes que promedio.** Mirar la forma de cada respuesta: dos grupos opuestos, todos amontonados arriba (techo) o abajo (piso). Un 3,1 puede ser un grupo encantado y otro furioso.
- **Cortes antes que totales.** Un total que promedia un segmento que sufre es una mentira chica.
- **Satisfacción junto con resolución.** En encuestas de atención, el promedio esconde dos experiencias opuestas: reportar siempre el porcentaje resuelto al lado.
- **Leer por disparador.** Si la misma encuesta se manda en momentos distintos (después de comprar, después de usar), cada momento se lee aparte. Revisar qué pregunta de verdad el cuestionario: puede estar midiendo otra cosa que la que dice su nombre.
- **Tamaño por corte.** Contar cuántas respuestas hay por corte antes de leer. Con menos de 30 por corte, comparar la proporción de un motivo sobre todos los comentarios del corte, que junta más casos, y leer los grupos chicos solo como referencia.
- **Sesgos de la propia encuesta:** quién contestó contra a quién se le preguntó, tasa de respuesta, por qué canales llega y por cuáles no, dónde abandonan, quién respondió todo igual.
- **Comentarios:** codificar con el método de la sección 1, separados por grupo (detractor, pasivo, promotor) y por el corte que se quiere explicar.
- **Sección fija "Qué no pueden decir estos datos":** por qué contestaron así, qué harían, quién no contestó. Lo que va ahí pasa a pregunta para entrevistas.

### Si te toca revisar una encuesta

Diseñar encuestas suele ser trabajo de research. Si igual te toca revisar o sumar preguntas:

- Antes de diseñar, revisar si ya existe una medición y para qué actor es.
- Una decisión por encuesta. Cada pregunta con su uso previsto; si no tiene, se saca.
- Que la respuesta llegue con lo que hace falta para cortarla (lugar, compra, canal, producto). Sin eso no se puede atribuir después.
- Estimar cuántas respuestas va a tener cada corte antes de enviar.
- Comportamiento antes que actitud, frecuencias en rangos, escalas balanceadas, sin preguntas dobles ("rápido y confiable" son dos) ni inducidas, y una prueba con 5 personas antes de enviar.

## 3. Tasas por volumen

Para comparar lugares, eventos, productos o períodos de distinto tamaño: reclamos cada 1.000 pedidos, ventas o visitas.

1. **Numerador:** personas, no registros. Sacar duplicados y casos vinculados al mismo reclamo.
2. **Denominador:** contado por la fecha del hecho y con la misma definición en todos los grupos. Revisar a mano los que tienen más volumen.
3. **Unir nombres:** si el lugar o el evento se escribe de varias formas, normalizar (minúsculas, sin tildes, sin espacios dobles) y revisar a mano los primeros 20.
4. **Casos especiales del denominador:** lo cancelado que se vendió y se devolvió, lo que tiene varios códigos para lo mismo, lo que todavía no cerró (queda sin tasa, no con tasa cero).
5. **Comparable:** solo grupos cerrados y con 30 casos o más. Con menos, se informa sin rankear.
6. Declarar qué porcentaje de los casos no se pudo atribuir a ningún grupo.

## 4. ¿La diferencia es real?

Antes de escribir "A está peor que B", calcular el intervalo del 95% de la diferencia:

```bash
python scripts/intervalo.py nps --a n,promotores,detractores --b n,promotores,detractores --nombres A,B
python scripts/intervalo.py prop --a n,casos --b n,casos --nombres A,B
python scripts/intervalo.py media --a n,promedio,desvio --b n,promedio,desvio --nombres A,B
```

- `nps` para NPS, `prop` para porcentajes (resolución, peso de un subtema, tasa de respuesta), `media` para promedios como el CSAT.
- Si el intervalo no incluye el cero, la diferencia se afirma. Si lo incluye, se escribe "no se distingue del ruido con esta muestra" y no se usa como argumento.
- Reportar siempre los dos valores, la diferencia y el intervalo.
- Si el script no está disponible, la cuenta para NPS: por grupo, con P y D como proporción de promotores y detractores, varianza = P + D - (P - D)², error = raíz de (varianza / n). Error de la diferencia = raíz de (error₁² + error₂²). Intervalo = diferencia ± 1,96 x error de la diferencia.

## 5. Nivel de certeza

Todo hallazgo declara su nivel con la escala de `certeza-y-muestras.md`. Reclamos solos son siempre indicio. Para subir un indicio a patrón, buscar la misma señal en otro tipo de fuente: una encuesta, la analítica, lo observado en campo.

Ejemplo de patrón, ficticio: el NPS de dos sedes con muestra de referencia (22 y 28 respuestas) es bajo, y en esas mismas sedes los reclamos por "clase llena sin aviso" duplican al resto. Voz y salud coinciden: es un patrón, sostenido por la coincidencia y no por la nota, que con esa muestra es solo referencia.

## 6. Cuidados generales

- **Valores por defecto que parecen datos:** "NA", "Unknown", "false", "Vencido", vacíos. Revisar los valores más frecuentes antes de contar.
- **Canales que se confunden:** "web" puede incluir el navegador del celular; "app" suele ser solo la app instalada. Confirmarlo en la ficha de la fuente.
- **Cambios de definición:** si un campo cambió de significado o un canal dejó de cargar datos en una fecha, partir el período.
- **La versión del agente no es la voz del usuario.**
