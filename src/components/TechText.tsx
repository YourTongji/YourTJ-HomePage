import React, { useEffect, useRef } from 'react';
import { loadMistWasm, type MistWasmInstance } from '../wasm/mistFluidWasm';
import './TechText.css';

let wasmInstance: MistWasmInstance | null = null;
if (typeof window !== 'undefined') {
  loadMistWasm()
    .then((w) => {
      wasmInstance = w;
    })
    .catch(() => undefined);
}

const LABEL_FONT = '10px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
const FALLOFF_STEPS = 8;
const SPRING = 320;
const DAMPING = 22;

const approach = (current: number, target: number, dt: number, seconds: number): number =>
  current + (target - current) * (1 - Math.exp(-dt / seconds));


const noise = (...values: number[]): number => {
  let h = 2166136261;
  for (const value of values) {
    h = Math.imul(h ^ (value | 0), 16777619);
    h ^= h >>> 13;
    h = Math.imul(h, 0x5bd1e995);
    h ^= h >>> 15;
  }
  return (h >>> 0) / 4294967296;
};

const signed = (value: number): string => (value > 0 ? `+${value}` : value < 0 ? `−${-value}` : '0');

export interface TechTextProps {
  text?: string;
  fontFamily?: string;
  fontWeight?: number | string;
  fontSize?: number;
  letterSpacing?: number;
  color?: string | ((char: string, index: number) => string);
  accentColor?: string;
  reach?: number;
  softness?: number;
  dashLength?: number;
  dashGap?: number;
  strokeWidth?: number;
  lineStyle?: 'dashed' | 'solid';
  reveal?: 'area' | 'letter' | 'off';
  specks?: number;
  selection?: boolean;
  labels?: boolean;
  draggable?: boolean;
  sweep?: boolean;
  sweepDirection?: 'ltr' | 'rtl';
  speed?: number;
  align?: 'left' | 'center' | 'right';
  padLeft?: number;
  lines?: string[];
  lineGap?: number;
  bleed?: number;
  className?: string;
  style?: React.CSSProperties;
}

interface WordMetrics {
  size: number;
  baseline: number;
  left: number;
  right: number;
  top: number;
  bottom: number;
}

interface GlyphSprite {
  image: HTMLCanvasElement;
  left: number;
  top: number;
}

interface DirtyRect {
  x: number;
  y: number;
  w: number;
  h: number;
  lx: number;
  rx: number;
  ty: number;
  by: number;
}

interface GlyphItem {
  char: string;
  x: number;
  baseline: number;
  box: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  };
  offset: { x: number; y: number };
  velocity: { x: number; y: number };
  outline: number;
  index: number;
  fill: GlyphSprite;
  dashes: GlyphSprite;
}

export const TechText: React.FC<TechTextProps> = ({
  text,
  lines,
  lineGap,
  bleed = 100,
  fontFamily = '',
  fontWeight = 600,
  fontSize = 150,
  letterSpacing = -0.05,
  color = '#ffffff',
  accentColor = '#ffffff',
  reach = 200,
  softness = 0.7,
  dashLength = 4,
  dashGap = 2,
  strokeWidth = 1.5,
  lineStyle = 'dashed',
  reveal = 'letter',
  specks = 15,
  selection = true,
  labels = true,
  draggable = true,
  sweep = true,
  sweepDirection = 'ltr',
  speed = 1,
  align = 'center',
  padLeft = 8,
  className = '',
  style,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const settingsRef = useRef<TechTextProps | null>(null);
  const wakeRef = useRef<() => void>(() => {});

  useEffect(() => {
    settingsRef.current = {
      text: text || (lines ? lines.join(' ') : 'React Bits'),
      lines,
      lineGap,
      bleed,
      fontFamily,
      fontWeight,
      fontSize,
      letterSpacing,
      color,
      accentColor,
      reach,
      softness,
      dashLength,
      dashGap,
      strokeWidth,
      lineStyle,
      reveal,
      specks,
      selection,
      labels,
      draggable,
      sweep,
      sweepDirection,
      speed,
      align,
      padLeft,
    };
    wakeRef.current();
  });

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const scratch = document.createElement('canvas');
    const scratchCtx = scratch.getContext('2d');
    if (!container || !canvas || !ctx || !scratchCtx) return undefined;

    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    let width = 1;
    let height = 1;
    let dpr = 1;
    let raf = 0;
    let last = performance.now();
    let visible = true;
    let alive = true;
    let layoutKey = '';
    let requestedFont = '';
    let word: WordMetrics | null = null;
    let glyphs: GlyphItem[] = [];
    let presence = 0;
    let clock = 0;
    let pulse = 0;
    let placed = false;
    let dragging = -1;
    const pointer = { x: 0, y: 0, inside: false };
    const grab = { x: 0, y: 0 };
    const lens = { x: 0, y: 0 };
    const frame = { x1: 0, y1: 0, x2: 0, y2: 0, alpha: 0, index: -1 };
    let fullRenderNeeded = true;
    const lastDirtyBox: DirtyRect = { x: 0, y: 0, w: 0, h: 0, lx: 0, rx: 0, ty: 0, by: 0 };
    let hasLastDirty = false;
    const currDirtyBox: DirtyRect = { x: 0, y: 0, w: 0, h: 0, lx: 0, rx: 0, ty: 0, by: 0 };
    const tempGlyphDirtyBox: DirtyRect = { x: 0, y: 0, w: 0, h: 0, lx: 0, rx: 0, ty: 0, by: 0 };
    const unionClearBox = { minX: 0, minY: 0, maxX: 0, maxY: 0, lx: 0, rx: 0, ty: 0, by: 0, active: false };

    const refreshFonts = () => {
      layoutKey = '';
      wakeRef.current();
    };

    const family = (s: TechTextProps) =>
      s.fontFamily || (container ? getComputedStyle(container).fontFamily : '') || 'sans-serif';
    const fontFor = (s: TechTextProps, size: number) => `${s.fontWeight} ${size}px ${family(s)}`;

    const setFont = (target: CanvasRenderingContext2D, s: TechTextProps, size: number) => {
      target.font = fontFor(s, size);
      if ('letterSpacing' in target && typeof s.letterSpacing === 'number') {
        (target as unknown as { letterSpacing: string }).letterSpacing = `${s.letterSpacing * size}px`;
      }
      target.textAlign = 'left';
      target.textBaseline = 'alphabetic';
    };

    const sprite = (
      s: TechTextProps,
      view: WordMetrics,
      glyph: { char: string; x: number; baseline: number; box: { x1: number; y1: number; x2: number; y2: number }; index: number },
      stroke: boolean
    ): GlyphSprite => {
      const pad = Math.ceil((s.strokeWidth ?? 1.5) * 2 + 4);
      const left = glyph.box.x1 - pad;
      const top = glyph.box.y1 - pad;
      const w = glyph.box.x2 - glyph.box.x1 + pad * 2;
      const h = glyph.box.y2 - glyph.box.y1 + pad * 2;
      const image = document.createElement('canvas');
      image.width = Math.max(1, Math.ceil(w * dpr));
      image.height = Math.max(1, Math.ceil(h * dpr));
      const c = image.getContext('2d');
      if (!c) return { image, left, top };
      c.setTransform(dpr, 0, 0, dpr, -left * dpr, -top * dpr);
      setFont(c, s, view.size);

      const glyphColor =
        typeof s.color === 'function' ? s.color(glyph.char, glyph.index) : s.color || '#ffffff';

      if (stroke) {
        c.lineJoin = 'round';
        c.lineWidth = (s.strokeWidth ?? 1.5) * 2;
        c.lineCap = 'butt';
        c.strokeStyle = glyphColor;
        if (s.lineStyle !== 'solid') {
          c.setLineDash([Math.max(1, s.dashLength ?? 4), Math.max(1, s.dashGap ?? 2)]);
        }
        c.strokeText(glyph.char, glyph.x, glyph.baseline);
        c.setLineDash([]);
        c.globalCompositeOperation = 'destination-out';
        c.fillStyle = '#000000';
        c.fillText(glyph.char, glyph.x, glyph.baseline);
        c.globalCompositeOperation = 'source-over';
      } else {
        c.fillStyle = glyphColor;
        c.fillText(glyph.char, glyph.x, glyph.baseline);
      }
      return { image, left, top };
    };

    const ensureLayout = (s: TechTextProps): WordMetrics => {
      const bleed = Math.max(0, s.bleed ?? 100);
      const linesList: string[] =
        s.lines && s.lines.length > 0
          ? s.lines
          : s.text
          ? s.text.includes('\n')
            ? s.text.split('\n')
            : [s.text]
          : [''];

      const colorKey =
        typeof s.color === 'function'
          ? `${s.color('Y', 0)}|${s.color('T', 4)}|${s.accentColor}`
          : `${s.color}|${s.accentColor}`;
      const key = [
        linesList.join('//'),
        s.text,
        family(s),
        s.fontWeight,
        s.fontSize,
        s.letterSpacing,
        colorKey,
        s.dashLength,
        s.dashGap,
        s.strokeWidth,
        s.lineStyle,
        s.align,
        s.padLeft,
        s.lineGap,
        bleed,
        width,
        height,
        dpr,
      ].join('|');
      if (key === layoutKey && word) return word;
      layoutKey = key;
      const wanted = fontFor(s, 64);
      if (document.fonts && wanted !== requestedFont) {
        requestedFont = wanted;
        document.fonts.load(wanted, linesList.join(' ')).then(refreshFonts, refreshFonts);
      }

      const probe = scratchCtx;
      const targetFontSize = s.fontSize ?? 150;
      setFont(probe, s, targetFontSize);

      let maxLineInkWidth = 0;
      linesList.forEach((line) => {
        const m = probe.measureText(line);
        const w = m.actualBoundingBoxLeft + m.actualBoundingBoxRight;
        if (w > maxLineInkWidth) maxLineInkWidth = w;
      });

      const lineGapVal = s.lineGap ?? Math.round(targetFontSize * 0.22);
      const estTotalHeight = linesList.length * targetFontSize + (linesList.length - 1) * lineGapVal;

      const fit = Math.min(
        1,
        (width * 0.96) / Math.max(maxLineInkWidth, 1),
        (height * 0.92) / Math.max(estTotalHeight, 1)
      );
      const size = targetFontSize * fit;
      const actualLineGap = lineGapVal * fit;
      setFont(probe, s, size);

      let minLeft = Infinity;
      let maxRight = -Infinity;
      let minTop = Infinity;
      let maxBottom = -Infinity;

      const lineMetrics = linesList.map((line) => {
        const m = probe.measureText(line);
        return {
          m,
          inkWidth: m.actualBoundingBoxLeft + m.actualBoundingBoxRight,
          ascent: m.actualBoundingBoxAscent,
          descent: m.actualBoundingBoxDescent,
        };
      });

      const totalBlockHeight =
        lineMetrics.reduce((sum, lm) => sum + lm.ascent + lm.descent, 0) +
        Math.max(0, linesList.length - 1) * actualLineGap;

      const startY = (height - totalBlockHeight) / 2;
      let currentY = startY;

      const previous = glyphs;
      glyphs = [];
      let charIndex = 0;

      linesList.forEach((line, lineIdx) => {
        const lm = lineMetrics[lineIdx];
        const lineBaseline = currentY + lm.ascent;
        currentY += lm.ascent + lm.descent + actualLineGap;

        const alignMode = s.align || 'center';
        const pLeft = s.padLeft ?? 8;
        const x =
          alignMode === 'left'
            ? lm.m.actualBoundingBoxLeft + pLeft
            : alignMode === 'right'
            ? width - lm.inkWidth - pLeft + lm.m.actualBoundingBoxLeft
            : (width - lm.inkWidth) / 2 + lm.m.actualBoundingBoxLeft;

        const leftEdge = x - lm.m.actualBoundingBoxLeft;
        const rightEdge = x + lm.m.actualBoundingBoxRight;
        const topEdge = lineBaseline - lm.ascent;
        const bottomEdge = lineBaseline + lm.descent;

        if (leftEdge < minLeft) minLeft = leftEdge;
        if (rightEdge > maxRight) maxRight = rightEdge;
        if (topEdge < minTop) minTop = topEdge;
        if (bottomEdge > maxBottom) maxBottom = bottomEdge;

        let prefix = '';
        Array.from(line).forEach((char) => {
          prefix += char;
          const own = probe.measureText(char);
          const gx = x + probe.measureText(prefix).width - own.width;
          if (!char.trim()) return;
          const base = {
            char,
            x: gx,
            baseline: lineBaseline,
            index: charIndex++,
            box: {
              x1: gx - own.actualBoundingBoxLeft,
              y1: lineBaseline - own.actualBoundingBoxAscent,
              x2: gx + own.actualBoundingBoxRight,
              y2: lineBaseline + own.actualBoundingBoxDescent,
            },
          };
          const kept = previous[glyphs.length];
          glyphs.push({
            ...base,
            offset: kept?.char === char ? kept.offset : { x: 0, y: 0 },
            velocity: { x: 0, y: 0 },
            outline: 0,
            fill: sprite(
              s,
              { size, baseline: lineBaseline, left: minLeft, right: maxRight, top: minTop, bottom: maxBottom },
              base,
              false
            ),
            dashes: sprite(
              s,
              { size, baseline: lineBaseline, left: minLeft, right: maxRight, top: minTop, bottom: maxBottom },
              base,
              true
            ),
          });
        });
      });

      if (wasmInstance && glyphs.length > 0) {
        const count = Math.min(glyphs.length, 128);
        const boxesPtr = wasmInstance.get_glyph_boxes_ptr();
        const boxesView = new Float32Array(wasmInstance.memory.buffer, boxesPtr, count * 4);
        for (let i = 0; i < count; i++) {
          boxesView[i * 4] = glyphs[i].box.x1;
          boxesView[i * 4 + 1] = glyphs[i].box.y1;
          boxesView[i * 4 + 2] = glyphs[i].box.x2;
          boxesView[i * 4 + 3] = glyphs[i].box.y2;
        }
      }

      const next: WordMetrics = {
        size,
        baseline: lineMetrics[0]?.ascent ?? 0,
        left: minLeft === Infinity ? 0 : minLeft,
        right: maxRight === -Infinity ? width : maxRight,
        top: minTop === Infinity ? 0 : minTop,
        bottom: maxBottom === -Infinity ? height : maxBottom,
      };
      word = next;
      dragging = -1;
      frame.index = -1;
      fullRenderNeeded = true;
      return next;
    };

    const glyphAt = (x: number, y: number): number => {
      if (wasmInstance && glyphs.length > 0) {
        const count = Math.min(glyphs.length, 128);
        const offPtr = wasmInstance.get_glyph_offsets_ptr();
        const offView = new Float32Array(wasmInstance.memory.buffer, offPtr, count * 2);
        for (let i = 0; i < count; i++) {
          offView[i * 2] = glyphs[i].offset.x;
          offView[i * 2 + 1] = glyphs[i].offset.y;
        }
        const hit = wasmInstance.find_glyph_at(x, y, count);
        if (hit >= 0) return hit;
      }

      const PAD_X = 6;
      const PAD_Y = 6;
      for (let i = 0; i < glyphs.length; i++) {
        const glyph = glyphs[i];
        const x1 = glyph.box.x1 + glyph.offset.x - PAD_X;
        const x2 = glyph.box.x2 + glyph.offset.x + PAD_X;
        const y1 = glyph.box.y1 + glyph.offset.y - PAD_Y;
        const y2 = glyph.box.y2 + glyph.offset.y + PAD_Y;
        if (x >= x1 && x <= x2 && y >= y1 && y <= y2) {
          return i;
        }
      }

      let best = -1;
      let bestDistance = Infinity;
      for (let i = 0; i < glyphs.length; i++) {
        const glyph = glyphs[i];
        const x1 = glyph.box.x1 + glyph.offset.x - PAD_X;
        const x2 = glyph.box.x2 + glyph.offset.x + PAD_X;
        const y1 = glyph.box.y1 + glyph.offset.y - PAD_Y;
        const y2 = glyph.box.y2 + glyph.offset.y + PAD_Y;
        if (y < y1 - 8 || y > y2 + 8) continue;
        const dx = x < x1 ? x1 - x : x > x2 ? x - x2 : 0;
        const dy = y < y1 ? y1 - y : y > y2 ? y - y2 : 0;
        const d = Math.hypot(dx, dy);
        if (d < bestDistance) {
          bestDistance = d;
          best = i;
        }
      }
      return bestDistance < 8 ? best : -1;
    };

    const falloff = (
      target: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      radius: number,
      strength: number,
      softness: number
    ): CanvasGradient => {
      const safeRadius = Math.max(0.1, radius);
      const inner = Math.min(1, Math.max(0, 1 - softness));
      const gradient = target.createRadialGradient(cx, cy, 0, cx, cy, safeRadius);
      gradient.addColorStop(0, `rgba(0, 0, 0, ${strength})`);
      if (inner > 0.995) {
        gradient.addColorStop(0.995, `rgba(0, 0, 0, ${strength})`);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        return gradient;
      }
      for (let i = 0; i <= FALLOFF_STEPS; i++) {
        const t = i / FALLOFF_STEPS;
        const eased = t * t * (3 - 2 * t);
        gradient.addColorStop(inner + (1 - inner) * t, `rgba(0, 0, 0, ${strength * (1 - eased)})`);
      }
      return gradient;
    };

    const blit = (
      target: CanvasRenderingContext2D,
      art: GlyphSprite,
      dx: number,
      dy: number,
      originX: number,
      originY: number
    ) => {
      const s = settingsRef.current;
      const bleed = Math.max(0, s?.bleed ?? 100);
      target.drawImage(
        art.image,
        Math.round((art.left + dx + bleed) * dpr - originX),
        Math.round((art.top + dy + bleed) * dpr - originY)
      );
    };

    const drawReveal = (s: TechTextProps) => {
      const bleed = Math.max(0, s.bleed ?? 100);
      const radius = (s.reach ?? 200) * dpr;
      const cx = (lens.x + bleed) * dpr;
      const cy = (lens.y + bleed) * dpr;
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = falloff(ctx, cx, cy, radius, presence, s.softness ?? 0.7);
      ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);
      ctx.globalCompositeOperation = 'source-over';

      const x0 = Math.max(0, Math.floor(cx - radius));
      const y0 = Math.max(0, Math.floor(cy - radius));
      const x1 = Math.min(canvas.width, Math.ceil(cx + radius));
      const y1 = Math.min(canvas.height, Math.ceil(cy + radius));
      if (x1 <= x0 || y1 <= y0) return;
      const w = x1 - x0;
      const h = y1 - y0;
      if (scratch.width < w || scratch.height < h) {
        scratch.width = Math.max(scratch.width, w);
        scratch.height = Math.max(scratch.height, h);
      }
      scratchCtx.setTransform(1, 0, 0, 1, 0, 0);
      scratchCtx.globalCompositeOperation = 'source-over';
      scratchCtx.clearRect(0, 0, w, h);
      for (const glyph of glyphs) blit(scratchCtx, glyph.dashes, glyph.offset.x, glyph.offset.y, x0, y0);
      scratchCtx.globalCompositeOperation = 'destination-in';
      scratchCtx.fillStyle = falloff(scratchCtx, cx - x0, cy - y0, radius, 1, s.softness ?? 0.7);
      scratchCtx.fillRect(0, 0, w, h);
      scratchCtx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = presence;
      ctx.drawImage(scratch, 0, 0, w, h, x0, y0, w, h);
      ctx.globalAlpha = 1;
    };

    const crisp = (value: number) => (Math.round(value * dpr) + 0.5) / dpr;

    const perimeterPoint = (distance: number, w: number, h: number): [number, number, number, number] => {
      let d = ((distance % (2 * (w + h))) + 2 * (w + h)) % (2 * (w + h));
      if (d < w) return [frame.x1 + d, frame.y1, 0, -1];
      d -= w;
      if (d < h) return [frame.x2, frame.y1 + d, 1, 0];
      d -= h;
      if (d < w) return [frame.x2 - d, frame.y2, 0, 1];
      d -= h;
      return [frame.x1, frame.y2 - d, -1, 0];
    };


    const drawSpecks = (s: TechTextProps, a: number) => {
      const w = frame.x2 - frame.x1;
      const h = frame.y2 - frame.y1;
      if (w < 2 || h < 2) return;
      const perimeter = 2 * (w + h);
      const seed = frame.index + 1;
      const grid = 3;
      const accent = s.accentColor || '#ffffff';
      ctx.fillStyle = accent;
      ctx.strokeStyle = accent;
      const speckCount = Math.min(s.specks ?? 12, 8);

      for (let k = 0; k < speckCount; k++) {
        const period = 0.5 + noise(seed, k, 11) * 1.2;
        const t = pulse / period + noise(seed, k, 17);
        const cycle = Math.floor(t);
        const life = t - cycle;
        if (life > 0.7) continue;
        const [px, py, nx, ny] = perimeterPoint(noise(seed, k, cycle) * perimeter, w, h);
        const pick = noise(seed, k, cycle, 2);
        const size = pick < 0.46 ? 2 : pick < 0.7 ? 3 : pick < 0.84 ? 5 : 8;
        const large = size >= 8;
        const out = (large ? 8 : 4) + Math.floor(noise(seed, k, cycle, 1) * 4) * grid;
        const x = frame.x1 + Math.round((px + nx * out - frame.x1) / grid) * grid;
        const y = frame.y1 + Math.round((py + ny * out - frame.y1) / grid) * grid;
        const tone = noise(seed, k, cycle, 3);
        const blink = life < 0.06 || (life > 0.32 && life < 0.36) ? 0.35 : 1;
        const alpha = a * (large ? 0.3 + 0.4 * tone : 0.3 + 0.6 * tone) * blink;
        const left = Math.round(x - size / 2);
        const top = Math.round(y - size / 2);
        ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
        if (tone < 0.26 || (large && tone < 0.78)) {
          ctx.strokeRect(left + 0.5, top + 0.5, size, size);
          if (large && tone > 0.5) {
            ctx.fillRect(Math.round(x) - 1, Math.round(y) - 1, 2, 2);
          }
        } else {
          ctx.fillRect(left, top, size, size);
        }
      }

      for (let j = 0; j < 2; j++) {
        const head = (pulse * 0.42 * (s.speed ?? 1) + j * 0.5) * perimeter;
        for (let i = 0; i < 3; i++) {
          const [x, y] = perimeterPoint(head - i * 6, w, h);
          const size = i === 0 ? 3 : 2;
          const dotAlpha = a * (i === 0 ? 0.9 : i === 1 ? 0.5 : 0.25);
          ctx.globalAlpha = Math.max(0, Math.min(1, dotAlpha));
          ctx.fillRect(Math.round(x - size / 2), Math.round(y - size / 2), size, size);
        }
      }
      ctx.globalAlpha = 1;
    };

    const drawFrame = (s: TechTextProps) => {
      const glyph = glyphs[frame.index];
      if (!glyph || frame.alpha < 0.01) return;
      const a = frame.alpha;
      const x1 = crisp(frame.x1);
      const y1 = crisp(frame.y1);
      const x2 = crisp(frame.x2);
      const y2 = crisp(frame.y2);
      const accent = s.accentColor || '#ffffff';
      const bleed = Math.max(0, s.bleed ?? 100);
      ctx.setTransform(dpr, 0, 0, dpr, bleed * dpr, bleed * dpr);
      ctx.fillStyle = accent;
      ctx.strokeStyle = accent;

      const moved = Math.hypot(glyph.offset.x, glyph.offset.y);
      if (moved > 1) {
        const hx = (glyph.box.x1 + glyph.box.x2) / 2;
        const hy = (glyph.box.y1 + glyph.box.y2) / 2;
        ctx.beginPath();
        ctx.moveTo(hx, hy);
        ctx.lineTo(hx + glyph.offset.x, hy + glyph.offset.y);
        ctx.setLineDash([3, 4]);
        ctx.lineWidth = 1;
        ctx.globalAlpha = Math.max(0, Math.min(1, 0.45 * a));
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.rect(Math.round(hx) - 2, Math.round(hy) - 2, 4, 4);
        ctx.globalAlpha = Math.max(0, Math.min(1, 0.7 * a));
        ctx.fill();
      }

      ctx.beginPath();
      ctx.rect(x1, y1, x2 - x1, y2 - y1);
      ctx.lineWidth = 1;
      ctx.globalAlpha = Math.max(0, Math.min(1, 0.5 * a));
      ctx.stroke();

      ctx.beginPath();
      for (const [cx, cy] of [
        [x1, y1],
        [x2, y1],
        [x2, y2],
        [x1, y2],
      ]) {
        ctx.rect(Math.round(cx) - 2, Math.round(cy) - 2, 5, 5);
      }
      ctx.globalAlpha = Math.max(0, Math.min(1, 0.95 * a));
      ctx.fill();

      if ((s.specks ?? 15) > 0) {
        ctx.lineWidth = 1;
        drawSpecks(s, a);
      }

      if (!s.labels) {
        ctx.globalAlpha = 1;
        return;
      }
      ctx.font = LABEL_FONT;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'bottom';
      ctx.globalAlpha = Math.max(0, Math.min(1, 0.62 * a));
      const label =
        moved > 1
          ? `${signed(Math.round(glyph.offset.x))}, ${signed(Math.round(-glyph.offset.y))}`
          : `${glyph.char}  ${Math.round(glyph.box.x2 - glyph.box.x1)} × ${Math.round(glyph.box.y2 - glyph.box.y1)}`;
      ctx.fillText(label, Math.round(frame.x1), Math.round(frame.y1) - 7);
      ctx.globalAlpha = 1;
    };

    const computeFrameDirtyBox = (
      target: DirtyRect,
      fx1: number,
      fy1: number,
      fx2: number,
      fy2: number,
      bleed: number,
      targetDpr: number
    ): void => {
      const pad = 34;
      const padTop = 34;
      const minW = 110;
      const x1 = Math.min(fx1, fx2);
      const x2 = Math.max(fx1, fx2);
      const y1 = Math.min(fy1, fy2);
      const y2 = Math.max(fy1, fy2);

      const lx = x1 - pad;
      const rx = Math.max(x2 + pad, x1 + minW);
      const ty = y1 - padTop;
      const by = y2 + pad;

      const px1 = Math.max(0, Math.floor((lx + bleed) * targetDpr) - 2);
      const py1 = Math.max(0, Math.floor((ty + bleed) * targetDpr) - 2);
      const px2 = Math.min(canvas.width, Math.ceil((rx + bleed) * targetDpr) + 2);
      const py2 = Math.min(canvas.height, Math.ceil((by + bleed) * targetDpr) + 2);

      target.x = px1;
      target.y = py1;
      target.w = Math.max(0, px2 - px1);
      target.h = Math.max(0, py2 - py1);
      target.lx = lx;
      target.rx = rx;
      target.ty = ty;
      target.by = by;
    };

    const computeGlyphDirtyBox = (
      target: DirtyRect,
      g: GlyphItem,
      bleed: number,
      targetDpr: number
    ): void => {
      const pad = 16;
      const lx = Math.min(g.box.x1, g.box.x1 + g.offset.x) - pad;
      const rx = Math.max(g.box.x2, g.box.x2 + g.offset.x) + pad;
      const ty = Math.min(g.box.y1, g.box.y1 + g.offset.y) - pad;
      const by = Math.max(g.box.y2, g.box.y2 + g.offset.y) + pad;

      const px1 = Math.max(0, Math.floor((lx + bleed) * targetDpr) - 2);
      const py1 = Math.max(0, Math.floor((ty + bleed) * targetDpr) - 2);
      const px2 = Math.min(canvas.width, Math.ceil((rx + bleed) * targetDpr) + 2);
      const py2 = Math.min(canvas.height, Math.ceil((by + bleed) * targetDpr) + 2);

      target.x = px1;
      target.y = py1;
      target.w = Math.max(0, px2 - px1);
      target.h = Math.max(0, py2 - py1);
      target.lx = lx;
      target.rx = rx;
      target.ty = ty;
      target.by = by;
    };

    const intersectsBounds = (g: GlyphItem, lx: number, rx: number, ty: number, by: number): boolean => {
      const pad = 10;
      const gx1 = Math.min(g.box.x1, g.box.x1 + g.offset.x) - pad;
      const gx2 = Math.max(g.box.x2, g.box.x2 + g.offset.x) + pad;
      const gy1 = Math.min(g.box.y1, g.box.y1 + g.offset.y) - pad;
      const gy2 = Math.max(g.box.y2, g.box.y2 + g.offset.y) + pad;
      return !(gx2 < lx || gx1 > rx || gy2 < ty || gy1 > by);
    };

    const renderFull = () => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const glyph of glyphs) {
        const moved = Math.hypot(glyph.offset.x, glyph.offset.y);
        if (moved > 1) {
          ctx.globalAlpha = Math.min(1, moved / 24) * 0.55;
          blit(ctx, glyph.dashes, 0, 0, 0, 0);
          ctx.globalAlpha = 1;
        }
      }
      for (const glyph of glyphs) {
        if (glyph.outline < 0.999) {
          ctx.globalAlpha = 1 - glyph.outline;
          blit(ctx, glyph.fill, glyph.offset.x, glyph.offset.y, 0, 0);
        }
        if (glyph.outline > 0.001) {
          ctx.globalAlpha = glyph.outline;
          blit(ctx, glyph.dashes, glyph.offset.x, glyph.offset.y, 0, 0);
        }
        ctx.globalAlpha = 1;
      }
    };

    let lastRenderTime = 0;
    const TARGET_FPS = 59.65;
    const FRAME_MS = 1000 / TARGET_FPS; // Exact 59.65 FPS top-off cap

    const tick = (now: number) => {
      raf = 0;
      if (now - lastRenderTime < FRAME_MS) {
        if (visible && alive) raf = requestAnimationFrame(tick);
        return;
      }
      lastRenderTime = now - ((now - lastRenderTime) % FRAME_MS);
      const s = settingsRef.current;
      if (!s) return;
      const dt = Math.min(0.05, Math.max(0.001, (now - last) / 1000));
      last = now;
      const view = ensureLayout(s);

      const speedVal = s.speed ?? 1;
      const sweeping = s.sweep && !reducedMotion && !pointer.inside && dragging < 0;
      if (sweeping) clock += dt * speedVal;
      pulse += dt;
      let targetX = pointer.x;
      let targetY = pointer.y;
      if (sweeping) {
        const isRtl = s.sweepDirection === 'rtl';
        const cosFactor = isRtl ? 0.5 : -0.5;
        const sinFactor = isRtl ? -0.1 : 0.1;
        targetX = view.left + (view.right - view.left) * (0.5 + cosFactor * Math.cos(clock * 0.45));
        targetY = view.top + (view.bottom - view.top) * (0.45 + sinFactor * Math.sin(clock * 0.8));
      }
      const active = pointer.inside || sweeping || dragging >= 0;
      if (active && !placed) {
        lens.x = targetX;
        lens.y = targetY;
      }
      if (active) {
        const lag = pointer.inside ? 0.08 : 0.22;
        lens.x = approach(lens.x, targetX, dt, lag);
        lens.y = approach(lens.y, targetY, dt, lag);
      }
      placed = active;
      presence = approach(presence, s.reveal === 'area' && active && dragging < 0 ? 1 : 0, dt, 0.2);

      let moving = false;
      if (wasmInstance && glyphs.length > 0) {
        const count = Math.min(glyphs.length, 128);
        const offPtr = wasmInstance.get_glyph_offsets_ptr();
        const velPtr = wasmInstance.get_glyph_velocities_ptr();
        const offView = new Float32Array(wasmInstance.memory.buffer, offPtr, count * 2);
        const velView = new Float32Array(wasmInstance.memory.buffer, velPtr, count * 2);
        for (let i = 0; i < count; i++) {
          offView[i * 2] = glyphs[i].offset.x;
          offView[i * 2 + 1] = glyphs[i].offset.y;
          velView[i * 2] = glyphs[i].velocity.x;
          velView[i * 2 + 1] = glyphs[i].velocity.y;
        }
        const anyMoving = wasmInstance.update_glyph_springs(
          count,
          dragging,
          pointer.x - grab.x,
          pointer.y - grab.y,
          dt,
          SPRING,
          DAMPING
        );
        for (let i = 0; i < count; i++) {
          glyphs[i].offset.x = offView[i * 2];
          glyphs[i].offset.y = offView[i * 2 + 1];
          glyphs[i].velocity.x = velView[i * 2];
          glyphs[i].velocity.y = velView[i * 2 + 1];
        }
        if (anyMoving) moving = true;
      } else {
        glyphs.forEach((glyph, i) => {
          if (i === dragging) {
            glyph.offset.x = approach(glyph.offset.x, pointer.x - grab.x, dt, 0.04);
            glyph.offset.y = approach(glyph.offset.y, pointer.y - grab.y, dt, 0.04);
            glyph.velocity.x = 0;
            glyph.velocity.y = 0;
            moving = true;
            return;
          }
          const { offset, velocity } = glyph;
          if (Math.abs(offset.x) < 0.05 && Math.abs(offset.y) < 0.05 && Math.hypot(velocity.x, velocity.y) < 0.5) {
            offset.x = 0;
            offset.y = 0;
            velocity.x = 0;
            velocity.y = 0;
            return;
          }
          velocity.x += (-SPRING * offset.x - DAMPING * velocity.x) * dt;
          velocity.y += (-SPRING * offset.y - DAMPING * velocity.y) * dt;
          offset.x += velocity.x * dt;
          offset.y += velocity.y * dt;
          moving = true;
        });
      }

      const focus = dragging >= 0 ? dragging : active ? glyphAt(lens.x, lens.y) : -1;
      if (focus >= 0 && s.selection) {
        const glyph = glyphs[focus];
        const bx1 = glyph.box.x1 + glyph.offset.x - 6;
        const by1 = glyph.box.y1 + glyph.offset.y - 6;
        const bx2 = glyph.box.x2 + glyph.offset.x + 6;
        const by2 = glyph.box.y2 + glyph.offset.y + 6;
        if (frame.index < 0 || frame.alpha < 0.02) {
          frame.x1 = bx1;
          frame.y1 = by1;
          frame.x2 = bx2;
          frame.y2 = by2;
        }
        const glide = focus === dragging ? 0.04 : 0.12;
        frame.x1 = approach(frame.x1, bx1, dt, glide);
        frame.y1 = approach(frame.y1, by1, dt, glide);
        frame.x2 = approach(frame.x2, bx2, dt, glide);
        frame.y2 = approach(frame.y2, by2, dt, glide);
        frame.index = focus;
      }
      frame.alpha = approach(frame.alpha, focus >= 0 && s.selection ? 1 : 0, dt, 0.12);

      glyphs.forEach((glyph, i) => {
        const target = s.reveal === 'letter' && i === focus && i !== dragging ? 1 : 0;
        glyph.outline = approach(glyph.outline, target, dt, 0.15);
        if (Math.abs(glyph.outline - target) > 0.002) moving = true;
        else glyph.outline = target;
      });

      if (s.draggable) container.style.cursor = dragging >= 0 ? 'grabbing' : focus >= 0 && pointer.inside ? 'grab' : '';

      const bleed = Math.max(0, s.bleed ?? 100);

      if (fullRenderNeeded || dragging >= 0 || presence > 0.001) {
        renderFull();
        if (presence > 0.001) drawReveal(s);
        if (frame.alpha > 0.005) {
          drawFrame(s);
          computeFrameDirtyBox(lastDirtyBox, frame.x1, frame.y1, frame.x2, frame.y2, bleed, dpr);
          hasLastDirty = true;
        } else {
          hasLastDirty = false;
        }
        fullRenderNeeded = false;
      } else {
        unionClearBox.active = false;
        const includeBox = (b: DirtyRect) => {
          if (!unionClearBox.active) {
            unionClearBox.minX = b.x;
            unionClearBox.minY = b.y;
            unionClearBox.maxX = b.x + b.w;
            unionClearBox.maxY = b.y + b.h;
            unionClearBox.lx = b.lx;
            unionClearBox.rx = b.rx;
            unionClearBox.ty = b.ty;
            unionClearBox.by = b.by;
            unionClearBox.active = true;
          } else {
            if (b.x < unionClearBox.minX) unionClearBox.minX = b.x;
            if (b.y < unionClearBox.minY) unionClearBox.minY = b.y;
            if (b.x + b.w > unionClearBox.maxX) unionClearBox.maxX = b.x + b.w;
            if (b.y + b.h > unionClearBox.maxY) unionClearBox.maxY = b.y + b.h;
            if (b.lx < unionClearBox.lx) unionClearBox.lx = b.lx;
            if (b.rx > unionClearBox.rx) unionClearBox.rx = b.rx;
            if (b.ty < unionClearBox.ty) unionClearBox.ty = b.ty;
            if (b.by > unionClearBox.by) unionClearBox.by = b.by;
          }
        };

        if (hasLastDirty) {
          includeBox(lastDirtyBox);
        }
        if (frame.alpha > 0.005) {
          computeFrameDirtyBox(currDirtyBox, frame.x1, frame.y1, frame.x2, frame.y2, bleed, dpr);
          includeBox(currDirtyBox);
        }

        for (let i = 0; i < glyphs.length; i++) {
          const glyph = glyphs[i];
          if ((glyph.outline > 0.002 && glyph.outline < 0.998) || Math.hypot(glyph.offset.x, glyph.offset.y) > 0.05) {
            computeGlyphDirtyBox(tempGlyphDirtyBox, glyph, bleed, dpr);
            includeBox(tempGlyphDirtyBox);
          }
        }

        if (unionClearBox.active) {
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          ctx.clearRect(
            unionClearBox.minX,
            unionClearBox.minY,
            Math.max(0, unionClearBox.maxX - unionClearBox.minX),
            Math.max(0, unionClearBox.maxY - unionClearBox.minY)
          );
          let hits: Uint8Array | null = null;
          if (wasmInstance && glyphs.length > 0) {
            const count = Math.min(glyphs.length, 128);
            const offPtr = wasmInstance.get_glyph_offsets_ptr();
            const offView = new Float32Array(wasmInstance.memory.buffer, offPtr, count * 2);
            for (let i = 0; i < count; i++) {
              offView[i * 2] = glyphs[i].offset.x;
              offView[i * 2 + 1] = glyphs[i].offset.y;
            }
            wasmInstance.check_dirty_intersections(
              count,
              unionClearBox.lx,
              unionClearBox.rx,
              unionClearBox.ty,
              unionClearBox.by
            );
            const hitsPtr = wasmInstance.get_glyph_hits_ptr();
            hits = new Uint8Array(wasmInstance.memory.buffer, hitsPtr, count);
          }
          for (let i = 0; i < glyphs.length; i++) {
            const glyph = glyphs[i];
            const isHit = hits && i < hits.length
              ? hits[i] === 1
              : intersectsBounds(glyph, unionClearBox.lx, unionClearBox.rx, unionClearBox.ty, unionClearBox.by);
            if (!isHit) {
              continue;
            }
            const moved = Math.hypot(glyph.offset.x, glyph.offset.y);
            if (moved > 1) {
              ctx.globalAlpha = Math.min(1, moved / 24) * 0.55;
              blit(ctx, glyph.dashes, 0, 0, 0, 0);
              ctx.globalAlpha = 1;
            }
            if (glyph.outline < 0.999) {
              ctx.globalAlpha = 1 - glyph.outline;
              blit(ctx, glyph.fill, glyph.offset.x, glyph.offset.y, 0, 0);
            }
            if (glyph.outline > 0.001) {
              ctx.globalAlpha = glyph.outline;
              blit(ctx, glyph.dashes, glyph.offset.x, glyph.offset.y, 0, 0);
            }
            ctx.globalAlpha = 1;
          }
        }

        if (frame.alpha > 0.005) {
          drawFrame(s);
          lastDirtyBox.x = currDirtyBox.x;
          lastDirtyBox.y = currDirtyBox.y;
          lastDirtyBox.w = currDirtyBox.w;
          lastDirtyBox.h = currDirtyBox.h;
          lastDirtyBox.lx = currDirtyBox.lx;
          lastDirtyBox.rx = currDirtyBox.rx;
          lastDirtyBox.ty = currDirtyBox.ty;
          lastDirtyBox.by = currDirtyBox.by;
          hasLastDirty = true;
        } else {
          hasLastDirty = false;
        }
      }

      const settling =
        moving ||
        sweeping ||
        Math.abs(presence - (s.reveal === 'area' && active && dragging < 0 ? 1 : 0)) > 0.002 ||
        frame.alpha > 0.005 ||
        hasLastDirty;
      if ((active || settling) && visible && alive) raf = requestAnimationFrame(tick);
    };

    const wake = () => {
      if (raf || !visible || !alive) return;
      lastRenderTime = 0;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };
    wakeRef.current = wake;

    const resize = () => {
      width = Math.max(1, container.clientWidth);
      height = Math.max(1, container.clientHeight);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const s = settingsRef.current;
      const bleed = Math.max(0, s?.bleed ?? 100);
      canvas.width = Math.round((width + bleed * 2) * dpr);
      canvas.height = Math.round((height + bleed * 2) * dpr);
      canvas.style.left = `-${bleed}px`;
      canvas.style.top = `-${bleed}px`;
      canvas.style.width = `${width + bleed * 2}px`;
      canvas.style.height = `${height + bleed * 2}px`;
      layoutKey = '';
      fullRenderNeeded = true;
      wake();
    };

    const locate = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
    };
    const onMove = (e: PointerEvent) => {
      locate(e);
      pointer.inside = true;
      wake();
    };
    const onLeave = () => {
      if (dragging >= 0) return;
      pointer.inside = false;
      wake();
    };
    const onDown = (e: PointerEvent) => {
      locate(e);
      pointer.inside = true;
      const s = settingsRef.current;
      if (s?.draggable && (e.pointerType !== 'mouse' || e.button === 0)) {
        const index = glyphAt(pointer.x, pointer.y);
        if (index >= 0) {
          dragging = index;
          grab.x = pointer.x - glyphs[index].offset.x;
          grab.y = pointer.y - glyphs[index].offset.y;
          container.setPointerCapture?.(e.pointerId);
          fullRenderNeeded = true;
        }
      }
      wake();
    };
    const onUp = (e: PointerEvent) => {
      if (dragging >= 0) {
        dragging = -1;
        container.releasePointerCapture?.(e.pointerId);
        const rect = container.getBoundingClientRect();
        pointer.inside =
          e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
        fullRenderNeeded = true;
      }
      wake();
    };

    container.addEventListener('pointermove', onMove, { passive: true });
    container.addEventListener('pointerenter', onMove, { passive: true });
    container.addEventListener('pointerdown', onDown, { passive: true });
    container.addEventListener('pointerup', onUp, { passive: true });
    container.addEventListener('pointercancel', onUp, { passive: true });
    container.addEventListener('pointerleave', onLeave, { passive: true });

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      wake();
    });
    intersectionObserver.observe(container);
    if (document.fonts) document.fonts.ready.then(refreshFonts, refreshFonts);

    resize();

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      wakeRef.current = () => {};
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      container.removeEventListener('pointermove', onMove);
      container.removeEventListener('pointerenter', onMove);
      container.removeEventListener('pointerdown', onDown);
      container.removeEventListener('pointerup', onUp);
      container.removeEventListener('pointercancel', onUp);
      container.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`tech-text ${className}`.trim()}
      style={style}
      role="img"
      aria-label={text}
    >
      <canvas ref={canvasRef} className="tech-text-canvas" />
    </div>
  );
};

export default TechText;
