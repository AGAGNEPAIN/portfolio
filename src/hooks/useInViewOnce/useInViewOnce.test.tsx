import { render } from "@testing-library/preact";
import { useRef } from "preact/hooks";
import { act } from "preact/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useInViewOnce } from "./useInViewOnce";

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

describe("useInViewOnce", () => {
  let instances: ReturnType<typeof mockIntersectionObserver>;
  beforeEach(() => {
    instances = mockIntersectionObserver();
  });
  afterEach(() => vi.restoreAllMocks());

  function Probe() {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInViewOnce(ref);
    return <div ref={ref}>{String(inView)}</div>;
  }

  it("flips to true on first intersection and disconnects", () => {
    const { getByText } = render(<Probe />);
    expect(getByText("false")).toBeInTheDocument();

    act(() => instances[0].callback([{ isIntersecting: true }]));
    expect(getByText("true")).toBeInTheDocument();
    expect(instances[0].disconnect).toHaveBeenCalled();
  });

  it("stays true even if intersection later becomes false", () => {
    const { getByText } = render(<Probe />);
    act(() => instances[0].callback([{ isIntersecting: true }]));
    act(() => instances[0].callback([{ isIntersecting: false }]));
    expect(getByText("true")).toBeInTheDocument();
  });
});
