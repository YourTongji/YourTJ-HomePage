import { useLayoutEffect, useState } from 'react';

/**
 * Fits a fixed-size design box into whatever space the layout gives it.
 *
 * The app and web previews are drawn on a fixed canvas and never reflow, so the
 * only honest way to place them at an arbitrary size is to scale the whole
 * design box as one unit. This measures the host element and returns the scale
 * that makes the design box fit inside it, capped so a wide viewport does not
 * blow the preview up past its intended size.
 *
 * Measurement is taken from the layout box (offsetWidth/Height, and the
 * ResizeObserver's borderBoxSize), never from getBoundingClientRect(). The
 * previews wrap their frame in an entrance tween that scales it to 0.96 and
 * settles to 1; a visual measurement taken mid-tween would come back 4% small,
 * and since transforms do not fire ResizeObserver it would stay 4% small
 * forever — leaving an uncovered strip along the right and bottom edges of the
 * frame. Layout sizes are immune to that.
 *
 * Measured in a layout effect, so the first paint already carries the final
 * scale. The host element is sized by CSS (not by its contents), which keeps the
 * reserved space stable and the page free of layout shift while measuring. The
 * caller owns the element and its ref, because callers also need the node for
 * their own effects.
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
      const next = Math.min(width / designWidth, height / designHeight);
      setScale(Math.min(max, Math.max(min, next)));
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
