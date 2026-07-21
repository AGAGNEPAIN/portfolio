const NEWTON_ITERATIONS = 4;
const NEWTON_MIN_SLOPE = 0.001;
const SUBDIVISION_PRECISION = 0.0000001;
const SUBDIVISION_MAX_ITERATIONS = 10;
const SPLINE_TABLE_SIZE = 11;
const SAMPLE_STEP = 1.0 / (SPLINE_TABLE_SIZE - 1.0);

function a(x1: number, x2: number) {
  return 1.0 - 3.0 * x2 + 3.0 * x1;
}
function b(x1: number, x2: number) {
  return 3.0 * x2 - 6.0 * x1;
}
function c(x1: number) {
  return 3.0 * x1;
}

function calcBezier(t: number, x1: number, x2: number): number {
  return ((a(x1, x2) * t + b(x1, x2)) * t + c(x1)) * t;
}

function getSlope(t: number, x1: number, x2: number): number {
  return 3.0 * a(x1, x2) * t * t + 2.0 * b(x1, x2) * t + c(x1);
}

/**
 * Builds a CSS-compatible `cubic-bezier(x1,y1,x2,y2)` easing function
 * (input/output both 0–1) — used to reproduce a CSS timing function's exact
 * curve in JS, e.g. for scroll-driven effects not implemented as CSS
 * animations. Standard Newton-Raphson/bisection approach (same algorithm
 * browsers use internally for `cubic-bezier()`).
 */
export function cubicBezier(x1: number, y1: number, x2: number, y2: number): (x: number) => number {
  if (x1 === y1 && x2 === y2) {
    return (x) => x;
  }

  const sampleValues = new Float32Array(SPLINE_TABLE_SIZE);
  for (let i = 0; i < SPLINE_TABLE_SIZE; i++) {
    sampleValues[i] = calcBezier(i * SAMPLE_STEP, x1, x2);
  }

  function getTForX(x: number): number {
    let intervalStart = 0.0;
    let currentSample = 1;
    const lastSample = SPLINE_TABLE_SIZE - 1;
    for (; currentSample !== lastSample && sampleValues[currentSample] <= x; currentSample++) {
      intervalStart += SAMPLE_STEP;
    }
    currentSample--;

    const distBetweenSamples = sampleValues[currentSample + 1] - sampleValues[currentSample];
    const dist = (x - sampleValues[currentSample]) / distBetweenSamples;
    const guessForT = intervalStart + dist * SAMPLE_STEP;

    const initialSlope = getSlope(guessForT, x1, x2);
    if (initialSlope >= NEWTON_MIN_SLOPE) {
      let t = guessForT;
      for (let i = 0; i < NEWTON_ITERATIONS; i++) {
        const currentSlope = getSlope(t, x1, x2);
        if (currentSlope === 0.0) return t;
        const currentX = calcBezier(t, x1, x2) - x;
        t -= currentX / currentSlope;
      }
      return t;
    }
    if (initialSlope === 0.0) {
      return guessForT;
    }

    let lo = intervalStart;
    let hi = intervalStart + SAMPLE_STEP;
    let t = lo;
    let i = 0;
    let currentX: number;
    do {
      t = lo + (hi - lo) / 2.0;
      currentX = calcBezier(t, x1, x2) - x;
      if (currentX > 0.0) hi = t;
      else lo = t;
    } while (Math.abs(currentX) > SUBDIVISION_PRECISION && ++i < SUBDIVISION_MAX_ITERATIONS);
    return t;
  }

  return (x: number): number => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    return calcBezier(getTForX(x), y1, y2);
  };
}

/** Matches `--ease-out-quint` (`cubic-bezier(0.16, 1, 0.3, 1)`) from tokens.css. */
export const easeOutQuint = cubicBezier(0.16, 1, 0.3, 1);
