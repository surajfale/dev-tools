import { describe, it, expect } from 'vitest';
import { planReveal, TYPE_MAX_LINES } from './typewriter';

describe('planReveal', () => {
  it('skips the reveal for empty, single-line or invalid input', () => {
    expect(planReveal(0)).toBeNull();
    expect(planReveal(1)).toBeNull();
    expect(planReveal(NaN)).toBeNull();
  });

  it('skips the reveal for outputs larger than the cap', () => {
    expect(planReveal(TYPE_MAX_LINES + 1)).toBeNull();
    expect(planReveal(TYPE_MAX_LINES)).not.toBeNull();
  });

  it('reveals one line per tick for short outputs', () => {
    const plan = planReveal(16);
    expect(plan.linesPerTick).toBe(1);
    expect(plan.ticks).toBe(16);
    expect(plan.interval).toBe(Math.round(700 / 16));
  });

  it('batches lines so long outputs never exceed maxTicks re-renders', () => {
    const plan = planReveal(200);
    expect(plan.ticks).toBeLessThanOrEqual(40);
    expect(plan.linesPerTick * plan.ticks).toBeGreaterThanOrEqual(200);
  });

  it('keeps the total duration close to the target', () => {
    for (const n of [2, 10, 37, 120, 200]) {
      const { interval, ticks } = planReveal(n);
      // Interval rounding to whole ms may drift a few percent either way.
      expect(interval * ticks).toBeGreaterThanOrEqual(700 * 0.95);
      expect(interval * ticks).toBeLessThanOrEqual(700 * 1.05);
    }
  });

  it('never ticks faster than minInterval', () => {
    expect(planReveal(40, { targetMs: 100, minInterval: 16 }).interval).toBe(16);
  });
});
