import { describe, expect, it } from "vitest";
import { isHeaderStuck } from "./stickyHeader";

describe("isHeaderStuck", () => {
  it("is stuck once the header reaches the stick line and its section still has room below", () => {
    expect(isHeaderStuck({ top: 44, height: 60 }, { bottom: 800 })).toBe(true);
  });

  it("is not stuck while the header is still scrolling in from below the stick line", () => {
    expect(isHeaderStuck({ top: 200, height: 60 }, { bottom: 800 })).toBe(false);
  });

  it("is not stuck once the section has scrolled past (no room left below the header)", () => {
    expect(isHeaderStuck({ top: 44, height: 60 }, { bottom: 90 })).toBe(false);
  });

  it("is not stuck once it has released and is scrolling away with its section", () => {
    // A regression case: top has drifted well below the stick line (no
    // longer pinned), even though the section itself still has room left —
    // this must not read as "stuck" just because `bottom` still passes.
    expect(isHeaderStuck({ top: -50, height: 60 }, { bottom: 300 })).toBe(false);
    expect(isHeaderStuck({ top: 3, height: 60 }, { bottom: 700 })).toBe(false);
  });

  it("respects a custom stick line", () => {
    expect(isHeaderStuck({ top: 100, height: 60 }, { bottom: 800 }, 100)).toBe(true);
    expect(isHeaderStuck({ top: 80, height: 60 }, { bottom: 800 }, 50)).toBe(false);
  });
});
