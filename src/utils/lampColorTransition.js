/** Shared lamp / UI glow color interpolation */

/** Linear RGB components in 0–1 from `#rgb` / `#rrggbb` (for GSAP object tweens). */
export function hexToRgbUnit(hex) {
  let h = String(hex).replace('#', '').trim();
  if (h.length === 3) {
    h = h
      .split('')
      .map((c) => c + c)
      .join('');
  }
  const n = parseInt(h, 16);
  if (!Number.isFinite(n) || h.length !== 6) {
    return { r: 1, g: 1, b: 1 };
  }
  return { r: ((n >> 16) & 255) / 255, g: ((n >> 8) & 255) / 255, b: (n & 255) / 255 };
}

export const LAMP_COLOR_DURATION_SEC = 1.35;
export const LAMP_COLOR_EASE = 'sine.inOut';
/** Alpha for `--glow-color` used in hero CTA shadows etc. */
export const LAMP_GLOW_ALPHA = 0.7;
