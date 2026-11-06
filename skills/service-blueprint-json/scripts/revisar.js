/* ============================================================================
   BLUEPRINT v2 | REVISOR DE CRITERIO
   Corre despues de validate.js. validate.js pregunta "se puede dibujar?".
   Este pregunta "es un buen blueprint?".

   uso: node revisar.js archivo.bp.json
   salida: observaciones de oficio + rubrica de 10 puntos.
   exit 0 si el puntaje es 8 o mas, 1 si es menor, 2 si el archivo no se lee.
   ========================================================================== */

'use strict';

var fs = require('fs');

var ruta = process.argv[2];
if (!ruta) { console.error('uso: node revisar.js archivo.bp.json'); process.exit(2); }

var m;
try { m = JSON.parse(fs.readFileSync(ruta, 'utf8')); }
catch (e) { console.error('JSON invalido: ' + e.message); process.exit(2); }

var obs = [];
function nota(nivel, msg, donde, clave) {
  obs.push({ nivel: nivel, msg: msg, donde: donde || '', clave: clave || msg });
}

/* ---------------------------------------------------------------- lectura -- */

var meta    = m.meta || {};
var pasos   = Array.isArray(m.pasos) ? m.pasos : [];
var fases   = Array.isArray(m.fases) ? m.fases : [];
var conex   = Array.isArray(m.conexiones) ? m.conexiones : [];
var actores = Array.isArray(m.actores) ? m.actores : [];

var LANES = ['EV', 'CJ', 'FS', 'BS', 'PS'];
if (Array.isArray(m.carriles) && m.carriles.length) {
  LANES = m.carriles.map(function (l) { return l.id; });
}

var accion = pasos.filter(function (p) { return p.tipo !== 'decision'; });
var decis  = pasos.filter(function (p) { return p.tipo === 'decision'; });

function cards(p, lane) {
  var c = (p.carriles || {})[lane];
  return Array.isArray(c) ? c : [];
}
function todas(lane) {
  var out = [];
  accion.forEach(function (p) { cards(p, lane).forEach(function (c) { out.push({ p: p, c: c }); }); });
  return out;
}
function hall(p) { return Array.isArray(p.hallazgos) ? p.hallazgos : []; }

var porLane = {};
LANES.forEach(function (l) { porLane[l] = todas(l); });

/* Una columna sin tarjeta de journey no es un hueco si una espera de una columna
   anterior la cubre con su span. Ese es el patron normal: el cliente espera
   mientras la organizacion trabaja en varias columnas seguidas. */
var cubierto = {};
accion.forEach(function (p, i) {
  cards(p, 'CJ').forEach(function (c) {
    if (c.tipo !== 'espera') return;
    var span = (c.span && c.span > 1) ? c.span : 1;
    for (var k = i; k < i + span && k < accion.length; k++) cubierto[accion[k].id] = true;
  });
});

var hallazgos = [];
pasos.forEach(function (p) { hall(p).forEach(function (h) { hallazgos.push({ p: p, h: h }); }); });
function deTipo(t) { return hallazgos.filter(function (x) { return x.h.tipo === t; }); }

var dolores  = deTipo('dolor');
var oports   = deTipo('oportunidad');
var citas    = deTipo('cita');
var datos    = deTipo('dato');
var pregs    = deTipo('pregunta');
var notas    = deTipo('nota');

/* -------------------------------------------------------------- encuadre -- */

if (!meta.titulo) nota('aviso', 'Sin titulo. El board abre sin decir de que servicio habla.');
if (!meta.subtitulo) {
  nota('aviso', 'Sin subtitulo. Ahi van el actor principal y el escenario: son las dos primeras preguntas de cualquiera que abra el board.');
}
if (!meta.variante) {
  nota('aviso', 'Sin variante. Decir "As is" o "To be" evita que se discuta un estado por otro.');
} else if (!/as.?is|to.?be|actual|futur|ideal/i.test(meta.variante + ' ' + (meta.estado || ''))) {
  nota('info', 'La variante no dice si es estado actual o futuro: "' + meta.variante + '".');
}
if (!meta.fuentes) {
  nota('aviso', 'Sin fuentes. Sin material declarado, el blueprint es opinion y no se puede auditar.');
}

/* ---------------------------------------------------------- granularidad -- */

var nCJ = 0;
accion.forEach(function (p) { nCJ += cards(p, 'CJ').length; });

var momentosCliente = accion.filter(function (p) { return cards(p, 'CJ').length > 0; }).length;

if (accion.length === 0) nota('error', 'No hay pasos de accion.');
if (momentosCliente < 6) {
  nota('aviso', 'Solo ' + momentosCliente + ' acciones del cliente. Menos de 6 suele ser una pantalla, no un servicio: revisa si el alcance quedo corto.');
} else if (momentosCliente > 12) {
  nota('info', momentosCliente + ' acciones del cliente. El rango comodo es 8 a 12: mas que eso conviene partir en dos blueprints con distinto zoom.');
}
if (accion.length > 20) {
  nota('aviso', accion.length + ' columnas. Arriba de 20 el board no se lee de una: fijate si hay acciones internas que se pueden resumir en una sola.');
}

if (fases.length === 0) nota('aviso', 'Sin fases. Las fases son lo que permite leer el board de lejos.');
else if (fases.length > 6) nota('info', fases.length + ' fases para ' + accion.length + ' momentos. Tres o cuatro alcanzan.');

accion.forEach(function (p) {
  if (!p.fase) nota('info', 'Pasos que no declaran fase.', p.id, 'sin-fase');
});

/* ------------------------------------------------- cobertura de carriles -- */

var huecosCJ = accion.filter(function (p) {
  return cards(p, 'CJ').length === 0 && !cubierto[p.id];
});
huecosCJ.forEach(function (p) {
  nota('aviso', 'Columnas sin nada en el journey y sin espera que las cubra: si el cliente no esta haciendo nada, declaralo como espera con span.',
    p.id, 'hueco-cj');
});

var nFS = porLane.FS ? porLane.FS.length : 0;
var nBS = porLane.BS ? porLane.BS.length : 0;
var nPS = porLane.PS ? porLane.PS.length : 0;
var nEV = porLane.EV ? porLane.EV.length : 0;

if (nBS === 0) {
  nota('aviso', 'Backstage vacio. Sin trabajo invisible no hay blueprint: es un journey map con carriles dibujados.');
} else if (nBS < accion.length * 0.5) {
  nota('info', 'Backstage flaco (' + nBS + ' tarjetas para ' + accion.length + ' momentos). En la mayoria de los servicios el backstage es el carril mas denso.');
}
if (nFS + nBS + nPS < nCJ) {
  nota('aviso', 'El lado del servicio (' + (nFS + nBS + nPS) + ' tarjetas) pesa menos que el del cliente (' + nCJ + '). El foco del blueprint es como se produce la experiencia, no solo como se vive.');
}
if (nPS === 0) {
  nota('info', 'Sin procesos de soporte. Puede estar bien en un blueprint muy acotado; revisa que no falte lo que ya venia pasando de antes.');
}
if (nEV === 0) {
  nota('aviso', 'Sin evidencias. Es la capa que vuelve tangible el servicio y la que permite discutir cosas concretas en el taller.');
} else if (nEV < accion.length / 3) {
  nota('info', 'Pocas evidencias (' + nEV + ' para ' + accion.length + ' momentos). Revisa los momentos de contacto: si el cliente no se lleva nada, eso es un hallazgo.');
}

/* ------------------------------------------------------------- ownership -- */

var sinActor = [];
['FS', 'BS'].forEach(function (l) {
  (porLane[l] || []).forEach(function (x) {
    if (!x.c.actor) {
      sinActor.push(x.c.id || x.p.id);
      nota('aviso', 'Tarjetas de frontstage o backstage sin actor: una accion sin responsable no se puede rediseñar ni asignar.',
        x.c.id || x.p.id, 'sin-actor');
    }
  });
});

var declarados = {};
actores.forEach(function (a) { declarados[a.id] = true; });
if (actores.length > 8) {
  nota('info', actores.length + ' actores declarados. Arriba de 8 conviene agrupar por rol y no por persona.');
}

/* ------------------------------------------------ redaccion de tarjetas -- */

var INFINITIVO = /^[a-záéíóúñ]+(ar|er|ir)(se|lo|la|le|los|las|nos|me|te)?\b/i;
var TERCERA    = /^[a-záéíóúñ]+(a|e|an|en)\b/i;
var DOLOR_DISFRAZADO = /^(no hay|no existe|falta|faltan|nadie|no se |no esta|no está|demora|tarda)/i;

function conjugado(t) { return TERCERA.test(t) && !INFINITIVO.test(t); }

// Las heuristicas de redaccion son para castellano. Si el archivo esta en otro
// idioma se apagan solas: mejor callarse que tirar treinta falsos positivos.
var idioma = process.argv[3];
if (!idioma) {
  var muestra = [], ok = 0;
  LANES.forEach(function (l) {
    (porLane[l] || []).forEach(function (x) {
      if (l !== 'EV' && x.c.texto) muestra.push(x.c.texto.trim());
    });
  });
  muestra.forEach(function (t) { if (conjugado(t) || INFINITIVO.test(t)) ok++; });
  idioma = (muestra.length >= 5 && ok / muestra.length < 0.4) ? 'otro' : 'es';
}
var ES = idioma === 'es';

LANES.forEach(function (l) {
  (porLane[l] || []).forEach(function (x) {
    var t = (x.c.texto || '').trim();
    if (!t) return;
    if (t.length > 120) {
      nota('aviso', 'Tarjetas de mas de 120 caracteres: casi siempre son dos acciones metidas en una.', x.c.id, 'tarjeta-larga');
    }
    if (ES && l !== 'EV' && x.c.tipo !== 'espera') {
      if (DOLOR_DISFRAZADO.test(t)) {
        nota('aviso', 'Tarjetas que son un dolor escrito como accion ("no hay", "falta", "nadie"): van en hallazgos.', x.c.id, 'dolor-disfrazado');
      } else if (INFINITIVO.test(t)) {
        nota('aviso', 'Tarjetas escritas en infinitivo: van en presente y tercera persona, como se narra lo que alguien hace ("arregla", "escribe", no "arreglar", "escribir").', x.c.id, 'infinitivo');
      } else if (!TERCERA.test(t)) {
        nota('info', 'Tarjetas que no arrancan con un verbo conjugado en tercera persona.', x.c.id, 'sin-verbo');
      }
      var tras = t.match(/\s+y\s+([a-záéíóúñ]+)\b/i);
      if (tras && conjugado(tras[1]) && t.length > 45) {
        nota('info', 'Tarjetas con dos verbos unidos por "y": revisa si no son dos acciones, y si son secuenciales van en dos columnas.', x.c.id, 'dos-verbos');
      }
    }
    if (x.c.actor && !declarados[x.c.actor]) {
      nota('info', 'Actores usados en tarjetas pero no declarados en el catalogo.', x.c.actor, 'actor-sin-declarar');
    }
  });
});

/* ----------------------------------------------------------- hallazgos -- */

if (dolores.length === 0) {
  nota('aviso', 'Sin dolores. Un as-is sin un solo quiebre no es un relevamiento, es un folleto.');
}
if (oports.length === 0) {
  nota('aviso', 'Sin oportunidades. Sin al menos una propuesta, el blueprint no le deja nada al que decide.');
}
if (pregs.length === 0) {
  nota('info', 'Sin preguntas abiertas. Declarar lo que no se sabe es parte del entregable: nadie relevo todo.');
}
if (citas.length === 0 && datos.length === 0) {
  nota('aviso', 'Sin citas ni datos. Nada en el board muestra que esto salga de research.');
}
dolores.concat(oports).forEach(function (x) {
  if (!x.h.id) nota('info', 'Dolores u oportunidades sin id: son los hallazgos que se cruzan con otros documentos.', x.p.id, 'hallazgo-sin-id');
});
pasos.forEach(function (p) {
  var d = hall(p).filter(function (h) { return h.tipo === 'dolor'; }).length;
  var o = hall(p).filter(function (h) { return h.tipo === 'oportunidad'; }).length;
  if (d >= 3 && o === 0) nota('info', 'Pasos con tres dolores o mas y ninguna oportunidad: research sin sintesis.', p.id, 'sin-sintesis');
});
var sinRef = dolores.filter(function (x) { return !x.h.ref; }).length;
if (dolores.length && sinRef === dolores.length) {
  nota('info', 'Ningun dolor apunta a una tarjeta con ref. El ref es lo que ata el dolor a la accion que lo causa.');
}

/* ------------------------------------------------- esperas y decisiones -- */

var esperas = 0;
LANES.forEach(function (l) {
  (porLane[l] || []).forEach(function (x) { if (x.c.tipo === 'espera') esperas++; });
});
if (esperas === 0 && accion.length >= 6) {
  nota('info', 'Sin esperas declaradas. En casi todo servicio el cliente espera en algun momento, y ese silencio suele ser el hallazgo mas caro.');
}
decis.forEach(function (d) {
  var r = Array.isArray(d.ramas) ? d.ramas : [];
  if (r.length > 3) nota('info', 'La decision tiene ' + r.length + ' ramas. Mas de tres vuelve ilegible el board.', d.id);
  if (!r.some(function (x) { return x.detalle; })) {
    nota('info', 'Las ramas no dicen volumen. Sin proporcion no se sabe cual camino importa.', d.id);
  }
});
if (decis.length > 2) {
  nota('info', decis.length + ' decisiones. Regla de un tercio: si despues de una bifurcacion cambia mas de un tercio del blueprint, es otro blueprint.');
}

/* ------------------------------------------------------------ conexiones -- */

if (conex.length === 0) {
  nota('info', 'Sin conexiones. Las flechas entre carriles son las que muestran dependencias, que es la mitad del valor del artefacto.');
} else if (conex.length > 8) {
  nota('info', conex.length + ' conexiones. Arriba de 8 el board se vuelve un plato de fideos: dejá las que cruzan carriles.');
}

/* -------------------------------------------------------------- rubrica -- */

var r = [
  ['Titulo y actor principal claros', !!meta.titulo && !!meta.subtitulo],
  ['Escenario y estado identificados', !!meta.subtitulo && !!meta.variante],
  ['Documenta fases y acciones del cliente', fases.length > 0 && huecosCJ.length === 0],
  ['Cubre frontstage, backstage y soporte', nFS > 0 && nBS > 0 && nPS > 0],
  ['Legible: 6 a 12 acciones del cliente, hasta 20 columnas', momentosCliente >= 6 && momentosCliente <= 12 && accion.length <= 20],
  ['Se entiende rapido: hasta 4 acciones por carril y paso', accion.every(function (p) {
    return LANES.every(function (l) { return cards(p, l).length <= 4; });
  })],
  ['Marca dependencias o momentos criticos', conex.length > 0 || notas.length > 0],
  ['Declara evidencia en los momentos de contacto', nEV >= Math.ceil(accion.length / 3)],
  ['Se sabe quien es responsable de cada accion', sinActor.length === 0],
  ['Propone algo para optimizar el servicio', oports.length > 0]
];

var puntaje = r.filter(function (x) { return x[1]; }).length;

/* --------------------------------------------------------------- salida -- */

console.log('archivo   ' + ruta);
console.log('blueprint ' + (meta.titulo || '(sin titulo)') + (meta.variante ? '  |  ' + meta.variante : ''));
console.log('contenido ' + accion.length + ' columnas (' + momentosCliente + ' con accion del cliente), ' +
  decis.length + ' decisiones, ' + fases.length + ' fases, ' + hallazgos.length + ' hallazgos');
console.log('carriles  ' + LANES.map(function (l) { return l + ' ' + (porLane[l] || []).length; }).join(' | '));
if (!ES) console.log('nota      el archivo no parece estar en castellano: apago los chequeos de redaccion');
console.log('');

function listar(t, nivel) {
  var arr = obs.filter(function (x) { return x.nivel === nivel; });
  if (!arr.length) return;
  var orden = [], grupos = {};
  arr.forEach(function (x) {
    if (!grupos[x.clave]) { grupos[x.clave] = { msg: x.msg, dondes: [] }; orden.push(x.clave); }
    if (x.donde) grupos[x.clave].dondes.push(x.donde);
  });
  console.log(t + ' (' + orden.length + ')');
  orden.forEach(function (k) {
    var g = grupos[k];
    var d = g.dondes;
    if (!d.length) { console.log('  ' + g.msg); return; }
    if (d.length === 1) { console.log('  [' + d[0] + '] ' + g.msg); return; }
    var muestra = d.slice(0, 8).join(', ') + (d.length > 8 ? ', y ' + (d.length - 8) + ' mas' : '');
    console.log('  ' + g.msg);
    console.log('      ' + d.length + ' casos: ' + muestra);
  });
  console.log('');
}
listar('REVISAR, el blueprint pierde valor asi', 'aviso');
listar('MIRAR, puede estar bien a proposito', 'info');

console.log('RUBRICA');
r.forEach(function (x, i) {
  console.log('  ' + (x[1] ? '[si]' : '[no]') + ' ' + (i + 1) + '. ' + x[0]);
});
console.log('');
console.log('puntaje   ' + puntaje + '/10' +
  (puntaje >= 10 ? '  listo para circular'
    : puntaje >= 8 ? '  sirve para llevar a un taller'
      : '  todavia no: mira los avisos de arriba'));

process.exit(puntaje >= 8 ? 0 : 1);
