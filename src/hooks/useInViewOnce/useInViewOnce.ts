import type { RefObject } from "preact";
import { useEffect, useState } from "preact/hooks";

/** Flips to true the first time the observed element enters view, then stays true. */
export function useInViewOnce<T extends Element>(
  ref: RefObject<T>,
  options?: IntersectionObserverInit,
): boolean {
  const [inView, setInView] = useState(false);

  // Depends on the primitive option fields (not `options` itself) to avoid re-observing
  // on every render when a caller passes an inline options object literal.
  // biome-ignore lint/correctness/useExhaustiveDependencies: see comment above.
  useEffect(() => {
    if (inView) return;
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.disconnect();
      }
    }, options);
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, inView, options?.rootMargin, options?.threshold, options?.root]);

  return inView;
}
