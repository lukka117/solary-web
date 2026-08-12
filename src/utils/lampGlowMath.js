/**
 * Tune emissive + bloom readability for violet / cyan / light blue (low luminance in Rec.709).
 */
export function emissiveIntensityBoost(color) {
  const { r, g, b } = color;
  const y = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  const maxC = Math.max(r, g, b);
  const minC = Math.min(r, g, b);
  const sat = maxC < 1e-5 ? 0 : (maxC - minC) / maxC;

  let boost = 1;
  if (y < 0.78) {
    boost += (0.78 - y) * 0.95;
  }
  if (b > r * 1.02 && b > g * 0.75) {
    boost += 0.18;
  }
  if (r > 0.28 && b > 0.28 && g < Math.max(r, b) * 0.88) {
    boost += 0.1;
  }
  if (g > r * 1.06 && g > b * 1.06 && y < 0.65) {
    boost += 0.08;
  }
  if (sat > 0.48) {
    boost += 0.05;
  }
  return Math.min(2, boost);
}

/** Mild breathing mix on emissive brightness (applied as a multiplier). */
export function breathePulse(seconds, animate) {
  if (!animate) return 1;
  return (
    1 +
    Math.sin(seconds * 2.08) * 0.048 +
    Math.sin(seconds * 4.77 + 0.85) * 0.022 +
    Math.sin(seconds * 0.71 + 0.2) * 0.012
  );
}
