import type { Ref } from "preact";
import { useCallback } from "preact/hooks";

/**
 * Combines an internal ref (used within the component itself) with an
 * optional external one (forwarded from a parent), keeping both in sync.
 */
export function useMergedRef<T>(internalRef: { current: T | null }, externalRef?: Ref<T>) {
  return useCallback(
    (el: T | null) => {
      internalRef.current = el;
      if (typeof externalRef === "function") {
        externalRef(el);
      } else if (externalRef) {
        (externalRef as { current: T | null }).current = el;
      }
    },
    [internalRef, externalRef],
  );
}
