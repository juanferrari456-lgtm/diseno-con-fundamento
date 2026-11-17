# Bloque FigJam

El bloque lo genera `corpus.js figjam` desde las tablas de la ficha. Estas reglas
existen para que **la ficha nazca con líneas que sirvan de sticky**, y el script
no tenga nada que arreglar.

FigJam corta el texto pegado por saltos de línea: cada línea es un sticky.

## Reglas de forma

- Una idea por línea. Nunca dos unidas por "y" o por coma.
- Menos de 110 caracteres, apuntar a menos de 90. Un sticky se lee de un vistazo
  o no se lee.
- Sin viñetas, sin guiones al inicio, sin numeración, sin negritas, sin markdown.
- Cada línea cierra con el código entre corchetes: `[E13]`. Si viene de varios,
  `[E01 E03 E05]`.
- Semáforo al inicio solo en dolores y solo si hay severidad con evidencia.
- Sin nombres propios de entrevistados. Los boards se comparten.
- Todo dentro de un único bloque de código, sin comentarios adentro.

## Reglas de redacción

Voz impersonal, como una nota tomada a mano durante la sesión. Sin sujeto
personal, sin segunda persona, sin voz de informe.

- No usar "el usuario siente", "el entrevistado manifiesta", "se pudo observar".
- No usar relleno: "cabe destacar", "es importante mencionar".
- No usar `—` ni `·`. Para separar dentro de una línea, `|`, `-` o coma.
- Sin adjetivos valorativos sin dato atrás: "crítico", "enorme". La severidad la
  lleva el semáforo.
- Preferir el sustantivo concreto del entrevistado antes que la categoría
  genérica: "la planilla" antes que "el sistema de gestión".
- Los dolores se escriben como qué pasa, no como qué habría que hacer.

## Línea buena contra línea mala

```
MAL   El entrevistado manifestó que existe una problemática crítica en el proceso de acreditación
BIEN  🔴 Lista de invitados se reenvía por WhatsApp a la puerta el día del evento [E03]

MAL   Habría que implementar un sistema centralizado de gestión de invitados
BIEN  Pedido explícito: cargar la lista una sola vez y que la puerta la vea sola [E03]

MAL   Se detectaron múltiples ineficiencias en la carga manual de datos
BIEN  636 butacas de cortesía se distribuyen a mano, partido por partido [E13]
```

## Los dos bloques

`figjam E13` arma el de una entrevista, con sus columnas: contexto, dolores,
workarounds, datos duros, pedidos, vacíos. Es el que se usa en caliente, el día
de la sesión.

`figjam --proyecto` arma el de cierre de campo: dolores por recurrencia, con el
conteo y los códigos que lo mencionaron. Es el que ordena la priorización, porque
un dolor que dijeron cinco de quince perfiles no se discute igual que uno que
dijo uno solo.
