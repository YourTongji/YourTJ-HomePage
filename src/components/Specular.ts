import { useEffect, type RefObject } from 'react';

interface Entry {
  el: HTMLElement;
  proximity: number;
  /** Unwrapped angle in degrees, so the eased property never spins the long way round. */
  angle: number;
  bright: number;
  visible: boolean;
}

/*
 * One pointer listener serves every specular element on the page. Reads are
 * batched into a single animation frame per pointer move, and only elements in
 * the viewport are measured; everything else costs nothing.
 */
const entries = new Set<Entry>();
let frame = 0;
let pointer: { x: number; y: number } | null = null;
let listening = false;
let observer: IntersectionObserver | null = null;

const update = () => {
  frame = 0;
  if (!pointer) return;
  const { x: px, y: py } = pointer;

  for (const entry of entries) {
    if (!entry.visible) continue;
    const rect = entry.el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = Math.max(rect.left - px, 0, px - rect.right);
    const dy = Math.max(rect.top - py, 0, py - rect.bottom);
    const dist = Math.hypot(dx, dy);

    // Light direction (radians, maths convention): toward the pointer outside the
    // button, blending into a gentle diagonal tilt once the pointer is over it.
    const outside = Math.atan2(cy - py, px - cx);
    const diagonal = Math.atan2(2 / rect.height, -2 / rect.width);
    let light: number;
    if (dist === 0) {
      light = diagonal + ((px - cx) / (rect.width / 2)) * 0.25 + ((cy - py) / (rect.height / 2)) * 0.12;
    } else if (dist < 40) {
      const diff = ((outside - diagonal + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
      light = diagonal + diff * (dist / 40);
    } else {
      light = outside;
    }

    // The streak sits where the edge's normal faces the light. On a wide button
    // that point drifts toward the ends, so map the light direction onto the
    // matching point of the inscribed ellipse before handing it to the gradient.
    const a = rect.width / 2;
    const b = rect.height / 2;
    const polar = Math.atan2(b * b * Math.sin(light), a * a * Math.cos(light));
    // conic-gradient angles run clockwise from 12 o'clock.
    const target = 90 - (polar * 180) / Math.PI;
    const delta = ((target - entry.angle + 540) % 360) - 180;
    entry.angle += delta;

    const t = Math.max(0, 1 - dist / Math.max(entry.proximity, 1));
    const bright = t * t * (3 - 2 * t);

    if (Math.abs(delta) > 0.2) entry.el.style.setProperty('--sb-angle', `${entry.angle.toFixed(1)}deg`);
    if (Math.abs(bright - entry.bright) > 0.004) {
      entry.bright = bright;
      entry.el.style.setProperty('--sb-bright', bright.toFixed(3));
    }
  }
};

const onPointerMove = (event: PointerEvent) => {
  if (event.pointerType === 'touch') return;
  pointer = { x: event.clientX, y: event.clientY };
  if (!frame) frame = requestAnimationFrame(update);
};

const start = () => {
  if (listening) return;
  listening = true;
  window.addEventListener('pointermove', onPointerMove, { passive: true });
  observer = new IntersectionObserver(
    (records) => {
      for (const record of records) {
        for (const entry of entries) if (entry.el === record.target) entry.visible = record.isIntersecting;
      }
    },
    { rootMargin: '80px' },
  );
  for (const entry of entries) observer.observe(entry.el);
};

const stop = () => {
  if (!listening || entries.size > 0) return;
  listening = false;
  window.removeEventListener('pointermove', onPointerMove);
  observer?.disconnect();
  observer = null;
  cancelAnimationFrame(frame);
  frame = 0;
};

/**
 * Lets an element's rim track the pointer. Only fine pointers on screens wide
 * enough for the effect take part; touch and narrow screens keep the static
 * edge drawn by the stylesheet.
 */
export const useSpecular = (ref: RefObject<HTMLElement | null>, proximity: number) => {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const enabled =
      window.matchMedia('(pointer: fine)').matches &&
      window.matchMedia('(min-width: 768px)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!enabled) return;

    const entry: Entry = { el, proximity, angle: 137, bright: 0, visible: false };
    entries.add(entry);
    start();
    observer?.observe(el);
    return () => {
      observer?.unobserve(el);
      entries.delete(entry);
      stop();
    };
  }, [ref, proximity]);
};
