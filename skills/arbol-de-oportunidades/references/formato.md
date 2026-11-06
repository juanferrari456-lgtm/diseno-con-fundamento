# Formato de arbol.json

Ejemplo completo y ficticio en `ejemplo-ficticio.json`.

```json
{
  "titulo": "Lista de espera | conformidad de socios que quedan afuera",
  "metrica": {"texto": "NPS de socios", "valor": "40", "linea_base": "40 (420 respuestas)", "periodo": "enero a septiembre", "fuente": "Encuesta trimestral de socios"},
  "outcome": {
    "texto": "Quien queda en lista de espera queda tan conforme como el resto",
    "linea_base": "resto 46,7 (300 respuestas) contra lista de espera 20,0 (120 respuestas)",
    "periodo": "enero a septiembre",
    "fuente": "Encuesta trimestral de socios",
    "comparacion": {
      "a": {"nombre": "resto", "n": 300, "promotores": 180, "detractores": 40},
      "b": {"nombre": "lista de espera", "n": 120, "promotores": 54, "detractores": 30}
    }
  },
  "explicaciones_alternativas": ["Texto de la explicación y cómo se descarta"],
  "evidencia": [
    {"id": "EV1", "tipo": "tickets", "origen": "Subtema X, casos 123 y 456", "fuente_simple": "Casos de atención al cliente", "texto": "Qué dice, parafraseado", "dato": "8 de 42 comentarios", "periodo": "julio a septiembre"}
  ],
  "oportunidades": [
    {
      "id": "O1",
      "necesidad": "En voz del usuario",
      "actor": "socio",
      "momento": "reserva",
      "urgencia": "alta",
      "evidencia": ["EV1", "EV2"],
      "vinculo_outcome": {"estado": "hipotesis", "nota": "Qué lo probaría"},
      "control": "alto",
      "impacto": "Una línea: por qué importa",
      "prioridad": true,
      "soluciones": [
        {"texto": "Idea concreta", "supuesto": "Qué tiene que ser cierto", "como_testear": "Prueba barata antes de construir"}
      ]
    }
  ],
  "contradicciones": ["Fuente A dice X, fuente B dice Y"],
  "evidencia_a_conseguir": ["Qué falta, de dónde sale y qué decisión cambia (versión técnica)"],
  "presentar": {
    "migas": "Árbol de oportunidades | Tema en palabras simples",
    "titular": "La conclusión en una frase, no el tema",
    "bajada": "Dos líneas: qué encontramos y cómo leer el árbol",
    "metrica_detalle": "Qué se mide, con cuántas respuestas y cuándo, en palabras simples",
    "alternativa": "La explicación alternativa contada simple",
    "lectura_titulo": "Antes de decidir qué hacer, nos falta saber esto",
    "lectura": "Qué haríamos según lo que aparezca",
    "a_conseguir": ["Lo que falta saber, sin nombres de tablas ni herramientas"],
    "pie": "Fuentes en palabras simples y quién lo armó"
  }
}
```

## Campos

- `tipo` de evidencia: `entrevistas`, `tickets`, `health`, `analytics` o `campo`.
- `urgencia`: `alta`, `media` o `baja`, según la consecuencia (criterio en `SKILL.md`).
- `vinculo_outcome.estado`: `dato` si hay evidencia de que la oportunidad mueve el outcome, `hipotesis` si no.
- `control`: `alto` (lo resuelve el producto o el servicio propio), `medio` (depende en parte de un tercero), `bajo` (depende de un tercero o de regulación).
- `prioridad`: `true` en las que se atacan primero. Exigen dos soluciones o más, cada una con `supuesto` y `como_testear`.
- La certeza no se escribe: la calcula el script con los tipos de fuente.
- `outcome.comparacion`: opcional, para outcomes que comparan dos grupos con NPS. Va con los números crudos; el script calcula la diferencia, el intervalo (solo en repositorio) y el veredicto en palabras simples (en presentar).
- `fuente_simple` y el bloque `presentar`: obligatorios solo para la versión de presentar. Sin IDs, sin nombres de tablas ni de herramientas internas.

## Cómo calcula la certeza el script

| Tipos de fuente distintos | Resultado |
|---|---|
| Ninguno | Hipótesis |
| Uno (aunque sean varias piezas) | Indicio |
| Dos | Patrón |
| Tres o más, con al menos uno de voz y uno de comportamiento | Evidencia sólida |
| Tres o más, sin voz o sin comportamiento | Patrón |

Voz: `entrevistas`, `tickets`, `health`. Comportamiento: `analytics`, `campo`.

## Escalera de por qués

Opcional en cada oportunidad prioritaria: `"porques": [{"pregunta": "¿Por qué...?", "respuesta": "...", "evidencia": ["EV1"]}, {"pregunta": "...", "respuesta": "sin verificar desde acá", "verificar": "Pregunta de investigación"}]`. El script todavía no la dibuja: va en el `.md` del repositorio y en la entrega en el chat.
