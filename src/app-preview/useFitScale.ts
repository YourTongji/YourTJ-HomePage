import { useLayoutEffect, useState } from 'react';
import { loadMistWasm, type MistWasmInstance } from '../wasm/mistFluidWasm';

let wasmInstance: MistWasmInstance | null = null;
if (typeof window !== 'undefined') {
  loadMistWasm()
    .then((w) => {
      wasmInstance = w;
    })
    .catch(() => undefined);
}

/**
 * Fits a fixed-size design box into whatever space the layout gives it.
 * Accelerated via WebAssembly for zero-overhead calculations during scroll and zoom.
 */
export const useFitScale = <T extends HTMLElement>(
  elementRef: React.RefObject<T>,
  designWidth: number,
  designHeight: number,
  options: { max?: number; min?: number } = {},
): number => {
  const { max = 1, min = 0.3 } = options;
  const [scale, setScale] = useState<number | null>(null);

  useLayoutEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const fit = (width: number, height: number) => {
      if (width === 0 || height === 0) return;
      if (wasmInstance?.calculate_fit_scale) {
        const next = wasmInstance.calculate_fit_scale(width, height, designWidth, designHeight, min, max);
        setScale(next);
      } else {
        const next = Math.min(width / designWidth, height / designHeight);
        setScale(Math.min(max, Math.max(min, next)));
      }
    };

    const measure = () => fit(element.offsetWidth, element.offsetHeight);

    measure();
    const observer = new ResizeObserver((entries) => {
      const box = entries[0]?.borderBoxSize?.[0];
      if (box) fit(box.inlineSize, box.blockSize);
      else measure();
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [elementRef, designWidth, designHeight, max, min]);

  return scale ?? min;
};
