/**
 * Ejemplo de deck de síntesis con los arquetipos de arcoíris, curva emocional,
 * tablero de hipótesis, ecosistema, elenco, cómo lo vive cada uno, insight,
 * cadena causal y lo que todavía no sabemos.
 * Caso ficticio: discovery de la lista de espera de una red de gimnasios.
 * Personas, citas y números son inventados. Reemplazar el contenido entero con el del proyecto.
 */
const { createDeck } = require('./deck-kit');

const deck = createDeck();

const groups = [
  { name: 'Socios', color: '6C7BF2' },
  { name: 'Recepción', color: '1E2659' },
  { name: 'Instructores', color: '3B6FD8' },
];
const columns = [
  ...['E1', 'E2', 'E3', 'E4', 'E5', 'E6'].map((l) => ({ label: l, group: 'Socios' })),
  ...['E7', 'E8', 'E9'].map((l) => ({ label: l, group: 'Recepción' })),
  ...['E10', 'E11'].map((l) => ({ label: l, group: 'Instructores' })),
];
deck.rainbow({
  breadcrumb: ['Síntesis', 'Hipótesis'],
  title: 'La lista de espera falla menos por el sistema que por el aviso',
  lede: 'Cada entrevista contra cada hipótesis. Las celdas vacías son preguntas que no aplicaban a ese perfil.',
  groups,
  columns,
  rows: [
    { id: 'H1', label: 'Los socios no se anotan porque no saben que existe', values: ['R', 'R', 'M', 'R', 'R', 'C', '', '', '', 'N', 'N'], result: 'distinta' },
    { id: 'H2', label: 'El aviso de lugar libre llega tarde', values: ['C', 'C', 'C', 'M', 'C', 'C', 'C', 'C', 'M', '', ''], result: 'como' },
    { id: 'H3', label: 'Recepción libera lugares a mano', values: ['', '', '', '', '', '', 'C', 'C', 'C', 'M', 'S'], result: 'como' },
    { id: 'H4', label: 'Los instructores prefieren clases llenas aunque haya ausentes', values: ['', '', '', '', '', '', 'S', 'M', 'S', 'R', 'M'], result: 'abierta' },
    { id: 'H5', label: 'Los socios aceptan pagar una seña para reservar', values: ['R', 'M', 'R', 'R', 'S', 'M', 'N', 'N', 'N', '', ''], result: 'distinta' },
  ],
  source: 'Fuente: 11 entrevistas. Caso ficticio.',
});

deck.emotionCurve({
  breadcrumb: ['Síntesis', 'Recorrido'],
  title: 'El dolor aparece después de anotarse, no antes',
  stages: ['Busca clase', 'Ve que está llena', 'Se anota', 'Espera', 'Recibe aviso', 'Va a la clase'],
  series: [
    { name: 'Socio habitual', color: '6C7BF2', values: [2, 1, 2, 1, 0, 1] },
    { name: 'Socio nuevo', color: 'E5484D', values: [1, 0, 1, null, 0, 2] },
    { name: 'Recepción', color: '1E2659', values: [2, 2, 1, 0, 0, 1] },
  ],
  levelNotes: ['Sin quejas', 'Se resuelve con esfuerzo', 'Abandona o reclama'],
  reading: 'Los tres perfiles caen en la espera y el aviso. El socio nuevo no tiene dato en la espera: nadie lo contó.',
  source: 'Fuente: 11 entrevistas y 2 jornadas de observación en recepción. Caso ficticio.',
});

deck.hypothesisBoard({
  breadcrumb: ['Síntesis', 'Hipótesis'],
  title: 'De 8 hipótesis, 3 salieron distintas a lo que creíamos',
  hypotheses: [
    { id: 'H1', result: 'distinta' }, { id: 'H2', result: 'como' }, { id: 'H3', result: 'como' }, { id: 'H4', result: 'abierta' },
    { id: 'H5', result: 'distinta' }, { id: 'H6', result: 'como' }, { id: 'H7', result: 'distinta' }, { id: 'H8', result: 'abierta' },
  ],
  summary: [
    { value: '3', label: 'distintas', body: 'Cambian el foco: del alta en la lista al aviso.', highlight: true },
    { value: '3', label: 'como creíamos', body: 'Confirman el problema operativo en recepción.' },
    { value: '2', label: 'abiertas', body: 'Hacen falta datos de asistencia para cerrarlas.' },
  ],
  footnote: 'Conteo directo sobre la tabla de hipótesis. Caso ficticio.',
});

deck.ecosystem({
  breadcrumb: ['Contexto', 'Ecosistema'],
  title: 'Cinco actores tocan un lugar libre antes de que llegue al socio',
  center: { label: 'Lugar libre en una clase' },
  nodes: [
    { name: 'Socio', note: 'se anota', body: 'Se suma a la lista desde la app o en recepción.' },
    { name: 'Recepción', note: 'libera', body: 'Da de baja al ausente y avisa por teléfono.', highlight: true },
    { name: 'Instructor', note: 'confirma', body: 'Decide si acepta gente tarde.' },
    { name: 'App', note: 'notifica', body: 'Manda el aviso cuando alguien libera.' },
    { name: 'Gerencia de sede', note: 'mide', body: 'Mira ocupación, no lista de espera.' },
  ],
  panel: {
    label: 'En números',
    stats: [
      { value: '18%', label: 'de las reservas no se presenta', source: '[INFERIDO] planilla de una sede, 4 semanas' },
      { value: '3', label: 'canales para anotarse', source: 'conteo directo' },
    ],
    footnote: 'Caso ficticio.',
  },
  quote: { label: 'Lo que dice recepción', text: 'Cuando veo el lugar libre ya empezó la clase.', author: 'Recepción, sede ficticia' },
});

deck.archetypes({
  breadcrumb: ['Síntesis', 'Arquetipos'],
  title: 'Tres formas de usar la lista de espera',
  archetypes: [
    { name: 'El que planifica', color: '6C7BF2', claim: 'Reserva con días de anticipación y se anota en varias listas.', examples: 'E1, E4, E6', base: '3 de 6 socios' },
    { name: 'El de último momento', color: 'E5484D', claim: 'Decide en el día y mira si hay lugar camino al gimnasio.', examples: 'E2, E5', base: '2 de 6 socios' },
    { name: 'El que pregunta', color: '1E2659', claim: 'No usa la app: le pide a recepción que lo anote.', examples: 'E3', base: '1 de 6 socios' },
  ],
  footnote: 'Arquetipos de comportamiento, no segmentos demográficos. Muestra chica: hipótesis. Caso ficticio.',
});

deck.perSegment({
  breadcrumb: ['Síntesis', 'Cómo lo vive cada uno'],
  title: 'El mismo aviso tarde pesa distinto según quién lo recibe',
  segments: [
    { name: 'Socios', color: '6C7BF2', who: '6 entrevistas', headline: 'Pierden el lugar por no ver el aviso', body: 'El aviso llega con menos de una hora de margen.', quotes: [{ text: 'Me llegó cuando ya estaba en el trabajo.', author: 'E2' }] },
    { name: 'Recepción', color: '1E2659', who: '3 entrevistas', headline: 'Hace de puente entre la lista y la clase', body: 'Llama a mano al siguiente de la lista.', quotes: [{ text: 'Tengo la lista en papel al lado de la compu.', author: 'E8' }] },
    { name: 'Instructores', color: '3B6FD8', who: '2 entrevistas', headline: 'No ven la lista', body: 'Se enteran de quién viene cuando entra a la sala.', quotes: [{ text: 'Yo cuento cabezas, no reservas.', author: 'E10' }] },
  ],
  source: 'Fuente: 11 entrevistas. Caso ficticio.',
});

deck.insight({
  eyebrow: 'Insight 1',
  text: 'Un lugar libre vale mientras alguien lo pueda usar: el aviso que llega tarde es un lugar perdido.',
  support: 'Socios y recepción describen la misma escena desde lados distintos: el lugar se libera, pero el aviso no alcanza a nadie a tiempo.',
  evidence: '9 de 11 entrevistas',
  gap: { label: 'Lo que falta medir', text: 'Cuántos minutos pasan entre que se libera el lugar y que llega el aviso.' },
  clue: { label: 'Pista en los datos', text: 'La planilla de una sede muestra lugares vacíos en clases con lista de espera.' },
});

deck.causalChain({
  breadcrumb: ['Síntesis', 'Por qué pasa'],
  title: 'Por qué la clase arranca con lugares vacíos y gente esperando',
  links: [
    { label: 'Causa', title: 'El ausente no avisa', body: 'No hay costo por faltar ni forma rápida de cancelar.', evidence: '6 de 6 socios', tone: 'ink' },
    { label: 'Efecto', title: 'Recepción libera tarde', body: 'Recién lo detecta cuando empieza la clase.', evidence: '3 de 3 en recepción', tone: 'alert' },
    { label: 'Efecto', title: 'El aviso llega tarde', body: 'El siguiente de la lista ya no puede ir.', evidence: '5 de 6 socios', tone: 'alert' },
    { label: 'Resultado', title: 'Lugar perdido', body: 'Clase con huecos y socios que dejan de anotarse.', evidence: '[INFERIDO]', tone: 'accent' },
  ],
  band: 'Nadie es dueño de la lista: la app la guarda, recepción la opera y gerencia no la mide.',
});

deck.unknowns({
  breadcrumb: ['Cierre', 'Vacíos'],
  title: 'Lo que todavía no sabemos',
  items: [
    { stage: 'Espera', question: 'Cuánto esperan los socios antes de rendirse', closes: 'Datos de la app, últimos 3 meses' },
    { stage: 'Aviso', question: 'Qué canal leen primero: push, mail o mensaje', closes: 'Prueba con 2 sedes' },
    { stage: 'Clase', question: 'Si los instructores aceptan gente hasta 10 minutos tarde', closes: '4 entrevistas más con instructores' },
  ],
  footer: 'Caso ficticio.',
});

// --- Recomendación ---

deck.triangulation({
  breadcrumb: ['Síntesis', 'Triangulación'],
  title: 'Tres fuentes miran el aviso tarde y llegan al mismo lugar',
  finding: 'El aviso de lugar libre llega cuando ya no sirve.',
  sources: [
    { type: 'Entrevistas', detail: '9 de 11', says: 'Socios y recepción cuentan la misma escena: el aviso llega con la clase empezada.', agrees: 'si' },
    { type: 'Observación', detail: '2 jornadas en recepción', says: 'Recepción libera los lugares cuando empieza la clase, no antes.', agrees: 'si' },
    { type: 'Datos de la app', detail: '[INFERIDO] 1 sede, 4 semanas', says: 'Hay avisos enviados después del horario de inicio, pero no sabemos cuántos.', agrees: 'parcial' },
  ],
  level: 'patron',
  levelText: 'Patrón: coincide en dos fuentes independientes. Para evidencia sólida falta el dato de la app en todas las sedes.',
  source: 'Escala de certeza del paquete. Caso ficticio.',
});

deck.comparisonStat({
  breadcrumb: ['Síntesis', 'La tensión'],
  title: 'Clases llenas en la app, salas con lugares vacíos',
  left: { value: '100%', label: 'de ocupación reservada en las clases con lista de espera', source: 'App, 1 sede, 4 semanas. Caso ficticio.' },
  right: { value: '82%', label: 'de asistencia real en esas mismas clases', source: '[INFERIDO] planilla de recepción. Caso ficticio.' },
  connector: 'contra',
  reading: 'La diferencia son lugares que se liberaron y nadie llegó a ocupar.',
});

deck.ownerCheck({
  breadcrumb: ['Recomendación', 'Qué ya tiene dueño'],
  title: 'De 7 temas que surgieron, 3 no tienen a nadie',
  items: [
    { name: 'App de reservas', status: 'existe', body: 'Producto la mantiene.' },
    { name: 'Política de ausencias', status: 'existe', body: 'Gerencia la revisa cada año.' },
    { name: 'Aviso de lugar libre', status: 'reconocido', body: 'Todos lo nombran, nadie lo mide.' },
    { name: 'Lista en papel de recepción', status: 'reconocido', body: 'Convive con la de la app.' },
    { name: 'Cancelación rápida', status: 'reconocido', body: 'Pedido de 4 socios.' },
    { name: 'Precios de clases especiales', status: 'afuera' },
    { name: 'Horarios de apertura', status: 'afuera' },
  ],
  source: 'Fuente: entrevistas y relevamiento con Producto. Caso ficticio.',
});

deck.ownershipMatrix({
  breadcrumb: ['Recomendación', 'Responsabilidades'],
  title: 'Nadie decide sobre el aviso ni sobre la lista en papel',
  columns: ['Producto', 'Recepción', 'Gerencia de sede', 'Instructores'],
  rows: [
    { label: 'Mantener la app de reservas', cells: ['A', 'I', 'I', ''] },
    { label: 'Liberar lugares de ausentes', cells: ['C', 'R', 'A', 'I'] },
    { label: 'Mandar el aviso de lugar libre', cells: ['R', 'C', '', ''] },
    { label: 'Llevar la lista en papel', cells: ['', 'R', 'I', ''] },
    { label: 'Medir lugares perdidos', cells: ['C', '', 'R', ''] },
  ],
  source: 'Fuente: relevamiento con los 4 equipos. Caso ficticio.',
});

deck.keyResults({
  breadcrumb: ['Recomendación', 'Cómo vamos a saber si funcionó'],
  title: 'Tres resultados para medir el piloto en dos sedes',
  objective: 'Que un lugar libre llegue a alguien que lo pueda usar.',
  results: [
    { metric: 'Minutos entre que se libera un lugar y llega el aviso', baseline: '', target: '< 30', source: 'Registro de la app, a instrumentar' },
    { metric: 'Lugares liberados que se vuelven a ocupar', baseline: '', target: '60%', source: 'App y planilla de recepción' },
    { metric: 'Socios que dejan de anotarse en listas', baseline: '[INFERIDO] 1 de 6', target: 'Bajar', source: 'Entrevistas: sin dato cuantitativo' },
  ],
  footnote: 'Las metas son a confirmar con Gerencia. Caso ficticio.',
});

deck.decisionAsk({
  breadcrumb: ['Recomendación', 'Decisiones'],
  title: 'Lo que necesitamos que se decida este mes',
  decisions: [
    { question: 'Quién es dueño del aviso de lugar libre', options: ['Producto', 'Gerencia de sede'], recommended: 0, why: 'El aviso vive en la app y el cambio es de producto.', owner: 'Dirección de operaciones', by: 'Fin de mes' },
    { question: 'Si se prueba una cancelación con un toque', options: ['Piloto en 2 sedes', 'Esperar más datos'], recommended: 0, why: 'Es barata de probar y ataca la causa de la cadena.', owner: 'Producto', by: 'Próxima planificación' },
    { question: 'Qué pasa con la lista en papel', options: ['Se retira con el piloto', 'Convive hasta medir'], recommended: 1, why: 'Recepción la usa de respaldo: sacarla sin reemplazo es riesgoso.' },
  ],
  footnote: 'Caso ficticio.',
});

// --- Anexo ---

deck.sampleTable({
  breadcrumb: ['Anexo', 'Muestra'],
  title: 'Con quiénes hablamos',
  totals: [
    { value: '11', label: 'entrevistas' },
    { value: '3', label: 'perfiles' },
    { value: '2', label: 'sedes' },
    { value: '2', label: 'jornadas de observación' },
  ],
  headers: ['Código', 'Perfil', 'Antigüedad', 'Sede', 'Formato', 'Fecha'],
  colW: [1.2, 2.4, 2.0, 2.0, 2.0, 1.933],
  rows: [
    ['E1', 'Socio', 'Más de 2 años', 'Norte', 'Presencial', 'Sem 1'],
    ['E2', 'Socio', 'Menos de 6 meses', 'Norte', 'Remota', 'Sem 1'],
    ['E3', 'Socio', 'Más de 2 años', 'Centro', 'Presencial', 'Sem 1'],
    ['E4', 'Socio', '1 año', 'Centro', 'Remota', 'Sem 2'],
    ['E5', 'Socio', 'Menos de 6 meses', 'Norte', 'Remota', 'Sem 2'],
    ['E6', 'Socio', '1 año', 'Centro', 'Presencial', 'Sem 2'],
    ['E7', 'Recepción', '3 años', 'Norte', 'Presencial', 'Sem 1'],
    ['E8', 'Recepción', '1 año', 'Centro', 'Presencial', 'Sem 2'],
    ['E9', 'Recepción', '5 años', 'Centro', 'Presencial', 'Sem 2'],
    ['E10', 'Instructor', '2 años', 'Norte', 'Remota', 'Sem 3'],
    ['E11', 'Instructor', '4 años', 'Centro', 'Remota', 'Sem 3'],
  ],
  source: 'Caso ficticio.',
});

deck.verbatimGrid({
  breadcrumb: ['Anexo', 'Verbatims'],
  title: 'Lo que dijeron sobre el aviso',
  tags: [{ name: 'Socio', color: '6C7BF2' }, { name: 'Recepción', color: '1E2659' }, { name: 'Instructor', color: '3B6FD8' }],
  quotes: [
    { text: 'Me llegó cuando ya estaba en el trabajo.', author: 'E2', tag: 'Socio' },
    { text: 'Ya ni me anoto, total nunca me toca.', author: 'E5', tag: 'Socio' },
    { text: 'Lo vi a la noche, la clase era a la mañana.', author: 'E4', tag: 'Socio' },
    { text: 'Tengo la lista en papel al lado de la compu.', author: 'E8', tag: 'Recepción' },
    { text: 'Cuando veo el lugar libre ya empezó la clase.', author: 'E7', tag: 'Recepción' },
    { text: 'Yo cuento cabezas, no reservas.', author: 'E10', tag: 'Instructor' },
  ],
  source: 'Citas textuales. Caso ficticio.',
});

deck.save('ejemplo-sintesis.pptx').then(() => console.log('ok'));
