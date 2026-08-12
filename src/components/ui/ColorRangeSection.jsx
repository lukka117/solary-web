import ScrollReveal from './ScrollReveal';

export default function ColorRangeSection() {
  return (
    <section className="color-section section" id="color-range" aria-label="Color Range">
      <div className="color-container container flex max-w-(--max-width) flex-col gap-(--space-xl)">
        <div className="color-editorial grid grid-cols-2 items-center gap-(--space-lg) max-md:grid-cols-1 max-md:gap-(--space-md)">
          <ScrollReveal className="color-display-wrap flex flex-col">
            <h2 className="color-display">
              16.8M
            </h2>
            <p className="color-display-label">
              Colors
            </p>
          </ScrollReveal>

          <ScrollReveal className="color-content" start="top 80%">
            <p className="section-kicker">Full Spectrum</p>
            <h3 className="color-title">
              Every shade between sunrise and midnight.
            </h3>
            <p className="color-description">
              From the warmest amber to the coolest indigo. Solary renders the full RGB spectrum with clinical precision and organic warmth - because light should feel as natural as it looks.
            </p>
          </ScrollReveal>
        </div>

        <ScrollReveal className="color-spectrum-wrap w-full" y={0} start="top 90%">
          <div className="color-spectrum">
            <div className="color-spectrum-bar" />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
