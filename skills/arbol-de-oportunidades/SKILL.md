---
name: arbol-de-oportunidades
description: "Arma un árbol de oportunidades (métrica, outcome, oportunidades, soluciones) a partir de evidencia real y trazable: entrevistas, reclamos, encuestas, analítica y observación de campo. Cada oportunidad dice qué fuentes la sostienen, con qué certeza, para qué actor y en qué momento del servicio; las prioritarias bajan con una escalera de por qués hasta la causa, y cada solución trae su supuesto y cómo probarlo. Sale en HTML para presentar al equipo o en Markdown y JSON para el repositorio. Usar cuando pidan un árbol de oportunidades, priorizar problemas u oportunidades, pasar de hallazgos a oportunidades, explicar qué mueve una métrica (NPS, CSAT, conversión, retención), encontrar la causa raíz de un dolor, armar la apertura o el cierre de un discovery, o '¿qué hacemos con todo esto?' después de una síntesis."
---

# Árbol de oportunidades con evidencia

Un backlog lista funcionalidades; el árbol lista problemas, colgados de un resultado de negocio. Esta skill lo arma con una regla: ninguna oportunidad se sostiene en el tono de un comentario ni en números inventados. Cada nodo dice de dónde sale, y lo que no tiene evidencia queda escrito como hipótesis.

No repite la síntesis. Consume lo que ya produjeron otras skills y lo ordena.

Principios del paquete en `references/principios.md`. Escala de certeza en `references/certeza-y-muestras.md`.

## Cuándo usarla y cuándo no

- **Sí:** al abrir un discovery (con oportunidades como hipótesis), al cerrarlo (con evidencia por nodo), para priorizar problemas o explicar qué mueve una métrica.
- **No:** para listar funcionalidades ni para priorizar conceptos ya ideados (va `priorizacion-de-conceptos`).

## Los cuatro niveles

| Nivel | Qué es | Quién lo escribe |
|---|---|---|
| 1. Métrica | El número de negocio que importa, con línea base, período y fuente | La persona. Claude propone, la persona confirma |
| 2. Outcome | El cambio de comportamiento o experiencia que mueve la métrica, medible | La persona. Claude propone, la persona confirma |
| 3. Oportunidades | Necesidades o dolores que, resueltos, mueven el outcome | Claude, desde la evidencia |
| 4. Soluciones | Ideas concretas para cada oportunidad prioritaria, con su supuesto | Claude propone, el equipo decide |

## Qué necesita para arrancar

Métrica y outcome (o material para proponerlos) y evidencia ya procesada.

Según cómo llega el pedido (principio P1):

- **Completo:** armar y frenar donde se decide.
- **Con huecos:** si falta la métrica o el outcome, proponerlos y hacer una sola pregunta para confirmarlos.
- **De alguien que arranca:** explicar en una línea la idea ("colgamos los problemas de la gente de un número que le importa al negocio, y cada problema dice qué tan seguros estamos") y armar los dos primeros niveles juntos.

## Térmica

| Si falta esto | Saltar a |
|---|---|
| Métrica y outcome | `encuadre-del-problema`, bloque C |
| Evidencia de entrevistas | `sintesis-de-entrevistas` o `sintesis-de-campo` |
| Evidencia de datos (reclamos, encuestas, analítica) | `evidencia` |
| Las oportunidades están y hay que idear | `ideacion` |
| Las soluciones están y hay que elegir cuál probar | `priorizacion-de-conceptos` |

## Fuentes

| Tipo | De dónde | ID que se conserva |
|---|---|---|
| `entrevistas` | `sintesis-de-entrevistas` o `sintesis-de-campo` | Consolidado `DC12` y dolor `E13-D4` |
| `tickets` | `evidencia`: subtemas cuantificados de reclamos | Subtema y números de caso |
| `health` | `evidencia`: NPS, CSAT, resolución | Encuesta, corte, período |
| `analytics` | Analítica de producto, embudos, eventos | Reporte o evento, período |
| `campo` | `plan-de-observacion`, datos operativos del lugar | Sesión y fecha |

Voz: entrevistas, tickets, health. Comportamiento: analytics, campo. Si una fuente no está, no se reemplaza con suposiciones: va a "evidencia a conseguir".

## Proceso

### 1. Encuadre

Métrica y outcome confirmados, con línea base. Antes de seguir, escribir las explicaciones alternativas del outcome: qué otra cosa podría mover la métrica que no sea un problema de la experiencia. Si una es plausible y testeable, va primera en "evidencia a conseguir".

### 2. Normalizar la evidencia

Una fila por pieza, con ID propio (`EV1`, `EV2`) y el ID de origen. El ID viaja por todos los pasos. Si la base es grande, procesar en bloques de 50 a 100 y consolidar al final, arrastrando los IDs.

### 3. Clasificar

Cada pieza se lee como una necesidad, no como una queja:

- **Necesidad en voz del usuario:** "Quiero enterarme a tiempo de que se liberó mi lugar", no "Problemas de notificaciones".
- **Actor:** quien usa el servicio, quien lo opera, quien lo paga, un equipo interno.
- **Momento del servicio:** el del journey o blueprint, para ubicar la oportunidad en el mapa.
- **Urgencia por consecuencia, nunca por tono:** alta deja a la persona sin el servicio, le hace perder plata o datos, o no tiene salida; media obliga a un contacto o un esfuerzo extra; baja es molestia sin consecuencia.

### 4. Consolidar oportunidades

Agrupar por necesidad compartida (misma causa, no mismo síntoma). Para cada una: frecuencia, fuentes y tipos, IDs, una cita o caso representativo, certeza y vínculo con el outcome.

El vínculo con el outcome se declara aparte: una oportunidad puede tener evidencia sólida de que existe y ninguna de que mueve este outcome. Entonces el vínculo es hipótesis y se dice qué lo probaría. Una contradicción entre fuentes es un hallazgo.

**Freno.** Mostrar las oportunidades en una tabla corta (necesidad, actor, momento, certeza, IDs) y esperar el ok. Agrupar es la decisión de criterio del árbol.

### 5. Priorizar

Por escrito, para cada oportunidad:

1. ¿Cuánta evidencia hay y de cuántas fuentes distintas?
2. ¿Hay datos que la vinculen con el outcome, o es hipótesis?
3. Si la resolvemos, ¿cuánto nos acerca a la métrica?
4. ¿Cuánto control tenemos? ¿La resuelve el servicio propio o depende de terceros?

Un puntaje numérico solo si hay métricas de salud reales detrás, con su intervalo calculado (`scripts/intervalo.py` de `evidencia`). Nunca importancia ni satisfacción estimadas por la IA.

### 6. Escalera de por qués

Para cada oportunidad prioritaria, antes de proponer soluciones, bajar hacia la causa:

- Cada "¿por qué?" se responde solo con evidencia, citada.
- Si la evidencia muestra dos causas, la escalera se abre en dos ramas.
- **Regla de corte:** cuando la respuesta sería una suposición, esa rama termina con "sin verificar desde acá" y la pregunta de investigación que lo verificaría.
- Cuatro escalones con evidencia valen más que cinco con el quinto inventado.
- Marcar el nivel en el que conviene resolver: lo bastante profundo para que no se repita, lo bastante cerca para que este equipo lo pueda tocar.

### 7. Soluciones

Al menos dos por oportunidad prioritaria, distintas entre sí. Cada una con su supuesto y cómo se prueba, barato y antes de construir. Una prueba que solo puede salir bien no es una prueba. Todas las soluciones son hipótesis: el árbol no las valida.

Antes de proponerlas, verificar con el dueño del sistema qué existe para esa oportunidad y clasificar: no existe, existe y no lo saben, existe y no les sirve, o no es de este sistema. Si existe, al menos una solución es de adopción y su supuesto es por qué no llegaba. Detalle en `creador-de-contenido`, "La repregunta del dueño".

Para ampliar las soluciones más allá de las obvias, `ideacion`.

### 8. Elegir la versión y generarla

Dos versiones del mismo árbol. Si el pedido no dice cuál, preguntar una vez: "¿Lo querés para presentarle al equipo o para guardar en el repositorio?".

| | Presentar | Repositorio |
|---|---|---|
| Para quién | Todo el equipo, sin formación en research ni estadística | El repositorio del proyecto y los agentes que lo consultan |
| Formato | HTML interactivo | Markdown, más el `arbol.json` |
| Lenguaje | Llano: "problemas de la gente", "ideas para probar" | Técnico: outcome, certeza, urgencia, control |
| IDs y orígenes | No aparecen | Todos |
| Comparaciones | Veredicto en una frase | Valores, respuestas e intervalo del 95% |

Para presentar, completar el bloque `presentar` de `arbol.json` y la `fuente_simple` de cada evidencia. El titular es la conclusión, no el tema.

Si el outcome compara dos grupos con NPS, cargar los números crudos en `outcome.comparacion`. El script calcula la diferencia y si se distingue del ruido.

```bash
python <carpeta de esta skill>/scripts/arbol.py arbol.json --version presentar --out arbol.html
python <carpeta de esta skill>/scripts/arbol.py arbol.json --version repositorio --out arbol.md
python <carpeta de esta skill>/scripts/arbol.py arbol.json --version presentar --modo apertura --out apertura.html
```

El script calcula la certeza por tipos de fuente, marca como hipótesis lo que no tiene evidencia y frena si falta algo: métrica sin línea base, IDs que no existen, oportunidad prioritaria con menos de dos soluciones o sin supuesto, urgencia sin valor, textos para el equipo sin completar, rayas largas.

Nombres: la convención de `contexto.md` o `Arbol_{Tema}_{Proyecto}` con `.html`, `.md` y `.json`.

## En un discovery

- **Apertura:** niveles 1 y 2, y las oportunidades como hipótesis de partida (`--modo apertura`). Es lo que se sale a validar.
- **Cierre:** el mismo árbol con evidencia por nodo. Lo que más vale mostrar es qué cambió: qué se confirmó, qué cayó y qué apareció que nadie esperaba.

## Formato de salida

El archivo elegido y, en el chat, solo esto:

```
Árbol | [métrica] -> [outcome]
[N] oportunidades | [n] patrón o más | [n] indicio | [n] hipótesis
Prioridad: [O#, O#] | por qué en una línea
Causa a atacar: [nivel de la escalera de por qués]
Antes de comprometer: [la evidencia a conseguir que más cambia la decisión]
```

Tomar posición: qué oportunidad atacar primero y con qué costo.

## La regla que no se negocia

Ninguna oportunidad sin evidencia rastreable, y ningún escalón de la escalera de por qués sin evidencia. Lo que no tiene, queda como hipótesis con nombre.

## Errores que existe para evitar

- Priorizar por el tono de los comentarios en lugar de por la consecuencia.
- Un outcome que es una solución ("lanzar la funcionalidad X").
- Dar por hecho que una oportunidad mueve el outcome porque existe.
- Resolver el síntoma porque la escalera se cortó en el primer por qué.
- Proponer construir algo que ya existe y nadie usa.

## Referencias

- `references/formato.md`: estructura de `arbol.json`.
- `references/ejemplo-ficticio.json`: un árbol completo de un caso inventado.
- `references/principios.md` y `references/certeza-y-muestras.md`: principios del paquete.
