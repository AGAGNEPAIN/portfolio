import { render } from "@testing-library/preact";
import { afterEach, describe, expect, it, vi } from "vitest";
import { GrainOverlay } from "./GrainOverlay";

describe("GrainOverlay", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders a single fixed overlay div without throwing when canvas 2d context is unavailable", () => {
    // jsdom has no real canvas backend by default, so getContext() returns null here.
    const { container } = render(<GrainOverlay />);
    const div = container.querySelector("div") as HTMLDivElement;
    expect(container.querySelectorAll("div")).toHaveLength(1);
    expect(div.style.backgroundImage).toBe("");
  });

  it("paints the generated noise texture into the background-image as a data URL", () => {
    const fakeCtx = {
      createImageData: vi.fn(() => ({ data: new Uint8ClampedArray(180 * 180 * 4) })),
      putImageData: vi.fn(),
    };
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(
      fakeCtx as unknown as ReturnType<HTMLCanvasElement["getContext"]>,
    );
    vi.spyOn(HTMLCanvasElement.prototype, "toDataURL").mockReturnValue(
      "data:image/png;base64,fake",
    );

    const { container } = render(<GrainOverlay />);
    const div = container.querySelector("div") as HTMLDivElement;

    expect(fakeCtx.createImageData).toHaveBeenCalledWith(180, 180);
    expect(fakeCtx.putImageData).toHaveBeenCalled();
    // jsdom's CSSOM re-quotes url() values when serializing the inline style.
    expect(div.style.backgroundImage).toBe('url("data:image/png;base64,fake")');
  });
});
