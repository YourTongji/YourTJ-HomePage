'use client';

import React, { useRef, useEffect } from 'react';
import { Renderer, Program, Mesh, Triangle, Color } from 'ogl';
import './SpecularButton.css';

const PAD = 20;

const VERT = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = `#version 300 es
precision highp float;

uniform vec2 uCenter;
uniform vec2 uHalfSize;
uniform float uRadius;
uniform float uAngle;
uniform float uPx;
uniform vec3 uLineColor;
uniform vec3 uBaseColor;
uniform float uIntensity;
uniform float uShineSize;
uniform float uShineFade;
uniform float uThickness;
uniform float uBaseWidth;

out vec4 fragColor;

float sdRoundedRect(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

float shapeSDF(vec2 p) { return sdRoundedRect(p, uHalfSize, uRadius); }

float gaussianLine(float d, float sigma) {
  float x = d / (sigma + 1e-6);
  float k = mix(1.0, 1.6, smoothstep(0.0, 1.5, x));
  return exp(-k * x * x);
}

void main() {
  vec2 p = gl_FragCoord.xy - uCenter;
  float d = shapeSDF(p);
  vec2 L = vec2(cos(uAngle), sin(uAngle));

  // Dark base stroke hugging the edge for a sense of thickness
  float base = (1.0 - smoothstep(0.0, uBaseWidth, abs(d))) * 0.45;

  // Symmetric specular: the edges facing toward/away from the light both
  // catch a streak. The angular window (size + fade) is measured with an
  // elliptical normal so it varies continuously along straight edges.
  vec2 nEll = normalize(p / (uHalfSize * uHalfSize) + 1e-6);
  float phi = acos(clamp(abs(dot(nEll, L)), 0.0, 1.0));
  float rim = 1.0 - smoothstep(uShineSize - uShineFade, uShineSize + uShineFade + 1e-4, phi);
  float line = gaussianLine(d, uThickness);
  float edgeClamp = 1.0 - smoothstep(0.5 * uPx, 3.0 * uPx, abs(d));
  float hi = line * rim * edgeClamp * uIntensity;

  vec3 col = uBaseColor * base + uLineColor * hi;
  float a = clamp(base + hi, 0.0, 1.0);
  fragColor = vec4(col, a);
}
`;

export interface SpecularButtonProps {
  /** Button label or any custom content. */
  children?: React.ReactNode;
  /** Preset padding and font size of the button. */
  size?: 'sm' | 'md' | 'lg';
  /** Corner radius in pixels; clamps to a pill automatically. */
  radius?: number;
  /** Color of the glass background tint. */
  tint?: string;
  /** Strength of the glass tint (0..1). */
  tintOpacity?: number;
  /** Backdrop blur in pixels behind the button. */
  blur?: number;
  /** Color of the button label. */
  textColor?: string;
  /** Color of the moving specular highlight. */
  lineColor?: string;
  /** Color of the static edge stroke under the highlight. */
  baseColor?: string;
  /** Brightness of the specular highlight. */
  intensity?: number;
  /** Angular size in degrees of each shine streak along the edge. */
  shineSize?: number;
  /** How gradually each streak fades out at its ends, in degrees. */
  shineFade?: number;
  /** Width of the highlight line in pixels. */
  thickness?: number;
  /** Rotation speed of the sweep when autoAnimate is on. */
  speed?: number;
  /** Point the light toward the cursor. */
  followMouse?: boolean;
  /** Distance in pixels within which the shine fades in as cursor approaches. */
  proximity?: number;
  /** Keep the shine always on with a rotating sweep, regardless of cursor distance. */
  autoAnimate?: boolean;
  /** Disable the button. */
  disabled?: boolean;
  /** Click handler. */
  onClick?: React.MouseEventHandler<HTMLElement>;
  /** Native button type. */
  type?: 'button' | 'submit' | 'reset';
  /** Additional CSS class names. */
  className?: string;
  /** Optional link destination if rendering as an anchor tag. */
  href?: string;
  /** Link target (e.g. "_blank"). */
  target?: string;
  /** Link rel (e.g. "noopener noreferrer"). */
  rel?: string;
}

export const SpecularButton: React.FC<SpecularButtonProps> = ({
  children = 'Get Started',
  size = 'lg',
  radius = 18,
  tint = '#ffffff',
  tintOpacity = 0,
  blur = 0,
  textColor = '#f5f5f5',
  lineColor = '#ffffff',
  baseColor = '#525252',
  intensity = 1,
  shineSize = 10,
  shineFade = 40,
  thickness = 1,
  speed = 0.35,
  followMouse = true,
  proximity = 250,
  autoAnimate = false,
  disabled = false,
  onClick,
  className = '',
  type = 'button',
  href,
  target,
  rel,
}) => {
  const btnRef = useRef<HTMLElement | null>(null);
  const fxRef = useRef<HTMLSpanElement | null>(null);
  const propsRef = useRef<{
    radius: number;
    lineColor: string;
    baseColor: string;
    intensity: number;
    shineSize: number;
    shineFade: number;
    thickness: number;
    speed: number;
    followMouse: boolean;
    proximity: number;
    autoAnimate: boolean;
  }>({
    radius,
    lineColor,
    baseColor,
    intensity,
    shineSize,
    shineFade,
    thickness,
    speed,
    followMouse,
    proximity,
    autoAnimate,
  });

  propsRef.current = {
    radius,
    lineColor,
    baseColor,
    intensity,
    shineSize,
    shineFade,
    thickness,
    speed,
    followMouse,
    proximity,
    autoAnimate,
  };

  useEffect(() => {
    const btn = btnRef.current;
    const fx = fxRef.current;
    if (!btn || !fx) return;

    const isMobileOrTouch =
      typeof window !== 'undefined' &&
      (window.matchMedia('(pointer: coarse)').matches ||
        window.innerWidth < 768 ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    if (isMobileOrTouch) return;

    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    let renderer: Renderer | null = null;
    try {
      renderer = new Renderer({
        webgl: 2,
        alpha: true,
        premultipliedAlpha: true,
        antialias: true,
        dpr,
      });
    } catch {
      // Graceful fallback if WebGL2 is not supported
      return;
    }

    const gl = renderer.gl;
    if (!gl) return;

    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    const geometry = new Triangle(gl);
    if (geometry.attributes.uv) delete geometry.attributes.uv;

    let program: Program;
    try {
      program = new Program(gl, {
        vertex: VERT,
        fragment: FRAG,
        uniforms: {
          uCenter: { value: [0, 0] },
          uHalfSize: { value: [1, 1] },
          uRadius: { value: 0 },
          uAngle: { value: 2.4 },
          uPx: { value: dpr },
          uLineColor: { value: [1, 1, 1] },
          uBaseColor: { value: [0.32, 0.32, 0.32] },
          uIntensity: { value: 1 },
          uShineSize: { value: 0.17 },
          uShineFade: { value: 0.7 },
          uThickness: { value: 1 },
          uBaseWidth: { value: dpr },
        },
      });
    } catch {
      return;
    }

    const mesh = new Mesh(gl, { geometry, program });
    fx.appendChild(gl.canvas);

    const sizeRef = { w: 1, h: 1 };
    const resize = () => {
      // Fractional size + explicit center keep the SDF pinned to the exact
      // CSS border, instead of drifting up to a pixel from offsetWidth rounding.
      const rect = btn.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      if (w === 0 || h === 0) return;
      sizeRef.w = w;
      sizeRef.h = h;
      renderer.setSize(w + PAD * 2, h + PAD * 2);
      program.uniforms.uCenter.value = [(PAD + w / 2) * dpr, (PAD + h / 2) * dpr];
      program.uniforms.uHalfSize.value = [(w / 2) * dpr, (h / 2) * dpr];
    };
    const ro = new ResizeObserver(resize);
    ro.observe(btn);
    resize();

    // Light angle steers toward the pointer (anywhere on the page) and falls
    // back to a slow sweep when the pointer hasn't moved yet.
    let pointerAngle: number | null = null;
    let proximityT = 0;
    let isIntersecting = true;
    let isTouch = false;

    const onPointerMove = (e: PointerEvent) => {
      if (!isIntersecting) return;
      isTouch = e.pointerType === 'touch';
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = Math.max(rect.left - e.clientX, 0, e.clientX - rect.right);
      const dy = Math.max(rect.top - e.clientY, 0, e.clientY - rect.bottom);
      const dist = Math.hypot(dx, dy);

      // Continuous angle without sudden 180-deg discontinuity at boundary
      const angleOutside = Math.atan2(cy - e.clientY, e.clientX - cx);
      const diagonalAngle = Math.atan2(2 / rect.height, -2 / rect.width);

      if (dist === 0) {
        const nx = (e.clientX - cx) / (rect.width / 2);
        const ny = (cy - e.clientY) / (rect.height / 2);
        pointerAngle = diagonalAngle + nx * 0.25 + ny * 0.12;
      } else if (dist < 40) {
        const blend = dist / 40;
        const diffAngle = ((angleOutside - diagonalAngle + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
        pointerAngle = diagonalAngle + diffAngle * blend;
      } else {
        pointerAngle = angleOutside;
      }

      const effectiveProx = isTouch ? Math.min(propsRef.current.proximity, 160) : propsRef.current.proximity;
      const t = Math.max(0, 1 - dist / Math.max(effectiveProx, 1));
      proximityT = t * t * (3 - 2 * t);
      wake();
    };

    const onPointerUp = (e: PointerEvent) => {
      if (e.pointerType === 'touch') {
        proximityT = 0;
        pointerAngle = null;
        wake();
      }
    };

    const onPointerCancel = () => {
      proximityT = 0;
      pointerAngle = null;
      wake();
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerup', onPointerUp, { passive: true });
    window.addEventListener('pointercancel', onPointerCancel, { passive: true });

    let angle = 2.4;
    let idleAngle = 2.4;
    let bright = 0;
    let last = performance.now();
    let raf = 0;

    const lineC = new Color();
    const baseC = new Color();

    const update = (now: number) => {
      raf = 0;
      if (!isIntersecting) return;

      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const p = propsRef.current;

      idleAngle += p.speed * dt;
      const steer = p.followMouse && pointerAngle !== null && (!p.autoAnimate || proximityT > 0);
      const targetA = steer && pointerAngle !== null ? pointerAngle : idleAngle;
      const diff = ((targetA - angle + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
      angle += diff * (1 - Math.exp(-dt * (isTouch ? 5 : 7)));

      // Shine fades in with pointer proximity unless autoAnimate keeps it on
      const brightTarget = p.autoAnimate ? 1 : proximityT;
      bright += (brightTarget - bright) * (1 - Math.exp(-dt * (isTouch ? 6 : 8)));

      try {
        lineC.set(p.lineColor);
        baseC.set(p.baseColor);
        program.uniforms.uAngle.value = angle;
        program.uniforms.uRadius.value =
          Math.min(p.radius, Math.min(sizeRef.w, sizeRef.h) / 2) * dpr;
        program.uniforms.uLineColor.value = [lineC.r, lineC.g, lineC.b];
        program.uniforms.uBaseColor.value = [baseC.r, baseC.g, baseC.b];
        program.uniforms.uIntensity.value = p.intensity * bright;
        program.uniforms.uShineSize.value = (p.shineSize * Math.PI) / 180;
        program.uniforms.uShineFade.value = (p.shineFade * Math.PI) / 180;
        program.uniforms.uThickness.value = p.thickness * dpr;
        renderer.render({ scene: mesh });
      } catch {
        // Safe catch on shader execution or context lost
      }

      // Performance optimization: sleep RAF when idle and bright is near 0
      const needsNext = p.autoAnimate || bright > 0.003 || proximityT > 0.003 || Math.abs(diff) > 0.01;
      if (needsNext && isIntersecting) {
        raf = requestAnimationFrame(update);
      }
    };

    const wake = () => {
      if (raf || !isIntersecting) return;
      last = performance.now();
      raf = requestAnimationFrame(update);
    };

    const io = new IntersectionObserver(([entry]) => {
      isIntersecting = entry.isIntersecting;
      if (isIntersecting) {
        wake();
      }
    }, { rootMargin: '80px' });
    io.observe(btn);

    wake();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerCancel);
      if (gl.canvas.parentNode === fx) fx.removeChild(gl.canvas);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, []);

  const styleVars = {
    '--sb-radius': `${radius}px`,
    '--sb-tint': tint,
    '--sb-tint-opacity': tintOpacity,
    '--sb-blur': `${blur}px`,
    '--sb-text-color': textColor,
    '--sb-line-color': lineColor,
    '--sb-base-color': baseColor,
  } as React.CSSProperties;

  if (href) {
    return (
      <a
        ref={btnRef as React.RefObject<HTMLAnchorElement>}
        href={disabled ? undefined : href}
        target={target}
        rel={rel}
        onClick={onClick as React.MouseEventHandler<HTMLAnchorElement>}
        aria-disabled={disabled}
        className={`specular-button specular-button--${size}${className ? ` ${className}` : ''}`}
        style={styleVars}
      >
        <span ref={fxRef} className="specular-button__fx" aria-hidden="true" />
        <span className="specular-button__label">{children}</span>
      </a>
    );
  }

  return (
    <button
      ref={btnRef as React.RefObject<HTMLButtonElement>}
      type={type}
      disabled={disabled}
      onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}
      className={`specular-button specular-button--${size}${className ? ` ${className}` : ''}`}
      style={styleVars}
    >
      <span ref={fxRef} className="specular-button__fx" aria-hidden="true" />
      <span className="specular-button__label">{children}</span>
    </button>
  );
};

export default SpecularButton;
