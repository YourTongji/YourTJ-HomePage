import React from 'react';

// Same constraint as React.lazy.
type AnyComponent = React.ComponentType<any>;

export type PreloadableComponent<T extends AnyComponent> = React.LazyExoticComponent<T> & {
  /** Starts (or joins) the chunk download without rendering anything. */
  preload: () => Promise<unknown>;
};

/**
 * React.lazy with a handle on the import, so a screen's chunk can be fetched
 * before the visitor switches to it. The factory runs at most once; rendering
 * and preloading share the same promise.
 */
export const lazyWithPreload = <T extends AnyComponent>(
  factory: () => Promise<{ default: T }>,
): PreloadableComponent<T> => {
  let pending: Promise<{ default: T }> | null = null;
  const load = () => (pending ??= factory());
  const Component = React.lazy(load) as PreloadableComponent<T>;
  Component.preload = load;
  return Component;
};

const onIdle = (task: () => void) => {
  if (typeof window.requestIdleCallback === 'function') window.requestIdleCallback(task, { timeout: 2000 });
  else window.setTimeout(task, 200);
};

/**
 * Warms a set of chunks in priority order: the first group right away (what
 * the visitor sees or is one step from seeing), the rest one at a time when
 * the main thread is idle, so preloading never competes with a scroll or an
 * animation that is running.
 */
export const preloadInOrder = (urgent: Array<() => Promise<unknown>>, later: Array<() => Promise<unknown>>) => {
  urgent.forEach((load) => void load().catch(() => undefined));
  const queue = [...later];
  const next = () => {
    const load = queue.shift();
    if (!load) return;
    load()
      .catch(() => undefined)
      .finally(() => onIdle(next));
  };
  onIdle(next);
};
