import { useEffect, useState, type RefObject } from 'react';

export const useInViewOnce = <T extends Element>(
  ref: RefObject<T>,
  rootMargin = '150px',
): boolean => {
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || hasEntered) return;
    if (!('IntersectionObserver' in window)) {
      setHasEntered(true);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setHasEntered(true);
      observer.disconnect();
    }, { rootMargin });
    observer.observe(element);
    return () => observer.disconnect();
  }, [hasEntered, ref, rootMargin]);

  return hasEntered;
};
