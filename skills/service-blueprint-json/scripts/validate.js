/* ============================================================================
   BLUEPRINT v2 | DESIGN SYSTEM
   Todo lo visual vive aca. El .bp.json no dice nada de estetica.
   ========================================================================== */

var BP = (typeof BP !== 'undefined') ? BP : {};

(function (X) {
  'use strict';

  X.SPEC = 'bp/2';
  X.BUILD = 10;                  // se muestra en el panel: si no coincide, Figma esta cargando una carpeta vieja
  X.NS = 'blueprint';           // namespace de sharedPluginData: lo puede leer cualquiera

  X.DS = {
    grid: {
      cardW: 352,               // ancho de tarjeta, unico en todo el board
      pitch: 472,               // cardW + gutter
      gutter: 120,
      margen: 102,
      labelW: 590,              // columna de titulos de carril
      ritmo: 88,                // alturas cuantizadas: 176 / 264 / 352 / 440
      altoMin: 176,
      altoEspera: 68,
      gapCards: 24,             // separacion vertical entre tarjetas de un mismo paso
      gapHall: 12,
      padBanda: 40,
      padTextoX: 32,            // margen horizontal del texto adentro de la forma
      padTextoY: 48,            // margen vertical del texto adentro de la forma
      chipH: 32, chipDesborde: 16,
      altoHallMin: 40,
      originY: 717,             // Y donde arranca la primera banda
      titleY: 196, faseY: 500, rotuloY: 640,
      diamante: 240,
      lineChipW: 468, lineChipH: 48,
      phaseBarH: 107
    },

    // estilo de tarjeta por carril. El .bp.json elige uno en la tabla de carriles.
    estilo: {
      journey:   { fill: '#1F5553', text: '#FFFFFF', style: 'Medium', size: 24 },
      evidencia: { fill: '#BEDFFC', text: '#1A1A1A', style: 'Medium', size: 24 },
      actor:     { fill: '#F0F0F0', text: '#1A1A1A', style: 'Medium', size: 20 }
    },

    espera:   { fill: '#1F5553', text: '#FFFFFF', style: 'Bold', size: 24 },
    decision: { fill: '#F0F0F0', text: '#1A1A1A', size: 20 },
    rama:     { fill: '#CDC3FF', text: '#1A1A1A' },
    unhappy:  '#F83307',

    hallazgo: {
      dolor:       { fill: '#FFD37C', text: '#1A1A1A' },
      oportunidad: { fill: '#CBEDD2', text: '#1A1A1A' },
      nota:        { fill: '#4A5764', text: '#FFFFFF' },
      cita:        { fill: '#FEBB32', text: '#1A1A1A' },
      dato:        { fill: '#CDC3FF', text: '#1A1A1A' },
      pregunta:    { fill: '#4B3980', text: '#FFFFFF' }
    },

    // borde izquierdo del hallazgo, segun el carril de la tarjeta que referencia
    acentoCarril: { EV: '#3DADFF', CJ: '#1F5553', FS: '#F83307', BS: '#6444C2', PS: '#A801D2' },

    chrome: {
      acento:   '#4B3980',
      andamioA: '#FFFFFF',
      andamioB: '#F1F1F6',
      andamioBorde: '#E2E2EC',
      andamioGuia: '#D5D5E2',
      gris:     '#757575',
      linea:    '#CCD3FF',
      fondo:    '#FFFFFF',
      titulo:   { style: 'Bold',   size: 100 },
      subtitulo:{ style: 'Medium', size: 40 },
      fase:     { fill: '#757575', text: '#FFFFFF', style: 'Bold', size: 64 },
      rotulo:   { size: 20 },
      carril:   { tituloSize: 40, descSize: 20 },
      lineChip: { style: 'Bold', size: 32 },
      conector: { weight: 4, tipo: 'ELBOWED' }
    },

    // paletas de reserva, estables por nombre
    paletaActor: ['#C2410C','#047857','#1D4ED8','#7C3AED','#BE123C','#0F766E',
                  '#A16207','#4338CA','#B91C1C','#15803D','#7E22CE','#0E7490'],
    paletaCanal: ['#FDE68A','#BFDBFE','#BBF7D0','#FBCFE8','#DDD6FE','#FED7AA',
                  '#A7F3D0','#E9D5FF','#FECACA','#CFFAFE','#E4E4E7','#FEF08A']
  };

  X.CARRILES_DEFAULT = {
    es: [
      { id: 'EV', label: 'EVIDENCIAS', estilo: 'evidencia',
        desc: 'Objetos fisicos o digitales que intervienen en las interacciones y que el cliente ve, recibe o usa.',
        lineaAbajo: 'Linea de interaccion' },
      { id: 'CJ', label: 'CUSTOMER JOURNEY', estilo: 'journey',
        desc: 'Pasos, elecciones o actividades que realiza el cliente a lo largo del servicio.',
        lineaAbajo: null },
      { id: 'FS', label: 'FRONTSTAGE', estilo: 'actor',
        desc: 'Acciones que ocurren a la vista del cliente.',
        lineaAbajo: 'Linea de visibilidad' },
      { id: 'BS', label: 'BACKSTAGE', estilo: 'actor',
        desc: 'Actividades que ocurren detras de escena para sostener lo que pasa en el escenario.',
        lineaAbajo: 'Linea de interaccion interna' },
      { id: 'PS', label: 'PROCESOS DE SOPORTE', estilo: 'actor',
        desc: 'Pasos internos que apoyan a los colaboradores en la entrega del servicio.',
        lineaAbajo: null }
    ],
    en: [
      { id: 'EV', label: 'EVIDENCE', estilo: 'evidencia',
        desc: 'Physical or digital objects involved in the interactions, that the customer sees, gets or uses.',
        lineaAbajo: 'Line of interaction' },
      { id: 'CJ', label: 'CUSTOMER JOURNEY', estilo: 'journey',
        desc: 'Steps, choices and activities the customer goes through along the service.',
        lineaAbajo: null },
      { id: 'FS', label: 'FRONTSTAGE', estilo: 'actor',
        desc: 'Actions that happen in front of the customer.',
        lineaAbajo: 'Line of visibility' },
      { id: 'BS', label: 'BACKSTAGE', estilo: 'actor',
        desc: 'Activities that happen behind the scenes to hold up what happens on stage.',
        lineaAbajo: 'Line of internal interaction' },
      { id: 'PS', label: 'SUPPORT PROCESSES', estilo: 'actor',
        desc: 'Internal steps that support the staff in delivering the service.',
        lineaAbajo: null }
    ]
  };

  // textos que el render escribe en el board
  X.TEXTOS = {
    es: { hallazgos: 'HALLAZGOS',
          hallazgosDesc: 'Dolores, oportunidades, datos y preguntas del momento de arriba.' },
    en: { hallazgos: 'FINDINGS',
          hallazgosDesc: 'Pains, opportunities, facts and open questions for the moment above.' }
  };

  /* ---------------------------------------------------------------- helpers */

  X.rgb = function (hex) {
    var h = String(hex || '#000000').replace('#', '');
    return { r: parseInt(h.substr(0,2),16)/255, g: parseInt(h.substr(2,2),16)/255, b: parseInt(h.substr(4,2),16)/255 };
  };
  X.sol = function (hex) { return [{ type: 'SOLID', color: X.rgb(hex) }]; };

  X.textoSobre = function (hex) {
    var c = X.rgb(hex);
    var f = function (v) { return v <= 0.03928 ? v/12.92 : Math.pow((v+0.055)/1.055, 2.4); };
    return (0.2126*f(c.r) + 0.7152*f(c.g) + 0.0722*f(c.b)) > 0.45 ? '#1A1A1A' : '#FFFFFF';
  };

  X.key = function (s) {
    return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '')
      .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  };

  X.hash = function (s) {
    var h = 2166136261;
    for (var i = 0; i < String(s).length; i++) { h ^= String(s).charCodeAt(i); h = (h * 16777619) >>> 0; }
    return h;
  };

  X.esHex = function (v) { return /^#[0-9A-Fa-f]{6}$/.test(String(v || '')); };

  X.I18N = {
    es: {
      autor: 'Juan Ferrari | Diseño con fundamento',
      titulo: 'Convertí un .json en un service blueprint',
      bajada: 'Elegí cómo querés empezar',
      cargar: 'Cargar un archivo',
      cargarDesc: 'Arrastrá tu .json acá o hacé click para buscarlo en tu compu.',
      pegar: 'Pegar el JSON',
      pegarDesc: 'Si lo tenés en el portapapeles, pegalo directamente.',
      ejemplo: 'Ver un ejemplo',
      ejemploDesc: 'Una pizzería italiana, de la puerta a la vereda. Sirve para ver el formato.',
      placeholder: 'Pegá acá el contenido de tu .json',
      validar: 'Validar',
      volver: 'Volver',
      encontre: 'Esto es lo que encontré',
      pasos: 'pasos', tarjetas: 'tarjetas', hallazgos: 'hallazgos', conexiones: 'conexiones',
      comoDibujo: '¿Cómo lo querés en el board?',
      comoDibujoDesc: 'Los dos salen del mismo archivo. Son para dos momentos distintos.',
      taller: 'Taller',
      tallerDesc: 'Formas nativas de FigJam. Editás el texto, movés tarjetas, sumás flechas. Para trabajar y validar con el equipo.',
      pres: 'Presentación',
      presDesc: 'Auto layout. Sale alineado y prolijo, y en FigJam no se toca. Para congelar, exportar y compartir.',
      dibujar: 'Dibujar en el board',
      dibujando: 'Dibujando…',
      listo: 'Listo',
      otro: 'Dibujar otro',
      errores: 'No puedo dibujar todavía',
      avisos: 'Para revisar',
      info: 'Nada grave, pero mirá esto',
      todoBien: 'El archivo está impecable',
      jsonRoto: 'Ese texto no es un JSON válido',
      faltaJson: 'Primero cargá o pegá un archivo',
      noFrames: 'Este FigJam no deja crear frames, así que el modo presentación no corre acá. Usá el modo taller.',
      presNota: 'Esta section no se edita dentro de FigJam. Si necesitás tocarla, copiala a un archivo de diseño.',
      elementos: 'elementos'
    },
    en: {
      autor: 'Juan Ferrari | Diseño con fundamento',
      titulo: 'Turn a .json into a service blueprint',
      bajada: 'Pick how you want to start',
      cargar: 'Load a file',
      cargarDesc: 'Drop your .json here, or click to pick it from your computer.',
      pegar: 'Paste the JSON',
      pegarDesc: 'If you already have it in the clipboard, paste it straight in.',
      ejemplo: 'See an example',
      ejemploDesc: 'An Italian pizzeria, from the door to the sidewalk. Good for seeing the format.',
      placeholder: 'Paste the contents of your .json here',
      validar: 'Validate',
      volver: 'Back',
      encontre: 'Here is what I found',
      pasos: 'steps', tarjetas: 'cards', hallazgos: 'findings', conexiones: 'connections',
      comoDibujo: 'How do you want it on the board?',
      comoDibujoDesc: 'Both come from the same file. They are for two different moments.',
      taller: 'Workshop',
      tallerDesc: 'Native FigJam shapes. Edit the text, drag cards around, add arrows. For working and validating with the team.',
      pres: 'Presentation',
      presDesc: 'Auto layout. Comes out aligned and tidy, and cannot be edited inside FigJam. For freezing, exporting and sharing.',
      dibujar: 'Draw on the board',
      dibujando: 'Drawing…',
      listo: 'Done',
      otro: 'Draw another',
      errores: 'I cannot draw this yet',
      avisos: 'Worth a look',
      info: 'Nothing serious, but have a look',
      todoBien: 'The file is spotless',
      jsonRoto: 'That text is not valid JSON',
      faltaJson: 'Load or paste a file first',
      noFrames: 'This FigJam does not allow creating frames, so presentation mode will not run here. Use workshop mode.',
      presNota: 'This section cannot be edited inside FigJam. If you need to touch it, copy it into a design file.',
      elementos: 'elements'
    }
  };

})(BP);

if (typeof module !== 'undefined' && module.exports) module.exports = BP;

/* ============================================================================
   BLUEPRINT v2 | MODELO
   Normaliza y valida un .bp.json. No toca la API de Figma: corre en node.
   Contrato: si validar() no devuelve errores, render() no puede fallar por datos.
   ========================================================================== */

var BP = (typeof BP !== 'undefined') ? BP : {};

(function (X) {
  'use strict';

  var TIPOS_CARD = ['accion', 'espera'];
  var TIPOS_HALL = ['dolor', 'oportunidad', 'nota', 'cita', 'dato', 'pregunta',
                    'regulacion', 'tiempo', 'falla', 'verdad', 'posta'];
  var TIPOS_CONN = ['flecha', 'doble', 'punteada'];
  var ESTILOS    = ['journey', 'evidencia', 'actor'];
  var MAX_TEXTO  = 120;   // mas que esto es mas de una accion

  function arr(v) { return Array.isArray(v) ? v : []; }
  function str(v) { return v === null || v === undefined ? '' : String(v).trim(); }

  /* ------------------------------------------------------------ normalizar */

  X.normalizar = function (raw, idioma) {
    var lang = (idioma === 'en') ? 'en' : 'es';
    var m = {
      spec: str(raw.spec) || X.SPEC,
      meta: raw.meta || {},
      actores: {}, canales: {},
      carriles: [], fases: [], pasos: [], conexiones: []
    };

    // catalogos
    arr(raw.actores).forEach(function (a, i) {
      var id = X.key(a.id || a.label);
      if (!id) return;
      m.actores[id] = {
        id: id,
        label: str(a.label) || id,
        color: X.esHex(a.color) ? a.color.toUpperCase() : null,
        _auto: !X.esHex(a.color)
      };
    });
    arr(raw.canales).forEach(function (c) {
      var id = X.key(c.id || c.label);
      if (!id) return;
      m.canales[id] = {
        id: id,
        label: str(c.label) || id,
        color: X.esHex(c.color) ? c.color.toUpperCase() : null,
        italica: !!c.italica,
        _auto: !X.esHex(c.color)
      };
    });

    // carriles
    var cs = arr(raw.carriles);
    if (!cs.length) cs = X.CARRILES_DEFAULT[lang];
    m.carriles = cs.map(function (l) {
      var estilo = str(l.estilo).toLowerCase();
      if (ESTILOS.indexOf(estilo) < 0) estilo = 'actor';
      return {
        id: str(l.id).toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4) || 'L',
        label: (str(l.label) || str(l.id)).toUpperCase(),
        desc: str(l.desc),
        estilo: estilo,
        lineaAbajo: str(l.lineaAbajo) || null
      };
    });

    m.fases = arr(raw.fases).map(function (f) {
      return { id: str(f.id), label: (str(f.label) || str(f.id)).toUpperCase() };
    });

    // pasos
    arr(raw.pasos).forEach(function (p, i) {
      var paso = {
        id: str(p.id) || ('s' + (i + 1)),
        fase: str(p.fase) || null,
        label: str(p.label),
        tiempo: str(p.tiempo) || null,
        tipo: str(p.tipo) === 'decision' ? 'decision' : 'paso',
        carriles: {},
        hallazgos: [],
        pregunta: str(p.pregunta),
        ramas: []
      };

      if (paso.tipo === 'decision') {
        paso.ramas = arr(p.ramas).map(function (r, j) {
          return {
            id: str(r.id) || String.fromCharCode(65 + j),
            label: str(r.label),
            detalle: str(r.detalle),
            sigue: str(r.sigue) || null,
            unhappy: !!r.unhappy
          };
        });
      }

      var cc = p.carriles || {};
      m.carriles.forEach(function (l) {
        paso.carriles[l.id] = arr(cc[l.id]).map(function (c, k) {
          var tipo = str(c.tipo) || 'accion';
          if (TIPOS_CARD.indexOf(tipo) < 0) tipo = 'accion';
          return {
            id: str(c.id) || (paso.id + '-' + l.id + (k + 1)),
            texto: str(c.texto),
            actor: c.actor ? X.key(c.actor) : null,
            canal: c.canal ? X.key(c.canal) : null,
            tipo: tipo,
            span: Math.max(1, parseInt(c.span, 10) || 1),
            unhappy: !!c.unhappy,
            lane: l.id, paso: paso.id
          };
        });
      });

      paso.hallazgos = arr(p.hallazgos).map(function (h, k) {
        var tipo = str(h.tipo) || 'nota';
        if (TIPOS_HALL.indexOf(tipo) < 0) tipo = 'nota';
        return {
          id: str(h.id) || null,
          tipo: tipo,
          texto: str(h.texto),
          ref: str(h.ref) || null,
          paso: paso.id
        };
      });

      m.pasos.push(paso);
    });

    m.conexiones = arr(raw.conexiones).map(function (c) {
      var tipo = str(c.tipo) || 'flecha';
      if (TIPOS_CONN.indexOf(tipo) < 0) tipo = 'flecha';
      return { de: str(c.de), a: str(c.a), tipo: tipo, label: str(c.label) || null };
    }).filter(function (c) { return c.de && c.a; });

    return m;
  };

  /* --------------------------------------------------------------- validar */

  X.validar = function (m) {
    var v = [];
    var E = function (msg, donde) { v.push({ nivel: 'error', msg: msg, donde: donde || '' }); };
    var W = function (msg, donde) { v.push({ nivel: 'aviso', msg: msg, donde: donde || '' }); };
    var I = function (msg, donde) { v.push({ nivel: 'info',  msg: msg, donde: donde || '' }); };

    if (m.spec !== X.SPEC) E('spec deberia ser "' + X.SPEC + '", vino "' + m.spec + '"');
    if (!m.pasos.length) E('El archivo no tiene pasos');

    var vistos = {}, cards = {}, fases = {};
    m.fases.forEach(function (f) {
      if (fases[f.id]) E('Fase duplicada: ' + f.id);
      fases[f.id] = true;
    });

    m.pasos.forEach(function (p) {
      if (vistos[p.id]) E('id de paso duplicado: ' + p.id, p.id);
      vistos[p.id] = true;
      if (p.fase && !fases[p.fase]) E('El paso apunta a una fase que no existe: ' + p.fase, p.id);

      var n = 0;
      m.carriles.forEach(function (l) {
        (p.carriles[l.id] || []).forEach(function (c) {
          n++;
          if (cards[c.id] || vistos[c.id]) E('id de tarjeta duplicado: ' + c.id, p.id);
          cards[c.id] = c;
          if (!c.texto) E('Tarjeta sin texto: ' + c.id, p.id);
          if (c.texto.length > MAX_TEXTO)
            W('La tarjeta ' + c.id + ' tiene ' + c.texto.length + ' caracteres. Arriba de ' +
              MAX_TEXTO + ' casi siempre son dos acciones: partila en dos tarjetas.', p.id);
          if (c.actor && !m.actores[c.actor])
            W('Actor no declarado: "' + c.actor + '", le asigno un color de la paleta', p.id);
          if (c.canal && !m.canales[c.canal])
            W('Canal no declarado: "' + c.canal + '", le asigno un color de la paleta', p.id);
        });
      });
      if (p.tipo !== 'decision' && !n && !p.hallazgos.length) W('Paso vacio: ' + p.id, p.id);
      if (p.tipo === 'decision' && !p.ramas.length) E('Decision sin ramas: ' + p.id, p.id);

      var hayDolor = false, hayOpp = false;
      p.hallazgos.forEach(function (h) {
        if (!h.texto) W('Hallazgo sin texto', p.id);
        if (h.id) {
          if (vistos[h.id]) E('id de hallazgo duplicado: ' + h.id, p.id);
          vistos[h.id] = true;
        }
        if (h.tipo === 'dolor') hayDolor = true;
        if (h.tipo === 'oportunidad') hayOpp = true;
      });
      if (hayDolor && !hayOpp) I('Hay dolores sin ninguna oportunidad asociada', p.id);
    });

    // referencias
    m.pasos.forEach(function (p) {
      p.hallazgos.forEach(function (h) {
        if (h.ref && !cards[h.ref]) { W('ref apunta a una tarjeta que no existe: ' + h.ref, p.id); h.ref = null; }
      });
    });
    m.conexiones = m.conexiones.filter(function (c) {
      var okDe = !!cards[c.de] || m.pasos.some(function (p) { return p.tipo === 'decision' && p.id === c.de; });
      var okA  = !!cards[c.a]  || m.pasos.some(function (p) { return p.tipo === 'decision' && p.id === c.a; });
      if (!okDe || !okA) { W('Conexion con un extremo inexistente: ' + c.de + ' -> ' + c.a); return false; }
      return true;
    });

    // spans: una espera solo puede taparse sobre columnas vacias del mismo carril
    var idx = {}; m.pasos.forEach(function (p, i) { idx[p.id] = i; });
    m.pasos.forEach(function (p, i) {
      m.carriles.forEach(function (l) {
        (p.carriles[l.id] || []).forEach(function (c) {
          if (c.span <= 1) return;
          var libre = 1;
          for (var k = i + 1; k < m.pasos.length && k < i + c.span; k++) {
            if ((m.pasos[k].carriles[l.id] || []).length) break;
            libre++;
          }
          if (libre < c.span) {
            W('La espera ' + c.id + ' pedia span ' + c.span + ' pero solo hay ' + libre +
              ' columna(s) libre(s) en ' + l.id + '. La recorto para que no tape nada.', p.id);
            c.span = libre;
          }
        });
      });
    });

    return v;
  };

  X.resumen = function (m) {
    var t = 0, h = 0;
    m.pasos.forEach(function (p) {
      m.carriles.forEach(function (l) { t += (p.carriles[l.id] || []).length; });
      h += p.hallazgos.length;
    });
    return {
      titulo: (m.meta.titulo || '') + (m.meta.variante ? '  |  ' + m.meta.variante : ''),
      pasos: m.pasos.length, tarjetas: t, hallazgos: h, conexiones: m.conexiones.length,
      carriles: m.carriles.map(function (l) { return l.id + ' ' + l.label; })
    };
  };

})(BP);

if (typeof module !== 'undefined' && module.exports) module.exports = BP;


/* --------------------------------------------------------------------------
   Runner: node validate.js archivo.bp.json
   Devuelve el mismo veredicto que el plugin, sin abrir Figma.
   -------------------------------------------------------------------------- */
if (typeof require !== 'undefined' && require.main === module) {
  var fs = require('fs');
  var ruta = process.argv[2];
  if (!ruta) { console.error('uso: node validate.js archivo.bp.json'); process.exit(2); }

  var raw;
  try { raw = JSON.parse(fs.readFileSync(ruta, 'utf8')); }
  catch (e) { console.error('JSON invalido: ' + e.message); process.exit(2); }

  var idioma = process.argv[3] === 'en' ? 'en' : 'es';
  var m = BP.normalizar(raw, idioma);
  var v = BP.validar(m);
  var r = BP.resumen(m);

  var errores = v.filter(function (x) { return x.nivel === 'error'; });
  var avisos  = v.filter(function (x) { return x.nivel === 'aviso'; });
  var infos   = v.filter(function (x) { return x.nivel === 'info'; });

  console.log('archivo   ' + ruta);
  console.log('blueprint ' + (r.titulo || '(sin titulo)'));
  console.log('contenido ' + r.pasos + ' pasos, ' + r.tarjetas + ' tarjetas, ' +
              r.hallazgos + ' hallazgos, ' + r.conexiones + ' conexiones');
  console.log('carriles  ' + r.carriles.join(' | '));
  console.log('');

  function listar(t, arr) {
    if (!arr.length) return;
    console.log(t + ' (' + arr.length + ')');
    arr.forEach(function (x) { console.log('  ' + (x.donde ? '[' + x.donde + '] ' : '') + x.msg); });
    console.log('');
  }
  listar('ERRORES, no se puede dibujar', errores);
  listar('AVISOS, dibuja igual', avisos);
  listar('INFO', infos);

  if (!v.length) console.log('Sin observaciones. El archivo esta listo.');
  else if (!errores.length) console.log('Sin errores. El archivo se puede dibujar.');

  process.exit(errores.length ? 1 : 0);
}
