import { fireEvent, render, screen } from "@testing-library/preact";
import { describe, expect, it } from "vitest";
import { PortraitCard } from "./PortraitCard";

describe("PortraitCard", () => {
  it("renders the portrait with the correct accessible name", () => {
    render(<PortraitCard />);
    expect(screen.getByRole("img", { name: "Antoine Gagnepain" })).toBeInTheDocument();
  });

  it("shows HOVER by default and switches to LIVE while the card is hovered", () => {
    const { container } = render(<PortraitCard />);
    const outer = container.firstElementChild as HTMLElement;

    expect(screen.getByText("HOVER")).toBeInTheDocument();

    fireEvent.mouseEnter(outer);
    expect(screen.getByText("LIVE")).toBeInTheDocument();

    fireEvent.mouseLeave(outer);
    expect(screen.getByText("HOVER")).toBeInTheDocument();
  });

  it("mounts and unmounts without throwing despite jsdom having no real canvas backend", () => {
    const { unmount } = render(<PortraitCard />);
    expect(() => unmount()).not.toThrow();
  });
});
