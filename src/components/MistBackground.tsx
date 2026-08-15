import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from 'motion/react';

/*
 * Hero atmosphere:
 *   layer 1 - CSS gradient on the section
 *   layer 2 - Canvas2D 90px particle grid with mouse repulsion
 *   layer 3 - WebGL2 two-pass flow shader, desktop only
 * Both canvases are wrapped in the same vertical mask by the parent.
 */

const hexToRgb = (value: string): [number, number, number] => {
  const hex = value.replace('#', '');
  return [
    parseInt(hex.slice(0, 2), 16) / 255,
    parseInt(hex.slice(2, 4), 16) / 255,
    parseInt(hex.slice(4, 6), 16) / 255,
  ];
};

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

    const onMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = event.clientX - rect.left;
      mouse.y = event.clientY - rect.top;
    };

    const onLeave = () => {
      mouse.x = Number.NaN;
      mouse.y = Number.NaN;
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerleave', onLeave);

    const tick = () => {
      if (!active) return;
      update();
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    const observer = new IntersectionObserver(
      ([entry]) => {
        active = entry.isIntersecting;
        if (active) {
          cancelAnimationFrame(frame);
          frame = requestAnimationFrame(tick);
        }
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
      window.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('resize', onResize);
    };
  }, [still]);

  return <canvas ref={ref} aria-hidden="true" className="absolute inset-0 h-full w-full" />;
};

const VERTEX_SHADER = `#version 300 es
in vec4 a_position;
out vec2 vUv;
void main() {
  vUv = a_position.xy * 0.5 + 0.5;
  gl_Position = a_position;
}
`;

const FLOW_SHADER = `#version 300 es
precision mediump float;
in vec2 vUv;
uniform sampler2D u_prev;
uniform vec2 u_mouse;
uniform vec2 u_velocity;
uniform float u_brushRadius;
uniform float u_brushStrength;
uniform float u_decay;
out vec4 fragColor;

void main() {
  vec4 prev = texture(u_prev, vUv);

  prev.r *= u_decay;
  prev.gb = mix(vec2(0.5), prev.gb, u_decay);

  float dist = distance(vUv, u_mouse);
  float influence = exp(-dist * dist / (u_brushRadius * u_brushRadius * 0.5));
  influence = max(0.0, influence - 0.01);

  float speed = length(u_velocity);
  float presenceStrength = u_brushStrength * 0.3;
  float velBonus = min(speed * 3.0, 0.7) * u_brushStrength;
  float totalStrength = presenceStrength + velBonus;

  prev.r = max(prev.r, influence * totalStrength);
  float blendAmt = influence * min(totalStrength, 0.4) * 0.3;
  prev.g = mix(prev.g, clamp(u_velocity.x * 2.0 + 0.5, 0.0, 1.0), blendAmt);
  prev.b = mix(prev.b, clamp(u_velocity.y * 2.0 + 0.5, 0.0, 1.0), blendAmt);

  fragColor = prev;
}
`;

const MIST_SHADER = `#version 300 es
precision mediump float;
in vec2 vUv;
uniform float u_time;
uniform float u_pixelRatio;
uniform vec2 u_resolution;
uniform float u_scale;
uniform float u_rotation;
uniform vec4 u_color1, u_color2, u_color3;
uniform float u_colorCount;
uniform float u_proportion;
uniform float u_softness;
uniform float u_shape;
uniform float u_shapeScale;
uniform float u_distortion;
uniform float u_swirl;
uniform float u_swirlIterations;
uniform vec2 u_offset;
uniform sampler2D u_flowmap;
uniform float u_distortBoost;
uniform float u_noiseBoost;
uniform float u_swirlBoost;
out vec4 fragColor;

#define TWO_PI 6.28318530718
#define PI 3.14159265358979323846

vec2 rotate(vec2 uv, float th) { return mat2(cos(th), sin(th), -sin(th), cos(th)) * uv; }
float random(vec2 st) { return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123); }
float noise(vec2 st) {
  vec2 i = floor(st); vec2 f = fract(st);
  float a = random(i), b = random(i + vec2(1,0)), c = random(i + vec2(0,1)), d = random(i + vec2(1,1));
  vec2 u = f*f*(3.0-2.0*f);
  return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);
}

vec3 blend_multi(float mixer, float softness) {
  float edge = 1.0 - softness;
  vec3 col = u_color1.rgb;
  if (u_colorCount > 1.5) { col = mix(col, u_color2.rgb, smoothstep(0.0 + 0.35*edge, 0.7 - 0.35*edge, mixer)); }
  if (u_colorCount > 2.5) { col = mix(col, u_color3.rgb, smoothstep(0.3 + 0.35*edge, 1.0 - 0.35*edge, mixer)); }
  return col;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  float t = .5 * u_time;
  float ns = .0005 + .006 * u_scale;
  uv -= .5; uv *= (ns * u_resolution); uv = rotate(uv, u_rotation * .5 * PI);
  uv /= u_pixelRatio; uv += .5; uv += u_offset;

  vec2 fragUV = gl_FragCoord.xy / u_resolution.xy;
  vec4 flow = texture(u_flowmap, fragUV);
  float influence = flow.r;
  vec2 flowDir = (flow.gb - 0.5) * 2.0;

  float n1 = noise(uv + t), n2 = noise(uv*2. - t);
  float angle = n1 * TWO_PI;

  float totalDistortion = u_distortion + influence * u_distortBoost;
  uv.x += 4. * totalDistortion * n2 * cos(angle);
  uv.y += 4. * totalDistortion * n2 * sin(angle);

  uv += flowDir * influence * 0.15;

  if (influence > 0.001) {
    float localNoise = noise(uv * 2.0 + t * 1.5);
    uv += influence * u_noiseBoost * vec2(cos(localNoise * TWO_PI), sin(localNoise * TWO_PI));
  }

  float iters = ceil(clamp(u_swirlIterations, 1., 30.));
  float swirlAmt = clamp(u_swirl, 0., 2.) + influence * u_swirlBoost;
  for (float i = 1.; i <= 30.0; i++) {
    if (i > iters) break;
    uv.x += swirlAmt / i * cos(t + i*1.5*uv.y);
    uv.y += swirlAmt / i * cos(t + i*1.*uv.x);
  }

  float proportion = clamp(u_proportion, 0., 1.);
  vec2 cuv = uv * (.5 + 3.5 * u_shapeScale);
  float shape = .5 + .5 * sin(cuv.x) * cos(cuv.y);
  float mixer = shape + .48 * sign(proportion - .5) * pow(abs(proportion - .5), .5);
  vec3 col = blend_multi(mixer, clamp(u_softness, 0., 1.));
  fragColor = vec4(col, 1.0);
}
`;

const MIST_PARAMS = {
  mouseRadius: 0.22,
  mouseStrength: 1.1,
  decay: 0.96,
  distortBoost: 1.35,
  noiseBoost: 0,
  swirlBoost: 0.45,
  speed: 14,
  distortion: 20,
  swirl: 12,
  swirlIterations: 8,
  scale: 0.5,
  rotation: -5,
  proportion: 50,
  softness: 100,
  shapeScale: 10,
  offsetX: 0,
  offsetY: 65,
  color1: '#8AA3D6',
  color2: '#FFFFFF',
  color3: '#FFFFFF',
};

const FluidField: React.FC<{ still?: boolean }> = ({ still = false }) => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl2', {
      alpha: true,
      premultipliedAlpha: false,
      powerPreference: 'low-power',
      preserveDrawingBuffer: still,
    });
    if (!gl) return;

    const compile = (type: number, source: string): WebGLShader | null => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
    };

    const makeProgram = (fragmentSource: string): WebGLProgram | null => {
      const vertex = compile(gl.VERTEX_SHADER, VERTEX_SHADER);
      const fragment = compile(gl.FRAGMENT_SHADER, fragmentSource);
      if (!vertex || !fragment) return null;
      const program = gl.createProgram();
      if (!program) return null;
      gl.attachShader(program, vertex);
      gl.attachShader(program, fragment);
      gl.linkProgram(program);
      return gl.getProgramParameter(program, gl.LINK_STATUS) ? program : null;
    };

    const flowProgram = makeProgram(FLOW_SHADER);
    const mistProgram = makeProgram(MIST_SHADER);
    if (!flowProgram || !mistProgram) return;

    const flowUniforms = {
      prev: gl.getUniformLocation(flowProgram, 'u_prev'),
      mouse: gl.getUniformLocation(flowProgram, 'u_mouse'),
      velocity: gl.getUniformLocation(flowProgram, 'u_velocity'),
      brushRadius: gl.getUniformLocation(flowProgram, 'u_brushRadius'),
      brushStrength: gl.getUniformLocation(flowProgram, 'u_brushStrength'),
      decay: gl.getUniformLocation(flowProgram, 'u_decay'),
    };

    const mistUniforms = {
      time: gl.getUniformLocation(mistProgram, 'u_time'),
      pixelRatio: gl.getUniformLocation(mistProgram, 'u_pixelRatio'),
      resolution: gl.getUniformLocation(mistProgram, 'u_resolution'),
      scale: gl.getUniformLocation(mistProgram, 'u_scale'),
      rotation: gl.getUniformLocation(mistProgram, 'u_rotation'),
      offset: gl.getUniformLocation(mistProgram, 'u_offset'),
      color1: gl.getUniformLocation(mistProgram, 'u_color1'),
      color2: gl.getUniformLocation(mistProgram, 'u_color2'),
      color3: gl.getUniformLocation(mistProgram, 'u_color3'),
      colorCount: gl.getUniformLocation(mistProgram, 'u_colorCount'),
      proportion: gl.getUniformLocation(mistProgram, 'u_proportion'),
      softness: gl.getUniformLocation(mistProgram, 'u_softness'),
      shape: gl.getUniformLocation(mistProgram, 'u_shape'),
      shapeScale: gl.getUniformLocation(mistProgram, 'u_shapeScale'),
      distortion: gl.getUniformLocation(mistProgram, 'u_distortion'),
      swirl: gl.getUniformLocation(mistProgram, 'u_swirl'),
      swirlIterations: gl.getUniformLocation(mistProgram, 'u_swirlIterations'),
      flowmap: gl.getUniformLocation(mistProgram, 'u_flowmap'),
      distortBoost: gl.getUniformLocation(mistProgram, 'u_distortBoost'),
      noiseBoost: gl.getUniformLocation(mistProgram, 'u_noiseBoost'),
      swirlBoost: gl.getUniformLocation(mistProgram, 'u_swirlBoost'),
    };

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    const bindQuad = (program: WebGLProgram) => {
      const location = gl.getAttribLocation(program, 'a_position');
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.enableVertexAttribArray(location);
      gl.vertexAttribPointer(location, 2, gl.FLOAT, false, 0, 0);
    };

    const createTarget = (width: number, height: number, data?: Uint8Array) => {
      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      if (data) {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
      } else {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      }
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

      const framebuffer = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);

      return { framebuffer, texture };
    };

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let width = Math.round(canvas.clientWidth * dpr);
    let height = Math.round(canvas.clientHeight * dpr);
    canvas.width = width;
    canvas.height = height;

    let flowWidth = Math.round(width / 4);
    let flowHeight = Math.round(height / 4);
    const flowData = new Uint8Array(flowWidth * flowHeight * 4);
    for (let index = 0; index < flowWidth * flowHeight; index += 1) {
      flowData[index * 4] = 0;
      flowData[index * 4 + 1] = 128;
      flowData[index * 4 + 2] = 128;
      flowData[index * 4 + 3] = 255;
    }
    let targetA = createTarget(flowWidth, flowHeight, flowData);
    let targetB = createTarget(flowWidth, flowHeight, flowData);

    const pointer = {
      x: 0.5,
      y: 0.5,
      smoothX: 0.5,
      smoothY: 0.5,
      svx: 0,
      svy: 0,
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = (event.clientX - rect.left) / rect.width;
      pointer.y = 1 - (event.clientY - rect.top) / rect.height;
    };

    const coarsePointer = window.matchMedia('(hover: none), (pointer: coarse)').matches;
    const interactive = !still && !coarsePointer;
    if (interactive) window.addEventListener('pointermove', onPointerMove, { passive: true });

    const startTime = performance.now();
    let frame = 0;
    let visible = true;
    let swap = false;

    const render = (now: number) => {
      if (!visible) return;
      if (!still && now - lastFrameTime < 1000 / 30) return;

      const nextWidth = Math.round(canvas.clientWidth * dpr);
      const nextHeight = Math.round(canvas.clientHeight * dpr);
      if (nextWidth !== width || nextHeight !== height) {
        width = nextWidth;
        height = nextHeight;
        canvas.width = width;
        canvas.height = height;
        flowWidth = Math.round(width / 4);
        flowHeight = Math.round(height / 4);
        const resizedData = new Uint8Array(flowWidth * flowHeight * 4);
        for (let index = 0; index < flowWidth * flowHeight; index += 1) {
          resizedData[index * 4] = 0;
          resizedData[index * 4 + 1] = 128;
          resizedData[index * 4 + 2] = 128;
          resizedData[index * 4 + 3] = 255;
        }
        targetA = createTarget(flowWidth, flowHeight, resizedData);
        targetB = createTarget(flowWidth, flowHeight, resizedData);
        swap = false;
      }

      let outputTexture = targetA.texture;

      if (interactive) {
        pointer.smoothX += (pointer.x - pointer.smoothX) * 0.12;
        pointer.smoothY += (pointer.y - pointer.smoothY) * 0.12;
        pointer.svx += ((pointer.x - pointer.smoothX) * 0.5 - pointer.svx) * 0.15;
        pointer.svy += ((pointer.y - pointer.smoothY) * 0.5 - pointer.svy) * 0.15;

        const input = swap ? targetB : targetA;
        const output = swap ? targetA : targetB;
        swap = !swap;
        outputTexture = output.texture;

        gl.bindFramebuffer(gl.FRAMEBUFFER, output.framebuffer);
        gl.viewport(0, 0, flowWidth, flowHeight);
        gl.useProgram(flowProgram);
        bindQuad(flowProgram);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, input.texture);
        gl.uniform1i(flowUniforms.prev, 0);
        gl.uniform2f(flowUniforms.mouse, pointer.smoothX, pointer.smoothY);
        gl.uniform2f(flowUniforms.velocity, pointer.svx, pointer.svy);
        gl.uniform1f(flowUniforms.brushRadius, MIST_PARAMS.mouseRadius);
        gl.uniform1f(flowUniforms.brushStrength, MIST_PARAMS.mouseStrength);
        gl.uniform1f(flowUniforms.decay, MIST_PARAMS.decay);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }

      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, width, height);
      gl.useProgram(mistProgram);
      bindQuad(mistProgram);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, outputTexture);
      gl.uniform1i(mistUniforms.flowmap, 0);

      const elapsed = (now - startTime) * 0.001 * (MIST_PARAMS.speed / 100);
      gl.uniform1f(mistUniforms.time, elapsed);
      gl.uniform1f(mistUniforms.pixelRatio, window.devicePixelRatio || 1);
      gl.uniform2f(mistUniforms.resolution, width, height);
      gl.uniform1f(mistUniforms.scale, MIST_PARAMS.scale);
      gl.uniform1f(mistUniforms.rotation, MIST_PARAMS.rotation / 90);
      gl.uniform2f(mistUniforms.offset, MIST_PARAMS.offsetX / 100, MIST_PARAMS.offsetY / 100);

      const color1 = hexToRgb(MIST_PARAMS.color1);
      const color2 = hexToRgb(MIST_PARAMS.color2);
      const color3 = hexToRgb(MIST_PARAMS.color3);
      gl.uniform4f(mistUniforms.color1, color1[0], color1[1], color1[2], 1);
      gl.uniform4f(mistUniforms.color2, color2[0], color2[1], color2[2], 1);
      gl.uniform4f(mistUniforms.color3, color3[0], color3[1], color3[2], 1);
      gl.uniform1f(mistUniforms.colorCount, 3);
      gl.uniform1f(mistUniforms.proportion, MIST_PARAMS.proportion / 100);
      gl.uniform1f(mistUniforms.softness, MIST_PARAMS.softness / 100);
      gl.uniform1f(mistUniforms.shape, 0);
      gl.uniform1f(mistUniforms.shapeScale, MIST_PARAMS.shapeScale / 100);
      gl.uniform1f(mistUniforms.distortion, MIST_PARAMS.distortion / 100);
      gl.uniform1f(mistUniforms.swirl, MIST_PARAMS.swirl / 50);
      gl.uniform1f(mistUniforms.swirlIterations, MIST_PARAMS.swirlIterations);
      gl.uniform1f(mistUniforms.distortBoost, MIST_PARAMS.distortBoost);
      gl.uniform1f(mistUniforms.noiseBoost, MIST_PARAMS.noiseBoost);
      gl.uniform1f(mistUniforms.swirlBoost, MIST_PARAMS.swirlBoost);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    let lastFrameTime = 0;
    const tick = (now: number) => {
      if (now - lastFrameTime >= 1000 / 30) {
        lastFrameTime = now;
        render(now);
      }
      if (!still) frame = requestAnimationFrame(tick);
    };

    if (still) {
      render(performance.now());
    } else {
      frame = requestAnimationFrame(tick);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !still) {
          cancelAnimationFrame(frame);
          frame = requestAnimationFrame(tick);
        }
      },
      { threshold: 0 },
    );
    observer.observe(canvas);

    return () => {
      visible = false;
      cancelAnimationFrame(frame);
      observer.disconnect();
      if (interactive) window.removeEventListener('pointermove', onPointerMove);
    };
  }, [still]);

  return <canvas ref={ref} aria-hidden="true" className="absolute inset-0 h-full w-full" />;
};

export const MistBackground: React.FC = () => {
  const reduceMotion = useReducedMotion();

  return (
    <>
      <div className="mist-canvas-layer pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <ParticleField still={Boolean(reduceMotion)} />
      </div>
      <div className="mist-canvas-layer pointer-events-none absolute inset-0 z-[1] hidden overflow-hidden md:block">
        <FluidField still={Boolean(reduceMotion)} />
      </div>
    </>
  );
};
