import { render } from "@testing-library/preact";
import { useRef } from "preact/hooks";
import { act } from "preact/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useIsIntersecting } from "./useIsIntersecting";

type ObserverCallback = (entries: Pick<IntersectionObserverEntry, "isIntersecting">[]) => void;

function mockIntersectionObserver() {
  const instances: {
    callback: ObserverCallback;
    observe: ReturnType<typeof vi.fn>;
    disconnect: ReturnType<typeof vi.fn>;
  }[] = [];
  class FakeIntersectionObserver {
    callback: ObserverCallback;
    observe = vi.fn();
    disconnect = vi.fn();
    constructor(callback: ObserverCallback) {
      this.callback = callback;
      instances.push(this);
    }
  }
  // @ts-expect-error - partial mock is sufficient for these tests
  window.IntersectionObserver = FakeIntersectionObserver;
  return instances;
}

describe("useIsIntersecting", () => {
  let instances: ReturnType<typeof mockIntersectionObserver>;
  beforeEach(() => {
    instances = mockIntersectionObserver();
  });
  afterEach(() => vi.restoreAllMocks());

  function Probe() {
    const ref = useRef<HTMLDivElement>(null);
    const intersecting = useIsIntersecting(ref);
    return <div ref={ref}>{String(intersecting)}</div>;
  }

  it("starts false and flips both ways as intersection changes", () => {
    const { getByText } = render(<Probe />);
    expect(getByText("false")).toBeInTheDocument();

    act(() => instances[0].callback([{ isIntersecting: true }]));
    expect(getByText("true")).toBeInTheDocument();

    act(() => instances[0].callback([{ isIntersecting: false }]));
    expect(getByText("false")).toBeInTheDocument();
  });
});
