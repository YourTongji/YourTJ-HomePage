/*
 * Numeric helpers shared by the app-preview screens.
 *
 * The screens were authored for the Remotion film, where progress came from the
 * video timeline. On the website every screen is rendered at a settled state, so
 * this module keeps only the pure math the screens call: no frames, no spring
 * solver, no Remotion import. A screen that needs motion gets it from the page
 * (GSAP) rather than from a frame counter.
 */

export const clamp = (value: number, min = 0, max = 1): number => Math.min(max, Math.max(min, value));

export const lerp = (from: number, to: number, t: number): number => from + (to - from) * t;

/**
 * Cubic bezier easing in the CSS sense: the curve is fixed by two control
 * points, and the y for a given x is found by bisecting t. Sixteen steps is
 * plenty for the coarse progress values the screens interpolate.
 */
const cubicBezier = (x1: number, y1: number, x2: number, y2: number) => {
  const bezier = (a: number, b: number, t: number) => {
    const inv = 1 - t;
    return 3 * inv * inv * t * a + 3 * inv * t * t * b + t * t * t;
  };

  return (x: number) => {
    let low = 0;
    let high = 1;
    let t = x;

    for (let i = 0; i < 16; i += 1) {
      const currentX = bezier(x1, x2, t);
      if (Math.abs(currentX - x) < 0.001) break;
      if (currentX < x) low = t;
      else high = t;
      t = (low + high) / 2;
    }

    return bezier(y1, y2, t);
  };
};

export const EASE_OUT = cubicBezier(0.22, 1, 0.36, 1);
export const EASE_IN_OUT = cubicBezier(0.65, 0, 0.35, 1);

/** Map `value` from one range onto another, clamped at both ends. */
export const ipl = (
  value: number,
  input: number[],
  output: number[],
  ease: (t: number) => number = EASE_OUT,
): number => {
  const [inMin, inMax] = input;
  const progress = inMax === inMin ? (value >= inMax ? 1 : 0) : clamp((value - inMin) / (inMax - inMin));
  return lerp(output[0], output[output.length - 1], ease(progress));
};
