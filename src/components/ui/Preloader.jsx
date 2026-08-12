import { useEffect, useRef, useState } from 'react';
import { useProgress } from '@react-three/drei';
import gsap from 'gsap';

const MIN_DURATION_MS = 1400;
const FAILSAFE_MS = 8000;



/**
 * Cinematic intro overlay: counts real asset-load progress (model + HDR),
 * then lifts away with a curtain reveal. Calls onComplete when fully gone.
 */
export default function Preloader({ onComplete }) {
  const rootRef = useRef(null);
  const barRef = useRef(null);
  const valRef = useRef({ v: 0 });
  const finishedRef = useRef(false);
  const mountedAtRef = useRef(
    typeof performance !== 'undefined' ? performance.now() : Date.now(),
  );
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const [num, setNum] = useState(0);
  const { progress, active } = useProgress();

  const paint = () => {
    const v = valRef.current.v;
    setNum(Math.round(v));
    if (barRef.current) barRef.current.style.transform = `scaleX(${v / 100})`;
  };

  const finish = () => {
    if (finishedRef.current) return;
    finishedRef.current = true;

    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    gsap.to(valRef.current, {
      v: 100,
      duration: reduce ? 0 : 0.45,
      ease: 'power2.out',
      onUpdate: paint,
      onComplete: () => {
        const root = rootRef.current;
        if (!root) {
          onCompleteRef.current?.();
          return;
        }

        if (reduce) {
          gsap.set(root, { display: 'none' });
          onCompleteRef.current?.();
          return;
        }

        const tl = gsap.timeline({ onComplete: () => onCompleteRef.current?.() });
        tl.to(root.querySelectorAll('[data-pre-fade]'), {
          opacity: 0,
          y: -18,
          duration: 0.5,
          ease: 'power2.in',
          stagger: 0.06,
        })
          .to(
            root,
            { clipPath: 'inset(0% 0% 100% 0%)', duration: 1.0, ease: 'power4.inOut' },
            '-=0.1',
          )
          .set(root, { display: 'none' });
      },
    });
  };

  useEffect(() => {
    const id = window.setTimeout(finish, FAILSAFE_MS);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    const target = Math.max(valRef.current.v, Math.min(100, progress));
    gsap.to(valRef.current, {
      v: target,
      duration: 0.7,
      ease: 'power2.out',
      onUpdate: paint,
    });
  }, [progress]);

  useEffect(() => {
    if (finishedRef.current) return undefined;
    if (!active && progress >= 100) {
      const elapsed =
        (typeof performance !== 'undefined' ? performance.now() : Date.now()) -
        mountedAtRef.current;
      const wait = Math.max(400, MIN_DURATION_MS - elapsed);
      const id = window.setTimeout(finish, wait);
      return () => window.clearTimeout(id);
    }
    return undefined;
  }, [active, progress]);

  return (
    <div ref={rootRef} className="preloader" role="status" aria-live="polite">
      <div className="preloader__grain" aria-hidden />

      <div className="preloader__inner">
        <span className="preloader__brand" data-pre-fade>
          Solary 
          <sup className="preloader__mark">®</sup>
        </span>
        <span className="preloader__tag" data-pre-fade>
          Sculpting light for modern living
        </span>
      </div>

      <div className="preloader__meter" data-pre-fade>
        <div className="preloader__track">
          <span ref={barRef} className="preloader__bar" />
        </div>
        <div className="preloader__row">
          <span className="preloader__status">Preparing your light</span>
          <span className="preloader__num">
            {String(num).padStart(3, '0')}
            <em>%</em>
          </span>
        </div>
      </div>
    </div>
  );
}
