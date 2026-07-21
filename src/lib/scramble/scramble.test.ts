import { describe, expect, it } from "vitest";
import { computeScrambleDuration, renderScrambledFrame } from "./scramble";

describe("computeScrambleDuration", () => {
  it("scales with length", () => {
    expect(computeScrambleDuration(0)).toBe(22);
    expect(computeScrambleDuration(10)).toBe(28);
  });

  it("caps at 52 frames for long strings", () => {
    expect(computeScrambleDuration(1000)).toBe(52);
  });
});

describe("renderScrambledFrame", () => {
  const text = "Hello World";

  it("keeps the string length stable and preserves the space when revealCount is 0", () => {
    const frame = renderScrambledFrame(text, 0, 3);
    expect(frame).toHaveLength(text.length);
    expect(frame[5]).toBe(" ");
  });

  it("reveals the full text once revealCount reaches the length", () => {
    expect(renderScrambledFrame(text, text.length, 7)).toBe(text);
  });

  it("always preserves regular spaces regardless of reveal progress", () => {
    const frame = renderScrambledFrame("A B", 0, 5);
    expect(frame[1]).toBe(" ");
  });

  it("preserves non-breaking spaces too", () => {
    const withNbsp = `A${"\u00a0"}B`;
    const frame = renderScrambledFrame(withNbsp, 0, 5);
    expect(frame[1]).toBe("\u00a0");
  });

  it("is deterministic for the same frame and inputs", () => {
    const a = renderScrambledFrame(text, 2, 9);
    const b = renderScrambledFrame(text, 2, 9);
    expect(a).toBe(b);
  });

  it("reveals characters left-to-right as revealCount grows", () => {
    const frame = renderScrambledFrame(text, 5, 1);
    expect(frame.slice(0, 5)).toBe(text.slice(0, 5));
  });
});
