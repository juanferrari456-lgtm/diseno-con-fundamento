# La minuta de reunión

Un archivo por reunión, escrito una vez. Es la fuente del seguimiento. Las doce
secciones son fijas y el script las parsea por número: no cambiar encabezados ni
orden de columnas. No usar `|` dentro de una celda (parte la fila). Si una
sección no tiene contenido, dejar el encabezado y una línea `- Sin registro.`

## Plantilla

```markdown
# Reunión R0N | [Tema corto]

| | |
|---|---|
| Iniciativa | [Nombre de la iniciativa] |
| Fecha | [DD/MM/AAAA] |
| Duración | [mm] min |
| Tipo | [kickoff / alineación / seguimiento / priorización / decisión / retro / working session] |
| Participantes | [Nombre Apellido (área o rol), Nombre Apellido (área o rol)] |
| Convocó | [nombre] |
| Fuente | [transcripción automática (Meet, Zoom, Teams u otra) / notas / resumen automático sin transcripción] |
| Modo | [Encadenada / Suelta] |

## 01. Para qué fue la reunión
- [objetivo declarado al inicio, o [INFERENCIA] si nadie lo dijo]

## 02. Qué cambió
Tres a cinco líneas. Lo que alguien que no estuvo necesita saber: qué se decidió,
qué quedó trabado, qué cambió respecto de la reunión anterior. No es un índice
de temas tratados.
- [línea]

## 03. Decisiones
| # | Decisión | Decidió | Reemplaza o ajusta | Evidencia |
|---|---|---|---|---|
| DEC1 | [qué queda definido, en afirmativo] | [persona o "acuerdo del grupo"] | [vacío, R0N-DEC# o Ajusta R0N-DEC#] | [12:40] "[cita corta del cierre]" |

## 04. Acciones
| # | Acción | Dueño | Plazo | Evidencia |
|---|---|---|---|---|
| A1 | [verbo en infinitivo + objeto + destinatario] | [Nombre o [SIN DUEÑO]] | [DD/MM/AAAA o [SIN PLAZO]] | [18:05] IR |

## 05. Seguimiento de lo anterior
Solo en modo encadenado. En suelta: `- No aplica, reunión suelta.`
| ID | Estado | Novedad | Evidencia |
|---|---|---|---|
| R02-A3 | Hecha | [qué se dijo] | [03:10] VO |

## 06. Temas abiertos
| # | Tema | Lo tiene | Evidencia |
|---|---|---|---|
| T1 | [pregunta o definición pendiente] | [Nombre o [SIN DUEÑO]] | [25:30] |

## 07. Riesgos y bloqueos
| # | Riesgo o bloqueo | Depende de | Evidencia |
|---|---|---|---|
| K1 | [qué puede pasar o qué frena] | [área, persona o proveedor] | [31:00] |

## 08. Datos, fechas y cifras
| Dato | Valor | Contexto | Evidencia |
|---|---|---|---|

## 09. Posiciones
Qué planteó cada área o persona sobre el tema en discusión, cuando hubo más de
una postura. Posición sobre el tema, nunca sobre la persona.
- [Área o persona]: [postura] [marca]

## 10. Contexto nuevo
Antecedentes, actores, sistemas, proveedores o restricciones que aparecen por
primera vez y sirven para entender la iniciativa.
- [hecho] [marca]

## 11. Vacíos e inferencias
- [NO DEFINIDO] [algo que la reunión necesitaba cerrar y no cerró]
- [NOMBRE A CONFIRMAR] [nombre como vino en la transcripción] | [a quién se cree que refiere]
- [INFERENCIA] [lectura propia] | base: [qué la sostiene]
- [CONTRADICCIÓN] [qué choca con R0N-DEC#] | base: [frase]
- [HEREDADA] [qué llegó decidido] | decidió: [quién o NO DICHO] | se puede reabrir: [sí, no o NO DICHO]

## 12. Personas
Toda persona nombrada en la reunión, participe o no. Solo rol o área de trabajo.
| Nombre | Variantes en transcripción | Rol o área |
|---|---|---|
| [Nombre Apellido] | [cómo la escribió la transcripción, separado por coma] | [rol o área] |
| [A CONFIRMAR] [como vino] | [otras variantes] | [lo que se sabe] |
```

## Qué es cada cosa

La mayor fuente de error en una minuta es inflar: convertir conversación en
compromisos que nadie tomó. Una minuta que dice que algo se decidió cuando no se
decidió es peor que no tener minuta, porque alguien va a actuar sobre ella.

**Decisión.** Hay cierre explícito: alguien con capacidad de decidir lo dice
("vamos con eso", "queda así", "lo aprobamos") o el grupo acuerda y nadie
objeta después de que se formula. Si alguien propone y la conversación sigue
sin cierre, es tema abierto con la propuesta adentro, no decisión. Si se
decidió con condición ("si Comercial confirma, vamos con B"), la condición va en
el texto de la decisión.

**Acción.** Alguien la tomó ("yo lo mando", "lo veo con Laura") o se la
asignaron y no la rechazó. "Habría que ver X" sin que nadie lo tome es tema
abierto con `[SIN DUEÑO]` en Lo tiene, no acción. Dueño es una persona, no un
área, salvo que la transcripción solo nombre el área.

**Plazo.** Solo si se dijo. Plazos relativos se convierten a fecha con la fecha
de la reunión y conservan la frase: `02/10/2026 ("para el viernes")`. "Lo antes
posible" queda `[SIN PLAZO]`.

**Tema abierto.** Pregunta que la reunión dejó planteada, definición pendiente,
propuesta sin cierre, información que alguien tiene que conseguir sin que
nadie se haya comprometido.

**Decisión heredada.** Algo que se presenta como ya decidido antes de la reunión
("ya está aprobado", "eso lo definió Producto", "la herramienta es X"). No es una
decisión de esta reunión, así que no va a la 03: va a la 11 como `[HEREDADA]`, con
quién la tomó y si se puede reabrir, solo si se dijo. Importa porque el resto la toma
como fija sin saber con qué contexto se tomó. En kickoffs y priorizaciones, buscarlas
siempre.

**Riesgo o bloqueo.** Algo que puede hacer fallar o demorar la iniciativa, o que
ya la está frenando, dicho en la reunión. No agregar riesgos propios: esos van a
la 11 como `[INFERENCIA]`.

## Seguimiento de lo anterior (sección 05)

`init` imprime la lista de abiertos de la cadena. Recorrer la transcripción con
esa lista al lado y registrar solo lo que se mencionó. Lo que no se mencionó no
se escribe: el script lo cuenta solo como "reuniones sin mención".

Estados válidos:

| Tipo | Siguen abiertos | Se cierran |
|---|---|---|
| Acción (A) | En curso, Bloqueada | Hecha, Cancelada |
| Tema (T) | Sigue abierto | Resuelto, Descartado |
| Riesgo (K) | Vigente, Materializado | Mitigado, Descartado |

Si un tema se resuelve con una decisión nueva, cerrarlo como Resuelto y poner el
ID de la decisión en Novedad: `Resuelto | ver R04-DEC2`.

Una decisión nueva que se relaciona con una anterior tiene tres opciones en la
columna Reemplaza o ajusta:

| Caso | Se escribe | Qué pasa con la anterior |
|---|---|---|
| La anula o la cambia entera | `R01-DEC2` | Pasa a Decisiones reemplazadas |
| Cambia el foco, el alcance o una parte, pero no la anula | `Ajusta R01-DEC2` | Sigue vigente, con la nota "ajustada por" |
| Choca con ella sin decir que la cambia | vacío | `[CONTRADICCIÓN]` en la 11 y a Preguntas |

Ante duda entre reemplazar y ajustar, ajustar: dar de baja una decisión que
seguía viva es peor que dejar viva una que murió, porque la segunda se ve en el
seguimiento y alguien la marca.

## Evidencia

La marca es el ancla. Con transcripción: `[mm:ss]` o `[hh:mm]` de la marca más
cercana, más las iniciales del hablante cuando importa quién lo dijo. Sin marcas
de tiempo: iniciales. Decisiones siempre con cita corta del momento de cierre.
En contexto y posiciones alcanza con la marca.

Si la fuente es solo un resumen automático o notas sin transcripción, poner `[notas]` como
evidencia y declarar en la 11 que no hubo transcripción para verificar.

## Resumen automático

Las herramientas de transcripción suelen traer un resumen y "próximos pasos"
generados. No son evidencia: convierten propuestas en compromisos y asignan
dueños que nadie aceptó. Leer la transcripción y usar el resumen, como mucho, para no perder un
tema. Si el resumen dice algo que la transcripción no sostiene, no entra.

## Nombres

La transcripción automática deforma los nombres propios de forma sistemática, y
la lista de asistentes puede venir incompleta. Normalizar con
este orden:

1. El glosario que imprime `init`: cada persona con las variantes con que ya
   apareció en transcripciones anteriores ("Lau", "Laura" = Laura Ficticia).
2. Lo que el usuario dijo en el chat y lo que ya se sabe del equipo en la
   conversación.
3. La lista de asistentes del archivo.

Si no se puede resolver, dejar el nombre como vino, sumarlo a la 12 como
`[A CONFIRMAR] Diego` y a la 11 como `[NOMBRE A CONFIRMAR]`. Nunca inventar un
apellido. Cuando el usuario confirma, corregir la fila de la 12 con el nombre
real y la variante: así la próxima reunión ya lo reconoce.

La sección 12 es lo que hace crecer el glosario. Registrar toda variante nueva
aunque el nombre ya esté: la próxima transcripción puede deformarlo igual.

En minutas internas los nombres van completos: la minuta vive en la carpeta de
la iniciativa y las acciones necesitan dueño.

## Qué no entra

- Charla social, chistes, comentarios personales, temas de salud o de la vida
  privada de alguien, aunque estén en la transcripción.
- Juicios sobre personas. "Marta se resistió" no; "Marta planteó que no hay
  capacidad este trimestre" sí.
- Comentarios sobre alguien que no estaba en la reunión, salvo que sean un dato
  de la iniciativa (su rol, qué tiene que aprobar).
- Temas de otra iniciativa que aparecieron de pasada: una línea en 10 si
  sirven, nada más.

## Redacción

Las líneas de 02, 03, 04, 06 y 07 tienen que poder leerse solas, fuera de la
minuta, porque el seguimiento las copia sueltas.

- Una idea por línea, menos de 110 caracteres (apuntar a 90).
- Decisión en afirmativo, como lo que queda definido.
- Acción empieza con verbo en infinitivo y dice a quién o para qué.
- Voz impersonal. Nada de "se habló de", "se conversó sobre", "el equipo manifestó".
- Sin markdown adentro de celdas, sin raya larga (em dash o en dash) ni punto medio, sin adjetivos valorativos.
- Mantener el vocabulario de la reunión: "la planilla" queda "la planilla".

```
MAL   Se conversó sobre la importancia de alinear criterios con Producto
BIEN  Producto define el alcance del MVP antes del 10/10; diseño no arranca el blueprint hasta entonces

MAL   Ana va a ver el tema del proveedor
BIEN  Pedir al proveedor de la app de reservas el costo de sumar lista de espera
```
