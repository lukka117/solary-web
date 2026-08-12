import { forwardRef, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const HeroSection = forwardRef(function HeroSection(
  {
    ready = true,
    activeColorHex,
    palette,
    paletteOpen,
    onPaletteOpenChange,
    onSelectColor,
  },
  ref
) {
  const panelRef = useRef(null);
  const contentRef = useRef(null);

  useGSAP(() => {
    if (!contentRef.current) return;
    const els = contentRef.current.children;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(els, { y: 0, opacity: 1 });
      return;
    }

    /* Keep hidden until the intro preloader lifts, then stagger in. */
    gsap.set(els, { y: 40, opacity: 0 });
    if (!ready) return;

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.to(els[0], { y: 0, opacity: 1, duration: 0.9, delay: 0.15 })
      .to(els[1], { y: 0, opacity: 1, duration: 0.7 }, '-=0.4')
      .to(els[2], { y: 0, opacity: 1, duration: 0.7 }, '-=0.35')
      .to(els[3], { y: 0, opacity: 1, duration: 0.6 }, '-=0.3');
  }, { scope: contentRef, dependencies: [ready] });

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && paletteOpen) {
        onPaletteOpenChange(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [paletteOpen, onPaletteOpenChange]);

  useEffect(() => {
    if (!paletteOpen || !panelRef.current) return undefined;
    const first = panelRef.current.querySelector('.hero-swatches button');
    first?.focus();
    return undefined;
  }, [paletteOpen]);

  return (
    <section
      ref={ref}
      className="hero-section section relative isolate flex min-h-screen justify-center text-center"
      aria-label="Introduction"
    >
      <div className="hero-backdrop" aria-hidden />

      <div className="hero-container container">
        <div ref={contentRef} className="hero-content">
          <h1 className="hero-title">
            <span className="hero-title-main">
              Solary
            </span>
            <span className="hero-title-sub">
              Light, sculpted.
            </span>
          </h1>

          <p className="hero-description">
            A single arc of brushed aluminum. 16.8 million colors of diffused
            light. Solary doesn&apos;t illuminate a room - it transforms it.
          </p>

          <div className="hero-actions">
            <button
              type="button"
              className="hero-btn hero-btn-primary"
              onClick={() => onPaletteOpenChange(true)}
            >
              <span className="hero-btn-icon" aria-hidden>
                ◐
              </span>
              Choose Your Light
            </button>
            <a
              href="#cta"
              className="hero-btn hero-btn-secondary"
            >
              Buy Now - €349
            </a>
          </div>

          <div className="hero-scroll-hint" aria-hidden>
            <span className="hero-scroll-line" />
            <span className="hero-scroll-label">
              Scroll
            </span>
          </div>
        </div>
      </div>

      <div
        className="hero-palette-layer"
        data-open={paletteOpen ? 'true' : 'false'}
        aria-hidden={!paletteOpen}
      >
        <div
          className="hero-palette-scrim"
          onClick={() => onPaletteOpenChange(false)}
          aria-hidden
        />
        <div
          className="hero-palette-panel"
          data-open={paletteOpen ? 'true' : 'false'}
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="hero-palette-title"
        >
          <div className="hero-palette-head">
            <h2 id="hero-palette-title" className="hero-palette-title">
              Light colors
            </h2>
            <button
              type="button"
              className="hero-palette-close"
              onClick={() => onPaletteOpenChange(false)}
            >
              ✕
            </button>
          </div>
          <p className="hero-palette-hint">
            Tap a swatch. The lamp updates instantly.
          </p>
          <div
            className="hero-swatches hero-swatches-scrollbar"
            role="listbox"
            aria-label="Lamp color presets"
          >
            {palette.map((item) => {
              const selected = item.hex.toLowerCase() === activeColorHex.toLowerCase();
              return (
                <button
                  key={item.id}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  className="hero-swatch"
                  data-selected={selected ? 'true' : 'false'}
                  style={{ '--swatch': item.hex }}
                  onClick={() => onSelectColor(item.hex)}
                >
                  <span
                    className="hero-swatch-dot"
                    data-selected={selected ? 'true' : 'false'}
                    style={{ background: 'var(--swatch)' }}
                  />
                  <span className="hero-swatch-label">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
});

export default HeroSection;
