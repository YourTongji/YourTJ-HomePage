'use client';

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import type Matter from 'matter-js';
import './FolderFloat.css';

export type FolderItem =
  | string
  | {
      label: string;
      value: string;
      icon?: React.ReactNode;
      color?: string;
      lightBg?: string;
      lightBorder?: string;
      lightInk?: string;
      darkBg?: string;
      darkBorder?: string;
      darkInk?: string;
      glow?: string;
    };

export interface FolderFloatProps {
  items?: FolderItem[];
  label?: string;
  sublabel?: string;
  trigger?: 'hover' | 'click' | 'scroll' | 'manual';
  defaultOpen?: boolean;
  isOpen?: boolean;
  selectedValue?: string;
  closeOnSelect?: boolean;
  physics?: boolean;
  drift?: number;
  onSelect?: (value: string, index: number) => void;
  onOpenChange?: (open: boolean) => void;
  folderColor?: string;
  frontColor?: string;
  paperColor?: string;
  itemColor?: string;
  itemTextColor?: string;
  labelColor?: string;
  width?: number;
  height?: number;
  radius?: number;
  spread?: number;
  lift?: number;
  tilt?: number;
  flapAngle?: number;
  restAngle?: number;
  openDuration?: number;
  stagger?: number;
  bounce?: number;
  ceiling?: number;
  className?: string;
}

const DEFAULT_ITEMS: FolderItem[] = [
  'Try a warmer palette',
  'Tighten the spacing',
  'Logo feels small',
  'Love the new hero',
];
const PAD = 24;
const CHAR = 6.8;
const GAP = 10;
const ROW = 44;
const DRAG_MIN = 4;
const ZONE_PAD = 8;

const jitter = (i: number): number => {
  const x = Math.sin(i * 12.9898 + 4.1414) * 43758.5453;
  return x - Math.floor(x);
};

interface ItemSize {
  w: number;
  h: number;
}

interface ItemPos {
  x: number;
  y: number;
  r: number;
}

const layout = (
  list: { label: string; value: string; icon?: React.ReactNode }[],
  spread: number,
  lift: number,
  tilt: number,
  sizes: (ItemSize | null)[],
  ceiling?: number
): ItemPos[] => {
  const rows: { items: { i: number; pw: number }[]; width: number }[] = [];
  let row: { i: number; pw: number }[] = [];
  let width = 0;

  list.forEach((item, i) => {
    const pw = sizes[i]?.w ?? (PAD + (item.icon ? 18 : 0) + item.label.length * CHAR);
    if (row.length && width + GAP + pw > spread * 2) {
      rows.push({ items: row, width });
      row = [];
      width = 0;
    }
    row.push({ i, pw });
    width += (row.length > 1 ? GAP : 0) + pw;
  });

  if (row.length) rows.push({ items: row, width });

  // Dynamically calibrate row vertical gap if total height would approach ceiling
  const rowCount = Math.max(1, rows.length);
  const maxAvailableVertical = ceiling ? ceiling - lift - 28 : rowCount * ROW;
  const rowGap = Math.min(ROW, Math.max(28, maxAvailableVertical / Math.max(1, rowCount - 1)));

  const pos: ItemPos[] = [];
  rows.forEach((r, ri) => {
    let x = -r.width / 2;
    // Alternate row shift so items don't align in a grid
    const shift = (ri % 2 ? 1 : -1) * Math.min(22, spread * 0.12);
    r.items.forEach(({ i, pw }) => {
      const j = jitter(i);
      // Gentle radial curvature: items farther from center curve slightly downward
      const normX = Math.abs(x + pw / 2) / Math.max(1, spread);
      const arcDroop = Math.min(10, Math.pow(normX, 1.5) * 8);

      const computedY = -lift - ri * rowGap - j * 4 + arcDroop;
      const clampedY = ceiling ? Math.max(computedY, -ceiling + 18) : computedY;

      pos[i] = {
        x: x + pw / 2 + shift + (j - 0.5) * 8,
        y: clampedY,
        r: tilt * (j * 2 - 1),
      };
      x += pw + GAP;
    });
  });

  return pos;
};

interface DragState {
  i: number;
  id: number;
  dx: number;
  dy: number;
  sx: number;
  sy: number;
  moved: boolean;
}

interface WorldState {
  engine: Matter.Engine | null;
  matter: typeof Matter | null;
  bodies: Matter.Body[];
  sizes: ItemSize[];
  raf: number;
  last: number;
  t0: number;
  drag: DragState | null;
  zone: { left: number; right: number; top: number; bottom: number } | null;
  live: boolean;
}

export const FolderFloat: React.FC<FolderFloatProps> = ({
  items = DEFAULT_ITEMS,
  label = 'Design feedback',
  sublabel = '',
  trigger = 'hover',
  defaultOpen = false,
  isOpen,
  selectedValue,
  closeOnSelect = true,
  physics = true,
  drift = 0.5,
  onSelect,
  onOpenChange,
  folderColor = '#3f3f46',
  frontColor = '#52525b',
  paperColor = '#f5f5f5',
  itemColor = '#f5f5f5',
  itemTextColor = '#18181b',
  labelColor = '#f5f5f5',
  width = 200,
  height = 148,
  radius = 14,
  spread = 180,
  lift = 26,
  tilt = 8,
  flapAngle = 34,
  restAngle = 16,
  openDuration = 520,
  stagger = 45,
  bounce = 0.3,
  ceiling,
  className = '',
}) => {
  const [open, setOpen] = useState(defaultOpen);
  const [popped, setPopped] = useState(-1);
  const [live, setLive] = useState(false);
  const [sizes, setSizes] = useState<(ItemSize | null)[]>([]);
  const anchorRef = useRef<HTMLDivElement>(null);
  const pillRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const world = useRef<WorldState>({
    engine: null,
    matter: null,
    bodies: [],
    sizes: [],
    raf: 0,
    last: 0,
    t0: 0,
    drag: null,
    zone: null,
    live: false,
  });
  const openRef = useRef(open);
  openRef.current = open;
  const latest = useRef<{
    onSelect?: (value: string, index: number) => void;
    onOpenChange?: (open: boolean) => void;
    drift: number;
    reduce: boolean;
  }>({
    onSelect,
    onOpenChange,
    drift,
    reduce: false,
  });
  latest.current = { onSelect, onOpenChange, drift, reduce: false };

  const popTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const liveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const list = items.map((item) =>
    typeof item === 'string' ? { label: item, value: item, icon: undefined } : item
  );
  const n = list.length;
  const sub = sublabel !== undefined ? sublabel : `${n} ${n === 1 ? 'note' : 'notes'}`;
  const pos = layout(list, spread, lift, tilt, sizes, ceiling);

  const labelsKey = list.map((item) => item.label).join('|');

  useLayoutEffect(() => {
    const measure = () => {
      const next = pillRefs.current
        .slice(0, n)
        .map((el) => (el ? { w: el.offsetWidth, h: el.offsetHeight } : null));
      if (next.some((s) => !s)) return;
      setSizes((prev) =>
        prev.length === next.length && prev.every((s, i) => s && next[i] && s.w === next[i]?.w && s.h === next[i]?.h)
          ? prev
          : next
      );
    };
    measure();
    if (document.fonts) {
      document.fonts.ready.then(measure);
    }
  }, [n, labelsKey]);

  const stopPhysics = useCallback(() => {
    const w = world.current;
    clearTimeout(liveTimer.current);
    cancelAnimationFrame(w.raf);
    w.raf = 0;
    if (w.engine) {
      w.bodies.forEach((b, i) => {
        const el = pillRefs.current[i];
        if (!el) return;
        el.style.setProperty('--x', `${b.position.x.toFixed(1)}px`);
        el.style.setProperty('--y', `${(b.position.y - w.sizes[i].h / 2).toFixed(1)}px`);
      });
      w.matter?.Composite.clear(w.engine.world, false, true);
      w.matter?.Engine.clear(w.engine);
      w.engine = null;
      w.matter = null;
    }
    w.bodies = [];
    w.drag = null;
    w.live = false;
    setLive(false);
  }, []);

  const startPhysics = useCallback(async () => {
    const w = world.current;
    if (w.engine) return;
    const els = pillRefs.current.slice(0, n);
    if (els.some((el) => !el)) return;

    const { default: Matter } = await import('matter-js');
    if (!openRef.current || w.engine) return;
    const { Bodies, Body, Composite, Engine } = Matter;

    const engine = Engine.create({ gravity: { x: 0, y: 0 } });
    engine.enableSleeping = false;
    w.matter = Matter;
    w.engine = engine;
    w.sizes = els.map((el) => ({ w: el?.offsetWidth ?? 0, h: el?.offsetHeight ?? 0 }));
    const ys = pos.map((p) => p.y);
    const minCalculatedY = Math.min(...ys);
    const topLimit = ceiling ? Math.max(minCalculatedY - ZONE_PAD, -ceiling) : minCalculatedY - ZONE_PAD;
    const zone = {
      left: -spread - ZONE_PAD - 24,
      right: spread + ZONE_PAD + 24,
      top: topLimit,
      bottom: -lift + Math.max(...w.sizes.map((s) => s.h)),
    };
    w.zone = zone;
    w.bodies = els.map((_el, i) => {
      const { w: bw, h: bh } = w.sizes[i];
      const b = Bodies.rectangle(pos[i].x, pos[i].y + bh / 2, bw, bh, {
        chamfer: { radius: Math.min(bh / 2 - 1, 16) },
        restitution: 0.55,
        friction: 0,
        frictionAir: 0.08,
        inertia: Infinity,
      });
      (b as unknown as { plugin: { phase: number } }).plugin = { phase: jitter(i) * Math.PI * 2 };
      return b;
    });

    const T = 80;
    const walls = [
      Bodies.rectangle(
        (zone.left + zone.right) / 2,
        zone.top - T / 2,
        zone.right - zone.left + 2 * T,
        T,
        { isStatic: true }
      ),
      Bodies.rectangle(
        (zone.left + zone.right) / 2,
        zone.bottom + T / 2,
        zone.right - zone.left + 2 * T,
        T,
        { isStatic: true }
      ),
      Bodies.rectangle(
        zone.left - T / 2,
        (zone.top + zone.bottom) / 2,
        T,
        zone.bottom - zone.top + 2 * T,
        { isStatic: true }
      ),
      Bodies.rectangle(
        zone.right + T / 2,
        (zone.top + zone.bottom) / 2,
        T,
        zone.bottom - zone.top + 2 * T,
        { isStatic: true }
      ),
    ];
    Composite.add(engine.world, [...w.bodies, ...walls]);
    w.live = true;
    w.last = 0;
    w.t0 = performance.now();
    setLive(true);

    const tick = (now: number) => {
      const s = world.current;
      if (!s.engine) return;
      const dt = s.last ? Math.min(32, now - s.last) : 16;
      s.last = now;
      const t = (now - s.t0) / 1000;
      const k = latest.current.drift * 0.00005 * Math.min(1, t / 2);

      s.bodies.forEach((b, i) => {
        if (s.drag && s.drag.i === i) return;
        const ph = (b as unknown as { plugin: { phase: number } }).plugin.phase;
        Body.applyForce(b, b.position, {
          x: Math.sin(t * 0.9 + ph) * k * b.mass,
          y: Math.cos(t * 1.3 + ph * 1.7) * k * b.mass,
        });
      });

      Engine.update(s.engine, dt);
      s.bodies.forEach((b, i) => {
        const el = pillRefs.current[i];
        if (!el) return;
        el.style.setProperty('--x', `${b.position.x.toFixed(1)}px`);
        el.style.setProperty('--y', `${(b.position.y - s.sizes[i].h / 2).toFixed(1)}px`);
      });
      s.raf = requestAnimationFrame(tick);
    };
    w.raf = requestAnimationFrame(tick);
  }, [n, spread, lift, pos, ceiling]);

  const set = useCallback(
    (next: boolean) => {
      if (!next) stopPhysics();
      setOpen((prev) => {
        if (prev === next) return prev;
        latest.current.onOpenChange?.(next);
        return next;
      });
    },
    [stopPhysics]
  );

  // Synchronize controlled isOpen prop (e.g. from GSAP ScrollTrigger)
  useEffect(() => {
    if (typeof isOpen === 'boolean') {
      set(isOpen);
    }
  }, [isOpen, set]);

  useEffect(() => {
    clearTimeout(liveTimer.current);
    if (!open || !physics || latest.current.reduce) {
      if (!open) stopPhysics();
      else if (!physics) stopPhysics();
      return undefined;
    }
    liveTimer.current = setTimeout(startPhysics, openDuration + (n - 1) * stagger + 80);
    return () => clearTimeout(liveTimer.current);
  }, [open, physics, openDuration, stagger, n, startPhysics, stopPhysics]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => {
      latest.current.reduce = mq.matches;
    };
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(
    () => () => {
      clearTimeout(popTimer.current);
      stopPhysics();
    },
    [stopPhysics]
  );

  const pick = (item: { label: string; value: string; icon?: React.ReactNode }, i: number) => {
    latest.current.onSelect?.(item.value, i);
    clearTimeout(popTimer.current);
    setPopped(i);
    popTimer.current = setTimeout(() => setPopped(-1), 320);
    if (closeOnSelect) set(false);
  };

  const pointerAt = (e: React.PointerEvent) => {
    const r = anchorRef.current?.getBoundingClientRect();
    return r ? { x: e.clientX - r.left, y: e.clientY - r.top } : { x: 0, y: 0 };
  };

  const down = (e: React.PointerEvent<HTMLButtonElement>, i: number) => {
    const w = world.current;
    if (!w.live || e.button !== 0) return;
    const b = w.bodies[i];
    if (!b) return;
    const p = pointerAt(e);
    w.drag = {
      i,
      id: e.pointerId,
      dx: b.position.x - p.x,
      dy: b.position.y - p.y,
      sx: e.clientX,
      sy: e.clientY,
      moved: false,
    };
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
  };

  const move = (e: React.PointerEvent<HTMLButtonElement>, i: number) => {
    const w = world.current;
    const d = w.drag;
    if (!d || d.i !== i || d.id !== e.pointerId) return;
    if (!d.moved && Math.hypot(e.clientX - d.sx, e.clientY - d.sy) >= DRAG_MIN) {
      d.moved = true;
      e.currentTarget.setAttribute('data-drag', '');
    }
    if (!d.moved) return;
    const b = w.bodies[i];
    const { w: bw, h: bh } = w.sizes[i];
    const z = w.zone;
    if (!z) return;
    const Body = w.matter?.Body;
    if (!Body) return;
    const p = pointerAt(e);
    const x = Math.min(z.right - bw / 2, Math.max(z.left + bw / 2, p.x + d.dx));
    const y = Math.min(z.bottom - bh / 2, Math.max(z.top + bh / 2, p.y + d.dy));
    Body.setVelocity(b, { x: (x - b.position.x) * 0.6, y: (y - b.position.y) * 0.6 });
    Body.setPosition(b, { x, y });
  };

  const up = (
    e: React.PointerEvent<HTMLButtonElement>,
    i: number,
    item: { label: string; value: string; icon?: React.ReactNode }
  ) => {
    const w = world.current;
    const d = w.drag;
    if (!d || d.i !== i || d.id !== e.pointerId) return;
    w.drag = null;
    e.currentTarget.removeAttribute('data-drag');
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
    if (!d.moved && e.type === 'pointerup') pick(item, i);
  };

  const hover = trigger === 'hover' && isOpen === undefined;

  return (
    <div
      className={`folder-float${className ? ` ${className}` : ''}`}
      data-open={open ? '' : undefined}
      data-live={live ? '' : undefined}
      data-physics={physics ? '' : undefined}
      data-trigger={trigger}
      onPointerEnter={hover ? () => set(true) : undefined}
      onPointerLeave={
        hover
          ? () => {
              if (!world.current.drag) set(false);
            }
          : undefined
      }
      onKeyDown={(e) => {
        if (e.key === 'Escape' && open) {
          e.stopPropagation();
          set(false);
        }
      }}
      style={
        {
          '--ff-w': `${width}px`,
          '--ff-h': `${height}px`,
          '--ff-r': `${radius}px`,
          '--ff-back': folderColor,
          '--ff-front': frontColor,
          '--ff-paper': paperColor,
          '--ff-item': itemColor,
          '--ff-item-ink': itemTextColor,
          '--ff-label': labelColor,
          '--ff-spread': `${spread}px`,
          '--ff-lift': `${lift}px`,
          '--ff-angle': `${flapAngle}deg`,
          '--ff-rest': `${restAngle}deg`,
          '--ff-open': `${openDuration}ms`,
          '--ff-close': `${Math.round(openDuration * 0.6)}ms`,
          '--ff-stagger': `${stagger}ms`,
          '--ff-n': n,
          '--ff-spring': `cubic-bezier(0.34, ${(1 + bounce * 1.9).toFixed(2)}, 0.64, 1)`,
        } as React.CSSProperties
      }
    >
      <div ref={anchorRef} className="folder-float__items">
        {list.map((item, i) => {
          const p = pos[i];
          if (!p) return null;
          const isSelected = selectedValue === item.value;
          return (
            <button
              key={`${item.value}-${i}`}
              ref={(el) => {
                pillRefs.current[i] = el;
              }}
              type="button"
              className={`folder-float__item${isSelected ? ' folder-float__item--active' : ''}`}
              tabIndex={open ? 0 : -1}
              aria-hidden={!open}
              aria-selected={isSelected}
              data-pop={popped === i ? '' : undefined}
              style={
                {
                  '--i': i,
                  '--x': `${p.x.toFixed(1)}px`,
                  '--y': `${p.y.toFixed(1)}px`,
                  '--r': `${p.r.toFixed(2)}deg`,
                  ...(item.color
                    ? {
                        '--bubble-color': item.color,
                        '--bubble-bg-light': item.lightBg,
                        '--bubble-border-light': item.lightBorder,
                        '--bubble-ink-light': item.lightInk,
                        '--bubble-bg-dark': item.darkBg,
                        '--bubble-border-dark': item.darkBorder,
                        '--bubble-ink-dark': item.darkInk,
                        '--bubble-glow': item.glow,
                      }
                    : {}),
                } as React.CSSProperties
              }
              onPointerDown={(e) => down(e, i)}
              onPointerMove={(e) => move(e, i)}
              onPointerUp={(e) => up(e, i, item)}
              onPointerCancel={(e) => up(e, i, item)}
              onClick={(e) => {
                if (!world.current.live || e.detail === 0) pick(item, i);
              }}
            >
              <span className="folder-float__drift">
                {item.icon && (
                  <span className="folder-float__icon" aria-hidden="true">
                    {item.icon}
                  </span>
                )}
                <span className="folder-float__text">{item.label}</span>
              </span>
            </button>
          );
        })}
      </div>
      <div className="folder-float__folder">
        <span className="folder-float__back" aria-hidden="true" />
        <span className="folder-float__paper" aria-hidden="true" />
        <span className="folder-float__front" aria-hidden="true">
          <span className="folder-float__label">{label}</span>
          {sub ? <span className="folder-float__sub">{sub}</span> : null}
        </span>
        <button
          type="button"
          className="folder-float__trigger"
          aria-expanded={open}
          aria-label={sub ? `${label}, ${sub}` : label}
          onClick={() => set(!open)}
        />
      </div>
    </div>
  );
};

export default FolderFloat;
