# Sistema visual

Todos los valores viven en `TOKENS` dentro de `deck-kit.js`. Este documento explica
para qué sirve cada uno, que es lo que evita usarlos mal.

## Color

| Token | Hex | Para qué |
|---|---|---|
| `ink` | `000000` | Fondo de portada (banda), divisores, statements fuertes, cierre. Y todo el texto principal sobre blanco. |
| `paper` | `FFFFFF` | Fondo de los slides de contenido. |
| `accent` | según marca | **Un solo uso por slide**: la palabra clave de un statement, una cifra grande, la barra vertical, el punto destacado de una matriz. |
| `accentDeep` | `1E2659` | Índigo profundo. Exclusivo de bloques de conclusión/aprendizaje dentro de un slide claro. Es lo que hace que "qué nos enseña" pese más que el resto. |
| `mint` | derivado del acento | Fondo a sangre de statements suaves, entre secciones. |
| `mintBand` | derivado del acento | Banda horizontal para la lectura de un gráfico o matriz. |
| `surface` | `F8F7FC` | Tarjetas de contenido sobre blanco. |
| `label` | `3B47B8` | Etiquetas en versalita (`OBSERVACIÓN`, `PARA EL USUARIO`, `01`). |
| `body` | `3C3C3F` | Párrafos sobre blanco. |
| `muted` | `6E6E73` | Bajadas, textos de apoyo. |
| `hint` | `8E8E93` | Breadcrumbs, fuentes, captions. |
| `line` | `E3E3E8` | Filetes finos y bordes de cuadrante. |

**El acento es de la marca, no del sistema.** Se pasa una sola vez, con
`createDeck({ accent: 'F2994A' })`, y `mint` y `mintBand` se calculan como tintes suyos.
Acento por defecto: `6C7BF2` (índigo). Otro ejemplo que funciona: `F2994A` (naranja). Cualquier color saturado y
luminoso funciona; los que no funcionan son los apagados, porque compiten con el negro
en vez de cortarlo. `accentDeep` (`1E2659`) se puede pisar con `palette: { accentDeep }`
si el acento nuevo pide otra versión oscura.

**Proporción.** Negro y blanco cargan el 90% del peso visual. El acento aparece
poco y por eso funciona. Un deck donde el acento está en cada slide pierde
exactamente lo que lo distingue.

**Ritmo.** El deck alterna: portada (blanco + banda negra) → agenda (mitad negra) →
divisor negro → contenido blanco → statement (negro o mint) → contenido blanco →
divisor negro → … → cierre negro. Esa alternancia es estructura, no decoración: le
dice a quien mira en qué parte del relato está.

## Grilla (13.333" × 7.5", LAYOUT_WIDE)

- Margen lateral: `0.9"`. Ancho útil: `11.533"`.
- Breadcrumb: `y = 0.5"`, 11pt.
- Título de slide: `y = 0.92"`, 36pt bold, tracking `-0.6`.
- Bajada: `y = 1.85"`, 15pt en `muted`.
- Zona de contenido: desde `y ≈ 2.1"` hasta `y ≈ 6.4"`.
- Fuente / nota al pie: `y = H − 0.72"`.
- Separación entre bloques: `0.3"` (tarjetas) o `0.6"` (columnas de texto).
- Nada a menos de `0.5"` del borde del slide.

## Tipografía

Dos familias: una **display** para titulares (pesada, tracking negativo) y una **body**
para todo lo demás. Por defecto `Arial` + `Calibri`, cambiables con
`createDeck({ fonts: { display, body } })`.

| Elemento | Tamaño | Peso |
|---|---|---|
| Titular de portada | 74 a 88 (auto según largo) | bold, tracking −2 |
| Título de sección | 46 | bold |
| Título de slide | 36 | bold |
| Statement | 26 a 28 | bold |
| Título de tarjeta | 15 a 17 | bold |
| Bajada | 15 | regular |
| Cuerpo | 11 a 13 | regular |
| Etiqueta versalita | 10.5 | bold, tracking +0.6, MAYÚSCULAS |
| Caption / fuente | 10 | regular |

Los títulos son **afirmaciones**, así que suelen ocupar dos o tres líneas. Está bien:
el aire está calculado para eso. Lo que no está bien es bajar el cuerpo a 9pt para que
entre más texto: si no entra, sobra texto.

## Motivos que se repiten

- **Breadcrumb** `Sección | Subsección` arriba a la izquierda, sección en gris y
  subsección en negro.
- **Barra vertical de acento** de 0.045" a la izquierda del statement en negro.
- **Etiqueta versalita** índigo medio encabezando cada bloque de contenido.
- **Tarjeta gris muy claro** con esquinas apenas redondeadas (`rectRadius 0.05`).
- **Bloque índigo profundo** para la conclusión, siempre a la derecha de la fila.
- **Numeración `01. / 02.`** con cero adelante, en agenda, secciones y pasos.
- **Chips redondeados** de borde fino para actores, herramientas y etiquetas de
  clasificación.
- **Logo de marca** arriba a la derecha, solo en la portada.

## Muchas categorías con un solo acento

Cuando un esquema de origen distingue equipos, estados o niveles con un color cada uno,
se traduce así, sin sumar colores:

- **Equipos o actores:** inicial en círculo negro y leyenda abajo (`waves`).
- **Decisiones de alcance:** negro (va), gris (no va), borde punteado (a definir) y el
  acento solo para el grupo que se quiere mirar (`scopeGrid`).
- **Niveles ordenados:** tintes del acento de claro a índigo profundo (`scale`, `journey`).
- **Pros y contras:** tarjeta gris y tarjeta negra (`scenario`), no verde y rojo.
- **Avisos:** banda negra con barra de acento (`conclusions`) o banda mint de lectura,
  no recuadros amarillos con ícono.

## Construcción progresiva

Un tablero denso se cuenta de a partes: el mismo slide repetido, con lo que todavía no
se contó apagado en gris claro. `waves` lo hace con `focus`; `annotatedScreen`, sumando
marcas. El resto del deck no lo usa: es un recurso para un solo bloque.

## Ilustraciones

Las ilustraciones (opcionales, con un personaje o estilo propio) ponen cara y emoción a un hallazgo. Representan siempre al
usuario cuyo journey se analiza, nunca al staff, y suman relato: el dato o la cita van
en el mismo slide o en el contiguo. Entre 4 y 6 por deck.

**Tamaños** (alto; el ancho sale de la proporción del archivo, con tope de 1.25 veces
el alto):

| Tamaño | Alto | Para qué |
|---|---|---|
| `s` | 1.3" | acompañar una cifra, una cita o un paso |
| `m` | 2" | acompañar un hallazgo o un statement |
| `l` | 3" | portada, o un hallazgo con bloques cortos |

Los avatares (busto en círculo, en `cards`, `voice` y `closing`) tienen tamaño fijo por arquetipo.

**Encaje.** El kit lee la proporción del PNG o del SVG y coloca la imagen entera dentro
de su área: nunca recorta al personaje. El spot se apoya en la línea de base del
contenido (o se centra en el statement) y su borde exterior va sobre el margen de la
grilla. Entre el spot y el texto hay siempre 0.4" (`ILL_GAP`).

**Reglas de convivencia:**

- **Una por slide.** Un spot cuenta igual que una escena.
- **Siempre sobre fondo claro** (blanco o mint), porque el contorno del personaje es
  casi negro. En slides negros (`section`, `statement` ink, `closing`) no van; la única
  excepción es `closing`, dentro de un círculo mint en el lugar de la foto.
- **Nunca pisa texto** ni ocupa el espacio del breadcrumb o de la fuente: cada
  arquetipo le reserva una columna o un hueco fijo y el texto se angosta.
- **Orientación.** El personaje mira o señala hacia el texto: del lado derecho van los
  que miran o señalan a la izquierda, del izquierdo los que miran a la derecha. Los
  simétricos sirven en los dos.
- **Acento.** El color propio de la ilustración es parte del dibujo y no cuenta como el
  acento del slide. Igual, el acento va lejos del personaje para que no se peleen.
- **Sin texto en la imagen:** ni números, ni logos.
- **Lugares sin ilustración:** divisores, agenda, `statement` ink y cierre, salvo el
  círculo del cierre. `journey` y `painsOpportunities` tampoco: no tienen lugar sin
  apretar el contenido (ver `plantillas-slides.md`).
- **Si el archivo no existe**, el kit omite la ilustración en silencio y el slide queda
  igual que sin ella. Nunca aparece el bloque gris de placeholder.

## Lo que rompe el sistema

- Más de un uso del acento por slide.
- Rayas decorativas bajo los títulos, barras de color de borde a borde, franjas
  verticales en el canto de una tarjeta.
- Degradados y sombras (el kit no los usa a propósito).
- Viñetas sueltas sobre fondo blanco sin tarjeta que las contenga.
- Texto centrado en párrafos. Solo se centra dentro de chips de flujo, en la banda de
  conclusión y en el cierre.
- Un color por equipo, estado o categoría (ver arriba cómo se traducen).
- Íconos de colores variados. Si hacen falta íconos, van monocromos en `ink` o `label`.
- Fotos con marco, borde o esquinas muy redondeadas: van al corte, rectangulares.
