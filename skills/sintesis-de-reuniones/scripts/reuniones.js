#!/usr/bin/env node
/* ============================================================================
   REUNIONES | minutas encadenadas por iniciativa

   La minuta de cada reunion es la unica fuente. El SEGUIMIENTO de la iniciativa
   se deriva de las minutas y guarda su propio estado en un comentario al final,
   asi que para encadenar la reunion siguiente alcanza con ese archivo.

   uso:
     node reuniones.js init <origen> [<origen> ...] --dir W   trae seguimiento y minutas
     node reuniones.js limpiar <transcripcion> --out W/t.md   compacta antes de leer
     node reuniones.js check <minuta.md> --dir W              revisa forma y referencias
     node reuniones.js add <minuta.md> --dir W                la suma al seguimiento
     node reuniones.js build --dir W                          regenera el seguimiento
     node reuniones.js rebuild --dir W                        reconstruye desde minutas/
     node reuniones.js query [--abiertas|--decisiones|--dueno X|--buscar "a b"|--id R02-A3] --dir W
   ========================================================================== */

'use strict';
var fs = require('fs'), path = require('path');

var args = process.argv.slice(2);
var cmd = args[0];
function opt(n) { var i = args.indexOf(n); if (i > -1) { var v = args[i + 1]; args.splice(i, 2); return v; } return null; }
function flag(n) { var i = args.indexOf(n); if (i > -1) { args.splice(i, 1); return true; } return false; }
var DIR = opt('--dir') || '.';
var FILTRO = opt('--iniciativa');
var MIN = path.join(DIR, 'minutas');
var RE_SEG = /_Reunion_Seguimiento.*\.md$/i;
var RE_MIN = /_Reunion_R\d+.*\.md$/i;

function salir(m) { console.error(m); process.exit(1); }
function sinTilde(s) { return (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim(); }
function corto(s, n) { s = s || ''; return s.length > n ? s.slice(0, n - 1) + '…' : s; }
function slug(s) {
  return (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^A-Za-z0-9]+/g, ' ').trim().split(' ')
    .map(function (w) { return w.charAt(0).toUpperCase() + w.slice(1); }).join('-');
}

/* ================================================================= ESTADO */

function archivoSeg() {
  if (!fs.existsSync(DIR)) return null;
  var f = fs.readdirSync(DIR).filter(function (x) { return RE_SEG.test(x); });
  return f.length ? path.join(DIR, f[0]) : null;
}
function leerEstado() {
  var f = archivoSeg();
  if (!f) return { iniciativa: '', reuniones: [] };
  var txt = fs.readFileSync(f, 'utf8');
  var m = txt.match(/<!--\s*ESTADO-JSON\s*([\s\S]*?)-->/);
  if (!m) salir('El seguimiento ' + path.basename(f) + ' no tiene bloque ESTADO-JSON. Usar rebuild con las minutas.');
  return JSON.parse(m[1]);
}

/* ================================================================= PARSER */

function filas(b) {
  return b.split('\n')
    .filter(function (l) { return /^\s*\|/.test(l) && !/^\s*\|[\s:|-]+\|\s*$/.test(l); })
    .map(function (l) { return l.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map(function (c) { return c.trim(); }); });
}
function vinetas(b) {
  return b.split('\n').filter(function (l) { return /^\s*[-*]\s+/.test(l); })
    .map(function (l) { return l.replace(/^\s*[-*]\s+/, '').trim(); });
}
function seccion(txt, n) {
  var m = txt.match(new RegExp('^##\\s*0?' + n + '[.)]?\\s.*$', 'm'));
  if (!m) return null;
  var resto = txt.slice(txt.indexOf(m[0]) + m[0].length);
  var fin = resto.search(/^##\s/m);
  return fin === -1 ? resto : resto.slice(0, fin);
}
function meta(txt, campo) {
  var m = txt.match(new RegExp('^\\|\\s*' + campo + '\\s*\\|\\s*([^|]*?)\\s*\\|', 'mi'));
  return m ? m[1].trim() : '';
}
function esEncabezado(r) { return !r[0] || /^#$|^id$/i.test(r[0]); }

function parsear(ruta) {
  var txt = fs.readFileSync(ruta, 'utf8');
  var h = txt.match(/^#\s*Reuni[oó]n\s+(R\d+)\s*\|\s*(.+)$/m);
  if (!h) salir('No encuentro "# Reunión R0N | Tema" en ' + ruta);
  var c = h[1];
  var r = {
    codigo: c, n: parseInt(c.slice(1), 10), tema: h[2].trim(), archivo: path.basename(ruta),
    iniciativa: meta(txt, 'Iniciativa'), fecha: meta(txt, 'Fecha'), tipo: meta(txt, 'Tipo'),
    modo: meta(txt, 'Modo'),
    participantes: meta(txt, 'Participantes').split(/[,;]/).map(function (s) { return s.trim(); }).filter(Boolean),
    objetivo: vinetas(seccion(txt, 1) || '').join(' '),
    resumen: vinetas(seccion(txt, 2) || ''),
    decisiones: [], acciones: [], seguimiento: [], temas: [], riesgos: [], contradicciones: [], personas: []
  };
  filas(seccion(txt, 3) || '').forEach(function (f) {
    if (esEncabezado(f) || /^decisi/i.test(f[1])) return;
    r.decisiones.push({ id: c + '-' + f[0], texto: f[1] || '', decidio: f[2] || '', reemplaza: f[3] || '', evidencia: f[4] || '' });
  });
  filas(seccion(txt, 4) || '').forEach(function (f) {
    if (esEncabezado(f) || /^acci/i.test(f[1])) return;
    r.acciones.push({ id: c + '-' + f[0], texto: f[1] || '', dueno: f[2] || '', plazo: f[3] || '', evidencia: f[4] || '' });
  });
  filas(seccion(txt, 5) || '').forEach(function (f) {
    if (!/^R\d+-(A|T|K)\d+$/i.test(f[0])) return;
    r.seguimiento.push({ ref: f[0].toUpperCase(), estado: f[1] || '', novedad: f[2] || '', evidencia: f[3] || '' });
  });
  filas(seccion(txt, 6) || '').forEach(function (f) {
    if (esEncabezado(f) || /^tema/i.test(f[1])) return;
    r.temas.push({ id: c + '-' + f[0], texto: f[1] || '', dueno: f[2] || '', evidencia: f[3] || '' });
  });
  filas(seccion(txt, 7) || '').forEach(function (f) {
    if (esEncabezado(f) || /^riesgo/i.test(f[1])) return;
    r.riesgos.push({ id: c + '-' + f[0], texto: f[1] || '', depende: f[2] || '', evidencia: f[3] || '' });
  });
  filas(seccion(txt, 12) || '').forEach(function (f) {
    if (!f[0] || /^nombre$/i.test(f[0])) return;
    r.personas.push({ nombre: f[0], variantes: (f[1] || '').split(/[,;]/).map(function (v) { return v.trim().replace(/^"|"$/g, ''); }).filter(Boolean), rol: f[2] || '' });
  });
  r.contradicciones = vinetas(seccion(txt, 11) || '')
    .filter(function (v) { return /\[CONTRADICCI[OÓ]N\]/i.test(v); })
    .map(function (v) { return c + ' | ' + v.replace(/\[CONTRADICCI[OÓ]N\]\s*/i, ''); });
  return r;
}

/* ================================================================ DERIVAR */

var ESTADOS = {
  A: { abiertos: ['abierta', 'en curso', 'bloqueada'], cerrados: ['hecha', 'cancelada'] },
  T: { abiertos: ['abierto', 'sigue abierto'], cerrados: ['resuelto', 'descartado'] },
  K: { abiertos: ['vigente', 'materializado'], cerrados: ['mitigado', 'descartado'] }
};
function tipoDe(id) { var m = id.match(/-(DEC|A|T|K)\d+$/i); return m ? m[1].toUpperCase() : ''; }

function derivar(est) {
  var R = est.reuniones.slice().sort(function (a, b) { return a.n - b.n; });
  var items = {}, orden = [];
  R.forEach(function (r) {
    function alta(x, tipo, extra) {
      var it = { id: x.id, tipo: tipo, texto: x.texto, origen: r.codigo, fechaOrigen: r.fecha,
                 estado: tipo === 'A' ? 'Abierta' : tipo === 'T' ? 'Abierto' : tipo === 'K' ? 'Vigente' : 'Vigente',
                 novedad: '', ultima: r.n, historia: [] };
      Object.keys(extra).forEach(function (k) { it[k] = extra[k]; });
      items[x.id] = it; orden.push(x.id);
    }
    r.decisiones.forEach(function (d) { alta(d, 'DEC', { decidio: d.decidio }); });
    r.acciones.forEach(function (a) { alta(a, 'A', { dueno: a.dueno, plazo: a.plazo }); });
    r.temas.forEach(function (t) { alta(t, 'T', { dueno: t.dueno }); });
    r.riesgos.forEach(function (k) { alta(k, 'K', { dueno: k.depende }); });
    r.decisiones.forEach(function (d) {
      var ajusta = /ajust/i.test(d.reemplaza);
      (d.reemplaza.match(/R\d+-DEC\d+/gi) || []).forEach(function (ref) {
        ref = ref.toUpperCase();
        if (!items[ref]) return;
        items[ref].estado = (ajusta ? 'Vigente, ajustada por ' : 'Reemplazada por ') + d.id;
        items[ref].ultima = r.n;
      });
    });
    r.seguimiento.forEach(function (s) {
      var it = items[s.ref];
      if (!it) return;
      it.estado = s.estado; it.novedad = s.novedad; it.ultima = r.n;
      it.historia.push(r.codigo + ': ' + s.estado + (s.novedad ? ' | ' + s.novedad : ''));
    });
  });
  var ultimaN = R.length ? R[R.length - 1].n : 0;
  var ns = R.map(function (r) { return r.n; });
  orden.forEach(function (id) {
    var it = items[id];
    it.sinMencion = ns.filter(function (n) { return n > it.ultima; }).length;
    var t = ESTADOS[it.tipo];
    it.abierto = it.tipo === 'DEC' ? !/^reemplazada/i.test(it.estado)
      : !t.cerrados.some(function (e) { return sinTilde(it.estado).indexOf(e) === 0; });
  });
  return { R: R, items: items, orden: orden, ultimaN: ultimaN, glosario: glosario(R) };
}

function glosario(R) {
  var g = {}, orden = [];
  R.forEach(function (r) {
    function sumar(nombre, variantes, rol, participo) {
      var base = nombre.replace(/\s*\(.*\)\s*$/, '').trim();
      var k = sinTilde(base);
      if (!k) return;
      if (!g[k]) { g[k] = { nombre: base, variantes: [], rol: '', reuniones: [] }; orden.push(k); }
      variantes.forEach(function (v) { if (g[k].variantes.map(sinTilde).indexOf(sinTilde(v)) === -1 && sinTilde(v) !== k) g[k].variantes.push(v); });
      var mrol = nombre.match(/\(([^)]*)\)/);
      if (rol) g[k].rol = rol; else if (mrol && !g[k].rol) g[k].rol = mrol[1];
      if (participo && g[k].reuniones.indexOf(r.codigo) === -1) g[k].reuniones.push(r.codigo);
    }
    r.participantes.forEach(function (p) { sumar(p, [], '', true); });
    (r.personas || []).forEach(function (p) { sumar(p.nombre, p.variantes, p.rol, false); });
  });
  return orden.map(function (k) { return g[k]; });
}

/* =================================================================== INIT */

function cmdInit(origenes) {
  if (!origenes.length) salir('uso: node reuniones.js init <origen> [...] --dir W');
  if (!fs.existsSync(MIN)) fs.mkdirSync(MIN, { recursive: true });
  var traidos = 0, segs = [];
  origenes.forEach(function (o) {
    if (!fs.existsSync(o)) return;
    (function recorrer(d) {
      fs.readdirSync(d).forEach(function (f) {
        var p = path.join(d, f);
        if (fs.statSync(p).isDirectory()) { if (!/^(node_modules|\.)/.test(f)) recorrer(p); return; }
        if (RE_SEG.test(f)) { segs.push(p); }
        else if (RE_MIN.test(f)) { fs.copyFileSync(p, path.join(MIN, f)); traidos++; }
      });
    })(o);
  });
  var filtro = FILTRO;
  if (filtro) segs = segs.filter(function (s) { return sinTilde(path.basename(s)).indexOf(sinTilde(slug(filtro))) > -1; });
  if (segs.length > 1) {
    console.log('Hay ' + segs.length + ' seguimientos. Repetir init con --iniciativa "<nombre>":');
    segs.forEach(function (s) { console.log('  ' + path.basename(s)); });
    return;
  }
  if (segs.length) fs.copyFileSync(segs[0], path.join(DIR, path.basename(segs[0])));
  console.log('Minutas traídas: ' + traidos + ' | Seguimiento: ' + (segs.length ? path.basename(segs[0]) : 'no hay'));
  estadoCorto();
}

function estadoCorto() {
  var est = leerEstado();
  if (!est.reuniones.length) {
    var n = fs.existsSync(MIN) ? fs.readdirSync(MIN).filter(function (f) { return RE_MIN.test(f); }).length : 0;
    console.log('Sin cadena. Próximo código sugerido: R' + String(n + 1).padStart(2, '0'));
    return;
  }
  var d = derivar(est);
  var ult = d.R[d.R.length - 1];
  console.log('Iniciativa: ' + est.iniciativa + ' | ' + d.R.length + ' reuniones | última ' + ult.codigo +
              ' (' + ult.fecha + ') | próxima R' + String(d.ultimaN + 1).padStart(2, '0'));
  var ab = d.orden.map(function (id) { return d.items[id]; })
    .filter(function (it) { return it.abierto && it.tipo !== 'DEC'; });
  console.log('\nAbiertos para la sección 05 (' + ab.length + '):');
  ab.forEach(function (it) {
    console.log('  ' + it.id + ' | ' + corto(it.texto, 70) + ' | ' + (it.dueno || '-') +
                (it.plazo ? ' | ' + it.plazo : '') + ' | ' + it.estado);
  });
  var vig = d.orden.map(function (id) { return d.items[id]; }).filter(function (it) { return it.tipo === 'DEC' && it.abierto; });
  console.log('\nDecisiones vigentes (' + vig.length + '):');
  vig.slice(-12).forEach(function (it) {
    console.log('  ' + it.id + ' | ' + corto(it.texto, 80) + (/ajustada/i.test(it.estado) ? ' | ' + it.estado.replace(/^Vigente,\s*/i, '') : ''));
  });
  console.log('\nGlosario de personas (usar para normalizar nombres de la transcripción):');
  d.glosario.forEach(function (p) {
    console.log('  ' + p.nombre + (p.variantes.length ? ' | variantes: ' + p.variantes.join(', ') : '') + (p.rol ? ' | ' + p.rol : ''));
  });
}

/* ================================================================ LIMPIAR */

var RELLENO = /^(ok(ay)?|mhm+|aj[aá]|claro|s[ií](,? s[ií])*|bueno|buen[ií]simo|perfecto|genial|dale|listo|nice|eh+|em+|¿?entend[eé]s\??|¿?viste\??|o sea,?|yeah|exacto|tal cual)[.,!?]*$/i;

function cmdLimpiar(ruta) {
  if (!ruta) salir('uso: node reuniones.js limpiar <transcripcion> --out salida.md');
  var destino = opt('--out') || ruta.replace(/(\.\w+)?$/, '.limpia.md');
  var lineas = fs.readFileSync(ruta, 'utf8').split('\n');
  var turnos = [], alias = {}, marca = '', usados = {};
  lineas.forEach(function (l) {
    l = l.trim();
    var t = l.match(/^#{0,4}\s*\**\s*(\d{1,2}:\d{2}(:\d{2})?)\s*\**\s*$/);
    if (t) { var p = t[1].split(':'); marca = '[' + (p.length === 3 && parseInt(p[0], 10) > 0 ? parseInt(p[0], 10) + ':' + p[1] + ':' + p[2] : (p.length === 3 ? p[1] + ':' + p[2] : p[0].padStart(2, '0') + ':' + p[1])) + ']'; return; }
    var m = l.match(/^\**([A-ZÁÉÍÓÚÑ][^:*]{1,60}?)\**\s*:\s*\**\s*(.*)$/);
    if (!m || /^(https?|nota|resumen|detalles|pr[oó]ximos pasos)$/i.test(m[1].trim())) return;
    var quien = m[1].trim(), dice = m[2].replace(/\\\*/g, '*').trim();
    if (!dice) return;
    if (!alias[quien]) {
      var a = quien.split(/\s+/).map(function (w) { return w[0]; }).join('').toUpperCase(), k = a, i = 2;
      while (usados[k]) k = a + i++;
      usados[k] = 1; alias[quien] = k;
    }
    turnos.push({ q: alias[quien], t: dice, marca: marca }); marca = '';
  });
  var out = [];
  turnos.forEach(function (x, i) {
    var prev = out[out.length - 1], ant = turnos[i - 1];
    var respuesta = ant && ant.q !== x.q && /\?\s*$/.test(ant.t);
    if (RELLENO.test(x.t) && !(respuesta && /^(s[ií]|no|dale|listo)\b/i.test(x.t))) {
      if (x.marca && prev) prev.t += ' ' + x.marca; return;
    }
    if (prev && prev.q === x.q) prev.t += ' ' + (x.marca ? x.marca + ' ' : '') + x.t;
    else out.push({ q: x.q, t: (x.marca ? x.marca + ' ' : '') + x.t });
  });
  if (!out.length) {
    console.log('0 turnos: el archivo no tiene formato "Nombre: texto". Probablemente son solo notas o un resumen. Leer el original.');
    return;
  }
  var ley = Object.keys(alias).map(function (k) { return alias[k] + '=' + k; }).join(' | ');
  var texto = 'HABLANTES (nombres tal como vienen, pueden estar mal transcriptos): ' + ley + '\n\n' +
    out.map(function (x) { return x.q + ': ' + x.t; }).join('\n');
  fs.writeFileSync(destino, texto + '\n');
  var antes = fs.statSync(ruta).size, despues = Buffer.byteLength(texto);
  console.log('Escrito ' + destino + ' | ' + antes + ' -> ' + despues + ' bytes (' +
              Math.round(100 - despues * 100 / antes) + '% menos) | ' + out.length + ' turnos');
}

/* ================================================================== CHECK */

function cmdCheck(ruta) {
  if (!ruta) salir('uso: node reuniones.js check <minuta.md> --dir W');
  var txt = fs.readFileSync(ruta, 'utf8'), av = [], err = [];
  if (/[\u2014\u2013\u00b7]/.test(txt)) err.push('Hay raya larga (em dash o en dash) o punto medio en el texto. Reemplazar por "|", "-" o ",".');
  for (var s = 1; s <= 12; s++) if (seccion(txt, s) === null) err.push('Falta la sección ' + String(s).padStart(2, '0'));
  ['Iniciativa', 'Fecha', 'Tipo', 'Participantes', 'Modo'].forEach(function (c) { if (!meta(txt, c)) av.push('Falta el dato "' + c + '" en la tabla de inicio'); });
  var r = parsear(ruta);
  if (!/_Reunion_R\d+-/.test(path.basename(ruta))) av.push('El nombre de archivo no sigue {Iniciativa}_Reunion_{R0N}-{Tema}_{Periodo}.md');
  function largo(lista, campo, sec) {
    lista.forEach(function (x) { if ((x[campo] || '').length > 110) av.push(sec + ' ' + x.id + ' supera 110 caracteres'); });
  }
  largo(r.decisiones, 'texto', '03'); largo(r.acciones, 'texto', '04'); largo(r.temas, 'texto', '06'); largo(r.riesgos, 'texto', '07');
  r.decisiones.forEach(function (d) {
    if (!/^R\d+-DEC\d+$/.test(d.id)) err.push('ID de decisión inválido: ' + d.id + ' (usar DEC1, DEC2)');
    if (!d.evidencia) err.push(d.id + ' sin evidencia');
  });
  r.acciones.forEach(function (a) {
    if (!/^R\d+-A\d+$/.test(a.id)) err.push('ID de acción inválido: ' + a.id + ' (usar A1, A2)');
    if (!a.dueno) err.push(a.id + ' sin dueño: poner nombre o [SIN DUEÑO]');
    if (!a.plazo) av.push(a.id + ' sin plazo: poner fecha o [SIN PLAZO]');
    if (!a.evidencia) err.push(a.id + ' sin evidencia');
  });
  r.temas.forEach(function (t) { if (!/^R\d+-T\d+$/.test(t.id)) err.push('ID de tema inválido: ' + t.id); });
  r.riesgos.forEach(function (k) { if (!/^R\d+-K\d+$/.test(k.id)) err.push('ID de riesgo inválido: ' + k.id); });
  var est = leerEstado();
  if (est.reuniones.length) {
    var d = derivar({ iniciativa: est.iniciativa, reuniones: est.reuniones.filter(function (x) { return x.codigo !== r.codigo; }) });
    r.seguimiento.forEach(function (s) {
      var it = d.items[s.ref];
      if (!it) { err.push('05: ' + s.ref + ' no existe en el seguimiento'); return; }
      var t = ESTADOS[it.tipo], e = sinTilde(s.estado);
      if (t && t.abiertos.concat(t.cerrados).indexOf(e) === -1)
        err.push('05: estado "' + s.estado + '" no vale para ' + s.ref + '. Opciones: ' + t.abiertos.concat(t.cerrados).join(', '));
    });
    r.decisiones.forEach(function (x) {
      (x.reemplaza.match(/R\d+-DEC\d+/gi) || []).forEach(function (ref) {
        if (!d.items[ref.toUpperCase()]) err.push('03: ' + x.id + ' refiere a ' + ref + ', que no existe en el seguimiento');
      });
      if (x.reemplaza && !/R\d+-DEC\d+/i.test(x.reemplaza)) err.push('03: ' + x.id + ' tiene texto en Reemplaza o ajusta sin ID de decisión');
    });
    var ab = d.orden.filter(function (id) { return d.items[id].abierto && d.items[id].tipo !== 'DEC'; });
    var tocados = r.seguimiento.map(function (s) { return s.ref; });
    var sin = ab.filter(function (id) { return tocados.indexOf(id) === -1; });
    if (sin.length) av.push('No mencionados en esta reunión (quedan igual, está bien si no se habló): ' + sin.join(', '));
    if (d.R.some(function (x) { return x.codigo === r.codigo; })) av.push(r.codigo + ' ya estaba en el seguimiento: add la reemplaza');
  }
  err.forEach(function (e) { console.log('ERROR  ' + e); });
  av.forEach(function (a) { console.log('AVISO  ' + a); });
  if (!err.length && !av.length) console.log('OK ' + r.codigo);
  if (err.length) process.exitCode = 1;
}

/* ==================================================================== ADD */

function cmdAdd(ruta) {
  if (!ruta) salir('uso: node reuniones.js add <minuta.md> --dir W');
  var est = leerEstado(), r = parsear(ruta);
  if (!est.iniciativa) est.iniciativa = r.iniciativa;
  est.reuniones = est.reuniones.filter(function (x) { return x.codigo !== r.codigo; });
  est.reuniones.push(r);
  if (!fs.existsSync(MIN)) fs.mkdirSync(MIN, { recursive: true });
  if (path.resolve(path.dirname(ruta)) !== path.resolve(MIN)) fs.copyFileSync(ruta, path.join(MIN, path.basename(ruta)));
  escribir(est);
  console.log(r.codigo + ' sumada | ' + r.decisiones.length + ' decisiones, ' + r.acciones.length + ' acciones, ' +
              r.temas.length + ' temas, ' + r.riesgos.length + ' riesgos, ' + r.seguimiento.length + ' actualizaciones');
}

function cmdRebuild() {
  if (!fs.existsSync(MIN)) salir('No hay carpeta minutas/ en ' + DIR);
  var est = { iniciativa: '', reuniones: [] };
  fs.readdirSync(MIN).filter(function (f) { return RE_MIN.test(f); }).forEach(function (f) {
    var r = parsear(path.join(MIN, f));
    if (!est.iniciativa) est.iniciativa = r.iniciativa;
    est.reuniones.push(r);
  });
  if (!est.reuniones.length) salir('No hay minutas en ' + MIN);
  escribir(est);
  console.log('Reconstruido desde ' + est.reuniones.length + ' minutas');
}

/* ================================================================== BUILD */

function periodo(fecha) {
  var m = (fecha || '').match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (!m) return 'Q' + (Math.floor(new Date().getMonth() / 3) + 1) + new Date().getFullYear();
  return 'Q' + (Math.floor((parseInt(m[2], 10) - 1) / 3) + 1) + m[3];
}
function fechaNum(s) {
  var m = (s || '').match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  return m ? parseInt(m[3] + m[2].padStart(2, '0') + m[1].padStart(2, '0'), 10) : null;
}
function celda(s) { return (s || '').replace(/\|/g, '/').replace(/\n/g, ' '); }

function escribir(est) {
  est.reuniones.sort(function (a, b) { return a.n - b.n; });
  var d = derivar(est), ult = d.R[d.R.length - 1];
  var L = [];
  L.push('# Seguimiento | ' + est.iniciativa, '');
  L.push('| | |', '|---|---|');
  L.push('| Iniciativa | ' + est.iniciativa + ' |');
  L.push('| Reuniones | ' + d.R.length + ' (' + d.R[0].codigo + ' a ' + ult.codigo + ') |');
  L.push('| Última | ' + ult.codigo + ', ' + ult.fecha + ', ' + celda(ult.tema) + ' |');
  L.push('| Generado | ' + new Date().toISOString().slice(0, 10) + ' con reuniones.js. No editar a mano |', '');
  L.push('> Archivo derivado de las minutas. Para corregir algo, corregir la minuta y volver a sumarla.', '');

  L.push('## Qué cambió en la última reunión (' + ult.codigo + ')', '');
  (ult.resumen.length ? ult.resumen : ['[sin resumen]']).forEach(function (x) { L.push('- ' + x); });
  L.push('');

  var todos = d.orden.map(function (id) { return d.items[id]; });
  var hoy = fechaNum(ult.fecha);
  var acc = todos.filter(function (it) { return it.tipo === 'A' && it.abierto; });
  L.push('## Acciones abiertas', '');
  if (acc.length) {
    L.push('| ID | Acción | Dueño | Plazo | Estado | Última novedad | Reuniones sin mención |', '|---|---|---|---|---|---|---|');
    acc.forEach(function (it) {
      var fp = fechaNum(it.plazo), marca = [];
      if (fp && hoy && fp < hoy && sinTilde(it.estado) === 'abierta') marca.push('VENCIDA');
      if (it.sinMencion >= 3) marca.push('ESTANCADA');
      L.push('| ' + it.id + ' | ' + celda(it.texto) + ' | ' + celda(it.dueno) + ' | ' + celda(it.plazo) + ' | ' +
             it.estado + (marca.length ? ' ' + marca.join(' ') : '') + ' | ' + celda(it.novedad) + ' | ' + it.sinMencion + ' |');
    });
  } else L.push('Sin acciones abiertas.');
  L.push('');

  var tem = todos.filter(function (it) { return it.tipo === 'T' && it.abierto; });
  L.push('## Temas abiertos', '');
  if (tem.length) {
    L.push('| ID | Tema | Lo tiene | Estado | Reuniones sin mención |', '|---|---|---|---|---|');
    tem.forEach(function (it) { L.push('| ' + it.id + ' | ' + celda(it.texto) + ' | ' + celda(it.dueno) + ' | ' + it.estado + ' | ' + it.sinMencion + ' |'); });
  } else L.push('Sin temas abiertos.');
  L.push('');

  var rie = todos.filter(function (it) { return it.tipo === 'K' && it.abierto; });
  L.push('## Riesgos y bloqueos vigentes', '');
  if (rie.length) {
    L.push('| ID | Riesgo o bloqueo | Depende de | Estado |', '|---|---|---|---|');
    rie.forEach(function (it) { L.push('| ' + it.id + ' | ' + celda(it.texto) + ' | ' + celda(it.dueno) + ' | ' + it.estado + ' |'); });
  } else L.push('Sin riesgos vigentes.');
  L.push('');

  var dec = todos.filter(function (it) { return it.tipo === 'DEC'; });
  L.push('## Decisiones vigentes', '');
  var vig = dec.filter(function (it) { return it.abierto; });
  if (vig.length) {
    L.push('| ID | Decisión | Decidió | Fecha | Nota |', '|---|---|---|---|---|');
    vig.forEach(function (it) {
      var nota = /ajustada/i.test(it.estado) ? it.estado.replace(/^Vigente,\s*/i, '') : '';
      L.push('| ' + it.id + ' | ' + celda(it.texto) + ' | ' + celda(it.decidio) + ' | ' + it.fechaOrigen + ' | ' + nota + ' |');
    });
  } else L.push('Sin decisiones registradas.');
  L.push('');
  var reem = dec.filter(function (it) { return !it.abierto; });
  if (reem.length) {
    L.push('## Decisiones reemplazadas', '');
    reem.forEach(function (it) { L.push('- ' + it.id + ' | ' + it.texto + ' | ' + it.estado); });
    L.push('');
  }

  var cer = todos.filter(function (it) { return it.tipo !== 'DEC' && !it.abierto; });
  if (cer.length) {
    L.push('## Cerrados', '');
    cer.forEach(function (it) { L.push('- ' + it.id + ' | ' + it.texto + ' | ' + it.estado + (it.novedad ? ' | ' + it.novedad : '')); });
    L.push('');
  }

  var con = [];
  d.R.forEach(function (r) { con = con.concat(r.contradicciones); });
  if (con.length) {
    L.push('## Contradicciones registradas', '');
    con.forEach(function (c) { L.push('- ' + c); });
    L.push('');
  }

  L.push('## Historial de reuniones', '');
  L.push('| Código | Fecha | Tipo | Tema | Minuta |', '|---|---|---|---|---|');
  d.R.forEach(function (r) { L.push('| ' + r.codigo + ' | ' + r.fecha + ' | ' + celda(r.tipo) + ' | ' + celda(r.tema) + ' | ' + r.archivo + ' |'); });
  L.push('');

  L.push('## Glosario de personas', '');
  L.push('| Nombre | Variantes en transcripciones | Rol o área | Participó en |', '|---|---|---|---|');
  d.glosario.forEach(function (p) {
    L.push('| ' + celda(p.nombre) + ' | ' + celda(p.variantes.join(', ')) + ' | ' + celda(p.rol) + ' | ' + (p.reuniones.join(', ') || '-') + ' |');
  });
  L.push('');

  var json = JSON.stringify(est).replace(/>/g, '\\u003e');
  L.push('<!-- ESTADO-JSON', json, '-->', '');

  var viejo = archivoSeg();
  if (viejo) fs.unlinkSync(viejo);
  var nombre = slug(est.iniciativa) + '_Reunion_Seguimiento_' + periodo(ult.fecha) + '.md';
  fs.writeFileSync(path.join(DIR, nombre), L.join('\n'));
  console.log('Escrito ' + nombre);
}

function cmdBuild() { var est = leerEstado(); if (!est.reuniones.length) salir('No hay seguimiento todavía'); escribir(est); }

/* ================================================================== QUERY */

function cmdQuery() {
  var est = leerEstado();
  if (!est.reuniones.length) salir('No hay seguimiento en ' + DIR);
  var d = derivar(est), todos = d.orden.map(function (id) { return d.items[id]; });
  var dueno = opt('--dueno'), buscar = opt('--buscar'), id = opt('--id');
  var lin = function (it) {
    return it.id + ' | ' + it.texto + ' | ' + (it.dueno || it.decidio || '-') + (it.plazo ? ' | ' + it.plazo : '') + ' | ' + it.estado;
  };
  if (id) {
    var it = d.items[id.toUpperCase()];
    if (!it) salir('No existe ' + id);
    console.log(lin(it)); console.log('Origen: ' + it.origen + ' (' + it.fechaOrigen + ')');
    it.historia.forEach(function (h) { console.log('  ' + h); });
    return;
  }
  var sel = todos;
  if (flag('--abiertas')) sel = sel.filter(function (x) { return x.abierto && x.tipo !== 'DEC'; });
  if (flag('--decisiones')) sel = sel.filter(function (x) { return x.tipo === 'DEC' && x.abierto; });
  if (dueno) sel = sel.filter(function (x) { return sinTilde(x.dueno).indexOf(sinTilde(dueno)) > -1; });
  if (buscar) {
    var ws = sinTilde(buscar).split(/\s+/);
    sel = sel.filter(function (x) {
      var t = sinTilde(x.texto + ' ' + (x.novedad || '') + ' ' + x.historia.join(' '));
      return ws.every(function (w) { return t.indexOf(w) > -1; });
    });
  }
  sel.forEach(function (x) { console.log(lin(x)); });
  console.log('(' + sel.length + ')');
}

/* =================================================================== MAIN */

switch (cmd) {
  case 'init': cmdInit(args.slice(1).filter(function (a) { return !/^--/.test(a); })); break;
  case 'limpiar': cmdLimpiar(args[1]); break;
  case 'check': cmdCheck(args[1]); break;
  case 'add': cmdAdd(args[1]); break;
  case 'build': cmdBuild(); break;
  case 'rebuild': cmdRebuild(); break;
  case 'query': cmdQuery(); break;
  case 'estado': estadoCorto(); break;
  default:
    console.log('comandos: init, limpiar, check, add, build, rebuild, query, estado');
}
