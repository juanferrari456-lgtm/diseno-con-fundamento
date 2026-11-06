# Conexiones con las otras skills del paquete

Esta skill está en el medio de la cadena. Recibe evidencia procesada por otras y
le entrega un modelo pensado a las que representan, priorizan o presentan.

```
encuadre-del-problema    -+
sintesis-de-entrevistas  -+
sintesis-de-campo        -+
plan-de-observacion      -+->  pensar-blueprints  ->  plugin de FigJam (lee el modelo directo)
arquetipos               -+          |            ->  arbol-de-oportunidades
evidencia                -+          |            ->  creador-de-contenido, creador-de-ppt
sintesis-de-reuniones    -+          +->  registro de dolores y oportunidades
```

## Lo que entra

| Skill | Qué aporta | Cómo se usa |
|---|---|---|
| `encuadre-del-problema` | Pregunta, decisión, qué llegó decidido | `arquitectura.encuadre`. Freno si no viene encuadrado |
| `sintesis-de-entrevistas` | `corpus.json`, fichas, consolidados, contradicciones | `corpus.js query` y sección 02 de las fichas. Los códigos `E` son las fuentes |
| `sintesis-de-campo` | Tablero de hipótesis, segmentos, contraste con blueprints anteriores, espejos | Segmentos de la arquitectura y qué confirmar, cambiar o matizar |
| `evidencia` | Reclamos, NPS, datos operativos | `dato` en el momento que miden, con su fuente |
| `sintesis-de-reuniones` | Decisiones de alcance tomadas en reuniones | Encuadre y fuera de alcance. Rara vez acciones |
| `plan-de-observacion` | Hojas de registro por momento y puesto | Acciones de frontstage y backstage, con la sesión como fuente |
| `arquetipos` | Arquetipos con sus participantes | Segmentos de la arquitectura |

## Lo que sale

| Skill | Qué toma del modelo | Qué no tiene que rehacer |
|---|---|---|
| `arbol-de-oportunidades` | Dolores y oportunidades con momento, fuente y segmento | La trazabilidad: ya viene con cada hallazgo |
| Plugin de FigJam "Blueprint from .json" | La carpeta entera: `arquitectura.json` y un archivo por blueprint | Nada: lee `pbp/1` tal como es, sin traducir |
| `service-blueprint-json` | Solo si hace falta un `.bp.json` a mano (sin modelo, o para retocar un board) | El pensamiento: ya está en el modelo |
| `creador-de-contenido` | `ARQUITECTURA.md`, momentos de la verdad, preguntas | La lógica del recorrido |
| Registro de dolores | Los P y O nuevos, con blueprint y momento | Nada: el registro numera y el modelo referencia |

## Quién numera qué

Un prefijo, un dueño. Si dos lugares numeran lo mismo, se desincronizan.

| Id | Qué es | Quién numera |
|---|---|---|
| `E13` | Entrevista | La ficha, vía `corpus.json` |
| `DC12` | Dolor consolidado | `corpus.json` |
| `P12`, `O12` | Dolor y oportunidad de síntesis | El registro de dolores |
| `BP2` | Blueprint | `arquitectura.json` |
| `BP2.m4` | Momento de un blueprint | El archivo del blueprint |
| `C1`, segmentos | Etapa del ciclo y segmento | `arquitectura.json` |

Los momentos se citan siempre con su blueprint: `BP2.m4`, nunca `m4` suelto
fuera de su archivo. Un id dado de baja no se reutiliza.

## Representación visual

El plugin de FigJam "Blueprint from .json" lee este modelo directo, desde su
build 14. Se sueltan juntos `arquitectura.json` y los archivos de cada
blueprint: la arquitectura se usa como catálogo (actores, canales, segmentos,
postas) y se dibuja como portada del discovery, y cada blueprint se dibuja con
su recorrido como grafo (`sigue` y `va_a`), las fuentes en cada tarjeta, lo
inferido con borde punteado, el pensamiento, la emoción y el tiempo dentro de la
tarjeta del cliente, y fallas, momentos de la verdad, regulaciones, preguntas y
postas en sus bandas.

No hace falta pasar por `service-blueprint-json`. Esa skill queda para cuando
no hay modelo y se arma un `.bp.json` a mano.

La regla sigue igual: lo que el plugin no pueda mostrar es un problema del
plugin y se resuelve ahí, nunca recortando o deformando el modelo.
