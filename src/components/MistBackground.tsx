import React, { useEffect, useRef } from 'react';
import { useMediaQuery } from '../hooks/useMediaQuery';

/*
 * Hero atmosphere:
 *   layer 1 - CSS gradient on the section
 *   layer 2 - Canvas2D 90px particle grid with mouse repulsion
 *
 * The grid only animates while the pointer is near it or the dots are still
 * springing back, so an idle page draws it once, and it stops while the hero
 * is off screen.
 *
 * (The WebGL2 mist pass that used to sit above the grid never drew a frame -
 * its throttle rejected every frame it was handed - so it is gone rather than
 * "fixed": the hero keeps the look it has always shipped with.)
 */

const ParticleField: React.FC<{ still?: boolean }> = ({ still = false }) => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let points: Array<{ restX: number; restY: number; x: number; y: number; vx: number; vy: number }> = [];
    const mouse = { x: Number.NaN, y: Number.NaN };
    let frame = 0;
    let active = true;

    const buildPoints = () => {
      const columns = Math.ceil(width / 90) + 1;
      const rows = Math.ceil(height / 90) + 1;
      const offsetX = (width - (columns - 1) * 90) / 2;
      const offsetY = (height - (rows - 1) * 90) / 2;
      points = [];
      for (let row = 0; row < rows; row += 1) {
        for (let col = 0; col < columns; col += 1) {
          const x = offsetX + 90 * col;
          const y = offsetY + 90 * row;
          points.push({ restX: x, restY: y, x, y, vx: 0, vy: 0 });
        }
      }
    };

    const draw = () => {
      context.clearRect(0, 0, width, height);
      context.strokeStyle = 'rgba(60, 100, 160, 0.12)';
      context.lineWidth = 0.5;
      context.fillStyle = 'rgba(60, 100, 160, 0.24)';

      for (let row = 0; row < Math.ceil(height / 90) + 1; row += 1) {
        const columns = Math.ceil(width / 90) + 1;
        for (let col = 0; col < columns - 1; col += 1) {
          const a = points[row * columns + col];
          const b = points[row * columns + col + 1];
          if (!a || !b) continue;
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const length = Math.sqrt(dx * dx + dy * dy);
          if (length < 20) continue;
          const nx = dx / length;
          const ny = dy / length;
          context.beginPath();
          context.moveTo(a.x + 10 * nx, a.y + 10 * ny);
          context.lineTo(b.x - 10 * nx, b.y - 10 * ny);
          context.stroke();
        }
      }

      for (let col = 0; col < Math.ceil(width / 90) + 1; col += 1) {
        const columns = Math.ceil(width / 90) + 1;
        const rows = Math.ceil(height / 90) + 1;
        for (let row = 0; row < rows - 1; row += 1) {
          const a = points[row * columns + col];
          const b = points[(row + 1) * columns + col];
          if (!a || !b) continue;
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const length = Math.sqrt(dx * dx + dy * dy);
          if (length < 20) continue;
          const nx = dx / length;
          const ny = dy / length;
          context.beginPath();
          context.moveTo(a.x + 10 * nx, a.y + 10 * ny);
          context.lineTo(b.x - 10 * nx, b.y - 10 * ny);
          context.stroke();
        }
      }

      context.globalAlpha = 0.24;
      for (const point of points) {
        let radius = 1.8;
        context.beginPath();
        if (!Number.isNaN(mouse.x) && !Number.isNaN(mouse.y)) {
          const dx = point.x - mouse.x;
          const dy = point.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140 && dist > 0.1) {
            radius = 1.8 + 2 * Math.max(0, 1 - dist / 140);
          }
        }
        context.arc(point.x, point.y, radius, 0, Math.PI * 2);
        context.fill();
      }
      context.globalAlpha = 1;
    };

    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildPoints();
      draw();
    };

    const update = () => {
      for (const point of points) {
        const dx = point.x - mouse.x;
        const dy = point.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140 && dist > 0.1) {
          const force = (1 - dist / 140) * 30;
          const nx = dx / dist;
          const ny = dy / dist;
          point.vx += nx * force * 0.1;
          point.vy += ny * force * 0.1;
        }

        point.vx += 0.05 * (point.restX - point.x);
        point.vy += 0.05 * (point.restY - point.y);
        point.vx *= 0.85;
        point.vy *= 0.85;
        point.x += point.vx;
        point.y += point.vy;
      }
      draw();
    };

    resize();

    if (still) return;

    let visible = true;
    const settled = () =>
      Number.isNaN(mouse.x) &&
      points.every(
        (point) =>
          Math.abs(point.vx) < 0.01 &&
          Math.abs(point.vy) < 0.01 &&
          Math.abs(point.x - point.restX) < 0.05 &&
          Math.abs(point.y - point.restY) < 0.05,
      );

    const tick = () => {
      frame = 0;
      if (!active || !visible) return;
      update();
      if (settled()) {
        for (const point of points) {
          point.x = point.restX;
          point.y = point.restY;
          point.vx = 0;
          point.vy = 0;
        }
        draw();
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    const wake = () => {
      if (!frame && active && visible) frame = requestAnimationFrame(tick);
    };

    // The repulsion reaches 140px past the pointer; beyond that the grid does
    // not need to know where the pointer is.
    const onMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const near = x > -140 && y > -140 && x < rect.width + 140 && y < rect.height + 140;
      if (near) {
        mouse.x = x;
        mouse.y = y;
        wake();
      } else if (!Number.isNaN(mouse.x)) {
        mouse.x = Number.NaN;
        mouse.y = Number.NaN;
        wake();
      }
    };

    const onLeave = () => {
      mouse.x = Number.NaN;
      mouse.y = Number.NaN;
      wake();
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) wake();
      },
      { threshold: 0 },
    );
    observer.observe(canvas);

    const onResize = () => resize();
    window.addEventListener('resize', onResize);

    return () => {
      active = false;
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('resize', onResize);
    };
  }, [still]);

  return <canvas ref={ref} aria-hidden="true" className="absolute inset-0 h-full w-full" />;
};

export const MistBackground: React.FC = () => {
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  return (
    <div className="mist-canvas-layer pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <ParticleField still={reduceMotion} />
    </div>
  );
};
