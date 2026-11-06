/**
 * Ejemplo de deck de relevamiento y propuesta con los arquetipos de alcance,
 * escenarios, olas, gobernanza y conclusiones.
 * Caso ficticio: el sistema de gestión de una red de gimnasios que se migra a una
 * plataforma nueva. Organización, módulos, equipos y números son inventados.
 * Reemplazar el contenido entero con el del proyecto.
 */
const { createDeck } = require('./deck-kit');

const deck = createDeck();

deck.scopeGrid({
  breadcrumb: ['Relevamiento', 'Alcance'],
  title: '6 secciones no las usa ningún equipo y casi todo lo que sí se usa necesita una mejora',
  groups: [
    { label: 'se migran', count: 22, style: 'solid' },
    { label: 'se construye desde cero', count: 1, style: 'accent', names: 'Panel de ocupación en vivo' },
    { label: 'quedan a definir por Producto', count: 2, style: 'outline', names: 'Avisos y campañas por mail, hoy en otra herramienta' },
    { label: 'no se migran', count: 6, style: 'muted', names: 'Torneos, Pases viejos, Convenios 2019, Admin anterior, Tienda y Blog' },
  ],
  stats: [
    { value: '147', label: 'cambios identificados en lo que se migra' },
    { value: '84', label: 'mejoras de lo que hay' },
    { value: '63', label: 'cambios nuevos para construir' },
  ],
  takeaway: ['La mayoría de las secciones en uso tiene ', { t: 'al menos un cambio para migrarla mejor', b: true }, ' a como se opera hoy.'],
  source: 'Fuente: relevamiento con 6 equipos. Caso ficticio.',
});

deck.scenarios({
  breadcrumb: ['Propuesta', 'Escenarios'],
  title: 'Tres rutas para migrar 22 módulos',
  lede: 'Las tres terminan igual: lo que se usa en vivo en las sedes va al final.',
  recommended: 0,
  recommendedLabel: 'Recomendado',
  scenarios: [
    { tag: 'Escenario 1', name: 'Por ola de riesgo', logic: '5 olas por criticidad', steps: ['Cobros y facturación', 'Planes y convenios', 'Clases y horarios', 'Promociones y fidelización', 'Operación en sede'] },
    { tag: 'Escenario 2', name: 'Por modo de uso', logic: '3 niveles de impacto en los datos', steps: ['Consultas y lectura', 'Configuración y cargas', 'Operación en vivo'] },
    { tag: 'Escenario 3', name: 'Módulo a módulo', logic: 'Secuencia lineal', steps: ['Una entrega por módulo', 'La planificación más simple', 'Operación en vivo al final'] },
  ],
  why: 'Es el de menor riesgo: pesa criticidad, equipos, procesos y cantidad de cambios de cada módulo.',
});

deck.scenario({
  breadcrumb: ['Propuesta', 'Escenario 1'],
  title: 'Migración por ola de riesgo',
  what: '5 olas de menor a mayor riesgo. Primero lo que usa un solo equipo, con pocos cambios y sin impacto en las sedes; lo que se usa en vivo va al final.',
  pros: ['Lo crítico va al final y no frena la operación.', 'Adopción progresiva antes de tocar lo que usan las sedes.', 'Se deja de usar la plataforma vieja de a poco.'],
  cons: ['Conviven las dos plataformas durante la migración.', 'La última ola concentra los módulos más importantes.'],
  baseline: { label: 'Ola 0', name: 'Panel de ocupación', text: 'Hoy vive en una planilla que recepción actualiza a mano.' },
  stages: [
    { label: 'Ola 1', name: 'Cobros', items: ['Facturas', 'Débitos', 'Recibos', 'Saldos'] },
    { label: 'Ola 2', name: 'Planes', items: ['Planes', 'Convenios', 'Altas corporativas', 'Bajas'] },
    { label: 'Ola 3', name: 'Fidelización', items: ['Promociones', 'Referidos', 'Beneficios', 'Encuestas'] },
    { label: 'Ola 4', name: 'Gestión', items: ['Instructores', 'Salas', 'Horarios', 'Integraciones', 'Reportes'] },
    { label: 'Ola 5', name: 'Operación en sede', items: ['Reservas', 'Socios', 'Accesos', 'Lista de espera', 'Atención'] },
  ],
});

const teams = [
  { code: 'F', name: 'Finanzas' }, { code: 'C', name: 'Comercial' }, { code: 'M', name: 'Marketing' },
  { code: 'R', name: 'Recepción' }, { code: 'P', name: 'Programación de clases' }, { code: 'A', name: 'Atención' },
];
const columns = [
  { label: 'Ola 1', name: 'Cobros', note: '*Se migra sin el histórico anterior a 2020.', items: [
    { name: 'Facturas', improve: 1, add: 1, teams: ['F'] }, { name: 'Débitos', improve: 2, teams: ['F'] },
    { name: 'Recibos*', improve: 2, add: 1, teams: ['F'], divider: true }, { name: 'Saldos', improve: 3, add: 1, teams: ['F'] } ] },
  { label: 'Ola 2', name: 'Planes', items: [
    { name: 'Planes', improve: 2, add: 2, teams: ['C'] }, { name: 'Convenios', improve: 1, add: 2, teams: ['C', 'F'], divider: true },
    { name: 'Altas corporativas', improve: 3, add: 3, teams: ['C'] }, { name: 'Bajas', improve: 2, add: 1, teams: ['C', 'A'] } ] },
  { label: 'Ola 3', name: 'Fidelización', items: [
    { name: 'Promociones', improve: 6, add: 5, teams: ['M', 'C'] }, { name: 'Referidos', improve: 2, add: 3, teams: ['M'] },
    { name: 'Beneficios', improve: 3, add: 2, teams: ['M', 'C'], divider: true }, { name: 'Encuestas*', improve: 1, add: 1, teams: ['M'], status: 'definir' } ] },
  { label: 'Ola 4', name: 'Gestión', items: [
    { name: 'Instructores', improve: 4, add: 3, teams: ['P'] }, { name: 'Salas', improve: 2, add: 2, teams: ['P', 'R'] },
    { name: 'Horarios', improve: 5, add: 4, teams: ['P', 'R'], divider: true }, { name: 'Integraciones', improve: 2, add: 1, teams: ['F', 'P'] },
    { name: 'Reportes', improve: 4, add: 2, teams: ['F', 'C', 'M'] } ] },
  { label: 'Ola 5', name: 'Operación en sede', items: [
    { name: 'Reservas', improve: 9, add: 7, teams: ['R', 'P', 'A'] }, { name: 'Socios', improve: 8, add: 6, teams: ['R', 'A', 'C', 'F'] },
    { name: 'Accesos', improve: 6, add: 4, teams: ['R'] }, { name: 'Lista de espera', improve: 7, add: 6, teams: ['R', 'A'], divider: true },
    { name: 'Atención', improve: 9, add: 6, teams: ['A', 'R', 'C'] } ] },
];
deck.waves({ breadcrumb: ['Propuesta', 'Escenario 1'], title: 'Qué entra en cada ola, quién lo usa y cuánto cambia', baseline: { label: 'Ola 0', name: 'Panel de ocupación' }, columns, teams, focus: 1 });
deck.waves({ breadcrumb: ['Propuesta', 'Escenario 1'], title: 'Qué entra en cada ola, quién lo usa y cuánto cambia', baseline: { label: 'Ola 0', name: 'Panel de ocupación' }, columns, teams });

deck.breakdown({
  breadcrumb: ['Gobernanza', 'Roles'],
  title: 'De un rol que ve todo a 12 roles: cada uno entra solo donde opera',
  total: { value: '12', label: 'roles: 10 específicos y 2 generales', body: ['Cada sección tiene un nivel de permiso por rol.', 'Los generales ven todo o administran todo.'] },
  partsLabel: 'Cómo se agrupan',
  parts: [
    { value: '3', title: 'De supervisión', body: 'Gerencia de sede y líderes de recepción y de clases' },
    { value: '3', title: 'Operativos', body: 'Recepción, Programación de clases y Atención' },
    { value: '3', title: 'Negocio', body: 'Marketing, Comercial y Finanzas' },
    { value: '1', title: 'Técnico', body: 'Soporte de sistemas' },
    { value: '2', title: 'Generales', body: 'Visualizador y administrador' },
  ],
  note: 'Al final de la migración, las empresas con plan corporativo gestionan sus altas en un portal propio.',
});

deck.scale({
  breadcrumb: ['Gobernanza', 'Permisos'],
  title: '4 niveles de permiso para cada rol en cada módulo',
  levels: [
    { name: 'Sin acceso', lead: 'El módulo no aparece para el rol.', body: 'Evita ruido y que se expongan datos sensibles.' },
    { name: 'Solo lectura', lead: 'Consulta, sin tocar nada.', body: 'Ver listados y detalle, filtrar y exportar.' },
    { name: 'Edición acotada', lead: 'Crea o modifica campos puntuales.', body: 'Sin cambiar la configuración del módulo.' },
    { name: 'Edición total', lead: 'Control completo del módulo.', body: 'Crear, configurar, aprobar y dar de baja, de a uno o en lote.' },
  ],
});

deck.profiles({
  breadcrumb: ['Gobernanza', 'Roles'],
  title: 'Cada perfil entra solo donde opera a diario',
  profiles: [
    { name: 'Atención', count: '7 secciones', body: ['Usa: ', { t: 'Socios, Reservas, Atención', b: true }, ', Bajas, Lista de espera'], tag: 'Atención al socio' },
    { name: 'Gerencia de sede', count: '12 secciones', body: 'Usa: Panel, Reservas, Socios, Salas, Horarios, Reportes, Promociones', tag: 'Estratégico' },
    { name: 'Líder de recepción', count: '9 secciones', body: 'Usa: Panel, Reservas, Socios, Accesos, Lista de espera', tag: 'Supervisión' },
    { name: 'Recepción', count: '6 secciones', body: 'Usa: Reservas, Socios, Accesos, Lista de espera', tag: 'Operación diaria' },
    { name: 'Líder de clases', count: '6 secciones', body: 'Usa: Instructores, Salas, Horarios, Reportes', tag: 'Planificación' },
    { name: 'Programación de clases', count: '4 secciones', body: 'Usa: Horarios, Salas, Instructores', tag: 'Planificación' },
  ],
});

deck.conclusions({
  breadcrumb: 'Conclusiones',
  title: 'Con esto Producto ya puede decidir cómo avanzar',
  done: { label: 'A lo que llegamos', items: [
    [{ t: 'Relevamiento de todas las secciones', b: true }, ': cuáles se mantienen, cuáles migran con mejoras y cuáles se construyen.'],
    [{ t: '3 escenarios', b: true }, ' de migración con pros, contras y secuencia.'],
    [{ t: '1 escenario recomendado', b: true }, ' por nivel de riesgo.'],
    [{ t: 'Modelo de 12 roles', b: true }, ' y 4 niveles de permiso por sección.'],
  ] },
  next: { label: 'Lo que tiene que decidir Producto', items: [
    [{ t: 'Si sigue el escenario recomendado', b: true }, ' o prefiere otro.'],
    [{ t: 'Si los avisos por mail se migran', b: true }, ' o quedan en la herramienta actual.'],
    [{ t: 'Si este trimestre arranca', b: true }, ' el diseño de la arquitectura de información.'],
    [{ t: 'Cómo se planifican los próximos trimestres', b: true }, ': discovery si aplica, diseño e ingeniería.'],
  ] },
  ask: ['Antes de diseñar cada sección, diseño de producto necesita ', { t: 'un espacio para pensar la arquitectura de información', b: true }, ' del nuevo sistema con lo relevado.'],
});

deck.save('ejemplo-relevamiento.pptx').then(() => console.log('ok'));
