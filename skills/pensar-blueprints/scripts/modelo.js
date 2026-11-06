#!/usr/bin/env node
/* ============================================================================
   MODELO DE BLUEPRINTS | pensar-blueprints

   El modelo es la version pensada de los blueprints, sin ningun formato
   de destino. Vive en una carpeta: arquitectura.json mas un archivo por
   blueprint. Este script no mira la forma del board, mira el pensamiento:
   que cada cosa tenga fuente, que no haya dos journeys mezclados, que las
   decisiones decidan algo, que los blueprints no se pisen y que se pasen la
   posta uno al otro.

   uso:
     node modelo.js check    <carpeta> [--corpus corpus.json]
     node modelo.js render   <carpeta>               escribe ARQUITECTURA.md y un .md por blueprint
     node modelo.js auditar  <a.bp.json ...> [--corpus corpus.json]  revisa blueprints bp/2 existentes
   ========================================================================== */
'use strict';
var fs = require('fs'), path = require('path');

var args = process.argv.slice(2), cmd = args.shift();
function opt(name) { var i = args.indexOf(name); if (i < 0) return null; var v = args[i + 1]; args.splice(i, 2); return v; }
var CORPUS = opt('--corpus');

/* ------------------------------------------------------------ utilidades */
function leerJSON(r) {
  try { return JSON.parse(fs.readFileSync(r, 'utf8')); }
  catch (e) { console.error('No se pudo leer ' + r + ': ' + e.message); process.exit(2); }
}
function arr(x) { return Array.isArray(x) ? x : (x == null ? [] : [x]); }
function corto(t, n) { t = String(t || '').replace(/\s+/g, ' ').trim(); n = n || 70; return t.length <= n ? t : t.slice(0, n - 1) + '…'; }
var STOP = new Set('el la los las un una unos unas de del al a en y o u que se su sus con por para sin lo le les es son como mas ya no si ni muy pero tambien cuando donde hay este esta esto ese esa'.split(' '));
function tokens(t) {
  return new Set(String(t || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter(function (w) { return w.length > 2 && !STOP.has(w); }));
}
function jaccard(a, b) {
  if (a.size < 3 || b.size < 3) return 0;
  var i = 0; a.forEach(function (w) { if (b.has(w)) i++; });
  return i / (a.size + b.size - i);
}
function codigosCorpus() {
  if (!CORPUS) return null;
  var c = leerJSON(CORPUS);
  return (c.entrevistas || []).map(function (e) { return e.codigo; });
}

/* ------------------------------------------------------------ reporte */
function Reporte() { this.items = []; }
Reporte.prototype.add = function (nivel, regla, donde, texto) { this.items.push({ nivel: nivel, regla: regla, donde: donde, texto: texto }); };
Reporte.prototype.imprimir = function () {
  var orden = { ERROR: 0, AVISO: 1, INFO: 2 }, titulos = {
    ERROR: 'ERRORES, el modelo no esta pensado todavia',
    AVISO: 'AVISOS, hay que corregir o poder explicar',
    INFO: 'INFO, para leer antes de entregar'
  };
  var por = { ERROR: [], AVISO: [], INFO: [] };
  this.items.forEach(function (x) { por[x.nivel].push(x); });
  Object.keys(orden).forEach(function (n) {
    if (!por[n].length) return;
    console.log('\n' + titulos[n] + ' (' + por[n].length + ')');
    var grupos = {};
    por[n].forEach(function (x) { var k = x.regla + '|' + x.texto; (grupos[k] = grupos[k] || []).push(x.donde); });
    Object.keys(grupos).forEach(function (k) {
      var p = k.split('|'), d = grupos[k].filter(Boolean);
      console.log('  [' + p[0] + '] ' + p.slice(1).join('|') + (d.length ? '\n      ' + (d.length > 8 ? d.slice(0, 8).join(', ') + ' y ' + (d.length - 8) + ' mas' : d.join(', ')) : ''));
    });
  });
  return por.ERROR.length;
};

/* ------------------------------------------------------------ carga del modelo */
function cargar(dir) {
  var ra = path.join(dir, 'arquitectura.json');
  if (!fs.existsSync(ra)) { console.error('Falta ' + ra); process.exit(2); }
  var A = leerJSON(ra);
  A._dir = dir;
  A._bps = {};
  arr(A.blueprints).forEach(function (b) {
    var r = path.join(dir, b.archivo || (b.id + '.json'));
    if (!fs.existsSync(r)) { A._bps[b.id] = null; return; }
    var m = leerJSON(r);
    m._ficha = b; m._archivo = r;
    A._bps[b.id] = m;
  });
  return A;
}
var CAPAS = ['frontstage', 'backstage', 'soporte', 'evidencia'];
function elementos(m) {
  // todo lo que tiene que tener fuente, con su ubicacion
  var out = [];
  arr(m.momentos).forEach(function (mo) {
    if (mo.cliente) arr(mo.cliente).forEach(function (e) {
      out.push({ capa: 'cliente', mo: mo, e: e });
      if (e.emocion) out.push({ capa: 'emocion', mo: mo, e: e.emocion });
      if (e.pensamiento) out.push({ capa: 'pensamiento', mo: mo, e: e.pensamiento });
    });
    CAPAS.forEach(function (c) { arr(mo[c]).forEach(function (e) { out.push({ capa: c, mo: mo, e: e }); }); });
    if (mo.tiempo) out.push({ capa: 'tiempo', mo: mo, e: mo.tiempo });
    if (mo.decision) arr(mo.decision.ramas).forEach(function (r) { out.push({ capa: 'rama', mo: mo, e: r }); });
  });
  arr(m.hallazgos).forEach(function (h) { out.push({ capa: 'hallazgo', mo: null, e: h }); });
  return out;
}
function tieneFuente(e) { return arr(e.fuente).length > 0; }
function esInferencia(e) { return !!(e.inferencia && String(e.inferencia).trim()); }

/* ------------------------------------------------------------ check */
function check(dir) {
  var A = cargar(dir), R = new Reporte();
  var fuentes = {}, actores = {}, segmentos = {}, ciclo = {}, canales = {};
  arr(A.canales).forEach(function (c) { canales[c.id] = c; });
  if (/to-be/i.test(A.estado || '') && !A.deriva_de) R.add('AVISO', 'A9', 'estado', 'Un to-be sin deriva_de: de que as-is sale y que oportunidades aplica');
  arr(A.fuentes).forEach(function (f) { if (fuentes[f.id]) R.add('ERROR', 'A7', f.id, 'Fuente declarada dos veces'); fuentes[f.id] = f; });
  arr(A.actores).forEach(function (a) { actores[a.id] = a; });
  arr(A.segmentos).forEach(function (s) { segmentos[s.id] = s; });
  arr(A.ciclo).forEach(function (c) { ciclo[c.id] = c; });

  // ---- arquitectura
  var enc = A.encuadre || {};
  if (!enc.pregunta || !enc.decision) R.add('ERROR', 'A1', 'encuadre', 'Sin encuadre: falta la pregunta que responden los blueprints o la decision que habilitan');
  if (!A.estado || !/^(as-is|to-be)$/i.test(A.estado)) R.add('ERROR', 'A1', 'estado', 'El estado es as-is o to-be, uno solo por carpeta');
  if (!arr(A.blueprints).length) R.add('ERROR', 'A2', '', 'La arquitectura no declara ningun blueprint');
  var SEC = ['emocion', 'pensamiento', 'tiempo', 'evidencia', 'canales', 'metricas', 'regulaciones'];
  var secciones = A.secciones || null;
  if (!secciones) R.add('AVISO', 'A0', 'secciones', 'La arquitectura no dice que secciones opcionales lleva el blueprint (' + SEC.join(', ') + '). Se le pregunta a la persona antes de modelar');
  var usoSec = {};
  var ids = {};
  arr(A.blueprints).forEach(function (b) { ids[b.id] = b; });
  arr(A.blueprints).forEach(function (b) {
    var d = b.id;
    if (A._bps[b.id] === null) R.add('ERROR', 'A2', d, 'El archivo del blueprint no existe: ' + (b.archivo || b.id + '.json'));
    if (!b.actor || !actores[b.actor]) R.add('ERROR', 'A2', d, 'Sin actor principal declarado en actores');
    else if (actores[b.actor].tipo !== 'cliente') R.add('AVISO', 'A2', d, 'El actor principal no es de tipo cliente: si el que recibe el servicio es interno, declaralo como cliente');
    if (!b.intencion) R.add('ERROR', 'A2', d, 'Sin intencion: que quiere lograr el actor en este recorrido. Es lo que define el blueprint');
    if (b.zoom_de) {
      var zp = String(b.zoom_de).split('.'), zm = A._bps[zp[0]];
      if (!zm || !arr(zm.momentos).some(function (mo) { return mo.id === zp[1]; })) R.add('ERROR', 'A8', d, 'zoom_de apunta a un momento que no existe: ' + b.zoom_de);
    }
    if (!b.entrada || !b.entrada.disparador) R.add('ERROR', 'A2', d, 'Sin disparador de entrada: que pasa para que este recorrido empiece');
    if (!b.salida || !b.salida.resultado || !b.salida.recibe) R.add('ERROR', 'A2', d, 'Sin salida: que resultado deja y quien lo recibe');
    if (!b.cadencia) R.add('AVISO', 'A5', d, 'Sin cadencia (una vez, por pedido, continuo): sin eso no se puede saber si se pisa con otro');
    arr(b.segmentos).forEach(function (s) { if (!segmentos[s]) R.add('ERROR', 'A4', d, 'Segmento no declarado: ' + s); });
    arr(b.ciclo).forEach(function (c) { if (!ciclo[c]) R.add('ERROR', 'A5', d, 'Etapa del ciclo no declarada: ' + c); });
    arr(b.entrada && b.entrada.viene_de).forEach(function (v) {
      if (!ids[v]) R.add('ERROR', 'A3', d, 'viene_de apunta a un blueprint que no existe: ' + v);
      else if (arr(ids[v].salida && ids[v].salida.va_a).indexOf(d) < 0) R.add('AVISO', 'A3', d + ' <- ' + v, 'El traspaso no es reciproco: ' + v + ' no dice que va a ' + d);
    });
    arr(b.salida && b.salida.va_a).forEach(function (v) {
      if (!ids[v]) R.add('ERROR', 'A3', d, 'va_a apunta a un blueprint que no existe: ' + v);
      else if (arr(ids[v].entrada && ids[v].entrada.viene_de).indexOf(d) < 0) R.add('AVISO', 'A3', d + ' -> ' + v, 'El traspaso no es reciproco: ' + v + ' no dice que viene de ' + d);
    });
  });
  // segmentos sin cobertura
  var cubiertos = {}, fuera = arr(A.fuera_de_alcance).map(function (f) { return f.segmento; }).filter(Boolean);
  arr(A.blueprints).forEach(function (b) { arr(b.segmentos).forEach(function (s) { cubiertos[s] = true; }); });
  Object.keys(segmentos).forEach(function (s) {
    if (!cubiertos[s] && fuera.indexOf(s) < 0) R.add('AVISO', 'A4', s, 'Segmento sin blueprint y sin declarar fuera de alcance');
  });
  // solapamiento de ciclo entre blueprints del mismo actor y cadencia
  var bl = arr(A.blueprints);
  for (var i = 0; i < bl.length; i++) for (var j = i + 1; j < bl.length; j++) {
    var a = bl[i], b = bl[j];
    if (a.actor !== b.actor || !a.cadencia || a.cadencia !== b.cadencia) continue;
    var sa = arr(a.segmentos), sb = arr(b.segmentos);
    var segComun = !sa.length || !sb.length || sa.some(function (s) { return sb.indexOf(s) > -1; });
    var cc = arr(a.ciclo).filter(function (c) { return arr(b.ciclo).indexOf(c) > -1; });
    var paralelo = arr(A.sincronizaciones).some(function (s) {
      var x = String(s.de).split('.')[0], y = String(s.a).split('.')[0];
      return (x === a.id && y === b.id) || (x === b.id && y === a.id);
    });
    if (segComun && cc.length && !paralelo) R.add('AVISO', 'A5', a.id + ' y ' + b.id, 'Mismo actor, misma cadencia y comparten etapa ' + cc.join(', ') + ': o se pisan o corren en paralelo, y si corren en paralelo falta declarar la sincronizacion');
  }
  // corpus
  var cod = codigosCorpus();
  if (cod) {
    var descartadas = [];
    arr(A.fuera_de_alcance).forEach(function (f) { descartadas = descartadas.concat(arr(f.fuentes)); });
    var sinUsar = cod.filter(function (c) { return !fuentes[c] && descartadas.indexOf(c) < 0; });
    if (sinUsar.length) R.add('AVISO', 'A7', sinUsar.join(', '), 'Entrevistas del corpus que el modelo no declara como fuente: o se leyeron y no aportan (listalas en fuera_de_alcance con fuentes) o no se leyeron');
  }

  // ---- por blueprint
  var todasAcciones = [], hallazgosPorId = {};
  arr(A.blueprints).forEach(function (fb) {
    var m = A._bps[fb.id]; if (!m) return;
    var B = fb.id, mom = {};
    arr(m.momentos).forEach(function (mo) {
      if (mom[mo.id]) R.add('ERROR', 'B3', B + '.' + mo.id, 'Momento duplicado');
      mom[mo.id] = mo;
    });
    if (!arr(m.momentos).length) { R.add('ERROR', 'B3', B, 'Sin momentos'); return; }
    if (!arr(m.journey).length) R.add('AVISO', 'B0', B, 'Sin journey en prosa: es el freno que se valida antes de bajar a capas');

    // grafo
    function siguientes(mo) {
      if (mo.tipo === 'decision') return arr(mo.decision && mo.decision.ramas).map(function (r) { return r.va_a; });
      return arr(mo.sigue);
    }
    arr(m.momentos).forEach(function (mo) {
      var d = B + '.' + mo.id;
      if (['accion', 'espera', 'interno', 'decision', 'fin'].indexOf(mo.tipo || 'accion') < 0) R.add('ERROR', 'B3', d, 'tipo de momento desconocido: ' + mo.tipo);
      if (mo.tipo === 'interno') {
        var prevs = arr(m.momentos).filter(function (x) { return (x.tipo === 'decision' ? arr(x.decision && x.decision.ramas).map(function (r) { return r.va_a; }) : arr(x.sigue)).indexOf(mo.id) > -1; });
        if (!prevs.length || !prevs.every(function (x) { return x.tipo === 'espera' || x.tipo === 'interno'; })) R.add('ERROR', 'B2', d, 'Un momento interno solo puede venir despues de una espera o de otro interno: el cliente sigue esperando mientras la organizacion trabaja');
        if (mo.cliente) R.add('ERROR', 'B2', d, 'Momento interno con accion del cliente: si el cliente hace algo, es accion o espera');
        if (!arr(mo.backstage).length && !arr(mo.soporte).length && !arr(mo.frontstage).length) R.add('ERROR', 'B2', d, 'Momento interno sin ninguna accion de la organizacion');
      }
      if (mo.tiempo) usoSec.tiempo = true; if (arr(mo.evidencia).length) usoSec.evidencia = true;
      ['frontstage', 'backstage', 'soporte'].forEach(function (cp) { arr(mo[cp]).forEach(function (e) { if (e.canal) usoSec.canales = true; }); });
      var clx = Array.isArray(mo.cliente) ? mo.cliente[0] : mo.cliente;
      if (clx && clx.emocion) usoSec.emocion = true; if (clx && clx.pensamiento) usoSec.pensamiento = true; if (clx && clx.canal) usoSec.canales = true;
      siguientes(mo).forEach(function (s) {
        if (!s) R.add('ERROR', 'B4', d, 'Rama sin destino: toda rama llega a un momento o a un fin');
        else if (!mom[s]) R.add('ERROR', 'B3', d, 'Apunta a un momento que no existe: ' + s);
      });
      if (mo.tipo !== 'fin' && mo.tipo !== 'decision' && !arr(mo.sigue).length && !mo.sale) R.add('ERROR', 'B3', d, 'Callejon sin salida: no sigue a nada y no esta marcado como salida (sale: true) ni es tipo fin');
      if (arr(mo.sigue).length > 1 && mo.tipo !== 'decision') R.add('ERROR', 'B2', d, 'Sigue a mas de un momento sin ser decision: o es una decision o son dos journeys en paralelo');
      // cliente
      if (mo.tipo === 'accion' || mo.tipo === 'espera' || !mo.tipo) {
        var c = mo.cliente;
        if (!c) R.add('ERROR', 'B2', d, 'Momento sin accion ni espera del cliente: si el cliente no hace nada, es una espera');
        else if (Array.isArray(c) && c.length > 1) R.add('ERROR', 'B2', d, 'Dos acciones del cliente en el mismo momento: si una sigue a la otra son dos momentos, si pasan a la vez con otra intencion son dos journeys');
        var cl = Array.isArray(c) ? c[0] : c;
        if (cl && cl.actor && cl.actor !== fb.actor && arr(fb.co_clientes).indexOf(cl.actor) < 0) R.add('ERROR', 'B1', d, 'La accion del cliente la hace ' + cl.actor + ', no el actor principal ' + fb.actor + ': otro journey adentro de este');
      }
      if (mo.tipo === 'decision') {
        var de = mo.decision || {}, ramas = arr(de.ramas);
        if (ramas.length < 2) R.add('ERROR', 'B4', d, 'Decision con menos de dos ramas');
        var dest = ramas.map(function (r) { return r.va_a; }).filter(Boolean);
        if (dest.length >= 2 && new Set(dest).size === 1) R.add('ERROR', 'B4', d, 'Todas las ramas van al mismo momento: no decide nada. Es una variante y va como nota del momento, no como decision');
        if (!de.decide) R.add('AVISO', 'B4', d, 'No dice quien decide');
        if (!de.criterio) R.add('AVISO', 'B4', d, 'No dice con que criterio se decide');
        if (!de.pregunta) R.add('ERROR', 'B4', d, 'Decision sin pregunta');
      }
      var sigInterno = arr(mo.sigue).some(function (x) { return mom[x] && mom[x].tipo === 'interno'; });
      if (mo.tipo === 'espera' && !arr(mo.backstage).length && !arr(mo.soporte).length && !sigInterno)
        R.add('INFO', 'B9', d, 'Espera sin nada detras: o nadie esta haciendo nada (dolor caro) o falta relevar el backstage');
      var contacto = arr(mo.frontstage).length > 0;
      if (contacto && !arr(mo.evidencia).length && !mo.sin_evidencia) R.add('AVISO', 'B10', d, 'Momento con contacto y sin evidencia: que ve o se lleva el cliente. Si no hay nada, marcalo con sin_evidencia y una razon');
      ['frontstage', 'backstage', 'soporte'].forEach(function (cp) {
        arr(mo[cp]).forEach(function (e) {
          if (e.canal && !canales[e.canal]) R.add('AVISO', 'B8', d, 'Canal no declarado en arquitectura: ' + e.canal);
          if (!e.actor) R.add('ERROR', 'B8', d, 'Accion de ' + cp + ' sin actor');
          else if (!actores[e.actor]) R.add('ERROR', 'B8', d, 'Actor no declarado: ' + e.actor);
        });
      });
    });
    // alcanzabilidad y salida
    var inicio = m.inicio || m.momentos[0].id, vistos = {}, pila = [inicio];
    while (pila.length) {
      var x = pila.pop(); if (vistos[x] || !mom[x]) continue; vistos[x] = true;
      siguientes(mom[x]).forEach(function (s) { if (s) pila.push(s); });
    }
    arr(m.momentos).forEach(function (mo) { if (!vistos[mo.id]) R.add('ERROR', 'B3', B + '.' + mo.id, 'Momento inalcanzable desde el inicio: o falta una conexion o es otro journey'); });
    // ciclos
    var estado = {};
    function dfs(id, camino) {
      if (!mom[id]) return; if (estado[id] === 2) return;
      if (estado[id] === 1) { if (!mom[id].repite) R.add('ERROR', 'B3', B + '.' + id, 'Ciclo no declarado: si el momento se repite, marcalo con repite: true'); return; }
      estado[id] = 1; siguientes(mom[id]).forEach(function (s) { if (s) dfs(s); }); estado[id] = 2;
    }
    dfs(inicio);
    if (!arr(m.momentos).some(function (mo) { return mo.sale || mo.tipo === 'fin'; })) R.add('ERROR', 'B3', B, 'Ningun momento marca la salida: el recorrido no termina en ningun lado');

    // trazabilidad
    var porCapa = {};
    elementos(m).forEach(function (x) {
      var d = B + (x.mo ? '.' + x.mo.id : '') + ' ' + x.capa;
      var pc = porCapa[x.capa] = porCapa[x.capa] || { n: 0, inf: 0 };
      pc.n++;
      var f = tieneFuente(x.e), inf = esInferencia(x.e);
      if (!f && !inf) R.add('ERROR', 'B6', d, 'Sin fuente ni inferencia declarada: todo lo que esta en el modelo se puede senalar de donde salio');
      if (!f && inf) pc.inf++;
      arr(x.e.fuente).forEach(function (fid) {
        var base = String(fid).split(/[-:]/)[0];
        if (!fuentes[fid] && !fuentes[base]) R.add('ERROR', 'B7', d, 'Fuente no declarada en arquitectura: ' + fid);
      });
    });
    Object.keys(porCapa).forEach(function (k) {
      var p = porCapa[k]; if (!p.n) return;
      var pct = Math.round(100 * p.inf / p.n);
      if (k === 'cliente' && pct > 50) R.add('AVISO', 'B6', B, 'El carril del cliente es ' + pct + '% inferencia: es una hipotesis, no un as-is. Decilo en el titulo o sali a campo');
      else if (pct > 60) R.add('INFO', 'B6', B, 'La capa ' + k + ' es ' + pct + '% inferencia');
    });

    // hallazgos
    var porMom = {}, dolores = 0, ops = 0;
    arr(m.hallazgos).forEach(function (h) {
      var d = B + (h.momento ? '.' + h.momento : '');
      if (!h.momento || !mom[h.momento]) R.add('ERROR', 'B11', d, 'Hallazgo sin momento valido: un hallazgo es sobre un momento');
      porMom[h.momento] = (porMom[h.momento] || 0) + 1;
      if (/^(dolor|oportunidad)$/.test(h.tipo) && !h.id) R.add('AVISO', 'B11', d, 'Dolor u oportunidad sin id: no se va a poder cruzar con el registro');
      if (h.tipo === 'dolor') dolores++;
      if (h.tipo === 'dato') usoSec.metricas = true; if (h.tipo === 'regulacion') usoSec.regulaciones = true;
      if (h.tipo === 'oportunidad') { ops++; if (!arr(h.resuelve).length) R.add('AVISO', 'B11', d + ' ' + (h.id || ''), 'Oportunidad que no dice que dolor resuelve'); }
      if (h.id) {
        var prev = hallazgosPorId[h.id];
        if (prev && jaccard(tokens(prev.texto), tokens(h.texto)) < 0.6) R.add('ERROR', 'X2', h.id, 'El mismo id dice cosas distintas en ' + prev.bp + ' y ' + B);
        hallazgosPorId[h.id] = { texto: h.texto, bp: B };
      }
    });
    var nAcc = arr(m.momentos).filter(function (mo) { return mo.tipo === 'accion' || !mo.tipo; }).length;
    if (dolores && !ops) R.add('INFO', 'B11', B, 'Dolores sin ninguna oportunidad');
    var fallas = arr(m.fallas);
    fallas.forEach(function (f) {
      if (!mom[f.momento]) R.add('ERROR', 'B15', B, 'Punto de falla apunta a un momento que no existe: ' + f.momento);
      if (!f.senal) R.add('AVISO', 'B15', B + '.' + f.momento, 'Punto de falla sin senal: que hace el cliente cuando falla (abandona, repite, llama, escala)');
      if (!tieneFuente(f) && !esInferencia(f)) R.add('ERROR', 'B6', B + '.' + f.momento + ' falla', 'Punto de falla sin fuente ni inferencia');
    });
    if (dolores && !fallas.length) R.add('INFO', 'B15', B, 'Sin puntos de falla declarados: entre los dolores, cuales rompen el servicio (el cliente abandona, repite o escala) y cuales solo molestan');
    if (/to-be/i.test(A.estado || '')) {
      var conCambio = arr(m.momentos).filter(function (mo) { return arr(mo.cambio).length; }).length;
      if (!conCambio) R.add('AVISO', 'A9', B, 'To-be sin ningun momento marcado con cambio: que oportunidad aplica cada momento nuevo o modificado');
    }
    var verdad = arr(m.verdad);
    if (!verdad.length) R.add('AVISO', 'B12', B, 'Sin momento de la verdad declarado');
    verdad.forEach(function (v) { if (!mom[v.momento]) R.add('ERROR', 'B12', B, 'Momento de la verdad apunta a un momento que no existe: ' + v.momento); if (!v.por_que) R.add('AVISO', 'B12', B, 'Momento de la verdad sin por que'); });
    if (!arr(m.preguntas).length) R.add('AVISO', 'B14', B, 'Sin preguntas abiertas: casi siempre significa que se relleno lo que no se sabia');

    // para cruces
    arr(m.momentos).forEach(function (mo) {
      var cl = Array.isArray(mo.cliente) ? mo.cliente[0] : mo.cliente;
      if (cl && mo.tipo !== 'espera') todasAcciones.push({ bp: B, mo: mo.id, capa: 'cliente', e: cl });
      ['frontstage', 'backstage', 'soporte'].forEach(function (cp) { arr(mo[cp]).forEach(function (e) { todasAcciones.push({ bp: B, mo: mo.id, capa: cp, e: e }); }); });
    });
  });

  // ---- secciones opcionales
  if (secciones) SEC.forEach(function (k) {
    if (usoSec[k] && !secciones[k]) R.add('AVISO', 'A0', k, 'La seccion ' + k + ' esta apagada en arquitectura.secciones y el modelo la usa');
    if (secciones[k] && !usoSec[k]) R.add('INFO', 'A0', k, 'La seccion ' + k + ' esta pedida y ningun momento la tiene todavia');
  });

  // ---- sincronizaciones
  arr(A.sincronizaciones).forEach(function (s) {
    [s.de, s.a].forEach(function (ref) {
      var p = String(ref || '').split('.'), m = A._bps[p[0]];
      if (!m || !arr(m.momentos).some(function (mo) { return mo.id === p[1]; })) R.add('ERROR', 'A6', String(ref), 'Sincronizacion apunta a un momento que no existe');
    });
    if (!tieneFuente(s) && !esInferencia(s)) R.add('ERROR', 'B6', s.de + ' / ' + s.a, 'Sincronizacion sin fuente ni inferencia');
  });

  // ---- cruces: acciones repetidas entre blueprints
  todasAcciones.forEach(function (x) { x.k = tokens(x.e.texto); });
  for (var p = 0; p < todasAcciones.length; p++) for (var q = p + 1; q < todasAcciones.length; q++) {
    var u = todasAcciones[p], v = todasAcciones[q];
    if (u.bp === v.bp) continue;
    if (u.e.ref || v.e.ref) continue;
    if (jaccard(u.k, v.k) >= 0.6) R.add('AVISO', 'X1', u.bp + '.' + u.mo + ' y ' + v.bp + '.' + v.mo, 'La misma accion en dos blueprints (' + corto(u.e.texto, 50) + '): un solo blueprint es dueno, el otro la referencia con ref');
  }

  // ---- resumen
  console.log('modelo    ' + (A.proyecto || dir) + ' | ' + (A.estado || '?'));
  console.log('blueprints ' + arr(A.blueprints).map(function (b) {
    var m = A._bps[b.id]; return b.id + ' (' + (m ? arr(m.momentos).length : 0) + ' momentos)';
  }).join(', '));
  console.log('fuentes   ' + Object.keys(fuentes).length + ' | segmentos ' + Object.keys(segmentos).length + ' | sincronizaciones ' + arr(A.sincronizaciones).length);
  var errores = R.imprimir();
  console.log(errores ? '\nNo esta listo: ' + errores + ' errores.' : '\nSin errores. El modelo esta pensado.');
  process.exitCode = errores ? 1 : 0;
}

/* ------------------------------------------------------------ orden de lectura */
function ordenMomentos(m) {
  var mom = {}; arr(m.momentos).forEach(function (mo) { mom[mo.id] = mo; });
  var orden = [], visto = {};
  function ir(id) {
    if (!id || visto[id] || !mom[id]) return; visto[id] = true; orden.push(mom[id]);
    var mo = mom[id];
    var sig = mo.tipo === 'decision' ? arr(mo.decision && mo.decision.ramas).map(function (r) { return r.va_a; }) : arr(mo.sigue);
    sig.forEach(ir);
  }
  ir(m.inicio || (m.momentos[0] && m.momentos[0].id));
  arr(m.momentos).forEach(function (mo) { if (!visto[mo.id]) orden.push(mo); });
  return orden;
}
function fte(e) {
  if (tieneFuente(e)) return ' [' + arr(e.fuente).join(', ') + ']';
  if (esInferencia(e)) return ' [inferencia: ' + e.inferencia + ']';
  return ' [SIN FUENTE]';
}

/* ------------------------------------------------------------ render */
function render(dir) {
  var A = cargar(dir), act = {};
  arr(A.actores).forEach(function (a) { act[a.id] = a.label || a.id; });
  var L = [];
  L.push('# Arquitectura de blueprints | ' + (A.proyecto || ''), '');
  L.push('| | |', '|---|---|');
  L.push('| Estado | ' + (A.estado || '') + ' |', '| Versión | ' + (A.version || '') + ' |');
  L.push('| Pregunta | ' + ((A.encuadre || {}).pregunta || '') + ' |', '| Decisión que habilita | ' + ((A.encuadre || {}).decision || '') + ' |');
  L.push('| Para quién | ' + ((A.encuadre || {}).audiencia || '') + ' |');
  if (A.deriva_de) L.push('| Deriva de | ' + A.deriva_de + ' |');
  L.push('');
  L.push('## Ciclo de la relación', '');
  arr(A.ciclo).forEach(function (c) {
    var bps = arr(A.blueprints).filter(function (b) { return arr(b.ciclo).indexOf(c.id) > -1; }).map(function (b) { return b.id; });
    L.push('- **' + c.id + ' ' + c.label + '**' + (c.descripcion ? ': ' + c.descripcion : '') + (bps.length ? ' | ' + bps.join(', ') : ' | sin blueprint'));
  });
  L.push('', '## Blueprints', '', '| Id | Título | Actor | Intención | Segmentos | Cadencia | Entra cuando | Sale con | Viene de | Va a |', '|---|---|---|---|---|---|---|---|---|---|');
  arr(A.blueprints).forEach(function (b) {
    L.push('| ' + [b.id, b.titulo, act[b.actor] || b.actor, b.intencion || '', arr(b.segmentos).join(', '), b.cadencia || '',
      (b.entrada || {}).disparador || '', ((b.salida || {}).resultado || '') + (b.salida && b.salida.recibe ? ', lo recibe ' + (act[b.salida.recibe] || b.salida.recibe) : ''),
      arr((b.entrada || {}).viene_de).join(', '), arr((b.salida || {}).va_a).join(', ')].join(' | ') + ' |');
  });
  L.push('', '## Por qué este corte', '');
  arr(A.cortes).forEach(function (c) { L.push('- ' + c.decision + (c.por_que ? '. ' + c.por_que : '') + (c.descartado ? ' Descartado: ' + c.descartado + '.' : '') + fte(c)); });
  if (arr(A.sincronizaciones).length) {
    L.push('', '## Sincronizaciones entre journeys paralelos', '');
    arr(A.sincronizaciones).forEach(function (s) { L.push('- ' + s.de + ' ' + (s.tipo || '->') + ' ' + s.a + ': ' + (s.texto || '') + fte(s)); });
  }
  L.push('', '## Segmentos', '', '| Id | Segmento | Criterio | Blueprints |', '|---|---|---|---|');
  arr(A.segmentos).forEach(function (s) {
    var bps = arr(A.blueprints).filter(function (b) { return arr(b.segmentos).indexOf(s.id) > -1; }).map(function (b) { return b.id; });
    L.push('| ' + [s.id, s.label, s.criterio || '', bps.join(', ') || 'fuera de alcance'].join(' | ') + ' |');
  });
  L.push('', '## Fuentes y cobertura', '', '| Id | Qué es | Perspectiva | Segmento |', '|---|---|---|---|');
  arr(A.fuentes).forEach(function (f) { L.push('| ' + [f.id, f.label || '', f.perspectiva || '', arr(f.segmento).join(', ')].join(' | ') + ' |'); });
  if (arr(A.huecos).length) { L.push('', '**Perspectivas que faltan**', ''); arr(A.huecos).forEach(function (h) { L.push('- ' + h); }); }
  if (arr(A.fuera_de_alcance).length) { L.push('', '## Fuera de alcance', ''); arr(A.fuera_de_alcance).forEach(function (f) { L.push('- ' + (f.que || f.segmento) + ': ' + (f.por_que || '')); }); }
  if (arr(A.preguntas).length) { L.push('', '## Preguntas abiertas de la arquitectura', ''); arr(A.preguntas).forEach(function (p) { L.push('- ' + (p.texto || p)); }); }
  fs.writeFileSync(path.join(dir, 'ARQUITECTURA.md'), L.join('\n') + '\n');
  var escritos = ['ARQUITECTURA.md'];

  arr(A.blueprints).forEach(function (b) {
    var m = A._bps[b.id]; if (!m) return;
    var M = [], ord = ordenMomentos(m), hall = {};
    arr(m.hallazgos).forEach(function (h) { (hall[h.momento] = hall[h.momento] || []).push(h); });
    M.push('# ' + b.id + ' | ' + (b.titulo || ''), '');
    M.push('| | |', '|---|---|', '| Actor | ' + (act[b.actor] || b.actor) + ' |', '| Intención | ' + (b.intencion || '') + ' |', '| Segmentos | ' + arr(b.segmentos).join(', ') + ' |',
      '| Cadencia | ' + (b.cadencia || '') + ' |', '| Entra cuando | ' + ((b.entrada || {}).disparador || '') + ' |',
      '| Sale con | ' + ((b.salida || {}).resultado || '') + ' |', '| Foco | ' + (m.foco || '') + ' |');
    if (b.zoom_de) M.push('| Zoom de | ' + b.zoom_de + ' |');
    if (arr(b.validacion).length) M.push('| Validado con | ' + arr(b.validacion).map(function (v) { return v.con + (v.fecha ? ' (' + v.fecha + ')' : ''); }).join(', ') + ' |');
    M.push('');
    if (arr(m.journey).length) { M.push('## Journey', ''); arr(m.journey).forEach(function (j, i) { M.push((i + 1) + '. ' + j); }); M.push(''); }
    M.push('## Momentos', '');
    ord.forEach(function (mo) {
      var t = mo.tipo || 'accion';
      M.push('### ' + mo.id + ' | ' + (mo.label || '') + (t !== 'accion' ? ' (' + t + ')' : '') + (mo.fase ? ' | ' + mo.fase : ''), '');
      var cl = Array.isArray(mo.cliente) ? mo.cliente[0] : mo.cliente;
      if (cl) M.push('- **Cliente:** ' + cl.texto + fte(cl));
      if (cl && cl.pensamiento) M.push('- **Piensa:** ' + cl.pensamiento.texto + fte(cl.pensamiento));
      if (cl && cl.emocion) M.push('- **Siente:** ' + cl.emocion.texto + fte(cl.emocion));
      if (t === 'interno') M.push('- **Cliente:** sigue esperando');
      CAPAS.forEach(function (c) { arr(mo[c]).forEach(function (e) { M.push('- **' + c.charAt(0).toUpperCase() + c.slice(1) + (e.actor ? ', ' + (act[e.actor] || e.actor) : '') + ':** ' + e.texto + fte(e) + (e.ref ? ' (dueño: ' + e.ref + ')' : '')); }); });
      if (mo.sin_evidencia) M.push('- **Evidencia:** ninguna. ' + mo.sin_evidencia);
      if (mo.tiempo) M.push('- **Tiempo:** ' + mo.tiempo.texto + fte(mo.tiempo));
      if (mo.decision) {
        M.push('- **Decide:** ' + (act[mo.decision.decide] || mo.decision.decide || '?') + ', ' + (mo.decision.pregunta || '') + ' Criterio: ' + (mo.decision.criterio || 'no dicho'));
        arr(mo.decision.ramas).forEach(function (r) { M.push('  - ' + r.label + (r.volumen ? ' (' + r.volumen + ')' : '') + ' → ' + r.va_a + fte(r)); });
      } else if (arr(mo.sigue).length) M.push('- Sigue en ' + arr(mo.sigue).join(', '));
      if (mo.sale) M.push('- **Salida del recorrido**');
      if (arr(mo.cambio).length) M.push('- **Cambio to-be:** aplica ' + mo.cambio.join(', '));
      arr(hall[mo.id]).forEach(function (h) { M.push('- _' + h.tipo + (h.id ? ' ' + h.id : '') + ':_ ' + h.texto + fte(h) + (arr(h.resuelve).length ? ' (resuelve ' + h.resuelve.join(', ') + ')' : '')); });
      M.push('');
    });
    if (arr(m.fallas).length) { M.push('## Puntos de falla', ''); arr(m.fallas).forEach(function (f) { M.push('- ' + f.momento + ': ' + (f.senal || '') + fte(f)); }); M.push(''); }
    if (arr(m.verdad).length) { M.push('## Momentos de la verdad', ''); arr(m.verdad).forEach(function (v) { M.push('- ' + v.momento + ': ' + (v.por_que || '') + fte(v)); }); M.push(''); }
    if (arr(m.preguntas).length) { M.push('## Preguntas abiertas', ''); arr(m.preguntas).forEach(function (p) { M.push('- ' + (p.texto || p) + (p.momento ? ' (' + p.momento + ')' : '')); }); }
    var nombre = b.id + '.md';
    fs.writeFileSync(path.join(dir, nombre), M.join('\n') + '\n');
    escritos.push(nombre);
  });
  console.log('Escritos en ' + dir + ': ' + escritos.join(', '));
}

/* ------------------------------------------------------------ auditar bp/2 existentes */
function auditar(files) {
  var R = new Reporte(), todas = [], cod = codigosCorpus();
  files.forEach(function (f) {
    var b = leerJSON(f), F = path.basename(f).replace(/(_bp)?\.bp\.json$|_bp\.json$|\.json$/, '');
    var pasos = arr(b.pasos), idx = {};
    pasos.forEach(function (p, i) { idx[p.id] = i; });
    if (pasos[0] && pasos[0].tipo === 'decision') R.add('AVISO', 'B3', F + ' ' + pasos[0].id, 'El blueprint arranca con una decision: le falta el momento que la provoca, o la decision quedo de otro blueprint al cortarlo');
    var cjActores = {}, nHall = 0, sinRef = 0;
    pasos.forEach(function (p) {
      var d = F + ' ' + p.id;
      if (p.tipo === 'decision') {
        var ramas = arr(p.ramas), dest = ramas.map(function (r) { return r.sigue; }).filter(Boolean);
        if (dest.length >= 2 && new Set(dest).size === 1) R.add('ERROR', 'B4', d, 'Todas las ramas siguen al mismo paso: la decision no decide nada, es una variante');
        ramas.forEach(function (r) { if (!r.sigue && p !== pasos[pasos.length - 1]) R.add('AVISO', 'B4', d + ' rama ' + r.id, 'Rama sin destino: en el board la secuencia sigue igual, como si no se hubiera bifurcado'); });
        var t = dest.map(function (s) { return idx[s]; }).filter(function (x) { return x != null; }).sort(function (x, y) { return x - y; });
        for (var k = 1; k < t.length; k++) if (t[k] !== t[k - 1] && t[k] - 1 >= 0) {
          var prev = pasos[t[k] - 1];
          if (prev && prev.tipo !== 'decision') R.add('AVISO', 'B5', d, 'En el board el final de una rama (' + prev.id + ') desemboca en el arranque de otra (' + pasos[t[k]].id + '): el formato lineal mezcla los caminos');
        }
        return;
      }
      var cj = arr(p.carriles && p.carriles.CJ);
      var acc = cj.filter(function (c) { return c.tipo !== 'espera'; });
      if (acc.length > 1) R.add('AVISO', 'B2', d, 'Dos o mas acciones del cliente en el mismo paso: o son una secuencia o son dos journeys');
      cj.forEach(function (c) { if (c.actor) cjActores[c.actor] = 1; });
      arr(p.hallazgos).forEach(function (h) { nHall++; if (!h.ref) sinRef++; });
      Object.keys(p.carriles || {}).forEach(function (l) {
        arr(p.carriles[l]).forEach(function (c) { if (c.tipo !== 'espera' && l !== 'EV') todas.push({ f: F, p: p.id, l: l, t: c.texto, k: tokens(c.texto) }); });
      });
    });
    if (Object.keys(cjActores).length > 1) R.add('AVISO', 'B1', F, 'Mas de un actor en el carril del cliente: ' + Object.keys(cjActores).join(', '));
    var n = pasos.filter(function (p) { return p.tipo !== 'decision'; }).length;
    if (nHall && sinRef / nHall > 0.4) R.add('INFO', 'B11', F, Math.round(100 * sinRef / nHall) + '% de los hallazgos no apunta a ninguna tarjeta');
    R.add('INFO', 'B6', F, 'El formato no lleva fuente por tarjeta: la trazabilidad vive afuera del archivo, y no se puede verificar desde el board');
    if (cod) {
      var mf = String((b.meta || {}).fuentes || '');
      var faltan = cod.filter(function (c) { return mf.indexOf(c) < 0; });
      var rango = mf.match(/E(\d+)\s*a\s*E(\d+)/);
      if (rango) faltan = faltan.filter(function (c) { var x = parseInt(c.slice(1), 10); return !(x >= +rango[1] && x <= +rango[2]); });
      if (faltan.length) R.add('AVISO', 'A7', F, 'Entrevistas del corpus que el blueprint no cita: ' + faltan.join(', '));
    }
  });
  for (var i = 0; i < todas.length; i++) for (var j = i + 1; j < todas.length; j++) {
    var a = todas[i], c = todas[j];
    if (a.f === c.f) continue;
    if (jaccard(a.k, c.k) >= 0.6) R.add('AVISO', 'X1', a.f + ' ' + a.p + ' y ' + c.f + ' ' + c.p, 'La misma accion en dos blueprints: ' + corto(a.t, 60));
  }
  console.log('auditados ' + files.length + ' blueprints bp/2');
  R.imprimir();
}

/* ------------------------------------------------------------ main */
if (cmd === 'check' && args[0]) check(args[0]);
else if (cmd === 'render' && args[0]) render(args[0]);
else if (cmd === 'auditar' && args.length) auditar(args);
else {
  console.log('uso:\n  node modelo.js check <carpeta> [--corpus corpus.json]\n  node modelo.js render <carpeta>\n  node modelo.js auditar <a.bp.json ...> [--corpus corpus.json]');
  process.exitCode = 2;
}
