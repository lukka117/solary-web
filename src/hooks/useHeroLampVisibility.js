import { useLayoutEffect, useRef, useState } from 'react';

const EDGE_PX = 24;

/**
 * True while the hero block is still in view (3D lamp only behind hero + fixed header).
 */
export function useHeroLampVisibility(heroSectionRef) {
  const [visible, setVisible] = useState(true);
  const rafId = useRef(0);

  useLayoutEffect(() => {
    const sync = () => {
      cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(() => {
        if (!heroSectionRef.current) return;
        const bottom = heroSectionRef.current.getBoundingClientRect().bottom;
        setVisible((prev) => {
          const next = bottom > EDGE_PX;
          return prev === next ? prev : next;
        });
      });
    };

    sync();
    window.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);

    return () => {
      cancelAnimationFrame(rafId.current);
      window.removeEventListener('scroll', sync);
      window.removeEventListener('resize', sync);
    };
  }, [heroSectionRef]);

  return visible;
}
