import { fireEvent, render, screen } from "@testing-library/preact";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PortraitCard } from "./PortraitCard";

function mockMatchMedia(matches: boolean) {
  window.matchMedia = vi.fn().mockReturnValue({
    matches,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }) as unknown as typeof window.matchMedia;
}

describe("PortraitCard", () => {
  const originalMatchMedia = window.matchMedia;
  afterEach(() => {
    window.matchMedia = originalMatchMedia;
  });

  it("renders the portrait with the correct accessible name", () => {
    mockMatchMedia(true);
    render(<PortraitCard />);
    expect(screen.getByRole("img", { name: "Antoine Gagnepain" })).toBeInTheDocument();
  });

  it("shows HOVER by default and switches to LIVE while the card is hovered (fine pointer)", () => {
    mockMatchMedia(true);
    const { container } = render(<PortraitCard />);
    const outer = container.firstElementChild as HTMLElement;

    expect(screen.getByText("HOVER")).toBeInTheDocument();

    fireEvent.mouseEnter(outer);
    expect(screen.getByText("LIVE")).toBeInTheDocument();

    fireEvent.mouseLeave(outer);
    expect(screen.getByText("HOVER")).toBeInTheDocument();
  });

  it("shows TAP by default and toggles to LIVE on tap (coarse pointer)", () => {
    mockMatchMedia(false);
    const { container } = render(<PortraitCard />);
    const outer = container.firstElementChild as HTMLElement;

    expect(screen.getByText("TAP")).toBeInTheDocument();

    fireEvent.click(outer);
    expect(screen.getByText("LIVE")).toBeInTheDocument();

    fireEvent.click(outer);
    expect(screen.getByText("TAP")).toBeInTheDocument();
  });

  it("isn't cancelled out by the synthetic mouseenter touch browsers fire just before click", () => {
    mockMatchMedia(false);
    const { container } = render(<PortraitCard />);
    const outer = container.firstElementChild as HTMLElement;

    fireEvent.mouseEnter(outer);
    fireEvent.click(outer);
    expect(screen.getByText("LIVE")).toBeInTheDocument();
  });

  it("mounts and unmounts without throwing despite jsdom having no real canvas backend", () => {
    mockMatchMedia(true);
    const { unmount } = render(<PortraitCard />);
    expect(() => unmount()).not.toThrow();
  });
});
