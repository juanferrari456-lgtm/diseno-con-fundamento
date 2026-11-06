#!/usr/bin/env node
/* ============================================================================
   CAMPO CON GUIA | tablero de hipotesis, cobertura y contraste con blueprints

   Para discoveries que salen a campo con una guia de hipotesis y drivers. Lee la
   seccion 11 de las fichas y arma TABLERO.md: veredicto de cada hipotesis por
   entrevista y por segmento, P1 sin cubrir, dolores del blueprint que el campo
   confirma o contradice, espejos entre roles de una misma organizacion y puntas
   para otras iniciativas. El tablero es el esqueleto del entregable final.

   Complementa a sintesis-de-entrevistas sin tocarla: la ficha 01 a 10 y el
   corpus son de esa skill. Este script solo lee la seccion 11 y la guia.

   uso:
     node campo.js guia --cliente "Sede Norte" [--segmento B]   recorte de la guia para esa entrevista
     node campo.js check <ficha.md> [--guia g.md] [--registro r.md]
     node campo.js build [--dir .] [--guia g.md] [--registro r.md]
     node campo.js h H9 [--dir .]           una hipotesis, con evidencia
     node campo.js p P53 [--dir .]          un dolor del blueprint, con evidencia

   --guia: archivo de la guia (secciones "Hipotesis" y "Trazabilidad").
   --registro: registro de dolores del blueprint, para validar ids P.
   Si no se pasan, se buscan en --dir por nombre (*Guia-de-Entrevistas*, *Registro*).
   ========================================================================== */

'use strict';
var fs = require('fs'), path = require('path');
var args = process.argv.slice(2), cmd = args[0];
function opt(n) { var i = args.indexOf(n); if (i < 0) return ''; var v = args[i + 1]; args.splice(i, 2); return v; }
var DIR = opt('--dir') || '.';
var GUIA = opt('--guia'), REGISTRO = opt('--registro'), CLIENTE = opt('--cliente'), SEGMENTO = opt('--segmento');
function salir(m) { console.error(m); process.exit(1); }

/* ------------------------------------------------------------- utilidades */

function filas(b) {
  return b.split('\n')
    .filter(function (l) { return /^\s*\|/.test(l) && !/^\s*\|[\s:|-]+\|\s*$/.test(l); })
    .map(function (l) { return l.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map(function (c) { return c.trim(); }); });
}
function vinetas(b) {
  return b.split('\n').filter(function (l) { return /^\s*[-*]\s+/.test(l); })
    .map(function (l) { return l.replace(/^\s*[-*]\s+/, '').trim(); });
}
function seccion(txt, num) {
  var m = txt.match(new RegExp('^##\\s*0?' + num + '[.)]?\\s.*$', 'm'));
  if (!m) return '';
  var resto = txt.slice(txt.indexOf(m[0]) + m[0].length), fin = resto.search(/^##\s/m);
  return fin === -1 ? resto : resto.slice(0, fin);
}
function seccionTitulo(txt, re) {
  var m = txt.match(new RegExp('^##\\s*[\\d.]*\\s*' + re + '.*$', 'mi'));
  if (!m) return '';
  var resto = txt.slice(txt.indexOf(m[0]) + m[0].length), fin = resto.search(/^##\s/m);
  return fin === -1 ? resto : resto.slice(0, fin);
}
function sub(bloque, titulo) {
  var m = bloque.match(new RegExp('^###\\s*' + titulo + '.*$', 'mi'));
  if (!m) return '';
  var resto = bloque.slice(bloque.indexOf(m[0]) + m[0].length), fin = resto.search(/^###?\s/m);
  return fin === -1 ? resto : resto.slice(0, fin);
}
function meta(txt, campo) {
  var m = txt.match(new RegExp('^\\|\\s*' + campo + '\\s*\\|\\s*([^|]+?)\\s*\\|', 'mi'));
  return m ? m[1].trim() : '';
}
function corta(t, n) { t = String(t || '').replace(/\s+/g, ' ').trim(); return t.length <= n ? t : t.slice(0, n - 1) + '…'; }
function buscar(patron) {
  var c = [DIR, '/mnt/project'].filter(function (d) { return fs.existsSync(d); });
  for (var i = 0; i < c.length; i++) {
    var f = fs.readdirSync(c[i]).filter(function (x) { return patron.test(x); }).sort().pop();
    if (f) return path.join(c[i], f);
  }
  return '';
}

/* -------------------------------------------------------------- veredictos */

var VER = {
  'confirma': { k: 'C', s: '✅' }, 'refuta': { k: 'R', s: '❌' }, 'matiza': { k: 'M', s: '🔶' },
  'sin evidencia': { k: 'S', s: '⚪' }, 'no preguntada': { k: 'N', s: '➖' }, 'no aplica': { k: 'X', s: ' ' }
};
function veredicto(t) {
  t = (t || '').toLowerCase().replace(/\s+/g, ' ').trim();
  return VER[t] ? t : '';
}
var REL = ['confirma', 'contradice', 'matiza', 'nuevo'];

/* ------------------------------------------------------------------- guia */

function leerGuia() {
  var g = GUIA || buscar(/Guia-de-Entrevistas.*\.md$/i);
  var H = {}, orden = [];
  if (!g || !fs.existsSync(g)) return { H: H, orden: orden, seg: {}, ruta: '', txt: '' };
  var txt = fs.readFileSync(g, 'utf8');
  filas(seccionTitulo(txt, 'Hip[oó]tesis')).forEach(function (r) {
    if (!/^H\d+$/.test(r[0])) return;
    H[r[0]] = { id: r[0], driver: r[1] || '', texto: r[2] || '', estado: r[3] || '', p1: [], confirma: '', refuta: '' };
    orden.push(r[0]);
  });
  filas(seccionTitulo(txt, 'Trazabilidad')).forEach(function (r) {
    if (!H[r[0]]) return;
    H[r[0]].p1 = (r[1] || '').match(/\d\.\d+|EX\d+|SP\d+/g) || [];
    H[r[0]].confirma = r[2] || ''; H[r[0]].refuta = r[3] || '';
  });
  var seg = {};
  filas(seccionTitulo(txt, 'Ajuste por segmento')).forEach(function (r) {
    var k = (r[0] || '').split(/\s/)[0];
    if (!/^[A-Z]\d?$/.test(k)) return;
    seg[k] = { nombre: r[0], clientes: r[1] || '', hip: ((r[2] || '').replace(/\(.*?\)/g, '').match(/H\d+/g) || []), extra: r[2] || '', cuota: parseInt(r[3], 10) || 0 };
  });
  return { H: H, orden: orden, seg: seg, ruta: g, txt: txt };
}
function leerRegistro() {
  var r = REGISTRO || buscar(/Registro.*(Trazabilidad|Dolores).*\.md$/i);
  if (!r || !fs.existsSync(r)) return null;
  var ids = {};
  filas(fs.readFileSync(r, 'utf8')).forEach(function (f) { if (/^P\d+$/.test(f[0])) ids[f[0]] = f[1] || ''; });
  return ids;
}

/* ------------------------------------------------------------------ ficha */

function parsear(ruta) {
  var txt = fs.readFileSync(ruta, 'utf8');
  var h1 = txt.match(/^#\s*Entrevista\s+(E\d+)\s*\|\s*(.+)$/m);
  if (!h1) return null;
  var s11 = seccion(txt, 11);
  var f = {
    codigo: h1[1], perfil: meta(txt, 'Perfil') || h1[2].trim(), ficha: path.basename(ruta),
    cliente: meta(txt, 'Cliente'), segmento: meta(txt, 'Segmento'), vinculo: meta(txt, 'V[ií]nculo'),
    rol: meta(txt, 'Rol en la gu[ií]a') || meta(txt, 'Rol'), sesgo: meta(txt, 'Sesgo'), fecha: meta(txt, 'Fecha'),
    tiene11: !!s11.trim(), hip: [], bp: [], espejos: [], puntas: [], fueraGuia: []
  };
  filas(sub(s11, 'Hip[oó]tesis')).forEach(function (r) {
    if (!/^H\d+$/.test(r[0])) return;
    f.hip.push({ h: r[0], ver: veredicto(r[1]), verRaw: r[1] || '', preg: r[2] || '', evid: r[3] || '' });
  });
  filas(sub(s11, 'Blueprint')).forEach(function (r) {
    if (!r[0] || /^P$/i.test(r[0])) return;
    f.bp.push({ p: r[0], rel: (r[1] || '').toLowerCase(), dolor: r[2] || '', nota: r[3] || '' });
  });
  filas(sub(s11, 'Espejos')).forEach(function (r) {
    if (!r[0] || /^Tema$/i.test(r[0])) return;
    f.espejos.push({ tema: r[0], lectura: r[1] || '' });
  });
  f.puntas = vinetas(sub(s11, 'Puntas'));
  f.fueraGuia = vinetas(sub(s11, 'Fuera de la gu[ií]a'));
  return f;
}
function fichas() {
  var d = fs.existsSync(path.join(DIR, 'fichas')) ? path.join(DIR, 'fichas') : DIR;
  return fs.readdirSync(d).filter(function (x) { return /(^|[_-])Entrevista_E\d+.*\.md$/i.test(x); })
    .map(function (x) { return parsear(path.join(d, x)); })
    .filter(function (f) { return f && f.tiene11; })
    .sort(function (a, b) { return parseInt(a.codigo.slice(1), 10) - parseInt(b.codigo.slice(1), 10); });
}

/* ------------------------------------------------------------------ check */

function cmdCheck(ruta) {
  if (!ruta) salir('uso: node campo.js check <ficha.md>');
  var f = parsear(ruta); if (!f) salir('No encuentro "# Entrevista E0N | Perfil"');
  var g = leerGuia(), reg = leerRegistro(), av = [];
  if (!f.tiene11) av.push('falta la seccion 11 (Contraste con la guia)');
  [['Cliente', f.cliente], ['Segmento', f.segmento], ['Vinculo', f.vinculo], ['Rol en la guia', f.rol]].forEach(function (x) {
    if (!x[1]) av.push('falta metadata: ' + x[0]);
  });
  var vistas = {};
  f.hip.forEach(function (h) {
    vistas[h.h] = 1;
    if (!h.ver) av.push(h.h + ' veredicto no valido: "' + h.verRaw + '" (Confirma, Refuta, Matiza, Sin evidencia, No preguntada, No aplica)');
    if (/confirma|refuta|matiza/.test(h.ver) && !/["“]/.test(h.evid)) av.push(h.h + ' ' + h.ver + ' sin cita en evidencia');
    if (/confirma|refuta|matiza|sin evidencia/.test(h.ver) && !h.preg) av.push(h.h + ' sin pregunta de origen (id de la guia o "espontaneo")');
    if (g.H[h.h] && /pendiente/i.test(g.H[h.h].estado) && h.ver === 'no preguntada') av.push(h.h + ' es pendiente: no hace falta la fila si no aparecio sola');
  });
  var sl = (f.segmento || '').split(/\s/)[0], sh = g.seg[sl] ? g.seg[sl].hip : [];
  g.orden.forEach(function (h) {
    if (/esta ronda/i.test(g.H[h].estado) && !vistas[h]) av.push(h + ' (esta ronda) sin fila: poner veredicto o "No aplica"');
  });
  sh.forEach(function (h) {
    var x = f.hip.filter(function (y) { return y.h === h; })[0];
    if (x && x.ver === 'no aplica') av.push(h + ' es hipotesis del segmento ' + sl + ': no puede ser "No aplica"');
  });
  if (g.ruta && sl && !g.seg[sl]) av.push('segmento "' + sl + '" no esta en el ajuste por segmento de la guia');
  f.bp.forEach(function (b) {
    if (REL.indexOf(b.rel) < 0) av.push(b.p + ' relacion no valida: "' + b.rel + '" (Confirma, Contradice, Matiza, Nuevo)');
    if (b.rel === 'nuevo' && /^P\d+$/.test(b.p)) av.push(b.p + ' marcado Nuevo pero con id existente: usar "nuevo" en la columna P');
    if (b.rel !== 'nuevo' && reg && /^P\d+$/.test(b.p) && !reg[b.p]) av.push(b.p + ' no existe en el registro de dolores');
    if (!/E\d+-D\d+/.test(b.dolor)) av.push(b.p + ' sin dolor de ficha (E0N-D0)');
  });
  if (f.cliente && !f.espejos.length) {
    var pares = fichas().filter(function (x) { return x.codigo !== f.codigo && x.cliente === f.cliente; });
    if (pares.length) av.push('hay otra ficha del mismo Cliente (' + pares.map(function (x) { return x.codigo; }).join(', ') + ') y esta no tiene tabla de espejos');
  }
  console.log(f.codigo + ' | ' + (f.cliente || '?') + ' | ' + (f.segmento || '?') + ' | ' + (f.rol || '?'));
  console.log(f.hip.length + ' hipotesis, ' + f.bp.length + ' contrastes con blueprint, ' + f.espejos.length + ' espejos, ' +
              f.puntas.length + ' puntas, ' + f.fueraGuia.length + ' fuera de guia');
  if (!g.ruta) console.log('(sin guia: no se valida cobertura)');
  if (!reg) console.log('(sin registro: no se validan ids P)');
  if (!av.length) { console.log('\nSin observaciones.'); return; }
  console.log('\nREVISAR (' + av.length + ')'); av.forEach(function (a) { console.log('  ' + a); });
}

/* ------------------------------------------------------------------ build */

function cmdBuild() {
  var F = fichas(), g = leerGuia(), reg = leerRegistro(), o = [];
  if (!F.length) salir('No hay fichas con seccion 11 en ' + DIR);
  var hs = g.orden.slice();
  F.forEach(function (f) { f.hip.forEach(function (h) { if (hs.indexOf(h.h) < 0) hs.push(h.h); }); });
  hs.sort(function (a, b) { return parseInt(a.slice(1), 10) - parseInt(b.slice(1), 10); });
  function celda(f, h) { var x = f.hip.filter(function (y) { return y.h === h; })[0]; return x ? x : null; }

  o.push('# Tablero de campo | ' + (meta(fs.readFileSync(path.join(fs.existsSync(path.join(DIR, 'fichas')) ? path.join(DIR, 'fichas') : DIR, F[0].ficha), 'utf8'), 'Proyecto') || ''));
  o.push('');
  o.push('> Generado por `campo.js build` el ' + new Date().toISOString().slice(0, 10) + ' desde la seccion 11 de ' + F.length +
         ' fichas. No se edita a mano. ✅ confirma | ❌ refuta | 🔶 matiza | ⚪ sin evidencia | ➖ no preguntada | vacio, no aplica o sin fila.');
  o.push('');

  o.push('## 01. Entrevistas');
  o.push('');
  o.push('| Código | Cliente | Segmento | Vínculo | Rol | Fecha | Sesgo |');
  o.push('|---|---|---|---|---|---|---|');
  F.forEach(function (f) { o.push('| ' + [f.codigo, f.cliente, f.segmento, f.vinculo, f.rol, f.fecha, f.sesgo || ''].join(' | ') + ' |'); });
  o.push('');

  var segs = Object.keys(g.seg);
  if (segs.length) {
    o.push('## Cobertura por segmento');
    o.push('');
    o.push('Hechas contra la cuota de la guía. Un segmento sin cubrir es un hueco: baja la certeza de lo que se diga sobre él.');
    o.push('');
    o.push('| Segmento | Cuota | Hechas | Falta |');
    o.push('|---|:-:|:-:|:-:|');
    segs.forEach(function (k) {
      var hechas = F.filter(function (f) { return (f.segmento || '').split(/\s/)[0] === k; }).length;
      var c = g.seg[k].cuota;
      o.push('| ' + g.seg[k].nombre + ' | ' + (c || '-') + ' | ' + hechas + ' | ' + (c ? Math.max(c - hechas, 0) : '-') + ' |');
    });
    o.push('');
  }

  o.push('## 02. Hipótesis por entrevista');
  o.push('');
  o.push('| H | Driver | ' + F.map(function (f) { return f.codigo; }).join(' | ') + ' | ✅ | ❌ | 🔶 | ⚪ | ➖ |');
  o.push('|---|---|' + F.map(function () { return ':-:|'; }).join('') + ':-:|:-:|:-:|:-:|:-:|');
  hs.forEach(function (h) {
    var n = { confirma: 0, refuta: 0, matiza: 0, 'sin evidencia': 0, 'no preguntada': 0 };
    var cel = F.map(function (f) { var x = celda(f, h); if (!x || !x.ver) return ''; if (n[x.ver] !== undefined) n[x.ver]++; return VER[x.ver].s; });
    o.push('| ' + h + ' | ' + ((g.H[h] && g.H[h].driver) || '') + ' | ' + cel.join(' | ') + ' | ' +
           [n.confirma, n.refuta, n.matiza, n['sin evidencia'], n['no preguntada']].join(' | ') + ' |');
  });
  o.push('');

  o.push('## 03. Hipótesis por segmento y vínculo');
  o.push('');
  o.push('Cuenta solo veredictos con evidencia. La guía pide leer distinto a quien elige libremente.');
  o.push('');
  var grupos = {};
  F.forEach(function (f) {
    var k = (f.segmento || '?').split(/\s/)[0] + ', ' + (f.vinculo || '?');
    (grupos[k] = grupos[k] || []).push(f);
  });
  var gk = Object.keys(grupos).sort();
  o.push('| H | ' + gk.join(' | ') + ' |');
  o.push('|---|' + gk.map(function () { return '---|'; }).join(''));
  hs.forEach(function (h) {
    o.push('| ' + h + ' | ' + gk.map(function (k) {
      var c = { C: 0, R: 0, M: 0 };
      grupos[k].forEach(function (f) { var x = celda(f, h); if (x && x.ver && VER[x.ver] && c[VER[x.ver].k] !== undefined) c[VER[x.ver].k]++; });
      var t = []; if (c.C) t.push(c.C + '✅'); if (c.R) t.push(c.R + '❌'); if (c.M) t.push(c.M + '🔶');
      return t.join(' ');
    }).join(' | ') + ' |');
  });
  o.push('');

  o.push('## 04. Evidencia por hipótesis');
  o.push('');
  hs.forEach(function (h) {
    var ev = []; F.forEach(function (f) { var x = celda(f, h); if (x && /confirma|refuta|matiza/.test(x.ver)) ev.push({ f: f, x: x }); });
    var gh = g.H[h];
    o.push('### ' + h + (gh ? ' | ' + gh.texto : ''));
    if (gh && (gh.confirma || gh.refuta)) o.push('Confirma si: ' + (gh.confirma || '-') + '. Refuta si: ' + (gh.refuta || '-') + '.');
    o.push('');
    if (!ev.length) { o.push('- Sin evidencia todavía.'); o.push(''); return; }
    ev.forEach(function (e) {
      o.push('- ' + VER[e.x.ver].s + ' ' + e.f.codigo + ' (' + (e.f.segmento || '?').split(/\s/)[0] + (e.f.sesgo ? ', sesgo' : '') + ') ' +
             (e.x.preg ? '[' + e.x.preg + '] ' : '') + e.x.evid);
    });
    o.push('');
  });

  o.push('## 05. Cobertura');
  o.push('');
  o.push('Hipótesis de esta ronda que quedaron sin preguntar o sin respuesta útil. En negrita, las que la guía asigna a ese segmento. Es la agenda de la próxima entrevista con un perfil parecido.');
  o.push('');
  var hayCob = false;
  F.forEach(function (f) {
    var sl = (f.segmento || '').split(/\s/)[0], sh = g.seg[sl] ? g.seg[sl].hip : [];
    var falta = f.hip.filter(function (x) { return x.ver === 'no preguntada' || x.ver === 'sin evidencia'; })
      .map(function (x) { return (sh.indexOf(x.h) > -1 ? '**' + x.h + '**' : x.h) + (g.H[x.h] && g.H[x.h].p1.length ? ' (' + g.H[x.h].p1.join(', ') + ')' : '') + (x.ver === 'sin evidencia' ? ' sin respuesta útil' : ''); });
    if (falta.length) { hayCob = true; o.push('- ' + f.codigo + ' ' + (f.cliente || '') + ': ' + falta.join('; ')); }
  });
  if (!hayCob) o.push('- Todas las hipótesis de la ronda tienen evidencia en cada entrevista.');
  o.push('');

  o.push('## 06. Contraste con el blueprint');
  o.push('');
  var P = {}, nuevos = [];
  F.forEach(function (f) {
    f.bp.forEach(function (b) {
      if (b.rel === 'nuevo' || !/^P\d+$/.test(b.p)) { nuevos.push({ f: f, b: b }); return; }
      (P[b.p] = P[b.p] || []).push({ f: f, b: b });
    });
  });
  var pk = Object.keys(P).sort(function (a, b) { return parseInt(a.slice(1), 10) - parseInt(b.slice(1), 10); });
  if (pk.length) {
    o.push('| P | Dolor del registro | Confirma | Contradice | Matiza |');
    o.push('|---|---|---|---|---|');
    pk.forEach(function (p) {
      function de(r) { return P[p].filter(function (x) { return x.b.rel === r; }).map(function (x) { return x.b.dolor || x.f.codigo; }).join(', '); }
      o.push('| ' + p + ' | ' + corta(reg && reg[p] ? reg[p] : '', 80) + ' | ' + de('confirma') + ' | ' + de('contradice') + ' | ' + de('matiza') + ' |');
    });
    o.push('');
  }
  o.push('**Dolores nuevos desde el cliente** (entran primero al registro, que es quien numera)');
  o.push('');
  if (!nuevos.length) o.push('- Ninguno todavía.');
  nuevos.forEach(function (n) { o.push('- ' + (n.b.dolor || n.f.codigo) + ' ' + n.b.nota); });
  o.push('');

  o.push('## 07. Espejos dentro de una organización');
  o.push('');
  var org = {};
  F.forEach(function (f) { if (f.espejos.length) (org[f.cliente || f.codigo] = org[f.cliente || f.codigo] || []).push(f); });
  if (!Object.keys(org).length) o.push('- Sin pares relevados todavía.');
  Object.keys(org).forEach(function (k) {
    o.push('### ' + k);
    org[k].forEach(function (f) { f.espejos.forEach(function (e) { o.push('- ' + f.codigo + ' ' + e.tema + ': ' + e.lectura); }); });
    o.push('');
  });
  o.push('');

  o.push('## 08. Fuera de la guía');
  o.push('');
  o.push('Temas que aparecieron solos y no tienen hipótesis. Si se repiten, candidatos a hipótesis nueva.');
  o.push('');
  var fg = []; F.forEach(function (f) { f.fueraGuia.forEach(function (t) { fg.push('- ' + f.codigo + ' ' + t); }); });
  o.push(fg.length ? fg.join('\n') : '- Nada todavía.');
  o.push('');

  o.push('## 09. Puntas para otras iniciativas');
  o.push('');
  var pu = []; F.forEach(function (f) { f.puntas.forEach(function (t) { pu.push('- ' + f.codigo + ' ' + t); }); });
  o.push(pu.length ? pu.join('\n') : '- Nada todavía.');
  o.push('');

  var destino = path.join(DIR, 'TABLERO.md');
  fs.writeFileSync(destino, o.join('\n'));
  var tot = { confirma: 0, refuta: 0, matiza: 0 };
  F.forEach(function (f) { f.hip.forEach(function (x) { if (tot[x.ver] !== undefined) tot[x.ver]++; }); });
  console.log('Escrito ' + destino + ' | ' + F.length + ' entrevistas | ' + tot.confirma + ' confirma, ' + tot.refuta + ' refuta, ' +
              tot.matiza + ' matiza | ' + pk.length + ' P contrastados, ' + nuevos.length + ' dolores nuevos');
}

/* -------------------------------------------------------------- recorte guia */
/* Lo que hace falta de la guia para escribir la seccion 11 de una entrevista,
   sin abrir la guia entera: hipotesis de la ronda con criterios, el ajuste del
   segmento y toda fila de tabla que nombre al cliente. */

function cmdGuia() {
  var g = leerGuia(); if (!g.ruta) salir('No encuentro la guia. Pasar --guia <archivo>');
  var out = ['GUIA ' + path.basename(g.ruta), ''];
  out.push('HIPOTESIS (H | driver | estado | P1 | confirma si | refuta si)');
  g.orden.forEach(function (h) {
    var x = g.H[h];
    out.push(h + ' | ' + x.driver + ' | ' + x.estado + ' | ' + x.texto + (x.p1.length ? ' | P1 ' + x.p1.join(', ') : '') +
             (x.confirma ? ' | C: ' + x.confirma : '') + (x.refuta ? ' | R: ' + x.refuta : ''));
  });
  var seg = SEGMENTO;
  if (!seg && CLIENTE) {
    Object.keys(g.seg).forEach(function (k) { var cl = g.seg[k].clientes.toLowerCase(), cc = CLIENTE.toLowerCase(); if (cl.indexOf(cc) > -1 || cc.split(/\s/).some(function (w) { return w.length > 4 && cl.indexOf(w) > -1; })) seg = k; });
  }
  if (seg && g.seg[seg]) out.push('', 'SEGMENTO ' + g.seg[seg].nombre + ' | hipotesis a cubrir: ' + g.seg[seg].extra);
  var lineas = g.txt.split('\n');
  if (seg) {
    lineas.forEach(function (l) { if (new RegExp('^-\\s*\\*\\*' + seg + '[:*]').test(l)) out.push(l.trim()); });
  }
  if (CLIENTE) {
    var c = CLIENTE.toLowerCase();
    out.push('', 'FILAS QUE NOMBRAN A ' + CLIENTE.toUpperCase());
    var hechas = {};
    lineas.forEach(function (l) {
      var ll = l.toLowerCase();
      if (/^\s*\|/.test(l) && ll.indexOf(c) > -1 && !hechas[l]) { hechas[l] = 1; out.push(corta(l.trim(), 600)); }
    });
  }
  out.push('', 'Para el texto de una pregunta: grep -n "^| 4.4 " <guia>');
  console.log(out.join('\n'));
}

/* ---------------------------------------------------------------- consultas */

function cmdH(h) {
  if (!h) salir('uso: node campo.js h H9');
  var g = leerGuia(); if (g.H[h]) console.log(h + ' | ' + g.H[h].driver + ' | ' + g.H[h].texto + '\n');
  fichas().forEach(function (f) {
    f.hip.filter(function (x) { return x.h === h; }).forEach(function (x) {
      console.log((VER[x.ver] ? VER[x.ver].s : '?') + ' ' + f.codigo + ' ' + (f.cliente || '') + ' (' + (f.segmento || '?') + ') [' + x.preg + '] ' + x.evid);
    });
  });
}
function cmdP(p) {
  if (!p) salir('uso: node campo.js p P53');
  var reg = leerRegistro(); if (reg && reg[p]) console.log(p + ' | ' + reg[p] + '\n');
  fichas().forEach(function (f) {
    f.bp.filter(function (b) { return b.p === p; }).forEach(function (b) { console.log(b.rel + ' ' + f.codigo + ' ' + b.dolor + ' ' + b.nota); });
  });
}

switch (cmd) {
  case 'guia': cmdGuia(); break;
  case 'check': cmdCheck(args[1]); break;
  case 'build': cmdBuild(); break;
  case 'h': cmdH(args[1]); break;
  case 'p': cmdP(args[1]); break;
  default:
    console.log('uso:\n  node campo.js guia --cliente "Sede Norte" [--segmento B]\n  node campo.js check <ficha.md> [--guia g.md] [--registro r.md]\n  node campo.js build [--dir .]\n' +
                '  node campo.js h H9\n  node campo.js p P53\n  (--dir <carpeta de trabajo>, --guia y --registro opcionales)');
}
