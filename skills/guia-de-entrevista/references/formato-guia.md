# Formato de la guía

`sintesis-de-campo` lee tres secciones por su título (la cuota de Ajuste por segmento alimenta la cobertura del tablero): **Hipótesis**, **Trazabilidad** y **Ajuste por segmento**. Mantener esos títulos y el orden de columnas de esas tablas. El resto se puede adaptar.

```markdown
# Guía de entrevistas | [Proyecto]

> La guía sirve a la conversación, no al revés.

| | |
|---|---|
| Proyecto | |
| Versión | v1, rige desde E01 |
| Duración | 45 minutos |
| Quién conduce | [según el plan de campo] |

## 1. Decisiones que alimenta

- [decisión 1]
- [decisión 2]

## 2. Hipótesis

| H | Driver | Hipótesis | Estado |
|---|---|---|---|
| H1 | [tema] | [algo que creemos, escrito para poder resultar falso] | esta ronda |
| H2 | [tema] | [...] | pendiente |

## 3. Trazabilidad

| H | Preguntas P1 | Confirma si | Refuta si |
|---|---|---|---|
| H1 | 2.1, 2.3 | [lo que habría que escuchar] | [lo que habría que escuchar] |

## 4. Ajuste por segmento

| Segmento | Quiénes | Hipótesis a cubrir | Cuota |
|---|---|---|---|
| A [nombre del segmento] | [criterio de comportamiento] | H1, H3 | 6 |
| B [nombre del segmento] | [...] | H2, H4 (EX1) | 5 |

## 5. Apertura (5 min)

- Presentación y para qué es la charla.
- Consentimiento: grabación, uso de la información, puede cortar cuando quiera.
- Preguntas fáciles para entrar en confianza.

## 6. Bloques

### Bloque 2 | [tema] (15 min)

| ID | Prioridad | Pregunta | Repreguntas |
|---|---|---|---|
| 2.1 | P1 | Contame la última vez que [...]. | ¿Qué hiciste después? ¿Cómo terminó? |
| 2.2 | P2 | [...] | |

### Bloque 3 | [tema] (15 min)

| ID | Prioridad | Pregunta | Repreguntas |
|---|---|---|---|

### Preguntas propias de un segmento

| ID | Segmento | Pregunta |
|---|---|---|
| EX1 | B | [...] |

## 7. Cierre (5 min)

- ¿Qué no te pregunté que debería haberte preguntado?
- ¿Con quién más tendría que hablar?
- Agradecer y explicar qué pasa con lo que contó.

## 8. Si falta tiempo

Se corta primero el bloque [N], después las P3 y después las P2. Las P1 no se cortan.

## 9. Cambios de versión

| Versión | Rige desde | Qué cambió y por qué |
|---|---|---|
```

Los IDs de pregunta son `bloque.número` (`2.1`) o `EX` y número para las propias de un segmento. Los IDs de hipótesis son `H` y número. `sintesis-de-campo` los usa para el veredicto y el tablero.
