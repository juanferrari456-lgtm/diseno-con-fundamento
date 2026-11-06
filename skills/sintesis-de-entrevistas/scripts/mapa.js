#!/usr/bin/env node
/* ============================================================================
   MAPA DEL CORPUS | indice transversal de artefactos de discovery

   Un discovery no produce solo entrevistas: produce fichas, blueprints, mapas,
   decks. Cargarlos todos en cada conversacion es imposible a partir de cierto
   tamanio. Este script arma un indice liviano de todo lo que existe y permite
   abrir solo el pedazo que hace falta.

   uso:
     node mapa.js indexar <archivos...>     construye indice.json
     node mapa.js indice                    escribe INDICE.md (lo que se adjunta)
     node mapa.js donde <id | texto>        en que artefactos vive algo
     node mapa.js dolores [--dup]           tabla unificada y colisiones de id
     node mapa.js abrir <archivo> [filtro]  extrae un pedazo, no el archivo entero
   ========================================================================== */

'use strict';
var fs = require('fs'), path = require('path');
var args = process.argv.slice(2), cmd = args[0];
var DIR = '.';
var di = args.indexOf('--dir'); if (di > -1) { DIR = args[di + 1]; args.splice(di, 2); }
var IDX = path.join(DIR, 'indice.json');

function leer() {
  return fs.existsSync(IDX) ? JSON.parse(fs.readFileSync(IDX, 'utf8')) : { artefactos: [] };
}
function guardar(x) {
  x.actualizado = new Date().toISOString().slice(0, 10);
  fs.writeFileSync(IDX, JSON.stringify(x, null, 1));
}
function corto(t, n) {
  t = String(t || '').replace(/\s+/g, ' ').trim();
  return t.length <= n ? t : t.slice(0, n - 1) + '…';
}

/* ============================================================== INDEXADORES */

function indexarBlueprint(ruta) {
  var bp = JSON.parse(fs.readFileSync(ruta, 'utf8'));
  var a = {
    tipo: 'blueprint', archivo: path.basename(ruta), ruta: ruta,
    titulo: (bp.meta || {}).titulo || '', variante: (bp.meta || {}).variante || '',
    resumen: (bp.meta || {}).subtitulo || '',
    fases: (bp.fases || []).map(function (f) { return f.label; }),
    pasos: [], dolores: [], oportunidades: [], preguntas: 0, citas: 0, datos: 0
  };
  (bp.pasos || []).forEach(function (p) {
    a.pasos.push({ id: p.id, label: p.label || '', tipo: p.tipo || 'accion' });
    (p.hallazgos || []).forEach(function (h) {
      if (h.tipo === 'dolor') a.dolores.push({ id: h.id || '', texto: h.texto, paso: p.id, label: p.label || '' });
      else if (h.tipo === 'oportunidad') a.oportunidades.push({ id: h.id || '', texto: h.texto, paso: p.id });
      else if (h.tipo === 'pregunta') a.preguntas++;
      else if (h.tipo === 'cita') a.citas++;
      else if (h.tipo === 'dato') a.datos++;
    });
  });
  return a;
}

function indexarData(ruta) {
  var previo = global.window;
  global.window = {};
  delete require.cache[require.resolve(path.resolve(ruta))];
  require(path.resolve(ruta));
  var D = global.window.DD;
  global.window = previo;
  if (!D) throw new Error('data.js no expuso window.DD');

  var a = {
    tipo: 'mapa', archivo: path.basename(ruta), ruta: ruta,
    titulo: 'Plataforma de mapas', resumen: (D.meta || {}).foco || '',
    meta: D.meta || {}, dolores: [], nodos: [], clientes: [], eventos: [], timeline: []
  };
  (D.pains || []).forEach(function (p) {
    a.dolores.push({ id: p.id, texto: p.texto, crit: p.crit || '', equipo: p.eq || '',
                     fuente: p.fuente || '', nodos: p.nodos || [], clientes: p.clientes || [] });
  });
  Object.keys(D.nodos || {}).forEach(function (anillo) {
    (D.nodos[anillo] || []).forEach(function (n) {
      a.nodos.push({ id: n.id, label: n.label, anillo: anillo, equipo: n.eq || '' });
    });
  });
  (D.clientes || []).forEach(function (c) { a.clientes.push({ id: c.id, label: c.label || c.nombre || '' }); });
  (D.eventos || []).forEach(function (e) { a.eventos.push({ id: e.id, label: e.label || e.nombre || '' }); });
  (D.timeline || []).forEach(function (t) { a.timeline.push(t.titulo || t.label || t.n || ''); });
  return a;
}

function indexarFicha(ruta) {
  var txt = fs.readFileSync(ruta, 'utf8');
  var h = txt.match(/^#\s*Entrevista\s+(E\d+)\s*\|\s*(.+)$/m);
  if (!h) return null;
  function metaCampo(c) {
    var m = txt.match(new RegExp('^\\|\\s*' + c + '\\s*\\|\\s*([^|]+?)\\s*\\|', 'mi'));
    return m ? m[1].trim() : '';
  }
  var dolores = [];
  var sec = txt.split(/^##\s*0?3[.)]?\s.*$/m)[1] || '';
  sec.split(/^##\s/m)[0].split('\n').forEach(function (l) {
    var c = l.split('|').map(function (x) { return x.trim(); });
    if (c.length > 4 && /^D\d+$/.test(c[1])) dolores.push({ id: h[1] + '-' + c[1], texto: c[2] });
  });
  return {
    tipo: 'ficha', archivo: path.basename(ruta), ruta: ruta,
    titulo: h[1], resumen: metaCampo('Perfil') || h[2],
    fecha: metaCampo('Fecha'), organizacion: metaCampo('Organizaci[oó]n'),
    dolores: dolores
  };
}

function cmdIndexar(rutas) {
  if (!rutas.length) { console.error('uso: node mapa.js indexar <archivos...>'); process.exit(1); }
  var x = leer();
  rutas.forEach(function (r) {
    if (!fs.existsSync(r)) { console.log('no existe: ' + r); return; }
    var a = null;
    try {
      if (/\.bp\.json$|_bp\.json$/.test(r)) a = indexarBlueprint(r);
      else if (/\.js$/.test(r)) a = indexarData(r);
      else if (/\.md$/.test(r)) a = indexarFicha(r);
      else if (/\.json$/.test(r)) a = indexarBlueprint(r);
    } catch (e) { console.log('no pude leer ' + path.basename(r) + ': ' + e.message); return; }
    if (!a) { console.log('tipo no reconocido: ' + path.basename(r)); return; }
    x.artefactos = x.artefactos.filter(function (o) { return o.archivo !== a.archivo; });
    x.artefactos.push(a);
    console.log('indexado ' + a.tipo + ': ' + a.archivo + ' (' + (a.dolores || []).length + ' dolores)');
  });
  x.artefactos.sort(function (a, b) { return a.tipo.localeCompare(b.tipo) || a.archivo.localeCompare(b.archivo); });
  guardar(x);
  var tot = x.artefactos.reduce(function (s, a) { return s + (a.dolores || []).length; }, 0);
  console.log('\nindice.json: ' + x.artefactos.length + ' artefactos, ' + tot + ' dolores indexados');
}

/* =================================================================== INDICE */

function cmdIndice() {
  var x = leer(), L = [];
  if (!x.artefactos.length) { console.error('indexa algo primero'); process.exit(1); }

  L.push('# Indice del corpus');
  L.push('');
  L.push('Este archivo es el unico que se adjunta siempre. Dice que existe y donde,');
  L.push('no repite el contenido. Para abrir un pedazo: `node mapa.js abrir <archivo> <filtro>`.');
  L.push('');
  L.push('Actualizado: ' + (x.actualizado || '') + '');
  L.push('');
  L.push('## Artefactos');
  L.push('');
  L.push('| Archivo | Tipo | Qué cubre | Volumen |');
  L.push('|---|---|---|---|');
  x.artefactos.forEach(function (a) {
    var vol = a.tipo === 'blueprint' ? (a.pasos || []).length + ' pasos, ' + a.dolores.length + ' dolores'
            : a.tipo === 'mapa' ? (a.nodos || []).length + ' nodos, ' + a.dolores.length + ' dolores'
            : a.dolores.length + ' dolores';
    var que = (a.titulo + (a.variante ? ' | ' + a.variante : '') + (a.resumen ? ' | ' + corto(a.resumen, 70) : ''));
    L.push('| `' + a.archivo + '` | ' + a.tipo + ' | ' + que + ' | ' + vol + ' |');
  });
  L.push('');

  var bps = x.artefactos.filter(function (a) { return a.tipo === 'blueprint'; });
  if (bps.length) {
    L.push('## Blueprints, paso por paso');
    L.push('');
    bps.forEach(function (a) {
      L.push('**' + a.titulo + ' | ' + a.variante + '** (`' + a.archivo + '`)');
      L.push('');
      L.push('- fases: ' + a.fases.join(' → '));
      L.push('- pasos: ' + a.pasos.map(function (p) { return p.id + ' ' + p.label; }).join(' | '));
      L.push('- dolores: ' + a.dolores.map(function (d) { return d.id; }).filter(Boolean).join(' '));
      L.push('- oportunidades: ' + a.oportunidades.map(function (d) { return d.id; }).filter(Boolean).join(' '));
      L.push('');
    });
  }

  var mapa = x.artefactos.filter(function (a) { return a.tipo === 'mapa'; })[0];
  if (mapa) {
    L.push('## Mapa');
    L.push('');
    var porAnillo = {};
    mapa.nodos.forEach(function (n) { (porAnillo[n.anillo] = porAnillo[n.anillo] || []).push(n.id + ' ' + n.label); });
    Object.keys(porAnillo).forEach(function (k) {
      L.push('- **' + k + '**: ' + porAnillo[k].join(' | '));
    });
    if (mapa.clientes.length) L.push('- **clientes**: ' + mapa.clientes.map(function (c) { return c.id + ' ' + c.label; }).join(' | '));
    if (mapa.eventos.length) L.push('- **eventos**: ' + mapa.eventos.map(function (e) { return e.id + ' ' + e.label; }).join(' | '));
    L.push('');
  }

  var fichas = x.artefactos.filter(function (a) { return a.tipo === 'ficha'; });
  if (fichas.length) {
    L.push('## Fichas de entrevista');
    L.push('');
    fichas.forEach(function (f) {
      L.push('- **' + f.titulo + '** ' + corto(f.resumen, 60) + ' | ' + f.dolores.length + ' dolores | `' + f.archivo + '`');
    });
    L.push('');
  }

  var col = colisiones(x);
  if (col.length) {
    L.push('## Avisos de consistencia');
    L.push('');
    L.push('Ids de dolor que significan cosas distintas segun el artefacto. Antes de citar');
    L.push('uno de estos en un entregable, verificar cual es: `node mapa.js donde <id>`.');
    L.push('');
    col.forEach(function (c) { L.push('- `' + c.id + '` aparece con ' + c.textos.length + ' significados distintos'); });
    L.push('');
  }

  L.push('## Como consultar');
  L.push('');
  L.push('```bash');
  L.push('node mapa.js donde P53            # en que artefactos vive un id, con su texto');
  L.push('node mapa.js donde "cortesias"    # busqueda por texto en todo el corpus');
  L.push('node mapa.js dolores --dup        # ids que colisionan entre artefactos');
  L.push('node mapa.js abrir 03-tecnologia-en-venue_bp.json --paso s4');
  L.push('node mapa.js abrir ficha-E13.md --seccion 03');
  L.push('```');

  var out = path.join(DIR, 'INDICE.md');
  fs.writeFileSync(out, L.join('\n'));
  var bytes = fs.statSync(out).size;
  console.log('Escrito ' + out + ' | ' + bytes + ' bytes, alrededor de ' + Math.round(bytes / 3.7) + ' tokens');
}

/* ==================================================================== DONDE */

function cmdDonde(q) {
  if (!q) { console.error('uso: node mapa.js donde <id | texto>'); process.exit(1); }
  var x = leer(), esId = /^[A-Z]+\d+$/i.test(q), hits = 0;
  var ql = q.toLowerCase();

  x.artefactos.forEach(function (a) {
    var donde = a.archivo + ' (' + a.tipo + (a.variante ? ' | ' + a.variante : '') + ')';
    (a.dolores || []).forEach(function (d) {
      var match = esId ? String(d.id).toLowerCase() === ql : String(d.texto).toLowerCase().indexOf(ql) > -1;
      if (!match) return;
      hits++;
      console.log('[dolor ' + (d.id || '') + '] ' + donde);
      console.log('    ' + d.texto);
      if (d.paso) console.log('    paso ' + d.paso + ' ' + (d.label || ''));
      if (d.fuente) console.log('    fuente ' + d.fuente);
      if (d.nodos && d.nodos.length) console.log('    nodos ' + d.nodos.join(' '));
      console.log('');
    });
    (a.oportunidades || []).forEach(function (o) {
      var match = esId ? String(o.id).toLowerCase() === ql : String(o.texto).toLowerCase().indexOf(ql) > -1;
      if (!match) return;
      hits++;
      console.log('[oportunidad ' + (o.id || '') + '] ' + donde + '\n    ' + o.texto + '\n');
    });
    (a.nodos || []).forEach(function (n) {
      if (esId ? n.id.toLowerCase() === ql : n.label.toLowerCase().indexOf(ql) > -1) {
        hits++;
        console.log('[nodo ' + n.id + '] ' + n.label + ' | anillo ' + n.anillo + ' | ' + donde + '\n');
      }
    });
    (a.pasos || []).forEach(function (p) {
      if (esId ? p.id.toLowerCase() === ql : String(p.label).toLowerCase().indexOf(ql) > -1) {
        hits++;
        console.log('[paso ' + p.id + '] ' + p.label + ' | ' + donde + '\n');
      }
    });
    if (a.tipo === 'ficha' && (esId ? a.titulo.toLowerCase() === ql : a.resumen.toLowerCase().indexOf(ql) > -1)) {
      hits++;
      console.log('[ficha ' + a.titulo + '] ' + a.resumen + ' | ' + a.archivo + '\n');
    }
  });
  if (!hits) console.log('sin resultados para "' + q + '"');
}

/* ================================================================== DOLORES */

function palabrasDe(t) {
  return String(t || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .split(/[^a-z0-9]+/).filter(function (w) { return w.length > 4; });
}
function parecido(a, b) {
  var A = palabrasDe(a), B = palabrasDe(b);
  if (!A.length || !B.length) return 0;
  var comunes = A.filter(function (w) { return B.indexOf(w) > -1; }).length;
  return comunes / Math.min(A.length, B.length);
}

/* Dos artefactos pueden usar el mismo id con texto distinto por dos motivos muy
   diferentes: porque uno reformulo la frase del otro (no pasa nada) o porque el
   id se desincronizo y hoy apunta a dolores distintos (rompe toda cita cruzada).
   Se distinguen por cuanto vocabulario comparten. */
function colisiones(x, incluirLeves) {
  var porId = {};
  x.artefactos.forEach(function (a) {
    (a.dolores || []).forEach(function (d) {
      if (!d.id) return;
      (porId[d.id] = porId[d.id] || []).push({ archivo: a.archivo, texto: d.texto });
    });
  });
  var out = [];
  Object.keys(porId).forEach(function (id) {
    var v = porId[id];
    if (v.length < 2) return;
    var min = 1;
    for (var i = 0; i < v.length; i++) {
      for (var j = i + 1; j < v.length; j++) min = Math.min(min, parecido(v[i].texto, v[j].texto));
    }
    if (min >= 0.6) return;                                  // misma frase reformulada
    out.push({ id: id, textos: v, grave: min < 0.25, similitud: min });
  });
  if (!incluirLeves) out = out.filter(function (c) { return c.grave; });
  out.sort(function (a, b) { return parseInt(a.id.replace(/\D/g, ''), 10) - parseInt(b.id.replace(/\D/g, ''), 10); });
  return out;
}

function cmdDolores(opts) {
  var x = leer();
  if (opts.indexOf('--dup') > -1) {
    var col = colisiones(x, opts.indexOf('--todas') > -1);
    if (!col.length) { console.log('Sin colisiones: cada id significa lo mismo en todos los artefactos.'); return; }
    console.log(col.length + ' ids que apuntan a dolores distintos segun el artefacto.');
    console.log('Citar uno de estos sin aclarar el archivo lleva a la afirmacion equivocada.\n');
    col.forEach(function (c) {
      console.log(c.id);
      c.textos.forEach(function (t) { console.log('   ' + t.archivo + ': ' + corto(t.texto, 80)); });
      console.log('');
    });
    return;
  }
  x.artefactos.forEach(function (a) {
    if (!(a.dolores || []).length) return;
    console.log('--- ' + a.archivo + ' ---');
    a.dolores.forEach(function (d) { console.log((d.id || '   ') + '  ' + corto(d.texto, 90)); });
    console.log('');
  });
}

/* =================================================================== ABRIR */

function cmdAbrir(ruta, opts) {
  if (!ruta) { console.error('uso: node mapa.js abrir <archivo> [--paso s4 | --dolor P53 | --seccion 03]'); process.exit(1); }
  if (!fs.existsSync(ruta)) {
    var x = leer();
    var a = x.artefactos.filter(function (o) { return o.archivo === ruta; })[0];
    if (a && fs.existsSync(a.ruta)) ruta = a.ruta; else { console.error('no encuentro ' + ruta); process.exit(1); }
  }
  function op(n) { var k = opts.indexOf(n); return k > -1 ? opts[k + 1] : null; }

  if (/\.json$/.test(ruta)) {
    var bp = JSON.parse(fs.readFileSync(ruta, 'utf8'));
    var paso = op('--paso'), dolor = op('--dolor');
    if (paso) {
      var p = (bp.pasos || []).filter(function (s) { return s.id === paso; })[0];
      if (!p) { console.error('no existe el paso ' + paso); process.exit(1); }
      console.log(JSON.stringify(p, null, 1));
      return;
    }
    if (dolor) {
      (bp.pasos || []).forEach(function (s) {
        (s.hallazgos || []).forEach(function (h) {
          if (h.id === dolor) console.log('paso ' + s.id + ' ' + (s.label || '') + '\n' + JSON.stringify(h, null, 1));
        });
      });
      return;
    }
    console.log(JSON.stringify(bp.meta, null, 1));
    console.log('\npasos: ' + (bp.pasos || []).map(function (s) { return s.id + ' ' + (s.label || ''); }).join(' | '));
    console.log('\nUsa --paso <id> o --dolor <id> para abrir una parte.');
    return;
  }

  var txt = fs.readFileSync(ruta, 'utf8');
  var sec = op('--seccion');
  if (sec) {
    var re = new RegExp('^##\\s*0?' + sec + '[.)]?\\s.*$', 'm');
    var m = txt.match(re);
    if (!m) { console.error('no encuentro la seccion ' + sec); process.exit(1); }
    var resto = txt.slice(txt.indexOf(m[0]));
    var fin = resto.slice(m[0].length).search(/^##\s/m);
    console.log(fin === -1 ? resto : resto.slice(0, m[0].length + fin));
    return;
  }
  console.log(txt.split('\n').filter(function (l) { return /^#{1,3}\s/.test(l); }).join('\n'));
  console.log('\nUsa --seccion <n> para abrir una parte.');
}

/* ==================================================================== MAIN */

switch (cmd) {
  case 'indexar': cmdIndexar(args.slice(1)); break;
  case 'indice':  cmdIndice(); break;
  case 'donde':   cmdDonde(args.slice(1).join(' ')); break;
  case 'dolores': cmdDolores(args.slice(1)); break;
  case 'abrir':   cmdAbrir(args[1], args.slice(2)); break;
  default:
    console.log('uso:\n  node mapa.js indexar <archivos...>\n  node mapa.js indice\n' +
                '  node mapa.js donde <id | texto>\n  node mapa.js dolores [--dup]\n' +
                '  node mapa.js abrir <archivo> [--paso s4 | --dolor P53 | --seccion 03]\n' +
                '  (agrega --dir <carpeta> para trabajar fuera del directorio actual)');
}
