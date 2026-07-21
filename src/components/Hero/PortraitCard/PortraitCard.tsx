import { useEffect, useRef, useState } from "preact/hooks";
import portraitUrl from "../../../assets/portrait.png";
import { useMediaQuery } from "../../../hooks/useMediaQuery/useMediaQuery";
import { FINE_POINTER_QUERY } from "../../../lib/constants/constants";
import { applyDuotone, findDrawnHeight } from "../../../lib/duotone/duotone";
import styles from "./PortraitCard.module.css";

const CANVAS_WIDTH = 720;
const DUOTONE_DARK: readonly [number, number, number] = [11, 59, 44];
const DUOTONE_LIGHT: readonly [number, number, number] = [239, 234, 216];
// Close to this photo's own ratio, so there's little to no jump once it loads.
const FALLBACK_ASPECT_RATIO = 4 / 5;

/**
 * Draws `offscreen`'s drawn region onto `target`, full width. If truncated,
 * takes just the rows that actually decoded and scales them up to fill the
 * frame's height — a zoomed-in but undistorted crop, rather than stretching
 * width and height by different factors (which would warp the image).
 */
function paintCropped(
  target: CanvasRenderingContext2D,
  offscreen: HTMLCanvasElement,
  drawnHeight: number,
  width: number,
  height: number,
) {
  if (drawnHeight > 0 && drawnHeight < height) {
    target.drawImage(offscreen, 0, 0, width, drawnHeight, 0, 0, width, height);
  } else {
    target.drawImage(offscreen, 0, 0);
  }
}

/**
 * Portrait card with an offset lime backdrop and a duotone canvas render that
 * fades into the true-color photo on hover. Both are drawn via canvas (not
 * an <img>) so a truncated source file can be cropped to whatever decoded
 * rather than showing a hard cutoff into blank space — see `findDrawnHeight`.
 *
 * The frame's aspect ratio follows the source photo's own proportions
 * (measured once it loads) instead of forcing a square and cropping the
 * photo to fit — so the whole photo shows, uncropped and undistorted.
 */
export function PortraitCard() {
  const [hovered, setHovered] = useState(false);
  const [aspectRatio, setAspectRatio] = useState(FALLBACK_ASPECT_RATIO);
  // No hover on touch: reveal is tap-driven there instead, so the effect
  // (and its caption) aren't permanently stuck in their pre-hover state.
  const isFinePointer = useMediaQuery(FINE_POINTER_QUERY);
  const duotoneCanvasRef = useRef<HTMLCanvasElement>(null);
  const colorCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const duotoneCanvas = duotoneCanvasRef.current;
    const colorCanvas = colorCanvasRef.current;
    if (!duotoneCanvas || !colorCanvas) return;
    const duotoneCtx = duotoneCanvas.getContext("2d");
    const colorCtx = colorCanvas.getContext("2d");
    if (!duotoneCtx || !colorCtx) return;

    let cancelled = false;
    const image = new Image();
    image.onload = () => {
      if (cancelled) return;
      try {
        const width = CANVAS_WIDTH;
        const height = Math.round(CANVAS_WIDTH * (image.naturalHeight / image.naturalWidth));
        setAspectRatio(image.naturalWidth / image.naturalHeight);

        const offscreen = document.createElement("canvas");
        offscreen.width = width;
        offscreen.height = height;
        const offscreenCtx = offscreen.getContext("2d");
        if (!offscreenCtx) return;
        offscreenCtx.drawImage(image, 0, 0, width, height);
        const imageData = offscreenCtx.getImageData(0, 0, width, height);

        // A truncated source file (missing data past some point) decodes with
        // the remaining rows fully transparent instead of erroring. Crop to
        // whatever did decode and scale it to fill the frame, rather than
        // showing a hard cutoff into blank canvas.
        const drawnHeight = findDrawnHeight(imageData.data, width, height);

        duotoneCanvas.width = width;
        duotoneCanvas.height = height;
        colorCanvas.width = width;
        colorCanvas.height = height;

        // Color canvas first, from the still-untouched (raw color) offscreen bitmap.
        paintCropped(colorCtx, offscreen, drawnHeight, width, height);

        // Then mutate the pixel copy into duotone and paint that.
        applyDuotone(imageData.data, DUOTONE_DARK, DUOTONE_LIGHT);
        offscreenCtx.putImageData(imageData, 0, 0);
        paintCropped(duotoneCtx, offscreen, drawnHeight, width, height);
      } catch {
        // no real canvas pixel backend (e.g. jsdom in tests) — skip silently
      }
    };
    image.src = portraitUrl;

    return () => {
      cancelled = true;
    };
  }, []);

  const toggleReveal = () => {
    if (!isFinePointer) setHovered((prev) => !prev);
  };

  return (
    <button
      type="button"
      className={hovered ? `${styles.wrap} ${styles.revealed}` : styles.wrap}
      onMouseEnter={() => {
        if (isFinePointer) setHovered(true);
      }}
      onMouseLeave={() => {
        if (isFinePointer) setHovered(false);
      }}
      onClick={toggleReveal}
    >
      <div className={styles.frame} style={{ aspectRatio: String(aspectRatio) }}>
        <div className={styles.backdrop} />
        <div className={styles.card}>
          <canvas ref={duotoneCanvasRef} className={styles.canvas} />
          <canvas
            ref={colorCanvasRef}
            className={styles.photo}
            role="img"
            aria-label="Antoine Gagnepain"
          />
        </div>
      </div>
      <div className={styles.caption}>
        <span>FIG. 01</span>
        <span>{hovered ? "LIVE" : isFinePointer ? "HOVER" : "TAP"}</span>
      </div>
    </button>
  );
}
