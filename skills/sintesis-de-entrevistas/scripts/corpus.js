#!/usr/bin/env node
/* ============================================================================
   CORPUS DE ENTREVISTAS | motor de consolidacion y consulta

   La ficha de cada entrevista es la unica fuente. Todo lo demas (el acumulado,
   los conteos de recurrencia) se deriva de las fichas con
   este script, para que ningun documento largo tenga que pasar por el chat.

   uso:
     node corpus.js init <origen>              trae corpus.json, NOTAS.md y fichas del Project
     node corpus.js limpiar <transcripcion>    compacta una transcripcion antes de leerla
     node corpus.js add <ficha.md> [--dir .]   parsea una ficha y la incorpora
     node corpus.js map E13-D1=DC10 ...        mapea dolores a consolidados
     node corpus.js build                      regenera ACUMULADO.md
     node corpus.js query [opciones]           consulta sin abrir el acumulado
     node corpus.js check <ficha.md>           revisa la forma de una ficha
   ========================================================================== */

'use strict';
var fs = require('fs'), path = require('path');

var args = process.argv.slice(2);
var cmd = args[0];
var DIR = '.';
var di = args.indexOf('--dir');
if (di > -1) { DIR = args[di + 1]; args.splice(di, 2); }

var CORPUS = path.join(DIR, 'corpus.json');
var NOTAS = path.join(DIR, 'NOTAS.md');

function leerCorpus() {
  if (!fs.existsSync(CORPUS)) {
    return { proyecto: '', periodo: '', actualizado: '', entrevistas: [], dolores: [],
             workarounds: [], datos: [], actores: [], deseos: [], citas: [], vacios: [],
             inferencias: [], consolidados: {}, contradicciones: [] };
  }
  return JSON.parse(fs.readFileSync(CORPUS, 'utf8'));
}
function guardar(c) {
  c.actualizado = new Date().toISOString().slice(0, 10);
  fs.writeFileSync(CORPUS, JSON.stringify(c, null, 1));
}
function salir(msg) { console.error(msg); process.exit(1); }

/* =========================================================== PARSER DE FICHA */

function filasTabla(bloque) {
  return bloque.split('\n')
    .filter(function (l) { return /^\s*\|/.test(l) && !/^\s*\|[\s:|-]+\|\s*$/.test(l); })
    .map(function (l) {
      return l.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map(function (c) { return c.trim(); });
    });
}
function vinetas(bloque) {
  return bloque.split('\n')
    .filter(function (l) { return /^\s*[-*]\s+/.test(l); })
    .map(function (l) { return l.replace(/^\s*[-*]\s+/, '').trim(); });
}
function seccion(txt, num) {
  var re = new RegExp('^##\\s*0?' + num + '[.)]?\\s.*$', 'm');
  var m = txt.match(re);
  if (!m) return '';
  var desde = txt.indexOf(m[0]) + m[0].length;
  var resto = txt.slice(desde);
  var fin = resto.search(/^##\s/m);
  return fin === -1 ? resto : resto.slice(0, fin);
}
function meta(txt, campo) {
  var m = txt.match(new RegExp('^\\|\\s*' + campo + '\\s*\\|\\s*([^|]+?)\\s*\\|', 'mi'));
  return m ? m[1].trim() : '';
}

function parsearFicha(ruta) {
  var txt = fs.readFileSync(ruta, 'utf8');
  var h1 = txt.match(/^#\s*Entrevista\s+(E\d+)\s*\|\s*(.+)$/m);
  if (!h1) salir('No encuentro el encabezado "# Entrevista E0N | Perfil" en ' + ruta);
  var cod = h1[1];

  var f = {
    codigo: cod,
    perfilCorto: h1[2].trim(),
    perfil: meta(txt, 'Perfil') || h1[2].trim(),
    entrevistado: meta(txt, 'Entrevistado'),
    organizacion: meta(txt, 'Organizaci[oó]n'),
    fecha: meta(txt, 'Fecha'),
    duracion: meta(txt, 'Duraci[oó]n'),
    proyecto: meta(txt, 'Proyecto'),
    fuente: meta(txt, 'Fuente'),
    ficha: path.basename(ruta),
    dolores: [], workarounds: [], datos: [], actores: [], deseos: [],
    citas: [], vacios: [], inferencias: []
  };

  filasTabla(seccion(txt, 3)).forEach(function (r) {
    if (!r[0] || /^#$|^Dolor$/i.test(r[0])) return;
    f.dolores.push({ ref: cod + '-' + r[0], codigo: cod, id: r[0], texto: r[1] || '',
                     etapa: r[2] || '', severidad: r[3] || '', evidencia: r[4] || '' });
  });
  filasTabla(seccion(txt, 4)).forEach(function (r) {
    if (!r[0] || /^Workaround$/i.test(r[0])) return;
    f.workarounds.push({ codigo: cod, texto: r[0], compensa: r[1] || '', costo: r[2] || '', evidencia: r[3] || '' });
  });
  filasTabla(seccion(txt, 6)).forEach(function (r) {
    if (!r[0] || /^Dato$/i.test(r[0])) return;
    f.datos.push({ codigo: cod, dato: r[0], valor: r[1] || '', contexto: r[2] || '' });
  });
  f.deseos = vinetas(seccion(txt, 5)).map(function (t) { return { codigo: cod, texto: t }; });
  f.actores = vinetas(seccion(txt, 7)).map(function (t) { return { codigo: cod, texto: t }; });
  f.vacios = vinetas(seccion(txt, 9)).map(function (t) { return { codigo: cod, texto: t }; });
  f.inferencias = vinetas(seccion(txt, 10)).map(function (t) { return { codigo: cod, texto: t }; });
  f.contradicciones = f.inferencias.filter(function (i) { return /\[CONTRADICCI[OÓ]N\]/i.test(i.texto); })
    .map(function (i) {
      var cods = (i.texto.match(/E\d+/g) || []).concat([cod])
        .filter(function (v, k, a) { return a.indexOf(v) === k; });
      return { origen: cod, texto: i.texto.replace(/\[CONTRADICCI[OÓ]N\]\s*/i, ''), entre: cods, estado: 'abierta' };
    });
  f.citas = seccion(txt, 8).split('\n')
    .filter(function (l) { return /^\s*>\s*["“]/.test(l); })
    .map(function (l) { return { codigo: cod, texto: l.replace(/^\s*>\s*/, '').trim() }; });
  return f;
}

/* ==================================================================== ADD */

function limpiar(c, cod) {
  ['dolores', 'workarounds', 'datos', 'actores', 'deseos', 'citas', 'vacios', 'inferencias'].forEach(function (k) {
    c[k] = c[k].filter(function (x) { return x.codigo !== cod; });
  });
  c.entrevistas = c.entrevistas.filter(function (e) { return e.codigo !== cod; });
  c.contradicciones = (c.contradicciones || []).filter(function (x) { return x.origen !== cod; });
}

function cmdAdd(ruta) {
  if (!ruta) salir('uso: node corpus.js add <ficha.md>');
  var c = leerCorpus();
  var f = parsearFicha(ruta);
  var previos = {};
  c.dolores.filter(function (d) { return d.codigo === f.codigo; })
           .forEach(function (d) { previos[d.ref] = d.dc; });

  limpiar(c, f.codigo);            // upsert: reprocesar una ficha no duplica nada
  if (!c.proyecto) c.proyecto = f.proyecto;
  c.contradicciones = (c.contradicciones || []).concat(f.contradicciones);
  c.entrevistas.push({ codigo: f.codigo, perfil: f.perfil, entrevistado: f.entrevistado, organizacion: f.organizacion,
                       fecha: f.fecha, duracion: f.duracion, ficha: f.ficha });
  c.entrevistas.sort(function (a, b) { return a.codigo.localeCompare(b.codigo, 'es', { numeric: true }); });

  f.dolores.forEach(function (d) { if (previos[d.ref]) d.dc = previos[d.ref]; });
  ['dolores', 'workarounds', 'datos', 'actores', 'deseos', 'citas', 'vacios', 'inferencias'].forEach(function (k) {
    c[k] = c[k].concat(f[k]);
  });
  guardar(c);

  var sinMapear = f.dolores.filter(function (d) { return !d.dc; });
  console.log('Incorporada ' + f.codigo + ' | ' + f.perfil);
  console.log(f.dolores.length + ' dolores, ' + f.workarounds.length + ' workarounds, ' +
              f.datos.length + ' datos, ' + f.citas.length + ' citas, ' + f.vacios.length + ' vacios');
  console.log('Corpus: ' + c.entrevistas.length + ' entrevistas, ' + c.dolores.length + ' dolores');

  if (!sinMapear.length) { console.log('\nTodos los dolores ya estan mapeados.'); return; }

  /* El catalogo crece con cada entrevista, asi que no se imprime entero: van los
     recurrentes (los que se usan para mapear casi siempre) y los de una sola
     mencion que compartan vocabulario con algun dolor nuevo. El resto se
     consulta con `query --top 100` si hace falta. */
  function palabras(t) {
    return (t || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .split(/[^a-z0-9]+/).filter(function (w) { return w.length > 4; });
  }
  var vocab = {};
  sinMapear.forEach(function (d) { palabras(d.texto).forEach(function (w) { vocab[w] = true; }); });

  var menciones = {};
  c.dolores.forEach(function (d) {
    if (!d.dc) return;
    (menciones[d.dc] = menciones[d.dc] || []);
    if (menciones[d.dc].indexOf(d.codigo) < 0) menciones[d.dc].push(d.codigo);
  });

  /* Se rankea por vocabulario compartido y se corta en --max (20 por defecto),
     mas los 5 de mayor recurrencia. Con 15 entrevistas el catalogo pasa de 80
     consolidados: imprimirlo entero cuesta mas que el mapeo mismo. */
  var mi = args.indexOf('--max');
  var MAX = mi > -1 ? parseInt(args[mi + 1], 10) || 20 : 20;
  var todos = Object.keys(c.consolidados);
  function score(k) {
    return palabras(c.consolidados[k].label).filter(function (w) { return vocab[w]; }).length;
  }
  var porRec = todos.slice().sort(function (a, b) { return (menciones[b] || []).length - (menciones[a] || []).length; }).slice(0, 5);
  var porVoc = todos.filter(function (k) { return score(k) > 0; })
    .sort(function (a, b) { return score(b) - score(a) || (menciones[b] || []).length - (menciones[a] || []).length; })
    .slice(0, MAX);
  var cat = porRec.concat(porVoc.filter(function (k) { return porRec.indexOf(k) < 0; }));

  console.log('\n--- CANDIDATOS (' + cat.length + ' de ' + todos.length + ', el resto con query --buscar) ---');
  if (!cat.length) console.log('(ninguno todavia)');
  cat.forEach(function (k) {
    console.log(k + ' (' + (menciones[k] || []).length + ') ' + c.consolidados[k].label);
  });
  console.log('\n--- DOLORES SIN MAPEAR ---');
  sinMapear.forEach(function (d) { console.log(d.ref + ' :: ' + d.texto); });
  console.log('\nMapea con:  node corpus.js map ' + sinMapear[0].ref + '=DC1 ' +
              (sinMapear[1] ? sinMapear[1].ref + '=+Texto del consolidado nuevo' : ''));
}

/* ==================================================================== MAP */

function cmdMap(pares) {
  if (!pares.length) salir('uso: node corpus.js map E13-D1=DC10 E13-D3=+Nuevo consolidado');
  var c = leerCorpus();
  var nuevos = 0, mapeados = 0;
  pares.forEach(function (p) {
    var i = p.indexOf('=');
    if (i < 0) return;
    var ref = p.slice(0, i).trim(), destino = p.slice(i + 1).trim().replace(/^["']|["']$/g, '');
    var d = c.dolores.filter(function (x) { return x.ref === ref; })[0];
    if (!d) { console.log('no existe ' + ref); return; }
    var dc;
    if (destino[0] === '+') {
      var label = destino.slice(1).trim() || d.texto;
      var ids = Object.keys(c.consolidados)
        .filter(function (k) { return /^DC\d+$/.test(k); })
        .map(function (k) { return parseInt(k.slice(2), 10); });
      dc = 'DC' + (ids.length ? Math.max.apply(null, ids) + 1 : 1);
      c.consolidados[dc] = { label: label };
      nuevos++;
    } else {
      dc = destino.toUpperCase();
      if (!c.consolidados[dc]) { console.log('no existe ' + dc + ', usa + para crearlo'); return; }
    }
    d.dc = dc;
    mapeados++;
  });
  guardar(c);
  var sueltos = c.dolores.filter(function (d) { return !d.dc; }).length;
  console.log(mapeados + ' dolores mapeados, ' + nuevos + ' consolidados nuevos, ' + sueltos + ' sin mapear');
}

/* ================================================================== BUILD */

function recurrencia(c) {
  var out = {};
  c.dolores.forEach(function (d) {
    if (!d.dc) return;
    (out[d.dc] = out[d.dc] || { codigos: [], sev: [], fichas: [] });
    if (out[d.dc].codigos.indexOf(d.codigo) < 0) out[d.dc].codigos.push(d.codigo);
    if (d.severidad && !/SIN DATO/i.test(d.severidad)) out[d.dc].sev.push(d.severidad);
  });
  return out;
}
function severidadCross(sevs) {
  if (sevs.some(function (s) { return s.indexOf('🔴') > -1; })) return '🔴';
  if (sevs.some(function (s) { return s.indexOf('🟡') > -1; })) return '🟡';
  if (sevs.some(function (s) { return s.indexOf('🟢') > -1; })) return '🟢';
  return '[SIN DATO]';
}

function cmdBuild() {
  var c = leerCorpus();
  var n = c.entrevistas.length;
  var rec = recurrencia(c);
  var L = [];
  L.push('# Acumulado de entrevistas | ' + (c.proyecto || 'Proyecto'));
  L.push('');
  L.push('> Archivo generado por `corpus.js build` desde las fichas. No editar a mano:');
  L.push('> los cambios se pierden en el proximo build. El analisis cualitativo va en NOTAS.md.');
  L.push('> Actualizado: ' + c.actualizado + ' | Entrevistas procesadas: ' + n);
  L.push('');

  if (fs.existsSync(NOTAS)) {
    L.push('## Notas cualitativas');
    L.push('');
    L.push(fs.readFileSync(NOTAS, 'utf8').trim().replace(/^(#{2,5})\s/gm, '#$1 '));
    L.push('');
  }

  L.push('## Perfiles entrevistados');
  L.push('');
  L.push('| Codigo | Entrevistado | Perfil | Organizacion | Fecha | Ficha |');
  L.push('|---|---|---|---|---|---|');
  c.entrevistas.forEach(function (e) {
    L.push('| ' + e.codigo + ' | ' + (e.entrevistado || '') + ' | ' + e.perfil + ' | ' + e.organizacion + ' | ' + e.fecha + ' | ' + e.ficha + ' |');
  });
  L.push('');

  var orden = Object.keys(rec).sort(function (a, b) {
    return rec[b].codigos.length - rec[a].codigos.length ||
           parseInt(a.slice(2), 10) - parseInt(b.slice(2), 10);
  });
  var varios = orden.filter(function (k) { return rec[k].codigos.length > 1; });
  var unicos = orden.filter(function (k) { return rec[k].codigos.length === 1; });

  L.push('## Dolores por recurrencia');
  L.push('');
  L.push('| # | Dolor consolidado | Menciones | Perfiles | Severidad |');
  L.push('|---|---|---|---|---|');
  varios.forEach(function (k) {
    L.push('| ' + k + ' | ' + c.consolidados[k].label + ' | ' + rec[k].codigos.length + ' de ' + n +
           ' | ' + rec[k].codigos.join(', ') + ' | ' + severidadCross(rec[k].sev) + ' |');
  });
  L.push('');
  L.push('## Dolores de un solo perfil');
  L.push('');
  L.push('| # | Dolor | Perfil | Severidad |');
  L.push('|---|---|---|---|');
  unicos.forEach(function (k) {
    L.push('| ' + k + ' | ' + c.consolidados[k].label + ' | ' + rec[k].codigos[0] + ' | ' + severidadCross(rec[k].sev) + ' |');
  });
  L.push('');

  if (c.contradicciones.length) {
    L.push('## Contradicciones entre entrevistados');
    L.push('');
    c.contradicciones.forEach(function (x) {
      L.push('- **' + (x.estado || 'abierta') + '** ' + x.texto + ' [' + (x.entre || []).join(' ') + ']');
    });
    L.push('');
  }

  L.push('## Workarounds del ecosistema');
  L.push('');
  L.push('| Workaround | Compensa | Costo | Perfil |');
  L.push('|---|---|---|---|');
  c.workarounds.forEach(function (w) {
    L.push('| ' + w.texto + ' | ' + w.compensa + ' | ' + w.costo + ' | ' + w.codigo + ' |');
  });
  L.push('');
  L.push('## Datos duros del corpus');
  L.push('');
  L.push('| Dato | Valor | Contexto | Perfil |');
  L.push('|---|---|---|---|');
  c.datos.forEach(function (d) {
    L.push('| ' + d.dato + ' | ' + d.valor + ' | ' + d.contexto + ' | ' + d.codigo + ' |');
  });
  L.push('');
  L.push('## Deseos y pedidos explicitos');
  L.push('');
  c.deseos.forEach(function (d) { L.push('- ' + d.texto); });
  L.push('');
  L.push('## Actores y sistemas del ecosistema');
  L.push('');
  c.actores.forEach(function (a) { L.push('- ' + a.texto); });
  L.push('');
  L.push('## Vacios abiertos del corpus');
  L.push('');
  c.vacios.forEach(function (v) { L.push('- ' + v.texto + ' [' + v.codigo + ']'); });
  L.push('');
  L.push('## Inferencias declaradas');
  L.push('');
  c.inferencias.forEach(function (i) { L.push('- ' + i.texto + ' [' + i.codigo + ']'); });
  L.push('');

  var out = path.join(DIR, 'ACUMULADO.md');
  fs.writeFileSync(out, L.join('\n'));
  console.log('Escrito ' + out + ' | ' + n + ' entrevistas, ' + varios.length + ' dolores recurrentes, ' +
              unicos.length + ' de un solo perfil');
  var sueltos = c.dolores.filter(function (d) { return !d.dc; });
  if (sueltos.length) console.log('Ojo: ' + sueltos.length + ' dolores sin mapear no entraron. Corre map primero.');
}

function corta(t, max) {
  t = t.replace(/\s+/g, ' ').trim();
  return t.length <= max ? t : t.slice(0, max - 1).replace(/\s+\S*$/, '') + '...';
}

/* ================================================================= MIGRAR */
/* Levanta un acumulado escrito a mano y lo convierte en corpus.json, para no
   perder las entrevistas ya procesadas. Los dolores de entrevistas sin ficha
   entran como migrados: cuando se procese la ficha real, `add` los reemplaza. */

function tablaDe(txt, titulo) {
  var re = new RegExp('^##\\s*' + titulo + '\\s*$', 'mi');
  var m = txt.match(re);
  if (!m) return [];
  var resto = txt.slice(txt.indexOf(m[0]) + m[0].length);
  var fin = resto.search(/^##\s/m);
  return filasTabla(fin === -1 ? resto : resto.slice(0, fin));
}

function cmdMigrar(ruta) {
  if (!ruta) salir('uso: node corpus.js migrar <ACUMULADO-viejo.md>');
  var txt = fs.readFileSync(ruta, 'utf8');
  var c = leerCorpus();
  var h = txt.match(/^#\s*[^|\n]*\|\s*(.+)$/m);
  if (h && !c.proyecto) c.proyecto = h[1].trim();

  // perfiles, deduplicados por codigo
  var vistos = {};
  tablaDe(txt, 'Perfiles entrevistados').forEach(function (r) {
    if (!/^E\d+$/i.test(r[0] || '')) return;
    var cod = r[0].toUpperCase();
    if (vistos[cod]) return;
    vistos[cod] = true;
    c.entrevistas = c.entrevistas.filter(function (e) { return e.codigo !== cod; });
    c.entrevistas.push({ codigo: cod, perfil: r[1] || '', organizacion: r[2] || '',
                         fecha: r[3] || '', duracion: '',
                         ficha: /\.md/.test(r[4] || '') ? r[4] : 'sin ficha' });
  });
  c.entrevistas.sort(function (a, b) { return a.codigo.localeCompare(b.codigo, 'es', { numeric: true }); });

  var conFicha = {};
  c.dolores.forEach(function (d) { if (!d.migrado) conFicha[d.codigo] = true; });

  function importarDolores(filas, colLabel, colPerfiles, colSev) {
    filas.forEach(function (r) {
      var id = (r[0] || '').toUpperCase();
      if (!/^D[CU]\d+$/.test(id)) return;
      var label = r[colLabel] || '';
      var dc = id;   // los DU del acumulado viejo conservan su id, no chocan con los DC
      c.consolidados[dc] = { label: label };
      (r[colPerfiles] || '').split(/[,\s]+/).forEach(function (cod) {
        cod = cod.trim().toUpperCase();
        if (!/^E\d+$/.test(cod) || conFicha[cod]) return;
        c.dolores.push({ ref: cod + '-M' + (c.dolores.length + 1), codigo: cod, id: 'M', migrado: true,
                         texto: label, etapa: '', severidad: colSev != null ? (r[colSev] || '') : '',
                         evidencia: 'migrado del acumulado previo, sin ficha', dc: dc });
      });
    });
  }
  importarDolores(tablaDe(txt, 'Dolores por recurrencia'), 1, 3, 4);
  importarDolores(tablaDe(txt, 'Dolores de un solo perfil'), 1, 2, null);

  tablaDe(txt, 'Contradicciones entre entrevistados').forEach(function (r) {
    if (!r[0] || /^Tema$/i.test(r[0])) return;
    var codigos = (r[1] + ' ' + r[2]).match(/E\d+/g) || [];
    c.contradicciones.push({ texto: r[0] + ': ' + r[1] + ' contra ' + r[2],
                             entre: codigos.filter(function (v, i, a) { return a.indexOf(v) === i; }),
                             estado: /resuelt/i.test(r[3] || '') ? 'resuelta' : 'abierta' });
  });
  guardar(c);

  console.log('Migradas ' + c.entrevistas.length + ' entrevistas y ' +
              Object.keys(c.consolidados).length + ' consolidados desde ' + path.basename(ruta));
  console.log(c.dolores.filter(function (d) { return d.migrado; }).length + ' dolores migrados sin ficha: ' +
              'cuando proceses la ficha real de cada codigo, add los reemplaza por los dolores anclados.');
  console.log('\nLo que NO se migra automaticamente son las secciones narrativas (insights, notas de');
  console.log('cobertura, flujo consolidado). Copialas a NOTAS.md, que se inserta tal cual en cada build.');
}

/* ================================================================== QUERY */

function cmdQuery(opts) {
  var c = leerCorpus(), i;
  function op(n) { var k = opts.indexOf(n); return k > -1 ? (opts[k + 1] || true) : null; }

  if (op('--top')) {
    var rec = recurrencia(c), n = c.entrevistas.length;
    var lim = parseInt(op('--top'), 10) || 10;
    Object.keys(rec).sort(function (a, b) { return rec[b].codigos.length - rec[a].codigos.length; })
      .slice(0, lim).forEach(function (k) {
        console.log(k + '  ' + rec[k].codigos.length + '/' + n + '  ' + severidadCross(rec[k].sev) +
                    '  ' + c.consolidados[k].label + '  [' + rec[k].codigos.join(' ') + ']');
      });
    return;
  }
  if (op('--dc')) {
    var dc = String(op('--dc')).toUpperCase();
    console.log(dc + ': ' + (c.consolidados[dc] ? c.consolidados[dc].label : '?') + '\n');
    c.dolores.filter(function (d) { return d.dc === dc; }).forEach(function (d) {
      console.log('[' + d.codigo + '] ' + d.texto + '\n    etapa: ' + d.etapa + ' | sev: ' + d.severidad +
                  '\n    ' + d.evidencia + '\n');
    });
    return;
  }
  if (op('--perfil')) {
    var cod = String(op('--perfil')).toUpperCase();
    var e = c.entrevistas.filter(function (x) { return x.codigo === cod; })[0];
    if (!e) salir('no encuentro ' + cod);
    console.log(cod + ' | ' + e.perfil + ' | ' + e.organizacion + ' | ' + e.fecha + '\nficha: ' + e.ficha + '\n');
    console.log('DOLORES'); c.dolores.filter(function (d) { return d.codigo === cod; })
      .forEach(function (d) { console.log('  ' + d.ref + ' ' + (d.dc || 'sin mapear') + ' ' + d.texto); });
    console.log('CITAS'); c.citas.filter(function (x) { return x.codigo === cod; })
      .forEach(function (x) { console.log('  ' + x.texto); });
    return;
  }
  if (op('--buscar')) {
    var norm = function (t) { return String(t).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); };
    var terms = norm(op('--buscar')).split(/\s+/).filter(Boolean);
    var tope = parseInt(op('--max'), 10) || 40, n0 = 0;
    ['dolores', 'workarounds', 'datos', 'citas', 'deseos', 'vacios', 'inferencias'].forEach(function (k) {
      c[k].forEach(function (x) {
        var t = norm(JSON.stringify(x));
        if (!terms.every(function (w) { return t.indexOf(w) > -1; })) return;
        if (n0++ >= tope) return;
        var extra = x.dc ? ' (' + x.dc + ')' : '';
        var ev = x.evidencia && !/migrado/.test(x.evidencia) ? ' | ' + x.evidencia : '';
        console.log('[' + k + ' ' + x.codigo + '] ' + (x.texto || (x.dato + ': ' + x.valor)) + extra + ev);
      });
    });
    if (n0 > tope) console.log('... ' + (n0 - tope) + ' mas, afina la busqueda o usa --max');
    return;
  }
  if (op('--vacios')) { c.vacios.forEach(function (v) { console.log('[' + v.codigo + '] ' + v.texto); }); return; }
  if (op('--datos')) {
    c.datos.forEach(function (d) { console.log('[' + d.codigo + '] ' + d.dato + ': ' + d.valor + ' (' + d.contexto + ')'); });
    return;
  }
  if (op('--sin-mapear')) {
    c.dolores.filter(function (d) { return !d.dc; }).forEach(function (d) { console.log(d.ref + ' :: ' + d.texto); });
    return;
  }
  // resumen por defecto
  var r = recurrencia(c);
  console.log('proyecto     ' + c.proyecto);
  console.log('entrevistas  ' + c.entrevistas.length + ' (' + c.entrevistas.map(function (e) { return e.codigo; }).join(' ') + ')');
  console.log('dolores      ' + c.dolores.length + ' crudos, ' + Object.keys(r).length + ' consolidados');
  console.log('otros        ' + c.workarounds.length + ' workarounds, ' + c.datos.length + ' datos, ' +
              c.citas.length + ' citas, ' + c.vacios.length + ' vacios');
  console.log('\nopciones: --top N | --dc DC2 | --perfil E13 | --buscar texto | --vacios | --datos | --sin-mapear');
}

/* ================================================================== CHECK */

function cmdCheck(ruta) {
  if (!ruta) salir('uso: node corpus.js check <ficha.md>');
  var f = parsearFicha(ruta), avisos = [];
  [['Entrevistado', f.entrevistado], ['Perfil', f.perfil], ['Fecha', f.fecha], ['Organizacion', f.organizacion]].forEach(function (x) {
    if (!x[1]) avisos.push('falta metadata: ' + x[0]);
  });
  if (!f.dolores.length) avisos.push('sin dolores: la seccion 03 no se parseo o esta vacia');
  if (!f.citas.length) avisos.push('sin citas ancla: la seccion 08 no se parseo o esta vacia');
  if (!f.vacios.length) avisos.push('sin vacios declarados: nadie releva todo');
  f.dolores.forEach(function (d) {
    if (!d.evidencia) avisos.push(d.ref + ' sin evidencia');
    if (d.texto.length > 110) avisos.push(d.ref + ' mide ' + d.texto.length + ' caracteres, no entra en un sticky');
    if (/deberia|habria que|hay que implementar/i.test(d.texto)) avisos.push(d.ref + ' esta escrito como solucion, no como dolor');
  });
  f.workarounds.forEach(function (w) {
    if (w.texto.length > 110) avisos.push('workaround largo para sticky: ' + corta(w.texto, 50));
  });
  console.log(f.codigo + ' | ' + f.perfil);
  console.log(f.dolores.length + ' dolores, ' + f.workarounds.length + ' workarounds, ' + f.datos.length +
              ' datos, ' + f.citas.length + ' citas, ' + f.vacios.length + ' vacios, ' + f.inferencias.length + ' inferencias');
  if (!avisos.length) { console.log('\nSin observaciones.'); return; }
  console.log('\nREVISAR (' + avisos.length + ')');
  avisos.forEach(function (a) { console.log('  ' + a); });
}


/* =================================================================== INIT */
/* El contenedor se borra entre conversaciones. El corpus vive en el Project
   (solo lectura) y se trae a una carpeta de trabajo al empezar. */

function cmdInit(origen) {
  if (!origen) salir('uso: node corpus.js init <carpeta del Project> [--dir destino]');
  if (!fs.existsSync(DIR)) fs.mkdirSync(DIR, { recursive: true });
  var fdir = path.join(DIR, 'fichas');
  if (!fs.existsSync(fdir)) fs.mkdirSync(fdir);
  var traidos = [];
  fs.readdirSync(origen).forEach(function (f) {
    var src = path.join(origen, f);
    if (fs.statSync(src).isDirectory()) return;
    if (/^corpus.*\.json$/i.test(f)) { fs.copyFileSync(src, CORPUS); traidos.push(f); }
    else if (/^NOTAS.*\.md$/i.test(f)) { fs.copyFileSync(src, NOTAS); traidos.push(f); }
    else if (/(^|[_-])Entrevista_E\d+/i.test(f) && /\.md$/.test(f)) { fs.copyFileSync(src, path.join(fdir, f)); traidos.push(f); }
  });
  console.log(traidos.length ? 'Traidos: ' + traidos.length + ' archivos' : 'No hay corpus en ' + origen + ': proyecto nuevo o hay que migrar');
  if (fs.existsSync(CORPUS)) cmdQuery([]);
}

/* ================================================================ LIMPIAR */
/* Compacta una transcripcion de Meet o Zoom: une turnos seguidos del mismo
   hablante, saca los asentimientos sueltos y abrevia nombres. En una sesion
   de media hora baja cerca de un tercio el texto sin tocar lo que se dijo. */

var RELLENO = /^(ok(ay)?|mhm+|aj[aá]|claro|s[ií](,? s[ií])*|bueno|buen[ií]simo|est[aá] buen[ií]simo|perfecto|genial|dale|listo|vamos|nice|am[eé]n|tremendo|eh+|em+|c|seguimos|¿?entend[eé]s\??|¿?viste\??|o sea,?|bra|oi|all|yeah)[.,!?]*$/i;

function cmdLimpiar(ruta) {
  if (!ruta) salir('uso: node corpus.js limpiar <transcripcion.md|txt> [--out salida.md]');
  var lineas = fs.readFileSync(ruta, 'utf8').split('\n');
  var turnos = [], alias = {}, marca = '';
  lineas.forEach(function (l) {
    l = l.trim().replace(/^\*\*([^*]{1,60}?):\*\*\s*/, '$1: ').replace(/\\([-.()#!])/g, '$1');
    var t = l.match(/^#{1,4}\s*\**\s*(\d{2}:\d{2}:\d{2})/);
    if (t) { marca = '[' + t[1].slice(0, 5) + ']'; return; }
    var m = l.match(/^([A-ZÁÉÍÓÚÑ][^:]{1,60}):\s*(.*)$/);
    if (!m) return;
    var quien = m[1].trim(), dice = m[2].replace(/\\\*/g, '*').trim();
    if (!alias[quien]) alias[quien] = quien.split(/\s+/).map(function (w) { return w[0]; }).join('').toUpperCase();
    turnos.push({ q: alias[quien], t: dice, marca: marca });
    marca = '';
  });
  var out = [];
  turnos.forEach(function (x, i) {
    var prev = out[out.length - 1];
    var anterior = turnos[i - 1];
    var respuesta = anterior && anterior.q !== x.q && /\?\s*$/.test(anterior.t);
    var siguiente = turnos[i + 1];
    var interrupcion = anterior && siguiente && anterior.q === siguiente.q && anterior.q !== x.q &&
                       x.t.split(/\s+/).length <= 2 && /^[a-zñáéíóú]/.test(x.t) && !/\?/.test(x.t) && !/\d/.test(x.t);
    if (interrupcion && !respuesta) { if (x.marca && prev) prev.t += ' ' + x.marca; return; }
    if (RELLENO.test(x.t) && !(respuesta && /^(s[ií]|no)\b/i.test(x.t))) {
      if (x.marca && prev) prev.t += ' ' + x.marca;
      return;
    }
    if (prev && prev.q === x.q) prev.t += ' ' + (x.marca ? x.marca + ' ' : '') + x.t;
    else out.push({ q: x.q, t: (x.marca ? x.marca + ' ' : '') + x.t });
  });
  var leyenda = Object.keys(alias).map(function (k) { return alias[k] + '=' + k; }).join(' | ');
  var texto = 'HABLANTES: ' + leyenda + '\n\n' + out.map(function (x) { return x.q + ': ' + x.t; }).join('\n');
  var antes = fs.statSync(ruta).size, despues = Buffer.byteLength(texto);
  var oi = args.indexOf('--out');
  var destino = oi > -1 ? args[oi + 1] : ruta.replace(/(\.\w+)?$/, '.limpia.md');
  if (!out.length) salir('limpiar no reconocio ningun turno: revisar el formato de hablantes antes de seguir. No leer la transcripcion cruda como si estuviera limpia.');
  fs.writeFileSync(destino, texto + '\n');
  console.log('Escrito ' + destino + ' | ' + antes + ' -> ' + despues + ' bytes (' +
              Math.round(100 - despues * 100 / antes) + '% menos) | ' + out.length + ' turnos');
}



/* Cambia el texto de un consolidado sin tocar el mapeo. Para corregir un
   label que perdio periodo o alcance. */
function cmdRenombrar(dc, texto) {
  if (!dc || !texto) salir('uso: node corpus.js renombrar DC138 "Texto nuevo"');
  var c = leerCorpus();
  if (!c.consolidados[dc]) salir('No existe ' + dc);
  var antes = c.consolidados[dc].label;
  c.consolidados[dc].label = texto;
  guardar(c);
  console.log(dc + ' | ' + antes + '\n   -> ' + texto + '\nCorrer build para regenerar ACUMULADO.md');
}

/* ================================================================ AUDITAR */
/* Busca en las fichas los errores que la lectura de un tercero detecta y el
   check no: dolores en presente que la cita ubica en el pasado, citas
   recortadas sin su marco, hipoteticos y dichos de terceros tomados como
   hecho, cifras dudosas sin su "creo", y consolidados de una sola fuente que
   perdieron el alcance. No corrige: lista para revisar contra la
   transcripcion. Codigos: T tiempo, M marco, H hipotetico, R referido,
   C cifra, S severidad, A alcance del consolidado. */

var RX = {
  pasado: /a[ñn]o pasado|a[ñn]os? anterior|edici[oó]n(es)? (pasada|anterior)|ediciones (mucho )?m[aá]s anteriores|antes (era|se|lo|la|ten[ií]amos|hab[ií]a)|hace (un|dos|tres|\d+) (a[ñn]o|mes)|en (el )?20[12]\d|ya no |sol[ií]a|al principio|en su momento|antiguamente|la otra vez|la [uú]ltima vez/i,
  marcaTiempo: /\b20[12]\d\b|antes|anterior|pasad|ya no|resuelt|hasta |previ|edici[oó]n|temporada|no se repiti|en su momento/i,
  hipotetico: /\bsi (vos|yo|nosotros|ustedes|pudi|tuvi|hubi|me)|ser[ií]a|podr[ií]a|habr[ií]a|me imagino|supongo|capaz que|ojal[aá]/i,
  referido: /me dijeron|me contaron|dicen que|escuch[eé]|seg[uú]n (me|ellos|el|la)|tengo entendido|parece que|me comentaron/i,
  duda: /\bcreo\b|m[aá]s o menos|aprox|no s[eé]|calculo|ponele|capaz/i,
  recorte: /^["“]?\s*(y|pero|porque|que|entonces|o sea|as[ií] que|aun as[ií]|aún así)\b/i
};

function citaDe(ev) { var m = (ev || '').match(/["“]([^"”]+)["”]/); return m ? m[1] : ''; }

function cmdAuditar(opts) {
  var dirF = path.join(DIR, 'fichas');
  var solo = opts.indexOf('--perfil') > -1 ? opts[opts.indexOf('--perfil') + 1] : null;
  var archivos = fs.readdirSync(dirF).filter(function (f) { return /\.md$/.test(f); }).sort();
  var total = 0, porFicha = [];
  var c = fs.existsSync(path.join(DIR, 'corpus.json')) ? leerCorpus() : null;
  archivos.forEach(function (a) {
    var f; try { f = parsearFicha(path.join(dirF, a)); } catch (e) { return; }
    if (solo && f.codigo !== solo) return;
    var av = [];
    f.dolores.forEach(function (d) {
      var cita = citaDe(d.evidencia), todo = d.texto + ' ' + d.evidencia;
      if (RX.pasado.test(cita) && !RX.marcaTiempo.test(d.texto)) av.push('T  ' + d.ref + ' en presente, la cita lo ubica en el pasado: "' + corta(cita, 70) + '"');
      if (RX.recorte.test(cita)) av.push('M  ' + d.ref + ' cita que arranca a mitad de frase, revisar el marco: "' + corta(cita, 60) + '"');
      if (RX.hipotetico.test(cita)) av.push('H  ' + d.ref + ' la cita es hipotetica o condicional: "' + corta(cita, 60) + '"');
      if (RX.referido.test(todo)) av.push('R  ' + d.ref + ' dicho de tercero o de oidas: "' + corta(cita || d.texto, 60) + '"');
      if (/🔴/.test(d.severidad) && RX.pasado.test(cita) && !RX.marcaTiempo.test(d.severidad + d.texto)) av.push('S  ' + d.ref + ' 🔴 sin periodo en un hecho pasado');
    });
    var txt = fs.readFileSync(path.join(dirF, a), 'utf8');
    filasTabla(seccion(txt, 6)).forEach(function (r) {
      if (!r[0] || /^Dato$/i.test(r[0])) return;
      var cita = citaDe(r[3]);
      if (RX.duda.test(cita) && !RX.duda.test(r[1] + ' ' + r[2]) && !/aprox|~|\[VERIFICAR\]|estimad|como |entre |alrededor|sin certeza|no confirmad|cerca de|m[aá]s o menos/i.test(r[1] + ' ' + r[2]))
        av.push('C  ' + f.codigo + ' dato "' + corta(r[0], 40) + '" = ' + corta(r[1], 30) + ' perdio la duda de la cita: "' + corta(cita, 50) + '"');
    });
    if (c) {
      var rec = {};
      c.dolores.forEach(function (d) { if (d.dc) (rec[d.dc] = rec[d.dc] || []).push(d); });
      f.dolores.forEach(function (d) {
        var cd = c.dolores.filter(function (x) { return x.ref === d.ref; })[0];
        if (!cd || !cd.dc || !c.consolidados[cd.dc]) return;
        var lab = c.consolidados[cd.dc].label || '';
        if ((rec[cd.dc] || []).length === 1 && RX.marcaTiempo.test(d.texto) && !RX.marcaTiempo.test(lab))
          av.push('A  ' + cd.dc + ' (solo ' + d.ref + ') perdio el periodo que tiene el dolor: "' + corta(lab, 60) + '"');
      });
    }
    if (av.length) porFicha.push({ cod: f.codigo, av: av });
    total += av.length;
  });
  porFicha.forEach(function (x) { console.log('\n' + x.cod + ' | ' + x.av.length); x.av.forEach(function (l) { console.log('  ' + l); }); });
  console.log('\n' + total + ' avisos en ' + porFicha.length + ' fichas. Son señales, no errores: confirmar cada uno contra la transcripcion.');
}

/* ==================================================================== MAIN */

switch (cmd) {
  case 'init':    cmdInit(args[1]); break;
  case 'limpiar': cmdLimpiar(args[1]); break;
  case 'add':    cmdAdd(args[1]); break;
  case 'map':    cmdMap(args.slice(1)); break;
  case 'build':  cmdBuild(); break;
  case 'migrar': cmdMigrar(args[1]); break;
  case 'query':  cmdQuery(args.slice(1)); break;
  case 'check':  cmdCheck(args[1]); break;
  case 'auditar': cmdAuditar(args.slice(1)); break;
  case 'renombrar': cmdRenombrar(args[1], args[2]); break;
  default:
    console.log('uso:\n  node corpus.js init <origen>\n  node corpus.js limpiar <transcripcion> [--out f]\n  node corpus.js add <ficha.md>\n  node corpus.js map E13-D1=DC10 E13-D3=+Nuevo\n' +
                '  node corpus.js build\n' +
                '  node corpus.js migrar <ACUMULADO-viejo.md>\n' +
                '  node corpus.js query [--top 10|--dc DC2|--perfil E13|--buscar txt|--vacios|--datos|--sin-mapear]\n' +
                '  node corpus.js check <ficha.md>\n  node corpus.js auditar [--perfil E22]\n  (agrega --dir <carpeta> para trabajar fuera del directorio actual)');
}
