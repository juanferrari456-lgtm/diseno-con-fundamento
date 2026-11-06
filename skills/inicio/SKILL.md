---
name: inicio
description: "Puerta de entrada al paquete Diseño con fundamento: arma el archivo contexto.md de la organización con una entrevista corta (rubro, a quién sirve, fuentes de evidencia, quién hace cada paso, convenciones, datos personales y vocabulario) y orienta sobre qué skill usar para la tarea. Usar la primera vez que se usa el paquete, cuando alguien pregunta por dónde empezar, qué hace cada skill o cómo se conectan, cuando cambia la organización o el equipo, o cuando otra skill necesita contexto que no existe."
---

# Inicio

Dos trabajos: armar `contexto.md`, el archivo que lee todo el paquete para no preguntar lo mismo en cada tarea, y orientar a quien no sabe por qué skill empezar. Ninguna skill necesita `contexto.md` para funcionar; con él preguntan menos y se equivocan menos.

Principios del paquete en `references/principios.md`. Escala de certeza y muestras en `references/certeza-y-muestras.md`.

## Cuándo usarla y cuándo no

- **Sí:** la primera vez; cuando alguien pregunta "¿por dónde empiezo?" o "¿qué skill uso para esto?"; cuando cambia la organización, el equipo o las fuentes; cuando otra skill pide contexto que no está.
- **No:** para encuadrar un pedido puntual (va `encuadre-del-problema`) ni para relevar en detalle las fuentes de una pregunta concreta (va `evidencia`). `inicio` registra qué fuentes existen; `evidencia` decide cuáles sirven para una pregunta.

## Qué necesita para arrancar

Nada. Si ya existe `contexto.md`, leerlo y ofrecer actualizar solo lo que cambió.

Según cómo llega el pedido (principio P1):

- **Completo** (pega un documento sobre su organización, o la plantilla a medio llenar): extraer lo que haya, mostrar lo que falta y preguntar solo eso.
- **Con huecos:** recorrer los bloques en orden, una pregunta por vez, saltando lo que ya se sabe.
- **De alguien que arranca:** explicar en una línea para qué sirve ("es una ficha de tu organización para que las skills no te pregunten lo mismo cada vez") y preguntar con opciones, no con preguntas abiertas.

## Térmica

| Si pasa esto | Saltar a |
|---|---|
| La persona trae un pedido concreto ("me pidieron una encuesta") | Armar solo el bloque 1 y pasar a `encuadre-del-problema` |
| Quiere saber qué datos sirven para una pregunta puntual | `evidencia` |
| Trae una transcripción o un documento para convertir | `markdown-converter` |
| Otra skill la llamó por falta de contexto | Armar solo el bloque que esa skill necesita y volver |

## Proceso

### 1. Entrevista por bloques

Siete bloques, en este orden. En cada uno, de una a tres preguntas. Si la persona no sabe, queda `[SIN DATO]` y se sigue: no se completa con suposiciones.

1. **Qué hacemos y para quién.** Rubro, si sirve a personas, a empresas o a los dos, los lados del servicio y los canales. Opciones para quien arranca: "¿la gente compra, reserva, se suscribe, pide algo, hace un trámite?".
2. **Fuentes de evidencia.** Recorrer los seis tipos en lenguaje llano:

   | Tipo | Pregunta | Ejemplos, nunca requisito |
   |---|---|---|
   | Voz | ¿Hay algún lugar donde la gente escribe o cuenta lo que le pasa? | Reclamos, encuestas, reseñas, entrevistas previas, redes |
   | Comportamiento | ¿Hay algún lugar donde se ve qué hace la gente, aunque no lo diga? | Analítica de producto o web, embudos, grabaciones de sesión, logs |
   | Operativo | ¿El negocio registra lo que pasa en la operación? | Ventas, pedidos, tiempos, accesos, turnos, stock |
   | Salud | ¿Se mide si la gente queda conforme o vuelve? | NPS, CSAT, recompra, bajas |
   | Contexto | ¿Qué se sabe de quién es cada persona? | Antigüedad, segmento, plan, región |
   | Observación | ¿Alguien del equipo puede ir a ver el servicio funcionando? | Visitas, acompañar a un empleado, ir a un local o a un evento |

   Para cada fuente que exista: herramienta, quién da acceso y si la puede consultar sola. Las herramientas se anotan como las nombra la persona; nunca se sugiere una en particular. Lo que no hay queda escrito como evidencia que falta, no como un fracaso.
3. **Quién hace cada paso.** Reclutar, guía, entrevistar, observar, encuestas, análisis de datos. Preguntar también por las excepciones: cambia según la iniciativa, el lugar, si es virtual o presencial y la disponibilidad de otros equipos (P3).
4. **Convenciones.** Cómo nombran los archivos (si no hay, ofrecer la de `markdown-converter`) y dónde se guardan los entregables.
5. **Vigencia.** `UMBRAL_VIGENCIA`: cuánto tiempo puede tener una fuente antes de tratarla como posiblemente desactualizada. Explicarlo con un ejemplo ("una encuesta de hace dos años, ¿la seguirías usando para decidir?"). Si la persona no lo tiene definido, queda `[SIN DATO]` y se sugiere acordarlo con el equipo: es una decisión de criterio, no un valor técnico.
6. **Datos personales.** Qué reglas tiene la organización, qué no puede salir de ella y si las entrevistas se graban con consentimiento.
7. **Vocabulario propio.** Siglas y nombres internos que aparecen en las conversaciones, con su significado.

### 2. Freno: mostrar antes de guardar

Mostrar `contexto.md` completo, con los `[SIN DATO]` a la vista, y preguntar si algo está mal. Recién después guardarlo donde la persona trabaje: carpeta del proyecto, archivos del proyecto de Claude o donde diga `contexto.md` en Convenciones.

### 3. Orientar

Cerrar con el mapa del paquete (abajo) y una recomendación concreta: "con lo que me contaste, yo arrancaría por X". Una sola, no la lista entera.

## Mapa del paquete

| Si tenés esto | Usá |
|---|---|
| Un pedido, un brief o una idea de solución | `encuadre-del-problema` |
| Muchos actores y no está claro quién decide | `mapa-de-stakeholders` |
| Una pregunta y querés saber qué datos la responden | `evidencia` |
| Hay que salir a entrevistar | `guia-de-entrevista`, `muestra-y-reclutamiento` |
| Hay que ir a ver el servicio funcionando | `plan-de-observacion` |
| Transcripciones de entrevistas | `sintesis-de-entrevistas` |
| Entrevistas y observación terminadas, falta el veredicto | `sintesis-de-campo` |
| Una reunión grabada | `sintesis-de-reuniones` |
| Hallazgos y querés saber para quién diseñar | `arquetipos` |
| Muchos problemas y hay que elegir cuál atacar | `arbol-de-oportunidades` |
| Un servicio para mapear de punta a punta | `pensar-blueprints`, después `service-blueprint-json` |
| Un problema elegido y hay que generar ideas | `ideacion` |
| Varias ideas y hay que elegir | `priorizacion-de-conceptos` |
| Una idea elegida y hay que probarla | `prueba-de-conceptos` |
| Hay que contar lo que se hizo | `creador-de-contenido`, después `creador-de-ppt` |
| Un PDF, deck, planilla o audio para pasar a texto | `markdown-converter` |

## Formato de salida

`contexto.md` con la estructura de `references/contexto-plantilla.md`. Ver un ejemplo completo en `references/contexto-ejemplo-ficticio.md`.

## La regla que no se negocia

`contexto.md` describe la organización, no a personas: no lleva datos de clientes, usuarios ni casos. Lleva roles ("líder de atención"), no nombres, salvo que la persona pida lo contrario para su uso interno.

## Errores que existe para evitar

- Preguntar todo de golpe y que la persona abandone a la tercera pregunta.
- Completar huecos con lo que "seguramente" pasa en una organización de ese rubro.
- Sugerir herramientas como si fueran requisito.
- Fijar `UMBRAL_VIGENCIA` por la persona en vez de dejarlo como decisión del equipo.
- Terminar con la lista de 20 skills en vez de decir por cuál empezar.

## Referencias

- `references/contexto-plantilla.md`: la plantilla vacía.
- `references/contexto-ejemplo-ficticio.md`: una organización ficticia completa.
- `references/principios.md` y `references/certeza-y-muestras.md`: principios del paquete.
