import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from 'motion/react';
import { useTheme } from '../hooks/useTheme';
import { loadMistWasm, type MistWasmInstance } from '../wasm/mistFluidWasm';

export interface MistBackgroundProps {
  /** Target frame rate for active simulation (default: 10 FPS, can be 1-10) */
  fps?: number;
  /** Idle frame rate when mouse is stationary (default: 2 FPS, can be 1-5) */
  idleFps?: number;
}

export const MistBackground: React.FC<MistBackgroundProps> = ({
  fps = 12,
  idleFps = 2,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduceMotion = useReducedMotion();
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let wasm: MistWasmInstance | null = null;
    let animId = 0;
    let isVisible = true;
    let lastTick = 0;
    let mouse = { x: -1000, y: -1000, prevX: -1000, prevY: -1000, active: false };
    let idleCounter = 0;
    let width = 0;
    let height = 0;

    const GW = 96;
    const GH = 54;
    const offscreen = document.createElement('canvas');
    offscreen.width = GW;
    offscreen.height = GH;
    const offscreenCtx = offscreen.getContext('2d');

    let offscreenImageData: ImageData | null = null;
    const isDark = theme === 'dark';

    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      if (wasm) {
        wasm.build_grid_particles(width, height, 90);
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;

      if (mouse.prevX >= 0) {
        const dx = currentX - mouse.prevX;
        const dy = currentY - mouse.prevY;
        const speed = Math.sqrt(dx * dx + dy * dy);

        if (wasm && width > 0 && height > 0) {
          const normX = Math.max(0, Math.min(1, currentX / width));
          const normY = Math.max(0, Math.min(1, currentY / height));
          const forceX = Math.max(-2, Math.min(2, dx * 0.08));
          const forceY = Math.max(-2, Math.min(2, dy * 0.08));
          const density = Math.min(0.9, speed * 0.03 + 0.15);
          wasm.add_force(normX, normY, forceX, forceY, density);
        }
      }

      mouse.prevX = currentX;
      mouse.prevY = currentY;
      mouse.x = currentX;
      mouse.y = currentY;
      mouse.active = true;
      idleCounter = 0;
    };

    const onPointerLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
      mouse.prevX = -1000;
      mouse.prevY = -1000;
      mouse.active = false;
    };

    const drawFrame = (timeSec: number) => {
      if (!wasm || width === 0 || height === 0) return;

      const currentDt = 0.1; // 100ms stable step
      wasm.step(currentDt, timeSec, isDark ? 1 : 0);
      wasm.update_particles(mouse.x, mouse.y, width, height);

      // 1. Render fluid mist layer
      const rgbaPtr = wasm.get_rgba_ptr();
      if (offscreenCtx) {
        if (!offscreenImageData) {
          offscreenImageData = new ImageData(
            new Uint8ClampedArray(wasm.memory.buffer, rgbaPtr, GW * GH * 4),
            GW,
            GH,
          );
        } else {
          // Point to potentially reallocated buffer
          offscreenImageData = new ImageData(
            new Uint8ClampedArray(wasm.memory.buffer, rgbaPtr, GW * GH * 4),
            GW,
            GH,
          );
        }
        offscreenCtx.putImageData(offscreenImageData, 0, 0);

        ctx.clearRect(0, 0, width, height);
        ctx.globalCompositeOperation = isDark ? 'screen' : 'source-over';
        ctx.drawImage(offscreen, 0, 0, width, height);
        ctx.globalCompositeOperation = 'source-over';
      }

      // 2. Render particle grid from WASM
      const particlesPtr = wasm.get_particles_ptr();
      const count = wasm.get_particle_count();
      const cols = wasm.get_grid_cols();
      const rows = wasm.get_grid_rows();

      if (count > 0 && cols > 0 && rows > 0) {
        const floatView = new Float32Array(wasm.memory.buffer, particlesPtr, count * 6);
        // Particle struct: [rest_x, rest_y, x, y, vx, vy] -> 6 floats (24 bytes)

        ctx.strokeStyle = isDark ? 'rgba(96, 165, 250, 0.14)' : 'rgba(60, 100, 160, 0.13)';
        ctx.lineWidth = 0.6;
        ctx.beginPath();

        // Horizontal grid lines
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols - 1; c++) {
            const idxA = (r * cols + c) * 6;
            const idxB = (r * cols + c + 1) * 6;
            const ax = floatView[idxA + 2];
            const ay = floatView[idxA + 3];
            const bx = floatView[idxB + 2];
            const by = floatView[idxB + 3];

            const dx = bx - ax;
            const dy = by - ay;
            const len = Math.sqrt(dx * dx + dy * dy);
            if (len < 16) continue;
            const nx = dx / len;
            const ny = dy / len;
            ctx.moveTo(ax + 9 * nx, ay + 9 * ny);
            ctx.lineTo(bx - 9 * nx, by - 9 * ny);
          }
        }

        // Vertical grid lines
        for (let c = 0; c < cols; c++) {
          for (let r = 0; r < rows - 1; r++) {
            const idxA = (r * cols + c) * 6;
            const idxB = ((r + 1) * cols + c) * 6;
            const ax = floatView[idxA + 2];
            const ay = floatView[idxA + 3];
            const bx = floatView[idxB + 2];
            const by = floatView[idxB + 3];

            const dx = bx - ax;
            const dy = by - ay;
            const len = Math.sqrt(dx * dx + dy * dy);
            if (len < 16) continue;
            const nx = dx / len;
            const ny = dy / len;
            ctx.moveTo(ax + 9 * nx, ay + 9 * ny);
            ctx.lineTo(bx - 9 * nx, by - 9 * ny);
          }
        }
        ctx.stroke();

        // Particle node dots
        ctx.fillStyle = isDark ? 'rgba(147, 197, 253, 0.35)' : 'rgba(60, 100, 160, 0.28)';
        for (let i = 0; i < count; i++) {
          const px = floatView[i * 6 + 2];
          const py = floatView[i * 6 + 3];

          let radius = 1.8;
          if (mouse.x >= 0) {
            const dx = px - mouse.x;
            const dy = py - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 140 && dist > 0.1) {
              radius = 1.8 + 2.2 * Math.max(0, 1 - dist / 140);
            }
          }

          ctx.beginPath();
          ctx.arc(px, py, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    let start = performance.now();

    const loop = (timestamp: number) => {
      if (!isVisible) return;

      const currentTargetFps = mouse.active ? fps : idleFps;
      const frameInterval = 1000 / currentTargetFps;

      if (timestamp - lastTick >= frameInterval) {
        lastTick = timestamp;
        idleCounter++;
        if (idleCounter > currentTargetFps * 3) {
          mouse.active = false;
        }
        const timeSec = (timestamp - start) * 0.001;
        drawFrame(timeSec);

        if (reduceMotion) {
          // Render a single high quality still frame then sleep
          return;
        }
      }

      animId = requestAnimationFrame(loop);
    };

    loadMistWasm().then((instance) => {
      if (!instance) return;
      wasm = instance;
      wasm.init(isDark ? 1 : 0);
      resize();
      lastTick = performance.now();
      drawFrame(0);
      if (!reduceMotion) {
        animId = requestAnimationFrame(loop);
      }
    });

    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerleave', onPointerLeave);

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible && !reduceMotion) {
          cancelAnimationFrame(animId);
          lastTick = performance.now();
          animId = requestAnimationFrame(loop);
        }
      },
      { threshold: 0 },
    );
    observer.observe(canvas);

    return () => {
      isVisible = false;
      cancelAnimationFrame(animId);
      observer.disconnect();
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerleave', onPointerLeave);
    };
  }, [fps, idleFps, reduceMotion, theme]);

  return (
    <div className="mist-canvas-layer pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <canvas ref={canvasRef} aria-hidden="true" className="h-full w-full" />
    </div>
  );
};
