import type { RefObject } from "preact";
import { useEffect, useState } from "preact/hooks";

/** Whether the observed element currently intersects the viewport (or root/rootMargin band). */
export function useIsIntersecting<T extends Element>(
  ref: RefObject<T>,
  options?: IntersectionObserverInit,
): boolean {
  const [intersecting, setIntersecting] = useState(false);

  // Depends on the primitive option fields (not `options` itself) to avoid re-observing
  // on every render when a caller passes an inline options object literal.
  // biome-ignore lint/correctness/useExhaustiveDependencies: see comment above.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      setIntersecting(entry.isIntersecting);
    }, options);
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, options?.rootMargin, options?.threshold, options?.root]);

  return intersecting;
}
