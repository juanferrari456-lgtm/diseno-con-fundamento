---
name: "creador-de-ppt"
description: "Genera el .pptx de Service Design con el sistema visual editorial del equipo (negro, blanco y un acento de marca) para discoveries, readouts de research, benchmarks, hallazgos y propuestas. Usar cuando se pida un deck de SD o de research, \"la presentación de siempre\", \"el formato del equipo\", o pasar un discovery, markdown o transcripción a slides en ese formato. El contenido se trabaja con creador-de-contenido."
---

# Deck discovery | sistema visual editorial

Sistema de presentación de alto contraste para contar research: negro y blanco como
base, **un solo color de acento** que cambia según la marca del proyecto, tipografía
grande y mucho aire. Está pensado para que el peso lo lleve el contenido, no la
decoración.

La skill trae una librería (`scripts/deck-kit.js`) con una función por arquetipo de
slide. Componer un deck es elegir arquetipos y pasarles contenido, no dibujar cajas a
mano. Eso es lo que mantiene la consistencia entre decks hechos por personas distintas.

## Flujo de trabajo

1. **Entender el contenido antes de maquetar.** Leer lo que trajo la persona
   (transcripciones, notas, markdown, un documento) y proponer una estructura de deck:
   qué secciones, qué va en cada slide, dónde van los statements. Si el contenido es
   escaso o ambiguo, preguntar antes de inventar. Esperar el ok de la estructura antes
   de seguir: corregir una lista cuesta menos que rehacer un deck maquetado.
2. **Leer `references/narrativa.md`** para el arco del relato y las convenciones de
   copy (títulos-afirmación, pares observación/recomendación, breadcrumbs, traducción al
   idioma del stakeholder). El deck toma posición: si el contenido trae opciones sin
   recomendada, eso se pregunta antes de maquetar: no se maqueta como empate. Los
   próximos pasos piden la decisión explícitamente a quien decide.
3. **Leer `references/plantillas-slides.md`**: catálogo de arquetipos con la API exacta
   de cada uno y cuándo usar cada uno.
4. **Escribir un script de build** que requiera `deck-kit.js`, encadene los arquetipos y
   guarde el `.pptx`. Ver `scripts/ejemplo-uso.js` como esqueleto.
5. **QA obligatorio** (abajo). Renderizar, mirar cada slide, corregir en el generador.
6. Entregar el `.pptx` por el canal del entorno: escribirlo en la carpeta conectada si la hay, o mandarlo como archivo al chat.

## Uso de la librería

```bash
cp <ruta-de-esta-skill>/scripts/deck-kit.js ./deck-kit.js
node build.js            # genera el .pptx
```

```js
const { createDeck, TOKENS } = require('./deck-kit');

const deck = createDeck();                       // 13.333" × 7.5" ya configurado
// Marca distinta: solo cambia el acento, los derivados se calculan solos.
// const deck = createDeck({ accent: 'F2994A' });

deck.cover({
  titleTop: 'Lista de espera',                    // línea en acento
  titleBottom: 'Discovery de reservas',          // línea en negro
  blurb: 'Este es un discovery de diseño de servicios...',
  presenter: 'Nombre Apellido',
  date: 'Mayo 2026',
});

deck.section({ number: '01', title: 'Contexto', items: ['Origen', 'Problema', 'Objetivo'] });
deck.finding({ breadcrumb: ['Hallazgos', 'Antes'], title: '...', blocks: [...] });

deck.save('salida.pptx');
```

Todos los arquetipos aceptan `notes: '...'` para notas del orador.

**No hardcodear autoría, cliente, marca ni contenido.** Acento, logo, portada, cierre y
breadcrumbs se llenan con lo que traiga cada persona. `presenter` acepta un string o un
array cuando presentan varias personas. Si no se sabe quién presenta, la fecha o el
color de marca, preguntar o dejar el campo fuera, nunca completar con un default.

## Reglas que hacen que se vea como el sistema

Detalle completo en `references/sistema-visual.md`. Lo mínimo:

- **Un solo acento, definido por la marca del proyecto.** Se pasa en `createDeck({
  accent })` y de ahí salen los tintes claros. Se usa para **una** cosa por slide: la
  palabra clave del statement, el número grande, la barra vertical, la etapa destacada.
  Si el acento aparece tres veces en un slide, dejó de ser acento.
- **Fondos negros para estructura, blancos para contenido.** Portada (banda inferior),
  divisores de sección, statements fuertes y cierre en negro. Todo lo demás en blanco.
  Ese ritmo negro/blanco es la mitad de la identidad.
- **Títulos-afirmación.** El título del slide dice la conclusión, no la categoría:
  "El momento más crítico ocurre cuando el evento ya terminó", no "Análisis post-evento".
- **Breadcrumb arriba a la izquierda** en todo slide de contenido: `Sección | Subsección`,
  la sección en gris y la subsección en negro. Ubica al que mira sin ocupar espacio.
- **Nada de rayitas decorativas, barras de color de borde a borde ni degradados.** El
  contraste y el aire hacen el trabajo.
- **Sin viñetas sueltas sobre blanco.** El texto largo va en tarjetas (`F8F7FC`) o en
  pares etiqueta/párrafo; los bloques de aprendizaje van en índigo profundo (`1E2659`).
- **Ilustraciones: una por slide, siempre sobre fondo claro, nunca pisando texto.** Los
  arquetipos que aceptan una ilustración propia, los tamaños y las reglas están en
  `references/sistema-visual.md` § Ilustraciones y en `references/plantillas-slides.md`.
- **Sin raya larga ni punto medio en ningún texto.** Para separar se usa "|", "-" o ",".
  `deck-kit.js` los reemplaza solo en todo texto y nota de un slide creado con
  `newSlide`, y avisa al guardar cuántos cambió: si aparece el aviso, revisar que la
  puntuación haya quedado bien y corregir el copy en el script de build.

## Tipografía

Los nombres de fuente los renderiza el PowerPoint de quien abre el archivo, no este
entorno. Por defecto el kit usa **Arial** (display, con tracking negativo en tamaños
grandes) y **Calibri** (cuerpo): están en toda instalación de Office y el QA por
LibreOffice es fiel al ancho real.

Si el equipo tiene su fuente de marca instalada (una grotesca pesada tipo Sharp Grotesk,
Founders, Poppins o Archivo para títulos), se cambia en un solo lugar:

```js
const deck = createDeck({ fonts: { display: 'Poppins', body: 'Inter' } });
```

Con fuentes fuera del set seguro, el QA visual sobre el ancho del texto deja de ser
confiable: dejar ~10% de aire extra en los contenedores.

## QA

El QA es lo que separa un deck del sistema de uno que se parece: los desbordes de texto solo se ven renderizados. Los scripts de abajo vienen de la skill `pptx`; si en este entorno están en otra ruta, buscarlos ahí (o usar `soffice` directo para el PDF).

```bash
python /mnt/skills/public/pptx/scripts/office/validate.py salida.pptx
python /mnt/skills/public/pptx/scripts/office/soffice.py --headless --convert-to pdf salida.pptx
rm -f slide-*.jpg && pdftoppm -jpeg -r 150 salida.pdf slide && ls -1 "$PWD"/slide-*.jpg
```

Mirar **todos** los slides renderizados y revisar, en este orden:

1. Texto que se sale de su caja o del slide (el defecto más común).
2. Tarjetas de distinta altura en una misma fila, o textos que desbordan la tarjeta más
   corta: acortar el copy o subir la altura de la fila entera.
3. Elementos superpuestos o pegados (< 0.3" de aire).
4. Statements en negro con el acento perdido o texto gris ilegible sobre negro.
5. Breadcrumbs, fuentes y numeración de sección coherentes entre slides.
6. Ninguna raya larga ni punto medio en el texto. Si `save` avisó reemplazos, corregir el
   copy de origen.

Corregir en el script de build y volver a renderizar, nunca editando el XML a mano.

## Archivos de referencia

- `references/sistema-visual.md`: tokens de color, grilla, escala tipográfica, motivos.
- `references/plantillas-slides.md`: los arquetipos, su API y cuándo usar cada uno, incluidos los de relato (`voice`, `annotatedScreen`, `tree`, `sources`) y los de relevamiento y propuesta (`scopeGrid`, `scenarios`, `scenario`, `waves`, `breakdown`, `scale`, `profiles`, `conclusions`), los de síntesis (`rainbow`, `emotionCurve`, `hypothesisBoard`, `ecosystem`, `archetypes`, `perSegment`, `insight`, `causalChain`, `unknowns`) y los de recomendación y anexo (`triangulation`, `comparisonStat`, `ownerCheck`, `ownershipMatrix`, `keyResults`, `decisionAsk`, `sampleTable`, `verbatimGrid`).
- `references/narrativa.md`: arco del deck (y su variante de relevamiento y propuesta), convenciones de copy y de idioma.
- `scripts/deck-kit.js`: la librería.
- `scripts/ejemplo-uso.js`: deck mínimo de ejemplo con contenido genérico.
- `scripts/ejemplo-sintesis.js`: deck de síntesis y recomendación de un discovery (arcoíris, curva emocional, hipótesis, ecosistema, elenco, segmentos, insight, cadena causal, vacíos, triangulación, cifra contra cifra, dueños, responsabilidades, resultados clave, decisiones, muestra y verbatims) con contenido ficticio.
- `scripts/ejemplo-relevamiento.js`: deck de relevamiento y propuesta (alcance, escenarios, olas, gobernanza y conclusiones) con contenido genérico.