import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const GALLERY_ITEMS = [
  { src: '/gallery/solary-1.png', caption: 'Solary - One view after the other' },
  { src: '/gallery/solary-2.png', caption: 'Solary - One view after the other' },
  { src: '/gallery/solary-3.png', caption: 'Solary - One view after the other' },
  { src: '/gallery/solary-4.jpeg', caption: 'Solary - One view after the other' },
  { src: '/gallery/solary-5.png', caption: 'Solary - One view after the other' },
];

/** Extra scroll (px) the section stays pinned after the last card is fully visible */
const DWELL_PX = 300;

/**
 * >1 = longer pin distance for the same gallery width, so each wheel tick moves the strip less
 * (slower, easier to land where you want).
 */
const SCROLL_DISTANCE_MULTIPLIER = 1.75;

/**
 * Scrub lag in seconds. Lower follows the scrollbar more tightly (more predictable);
 * `true` = perfectly locked to scroll (can feel jittery on trackpads).
 */
const SCRUB_SMOOTH_SEC = 0.35;

function horizontalOverlap(track, clip) {
  if (!track || !clip) return 0;
  return Math.max(0, track.scrollWidth - clip.clientWidth);
}

export default function ProductScrollSection() {
  const sectionRef = useRef(null);
  const clipRef = useRef(null);
  const trackRef = useRef(null);

  useGSAP(() => {
    const section = sectionRef.current;
    const clip = clipRef.current;
    const track = trackRef.current;
    if (!section || !clip || !track) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    gsap.set(track, { clearProps: 'transform' });
    gsap.set(track, { x: 0 });

    const getOverlap = () => horizontalOverlap(track, clip);
    const overlap = getOverlap();

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () =>
          `+=${Math.max(1, (getOverlap() + DWELL_PX) * SCROLL_DISTANCE_MULTIPLIER)}`,
        pin: true,
        pinSpacing: true,
        scrub: SCRUB_SMOOTH_SEC,
        invalidateOnRefresh: true,
      },
    });

    tl.to(track, {
      x: () => -getOverlap(),
      duration: 1,
      ease: 'none',
    });

    tl.to({}, { duration: DWELL_PX / Math.max(1, overlap) });
  }, { dependencies: [] });

  return (
    <section ref={sectionRef} className="product-scroll-drive">
      <p className="product-scroll-label">Product</p>
      <div className="product-scroll-clip" ref={clipRef}>
        <div className="product-scroll-track" ref={trackRef} role="list">
          {GALLERY_ITEMS.map((item, i) => (
            <figure className="product-scroll-card" key={`${item.caption}-${i}`} role="listitem">
              <img
                src={item.src}
                alt={item.caption}
                className="product-scroll-img"
                decoding="async"
                fetchPriority={i === 0 ? 'high' : 'low'}
                loading={i < 3 ? 'eager' : 'lazy'}
              />
              <figcaption className="product-scroll-caption">
                {item.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
