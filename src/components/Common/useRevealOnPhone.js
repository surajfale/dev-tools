import { useCallback, useEffect, useRef } from 'react';
import { prefersReducedMotion } from '../../lib/typewriter';
import { PHONE_QUERY } from './ToolActionBar';

// Output can keep growing after the first scroll (syntax highlighting renders
// a beat later, the typing reveal adds lines for ~700ms), which can leave the
// first scroll stopped short at the old page end. One follow-up scroll fixes it.
const SETTLE_MS = 800;

/**
 * On phones, input and output are stacked, so a successful run would leave
 * the result off-screen. Attach `ref` to the output section and call
 * `reveal()` after a successful run to scroll it into view (no-op on wider
 * screens, where both columns are visible). Give the target a
 * `scrollMarginTop` so it lands below the fixed header.
 */
export default function useRevealOnPhone() {
  const ref = useRef(null);
  const cancelRef = useRef(() => {});

  useEffect(() => () => cancelRef.current(), []);

  const reveal = useCallback(() => {
    if (typeof window === 'undefined' || !window.matchMedia?.(PHONE_QUERY).matches) return;
    cancelRef.current();
    const behavior = prefersReducedMotion() ? 'auto' : 'smooth';
    const scroll = () => ref.current?.scrollIntoView({ block: 'start', behavior });

    // Wait a frame so the new output is in the DOM, then scroll.
    const frame = requestAnimationFrame(scroll);
    const settle = setTimeout(() => {
      const el = ref.current;
      if (!el) return;
      const margin = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
      // Only correct if the output top is still below where it should be.
      if (el.getBoundingClientRect().top > margin + 8) scroll();
    }, SETTLE_MS);

    // The user taking over the scroll cancels the follow-up.
    const stop = () => cancelRef.current();
    window.addEventListener('touchstart', stop, { passive: true, once: true });
    window.addEventListener('wheel', stop, { passive: true, once: true });
    cancelRef.current = () => {
      cancelAnimationFrame(frame);
      clearTimeout(settle);
      window.removeEventListener('touchstart', stop);
      window.removeEventListener('wheel', stop);
      cancelRef.current = () => {};
    };
  }, []);

  return [ref, reveal];
}
