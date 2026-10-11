export interface MistWasmInstance {
  init: (isDark: number) => void;
  add_force: (normX: number, normY: number, forceX: number, forceY: number, densityAmt: number) => void;
  step: (dt: number, ambientTime: number, isDark: number) => void;
  get_rgba_ptr: () => number;
  get_grid_width: () => number;
  get_grid_height: () => number;
  build_grid_particles: (width: number, height: number, spacing: number) => void;
  get_grid_cols: () => number;
  get_grid_rows: () => number;
  update_particles: (mouseX: number, mouseY: number, canvasW: number, canvasH: number) => void;
  get_particles_ptr: () => number;
  get_particle_count: () => number;
  // Hot-code acceleration exports
  get_glyph_boxes_ptr: () => number;
  get_glyph_offsets_ptr: () => number;
  get_glyph_velocities_ptr: () => number;
  get_glyph_hits_ptr: () => number;
  update_glyph_springs: (
    count: number,
    draggingIdx: number,
    targetDragX: number,
    targetDragY: number,
    dt: number,
    springK: number,
    dampingC: number
  ) => number;
  find_glyph_at: (px: number, py: number, count: number) => number;
  check_dirty_intersections: (
    count: number,
    lx: number,
    rx: number,
    ty: number,
    by: number
  ) => number;
  calculate_fit_scale: (
    width: number,
    height: number,
    designW: number,
    designH: number,
    minScale: number,
    maxScale: number
  ) => number;
  memory: WebAssembly.Memory;
}

let cachedWasm: MistWasmInstance | null = null;
let loadPromise: Promise<MistWasmInstance | null> | null = null;

export async function loadMistWasm(): Promise<MistWasmInstance | null> {
  if (cachedWasm) return cachedWasm;
  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    try {
      const response = await fetch('/wasm/mist_fluid.wasm');
      if (!response.ok) {
        console.warn('Failed to fetch /wasm/mist_fluid.wasm:', response.statusText);
        return null;
      }
      const buffer = await response.arrayBuffer();
      const memory = new WebAssembly.Memory({ initial: 2, maximum: 8 });
      const { instance } = await WebAssembly.instantiate(buffer, {
        env: {
          memory,
        },
      });

      const exports = instance.exports as unknown as MistWasmInstance;
      if ((instance.exports as any).memory) {
        exports.memory = (instance.exports as any).memory;
      } else {
        exports.memory = memory;
      }

      cachedWasm = exports;
      return exports;
    } catch (err) {
      console.warn('WebAssembly initialization failed:', err);
      return null;
    }
  })();

  return loadPromise;
}
