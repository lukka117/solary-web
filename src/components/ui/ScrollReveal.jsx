import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

/**
 * Wraps children in a scroll-triggered fade-up animation.
 * Each direct child staggers in sequentially.
 */
export default function ScrollReveal({
  children,
  className = '',
  as: Tag = 'div',
  stagger = 0.12,
  y = 30,
  duration = 0.8,
  start = 'top 85%',
}) {
  const ref = useRef(null);

  useGSAP(() => {
    if (!ref.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const targets = ref.current.children;
    if (!targets.length) return;

    gsap.set(targets, { y, opacity: 0 });

    gsap.to(targets, {
      y: 0,
      opacity: 1,
      duration,
      stagger,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: ref.current,
        start,
        toggleActions: 'play none none none',
      },
    });
  }, { scope: ref });

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
