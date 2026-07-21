import { render } from "@testing-library/preact";
import { describe, expect, it } from "vitest";
import { AvailabilityDot } from "./AvailabilityDot";

describe("AvailabilityDot", () => {
  it("renders a pulse ring and a solid core", () => {
    const { container } = render(<AvailabilityDot />);
    expect(container.querySelectorAll("span")).toHaveLength(3);
  });

  it("applies the given size and color to both layers", () => {
    const { container } = render(<AvailabilityDot size={20} color="#ff0000" />);
    const [, pulse, core] = Array.from(container.querySelectorAll("span"));

    for (const el of [pulse, core]) {
      expect((el as HTMLElement).style.width).toBe("20px");
      expect((el as HTMLElement).style.background).toBe("rgb(255, 0, 0)");
    }
  });
});
