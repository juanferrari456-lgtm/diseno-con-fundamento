# Certeza, muestras y vigencia

Una sola escala para todo el paquete.

## Tipos de fuente

| Tipo | Qué es | Ejemplos |
|---|---|---|
| Voz | Lo que la gente dice o escribe | Entrevistas, reclamos a atención, comentarios de encuestas, reseñas |
| Comportamiento | Lo que la gente hace, aunque no lo diga | Analítica de producto o web, datos operativos, observación de campo |
| Salud | Si la gente queda conforme o vuelve | NPS, CSAT, recompra, bajas |
| Contexto | Quién es cada persona | Segmento, antigüedad, plan, región |

## Nivel de certeza

- **Hipótesis:** sin fuente.
- **Indicio:** una fuente, o varias del mismo tipo.
- **Patrón:** dos fuentes de tipo distinto.
- **Evidencia sólida:** tres o más, con al menos una de comportamiento y una de voz.

Una contradicción entre fuentes es un hallazgo, no un ruido a resolver en silencio.

## Qué no sube la certeza

- Una opinión firme, aunque sea de alguien con cargo.
- Una funcionalidad de la competencia.
- Una respuesta generada por IA.
- Una prueba diseñada para salir bien.

## Muestras

- **30 o más:** se puede comparar.
- **De 10 a 29:** solo referencia, sin rankear.
- **Menos de 10:** casos sueltos.

Una diferencia entre dos grupos se afirma solo si su intervalo del 95% no incluye el cero. Una muestra grande no garantiza que una diferencia sea real.

Si `contexto.md` trae reglas de procesamiento de datos más detalladas, esas mandan.

## Vigencia

`UMBRAL_VIGENCIA` es cuánto tiempo puede tener una fuente antes de tratarla como posiblemente desactualizada. Se define en `contexto.md`. Si no está definido, preguntalo cuando una fuente tenga más de seis meses, y no asumas un valor.

Una fuente que pasa el umbral, que es de segunda mano, con muestra chica o con método poco claro cuenta como **sugerente**: suma como indicio, nunca como evidencia sólida, y se dice por qué en una línea.
