import { render } from "@testing-library/preact";
import { describe, expect, it } from "vitest";
import { ICON_GEOMETRY } from "../../lib/sectionIcon/sectionIcon";
import { SectionIconGizmo } from "./SectionIconGizmo";
import styles from "./SectionIconGizmo.module.css";

describe("SectionIconGizmo", () => {
  it("is hidden (opacity 0) and has no lines when active is null", () => {
    const { container } = render(<SectionIconGizmo active={null} />);
    const svg = container.querySelector("svg") as SVGSVGElement;
    expect(svg.style.opacity).toBe("0");
    expect(container.querySelectorAll("line")).toHaveLength(0);
  });

  it("shows the experiences icon geometry and default color when active is 'exp'", () => {
    const { container } = render(<SectionIconGizmo active="exp" />);
    const svg = container.querySelector("svg") as SVGSVGElement;
    expect(svg.style.opacity).toBe("1");
    expect(svg.classList.contains(styles.onLight)).toBe(false);
    const lines = container.querySelectorAll("line");
    expect(lines).toHaveLength(4);
    expect(lines[0].getAttribute("x1")).toBe(String(ICON_GEOMETRY.exp[0][0]));
  });

  it("shows the stack icon geometry and the on-light color when active is 'stack'", () => {
    const { container } = render(<SectionIconGizmo active="stack" />);
    const svg = container.querySelector("svg") as SVGSVGElement;
    expect(svg.style.opacity).toBe("1");
    expect(svg.classList.contains(styles.onLight)).toBe(true);
    const lines = container.querySelectorAll("line");
    expect(lines[0].getAttribute("x1")).toBe(String(ICON_GEOMETRY.stack[0][0]));
  });

  it("shrinks (adds the stuck class) when stuck is true", () => {
    const { container } = render(<SectionIconGizmo active="stack" stuck />);
    const svg = container.querySelector("svg") as SVGSVGElement;
    expect(svg.classList.contains(styles.stuck)).toBe(true);
  });
});
