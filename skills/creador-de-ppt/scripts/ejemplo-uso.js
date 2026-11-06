/**
 * ejemplo-uso.js: deck mínimo que recorre todos los arquetipos del sistema.
 * Contenido genérico a propósito: sirve como esqueleto, no como plantilla de un
 * proyecto concreto. Reemplazar todo el contenido por el del deck real.
 *
 *   node ejemplo-uso.js
 */

const { createDeck, TOKENS } = require('./deck-kit');
const C = TOKENS.color;

const deck = createDeck();

deck.cover({
  titleTop: 'Nombre del proyecto',
  titleBottom: 'Discovery',
  blurb: 'Este es un discovery de Service Design. El objetivo de esta etapa es comprender el contexto, los usuarios y las variables que influyen en la iniciativa, transformando la evidencia real en aprendizajes y oportunidades accionables.',
  presenter: 'Nombre de quien presenta',
  date: 'Mes 2026',
});

deck.agenda({
  items: ['Contexto', 'Abordaje metodológico', '¿Qué está pasando en el mercado?', 'Hallazgos', 'Niveles de solución', 'Próximos pasos'],
});

deck.statement({
  eyebrow: 'Antes de comenzar - Disclaimer',
  text: ['Si durante la presentación surgen dudas o comentarios, anotalos para que los revisemos ', { t: 'todos juntos al final.', c: C.accent }],
});

deck.section({ number: '01', title: 'Contexto', items: ['Origen', 'Problema', 'Objetivo'] });

deck.textImage({
  breadcrumb: ['Contexto', 'Origen'],
  title: '¿De qué estamos hablando?',
  body: [
    ['Una definición corta y clara del objeto de estudio, con ', { t: 'lo esencial en negrita', b: true }, ' para que se lea de un vistazo.'],
    'Un segundo párrafo que abre el abanico de formas que puede tomar el problema en el contexto real donde se va a implementar.',
    'Un cierre que deja planteado qué tienen en común todas esas formas.',
  ],
});

deck.cards({
  breadcrumb: ['Contexto', 'Problema'],
  title: 'El problema',
  lede: 'Una frase que enuncia el problema de forma neutra y verificable, sin adjetivos de más.',
  cards: [
    { eyebrow: 'Para el usuario', title: 'Titular del impacto', body: 'Dos o tres oraciones sobre qué pierde este actor hoy y por qué eso importa.' },
    { eyebrow: 'Para el negocio', title: 'Titular del impacto', body: 'Dos o tres oraciones sobre el costo de oportunidad, con evidencia si la hay.' },
    { eyebrow: 'Para el equipo', title: 'Titular del impacto', body: 'Dos o tres oraciones sobre la fricción operativa que genera la situación actual.' },
  ],
});

deck.section({ number: '02', title: 'Abordaje metodológico' });

deck.steps({
  breadcrumb: 'Abordaje metodológico',
  title: '¿Cómo abordamos este discovery?',
  steps: [
    { title: 'Desk research', body: 'Qué se investigó, con qué alcance y para responder qué pregunta.' },
    { title: 'Benchmark', body: 'Qué soluciones se analizaron y bajo qué ejes de comparación.' },
    { title: 'Entrevistas', body: 'Cuántas, con qué perfiles y qué se buscaba entender con ellas.' },
    { title: 'Análisis y síntesis', body: 'Cómo se cruzaron las fuentes para llegar a patrones y tensiones.' },
  ],
});

deck.stats({
  breadcrumb: ['¿Qué está pasando en el mercado?', 'Cifras'],
  title: 'El mercado en números',
  stats: [
    { value: '86,9 %', label: 'Qué mide este número y de dónde sale.', accent: true },
    { value: '+30 %', label: 'Qué mide este número y de dónde sale.' },
    { value: '< 2 seg', label: 'Qué mide este número y de dónde sale.' },
  ],
  source: 'Fuente: nombre de la fuente.',
});

deck.caseStudy({
  breadcrumb: ['¿Qué está pasando en el mercado?', 'Benchmark'],
  name: 'Caso de referencia',
  meta: ['Mercado', 'Categoría', 'Modelo', 'Tecnología'],
  description: 'Un párrafo que explica por qué este caso es relevante para la pregunta del discovery.',
  how: [
    'Primer paso del funcionamiento, contado desde la experiencia del usuario.',
    'Segundo paso, con el detalle técnico solo si cambia la decisión.',
    'Tercer paso, incluyendo qué pasa cuando algo falla.',
  ],
  learn: [
    'El aprendizaje transferible a nuestro contexto, en una oración.',
    'La limitación o el riesgo que este caso ya dejó a la vista.',
  ],
});

deck.statement({
  theme: 'mint',
  breadcrumb: ['¿Qué está pasando en el mercado?', 'Benchmark'],
  text: 'La conclusión transversal del benchmark, dicha como afirmación y no como categoría.',
});

deck.section({ number: '03', title: 'Hallazgos' });

deck.finding({
  breadcrumb: ['Hallazgos', 'Antes'],
  title: 'El hallazgo enunciado como afirmación, en dos o tres líneas como máximo.',
  blocks: [
    { label: 'Observación', text: 'Qué se vio, con la evidencia que lo sostiene. Sin recomendación acá: solo el hecho.' },
    { label: 'Recomendación', text: 'Qué hacer con eso, en términos accionables y acotados a lo que el equipo controla.' },
  ],
});

deck.section({ number: '04', title: 'Niveles de solución' });

deck.matrix({
  breadcrumb: ['Niveles de solución', 'Matriz de factibilidad'],
  title: '¿Dónde se ubica cada solución?',
  legend: [
    { title: 'Primera opción.', note: 'Baja complejidad. Valor transaccional.' },
    { title: 'Segunda opción.', note: 'Complejidad media. Valor medio-alto.' },
    { title: 'Tercera opción.', note: 'Complejidad media-alta. Valor medio.' },
    { title: 'Cuarta opción.', note: 'Alta complejidad. Valor alto.' },
  ],
  points: [
    { n: 1, x: 0.22, y: 0.2 },
    { n: 2, x: 0.35, y: 0.62, highlight: true },
    { n: 3, x: 0.52, y: 0.34 },
    { n: 4, x: 0.78, y: 0.78 },
  ],
  axisX: ['- Complejidad', '+ Complejidad'],
  axisY: ['+ Valor', '- Valor'],
  banner: 'La lectura de la matriz en una línea: cuál es el punto de entrada natural y por qué.',
});

deck.flow({
  breadcrumb: ['Niveles de solución', 'Flujos high level'],
  title: '¿Cómo se vería la experiencia?',
  lede: 'Flujo simplificado de las dos alternativas más viables en el corto plazo.',
  flows: [
    { label: 'Flujo 1', tag: 'Mínima fricción', steps: ['Primer paso', 'Segundo paso', 'Tercer paso', 'Cuarto paso', 'Quinto paso'] },
    { label: 'Flujo 2', tag: 'MVP recomendado', steps: ['Primer paso', 'Segundo paso', 'Tercer paso', 'Cuarto paso', 'Quinto paso', 'Sexto paso'] },
  ],
});

deck.bigStat({
  breadcrumb: ['La importancia del para quién', 'El dato que nos desafía'],
  value: '32 %',
  caption: 'Qué mide el número, dicho en una oración.',
  body: [
    'La hipótesis con la que arrancó el equipo, enunciada tal cual se sostenía antes del dato.',
    'Cómo la desafía este dato y qué deja de ser cierto a partir de acá.',
    'Qué no resuelve todavía, para no sobreinterpretar.',
  ],
  quote: 'Una cita textual breve de una entrevista que ilustre el punto.',
  author: 'Nombre | Rol',
  source: 'Fuente: origen del dato.',
});

deck.section({ number: '05', title: 'Próximos pasos' });

deck.cards({
  breadcrumb: 'Próximos pasos',
  cards: [
    { eyebrow: '01', title: 'Nombre del próximo paso', body: ['Qué implica, con qué objetivo y en qué plazo.', 'Quiénes participan: áreas involucradas.'] },
    { eyebrow: '02', title: 'Nombre del próximo paso', body: ['Qué implica, con qué objetivo y en qué plazo.', 'Quiénes participan: áreas involucradas.'] },
  ],
  source: 'Nota: estos pasos son una propuesta abierta a conversación.',
});

deck.closing({
  text: 'Si surgen dudas, me pueden contactar.\n¡Gracias!',
  name: 'Nombre de quien presenta',
  role: 'Rol',
});

deck.save('ejemplo.pptx').then((f) => console.log('OK:', f));
