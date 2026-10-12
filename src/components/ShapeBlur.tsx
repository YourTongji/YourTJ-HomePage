import React, { useEffect, useRef } from 'react';
import { Mesh, Program, Renderer, Triangle } from 'ogl';
import { useInViewOnce } from '../hooks/useInViewOnce';

/*
 * Mouse-reactive shape outline (React Bits ShapeBlur), on ogl/WebGL2.
 *
 * The picture depends only on the damped pointer position, so a frame is drawn
 * only while that position is still settling, plus once on resize; an idle page
 * renders nothing. Colours are uploaded in linear space, as the three.js
 * original did (three converts hex colours from sRGB and a raw ShaderMaterial
 * writes them out unconverted), so the plate keeps its shipped tone.
 */

const vertexShader = /* glsl */ `#version 300 es
in vec2 position;
void main() {
    gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragmentShader = (variation: number) => /* glsl */ `#version 300 es
precision highp float;

#define VAR ${variation}

out vec4 fragColor;

uniform vec2 u_mouse;
uniform vec2 u_resolution;
uniform float u_pixelRatio;

uniform float u_shapeSize;
uniform float u_roundness;
uniform float u_borderSize;
uniform float u_circleSize;
uniform float u_circleEdge;
uniform vec3 u_color;

#ifndef PI
#define PI 3.1415926535897932384626433832795
#endif
#ifndef TWO_PI
#define TWO_PI 6.2831853071795864769252867665590
#endif

#ifndef VAR
#define VAR 0
#endif

#ifndef FNC_COORD
#define FNC_COORD
vec2 coord(in vec2 p) {
    p = p / u_resolution.xy;
    if (u_resolution.x > u_resolution.y) {
        p.x *= u_resolution.x / u_resolution.y;
        p.x += (u_resolution.y - u_resolution.x) / u_resolution.y / 2.0;
    } else {
        p.y *= u_resolution.y / u_resolution.x;
        p.y += (u_resolution.x - u_resolution.y) / u_resolution.x / 2.0;
    }
    p -= 0.5;
    p *= vec2(-1.0, 1.0);
    return p;
}
#endif

#define st0 coord(gl_FragCoord.xy)
#define mx coord(u_mouse * u_pixelRatio)

float sdRoundRect(vec2 p, vec2 b, float r) {
    vec2 d = abs(p - 0.5) * 4.2 - b + vec2(r);
    return min(max(d.x, d.y), 0.0) + length(max(d, 0.0)) - r;
}
float sdCircle(in vec2 st, in vec2 center) {
    return length(st - center) * 2.0;
}
float sdPoly(in vec2 p, in float w, in int sides) {
    float a = atan(p.x, p.y) + PI;
    float r = TWO_PI / float(sides);
    float d = cos(floor(0.5 + a / r) * r - a) * length(max(abs(p) * 1.0, 0.0));
    return d * 2.0 - w;
}

float aastep(float threshold, float value) {
    float afwidth = length(vec2(dFdx(value), dFdy(value))) * 0.70710678118654757;
    return smoothstep(threshold - afwidth, threshold + afwidth, value);
}
float fill(in float x) { return 1.0 - aastep(0.0, x); }
float fill(float x, float size, float edge) {
    return 1.0 - smoothstep(size - edge, size + edge, x);
}
float stroke(in float d, in float t) { return (1.0 - aastep(t, abs(d))); }
float stroke(float x, float size, float w, float edge) {
    float d = smoothstep(size - edge, size + edge, x + w * 0.5) - smoothstep(size - edge, size + edge, x - w * 0.5);
    return clamp(d, 0.0, 1.0);
}

float strokeAA(float x, float size, float w, float edge) {
    float afwidth = length(vec2(dFdx(x), dFdy(x))) * 0.70710678;
    float d = smoothstep(size - edge - afwidth, size + edge + afwidth, x + w * 0.5)
            - smoothstep(size - edge - afwidth, size + edge + afwidth, x - w * 0.5);
    return clamp(d, 0.0, 1.0);
}

void main() {
    vec2 st = st0 + 0.5;
    vec2 posMouse = mx * vec2(1., -1.) + 0.5;

    float size = u_shapeSize;
    float roundness = u_roundness;
    float borderSize = u_borderSize;
    float circleSize = u_circleSize;
    float circleEdge = u_circleEdge;

    float sdfCircle = fill(
        sdCircle(st, posMouse),
        circleSize,
        circleEdge
    );

    float sdf;
    if (VAR == 0) {
        sdf = sdRoundRect(st, vec2(size), roundness);
        sdf = strokeAA(sdf, 0.0, borderSize, sdfCircle) * 4.0;
    } else if (VAR == 1) {
        sdf = sdCircle(st, vec2(0.5));
        sdf = fill(sdf, 0.6, sdfCircle) * 1.2;
    } else if (VAR == 2) {
        sdf = sdCircle(st, vec2(0.5));
        sdf = strokeAA(sdf, 0.58, 0.02, sdfCircle) * 4.0;
    } else if (VAR == 3) {
        sdf = sdPoly(st - vec2(0.5, 0.45), 0.3, 3);
        sdf = fill(sdf, 0.05, sdfCircle) * 1.4;
    }

    vec3 color = u_color;
    float alpha = sdf;
    fragColor = vec4(color.rgb, clamp(alpha, 0.0, 1.0));
}
`;

export interface ShapeBlurProps {
  className?: string;
  variation?: number;
  pixelRatioProp?: number;
  shapeSize?: number;
  roundness?: number;
  borderSize?: number;
  circleSize?: number;
  circleEdge?: number;
  color?: string;
  style?: React.CSSProperties;
}

const srgbToLinear = (c: number) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));

const linearColor = (hex: string): [number, number, number] => {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!m) return [1, 1, 1];
  return [m[1], m[2], m[3]].map((part) => srgbToLinear(parseInt(part, 16) / 255)) as [number, number, number];
};

/** Exponential damping toward a target, as THREE.MathUtils.damp. */
const damp = (x: number, y: number, lambda: number, dt: number) => x + (y - x) * (1 - Math.exp(-lambda * dt));

export const ShapeBlur: React.FC<ShapeBlurProps> = ({
  className = '',
  variation = 0,
  pixelRatioProp = 2,
  shapeSize = 1.2,
  roundness = 0.4,
  borderSize = 0.05,
  circleSize = 0.3,
  circleEdge = 0.5,
  color = '#ffffff',
  style,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const hasEntered = useInViewOnce(mountRef);
  const programRef = useRef<Program | null>(null);
  const requestRef = useRef<() => void>(() => undefined);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount || !hasEntered) return;

    let renderer: Renderer;
    try {
      renderer = new Renderer({ alpha: true, premultipliedAlpha: false, antialias: false, webgl: 2 });
    } catch {
      return;
    }
    const gl = renderer.gl;
    if (!gl || !(gl instanceof WebGL2RenderingContext)) return;

    const canvas = gl.canvas as HTMLCanvasElement;
    gl.clearColor(0, 0, 0, 0);
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    mount.appendChild(canvas);

    let w = mount.clientWidth || 1;
    let h = mount.clientHeight || 1;
    const mouse = { x: w * 0.5, y: h * 0.5 };
    const mouseDamp = { x: w * 0.5, y: h * 0.5 };

    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader(variation),
      uniforms: {
        u_mouse: { value: [mouseDamp.x, mouseDamp.y] },
        u_resolution: { value: [w, h] },
        u_pixelRatio: { value: pixelRatioProp },
        u_shapeSize: { value: shapeSize },
        u_roundness: { value: roundness },
        u_borderSize: { value: borderSize },
        u_circleSize: { value: circleSize },
        u_circleEdge: { value: circleEdge },
        u_color: { value: linearColor(color) },
      },
    });
    programRef.current = program;
    const geometry = new Triangle(gl);
    const mesh = new Mesh(gl, { geometry, program });

    let visible = false;
    let frame = 0;
    let lastTime = 0;

    const draw = () => {
      program.uniforms.u_mouse.value = [mouseDamp.x, mouseDamp.y];
      renderer.render({ scene: mesh });
    };

    const tick = (now: number) => {
      frame = 0;
      if (!visible) return;
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      mouseDamp.x = damp(mouseDamp.x, mouse.x, 8, dt);
      mouseDamp.y = damp(mouseDamp.y, mouse.y, 8, dt);
      const settled = Math.abs(mouse.x - mouseDamp.x) < 0.05 && Math.abs(mouse.y - mouseDamp.y) < 0.05;
      if (settled) {
        mouseDamp.x = mouse.x;
        mouseDamp.y = mouse.y;
      }
      draw();
      if (!settled) frame = requestAnimationFrame(tick);
    };

    const request = () => {
      if (!visible || frame) return;
      lastTime = performance.now();
      frame = requestAnimationFrame(tick);
    };
    requestRef.current = request;

    const onPointerMove = (e: PointerEvent) => {
      if (!visible) return;
      const rect = mount.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      request();
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    const resize = () => {
      w = mount.clientWidth || 1;
      h = mount.clientHeight || 1;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      renderer.dpr = dpr;
      renderer.setSize(w, h);
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      program.uniforms.u_resolution.value = [w * dpr, h * dpr];
      program.uniforms.u_pixelRatio.value = dpr;
      if (visible) draw();
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) {
          draw();
          request();
        }
      },
      { rootMargin: '120px' },
    );
    io.observe(mount);

    return () => {
      visible = false;
      cancelAnimationFrame(frame);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      requestRef.current = () => undefined;
      programRef.current = null;
      if (canvas.parentElement === mount) mount.removeChild(canvas);
      program.remove();
      geometry.remove();
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [variation, hasEntered]);

  useEffect(() => {
    const program = programRef.current;
    if (!program) return;
    program.uniforms.u_shapeSize.value = shapeSize;
    program.uniforms.u_roundness.value = roundness;
    program.uniforms.u_borderSize.value = borderSize;
    program.uniforms.u_circleSize.value = circleSize;
    program.uniforms.u_circleEdge.value = circleEdge;
    program.uniforms.u_color.value = linearColor(color);
    requestRef.current();
  }, [shapeSize, roundness, borderSize, circleSize, circleEdge, color]);

  return (
    <div
      className={className}
      ref={mountRef}
      style={{ width: '100%', height: '100%', position: 'relative', ...style }}
    />
  );
};

export default ShapeBlur;
