import { render } from "@testing-library/preact";
import { createRef } from "preact";
import { useRef } from "preact/hooks";
import { describe, expect, it } from "vitest";
import { useMergedRef } from "./useMergedRef";

describe("useMergedRef", () => {
  it("sets both the internal ref and an external object ref to the same node", () => {
    const external = createRef<HTMLDivElement>();
    let internal: { current: HTMLDivElement | null } = { current: null };

    function Probe() {
      internal = useRef<HTMLDivElement>(null);
      const merged = useMergedRef(internal, external);
      return <div ref={merged} data-testid="target" />;
    }

    const { getByTestId } = render(<Probe />);
    const node = getByTestId("target");
    expect(internal.current).toBe(node);
    expect(external.current).toBe(node);
  });

  it("calls an external function ref with the node", () => {
    let received: HTMLDivElement | null = null;
    let internal: { current: HTMLDivElement | null } = { current: null };

    function Probe() {
      internal = useRef<HTMLDivElement>(null);
      const merged = useMergedRef(internal, (el) => {
        received = el;
      });
      return <div ref={merged} data-testid="target" />;
    }

    const { getByTestId } = render(<Probe />);
    expect(received).toBe(getByTestId("target"));
    expect(internal.current).toBe(getByTestId("target"));
  });

  it("works with no external ref at all", () => {
    let internal: { current: HTMLDivElement | null } = { current: null };

    function Probe() {
      internal = useRef<HTMLDivElement>(null);
      const merged = useMergedRef(internal);
      return <div ref={merged} data-testid="target" />;
    }

    const { getByTestId } = render(<Probe />);
    expect(internal.current).toBe(getByTestId("target"));
  });
});
