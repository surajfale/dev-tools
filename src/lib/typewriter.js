/**
 * Planning for the line-by-line "typing" reveal of formatted output.
 *
 * The reveal is decoration, so it must never slow anyone down: it always
 * finishes in roughly `targetMs`, re-renders at most `maxTicks` times, and is
 * skipped entirely for large outputs (the user wants the result, not a show).
 */
export const TYPE_MAX_LINES = 200;

/**
 * @param {number} lineCount number of lines in the output
 * @param {{ targetMs?: number, minInterval?: number, maxTicks?: number, maxLines?: number }} [options]
 * @returns {{ linesPerTick: number, interval: number, ticks: number } | null}
 *   `null` means "show everything immediately".
 */
export function planReveal(lineCount, options = {}) {
  const { targetMs = 700, minInterval = 16, maxTicks = 40, maxLines = TYPE_MAX_LINES } = options;

  if (!Number.isFinite(lineCount) || lineCount <= 1 || lineCount > maxLines) return null;

  const linesPerTick = Math.ceil(lineCount / Math.min(lineCount, maxTicks));
  const ticks = Math.ceil(lineCount / linesPerTick);
  const interval = Math.max(minInterval, Math.round(targetMs / ticks));

  return { linesPerTick, interval, ticks };
}

/** True when the user asked the OS for reduced motion (false outside a browser). */
export function prefersReducedMotion() {
  try {
    return typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;
  } catch {
    return false;
  }
}
