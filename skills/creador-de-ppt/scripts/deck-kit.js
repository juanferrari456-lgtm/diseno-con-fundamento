/**
 * deck-kit.js: sistema visual editorial para presentaciones de discovery.
 *
 * Uso:
 *   const { createDeck, TOKENS } = require('./deck-kit');
 *   const deck = createDeck();
 *   deck.cover({ titleTop: 'Proyecto', titleBottom: 'Discovery', date: 'Mayo 2026' });
 *   deck.save('salida.pptx');
 *
 * Cada método devuelve el slide de pptxgenjs por si hace falta agregar algo puntual
 * encima. Todos aceptan `notes` para las notas del orador.
 */

const pptxgen = require('pptxgenjs');
const fs = require('fs');

// ---------------------------------------------------------------------------
// Tokens
// ---------------------------------------------------------------------------

const TOKENS = {
  color: {
    ink: '000000',        // negro: fondos de estructura y texto principal
    paper: 'FFFFFF',
    accent: '6C7BF2',     // acento índigo: UN solo uso por slide
    accentDeep: '1E2659', // índigo profundo: tarjetas de aprendizaje
    mint: 'E6E9FD',       // tinte claro del acento: slides statement a sangre
    mintBand: 'D6DBFB',   // banda de conclusión
    surface: 'F8F7FC',    // gris casi blanco: tarjetas de contenido
    label: '3B47B8',      // índigo medio: etiquetas versalita
    body: '3C3C3F',       // párrafos sobre blanco
    muted: '6E6E73',      // texto secundario
    hint: '8E8E93',       // breadcrumbs, fuentes, captions
    line: 'E3E3E8',
  },
  grid: {
    W: 13.333,
    H: 7.5,
    M: 0.9,               // margen lateral
    get contentW() { return this.W - this.M * 2; },
    yBreadcrumb: 0.5,
    yTitle: 0.92,
    gap: 0.3,
  },
  size: {
    display: 74,
    sectionTitle: 46,
    title: 36,
    statement: 28,
    lede: 15,
    cardTitle: 17,
    body: 12.5,
    label: 10.5,
    caption: 10,
  },
};

const C = TOKENS.color;
const G = TOKENS.grid;
const S = TOKENS.size;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Texto enriquecido. Acepta:
 *   'texto plano'
 *   ['normal ', { t: 'resaltado', c: C.accent, b: true }, ' más texto']
 */
function rich(content, base = {}) {
  if (typeof content === 'string') return [{ text: content, options: { ...base } }];
  return content.map((p) => {
    if (typeof p === 'string') return { text: p, options: { ...base } };
    const o = { ...base };
    if (p.c) o.color = p.c;
    if (p.b !== undefined) o.bold = p.b;
    if (p.i !== undefined) o.italic = p.i;
    if (p.size) o.fontSize = p.size;
    if (p.break) o.breakLine = true;
    return { text: p.t, options: o };
  });
}

/** Párrafos separados, como array de runs con saltos de línea. */
function paragraphs(items, base = {}, spacing = 10) {
  const out = [];
  items.forEach((p, i) => {
    const runs = rich(p, base);
    runs.forEach((r) => out.push(r));
    const last = out[out.length - 1];
    last.options = { ...last.options, breakLine: true, paraSpaceAfter: i === items.length - 1 ? 0 : spacing };
  });
  return out;
}

function isDark(bg, pal = C) {
  return bg === pal.ink || bg === pal.accentDeep;
}

/** Aclara un hex mezclándolo con blanco (0 = original, 1 = blanco). */
function tint(hex, amount) {
  const n = parseInt(hex, 16);
  const mix = (v) => Math.round(v + (255 - v) * amount).toString(16).padStart(2, '0');
  return (mix((n >> 16) & 255) + mix((n >> 8) & 255) + mix(n & 255)).toUpperCase();
}

// ---------------------------------------------------------------------------
// Deck
// ---------------------------------------------------------------------------

/**
 * Limpia del texto la raya larga (em dash y en dash) y el punto medio, que el
 * equipo no usa en ningún deck. Se aplica sola a todo texto y nota que pase por
 * un slide creado con newSlide.
 */
let reemplazosDeRaya = 0;
function limpiarTexto(t) {
  if (typeof t !== 'string') return t;
  const antes = t;
  const limpio = t
    .replace(/^(\s*)[\u2014\u2013]\s*/gm, '$1- ')
    .replace(/(\d)\s*\u2013\s*(\d)/g, '$1-$2')
    .replace(/\s*[\u2014\u2013]\s*/g, ', ')
    .replace(/\s*\u00b7\s*/g, ' | ');
  if (limpio !== antes) reemplazosDeRaya++;
  return limpio;
}
function limpiarContenido(c) {
  if (typeof c === 'string') return limpiarTexto(c);
  if (Array.isArray(c)) return c.map((r) => (r && typeof r === 'object' && 'text' in r ? { ...r, text: limpiarTexto(r.text) } : limpiarContenido(r)));
  return c;
}

function createDeck(opts = {}) {
  const fonts = { display: 'Arial', body: 'Calibri', ...(opts.fonts || {}) };
  // Paleta: el acento es lo único que cambia por marca. Los derivados se calculan
  // solos salvo que se los pise explícitamente.
  const accent = opts.accent || TOKENS.color.accent;
  const C = {
    ...TOKENS.color,
    accent,
    mint: tint(accent, 0.82),
    mintBand: tint(accent, 0.72),
    ...(opts.palette || {}),
  };
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_WIDE';
  pres.author = opts.author || '';
  pres.title = opts.title || '';

  const D = fonts.display;
  const B = fonts.body;

  function newSlide(bg = C.paper, notes) {
    const s = pres.addSlide();
    s.background = { color: bg };
    const addText = s.addText.bind(s);
    s.addText = (contenido, o) => addText(limpiarContenido(contenido), o);
    const addNotes = s.addNotes.bind(s);
    s.addNotes = (n) => addNotes(limpiarTexto(n));
    if (notes) s.addNotes(notes);
    return s;
  }

  /** Breadcrumb "Sección | Subsección" arriba a la izquierda. */
  function breadcrumb(slide, crumbs, dark = false) {
    if (!crumbs) return;
    const arr = Array.isArray(crumbs) ? crumbs : [crumbs];
    const runs = [];
    arr.forEach((c, i) => {
      if (i > 0) runs.push({ text: '  |  ', options: { color: dark ? C.muted : C.hint, bold: false } });
      runs.push({
        text: c,
        options: {
          color: i === arr.length - 1 && arr.length > 1 ? (dark ? C.paper : C.ink) : dark ? C.muted : C.hint,
          bold: i === arr.length - 1 && arr.length > 1,
        },
      });
    });
    slide.addText(runs, {
      x: G.M, y: G.yBreadcrumb, w: G.contentW, h: 0.28,
      fontFace: B, fontSize: S.label + 0.5, margin: 0, valign: 'middle',
    });
  }

  /** Título de slide de contenido. */
  function title(slide, text, o = {}) {
    slide.addText(rich(text, { color: o.color || C.ink, bold: true }), {
      x: o.x || G.M, y: o.y || G.yTitle, w: o.w || G.contentW, h: o.h || 0.85,
      fontFace: D, fontSize: o.size || S.title, charSpacing: -0.6,
      margin: 0, valign: 'top', lineSpacingMultiple: 1.05,
    });
  }

  /** Bajada / lede debajo del título. */
  function lede(slide, text, o = {}) {
    slide.addText(rich(text, { color: o.color || C.muted }), {
      x: G.M, y: o.y || 1.85, w: o.w || G.contentW, h: o.h || 0.6,
      fontFace: B, fontSize: o.size || S.lede, margin: 0, valign: 'top',
      lineSpacingMultiple: 1.25,
    });
  }

  /** Nota de fuente abajo a la izquierda. */
  function source(slide, text, dark = false) {
    if (!text) return;
    slide.addText(text, {
      x: G.M, y: G.H - 0.72, w: G.contentW, h: 0.3,
      fontFace: B, fontSize: S.caption, color: dark ? C.muted : C.hint,
      margin: 0, valign: 'middle',
    });
  }

  /** Tarjeta base (rectángulo redondeado sutil). */
  function card(slide, { x, y, w, h, fill }) {
    slide.addShape(pres.ShapeType.roundRect, {
      x, y, w, h, rectRadius: 0.05,
      fill: { color: fill || C.surface }, line: { color: fill || C.surface, width: 0 },
    });
  }

  /** Etiqueta versalita. */
  function eyebrow(slide, text, { x, y, w, color }) {
    slide.addText(String(text).toUpperCase(), {
      x, y, w, h: 0.24,
      fontFace: B, fontSize: S.label, bold: true, charSpacing: 0.6,
      color: color || C.label, margin: 0, valign: 'middle',
    });
  }

  function addImageOrBlock(slide, image, box) {
    if (image && (image.path || image.data)) {
      const o = { x: box.x, y: box.y, w: box.w, h: box.h, sizing: { type: 'cover', w: box.w, h: box.h } };
      if (image.path) o.path = image.path;
      if (image.data) o.data = image.data;
      slide.addImage(o);
    } else {
      slide.addShape(pres.ShapeType.rect, {
        x: box.x, y: box.y, w: box.w, h: box.h,
        fill: { color: C.surface }, line: { color: C.line, width: 1 },
      });
      slide.addText('imagen', {
        x: box.x, y: box.y, w: box.w, h: box.h,
        fontFace: B, fontSize: S.caption, color: C.hint, align: 'center', valign: 'middle',
      });
    }
  }

  // -------------------------------------------------------------------------
  // Ilustraciones propias (opcional)
  // -------------------------------------------------------------------------

  /** Alto de cada tamaño de spot, en pulgadas. El ancho sale de la proporción del archivo. */
  const ILL_H = { s: 1.3, m: 2.0, l: 3.0 };
  /** Aire fijo entre el spot y el texto que acompaña. */
  const ILL_GAP = 0.4;

  /** Ancho y alto en píxeles de un PNG o un SVG (por ruta o data URI). null si no se puede leer. */
  function imageDims(ill) {
    try {
      let buf;
      if (ill.path) buf = fs.readFileSync(ill.path);
      else if (ill.data) buf = Buffer.from(String(ill.data).split(',').pop(), 'base64');
      else return null;
      if (buf.slice(1, 4).toString() === 'PNG') return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
      const txt = buf.slice(0, 4000).toString();
      const vb = txt.match(/viewBox=["']\s*[-\d.]+[\s,]+[-\d.]+[\s,]+([\d.]+)[\s,]+([\d.]+)/);
      if (vb) return { w: parseFloat(vb[1]), h: parseFloat(vb[2]) };
      const w = txt.match(/<svg[^>]*\swidth=["']([\d.]+)/), h = txt.match(/<svg[^>]*\sheight=["']([\d.]+)/);
      if (w && h) return { w: parseFloat(w[1]), h: parseFloat(h[1]) };
    } catch (e) { return null; }
    return null;
  }

  /**
   * Prepara un spot: devuelve { w, h, side, ill } con el tamaño ya resuelto, o null si no hay
   * ilustración, si el archivo no existe o no se puede leer (se omite en silencio, nunca hay placeholder).
   * allowed: tamaños que acepta el arquetipo; el primero es el default.
   */
  function planIll(ill, { allowed = ['s', 'm', 'l'], sides = ['left', 'right'], maxW } = {}) {
    if (!ill || !(ill.path || ill.data)) return null;
    if (ill.path && !fs.existsSync(ill.path)) return null;
    const d = imageDims(ill);
    if (!d || !d.w || !d.h) return null;
    const size = allowed.includes(ill.size) ? ill.size : allowed[0];
    const side = sides.includes(ill.side) ? ill.side : sides[sides.length - 1];
    let h = ILL_H[size], w = h * (d.w / d.h);
    const cap = maxW || h * 1.25;
    if (w > cap) { w = cap; h = w * (d.h / d.w); }
    return { w, h, side, size, ill };
  }

  /** Coloca un spot ya planificado con su base en `bottom` y su borde exterior en `x` (izq.) o `right`. */
  function placeIll(slide, pl, { x, right, bottom }) {
    if (!pl) return;
    const o = { x: x !== undefined ? x : right - pl.w, y: bottom - pl.h, w: pl.w, h: pl.h };
    if (pl.ill.path) o.path = pl.ill.path; else o.data = pl.ill.data;
    slide.addImage(o);
  }

  // -------------------------------------------------------------------------
  // Arquetipos
  // -------------------------------------------------------------------------

  const api = {
    pres,
    tokens: TOKENS,

    /** Portada: dos líneas gigantes sobre blanco + banda negra con los créditos. */
    cover({ titleTop, titleBottom, blurb, presenter, presenterLabel = 'Presentado por:', date, dateLabel = 'Fecha:', logo, illustration, notes }) {
      const s = newSlide(C.paper, notes);
      const bandY = 5.0;
      // Spot grande a la derecha, parado sobre la banda negra. Solo del lado derecho.
      const pl = planIll(illustration, { allowed: ['l', 'm'], sides: ['right'] });
      const titleW = pl ? G.W - 1.2 - pl.w - ILL_GAP - 0.3 : G.W - 1.2;
      s.addShape(pres.ShapeType.rect, {
        x: 0, y: bandY, w: G.W, h: G.H - bandY,
        fill: { color: C.ink }, line: { color: C.ink, width: 0 },
      });
      // El titular ocupa el ancho disponible: se dimensiona según la línea más larga.
      const longest = Math.max((titleTop || '').length, (titleBottom || '').length, 1);
      const fs = Math.max(34, Math.min(S.display + 14, Math.round((1300 * titleW) / (G.W - 1.2) / longest)));
      const lineH = (fs / 72) * 1.05;
      const block = lineH * ((titleTop ? 1 : 0) + (titleBottom ? 1 : 0));
      let ty = (bandY - block) / 2;
      if (titleTop) {
        s.addText(titleTop, {
          x: 0.62, y: ty, w: titleW, h: lineH,
          fontFace: D, fontSize: fs, bold: true, color: C.accent,
          charSpacing: -2, margin: 0, valign: 'middle',
        });
        ty += lineH;
      }
      if (titleBottom) {
        s.addText(titleBottom, {
          x: 0.62, y: ty, w: titleW, h: lineH,
          fontFace: D, fontSize: fs, bold: true, color: C.ink,
          charSpacing: -2, margin: 0, valign: 'middle',
        });
      }
      if (blurb) {
        s.addText(rich(blurb, { color: C.paper }), {
          x: G.M, y: 5.65, w: 4.9, h: 1.3,
          fontFace: B, fontSize: 11.5, margin: 0, valign: 'top', lineSpacingMultiple: 1.3,
        });
      }
      if (logo && (logo.path || logo.data)) {
        // Con spot, el logo sube a la esquina superior derecha para dejarle el lugar.
        const lo = pl
          ? { x: G.W - G.M - 1.7, y: 0.5, w: 1.7, h: 0.85, sizing: { type: 'contain', w: 1.7, h: 0.85 } }
          : { x: G.W - 2.6, y: 2.6, w: 1.7, h: 0.85, sizing: { type: 'contain', w: 1.7, h: 0.85 } };
        if (logo.path) lo.path = logo.path;
        if (logo.data) lo.data = logo.data;
        s.addImage(lo);
      }
      const credits = [];
      const people = Array.isArray(presenter) ? presenter.join('\n') : presenter;
      if (presenter) credits.push({ label: presenterLabel, value: people, x: 8.05, w: 2.9 });
      if (date) credits.push({ label: dateLabel, value: date, x: 11.1, w: 1.9 });
      placeIll(s, pl, { right: G.W - G.M, bottom: bandY });
      credits.forEach((c) => {
        s.addText([
          { text: c.label, options: { color: C.paper, breakLine: true } },
          { text: c.value, options: { color: C.paper, bold: true, fontSize: 15 } },
        ], {
          x: c.x, y: 5.65, w: c.w, h: 0.9,
          fontFace: B, fontSize: 11.5, margin: 0, valign: 'top', lineSpacingMultiple: 1.35,
        });
      });
      return s;
    },

    /** Agenda: panel negro a la izquierda, índice numerado a la derecha. */
    agenda({ title: t = 'Agenda', items = [], notes }) {
      const s = newSlide(C.paper, notes);
      s.addShape(pres.ShapeType.rect, {
        x: 0, y: 0, w: 6.1, h: G.H,
        fill: { color: C.ink }, line: { color: C.ink, width: 0 },
      });
      s.addText(t, {
        x: 0.85, y: 3.05, w: 4.8, h: 1.0,
        fontFace: D, fontSize: 46, bold: true, color: C.paper, charSpacing: -1,
        margin: 0, valign: 'middle',
      });
      const n = items.length || 1;
      const step = Math.min(0.62, 5.2 / n);
      const startY = (G.H - step * n) / 2;
      items.forEach((it, i) => {
        const num = String(i + 1).padStart(2, '0');
        s.addText([
          { text: `${num}. `, options: { color: C.ink } },
          { text: it, options: { color: C.ink } },
        ], {
          x: 7.0, y: startY + step * i, w: 5.6, h: step,
          fontFace: B, fontSize: 17, margin: 0, valign: 'middle',
        });
      });
      return s;
    },

    /** Divisor de sección: negro a sangre, número + título, subtemas abajo. */
    section({ number, title: t, items = [], notes }) {
      const s = newSlide(C.ink, notes);
      if (number) {
        s.addText(String(number), {
          x: G.M, y: 3.05, w: 4, h: 0.45,
          fontFace: B, fontSize: 20, color: C.paper, margin: 0, valign: 'middle',
        });
      }
      s.addText(t, {
        x: G.M, y: 3.5, w: G.contentW, h: 1.0,
        fontFace: D, fontSize: S.sectionTitle, bold: true, color: C.paper,
        charSpacing: -1, margin: 0, valign: 'middle',
      });
      if (items.length) {
        const runs = [];
        items.forEach((it, i) => {
          if (i > 0) runs.push({ text: '  |  ', options: { color: C.muted } });
          runs.push({ text: it, options: { color: C.hint } });
        });
        s.addText(runs, {
          x: G.M, y: G.H - 0.95, w: G.contentW, h: 0.3,
          fontFace: B, fontSize: 12.5, margin: 0, valign: 'middle',
        });
      }
      return s;
    },

    /**
     * Statement: una idea sola en el slide.
     * theme: 'ink' (negro, con barra de acento) | 'mint' | 'paper'
     */
    statement({ eyebrow: eb, text, support, theme = 'ink', breadcrumb: bc, illustration, notes }) {
      const bg = theme === 'ink' ? C.ink : theme === 'mint' ? C.mint : C.paper;
      const dark = isDark(bg, C);
      const s = newSlide(bg, notes);
      if (bc) breadcrumb(s, bc, dark);
      const textColor = dark ? C.paper : C.ink;
      if (theme === 'ink') {
        if (eb) {
          s.addText(eb, {
            x: G.M, y: 2.75, w: 8, h: 0.3,
            fontFace: B, fontSize: 12.5, color: C.hint, margin: 0, valign: 'middle',
          });
        }
        s.addShape(pres.ShapeType.rect, {
          x: G.M, y: 3.25, w: 0.045, h: 1.35,
          fill: { color: C.accent }, line: { color: C.accent, width: 0 },
        });
        s.addText(rich(text, { color: textColor, bold: true }), {
          x: G.M + 0.42, y: 3.15, w: 8.6, h: 1.6,
          fontFace: D, fontSize: S.statement - 2, charSpacing: -0.4,
          margin: 0, valign: 'middle', lineSpacingMultiple: 1.15,
        });
      } else {
        // Spot al costado, solo en mint y paper: en ink no va.
        const pl = planIll(illustration, { allowed: ['m', 'l'] });
        const off = pl ? pl.w + ILL_GAP : 0;
        const tx = pl && pl.side === 'left' ? G.M + off : G.M;
        const tw = pl ? Math.min(10.8, G.contentW - off) : 10.8;
        s.addText(rich(text, { color: textColor, bold: true }), {
          x: tx, y: 2.5, w: tw, h: 1.8,
          fontFace: D, fontSize: S.statement, charSpacing: -0.6,
          margin: 0, valign: 'middle', lineSpacingMultiple: 1.15,
        });
        if (support) {
          s.addText(paragraphs(Array.isArray(support) ? support : [support], { color: dark ? C.hint : C.body }), {
            x: tx, y: 4.45, w: pl ? Math.min(9.6, tw) : 9.6, h: 1.4,
            fontFace: B, fontSize: 13.5, margin: 0, valign: 'top', lineSpacingMultiple: 1.3,
          });
        }
        // El spot se centra en el alto del statement (o del statement más su bajada).
        const bottom = (support ? 3.75 : 3.4) + (pl ? pl.h / 2 : 0);
        if (pl) placeIll(s, pl, pl.side === 'left' ? { x: G.M, bottom } : { right: G.W - G.M, bottom });
      }
      return s;
    },

    /** Texto a la izquierda, imagen a la derecha (o al revés). */
    textImage({ breadcrumb: bc, title: t, body = [], image, imageSide = 'right', source: src, notes }) {
      const s = newSlide(C.paper, notes);
      breadcrumb(s, bc);
      const colW = 6.0;
      const imgW = 4.6;
      const textX = imageSide === 'right' ? G.M : G.W - G.M - colW;
      const imgX = imageSide === 'right' ? G.W - G.M - imgW : G.M;
      // El título va en la misma columna que el texto y baja de cuerpo si es largo;
      // el cuerpo arranca debajo del alto real del título.
      const tlen = typeof t === 'string' ? t.length : (t || []).map((p) => (typeof p === 'string' ? p : p.t || '')).join('').length;
      const tSize = tlen > 80 ? 26 : tlen > 48 ? 30 : S.title;
      const perLine = Math.max(1, Math.floor((colW * 72 * 1.9) / tSize));
      const tLines = Math.max(1, Math.ceil(tlen / perLine));
      const tH = (tSize / 72) * 1.05 * 1.2 * tLines + 0.05;
      title(s, t, { x: textX, w: colW, size: tSize, h: tH });
      const bodyY = Math.max(2.05, G.yTitle + tH + 0.3);
      s.addText(paragraphs(body, { color: C.body }, 12), {
        x: textX, y: bodyY, w: colW, h: Math.max(1.5, 5.95 - bodyY),
        fontFace: B, fontSize: 13, margin: 0, valign: 'top', lineSpacingMultiple: 1.35,
      });
      addImageOrBlock(s, image, { x: imgX, y: 1.35, w: imgW, h: 4.6 });
      source(s, src);
      return s;
    },

    /** Fila de tarjetas con etiqueta versalita (2 a 4). */
    cards({ breadcrumb: bc, title: t, lede: ld, cards: items = [], source: src, illustration, notes }) {
      const s = newSlide(C.paper, notes);
      breadcrumb(s, bc);
      if (t) title(s, t);
      let y = t ? 1.95 : 1.3;
      if (ld) { lede(s, ld, { y }); y += 0.85; } else if (t) { y += 0.15; }
      const n = items.length || 1;
      const gap = G.gap;
      const w = (G.contentW - gap * (n - 1)) / n;
      const h = Math.min(3.85, G.H - y - 0.85);
      // Avatar en la tarjeta del actor (illustration.card): arriba, antes de la etiqueta.
      const pl = planIll(illustration, { allowed: ['s'], maxW: 0.95 });
      let av = null, ci = -1;
      if (pl) {
        const k = Math.min(0.95 / pl.w, 0.95 / pl.h);
        av = { ...pl, w: pl.w * k, h: pl.h * k };
        ci = Math.min(Math.max(0, illustration.card || 0), n - 1);
      }
      items.forEach((it, i) => {
        const x = G.M + (w + gap) * i;
        const fill = it.fill || (it.dark === true ? C.accentDeep : C.surface);
        const dark = isDark(fill, C) || fill === C.accentDeep;
        card(s, { x, y, w, h, fill });
        const pad = 0.28;
        let iy = y + pad;
        // Con avatar, todas las tarjetas bajan su contenido igual, para que las etiquetas queden alineadas.
        if (av) {
          if (i === ci && !dark) placeIll(s, av, { x: x + pad, bottom: iy + av.h });
          iy += av.h + 0.18;
        }
        if (it.eyebrow) {
          eyebrow(s, it.eyebrow, { x: x + pad, y: iy, w: w - pad * 2, color: dark ? C.accent : C.label });
          iy += 0.42;
        }
        if (it.title) {
          s.addText(it.title, {
            x: x + pad, y: iy, w: w - pad * 2, h: 0.6,
            fontFace: D, fontSize: S.cardTitle, bold: true,
            color: dark ? C.paper : C.ink, margin: 0, valign: 'top', lineSpacingMultiple: 1.1,
          });
          iy += 0.68;
        }
        const bodyItems = Array.isArray(it.body) ? it.body : it.body ? [it.body] : [];
        if (bodyItems.length) {
          s.addText(paragraphs(bodyItems, { color: dark ? C.mint : C.muted }, 9), {
            x: x + pad, y: iy, w: w - pad * 2, h: y + h - iy - pad,
            fontFace: B, fontSize: 11.5, margin: 0, valign: 'top', lineSpacingMultiple: 1.3,
          });
        }
      });
      source(s, src);
      return s;
    },

    /** Tarjetas numeradas con filete de acento arriba (método, pasos, ejes). */
    steps({ breadcrumb: bc, title: t, lede: ld, steps: items = [], source: src, illustration, notes }) {
      const s = newSlide(C.paper, notes);
      breadcrumb(s, bc);
      if (t) title(s, t);
      let y = t ? 2.15 : 1.3;
      if (ld) { lede(s, ld, { y: y - 0.25 }); y += 0.5; }
      const n = items.length || 1;
      const gap = 0.28;
      const w = (G.contentW - gap * (n - 1)) / n;
      const h = Math.min(3.7, G.H - y - 0.85);
      // Spot dentro de la tarjeta del paso crítico (illustration.step), apoyado en su borde inferior.
      const pl = planIll(illustration, { allowed: ['s'], maxW: w - 0.52 });
      const si = pl ? Math.min(Math.max(0, illustration.step || 0), n - 1) : -1;
      items.forEach((it, i) => {
        const x = G.M + (w + gap) * i;
        card(s, { x, y, w, h, fill: C.surface });
        s.addShape(pres.ShapeType.rect, {
          x, y: y - 0.035, w, h: 0.035,
          fill: { color: C.accent }, line: { color: C.accent, width: 0 },
        });
        const pad = 0.26;
        s.addText(it.number || String(i + 1).padStart(2, '0'), {
          x: x + pad, y: y + pad, w: w - pad * 2, h: 0.4,
          fontFace: D, fontSize: 19, bold: true, color: C.label, margin: 0, valign: 'middle',
        });
        s.addText(it.title || '', {
          x: x + pad, y: y + pad + 0.45, w: w - pad * 2, h: 0.8,
          fontFace: D, fontSize: 15, bold: true, color: C.ink,
          margin: 0, valign: 'top', lineSpacingMultiple: 1.1,
        });
        const bodyItems = Array.isArray(it.body) ? it.body : it.body ? [it.body] : [];
        if (bodyItems.length) {
          s.addText(paragraphs(bodyItems, { color: C.muted }, 8), {
            x: x + pad, y: y + pad + 1.3, w: w - pad * 2, h: h - pad * 2 - 1.3 - (i === si ? pl.h + 0.2 : 0),
            fontFace: B, fontSize: 11, margin: 0, valign: 'top', lineSpacingMultiple: 1.3,
          });
        }
        if (i === si) placeIll(s, pl, pl.side === 'left' ? { x: x + pad, bottom: y + h - pad } : { right: x + w - pad, bottom: y + h - pad });
      });
      source(s, src);
      return s;
    },

    /** Fila de cifras grandes con su etiqueta. */
    stats({ breadcrumb: bc, title: t, lede: ld, stats: items = [], source: src, illustration, notes }) {
      const s = newSlide(C.paper, notes);
      breadcrumb(s, bc);
      if (t) title(s, t);
      if (ld) lede(s, ld, { y: 2.0 });
      const n = items.length || 1;
      const gap = 0.4;
      const y = ld ? 3.3 : 2.9;
      // Spot al costado de la fila de cifras, con la base en el final de las etiquetas.
      const pl = planIll(illustration, { allowed: ['m', 's'] });
      const off = pl ? pl.w + ILL_GAP : 0;
      const x0 = pl && pl.side === 'left' ? G.M + off : G.M;
      const w = (G.contentW - off - gap * (n - 1)) / n;
      if (pl) placeIll(s, pl, pl.side === 'left' ? { x: G.M, bottom: y + 2.25 } : { right: G.W - G.M, bottom: y + 2.25 });
      items.forEach((it, i) => {
        const x = x0 + (w + gap) * i;
        s.addText(String(it.value), {
          x, y, w, h: 1.1,
          fontFace: D, fontSize: it.size || 46, bold: true,
          color: it.accent ? C.accent : C.ink, charSpacing: -1,
          margin: 0, valign: 'middle',
        });
        s.addText(rich(it.label, { color: C.muted }), {
          x, y: y + 1.15, w, h: 1.1,
          fontFace: B, fontSize: 12, margin: 0, valign: 'top', lineSpacingMultiple: 1.3,
        });
      });
      source(s, src);
      return s;
    },

    /** Un dato grande a la izquierda + lectura del dato y cita a la derecha. */
    bigStat({ breadcrumb: bc, value, caption, body = [], quote, author, source: src, illustration, notes }) {
      const s = newSlide(C.paper, notes);
      breadcrumb(s, bc);
      s.addText(String(value), {
        x: G.M, y: 1.5, w: 4.6, h: 1.6,
        fontFace: D, fontSize: 90, bold: true, color: C.accent, charSpacing: -3,
        margin: 0, valign: 'middle',
      });
      if (caption) {
        s.addText(rich(caption, { color: C.ink }), {
          x: G.M, y: 3.15, w: 4.6, h: 1.2,
          fontFace: B, fontSize: 14, margin: 0, valign: 'top', lineSpacingMultiple: 1.3,
        });
      }
      if (body.length) {
        s.addText(paragraphs(body, { color: C.body }, 11), {
          x: 6.4, y: 1.5, w: 6.0, h: 3.2,
          fontFace: B, fontSize: 13, margin: 0, valign: 'top', lineSpacingMultiple: 1.35,
        });
      }
      // Spot en la columna de la cifra, debajo de la bajada, apoyado en la base del contenido.
      const pl = planIll(illustration, { allowed: ['m', 's'], maxW: 4.6 });
      if (pl) placeIll(s, pl, pl.side === 'left' ? { x: G.M, bottom: 6.4 } : { right: G.M + 4.6, bottom: 6.4 });
      if (quote) {
        card(s, { x: 6.4, y: 4.9, w: 6.0, h: 1.5 });
        s.addText(`“${quote}”`, {
          x: 6.66, y: 5.05, w: 5.5, h: 0.75,
          fontFace: B, fontSize: 12.5, italic: true, color: C.ink,
          margin: 0, valign: 'top', lineSpacingMultiple: 1.25,
        });
        if (author) {
          eyebrow(s, author, { x: 6.66, y: 5.95, w: 5.5 });
        }
      }
      source(s, src);
      return s;
    },

    /** Ficha de benchmark: imagen + descripción + qué nos enseña (índigo profundo). */
    caseStudy({ breadcrumb: bc, name, meta, image, description, howTitle = '¿Cómo funciona?', how = [], learnTitle = 'Qué nos enseña', learn = [], notes }) {
      const s = newSlide(C.paper, notes);
      breadcrumb(s, bc);
      s.addText(name, {
        x: G.M, y: G.yTitle, w: G.contentW, h: 0.62,
        fontFace: D, fontSize: 34, bold: true, color: C.ink, charSpacing: -0.8,
        margin: 0, valign: 'middle',
      });
      if (meta) {
        eyebrow(s, Array.isArray(meta) ? meta.join('  |  ') : meta, { x: G.M, y: 1.58, w: G.contentW });
      }
      const y = 2.1;
      const h = 4.35;
      addImageOrBlock(s, image, { x: G.M, y, w: 3.35, h });
      // Columna de descripción
      const cx = 4.55;
      const cw = 3.6;
      card(s, { x: cx, y, w: cw, h });
      const pad = 0.28;
      let iy = y + pad;
      if (description) {
        s.addText(rich(description, { color: C.ink }), {
          x: cx + pad, y: iy, w: cw - pad * 2, h: 1.5,
          fontFace: B, fontSize: 13, margin: 0, valign: 'top', lineSpacingMultiple: 1.3,
        });
        iy += 1.6;
      }
      if (how.length) {
        eyebrow(s, howTitle, { x: cx + pad, y: iy, w: cw - pad * 2 });
        iy += 0.34;
        s.addText(how.map((it, i) => ({
          text: it,
          options: { bullet: true, breakLine: i !== how.length - 1, paraSpaceAfter: 6, color: C.body },
        })), {
          x: cx + pad, y: iy, w: cw - pad * 2, h: y + h - iy - pad,
          fontFace: B, fontSize: 11, margin: 0, valign: 'top', lineSpacingMultiple: 1.2,
        });
      }
      // Columna de aprendizaje
      const lx = 8.45;
      const lw = G.W - G.M - lx;
      card(s, { x: lx, y, w: lw, h, fill: C.accentDeep });
      eyebrow(s, learnTitle, { x: lx + pad, y: y + pad, w: lw - pad * 2, color: C.accent });
      s.addText(paragraphs(learn, { color: C.paper }, 10), {
        x: lx + pad, y: y + pad + 0.4, w: lw - pad * 2, h: h - pad * 2 - 0.4,
        fontFace: B, fontSize: 12, margin: 0, valign: 'top', lineSpacingMultiple: 1.3,
      });
      return s;
    },

    /** Hallazgo: título-afirmación + bloques etiquetados (observación / recomendación). */
    finding({ breadcrumb: bc, title: t, blocks = [], source: src, illustration, notes }) {
      const s = newSlide(C.paper, notes);
      breadcrumb(s, bc);
      s.addText(rich(t, { color: C.ink, bold: true }), {
        x: G.M, y: 1.15, w: 10.6, h: 1.5,
        fontFace: D, fontSize: 27, charSpacing: -0.5,
        margin: 0, valign: 'top', lineSpacingMultiple: 1.15,
      });
      s.addShape(pres.ShapeType.rect, {
        x: G.M, y: 3.15, w: G.contentW, h: 0.012,
        fill: { color: C.line }, line: { color: C.line, width: 0 },
      });
      const n = blocks.length || 1;
      const gap = 0.6;
      // Spot en una columna propia debajo del filete, del lado elegido; los bloques ocupan el resto.
      const pl = planIll(illustration, { allowed: ['m', 's', 'l'] });
      const off = pl ? pl.w + ILL_GAP : 0;
      const x0 = pl && pl.side === 'left' ? G.M + off : G.M;
      const w = (G.contentW - off - gap * (n - 1)) / n;
      if (pl) placeIll(s, pl, pl.side === 'left' ? { x: G.M, bottom: 6.4 } : { right: G.W - G.M, bottom: 6.4 });
      blocks.forEach((b, i) => {
        const x = x0 + (w + gap) * i;
        eyebrow(s, b.label, { x, y: 3.45, w });
        s.addText(paragraphs(Array.isArray(b.text) ? b.text : [b.text], { color: C.body }, 10), {
          x, y: 3.85, w, h: 2.4,
          fontFace: B, fontSize: 12.5, margin: 0, valign: 'top', lineSpacingMultiple: 1.35,
        });
      });
      source(s, src);
      return s;
    },

    /** Matriz 2×2 con leyenda a la izquierda y banda de conclusión abajo. */
    matrix({ breadcrumb: bc, title: t, legend = [], points = [], axisX = ['- Complejidad', '+ Complejidad'], axisY = ['+ Valor', '- Valor'], banner, notes }) {
      const s = newSlide(C.paper, notes);
      breadcrumb(s, bc);
      if (t) title(s, t);
      // Leyenda
      const ly = 2.35;
      legend.forEach((it, i) => {
        s.addText([
          { text: `${i + 1}) `, options: { bold: true, color: C.ink } },
          { text: it.title ? `${it.title} ` : '', options: { bold: true, color: C.ink } },
          { text: it.note || '', options: { color: C.muted } },
        ], {
          x: G.M, y: ly + i * 0.58, w: 5.0, h: 0.55,
          fontFace: B, fontSize: 12, margin: 0, valign: 'top', lineSpacingMultiple: 1.25,
        });
      });
      // Cuadrante
      const qx = 6.5;
      const qy = 2.05;
      const qw = 5.9;
      const qh = 3.5;
      [0, 1].forEach((r) => [0, 1].forEach((c) => {
        s.addShape(pres.ShapeType.rect, {
          x: qx + (qw / 2) * c, y: qy + (qh / 2) * r, w: qw / 2, h: qh / 2,
          fill: { color: C.paper }, line: { color: C.line, width: 1, dashType: 'dash' },
        });
      }));
      s.addText(axisY[0], { x: qx - 0.62, y: qy, w: 0.5, h: qh / 2, fontFace: B, fontSize: 8.5, color: C.muted, rotate: 270, align: 'center', valign: 'middle', margin: 0 });
      s.addText(axisY[1], { x: qx - 0.62, y: qy + qh / 2, w: 0.5, h: qh / 2, fontFace: B, fontSize: 8.5, color: C.muted, rotate: 270, align: 'center', valign: 'middle', margin: 0 });
      s.addText(axisX[0], { x: qx + 0.08, y: qy + qh - 0.3, w: 2.2, h: 0.25, fontFace: B, fontSize: 8.5, bold: true, color: C.muted, margin: 0, valign: 'middle' });
      s.addText(axisX[1], { x: qx + qw - 2.28, y: qy + qh - 0.3, w: 2.2, h: 0.25, fontFace: B, fontSize: 8.5, bold: true, color: C.muted, align: 'right', margin: 0, valign: 'middle' });
      points.forEach((p) => {
        const d = 0.42;
        const cx = qx + qw * p.x - d / 2;
        const cy = qy + qh * (1 - p.y) - d / 2;
        s.addShape(pres.ShapeType.ellipse, {
          x: cx, y: cy, w: d, h: d,
          fill: { color: p.highlight ? C.accent : C.ink }, line: { color: p.highlight ? C.accent : C.ink, width: 0 },
        });
        s.addText(String(p.n), {
          x: cx, y: cy, w: d, h: d,
          fontFace: B, fontSize: 11, bold: true, color: p.highlight ? C.ink : C.paper,
          align: 'center', valign: 'middle', margin: 0,
        });
      });
      if (banner) {
        s.addShape(pres.ShapeType.rect, {
          x: G.M, y: 6.25, w: G.contentW, h: 0.72,
          fill: { color: C.mintBand }, line: { color: C.mintBand, width: 0 },
        });
        s.addText(rich(banner, { color: C.ink }), {
          x: G.M + 0.35, y: 6.25, w: G.contentW - 0.7, h: 0.72,
          fontFace: B, fontSize: 12, align: 'center', valign: 'middle', margin: 0,
        });
      }
      return s;
    },

    /** Flujos horizontales: uno o dos recorridos de pasos encadenados. */
    flow({ breadcrumb: bc, title: t, lede: ld, flows = [], notes }) {
      const s = newSlide(C.paper, notes);
      breadcrumb(s, bc);
      if (t) title(s, t);
      if (ld) lede(s, ld, { y: 1.9 });
      let y = ld ? 2.65 : 2.2;
      flows.forEach((f) => {
        const rows = [];
        const per = f.steps.length > 7 ? Math.ceil(f.steps.length / 2) : f.steps.length;
        for (let i = 0; i < f.steps.length; i += per) rows.push(f.steps.slice(i, i + per));
        const arrowW = 0.28;
        const stepW = (G.contentW - arrowW * (per - 1)) / per;
        // Encabezado del flujo
        s.addText([
          { text: f.label ? `${f.label}  ` : '', options: { bold: true, color: C.ink } },
          { text: f.tag || '', options: { color: C.label, bold: true } },
        ], {
          x: G.M, y, w: G.contentW, h: 0.32,
          fontFace: B, fontSize: 12.5, margin: 0, valign: 'middle',
        });
        y += 0.42;
        rows.forEach((row) => {
          const n = row.length;
          const arrow = arrowW;
          const w = stepW;
          row.forEach((st, i) => {
            const x = G.M + (w + arrow) * i;
            card(s, { x, y, w, h: 0.85 });
            s.addText(st, {
              x: x + 0.12, y, w: w - 0.24, h: 0.85,
              fontFace: B, fontSize: 10.5, color: C.body,
              align: 'center', valign: 'middle', margin: 0, lineSpacingMultiple: 1.15,
            });
            if (i < n - 1) {
              s.addText('→', {
                x: x + w, y, w: arrow, h: 0.85,
                fontFace: B, fontSize: 13, color: C.accent,
                align: 'center', valign: 'middle', margin: 0,
              });
            }
          });
          y += 1.0;
        });
        y += 0.35;
      });
      return s;
    },

    /** Cierre: negro, mensaje y quién presenta. */
    closing({ text = '¡Gracias!', name, role, photo, illustration, notes }) {
      const s = newSlide(C.ink, notes);
      s.addText(rich(text, { color: C.paper, bold: true }), {
        x: 1.5, y: 2.35, w: G.W - 3.0, h: 1.2,
        fontFace: D, fontSize: 26, align: 'center', valign: 'middle',
        margin: 0, lineSpacingMultiple: 1.2,
      });
      // Sobre negro, el spot solo va dentro de un círculo claro, en el lugar de la foto.
      const pl = !photo ? planIll(illustration, { allowed: ['s'], maxW: 0.95 }) : null;
      if (pl) {
        const d = 1.3, cx = (G.W - d) / 2, cy = 3.95;
        s.addShape(pres.ShapeType.ellipse, { x: cx, y: cy, w: d, h: d, fill: { color: C.mint }, line: { color: C.mint, width: 0 } });
        const k = Math.min(0.95 / pl.w, 0.95 / pl.h);
        const w = pl.w * k, h = pl.h * k;
        placeIll(s, { ...pl, w, h }, { x: (G.W - w) / 2, bottom: cy + (d + h) / 2 });
        photo = { illustrated: true };
      }
      if (photo && (photo.path || photo.data)) {
        const o = { x: (G.W - 1.1) / 2, y: 4.1, w: 1.1, h: 1.1, rounding: true };
        if (photo.path) o.path = photo.path;
        if (photo.data) o.data = photo.data;
        s.addImage(o);
      }
      if (name) {
        s.addText(name, {
          x: 3, y: photo ? 5.35 : 4.3, w: G.W - 6, h: 0.4,
          fontFace: B, fontSize: 17, color: C.paper, align: 'center', valign: 'middle', margin: 0,
        });
      }
      if (role) {
        s.addText(role, {
          x: 3, y: photo ? 5.72 : 4.68, w: G.W - 6, h: 0.32,
          fontFace: B, fontSize: 12, color: C.hint, align: 'center', valign: 'middle', margin: 0,
        });
      }
      return s;
    },


    /** Ejes / pilares: 2 a 4 columnas de texto sin tarjeta, con filete de acento. */
    pillars({ breadcrumb: bc, title: t, lede: ld, pillars: items = [], source: src, notes }) {
      const s = newSlide(C.paper, notes);
      breadcrumb(s, bc);
      if (t) title(s, t);
      let y = t ? 2.0 : 1.3;
      if (ld) { lede(s, ld, { y }); y += 0.8; }
      const n = items.length || 1;
      const gap = 0.55;
      const w = (G.contentW - gap * (n - 1)) / n;
      items.forEach((it, i) => {
        const x = G.M + (w + gap) * i;
        s.addShape(pres.ShapeType.rect, {
          x, y, w: 0.6, h: 0.035,
          fill: { color: C.accent }, line: { color: C.accent, width: 0 },
        });
        s.addText(it.title || '', {
          x, y: y + 0.2, w, h: 0.55,
          fontFace: D, fontSize: 17, bold: true, color: C.ink,
          margin: 0, valign: 'top', lineSpacingMultiple: 1.1,
        });
        s.addText(paragraphs(Array.isArray(it.body) ? it.body : [it.body], { color: C.muted }, 9), {
          x, y: y + 0.85, w, h: G.H - y - 1.6,
          fontFace: B, fontSize: 12, margin: 0, valign: 'top', lineSpacingMultiple: 1.35,
        });
      });
      source(s, src);
      return s;
    },

    /**
     * Recorrido E2E: bandas de momento arriba, etapas numeradas sobre una línea.
     * moments: [{ label, span }]  span = cuántas etapas cubre.
     */
    journey({ breadcrumb: bc, title: t, moments = [], stages = [], footnote, notes }) {
      const s = newSlide(C.paper, notes);
      breadcrumb(s, bc);
      if (t) title(s, t);
      const n = stages.length || 1;
      const colW = G.contentW / n;
      const yBand = 2.75;
      const yLine = 3.75;
      s.addText('Momento', { x: 0.28, y: yBand, w: 0.6, h: 0.36, fontFace: B, fontSize: 9, bold: true, color: C.ink, margin: 0, valign: 'middle' });
      s.addText('Etapa', { x: 0.28, y: yLine - 0.18, w: 0.6, h: 0.36, fontFace: B, fontSize: 9, bold: true, color: C.ink, margin: 0, valign: 'middle' });
      let idx = 0;
      moments.forEach((m, i) => {
        const span = m.span || 1;
        const x = G.M + colW * idx + 0.08;
        const w = colW * span - 0.16;
        // Tintes de claro a oscuro para cualquier cantidad de momentos; el último en índigo profundo.
        const nm = moments.length;
        const shade = i === nm - 1 && nm > 1 ? 0 : nm > 1 ? 0.6 - (0.6 * i) / (nm - 1) : 0.55;
        const fill = shade > 0 ? tint(C.accent, shade) : C.accentDeep;
        s.addShape(pres.ShapeType.roundRect, {
          x, y: yBand, w, h: 0.42, rectRadius: 0.21,
          fill: { color: fill }, line: { color: fill, width: 0 },
        });
        s.addText(String(m.label).toUpperCase(), {
          x, y: yBand, w, h: 0.42,
          fontFace: B, fontSize: 11, bold: true, color: shade > 0 ? C.ink : C.paper,
          align: 'center', valign: 'middle', margin: 0,
        });
        idx += span;
      });
      s.addShape(pres.ShapeType.rect, {
        x: G.M + 0.2, y: yLine + 0.19, w: G.contentW - 0.4, h: 0.008,
        fill: { color: C.line }, line: { color: C.line, width: 0 },
      });
      stages.forEach((st, i) => {
        const cx = G.M + colW * (i + 0.5);
        const d = 0.42;
        s.addShape(pres.ShapeType.ellipse, {
          x: cx - d / 2, y: yLine, w: d, h: d,
          fill: { color: C.accent }, line: { color: C.accent, width: 0 },
        });
        s.addText(String(st.n || i + 1), {
          x: cx - d / 2, y: yLine, w: d, h: d,
          fontFace: B, fontSize: 11, bold: true, color: C.ink,
          align: 'center', valign: 'middle', margin: 0,
        });
        s.addText(String(st.name).toUpperCase(), {
          x: cx - colW / 2 + 0.1, y: yLine + 0.55, w: colW - 0.2, h: 0.6,
          fontFace: B, fontSize: 10.5, bold: true, color: C.ink,
          align: 'center', valign: 'top', margin: 0, lineSpacingMultiple: 1.2,
        });
        if (st.meta) {
          const cw = colW - 0.5;
          card(s, { x: cx - cw / 2, y: yLine + 1.3, w: cw, h: 0.5, fill: C.surface });
          s.addText(rich(st.meta, { color: C.hint }), {
            x: cx - cw / 2, y: yLine + 1.3, w: cw, h: 0.5,
            fontFace: B, fontSize: 10, align: 'center', valign: 'middle', margin: 0,
          });
        }
      });
      if (footnote) source(s, footnote);
      return s;
    },

    /** Ficha de etapa: diagnóstico, escenario to be y chips de actores y herramientas. */
    stage({ breadcrumb: bc, number, name, diagnosis, toBe, toBeLabel = 'To be:', actors = [], tools = [], actorsLabel = 'Principales actores:', toolsLabel = 'Principales herramientas:', illustration, notes }) {
      const s = newSlide(C.paper, notes);
      breadcrumb(s, bc);
      s.addText([
        { text: number !== undefined ? `${number}  ` : '', options: { color: C.accent, bold: true } },
        { text: String(name).toUpperCase(), options: { color: C.ink, bold: true } },
      ], {
        x: G.M, y: G.yTitle, w: G.contentW, h: 0.5,
        fontFace: D, fontSize: 20, charSpacing: 0.4, margin: 0, valign: 'middle',
      });
      // Spot a la derecha del diagnóstico, apoyado sobre la tarjeta del escenario deseado.
      const pl = planIll(illustration, { allowed: ['m', 's'], sides: ['right'] });
      if (pl) placeIll(s, pl, { right: G.W - G.M, bottom: 3.3 });
      s.addText(rich(diagnosis, { color: C.ink }), {
        x: G.M, y: 1.7, w: 7.2, h: 1.5,
        fontFace: B, fontSize: 15, margin: 0, valign: 'top', lineSpacingMultiple: 1.35,
      });
      if (toBe) {
        card(s, { x: G.M, y: 3.5, w: G.contentW, h: 1.0, fill: C.surface });
        s.addText([
          { text: `${toBeLabel} `, options: { bold: true, color: C.label } },
          ...rich(toBe, { color: C.body }),
        ], {
          x: G.M + 0.3, y: 3.5, w: G.contentW - 0.6, h: 1.0,
          fontFace: B, fontSize: 12.5, margin: 0, valign: 'middle', lineSpacingMultiple: 1.3,
        });
      }
      const chipRow = (label, items, y) => {
        if (!items.length) return;
        s.addText(label, {
          x: G.M, y, w: 2.0, h: 0.34,
          fontFace: B, fontSize: 11, bold: true, color: C.ink, margin: 0, valign: 'middle',
        });
        let x = G.M + 2.05;
        items.forEach((it) => {
          const w = Math.max(0.9, 0.16 + String(it).length * 0.085);
          s.addShape(pres.ShapeType.roundRect, {
            x, y, w, h: 0.34, rectRadius: 0.17,
            fill: { color: C.surface }, line: { color: C.line, width: 1 },
          });
          s.addText(String(it), {
            x, y, w, h: 0.34,
            fontFace: B, fontSize: 10, color: C.body, align: 'center', valign: 'middle', margin: 0,
          });
          x += w + 0.14;
        });
      };
      chipRow(actorsLabel, actors, 5.0);
      chipRow(toolsLabel, tools, 5.55);
      return s;
    },

    /** Citas textuales: una o dos por slide, sin nada más que las sostenga. */
    quotes({ breadcrumb: bc, quotes: items = [], illustration, notes }) {
      const s = newSlide(C.paper, notes);
      breadcrumb(s, bc);
      const n = Math.min(items.length, 2) || 1;
      const h = 1.9;
      const startY = (G.H - (h + 0.6) * n) / 2 + 0.3;
      // Avatar junto a una cita (illustration.quote, por defecto la primera), en una columna propia.
      const pl = planIll(illustration, { allowed: ['s', 'm'] });
      const off = pl ? pl.w + ILL_GAP : 0;
      const qx = pl && pl.side === 'left' ? G.M + off : G.M;
      const qi = pl ? Math.min(Math.max(0, illustration.quote || 0), n - 1) : 0;
      if (pl) {
        const qy = startY + (h + 0.6) * qi;
        placeIll(s, pl, pl.side === 'left' ? { x: G.M, bottom: qy + h } : { right: G.W - G.M, bottom: qy + h });
      }
      items.slice(0, 2).forEach((q, i) => {
        const y = startY + (h + 0.6) * i;
        s.addShape(pres.ShapeType.rect, {
          x: qx, y, w: 0.045, h,
          fill: { color: C.accent }, line: { color: C.accent, width: 0 },
        });
        s.addText(`“${q.text}”`, {
          x: qx + 0.42, y, w: G.contentW - 0.9 - off, h,
          fontFace: D, fontSize: 19, bold: true, color: C.ink,
          margin: 0, valign: 'middle', lineSpacingMultiple: 1.25,
        });
        if (q.author) {
          s.addText(String(q.author).toUpperCase(), {
            x: qx + 0.42, y: y + h, w: G.contentW - 0.9 - off, h: 0.28,
            fontFace: B, fontSize: 10, bold: true, charSpacing: 0.6, color: C.label,
            margin: 0, valign: 'middle',
          });
        }
      });
      return s;
    },

    /**
     * Dolores y oportunidades de una etapa, enfrentados en dos columnas.
     * pains: [{ text, level }]  |  opportunities: [{ text, tags: [] }]
     */
    painsOpportunities({ breadcrumb: bc, number, name, pains = [], opportunities = [], painsLabel = 'Puntos de dolor', oppsLabel = 'Oportunidades', notes }) {
      const s = newSlide(C.paper, notes);
      breadcrumb(s, bc);
      if (name) {
        s.addText([
          { text: number !== undefined ? `${number}  ` : '', options: { color: C.accent, bold: true } },
          { text: String(name).toUpperCase(), options: { color: C.ink, bold: true } },
        ], {
          x: G.M, y: G.yTitle, w: G.contentW, h: 0.45,
          fontFace: D, fontSize: 18, charSpacing: 0.4, margin: 0, valign: 'middle',
        });
      }
      const y0 = name ? 1.6 : 1.15;
      const colW = (G.contentW - 0.7) / 2;
      const cols = [
        { label: painsLabel, items: pains, x: G.M, kind: 'pain' },
        { label: oppsLabel, items: opportunities, x: G.M + colW + 0.7, kind: 'opp' },
      ];
      cols.forEach((col) => {
        eyebrow(s, col.label, { x: col.x, y: y0, w: colW });
        const n = col.items.length || 1;
        const rowH = Math.min(1.05, (G.H - y0 - 1.0) / n);
        col.items.forEach((it, i) => {
          const y = y0 + 0.4 + rowH * i;
          const tagW = 1.15;
          s.addText(rich(it.text, { color: C.body }), {
            x: col.x, y, w: colW - tagW - 0.15, h: rowH - 0.12,
            fontFace: B, fontSize: 10.5, margin: 0, valign: 'top', lineSpacingMultiple: 1.25,
          });
          const marks = col.kind === 'pain' ? (it.level ? [it.level] : []) : (it.tags || []);
          marks.slice(0, 3).forEach((m, k) => {
            const my = y + k * 0.3;
            s.addText(String(m), {
              x: col.x + colW - tagW, y: my, w: tagW, h: 0.26,
              fontFace: B, fontSize: 9, bold: true, color: k === 0 ? C.label : C.hint,
              align: 'right', valign: 'middle', margin: 0,
            });
          });
        });
      });
      return s;
    },

    /** Anexo o material enlazado: título a la izquierda, miniatura a la derecha. */
    linkCard({ breadcrumb: bc, kicker, title: t, linkText = 'Clickear para acceder al material', url, image, notes }) {
      const s = newSlide(C.paper, notes);
      breadcrumb(s, bc);
      if (kicker) {
        s.addText(kicker, {
          x: G.M, y: 2.85, w: 4.6, h: 0.3,
          fontFace: B, fontSize: 12.5, color: C.muted, margin: 0, valign: 'middle',
        });
      }
      s.addText(t, {
        x: G.M, y: 3.2, w: 4.6, h: 1.0,
        fontFace: D, fontSize: 24, bold: true, color: C.ink,
        margin: 0, valign: 'top', lineSpacingMultiple: 1.15,
      });
      const linkOpts = {
        x: G.M, y: 4.35, w: 4.6, h: 0.34,
        fontFace: B, fontSize: 12, color: C.ink, underline: true, margin: 0, valign: 'middle',
      };
      if (url) linkOpts.hyperlink = { url };
      s.addText(linkText, linkOpts);
      s.addShape(pres.ShapeType.rect, {
        x: 6.0, y: 0, w: 0.012, h: G.H,
        fill: { color: C.ink }, line: { color: C.ink, width: 0 },
      });
      addImageOrBlock(s, image, { x: 6.9, y: 1.9, w: 5.5, h: 3.1 });
      return s;
    },

    /**
     * Voz externa: un posteo, reseña o mensaje real que valida el dolor antes de proponer.
     * post: { channel, author, text, meta }  |  takeaway: la lectura en una frase.
     */
    voice({ breadcrumb: bc, post = {}, takeaway, support, source: src, illustration, notes }) {
      const s = newSlide(C.paper, notes);
      breadcrumb(s, bc);
      const x = G.M, y = 1.35, w = 6.6, h = 4.6;
      s.addShape(pres.ShapeType.roundRect, {
        x, y, w, h, rectRadius: 0.08,
        fill: { color: C.paper }, line: { color: C.line, width: 1.25 },
      });
      // Con ilustración, el avatar del autor es el spot (un busto en círculo).
      const pl = planIll(illustration, { allowed: ['s'], maxW: 0.75 });
      if (pl) {
        const k = Math.min(0.75 / pl.w, 0.75 / pl.h);
        placeIll(s, { ...pl, w: pl.w * k, h: pl.h * k }, { x: x + 0.3, bottom: y + 0.3 + pl.h * k });
      } else {
        s.addShape(pres.ShapeType.ellipse, { x: x + 0.4, y: y + 0.4, w: 0.55, h: 0.55, fill: { color: C.surface }, line: { color: C.line, width: 1 } });
      }
      s.addText([
        { text: post.author || 'Usuario', options: { bold: true, color: C.ink, breakLine: true } },
        { text: post.channel || '', options: { color: C.hint } },
      ], { x: x + 1.1, y: y + 0.36, w: w - 1.5, h: 0.62, fontFace: B, fontSize: 12, margin: 0, valign: 'middle' });
      s.addText(post.text || '', {
        x: x + 0.4, y: y + 1.25, w: w - 0.8, h: h - 2.0,
        fontFace: D, fontSize: 20, bold: true, color: C.ink, margin: 0, valign: 'top', lineSpacingMultiple: 1.2,
      });
      if (post.meta) {
        s.addText(post.meta, { x: x + 0.4, y: y + h - 0.6, w: w - 0.8, h: 0.3, fontFace: B, fontSize: S.caption, color: C.hint, margin: 0 });
      }
      const rx = x + w + 0.7, rw = G.contentW - w - 0.7;
      s.addShape(pres.ShapeType.rect, { x: rx, y: y + 0.1, w: 0.045, h: 1.6, fill: { color: C.accent }, line: { color: C.accent, width: 0 } });
      s.addText(rich(takeaway || '', { color: C.ink, bold: true }), {
        x: rx + 0.35, y: y + 0.1, w: rw - 0.35, h: 1.6, fontFace: D, fontSize: 21, margin: 0, valign: 'middle', lineSpacingMultiple: 1.15,
      });
      if (support) {
        s.addText(paragraphs(Array.isArray(support) ? support : [support], { color: C.body }, 8), {
          x: rx + 0.35, y: y + 2.0, w: rw - 0.35, h: 2.4, fontFace: B, fontSize: S.body, margin: 0, valign: 'top', lineSpacingMultiple: 1.35,
        });
      }
      source(s, src);
      return s;
    },

    /**
     * Misma pantalla con anotaciones. Se repite el slide sumando anotaciones de a una o dos.
     * marks: [{ x, y, status: 'ok' | 'duda' | 'mal', text }]  (x, y entre 0 y 1 sobre la imagen)
     */
    annotatedScreen({ breadcrumb: bc, title: t, image, marks = [], frame = 'phone', labels = {}, source: src, notes }) {
      const s = newSlide(C.paper, notes);
      breadcrumb(s, bc);
      title(s, t, { size: 26, h: 0.9 });
      // frame: 'phone' (captura vertical con marco negro) o 'wide' (captura de escritorio, plano, foto o documento, al corte).
      const wide = frame === 'wide';
      const box = wide ? { x: G.M, y: 2.0, w: 6.4, h: 4.6 } : { x: G.M, y: 2.0, w: 3.1, h: 4.75 };
      if (!wide) s.addShape(pres.ShapeType.roundRect, { x: box.x - 0.12, y: box.y - 0.12, w: box.w + 0.24, h: box.h + 0.24, rectRadius: 0.12, fill: { color: C.ink }, line: { color: C.ink, width: 0 } });
      addImageOrBlock(s, image, box);
      const EST = {
        ok: { sym: '✓', fill: C.accent, color: C.ink, label: labels.ok || 'Funciona' },
        duda: { sym: '?', fill: C.paper, color: C.ink, label: labels.duda || 'Genera duda' },
        mal: { sym: '✕', fill: C.ink, color: C.paper, label: labels.mal || 'Se rompe' },
      };
      const lx = box.x + box.w + (wide ? 0.6 : 0.9), lw = G.W - G.M - lx;
      marks.slice(0, 5).forEach((m, i) => {
        const e = EST[m.status] || EST.duda;
        const cx = box.x + box.w * (m.x ?? 0.5) - 0.19, cy = box.y + box.h * (m.y ?? 0.5) - 0.19;
        s.addShape(pres.ShapeType.ellipse, { x: cx, y: cy, w: 0.38, h: 0.38, fill: { color: e.fill }, line: { color: C.ink, width: 1.25 } });
        s.addText(String(i + 1), { x: cx, y: cy, w: 0.38, h: 0.38, fontFace: B, fontSize: 11, bold: true, color: e.color, align: 'center', valign: 'middle', margin: 0 });
        const y = 2.0 + i * 0.95;
        s.addShape(pres.ShapeType.ellipse, { x: lx, y: y + 0.02, w: 0.38, h: 0.38, fill: { color: e.fill }, line: { color: C.ink, width: 1.25 } });
        s.addText(e.sym, { x: lx, y: y + 0.02, w: 0.38, h: 0.38, fontFace: B, fontSize: 12, bold: true, color: e.color, align: 'center', valign: 'middle', margin: 0 });
        s.addText([
          { text: `${i + 1}. ${e.label}`, options: { bold: true, color: C.ink, breakLine: true } },
          { text: m.text || '', options: { color: C.body } },
        ], { x: lx + 0.6, y, w: lw - 0.6, h: 0.85, fontFace: B, fontSize: S.body, margin: 0, valign: 'top', lineSpacingMultiple: 1.2 });
      });
      source(s, src);
      return s;
    },

    /**
     * Árbol de oportunidades en cuatro columnas: métrica, resultado buscado, problemas, ideas.
     * opportunities: [{ text, evidence: 'idea' | 'una' | 'dos' | 'tres', priority, linked }]
     * solutions: [{ of: índice de la oportunidad, text }]
     * Línea llena: sabemos que explica el resultado. Punteada: todavía no.
     */
    tree({ breadcrumb: bc, title: t, metric = {}, outcome = {}, opportunities = [], solutions = [], heads = ['Lo que medimos', 'Lo que queremos lograr', 'Problemas de la gente', 'Ideas para probar'], evidenceLabels = {}, priorityLabel = 'Primero', source: src, notes }) {
      const s = newSlide(C.paper, notes);
      breadcrumb(s, bc);
      title(s, t, { size: 24, h: 0.8 });
      const top = 2.05, bottom = G.H - 0.95, H = bottom - top;
      const cols = [{ x: G.M, w: 2.15 }, { x: G.M + 2.6, w: 2.55 }, { x: G.M + 5.6, w: 2.9 }, { x: G.M + 8.95, w: G.contentW - 8.95 }];
      heads.forEach((h, i) => s.addText(h, { x: cols[i].x, y: top - 0.42, w: cols[i].w, h: 0.28, fontFace: B, fontSize: S.caption, color: C.hint, margin: 0 }));
      const line = (x1, y1, x2, y2, dashed) => {
        const mx = (x1 + x2) / 2;
        const o = { color: dashed ? C.hint : C.ink, width: 1.1 };
        if (dashed) o.dashType = 'dash';
        s.addShape(pres.ShapeType.line, { x: x1, y: y1, w: mx - x1, h: 0, line: o });
        if (Math.abs(y2 - y1) > 0.01) s.addShape(pres.ShapeType.line, { x: mx, y: Math.min(y1, y2), w: 0, h: Math.abs(y2 - y1), line: o });
        s.addShape(pres.ShapeType.line, { x: mx, y: y2, w: x2 - mx, h: 0, line: o });
      };
      // métrica
      const mh = 1.7, my = top + H / 2 - mh / 2;
      s.addShape(pres.ShapeType.roundRect, { x: cols[0].x, y: my, w: cols[0].w, h: mh, rectRadius: 0.05, fill: { color: C.ink }, line: { color: C.ink, width: 0 } });
      s.addText([
        { text: metric.label || '', options: { color: C.paper, bold: true, fontSize: 11.5, breakLine: true } },
        { text: metric.value || '', options: { color: C.paper, bold: true, fontSize: 30, fontFace: D, breakLine: true } },
        { text: metric.detail || '', options: { color: C.hint, fontSize: 9 } },
      ], { x: cols[0].x + 0.18, y: my + 0.1, w: cols[0].w - 0.36, h: mh - 0.2, fontFace: B, margin: 0, valign: 'middle' });
      // resultado buscado
      const oh = 2.1, oy = top + H / 2 - oh / 2;
      s.addShape(pres.ShapeType.roundRect, { x: cols[1].x, y: oy, w: cols[1].w, h: oh, rectRadius: 0.05, fill: { color: C.paper }, line: { color: C.ink, width: 1.25 } });
      s.addText([
        { text: outcome.label || '', options: { color: C.ink, bold: true, fontSize: 12.5, breakLine: true } },
        { text: outcome.detail || '', options: { color: C.muted, fontSize: 10 } },
      ], { x: cols[1].x + 0.18, y: oy + 0.12, w: cols[1].w - 0.36, h: oh - 0.24, fontFace: B, margin: 0, valign: 'middle', lineSpacingMultiple: 1.15 });
      line(cols[0].x + cols[0].w, top + H / 2, cols[1].x, top + H / 2, false);
      // problemas
      const ops = opportunities.slice(0, 5), gap = 0.16;
      const ph = Math.min(0.95, (H - gap * (ops.length - 1)) / (ops.length || 1));
      const pTop = top + (H - (ph * ops.length + gap * (ops.length - 1))) / 2;
      const EV = { idea: 'Idea sin datos', una: 'Una fuente', dos: 'Dos fuentes', tres: 'Tres fuentes o más', ...evidenceLabels };
      const centers = [];
      ops.forEach((o, i) => {
        const y = pTop + i * (ph + gap); centers.push(y + ph / 2);
        const ev = o.evidence || 'idea';
        const fill = ev === 'dos' || ev === 'tres' ? C.surface : C.paper;
        const ln = { color: ev === 'dos' || ev === 'tres' ? C.ink : C.hint, width: 1.25 };
        if (ev === 'idea') ln.dashType = 'dash';
        s.addShape(pres.ShapeType.roundRect, { x: cols[2].x, y, w: cols[2].w, h: ph, rectRadius: 0.05, fill: { color: fill }, line: ln });
        if (o.priority) s.addShape(pres.ShapeType.rect, { x: cols[2].x, y, w: 0.06, h: ph, fill: { color: C.accent }, line: { color: C.accent, width: 0 } });
        s.addText([
          { text: `${i + 1}. ${o.text}`, options: { color: C.ink, bold: true, fontSize: 11, breakLine: true } },
          { text: EV[ev] + (o.priority ? '  |  ' + priorityLabel : ''), options: { color: C.muted, fontSize: 9 } },
        ], { x: cols[2].x + 0.18, y, w: cols[2].w - 0.3, h: ph, fontFace: B, margin: 0, valign: 'middle', lineSpacingMultiple: 1.1 });
        line(cols[1].x + cols[1].w, top + H / 2, cols[2].x, y + ph / 2, !o.linked);
      });
      // ideas
      const sols = solutions.slice(0, 6);
      const sh = Math.min(0.78, (H - 0.12 * (sols.length - 1)) / (sols.length || 1));
      const sTop = top + (H - (sh * sols.length + 0.12 * (sols.length - 1))) / 2;
      sols.forEach((so, i) => {
        const y = sTop + i * (sh + 0.12);
        s.addShape(pres.ShapeType.roundRect, { x: cols[3].x, y, w: cols[3].w, h: sh, rectRadius: 0.05, fill: { color: C.ink }, line: { color: C.ink, width: 0 } });
        s.addText(so.text, { x: cols[3].x + 0.16, y, w: cols[3].w - 0.3, h: sh, fontFace: B, fontSize: 9.5, color: C.paper, margin: 0, valign: 'middle', lineSpacingMultiple: 1.1 });
        if (centers[so.of] !== undefined) line(cols[2].x + cols[2].w, centers[so.of], cols[3].x, y + sh / 2, false);
      });
      source(s, src);
      return s;
    },

    /**
     * Fuentes lado a lado: qué dice cada fuente sobre el mismo hallazgo, y cuánto aguanta junto.
     * sources: [{ type, finding, data, period }]  |  verdict: { level, text }
     */
    sources({ breadcrumb: bc, title: t, sources: items = [], verdict, source: src, notes }) {
      const s = newSlide(C.paper, notes);
      breadcrumb(s, bc);
      title(s, t, { size: 26, h: 0.95 });
      const n = Math.min(items.length, 4) || 1, gap = 0.3;
      const w = (G.contentW - gap * (n - 1)) / n, y = 2.2, h = 3.0;
      items.slice(0, 4).forEach((it, i) => {
        const x = G.M + (w + gap) * i;
        card(s, { x, y, w, h });
        eyebrow(s, it.type || '', { x: x + 0.25, y: y + 0.25, w: w - 0.5 });
        s.addText(it.data || '', { x: x + 0.25, y: y + 0.6, w: w - 0.5, h: 0.8, fontFace: D, fontSize: 26, bold: true, color: C.ink, margin: 0, valign: 'top' });
        s.addText(it.finding || '', { x: x + 0.25, y: y + 1.45, w: w - 0.5, h: 1.1, fontFace: B, fontSize: S.body, color: C.body, margin: 0, valign: 'top', lineSpacingMultiple: 1.25 });
        if (it.period) s.addText(it.period, { x: x + 0.25, y: y + h - 0.45, w: w - 0.5, h: 0.25, fontFace: B, fontSize: 9, color: C.hint, margin: 0 });
      });
      if (verdict) {
        const vy = y + h + 0.3;
        s.addShape(pres.ShapeType.rect, { x: G.M, y: vy, w: G.contentW, h: 0.85, fill: { color: C.mintBand }, line: { color: C.mintBand, width: 0 } });
        s.addText([
          { text: (verdict.level || '') + '. ', options: { bold: true, color: C.ink } },
          { text: verdict.text || '', options: { color: C.ink } },
        ], { x: G.M + 0.3, y: vy, w: G.contentW - 0.6, h: 0.85, fontFace: B, fontSize: 13, margin: 0, valign: 'middle' });
      }
      source(s, src);
      return s;
    },

    // -----------------------------------------------------------------------
    // Arquetipos de relevamiento y propuesta: alcance, escenarios, olas,
    // gobernanza (escala, desglose, perfiles) y cierre con decisiones.
    // -----------------------------------------------------------------------

    /**
     * Escenarios lado a lado, uno recomendado.
     * scenarios: [{ tag, name, logic, steps: [] }]  |  recommended: índice  |  why: el porqué en una línea.
     */
    scenarios({ breadcrumb: bc, title: t, lede: ld, scenarios: items = [], recommended = 0, recommendedLabel = 'Recomendado', whyLabel = 'Por qué este.', why, source: src, notes }) {
      const s = newSlide(C.paper, notes);
      breadcrumb(s, bc);
      title(s, t);
      if (ld) lede(s, ld, { y: 1.85 });
      const n = Math.min(items.length, 4) || 1, gap = 0.35;
      const w = (G.contentW - gap * (n - 1)) / n;
      const y = ld ? 2.7 : 2.3;
      const h = why ? 3.1 : 3.5;
      items.slice(0, 4).forEach((it, i) => {
        const x = G.M + (w + gap) * i;
        const rec = i === recommended;
        card(s, { x, y, w, h });
        if (rec) {
          s.addShape(pres.ShapeType.rect, { x, y: y - 0.05, w, h: 0.05, fill: { color: C.accent }, line: { color: C.accent, width: 0 } });
          const cw = Math.min(w - 0.5, 0.25 + String(recommendedLabel).length * 0.085);
          s.addShape(pres.ShapeType.roundRect, { x: x + 0.28, y: y - 0.2, w: cw, h: 0.3, rectRadius: 0.15, fill: { color: C.ink }, line: { color: C.ink, width: 0 } });
          s.addText(String(recommendedLabel).toUpperCase(), { x: x + 0.28, y: y - 0.2, w: cw, h: 0.3, fontFace: B, fontSize: 9, bold: true, charSpacing: 0.5, color: C.paper, align: 'center', valign: 'middle', margin: 0 });
        }
        const pad = 0.28;
        eyebrow(s, it.tag || `Escenario ${i + 1}`, { x: x + pad, y: y + 0.3, w: w - pad * 2 });
        s.addText(it.name || '', { x: x + pad, y: y + 0.62, w: w - pad * 2, h: 0.5, fontFace: D, fontSize: 19, bold: true, color: C.ink, margin: 0, valign: 'top' });
        if (it.logic) s.addText(rich(it.logic, { color: C.muted }), { x: x + pad, y: y + 1.12, w: w - pad * 2, h: 0.3, fontFace: B, fontSize: 12, margin: 0, valign: 'top' });
        const steps = it.steps || [];
        if (steps.length) {
          const runs = [];
          steps.forEach((st, k) => {
            runs.push({ text: `${k + 1}.  `, options: { color: C.label, bold: true } });
            rich(st, { color: C.body }).forEach((r) => runs.push(r));
            const last = runs[runs.length - 1];
            last.options = { ...last.options, breakLine: k < steps.length - 1, paraSpaceAfter: 3 };
          });
          s.addText(runs, { x: x + pad, y: y + 1.5, w: w - pad * 2, h: h - 1.5 - pad + 0.1, fontFace: B, fontSize: 11.5, margin: 0, valign: 'top', lineSpacingMultiple: 1.2 });
        }
      });
      if (why) {
        const vy = y + h + 0.25;
        s.addShape(pres.ShapeType.rect, { x: G.M, y: vy, w: G.contentW, h: 0.62, fill: { color: C.mintBand }, line: { color: C.mintBand, width: 0 } });
        s.addText([{ text: whyLabel + ' ', options: { bold: true, color: C.ink } }, ...rich(why, { color: C.ink })], { x: G.M + 0.3, y: vy, w: G.contentW - 0.6, h: 0.62, fontFace: B, fontSize: 13, margin: 0, valign: 'middle' });
      }
      source(s, src);
      return s;
    },

    /**
     * Ficha de escenario: en qué consiste, pros, contras y el orden por etapas.
     * baseline: { label, name, text } etapa cero opcional  |  stages: [{ label, name, items: [] }]
     */
    scenario({ breadcrumb: bc, title: t, what, pros = [], cons = [], whatLabel = 'En qué consiste', prosLabel = 'Pros', consLabel = 'Contras', orderLabel = 'Orden', baseline, stages = [], source: src, notes }) {
      const s = newSlide(C.paper, notes);
      breadcrumb(s, bc);
      title(s, t, { size: 28, h: 0.55 });
      const y = 1.7, h = 1.85, gap = 0.3;
      const w = (G.contentW - gap * 2) / 3;
      const blocks = [
        { label: whatLabel, body: [what || ''], fill: C.surface, dark: false, plain: true },
        { label: prosLabel, body: pros, fill: C.surface, dark: false },
        { label: consLabel, body: cons, fill: C.ink, dark: true },
      ];
      blocks.forEach((b, i) => {
        const x = G.M + (w + gap) * i, pad = 0.25;
        card(s, { x, y, w, h, fill: b.fill });
        eyebrow(s, b.label, { x: x + pad, y: y + 0.22, w: w - pad * 2, color: b.dark ? C.accent : C.label });
        const items = (b.body || []).map((p) => (b.plain ? p : ['- ', ...(typeof p === 'string' ? [p] : p)]));
        s.addText(paragraphs(items, { color: b.dark ? C.paper : C.body }, 4), { x: x + pad, y: y + 0.55, w: w - pad * 2, h: h - 0.75, fontFace: B, fontSize: 11, margin: 0, valign: 'top', lineSpacingMultiple: 1.25 });
      });
      let oy = y + h + 0.3;
      eyebrow(s, orderLabel, { x: G.M, y: oy, w: 4 });
      oy += 0.35;
      if (baseline) {
        card(s, { x: G.M, y: oy, w: G.contentW, h: 0.42 });
        s.addText([
          { text: (baseline.label || '') + '   ', options: { color: C.hint, bold: true } },
          { text: (baseline.name || '') + '   ', options: { color: C.ink, bold: true } },
          ...rich(baseline.text || '', { color: C.muted }),
        ], { x: G.M + 0.2, y: oy, w: G.contentW - 0.4, h: 0.42, fontFace: B, fontSize: 11, margin: 0, valign: 'middle' });
        oy += 0.55;
      }
      const n = stages.length || 1, sg = 0.22;
      const sw = (G.contentW - sg * (n - 1)) / n;
      const sh = G.H - oy - 0.55;
      stages.forEach((st, i) => {
        const x = G.M + (sw + sg) * i, pad = 0.18;
        card(s, { x, y: oy, w: sw, h: sh });
        s.addText(st.label || '', { x: x + pad, y: oy + 0.12, w: sw - pad * 2, h: 0.22, fontFace: B, fontSize: 9.5, bold: true, color: C.hint, margin: 0 });
        s.addText(st.name || '', { x: x + pad, y: oy + 0.34, w: sw - pad * 2, h: 0.3, fontFace: D, fontSize: 13, bold: true, color: C.ink, margin: 0, valign: 'top' });
        const items = (st.items || []).map((p) => ['- ', ...(typeof p === 'string' ? [p] : p)]);
        if (items.length) s.addText(paragraphs(items, { color: C.muted }, 1), { x: x + pad, y: oy + 0.72, w: sw - pad * 2, h: sh - 0.82, fontFace: B, fontSize: 10, margin: 0, valign: 'top', lineSpacingMultiple: 1.15 });
      });
      source(s, src);
      return s;
    },

    /**
     * Tablero por olas o niveles: columnas con sus módulos, cambios y equipos que los usan.
     * columns: [{ label, name, note, items: [{ name, improve, add, teams: ['F'], status, divider }] }]
     * teams: [{ code: 'F', name: 'Finanzas' }]  |  focus: índice de la última columna visible (construcción progresiva).
     */
    waves({ breadcrumb: bc, title: t, baseline, columns = [], teams = [], focus, teamsLabel = 'Equipos que lo usan:', improveLabel = 'mejoras de lo que hay', addLabel = 'cambios nuevos', source: src, notes }) {
      const s = newSlide(C.paper, notes);
      breadcrumb(s, bc);
      title(s, t, { size: 24, h: 0.45 });
      const faded = (i) => focus !== undefined && i > focus;
      const fadeFill = 'EFEFF2', fadeText = 'C7C7CC';
      const addTint = tint(C.accent, 0.7);
      let y = 1.5;
      if (baseline) {
        s.addShape(pres.ShapeType.roundRect, { x: G.M, y, w: G.contentW, h: 0.34, rectRadius: 0.05, fill: { color: C.ink }, line: { color: C.ink, width: 0 } });
        s.addText([
          { text: (baseline.label || '') + '   ', options: { color: C.hint, bold: true } },
          { text: baseline.name || '', options: { color: C.paper, bold: true } },
        ], { x: G.M + 0.18, y, w: G.contentW - 0.36, h: 0.34, fontFace: B, fontSize: 11, margin: 0, valign: 'middle' });
        y += 0.46;
      }
      const n = columns.length || 1, cg = 0.22;
      const cw = (G.contentW - cg * (n - 1)) / n;
      const legendY = G.H - 0.62;
      const itemsTop = y + 0.66;
      const maxItems = Math.max(1, ...columns.map((c) => (c.items || []).length));
      const maxDiv = Math.max(0, ...columns.map((c) => (c.items || []).filter((it) => it.divider).length));
      const avail = legendY - 0.15 - itemsTop - maxDiv * 0.12 - 0.3;
      const ih = Math.min(0.66, (avail - (maxItems - 1) * 0.07) / maxItems);
      columns.forEach((col, i) => {
        const x = G.M + (cw + cg) * i;
        const f = faded(i);
        s.addShape(pres.ShapeType.roundRect, { x, y, w: cw, h: 0.56, rectRadius: 0.05, fill: { color: f ? fadeFill : C.ink }, line: { color: f ? fadeFill : C.ink, width: 0 } });
        s.addText([
          { text: (col.label || '') , options: { color: f ? fadeText : C.hint, bold: true, fontSize: 9.5, breakLine: true } },
          { text: col.name || '', options: { color: f ? fadeText : C.paper, bold: true, fontSize: 12.5 } },
        ], { x: x + 0.15, y, w: cw - 0.3, h: 0.56, fontFace: B, margin: 0, valign: 'middle' });
        let iy = itemsTop;
        (col.items || []).forEach((it) => {
          if (it.divider) {
            s.addShape(pres.ShapeType.line, { x: x + 0.1, y: iy + 0.01, w: cw - 0.2, h: 0, line: { color: f ? fadeFill : C.hint, width: 0.75, dashType: 'dash' } });
            iy += 0.12;
          }
          const def = it.status === 'definir';
          s.addShape(pres.ShapeType.roundRect, { x, y: iy, w: cw, h: ih, rectRadius: 0.05,
            fill: { color: f ? 'F7F7F9' : def ? C.paper : C.surface },
            line: def && !f ? { color: C.ink, width: 0.75, dashType: 'dash' } : { color: f ? 'F7F7F9' : C.surface, width: 0 } });
          s.addText(it.name || '', { x: x + 0.12, y: iy + 0.05, w: cw - 0.24, h: 0.26, fontFace: B, fontSize: 11, color: f ? fadeText : C.ink, margin: 0, valign: 'middle', fit: 'shrink' });
          if (!f) {
            const ry = iy + ih - 0.29;
            let cx = x + 0.12;
            [[it.improve, C.line, C.ink], [it.add, addTint, C.ink]].forEach(([v, fill, col2]) => {
              if (v === undefined || v === null) return;
              s.addShape(pres.ShapeType.roundRect, { x: cx, y: ry, w: 0.3, h: 0.22, rectRadius: 0.04, fill: { color: fill }, line: { color: fill, width: 0 } });
              s.addText(String(v), { x: cx, y: ry, w: 0.3, h: 0.22, fontFace: B, fontSize: 9, bold: true, color: col2, align: 'center', valign: 'middle', margin: 0 });
              cx += 0.36;
            });
            const tm = it.teams || [], d = 0.21, step = 0.17;
            tm.forEach((code, k) => {
              const tx = x + cw - 0.12 - d - step * (tm.length - 1 - k);
              s.addShape(pres.ShapeType.ellipse, { x: tx, y: ry, w: d, h: d, fill: { color: C.ink }, line: { color: C.paper, width: 0.75 } });
              s.addText(String(code), { x: tx, y: ry, w: d, h: d, fontFace: B, fontSize: 7.5, bold: true, color: C.paper, align: 'center', valign: 'middle', margin: 0 });
            });
          }
          iy += ih + 0.07;
        });
        if (col.note && !f) {
          s.addText(rich(col.note, { color: C.hint, italic: true }), { x, y: iy + 0.02, w: cw, h: Math.max(0.3, legendY - 0.1 - iy), fontFace: B, fontSize: 8.5, margin: 0, valign: 'top', lineSpacingMultiple: 1.1 });
        }
      });
      // Leyenda: equipos con su inicial y lectura de los números.
      let lx = G.M;
      if (teams.length) {
        s.addText(teamsLabel, { x: lx, y: legendY, w: 1.75, h: 0.26, fontFace: B, fontSize: 10, bold: true, color: C.ink, margin: 0, valign: 'middle' });
        lx += 1.8;
        teams.forEach((tm) => {
          s.addShape(pres.ShapeType.ellipse, { x: lx, y: legendY + 0.025, w: 0.21, h: 0.21, fill: { color: C.ink }, line: { color: C.ink, width: 0 } });
          s.addText(String(tm.code), { x: lx, y: legendY + 0.025, w: 0.21, h: 0.21, fontFace: B, fontSize: 7.5, bold: true, color: C.paper, align: 'center', valign: 'middle', margin: 0 });
          const tw = 0.15 + String(tm.name).length * 0.068;
          s.addText(tm.name, { x: lx + 0.26, y: legendY, w: tw, h: 0.26, fontFace: B, fontSize: 9.5, color: C.muted, margin: 0, valign: 'middle' });
          lx += 0.3 + tw;
        });
      }
      const rx = G.W - G.M - 3.6;
      [[C.line, improveLabel], [addTint, addLabel]].forEach(([fill, lab], k) => {
        const x = rx + k * 1.85;
        s.addShape(pres.ShapeType.roundRect, { x, y: legendY + 0.03, w: 0.3, h: 0.2, rectRadius: 0.04, fill: { color: fill }, line: { color: fill, width: 0 } });
        s.addText(lab, { x: x + 0.36, y: legendY, w: 1.45, h: 0.26, fontFace: B, fontSize: 9, color: C.muted, margin: 0, valign: 'middle' });
      });
      source(s, src);
      return s;
    },

    /**
     * Alcance: una grilla con un cuadro por sección, coloreada por decisión, y las cifras del cambio.
     * groups: [{ label, count, style: 'solid' | 'accent' | 'outline' | 'muted', names }]
     * stats: [{ value, label, accent }]  la primera va grande  |  takeaway: la lectura.
     */
    scopeGrid({ breadcrumb: bc, title: t, leftLabel = 'Qué pasa con cada sección', rightLabel = 'El tamaño del cambio', groups = [], stats = [], takeaway, perRow = 12, source: src, notes }) {
      const s = newSlide(C.paper, notes);
      breadcrumb(s, bc);
      title(s, t, { size: 28, h: 0.95 });
      const y0 = 2.25;
      const lw = 6.3;
      const styleOf = (st) => ({
        solid: { fill: C.ink, line: C.ink },
        accent: { fill: C.accent, line: C.accent },
        outline: { fill: C.paper, line: C.ink, dash: true },
        muted: { fill: C.line, line: C.line },
      }[st] || { fill: C.ink, line: C.ink });
      eyebrow(s, leftLabel, { x: G.M, y: y0, w: lw });
      const sq = 0.36, sg = 0.1;
      const cells = [];
      groups.forEach((g) => { for (let k = 0; k < (g.count || 0); k++) cells.push(g.style); });
      cells.forEach((st, k) => {
        const r = Math.floor(k / perRow), c = k % perRow;
        const o = styleOf(st);
        s.addShape(pres.ShapeType.roundRect, { x: G.M + c * (sq + sg), y: y0 + 0.4 + r * (sq + sg), w: sq, h: sq, rectRadius: 0.05,
          fill: { color: o.fill }, line: { color: o.line, width: o.dash ? 1 : 0, dashType: o.dash ? 'dash' : 'solid' } });
      });
      const rows = Math.ceil(cells.length / perRow);
      let ly = y0 + 0.4 + rows * (sq + sg) + 0.2;
      const rowH = Math.min(0.5, (G.H - 0.8 - ly) / Math.max(groups.length, 1));
      groups.forEach((g) => {
        const o = styleOf(g.style);
        s.addShape(pres.ShapeType.roundRect, { x: G.M, y: ly + 0.05, w: 0.2, h: 0.2, rectRadius: 0.04, fill: { color: o.fill }, line: { color: o.line, width: o.dash ? 1 : 0, dashType: o.dash ? 'dash' : 'solid' } });
        s.addText([
          { text: `${g.count} ${g.label}`, options: { bold: true, color: C.ink } },
          ...(g.names ? [{ text: '   ' + g.names, options: { color: C.hint } }] : []),
        ], { x: G.M + 0.32, y: ly, w: lw - 0.32, h: rowH, fontFace: B, fontSize: 11, margin: 0, valign: 'top', lineSpacingMultiple: 1.1 });
        ly += rowH;
      });
      const rx = G.M + lw + 0.6, rw = G.W - G.M - rx;
      s.addShape(pres.ShapeType.rect, { x: rx - 0.3, y: y0, w: 0.01, h: G.H - y0 - 0.8, fill: { color: C.line }, line: { color: C.line, width: 0 } });
      eyebrow(s, rightLabel, { x: rx, y: y0, w: rw });
      let sy = y0 + 0.4;
      stats.forEach((st, k) => {
        const big = k === 0;
        s.addText(String(st.value), { x: rx, y: sy, w: big ? 2.3 : 1.5, h: big ? 0.95 : 0.65, fontFace: D, fontSize: big ? 54 : 34, bold: true, charSpacing: -1, color: st.accent ? C.accent : C.ink, margin: 0, valign: 'middle' });
        s.addText(rich(st.label, { color: C.muted }), { x: rx + (big ? 2.4 : 1.6), y: sy, w: rw - (big ? 2.4 : 1.6), h: big ? 0.95 : 0.65, fontFace: B, fontSize: 12.5, margin: 0, valign: 'middle' });
        sy += big ? 1.05 : 0.72;
      });
      if (takeaway) s.addText(rich(takeaway, { color: C.body }), { x: rx, y: sy + 0.15, w: rw, h: G.H - sy - 1.0, fontFace: B, fontSize: 13, margin: 0, valign: 'top', lineSpacingMultiple: 1.3 });
      source(s, src);
      return s;
    },

    /**
     * Escala ordenada (niveles de permiso, de madurez, de servicio): de menos a más.
     * levels: [{ name, lead, body }]  |  bodyLabel: prefijo del cuerpo ('Alcance:').
     */
    scale({ breadcrumb: bc, title: t, lede: ld, levels = [], bodyLabel = 'Alcance:', source: src, notes }) {
      const s = newSlide(C.paper, notes);
      breadcrumb(s, bc);
      title(s, t, { size: 28, h: 0.9 });
      if (ld) lede(s, ld, { y: 1.85 });
      const n = levels.length || 1, gap = 0.25;
      const w = (G.contentW - gap * (n - 1)) / n;
      const y = ld ? 2.75 : 2.2;
      // Arrow line bajo las píldoras: de menos a más.
      s.addShape(pres.ShapeType.line, { x: G.M, y: y + 0.66, w: G.contentW, h: 0, line: { color: C.line, width: 1, endArrowType: 'triangle' } });
      levels.forEach((lv, i) => {
        const x = G.M + (w + gap) * i;
        const last = i === n - 1;
        const fill = last ? C.accentDeep : tint(C.accent, n > 1 ? 0.82 - (0.82 * i) / (n - 1) : 0);
        s.addShape(pres.ShapeType.roundRect, { x, y, w, h: 0.48, rectRadius: 0.24, fill: { color: fill }, line: { color: fill, width: 0 } });
        s.addText(String(lv.name).toUpperCase(), { x, y, w, h: 0.48, fontFace: B, fontSize: 11, bold: true, charSpacing: 0.4, color: last ? C.paper : C.ink, align: 'center', valign: 'middle', margin: 0 });
        const cy = y + 0.9, ch = Math.min(2.6, G.H - cy - 0.85), pad = 0.25;
        card(s, { x, y: cy, w, h: ch });
        s.addText(rich(lv.lead || '', { color: C.ink, bold: true }), { x: x + pad, y: cy + pad, w: w - pad * 2, h: 0.85, fontFace: D, fontSize: 13, margin: 0, valign: 'top', lineSpacingMultiple: 1.15 });
        s.addText([{ text: bodyLabel ? bodyLabel + ' ' : '', options: { bold: true, color: C.ink } }, ...rich(lv.body || '', { color: C.muted })], { x: x + pad, y: cy + pad + 0.95, w: w - pad * 2, h: ch - pad * 2 - 0.95, fontFace: B, fontSize: 11.5, margin: 0, valign: 'top', lineSpacingMultiple: 1.3 });
      });
      source(s, src);
      return s;
    },

    /**
     * Desglose de un total: la cifra total con su lectura a la izquierda, sus partes a la derecha.
     * total: { value, label, body: [] }  |  parts: [{ value, title, body }]  |  note: lectura en banda.
     */
    breakdown({ breadcrumb: bc, title: t, total = {}, parts = [], partsLabel, perRow, note, source: src, notes }) {
      const s = newSlide(C.paper, notes);
      breadcrumb(s, bc);
      title(s, t, { size: 28, h: 0.95 });
      const y = 2.3, lw = 4.0;
      const bottom = note ? G.H - 1.75 : G.H - 0.85;
      card(s, { x: G.M, y, w: lw, h: bottom - y });
      const pad = 0.3;
      s.addText(String(total.value || ''), { x: G.M + pad, y: y + pad, w: lw - pad * 2, h: 1.0, fontFace: D, fontSize: 60, bold: true, charSpacing: -1.5, color: C.accent, margin: 0, valign: 'middle' });
      s.addText(rich(total.label || '', { color: C.ink, bold: true }), { x: G.M + pad, y: y + pad + 1.05, w: lw - pad * 2, h: 0.65, fontFace: D, fontSize: 16, margin: 0, valign: 'top', lineSpacingMultiple: 1.1 });
      const tb = Array.isArray(total.body) ? total.body : total.body ? [total.body] : [];
      if (tb.length) s.addText(paragraphs(tb, { color: C.muted }, 6), { x: G.M + pad, y: y + pad + 1.8, w: lw - pad * 2, h: bottom - y - pad * 2 - 1.8, fontFace: B, fontSize: 11.5, margin: 0, valign: 'top', lineSpacingMultiple: 1.3 });
      const rx = G.M + lw + 0.4, rw = G.W - G.M - rx;
      let py = y;
      if (partsLabel) { eyebrow(s, partsLabel, { x: rx, y: py, w: rw }); py += 0.38; }
      const n = parts.length || 1;
      // Hasta 4 partes en grilla de dos; con 5 o más, una fila por parte.
      const per = perRow || (n <= 2 ? n : n <= 4 ? 2 : 1);
      const rows = Math.ceil(n / per), g = 0.22;
      const ph = (bottom - py - g * (rows - 1)) / rows;
      parts.forEach((p, i) => {
        const r = Math.floor(i / per), c = i % per;
        const inRow = r === rows - 1 ? n - per * (rows - 1) : per;
        const pw = (rw - g * (inRow - 1)) / inRow;
        const x = rx + c * (pw + g), yy = py + r * (ph + g);
        card(s, { x, y: yy, w: pw, h: ph });
        const list = per === 1;
        const nw = list ? 0.7 : 0.95;
        s.addText(String(p.value), { x: x + 0.2, y: yy, w: nw, h: ph, fontFace: D, fontSize: list ? Math.min(32, ph * 60) : 44, bold: true, charSpacing: -1, color: C.ink, margin: 0, valign: 'middle' });
        s.addText([
          { text: (p.title || '') + (list ? '   ' : ''), options: { bold: true, color: C.ink, breakLine: !list, paraSpaceAfter: list ? 0 : 3 } },
          ...rich(p.body || '', { color: C.muted, fontSize: list ? 11.5 : 10.5 }),
        ], { x: x + 0.2 + nw, y: yy + 0.05, w: pw - nw - 0.4, h: ph - 0.1, fontFace: B, fontSize: 12.5, margin: 0, valign: 'middle', lineSpacingMultiple: 1.2 });
      });
      if (note) {
        const vy = bottom + 0.3;
        s.addShape(pres.ShapeType.rect, { x: G.M, y: vy, w: G.contentW, h: 0.65, fill: { color: C.mintBand }, line: { color: C.mintBand, width: 0 } });
        s.addText(rich(note, { color: C.ink }), { x: G.M + 0.3, y: vy, w: G.contentW - 0.6, h: 0.65, fontFace: B, fontSize: 12.5, margin: 0, valign: 'middle' });
      }
      source(s, src);
      return s;
    },

    /**
     * Fichas de perfil o rol en grilla de hasta 3 x 2: a qué accede cada uno.
     * profiles: [{ name, count, body, tag }]
     */
    profiles({ breadcrumb: bc, title: t, profiles: items = [], cols = 3, source: src, notes }) {
      const s = newSlide(C.paper, notes);
      breadcrumb(s, bc);
      title(s, t, { size: 28, h: 0.55 });
      const list = items.slice(0, cols * 2);
      const rows = Math.ceil(list.length / cols) || 1, g = 0.25;
      const y0 = 1.75;
      const w = (G.contentW - g * (cols - 1)) / cols;
      const h = (G.H - y0 - 0.8 - g * (rows - 1)) / rows;
      list.forEach((p, i) => {
        const x = G.M + (i % cols) * (w + g), y = y0 + Math.floor(i / cols) * (h + g), pad = 0.22;
        card(s, { x, y, w, h });
        s.addText(p.name || '', { x: x + pad, y: y + pad - 0.04, w: w - pad * 2 - 1.3, h: 0.32, fontFace: D, fontSize: 14, bold: true, color: C.ink, margin: 0, valign: 'middle', fit: 'shrink' });
        if (p.count) s.addText(String(p.count), { x: x + w - pad - 1.3, y: y + pad - 0.04, w: 1.3, h: 0.32, fontFace: B, fontSize: 10, bold: true, color: C.label, align: 'right', margin: 0, valign: 'middle' });
        s.addText(rich(p.body || '', { color: C.muted }), { x: x + pad, y: y + pad + 0.38, w: w - pad * 2, h: h - pad * 2 - 0.38 - (p.tag ? 0.38 : 0), fontFace: B, fontSize: 10.5, margin: 0, valign: 'top', lineSpacingMultiple: 1.2 });
        if (p.tag) {
          const tw = Math.min(w - pad * 2, 0.3 + String(p.tag).length * 0.072);
          s.addShape(pres.ShapeType.roundRect, { x: x + pad, y: y + h - pad - 0.28, w: tw, h: 0.28, rectRadius: 0.14, fill: { color: C.paper }, line: { color: C.line, width: 0.75 } });
          s.addText(p.tag, { x: x + pad, y: y + h - pad - 0.28, w: tw, h: 0.28, fontFace: B, fontSize: 9, color: C.muted, align: 'center', valign: 'middle', margin: 0 });
        }
      });
      source(s, src);
      return s;
    },

    /**
     * Conclusiones en dos columnas: a lo que llegamos y lo que sigue para quien decide.
     * done: { label, items: [] }  |  next: { label, items: [] } escritas como decisiones  |  ask: pedido de cierre.
     */
    conclusions({ breadcrumb: bc, title: t, done = {}, next = {}, ask, source: src, notes }) {
      const s = newSlide(C.paper, notes);
      breadcrumb(s, bc);
      title(s, t, { size: 28, h: 0.9 });
      const y0 = 2.0, g = 0.5;
      const w = (G.contentW - g) / 2;
      const bottom = ask ? G.H - 1.65 : G.H - 0.8;
      [done, next].forEach((col, ci) => {
        const x = G.M + ci * (w + g);
        eyebrow(s, col.label || (ci ? 'Lo que sigue' : 'A lo que llegamos'), { x, y: y0, w });
        const items = col.items || [];
        const n = items.length || 1, rg = 0.12;
        const rh = Math.min(0.85, (bottom - y0 - 0.4 - rg * (n - 1)) / n);
        items.forEach((it, i) => {
          const y = y0 + 0.4 + i * (rh + rg);
          card(s, { x, y, w, h: rh });
          s.addText(String(i + 1).padStart(2, '0'), { x: x + 0.18, y, w: 0.5, h: rh, fontFace: D, fontSize: 15, bold: true, color: ci ? C.ink : C.label, margin: 0, valign: 'middle' });
          s.addText(rich(it, { color: C.body }), { x: x + 0.72, y, w: w - 0.9, h: rh, fontFace: B, fontSize: 11.5, margin: 0, valign: 'middle', lineSpacingMultiple: 1.2 });
        });
      });
      if (ask) {
        const vy = bottom + 0.3, vh = 0.85;
        s.addShape(pres.ShapeType.rect, { x: G.M, y: vy, w: G.contentW, h: vh, fill: { color: C.ink }, line: { color: C.ink, width: 0 } });
        s.addShape(pres.ShapeType.rect, { x: G.M, y: vy, w: 0.045, h: vh, fill: { color: C.accent }, line: { color: C.accent, width: 0 } });
        s.addText(rich(ask, { color: C.paper }), { x: G.M + 0.35, y: vy, w: G.contentW - 0.6, h: vh, fontFace: B, fontSize: 13, margin: 0, valign: 'middle', lineSpacingMultiple: 1.2 });
      }
      source(s, src);
      return s;
    },


    // -----------------------------------------------------------------------
    // Síntesis y gráficos (tanda 1)
    // -----------------------------------------------------------------------

    /**
     * Gráfico arcoíris: cada entrevista contra cada hipótesis.
     * columns: [{ label, group }]  |  groups: [{ name, color }]  |  rows: [{ id, label, values: ['C','R','M','S','N',''], result }]
     * Valores: C confirma, R refuta, M matiza, S sin evidencia, N no preguntada, vacío no aplica.
     * result (opcional): 'distinta' | 'como' | 'abierta', para la columna de cierre.
     */
    rainbow({ breadcrumb: bc, title: t, lede: ld, columns = [], groups = [], rows = [], resultLabel = 'Cómo quedó', resultLabels = { distinta: 'Distinta', como: 'Como creíamos', abierta: 'Abierta' }, legendLabels = { C: 'Confirma', R: 'Refuta', M: 'Matiza', S: 'Sin evidencia', N: 'No preguntada' }, source: src, notes }) {
      const s = newSlide(C.paper, notes);
      breadcrumb(s, bc);
      title(s, t, { size: 26, h: 0.7 });
      if (ld) lede(s, ld, { y: 1.6, h: 0.4, size: 12 });
      const VAL = {
        C: { fill: C.accent, line: C.accent },
        R: { fill: 'E5484D', line: 'E5484D' },
        M: { fill: 'F2B84B', line: 'F2B84B' },
        S: { fill: C.line, line: C.line },
        N: { fill: C.paper, line: 'B9B9BE' },
      };
      const labelW = 3.4, resW = rows.some((r) => r.result) ? 1.35 : 0;
      const x0 = G.M + labelW;
      const nC = Math.max(columns.length, 1);
      const cw = Math.min(0.62, (G.contentW - labelW - resW - 0.15) / nC);
      const yGroups = ld ? 2.12 : 1.85, yCols = yGroups + 0.3;
      const y0 = yCols + 0.62;
      const bottom = G.H - 1.15;
      const rh = Math.min(0.48, (bottom - y0) / Math.max(rows.length, 1));
      // Bandas de grupo
      let i = 0;
      while (i < columns.length) {
        const g = columns[i].group; let j = i;
        while (j + 1 < columns.length && columns[j + 1].group === g) j++;
        const gd = groups.find((x) => x.name === g) || { color: C.ink };
        s.addShape(pres.ShapeType.rect, { x: x0 + i * cw + 0.02, y: yGroups, w: (j - i + 1) * cw - 0.04, h: 0.22, fill: { color: gd.color }, line: { color: gd.color, width: 0 } });
        s.addText(String(g || '').toUpperCase(), { x: x0 + i * cw, y: yGroups, w: (j - i + 1) * cw, h: 0.22, fontFace: B, fontSize: 7.5, bold: true, color: C.paper, align: 'center', valign: 'middle', margin: 0 });
        i = j + 1;
      }
      columns.forEach((c, k) => {
        s.addText(c.label, { x: x0 + k * cw, y: yCols, w: cw, h: 0.58, fontFace: B, fontSize: 7.5, color: C.muted, align: 'center', valign: 'bottom', margin: 0 });
      });
      if (resW) s.addText(resultLabel, { x: x0 + nC * cw + 0.15, y: yCols, w: resW, h: 0.58, fontFace: B, fontSize: 8, bold: true, color: C.ink, align: 'left', valign: 'bottom', margin: 0 });
      rows.forEach((r, ri) => {
        const y = y0 + ri * rh;
        s.addText([{ text: (r.id ? r.id + '  ' : ''), options: { bold: true, color: C.ink } }, { text: r.label || '', options: { color: C.body } }], { x: G.M, y, w: labelW - 0.1, h: rh, fontFace: B, fontSize: 9, margin: 0, valign: 'middle' });
        (r.values || []).forEach((v, k) => {
          const d = VAL[v];
          if (!d) return;
          s.addShape(pres.ShapeType.rect, { x: x0 + k * cw + 0.03, y: y + 0.03, w: cw - 0.06, h: rh - 0.06, fill: { color: d.fill }, line: { color: d.line, width: 0.75 } });
        });
        if (resW && r.result) {
          const fill = r.result === 'distinta' ? C.accent : r.result === 'como' ? C.accentDeep : C.paper;
          const col = r.result === 'abierta' ? C.muted : C.paper;
          s.addShape(pres.ShapeType.roundRect, { x: x0 + nC * cw + 0.15, y: y + 0.04, w: resW, h: rh - 0.08, rectRadius: 0.06, fill: { color: fill }, line: { color: r.result === 'abierta' ? 'B9B9BE' : fill, width: 0.75 } });
          s.addText(resultLabels[r.result] || r.result, { x: x0 + nC * cw + 0.15, y: y + 0.04, w: resW, h: rh - 0.08, fontFace: B, fontSize: 8, bold: true, color: col, align: 'center', valign: 'middle', margin: 0 });
        }
      });
      // Leyenda
      const ly = G.H - 0.98;
      let lx = G.M;
      Object.keys(VAL).forEach((k) => {
        const d = VAL[k];
        s.addShape(pres.ShapeType.rect, { x: lx, y: ly + 0.04, w: 0.18, h: 0.18, fill: { color: d.fill }, line: { color: d.line, width: 0.75 } });
        s.addText(legendLabels[k], { x: lx + 0.25, y: ly, w: 1.5, h: 0.26, fontFace: B, fontSize: 9, color: C.body, margin: 0, valign: 'middle' });
        lx += 1.75;
      });
      source(s, src);
      return s;
    },

    /**
     * Curva emocional por segmento a lo largo del recorrido.
     * stages: ['Llega', 'Usa', ...]  |  series: [{ name, color, values: [2, 1, null, 0] }]  (0 dolor, 1 fricción, 2 funciona; null sin dato)
     * levels: nombres de las tres bandas, de arriba hacia abajo.
     */
    emotionCurve({ breadcrumb: bc, title: t, lede: ld, stages = [], series = [], levels = ['Funciona', 'Fricción', 'Dolor'], levelNotes = [], reading, source: src, notes }) {
      const s = newSlide(C.paper, notes);
      breadcrumb(s, bc);
      title(s, t, { size: 26, h: 0.7 });
      if (ld) lede(s, ld, { y: 1.6, h: 0.4, size: 12 });
      const top = ld ? 2.55 : 2.25, bottom = G.H - (reading ? 1.75 : 1.2);
      const labelW = 1.6, x0 = G.M + labelW, w = G.contentW - labelW;
      const bandH = (bottom - top) / 3;
      const bandFill = [C.mint, 'FBF0D9', 'FDE7E8'];
      const bandText = [C.accentDeep, '9A6200', 'B3242A'];
      levels.forEach((lv, k) => {
        const y = top + k * bandH;
        s.addShape(pres.ShapeType.rect, { x: x0, y, w, h: bandH, fill: { color: bandFill[k] }, line: { color: bandFill[k], width: 0 } });
        s.addText(lv.toUpperCase(), { x: G.M, y, w: labelW - 0.15, h: bandH * 0.5, fontFace: B, fontSize: 9.5, bold: true, color: bandText[k], margin: 0, valign: 'bottom' });
        if (levelNotes[k]) s.addText(levelNotes[k], { x: G.M, y: y + bandH * 0.5, w: labelW - 0.15, h: bandH * 0.5, fontFace: B, fontSize: 8, color: C.muted, margin: 0, valign: 'top' });
      });
      const n = Math.max(stages.length, 1), sw = w / n;
      const px = (i) => x0 + sw * (i + 0.5);
      const py = (v) => top + (2 - v) * bandH + bandH / 2;
      stages.forEach((st, i) => {
        s.addText(st, { x: x0 + i * sw, y: bottom + 0.08, w: sw, h: 0.4, fontFace: B, fontSize: 10, bold: true, color: C.ink, align: 'center', valign: 'top', margin: 0 });
        if (i) s.addShape(pres.ShapeType.line, { x: x0 + i * sw, y: top, w: 0, h: bottom - top, line: { color: C.paper, width: 1.5 } });
      });
      function seg(x1, y1, x2, y2, color, dash) {
        const o = { x: Math.min(x1, x2), y: Math.min(y1, y2), w: Math.abs(x2 - x1), h: Math.abs(y2 - y1), line: { color, width: 2.25, dashType: dash ? 'dash' : 'solid' } };
        if ((y2 < y1) !== (x2 < x1)) o.flipV = true;
        s.addShape(pres.ShapeType.line, o);
      }
      const off = (k) => (k - (series.length - 1) / 2) * 0.05;
      series.forEach((se, k) => {
        const pts = (se.values || []).map((v, i) => (v === null || v === undefined ? null : { x: px(i), y: py(v) + off(k) }));
        let last = null, gap = false;
        pts.forEach((p) => {
          if (!p) { if (last) gap = true; return; }
          if (last) seg(last.x, last.y, p.x, p.y, se.color, gap);
          last = p; gap = false;
        });
        pts.forEach((p) => { if (p) s.addShape(pres.ShapeType.ellipse, { x: p.x - 0.07, y: p.y - 0.07, w: 0.14, h: 0.14, fill: { color: se.color }, line: { color: C.paper, width: 1 } }); });
      });
      // Leyenda arriba a la derecha
      let lx = G.M + G.contentW;
      series.slice().reverse().forEach((se) => {
        const tw = 0.4 + se.name.length * 0.085;
        lx -= tw;
        s.addShape(pres.ShapeType.ellipse, { x: lx, y: top - 0.33, w: 0.14, h: 0.14, fill: { color: se.color }, line: { color: se.color, width: 0 } });
        s.addText(se.name, { x: lx + 0.2, y: top - 0.4, w: tw - 0.2, h: 0.28, fontFace: B, fontSize: 9.5, color: C.body, margin: 0, valign: 'middle' });
      });
      if (reading) {
        const vy = G.H - 1.25;
        s.addShape(pres.ShapeType.rect, { x: G.M, y: vy, w: G.contentW, h: 0.55, fill: { color: C.mintBand }, line: { color: C.mintBand, width: 0 } });
        s.addText(rich(reading, { color: C.ink }), { x: G.M + 0.25, y: vy, w: G.contentW - 0.5, h: 0.55, fontFace: B, fontSize: 11.5, margin: 0, valign: 'middle' });
      }
      source(s, src);
      return s;
    },

    /**
     * Tablero de hipótesis: una ficha por hipótesis, coloreada por resultado, y tarjetas de resumen.
     * hypotheses: [{ id, result: 'distinta' | 'como' | 'abierta' }]  |  summary: [{ value, label, body, highlight }]
     */
    hypothesisBoard({ breadcrumb: bc, title: t, hypotheses = [], legendLabels = { distinta: 'Distinta a lo que creíamos', como: 'Como lo creíamos', abierta: 'Abierta' }, summary = [], footnote, notes }) {
      const s = newSlide(C.paper, notes);
      breadcrumb(s, bc);
      title(s, t, { size: 26, h: 0.95 });
      const FILL = { distinta: C.accent, como: C.accentDeep, abierta: C.paper };
      const n = Math.max(hypotheses.length, 1);
      const tw = Math.min(0.72, (G.contentW - 0.08 * (n - 1)) / n);
      const ty = 2.05;
      hypotheses.forEach((h, i) => {
        const x = G.M + i * (tw + 0.08);
        const fill = FILL[h.result] || C.paper;
        s.addShape(pres.ShapeType.roundRect, { x, y: ty, w: tw, h: tw, rectRadius: 0.08, fill: { color: fill }, line: { color: h.result === 'abierta' ? 'B9B9BE' : fill, width: 1 } });
        s.addText(h.id, { x, y: ty, w: tw, h: tw, fontFace: D, fontSize: 13, bold: true, color: h.result === 'distinta' ? C.accentDeep : h.result === 'como' ? C.paper : C.muted, align: 'center', valign: 'middle', margin: 0 });
      });
      let lx = G.M; const ly = ty + tw + 0.18;
      ['distinta', 'como', 'abierta'].forEach((k) => {
        s.addShape(pres.ShapeType.roundRect, { x: lx, y: ly + 0.05, w: 0.18, h: 0.18, rectRadius: 0.04, fill: { color: FILL[k] }, line: { color: k === 'abierta' ? 'B9B9BE' : FILL[k], width: 1 } });
        const txt = legendLabels[k];
        s.addText(txt, { x: lx + 0.26, y: ly, w: 0.2 + txt.length * 0.075, h: 0.28, fontFace: B, fontSize: 10, color: C.body, margin: 0, valign: 'middle' });
        lx += 0.6 + txt.length * 0.075;
      });
      const cy = ly + 0.55, ch = G.H - 0.95 - cy;
      const g = 0.3, cwid = (G.contentW - g * (summary.length - 1)) / Math.max(summary.length, 1);
      summary.forEach((it, i) => {
        const x = G.M + i * (cwid + g);
        card(s, { x, y: cy, w: cwid, h: ch, fill: it.highlight ? C.mint : C.surface });
        if (it.highlight) s.addShape(pres.ShapeType.rect, { x, y: cy, w: cwid, h: 0.08, fill: { color: C.accent }, line: { color: C.accent, width: 0 } });
        s.addText(String(it.value), { x: x + 0.3, y: cy + 0.25, w: 1.3, h: 0.8, fontFace: D, fontSize: 40, bold: true, color: it.highlight ? C.accentDeep : C.ink, margin: 0, valign: 'middle' });
        s.addText(it.label, { x: x + 1.55, y: cy + 0.25, w: cwid - 1.8, h: 0.8, fontFace: D, fontSize: 14, bold: true, color: C.ink, margin: 0, valign: 'middle' });
        s.addText(rich(it.body || '', { color: C.body }), { x: x + 0.3, y: cy + 1.15, w: cwid - 0.6, h: ch - 1.35, fontFace: B, fontSize: 11, margin: 0, valign: 'top', lineSpacingMultiple: 1.2 });
      });
      if (footnote) s.addText(footnote, { x: G.M, y: G.H - 0.72, w: G.contentW, h: 0.3, fontFace: B, fontSize: S.caption, italic: true, color: C.muted, margin: 0, valign: 'middle' });
      return s;
    },

    /**
     * Ecosistema: el actor al centro, quienes lo tocan alrededor y un panel lateral.
     * center: { label }  |  nodes: [{ name, note, body, highlight }]  (hasta 6)
     * panel: { label, stats: [{ value, label, source }], footnote }  |  quote: { label, text, author }
     */
    ecosystem({ breadcrumb: bc, title: t, lede: ld, center = {}, nodes = [], panel, quote, notes }) {
      const s = newSlide(C.paper, notes);
      breadcrumb(s, bc);
      title(s, t, { size: 26, h: 0.7 });
      if (ld) lede(s, ld, { y: 1.6, h: 0.4, size: 12 });
      const cx = G.M + 3.05, cy = 4.55, R = 2.0, nw = 1.75, nh = 1.15, cr = 0.72;
      const n = Math.max(nodes.length, 1);
      const pos = nodes.map((_, i) => {
        const a = -Math.PI / 2 + (2 * Math.PI * i) / n;
        return { x: cx + R * 1.12 * Math.cos(a), y: cy + R * 0.98 * Math.sin(a) };
      });
      pos.forEach((p) => {
        const o = { x: Math.min(cx, p.x), y: Math.min(cy, p.y), w: Math.abs(p.x - cx), h: Math.abs(p.y - cy), line: { color: 'D5D5DA', width: 2 } };
        if ((p.y < cy) !== (p.x < cx)) o.flipV = true;
        s.addShape(pres.ShapeType.line, o);
      });
      nodes.forEach((nd, i) => {
        const x = pos[i].x - nw / 2, y = pos[i].y - nh / 2;
        s.addShape(pres.ShapeType.roundRect, { x, y, w: nw, h: nh, rectRadius: 0.08, fill: { color: nd.highlight ? C.mint : C.paper }, line: { color: nd.highlight ? C.accent : C.line, width: nd.highlight ? 2 : 1.25 } });
        const runs = [{ text: nd.name, options: { bold: true, color: C.ink, fontSize: 12, breakLine: true } }];
        if (nd.note) runs.push({ text: nd.note, options: { italic: true, color: C.hint, fontSize: 8.5, breakLine: true } });
        if (nd.body) runs.push({ text: nd.body, options: { color: C.muted, fontSize: 9.5 } });
        s.addText(runs, { x: x + 0.08, y, w: nw - 0.16, h: nh, fontFace: B, align: 'center', valign: 'middle', margin: 0, lineSpacingMultiple: 1.1 });
      });
      s.addShape(pres.ShapeType.ellipse, { x: cx - cr, y: cy - cr, w: cr * 2, h: cr * 2, fill: { color: C.ink }, line: { color: C.ink, width: 0 } });
      s.addText(center.label || '', { x: cx - cr, y: cy - cr, w: cr * 2, h: cr * 2, fontFace: D, fontSize: 13, bold: true, color: C.paper, align: 'center', valign: 'middle', margin: 0.05 });
      const px = G.M + 6.85, pw = G.M + G.contentW - px;
      let py = 2.25;
      if (panel) {
        eyebrow(s, panel.label || '', { x: px, y: py, w: pw, color: C.hint });
        py += 0.35;
        const st = panel.stats || [], ph = panel.footnote ? 1.75 : 1.4;
        card(s, { x: px, y: py, w: pw, h: ph, fill: C.paper });
        s.addShape(pres.ShapeType.roundRect, { x: px, y: py, w: pw, h: ph, rectRadius: 0.05, fill: { type: 'none' }, line: { color: C.line, width: 1.25 } });
        const sw = pw / Math.max(st.length, 1);
        st.forEach((it, k) => {
          const x = px + k * sw;
          if (k) s.addShape(pres.ShapeType.line, { x, y: py + 0.2, w: 0, h: 1.0, line: { color: C.line, width: 1 } });
          s.addText([{ text: String(it.value), options: { fontFace: D, fontSize: 24, bold: true, color: k === 1 ? C.accentDeep : C.ink, breakLine: true } }, { text: it.label || '', options: { fontSize: 9.5, color: C.body, breakLine: true } }, { text: it.source || '', options: { fontSize: 8, color: C.hint } }], { x: x + 0.15, y: py + 0.12, w: sw - 0.25, h: 1.15, fontFace: B, margin: 0, valign: 'top' });
        });
        if (panel.footnote) s.addText(panel.footnote, { x: px + 0.15, y: py + 1.32, w: pw - 0.3, h: 0.35, fontFace: B, fontSize: 9.5, italic: true, color: C.hint, margin: 0, valign: 'middle' });
        py += ph + 0.25;
      }
      if (quote) {
        const qh = G.H - 0.8 - py;
        s.addShape(pres.ShapeType.roundRect, { x: px, y: py, w: pw, h: qh, rectRadius: 0.06, fill: { color: C.ink }, line: { color: C.ink, width: 0 } });
        const runs = [];
        if (quote.label) runs.push({ text: String(quote.label).toUpperCase(), options: { fontSize: 9.5, bold: true, color: C.accent, charSpacing: 0.6, breakLine: true, paraSpaceAfter: 6 } });
        runs.push({ text: '“' + quote.text + '”', options: { fontSize: 13, bold: true, italic: true, color: C.paper, breakLine: true, paraSpaceAfter: 6 } });
        if (quote.author) runs.push({ text: quote.author, options: { fontSize: 9.5, color: 'B4B4BA' } });
        s.addText(runs, { x: px + 0.3, y: py + 0.1, w: pw - 0.6, h: qh - 0.2, fontFace: B, margin: 0, valign: 'middle', lineSpacingMultiple: 1.15 });
      }
      return s;
    },

    /**
     * Elenco de arquetipos: una columna por arquetipo, con su color.
     * archetypes: [{ name, color, image, claim, examples, base }]  (hasta 4)
     */
    archetypes({ breadcrumb: bc, title: t, lede: ld, archetypes: items = [], footnote, notes }) {
      const s = newSlide(C.paper, notes);
      breadcrumb(s, bc);
      title(s, t, { size: 26, h: 0.7 });
      if (ld) lede(s, ld, { y: 1.6, h: 0.45, size: 12 });
      const y0 = ld ? 2.25 : 1.95, bottom = G.H - (footnote ? 0.95 : 0.6);
      const g = 0.3, n = Math.max(items.length, 1), w = (G.contentW - g * (n - 1)) / n, h = bottom - y0;
      items.forEach((a, i) => {
        const x = G.M + i * (w + g), col = a.color || C.accent;
        s.addShape(pres.ShapeType.rect, { x, y: y0, w, h, fill: { color: tint(col, 0.86) }, line: { color: tint(col, 0.86), width: 0 } });
        s.addShape(pres.ShapeType.rect, { x, y: y0, w, h: 0.08, fill: { color: col }, line: { color: col, width: 0 } });
        let y = y0 + 0.25;
        if (a.image) { addImageOrBlock(s, a.image, { x: x + 0.25, y, w: w - 0.5, h: 1.25 }); y += 1.4; }
        s.addText(String(a.name || '').toUpperCase(), { x: x + 0.25, y, w: w - 0.5, h: 0.35, fontFace: D, fontSize: 14, bold: true, charSpacing: 1, color: col, margin: 0, valign: 'middle' });
        y += 0.42;
        s.addText(rich(a.claim || '', { color: C.ink, bold: true }), { x: x + 0.25, y, w: w - 0.5, h: 0.85, fontFace: D, fontSize: 13.5, margin: 0, valign: 'top', lineSpacingMultiple: 1.15 });
        y += 0.9;
        if (a.examples) s.addText(a.examples, { x: x + 0.25, y, w: w - 0.5, h: 0.5, fontFace: B, fontSize: 10.5, color: C.body, margin: 0, valign: 'top' });
        if (a.base) {
          s.addShape(pres.ShapeType.line, { x: x + 0.25, y: bottom - 1.0, w: w - 0.5, h: 0, line: { color: C.paper, width: 1.5 } });
          s.addText(paragraphs(Array.isArray(a.base) ? a.base : [a.base], { color: C.body }, 2), { x: x + 0.25, y: bottom - 0.92, w: w - 0.5, h: 0.82, fontFace: B, fontSize: 10, margin: 0, valign: 'top' });
        }
      });
      if (footnote) s.addText(footnote, { x: G.M, y: G.H - 0.72, w: G.contentW, h: 0.3, fontFace: B, fontSize: S.caption, color: C.muted, margin: 0, valign: 'middle' });
      return s;
    },

    /**
     * Cómo lo vive cada uno: una columna por segmento, con su lectura y sus citas.
     * segments: [{ name, color, who, image, headline, body, quotes: [{ text, author }] }]  (hasta 3 o 4)
     */
    perSegment({ breadcrumb: bc, title: t, segments = [], source: src, notes }) {
      const s = newSlide(C.paper, notes);
      breadcrumb(s, bc);
      title(s, t, { size: 26, h: 0.7 });
      const y0 = 1.8, bottom = G.H - 0.8;
      const g = 0.3, n = Math.max(segments.length, 1), w = (G.contentW - g * (n - 1)) / n, h = bottom - y0;
      segments.forEach((sg, i) => {
        const x = G.M + i * (w + g), col = sg.color || C.accent;
        card(s, { x, y: y0, w, h });
        s.addShape(pres.ShapeType.rect, { x, y: y0, w, h: 0.08, fill: { color: col }, line: { color: col, width: 0 } });
        let y = y0 + 0.25, tx = x + 0.3;
        if (sg.image) { addImageOrBlock(s, sg.image, { x: x + 0.3, y, w: 0.7, h: 0.7 }); tx = x + 1.15; }
        s.addText([{ text: String(sg.name || '').toUpperCase(), options: { bold: true, color: col, fontSize: 12, charSpacing: 0.8, breakLine: true } }, { text: sg.who || '', options: { color: C.muted, fontSize: 9.5 } }], { x: tx, y, w: x + w - 0.3 - tx, h: 0.7, fontFace: B, margin: 0, valign: 'middle' });
        y += 0.9;
        s.addText(rich(sg.headline || '', { color: C.ink, bold: true }), { x: x + 0.3, y, w: w - 0.6, h: 0.75, fontFace: D, fontSize: 15, margin: 0, valign: 'top', lineSpacingMultiple: 1.1 });
        y += 0.8;
        if (sg.body) { s.addText(rich(sg.body, { color: C.body }), { x: x + 0.3, y, w: w - 0.6, h: 0.75, fontFace: B, fontSize: 11, margin: 0, valign: 'top', lineSpacingMultiple: 1.2 }); y += 0.85; }
        const qs = sg.quotes || [];
        const qh = Math.min(1.05, (bottom - 0.15 - y) / Math.max(qs.length, 1) - 0.12);
        qs.forEach((q) => {
          s.addShape(pres.ShapeType.rect, { x: x + 0.3, y, w: 0.04, h: qh, fill: { color: col }, line: { color: col, width: 0 } });
          s.addText([{ text: '“' + q.text + '”', options: { italic: true, bold: true, color: C.ink, fontSize: 11.5, breakLine: true } }, { text: q.author || '', options: { color: C.muted, fontSize: 9 } }], { x: x + 0.45, y, w: w - 0.75, h: qh, fontFace: B, margin: 0, valign: 'top', lineSpacingMultiple: 1.15 });
          y += qh + 0.12;
        });
      });
      source(s, src);
      return s;
    },

    /**
     * Insight a sangre, con dos llamados opcionales: el vacío que falta medir y una pista en los datos.
     * gap: { label, text }  |  clue: { label, text }  |  evidence: cuántas fuentes lo sostienen
     */
    insight({ eyebrow: eb, text, support, evidence, gap, clue, notes }) {
      const s = newSlide(C.mint, notes);
      let y = 0.95;
      if (eb) { s.addText(String(eb).toUpperCase(), { x: G.M, y, w: G.contentW, h: 0.3, fontFace: B, fontSize: 12, bold: true, charSpacing: 1.5, color: C.accentDeep, margin: 0 }); y += 0.45; }
      // Alto según el largo: el texto empuja lo que viene abajo en vez de pisarlo.
      const plain = Array.isArray(text) ? text.map((p) => (typeof p === 'string' ? p : p.t || '')).join('') : String(text || '');
      const fs = plain.length > 90 ? 30 : 38;
      const cpl = (G.contentW * 0.92 * 72) / (fs * 0.5);
      const th = Math.ceil(plain.length / cpl) * fs * 1.12 / 72 + 0.1;
      s.addText(rich(text, { color: C.ink, bold: true }), { x: G.M, y, w: G.contentW * 0.92, h: th, fontFace: D, fontSize: fs, charSpacing: -0.8, margin: 0, valign: 'top', lineSpacingMultiple: 1.0 });
      y += th + 0.25;
      if (support) { s.addText(rich(support, { color: C.body }), { x: G.M, y, w: G.contentW * 0.85, h: 0.5, fontFace: B, fontSize: 15, margin: 0, valign: 'top' }); y += 0.55; }
      if (evidence) { s.addText(rich(evidence, { color: C.accentDeep, bold: true }), { x: G.M, y, w: G.contentW, h: 0.4, fontFace: B, fontSize: 12.5, margin: 0, valign: 'top' }); y += 0.55; }
      [[gap, 'FDE7E8', 'E5484D', 'B3242A', 'Vacío declarado'], [clue, 'E6EEFB', '3B6FD8', '234B9C', 'Una pista en los datos']].forEach(([c, bg, dot, lab, def]) => {
        if (!c) return;
        const h = 0.95;
        s.addShape(pres.ShapeType.roundRect, { x: G.M, y, w: G.contentW * 0.9, h, rectRadius: 0.08, fill: { color: bg }, line: { color: bg, width: 0 } });
        s.addShape(pres.ShapeType.ellipse, { x: G.M + 0.25, y: y + 0.25, w: 0.45, h: 0.45, fill: { color: dot }, line: { color: dot, width: 0 } });
        s.addText('!', { x: G.M + 0.25, y: y + 0.25, w: 0.45, h: 0.45, fontFace: D, fontSize: 16, bold: true, color: C.paper, align: 'center', valign: 'middle', margin: 0 });
        s.addText([{ text: String(c.label || def).toUpperCase(), options: { bold: true, color: lab, fontSize: 9.5, charSpacing: 1, breakLine: true } }, ...rich(c.text || '', { color: C.ink, fontSize: 12.5 })], { x: G.M + 0.9, y, w: G.contentW * 0.9 - 1.1, h, fontFace: B, margin: 0, valign: 'middle', lineSpacingMultiple: 1.15 });
        y += h + 0.2;
      });
      return s;
    },

    /**
     * Cadena causal: tres o cuatro eslabones con flecha, y una banda para lo que cruza a todos.
     * links: [{ label, title, body, evidence, tone: 'ink' | 'alert' | 'accent' | 'surface' }]  |  band: texto
     */
    causalChain({ breadcrumb: bc, title: t, links = [], band, bandLabel = 'Transversal:', notes }) {
      const s = newSlide(C.paper, notes);
      breadcrumb(s, bc);
      title(s, t, { size: 26, h: 0.7 });
      const y0 = 1.85, bottom = band ? G.H - 1.55 : G.H - 0.8, h = bottom - y0;
      const aw = 0.35, n = Math.max(links.length, 1), w = (G.contentW - aw * (n - 1)) / n;
      const TONE = {
        ink: { bg: C.ink, top: null, lab: C.accent, tit: C.paper, body: 'B4B4BA', ev: C.accent },
        alert: { bg: 'FDE7E8', top: 'E5484D', lab: 'B3242A', tit: C.ink, body: C.body, ev: 'B3242A' },
        accent: { bg: C.mint, top: C.accent, lab: C.accentDeep, tit: C.ink, body: C.body, ev: C.accentDeep },
        surface: { bg: C.surface, top: null, lab: C.label, tit: C.ink, body: C.body, ev: C.label },
      };
      links.forEach((l, i) => {
        const x = G.M + i * (w + aw), tn = TONE[l.tone] || TONE.surface;
        s.addShape(pres.ShapeType.roundRect, { x, y: y0, w, h, rectRadius: 0.06, fill: { color: tn.bg }, line: { color: tn.bg, width: 0 } });
        if (tn.top) s.addShape(pres.ShapeType.rect, { x, y: y0, w, h: 0.08, fill: { color: tn.top }, line: { color: tn.top, width: 0 } });
        s.addText(String(l.label || '').toUpperCase(), { x: x + 0.3, y: y0 + 0.3, w: w - 0.6, h: 0.3, fontFace: B, fontSize: 10, bold: true, charSpacing: 0.8, color: tn.lab, margin: 0 });
        s.addText(rich(l.title || '', { color: tn.tit, bold: true }), { x: x + 0.3, y: y0 + 0.7, w: w - 0.6, h: 1.1, fontFace: D, fontSize: 17, margin: 0, valign: 'top', lineSpacingMultiple: 1.1 });
        s.addText(rich(l.body || '', { color: tn.body }), { x: x + 0.3, y: y0 + 1.9, w: w - 0.6, h: h - 2.8, fontFace: B, fontSize: 11.5, margin: 0, valign: 'top', lineSpacingMultiple: 1.25 });
        if (l.evidence) s.addText(rich(l.evidence, { color: tn.ev, bold: true }), { x: x + 0.3, y: bottom - 0.8, w: w - 0.6, h: 0.6, fontFace: B, fontSize: 10.5, margin: 0, valign: 'bottom' });
        if (i < n - 1) s.addShape(pres.ShapeType.rightArrow, { x: x + w + 0.06, y: y0 + h / 2 - 0.13, w: aw - 0.12, h: 0.26, fill: { color: 'B4B4BA' }, line: { color: 'B4B4BA', width: 0 } });
      });
      if (band) {
        const vy = G.H - 1.3;
        s.addShape(pres.ShapeType.roundRect, { x: G.M, y: vy, w: G.contentW, h: 0.6, rectRadius: 0.3, fill: { color: C.accentDeep }, line: { color: C.accentDeep, width: 0 } });
        s.addText([{ text: bandLabel + ' ', options: { bold: true, color: C.accent } }, ...rich(band, { color: C.paper })], { x: G.M + 0.35, y: vy, w: G.contentW - 0.7, h: 0.6, fontFace: B, fontSize: 12, margin: 0, valign: 'middle' });
      }
      return s;
    },

    /**
     * Lo que todavía no sabemos: vacíos por etapa, cada uno con lo que lo cierra.
     * items: [{ stage, question, closes }]
     */
    unknowns({ breadcrumb: bc, title: t, lede: ld, items = [], closesLabel = 'Lo cierra:', footer, notes }) {
      const s = newSlide(C.paper, notes);
      breadcrumb(s, bc);
      title(s, t, { size: 26, h: 0.95 });
      if (ld) lede(s, ld, { y: 1.95, h: 0.45, size: 12 });
      const y0 = ld ? 2.55 : 2.15, bottom = G.H - (footer ? 1.5 : 0.8);
      const g = 0.15, n = Math.max(items.length, 1), rh = Math.min(1.05, (bottom - y0 - g * (n - 1)) / n);
      items.forEach((it, i) => {
        const y = y0 + i * (rh + g);
        card(s, { x: G.M, y, w: G.contentW, h: rh });
        s.addShape(pres.ShapeType.rect, { x: G.M, y, w: 0.06, h: rh, fill: { color: 'E5484D' }, line: { color: 'E5484D', width: 0 } });
        s.addText(String(it.stage || '').toUpperCase(), { x: G.M + 0.3, y, w: 2.4, h: rh, fontFace: B, fontSize: 10, bold: true, charSpacing: 0.8, color: C.label, margin: 0, valign: 'middle' });
        s.addText(rich(it.question || '', { color: C.ink, bold: true }), { x: G.M + 2.8, y, w: 4.9, h: rh, fontFace: D, fontSize: 13.5, margin: 0, valign: 'middle', lineSpacingMultiple: 1.1 });
        s.addText([{ text: closesLabel + ' ', options: { bold: true, color: C.ink } }, ...rich(it.closes || '', { color: C.body })], { x: G.M + 8.0, y, w: G.contentW - 8.3, h: rh, fontFace: B, fontSize: 11, margin: 0, valign: 'middle', lineSpacingMultiple: 1.15 });
      });
      if (footer) {
        const vy = G.H - 1.3;
        s.addShape(pres.ShapeType.rect, { x: G.M, y: vy, w: G.contentW, h: 0.6, fill: { color: C.ink }, line: { color: C.ink, width: 0 } });
        s.addShape(pres.ShapeType.rect, { x: G.M, y: vy, w: 0.045, h: 0.6, fill: { color: C.accent }, line: { color: C.accent, width: 0 } });
        s.addText(rich(footer, { color: C.paper }), { x: G.M + 0.35, y: vy, w: G.contentW - 0.6, h: 0.6, fontFace: B, fontSize: 12.5, margin: 0, valign: 'middle' });
      }
      return s;
    },


    // -----------------------------------------------------------------------
    // Recomendación y anexo (tanda 2)
    // -----------------------------------------------------------------------

    /**
     * Resultados clave: un objetivo y sus métricas con línea de base, meta y fuente.
     * objective: texto  |  results: [{ metric, baseline, target, source }]
     * Sin baseline, la fila dice "Pendiente de medir" en vez de inventar un número.
     */
    keyResults({ breadcrumb: bc, title: t, objective, objectiveLabel = 'Objetivo', results = [], headers = ['Resultado clave', 'Hoy', 'Meta', 'Fuente'], pendingLabel = 'Pendiente de medir', footnote, notes }) {
      const s = newSlide(C.paper, notes);
      breadcrumb(s, bc);
      title(s, t, { size: 28, h: 0.9 });
      let y = 2.0;
      if (objective) {
        s.addShape(pres.ShapeType.rect, { x: G.M, y, w: G.contentW, h: 0.8, fill: { color: C.accentDeep }, line: { color: C.accentDeep, width: 0 } });
        s.addText([{ text: String(objectiveLabel).toUpperCase(), options: { bold: true, fontSize: 9.5, charSpacing: 1, color: tint(C.accent, 0.4), breakLine: true } }, ...rich(objective, { color: C.paper, bold: true, fontSize: 15 })], { x: G.M + 0.3, y, w: G.contentW - 0.6, h: 0.8, fontFace: B, margin: 0, valign: 'middle' });
        y += 1.05;
      }
      const cw = [5.2, 1.7, 1.7, G.contentW - 8.6];
      const cx = cw.map((_, i) => G.M + cw.slice(0, i).reduce((a, b) => a + b, 0));
      headers.forEach((h, i) => eyebrow(s, h, { x: cx[i] + (i ? 0.1 : 0.55), y, w: cw[i] - 0.2, color: C.hint }));
      y += 0.35;
      const n = Math.max(results.length, 1);
      const rh = Math.min(0.75, (G.H - 1.0 - y) / n - 0.08);
      results.forEach((r, i) => {
        const ry = y + i * (rh + 0.08);
        card(s, { x: G.M, y: ry, w: G.contentW, h: rh });
        s.addText(`KR${i + 1}`, { x: G.M + 0.15, y: ry, w: 0.45, h: rh, fontFace: D, fontSize: 11, bold: true, color: C.label, margin: 0, valign: 'middle' });
        s.addText(rich(r.metric, { color: C.ink, bold: true }), { x: cx[0] + 0.6, y: ry, w: cw[0] - 0.7, h: rh, fontFace: B, fontSize: 12.5, margin: 0, valign: 'middle' });
        const pending = r.baseline == null || r.baseline === '';
        if (pending) {
          s.addShape(pres.ShapeType.roundRect, { x: cx[1] + 0.1, y: ry + rh / 2 - 0.16, w: cw[1] - 0.2, h: 0.32, rectRadius: 0.06, fill: { color: 'FBF0D9' }, line: { color: 'F2B84B', width: 0.75 } });
          s.addText(pendingLabel, { x: cx[1] + 0.1, y: ry + rh / 2 - 0.16, w: cw[1] - 0.2, h: 0.32, fontFace: B, fontSize: 8.5, bold: true, color: '9A6200', align: 'center', valign: 'middle', margin: 0 });
        } else {
          s.addText(String(r.baseline), { x: cx[1] + 0.1, y: ry, w: cw[1] - 0.2, h: rh, fontFace: D, fontSize: String(r.baseline).length > 8 ? 11 : 18, bold: true, color: C.muted, margin: 0, valign: 'middle' });
        }
        s.addText(String(r.target ?? ''), { x: cx[2] + 0.1, y: ry, w: cw[2] - 0.2, h: rh, fontFace: D, fontSize: String(r.target ?? '').length > 8 ? 11 : 18, bold: true, color: C.accent, margin: 0, valign: 'middle' });
        s.addText(rich(r.source || '', { color: C.muted }), { x: cx[3] + 0.1, y: ry, w: cw[3] - 0.25, h: rh, fontFace: B, fontSize: 10, margin: 0, valign: 'middle' });
      });
      source(s, footnote);
      return s;
    },

    /**
     * Matriz de responsabilidades: actividades contra equipos, con el rol de cada uno.
     * columns: ['Equipo A', ...]  |  rows: [{ label, cells: ['R', 'A', '', ...] }]
     * keys: [{ code, label, color }]  (por defecto RACI). Una fila sin owner se marca como hueco.
     */
    ownershipMatrix({ breadcrumb: bc, title: t, lede: ld, columns = [], rows = [], keys, ownerCode = 'A', gapLabel = 'Sin dueño', source: src, notes }) {
      const K = keys || [
        { code: 'R', label: 'Lo hace', color: C.accent },
        { code: 'A', label: 'Decide y responde', color: C.ink },
        { code: 'C', label: 'Se consulta', color: tint(C.accent, 0.6) },
        { code: 'I', label: 'Se informa', color: C.line },
      ];
      const s = newSlide(C.paper, notes);
      breadcrumb(s, bc);
      title(s, t, { size: 28, h: 0.9 });
      if (ld) lede(s, ld, { y: 1.75, h: 0.4, size: 12.5 });
      const labelW = 3.8, gapW = 1.2;
      const nC = Math.max(columns.length, 1);
      const cw = (G.contentW - labelW - gapW) / nC;
      let y = ld ? 2.4 : 2.05;
      columns.forEach((c, i) => s.addText(String(c), { x: G.M + labelW + i * cw, y, w: cw, h: 0.4, fontFace: B, fontSize: 10, bold: true, color: C.ink, align: 'center', valign: 'bottom', margin: 0 }));
      y += 0.5;
      const bottom = G.H - 1.3;
      const rh = Math.min(0.55, (bottom - y) / Math.max(rows.length, 1));
      rows.forEach((r, ri) => {
        const ry = y + ri * rh;
        const gap = !(r.cells || []).includes(ownerCode);
        if (ri % 2 === 0) s.addShape(pres.ShapeType.rect, { x: G.M, y: ry, w: G.contentW, h: rh, fill: { color: C.surface }, line: { color: C.surface, width: 0 } });
        s.addText(rich(r.label, { color: C.ink }), { x: G.M + 0.15, y: ry, w: labelW - 0.25, h: rh, fontFace: B, fontSize: 11, margin: 0, valign: 'middle' });
        (r.cells || []).forEach((v, ci) => {
          const k = K.find((x) => x.code === v);
          if (!k) return;
          const d = Math.min(0.36, rh - 0.12);
          const cxm = G.M + labelW + ci * cw + cw / 2;
          s.addShape(pres.ShapeType.ellipse, { x: cxm - d / 2, y: ry + (rh - d) / 2, w: d, h: d, fill: { color: k.color }, line: { color: k.color, width: 0 } });
          const dark = [C.ink, C.accent, C.accentDeep].includes(k.color);
          s.addText(v, { x: cxm - d / 2, y: ry + (rh - d) / 2, w: d, h: d, fontFace: B, fontSize: 9, bold: true, color: dark ? C.paper : C.ink, align: 'center', valign: 'middle', margin: 0 });
        });
        if (gap) {
          s.addShape(pres.ShapeType.roundRect, { x: G.M + G.contentW - gapW + 0.1, y: ry + rh / 2 - 0.15, w: gapW - 0.15, h: 0.3, rectRadius: 0.06, fill: { color: 'FDE7E8' }, line: { color: 'E5484D', width: 0.75 } });
          s.addText(gapLabel, { x: G.M + G.contentW - gapW + 0.1, y: ry + rh / 2 - 0.15, w: gapW - 0.15, h: 0.3, fontFace: B, fontSize: 8.5, bold: true, color: 'B3242A', align: 'center', valign: 'middle', margin: 0 });
        }
      });
      // Leyenda
      const ly = G.H - 1.05;
      K.forEach((k, i) => {
        const lx = G.M + i * 2.4;
        s.addShape(pres.ShapeType.ellipse, { x: lx, y: ly + 0.04, w: 0.22, h: 0.22, fill: { color: k.color }, line: { color: k.color, width: 0 } });
        s.addText(`${k.code}  ${k.label}`, { x: lx + 0.3, y: ly, w: 2.0, h: 0.3, fontFace: B, fontSize: 9.5, color: C.body, margin: 0, valign: 'middle' });
      });
      source(s, src);
      return s;
    },

    /**
     * Decisiones que pedimos: una tarjeta por decisión, con opciones, la recomendada, por qué, quién y cuándo.
     * decisions: [{ question, options: [], recommended: índice, why, owner, by }]  (hasta 3)
     */
    decisionAsk({ breadcrumb: bc, title: t, lede: ld, decisions = [], labels = {}, footnote, notes }) {
      const L = { recommended: 'Recomendamos', why: 'Por qué', owner: 'Decide', by: 'Para', ...labels };
      const s = newSlide(C.paper, notes);
      breadcrumb(s, bc);
      title(s, t, { size: 28, h: 0.9 });
      if (ld) lede(s, ld, { y: 1.75, h: 0.4, size: 12.5 });
      const n = Math.max(decisions.length, 1), g = 0.3;
      const w = (G.contentW - g * (n - 1)) / n;
      const y0 = ld ? 2.4 : 2.05, h = G.H - 1.05 - y0;
      decisions.forEach((d, i) => {
        const x = G.M + i * (w + g);
        card(s, { x, y: y0, w, h });
        s.addShape(pres.ShapeType.rect, { x, y: y0, w, h: 0.06, fill: { color: C.ink }, line: { color: C.ink, width: 0 } });
        eyebrow(s, `Decisión ${i + 1}`, { x: x + 0.25, y: y0 + 0.22, w: w - 0.5 });
        s.addText(rich(d.question, { color: C.ink, bold: true }), { x: x + 0.25, y: y0 + 0.5, w: w - 0.5, h: 0.85, fontFace: D, fontSize: 15, margin: 0, valign: 'top' });
        let oy = y0 + 1.45;
        (d.options || []).forEach((o, oi) => {
          const rec = oi === d.recommended;
          s.addShape(pres.ShapeType.roundRect, { x: x + 0.25, y: oy, w: w - 0.5, h: 0.42, rectRadius: 0.05, fill: { color: rec ? C.mint : C.paper }, line: { color: rec ? C.accent : C.line, width: rec ? 1.25 : 0.75 } });
          s.addText([{ text: rec ? `${L.recommended}: ` : '', options: { bold: true, color: C.label } }, ...rich(o, { color: C.ink })], { x: x + 0.4, y: oy, w: w - 0.8, h: 0.42, fontFace: B, fontSize: 10.5, margin: 0, valign: 'middle' });
          oy += 0.5;
        });
        if (d.why) {
          s.addText([{ text: `${L.why}: `, options: { bold: true, color: C.ink } }, ...rich(d.why, { color: C.body })], { x: x + 0.25, y: oy + 0.1, w: w - 0.5, h: y0 + h - 0.75 - oy - 0.1, fontFace: B, fontSize: 10.5, margin: 0, valign: 'top', lineSpacingMultiple: 1.2 });
        }
        s.addShape(pres.ShapeType.line, { x: x + 0.25, y: y0 + h - 0.6, w: w - 0.5, h: 0, line: { color: C.line, width: 0.75 } });
        s.addText([{ text: `${L.owner}: `, options: { color: C.muted } }, { text: d.owner || '[PENDIENTE]', options: { bold: true, color: C.ink } }, { text: `   ${L.by}: `, options: { color: C.muted } }, { text: d.by || '[PENDIENTE]', options: { bold: true, color: C.ink } }], { x: x + 0.25, y: y0 + h - 0.55, w: w - 0.5, h: 0.4, fontFace: B, fontSize: 10, margin: 0, valign: 'middle' });
      });
      source(s, footnote);
      return s;
    },

    /**
     * Triangulación: un hallazgo, las fuentes que lo miran y el nivel de certeza al que llega.
     * sources: [{ type, detail, says, agrees: 'si' | 'parcial' | 'no' }]
     * level: 'hipotesis' | 'indicio' | 'patron' | 'solida'
     */
    triangulation({ breadcrumb: bc, title: t, finding, sources: srcs = [], level, levelText, levels = ['Hipótesis', 'Indicio', 'Patrón', 'Evidencia sólida'], agreeLabels = { si: 'Coincide', parcial: 'Matiza', no: 'Contradice' }, source: src, notes }) {
      const s = newSlide(C.paper, notes);
      breadcrumb(s, bc);
      title(s, t, { size: 28, h: 0.9 });
      let y = 1.95;
      if (finding) {
        s.addShape(pres.ShapeType.rect, { x: G.M, y, w: 0.06, h: 0.6, fill: { color: C.accent }, line: { color: C.accent, width: 0 } });
        s.addText(rich(finding, { color: C.ink, bold: true }), { x: G.M + 0.25, y, w: G.contentW - 0.25, h: 0.6, fontFace: D, fontSize: 16, margin: 0, valign: 'middle' });
        y += 0.85;
      }
      const AG = { si: [C.accent, C.mint], parcial: ['F2B84B', 'FBF0D9'], no: ['E5484D', 'FDE7E8'] };
      const n = Math.max(srcs.length, 1), g = 0.25;
      const w = (G.contentW - g * (n - 1)) / n, h = 2.45;
      srcs.forEach((so, i) => {
        const x = G.M + i * (w + g);
        const [col, bg] = AG[so.agrees] || AG.si;
        card(s, { x, y, w, h });
        s.addShape(pres.ShapeType.rect, { x, y, w, h: 0.06, fill: { color: col }, line: { color: col, width: 0 } });
        eyebrow(s, so.type, { x: x + 0.2, y: y + 0.2, w: w - 0.4 });
        s.addText(rich(so.detail || '', { color: C.muted }), { x: x + 0.2, y: y + 0.45, w: w - 0.4, h: 0.3, fontFace: B, fontSize: 9.5, margin: 0, valign: 'top' });
        s.addText(rich(so.says || '', { color: C.ink }), { x: x + 0.2, y: y + 0.8, w: w - 0.4, h: h - 1.35, fontFace: B, fontSize: 11.5, margin: 0, valign: 'top', lineSpacingMultiple: 1.2 });
        s.addShape(pres.ShapeType.roundRect, { x: x + 0.2, y: y + h - 0.45, w: 1.15, h: 0.28, rectRadius: 0.06, fill: { color: bg }, line: { color: col, width: 0.75 } });
        s.addText(agreeLabels[so.agrees] || agreeLabels.si, { x: x + 0.2, y: y + h - 0.45, w: 1.15, h: 0.28, fontFace: B, fontSize: 8.5, bold: true, color: C.ink, align: 'center', valign: 'middle', margin: 0 });
      });
      y += h + 0.35;
      // Escala de certeza
      const keys = ['hipotesis', 'indicio', 'patron', 'solida'];
      const li = keys.indexOf(level);
      const sw = 1.55;
      levels.forEach((lv, i) => {
        const on = i === li, past = i < li;
        const x = G.M + i * (sw + 0.06);
        s.addShape(pres.ShapeType.rect, { x, y, w: sw, h: 0.42, fill: { color: on ? C.ink : past ? C.mintBand : C.surface }, line: { color: on ? C.ink : C.line, width: 0.5 } });
        s.addText(lv, { x, y, w: sw, h: 0.42, fontFace: B, fontSize: 10, bold: on, color: on ? C.paper : C.muted, align: 'center', valign: 'middle', margin: 0 });
      });
      if (levelText) s.addText(rich(levelText, { color: C.body }), { x: G.M + 4 * (sw + 0.06) + 0.25, y: y - 0.05, w: G.contentW - 4 * (sw + 0.06) - 0.25, h: 0.52, fontFace: B, fontSize: 11, margin: 0, valign: 'middle' });
      source(s, src);
      return s;
    },

    /**
     * Qué ya tiene dueño: lo que surgió, ordenado en tres columnas.
     * items: [{ name, status: 'existe' | 'reconocido' | 'afuera', body }]
     */
    ownerCheck({ breadcrumb: bc, title: t, lede: ld, items = [], columns: cols, source: src, notes }) {
      const COLS = cols || [
        { key: 'existe', label: 'Ya existe', note: 'tiene dueño y está en marcha', color: C.accent },
        { key: 'reconocido', label: 'Reconocido', note: 'alguien lo nombró, nadie lo tiene', color: 'F2B84B' },
        { key: 'afuera', label: 'Afuera del alcance', note: 'se registra y no se trabaja ahora', color: C.hint },
      ];
      const s = newSlide(C.paper, notes);
      breadcrumb(s, bc);
      title(s, t, { size: 28, h: 0.9 });
      if (ld) lede(s, ld, { y: 1.75, h: 0.4, size: 12.5 });
      const g = 0.3, w = (G.contentW - g * (COLS.length - 1)) / COLS.length;
      const y0 = ld ? 2.4 : 2.05;
      COLS.forEach((c, ci) => {
        const x = G.M + ci * (w + g);
        s.addShape(pres.ShapeType.rect, { x, y: y0, w, h: 0.06, fill: { color: c.color }, line: { color: c.color, width: 0 } });
        const list = items.filter((it) => it.status === c.key);
        s.addText([{ text: `${c.label}  `, options: { bold: true, color: C.ink, fontSize: 15 } }, { text: String(list.length), options: { bold: true, color: c.color === C.hint ? C.muted : c.color, fontSize: 15 } }], { x, y: y0 + 0.15, w, h: 0.4, fontFace: D, margin: 0, valign: 'middle' });
        s.addText(c.note, { x, y: y0 + 0.52, w, h: 0.28, fontFace: B, fontSize: 10, color: C.muted, margin: 0, valign: 'middle' });
        const top = y0 + 0.95, bottom = G.H - 1.0;
        const ih = Math.min(0.85, (bottom - top) / Math.max(list.length, 1) - 0.1);
        list.forEach((it, i) => {
          const iy = top + i * (ih + 0.1);
          card(s, { x, y: iy, w, h: ih, fill: c.key === 'afuera' ? C.paper : C.surface });
          if (c.key === 'afuera') s.addShape(pres.ShapeType.roundRect, { x, y: iy, w, h: ih, rectRadius: 0.05, fill: { type: 'none' }, line: { color: C.line, width: 0.75, dashType: 'dash' } });
          s.addText([{ text: it.name, options: { bold: true, color: C.ink, fontSize: 11.5, breakLine: !!it.body } }, ...(it.body ? rich(it.body, { color: C.muted, fontSize: 10 }) : [])], { x: x + 0.2, y: iy, w: w - 0.4, h: ih, fontFace: B, margin: 0, valign: 'middle', lineSpacingMultiple: 1.15 });
        });
      });
      source(s, src);
      return s;
    },

    /**
     * Tabla de muestra: quiénes participaron, con totales arriba.
     * headers: ['Código', 'Perfil', ...]  |  rows: [['E1', 'Socio', ...]]  |  totals: [{ value, label }]
     */
    sampleTable({ breadcrumb: bc, title: t, lede: ld, totals = [], headers = [], rows = [], colW, source: src, notes }) {
      const s = newSlide(C.paper, notes);
      breadcrumb(s, bc);
      title(s, t, { size: 28, h: 0.9 });
      if (ld) lede(s, ld, { y: 1.75, h: 0.4, size: 12.5 });
      let y = ld ? 2.35 : 2.0;
      if (totals.length) {
        const tw = G.contentW / totals.length;
        totals.forEach((tt, i) => {
          const x = G.M + i * tw;
          if (i) s.addShape(pres.ShapeType.line, { x, y: y + 0.05, w: 0, h: 0.6, line: { color: C.line, width: 0.75 } });
          s.addText([{ text: String(tt.value), options: { fontFace: D, fontSize: 26, bold: true, color: i === 0 ? C.accent : C.ink, breakLine: true } }, { text: tt.label, options: { fontSize: 10, color: C.muted } }], { x: x + (i ? 0.2 : 0), y, w: tw - 0.2, h: 0.75, fontFace: B, margin: 0, valign: 'top' });
        });
        y += 0.95;
      }
      const widths = colW || headers.map(() => G.contentW / Math.max(headers.length, 1));
      const avail = G.H - 0.95 - y;
      const rh = Math.min(0.34, avail / (rows.length + 1));
      const fs = rh < 0.28 ? 8.5 : 10;
      const head = headers.map((h) => ({ text: String(h).toUpperCase(), options: { bold: true, color: C.label, fontSize: 8.5, fill: { color: C.paper }, border: [{ type: 'none' }, { type: 'none' }, { pt: 1, color: C.ink }, { type: 'none' }] } }));
      const body = rows.map((r, ri) => r.map((v) => ({ text: String(v ?? ''), options: { color: C.body, fontSize: fs, fill: { color: ri % 2 ? C.paper : C.surface }, border: [{ type: 'none' }, { type: 'none' }, { pt: 0.5, color: C.line }, { type: 'none' }] } })));
      s.addTable([head, ...body], { x: G.M, y, w: G.contentW, colW: widths, rowH: rh, fontFace: B, margin: [0.03, 0.1, 0.03, 0.1], valign: 'middle' });
      source(s, src);
      return s;
    },

    /**
     * Verbatims: grilla de citas textuales sobre un tema, cada una con su código y una etiqueta.
     * quotes: [{ text, author, tag }]  (hasta 6)  |  tags: [{ name, color }] opcional
     */
    verbatimGrid({ breadcrumb: bc, title: t, lede: ld, quotes = [], tags = [], source: src, notes }) {
      const s = newSlide(C.paper, notes);
      breadcrumb(s, bc);
      title(s, t, { size: 28, h: 0.9 });
      if (ld) lede(s, ld, { y: 1.75, h: 0.4, size: 12.5 });
      const cols = quotes.length > 4 ? 3 : 2, rowsN = Math.ceil(quotes.length / cols) || 1;
      const g = 0.25, w = (G.contentW - g * (cols - 1)) / cols;
      const y0 = ld ? 2.4 : 2.05, h = (G.H - 1.0 - y0 - g * (rowsN - 1)) / rowsN;
      quotes.forEach((q, i) => {
        const x = G.M + (i % cols) * (w + g), y = y0 + Math.floor(i / cols) * (h + g);
        const tg = tags.find((x2) => x2.name === q.tag);
        const col = (tg && tg.color) || C.accent;
        card(s, { x, y, w, h });
        s.addShape(pres.ShapeType.rect, { x, y, w: 0.06, h, fill: { color: col }, line: { color: col, width: 0 } });
        s.addText('“', { x: x + 0.2, y: y + 0.05, w: 0.5, h: 0.5, fontFace: D, fontSize: 36, bold: true, color: col, margin: 0, valign: 'top' });
        s.addText(rich(q.text, { color: C.ink, italic: true }), { x: x + 0.25, y: y + 0.45, w: w - 0.5, h: h - 0.9, fontFace: B, fontSize: cols === 3 ? 11.5 : 13, margin: 0, valign: 'top', lineSpacingMultiple: 1.2 });
        s.addText([{ text: q.author || '', options: { bold: true, color: C.ink } }, ...(q.tag ? [{ text: `   ${q.tag}`, options: { color: C.muted } }] : [])], { x: x + 0.25, y: y + h - 0.42, w: w - 0.5, h: 0.3, fontFace: B, fontSize: 9.5, margin: 0, valign: 'middle' });
      });
      source(s, src);
      return s;
    },

    /**
     * Cifra contra cifra: dos números que juntos cuentan la tensión, y la lectura.
     * left / right: { value, label, source }  |  connector: palabra del medio  |  reading: la conclusión
     */
    comparisonStat({ breadcrumb: bc, title: t, left = {}, right = {}, connector = 'contra', reading, source: src, notes }) {
      const s = newSlide(C.paper, notes);
      breadcrumb(s, bc);
      title(s, t, { size: 28, h: 0.9 });
      const y0 = 2.25, h = 2.7, mid = 1.4;
      const w = (G.contentW - mid) / 2;
      [[left, C.ink, C.surface], [right, C.paper, C.ink]].forEach(([d, fg, bg], i) => {
        const x = G.M + i * (w + mid);
        card(s, { x, y: y0, w, h, fill: bg });
        s.addText(String(d.value ?? ''), { x: x + 0.4, y: y0 + 0.35, w: w - 0.8, h: 1.2, fontFace: D, fontSize: 66, bold: true, color: i ? tint(C.accent, 0.2) : C.ink, margin: 0, valign: 'middle', charSpacing: -1.5 });
        s.addText(rich(d.label || '', { color: fg }), { x: x + 0.4, y: y0 + 1.6, w: w - 0.8, h: 0.6, fontFace: B, fontSize: 14, margin: 0, valign: 'top' });
        if (d.source) s.addText(d.source, { x: x + 0.4, y: y0 + h - 0.45, w: w - 0.8, h: 0.3, fontFace: B, fontSize: 9, color: i ? 'B9B9BE' : C.hint, margin: 0, valign: 'middle' });
      });
      s.addText(connector, { x: G.M + w, y: y0, w: mid, h, fontFace: D, fontSize: 16, bold: true, color: C.muted, align: 'center', valign: 'middle', margin: 0 });
      if (reading) {
        const ry = y0 + h + 0.35;
        s.addShape(pres.ShapeType.rect, { x: G.M, y: ry, w: G.contentW, h: 0.8, fill: { color: C.mintBand }, line: { color: C.mintBand, width: 0 } });
        s.addText(rich(reading, { color: C.ink }), { x: G.M + 0.35, y: ry, w: G.contentW - 0.7, h: 0.8, fontFace: B, fontSize: 14, margin: 0, valign: 'middle' });
      }
      source(s, src);
      return s;
    },

    /** Escotilla de escape: slide en blanco con el fondo elegido, para casos raros. */
    blank({ background = C.paper, breadcrumb: bc, notes } = {}) {
      const s = newSlide(background, notes);
      if (bc) breadcrumb(s, bc, isDark(background, C));
      return s;
    },

    save(path) {
      if (reemplazosDeRaya) console.warn(`deck-kit: se reemplazaron ${reemplazosDeRaya} textos con raya larga o punto medio. Revisar que la puntuación haya quedado bien.`);
      return pres.writeFile({ fileName: path });
    },
  };

  return api;
}

module.exports = { createDeck, TOKENS, rich, paragraphs };
