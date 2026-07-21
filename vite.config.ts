import preact from "@preact/preset-vite";
/// <reference types="vitest/config" />
import { defineConfig } from "vite";

export default defineConfig(({ command }) => ({
  // GitHub Pages serves this project off /portfolio/, not the domain root.
  // Only applied for `vite build` so local dev/tests keep serving at "/".
  base: command === "build" ? "/portfolio/" : "/",
  plugins: [preact()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    css: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      exclude: ["src/main.tsx", "src/**/*.test.{ts,tsx}", "src/vite-env.d.ts"],
    },
  },
}));
