# La ficha de entrevista

Un archivo por entrevista, escrito una vez. Es la única fuente del corpus. Las
diez secciones son fijas y el script las parsea por número: no cambiar
encabezados ni orden de columnas. No usar `|` dentro de una celda (parte la fila).

## Plantilla

```markdown
# Entrevista E0N | [Perfil corto]

| | |
|---|---|
| Proyecto | [Proyecto] |
| Fecha | [DD/MM/AAAA] |
| Duración | [mm] min |
| Entrevistado | [Nombre y apellido, como figura en la transcripción] |
| Perfil | [rol real, no el del organigrama] |
| Organización | [área u organización] |
| Condujo | [nombre y apellido] |
| Fuente | [transcripción automática / desgrabación / notas] |
| Estado | Cerrada |

> **Nota de método.** Opcional, dos líneas: pantalla compartida, seguimiento con
> un perfil ya relevado, material confidencial.

## 01. Contexto del entrevistado
- [hecho] [E0N]

## 02. Flujo as-is
En el orden del relato. Varios flujos con `###`. Pasos incompletos con [NO DICHO].
1. [paso] [E0N]

## 03. Dolores
| # | Dolor | Etapa del flujo | Severidad | Evidencia |
|---|---|---|---|---|
| D1 | [qué pasa, no qué habría que hacer] | [paso] | 🔴 / 🟡 / 🟢 / [SIN DATO] | [E0N] "[cita corta]" |

## 04. Workarounds
| Workaround | Compensa | Costo que tiene | Evidencia |
|---|---|---|---|
| [qué hacen] | D1 | [si se dijo] | [E0N] |

## 05. Deseos y pedidos explícitos
- [pedido] | Problema detrás: [qué pasó, cuándo] o [SIN PROBLEMA] | [E0N] "[cita si fue textual]"

## 06. Datos duros
| Dato | Valor | Contexto | Evidencia |
|---|---|---|---|

## 07. Actores y sistemas mencionados
Agrupar con **negritas** (sistemas, internos, cliente y proveedores).
- [actor o sistema] [E0N]

## 08. Citas ancla
Tres a seis, textuales, sin editar (errores de transcripción incluidos).
> "[frase]"

## 09. Vacíos
- [NO DICHO] [preguntado y no respondido]
- [NO PREGUNTADO] [no se llegó a preguntar]

## 10. Inferencias
- [INFERENCIA] [lectura] | base: [qué la sostiene]
- [CONTRADICCIÓN] [qué choca y con quién, con código E0N si existe] | base: [frase]
- [CONTRADICCIÓN INTERNA] [dice una cosa al principio y otra al final] | base: "[cita 1]" y "[cita 2]"
- [SORPRESA] [qué contradice lo que dábamos por cierto] | supuesto: [cuál, del encuadre] | base: [frase]
```

## Reglas de extracción

- **No inventar precisión.** "Un montón" no es "15".
- **No traducir vocabulario.** "La planilla" queda "la planilla".
- **No atribuir causas.** Hipótesis de causa, a la sección 10.
- **Separar dolor de pedido.** "Tardo tres horas" es dolor, "habría que cargarlo
  masivo" es pedido.
- **Todo pedido lleva el problema que lo motiva.** Si la entrevista lo dice (la última
  vez que pasó, qué le costó), va en "Problema detrás". Si solo hay el título
  ("quiero manejar mis invitaciones"), se marca `[SIN PROBLEMA]`: es un pedido, no un
  hallazgo, y sin el problema no se puede saber si lo pedido ya existe y no lo usa.
  Lo que no se repreguntó va también a Vacíos.
- **Severidad solo con evidencia.** 🔴 frecuencia alta o impacto declarado, 🟡
  molestia recurrente, 🟢 menor. Si no, `[SIN DATO]`.
- **Declarar vacíos.** Son la agenda de la próxima entrevista.
- **El nombre va en la fila Entrevistado, nunca dentro de Perfil.** En sesiones
  grupales, cada persona con su subcódigo: "Nombre (E15a), Nombre (E15b)".
- **Un dolor de ficha se cita `E13-D4`, con guión.**
- **Contradicción interna.** Si la persona dice una cosa al principio y otra al
  final, va a la sección 10 con `[CONTRADICCIÓN INTERNA]` y las dos citas. No se
  elige una versión: las dos son evidencia.
- **Sorpresa contra supuestos.** Si hay encuadre con supuestos ordenados y la
  entrevista no sigue una guía de hipótesis, lo que contradice un supuesto va a la
  sección 10 con `[SORPRESA]` y el supuesto que toca. Con guía de hipótesis, el
  veredicto lo da `sintesis-de-campo`.
- **Tiempo explícito.** Si lo que se cuenta pasó en una edición, temporada o año
  anterior, el período va en el texto del dolor ("En 2025, ..."), la cita arranca
  donde se dice ("El año pasado...") y la severidad lleva el período ("🔴 en 2025").
  Si el entrevistado dice que ya se resolvió, va en el mismo dolor ("No se repitió
  en 2026"). El flujo as-is narra lo que pasó; no convierte un incidente en regla
  ("Si el ingreso colapsa, ...").
- **La cita lleva su marco.** No se corta antes de lo que cambia el sentido: cuándo,
  bajo qué condición, de quién habla, o un "creo". Si el marco queda lejos, se une
  con "..." ("El año pasado... nos atropellaron el portón").
- **Hipotético no es hecho.** "Si pudiera...", "sería", "podría pasar" van a deseos
  o a inferencias, no a dolores.
- **De oídas se marca.** Lo que el entrevistado cuenta que le dijeron lleva "según
  [rol]" en el texto del dolor.
- **Inducido se marca.** Si quien conduce propone la idea y el entrevistado solo
  asiente ("tal cual", "sí"), la Evidencia dice "(asiente a propuesta de quien
  condujo)". Ese dolor no sostiene solo un veredicto.
- **Cifras con su duda.** "Creo que 600" queda "alrededor de 600" o lleva
  [VERIFICAR] en Valor. La duda no se pierde entre la cita y la celda.
- **Nombres de transcripción automática.** Sistemas, marcas y personas que la
  transcripción pudo deformar ("Cuálita", "Exco") llevan [VERIFICAR] la primera vez.
- **Nombre del entrevistado solo en la tabla de inicio.** En el resto de la
  ficha, terceros por rol cuando se pueda ("el coordinador técnico"), porque la
  ficha se puede subir a un tablero compartido.

## Líneas que sirven de sticky

La ficha se puede subir tal cual a un tablero (FigJam, Miro u otro). Las columnas
Dolor, Workaround, Dato+Valor y las viñetas de 05 y 09 tienen que leerse como
sticky. Redactarlas así:

- Una idea por línea, menos de 110 caracteres (apuntar a 90).
- Frase nominal, voz impersonal. Nada de "el entrevistado manifiesta".
- Sin markdown adentro, sin raya larga ni punto medio, sin adjetivos valorativos sin dato.
- Dolor como qué pasa, nunca como qué habría que hacer.
- Sin nombres propios de personas.

```
MAL   El entrevistado manifestó que existe una problemática crítica en la acreditación
BIEN  La lista de espera se pasa a mano por WhatsApp a la recepción antes de cada clase
```

## Economía de la cita

Cita textual solo en evidencia de dolores, datos con cifra y citas ancla. En
contexto, flujo y actores alcanza con `[E0N]`.
