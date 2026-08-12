import ScrollReveal from './ScrollReveal';

export default function CTASection() {
  return (
    <section className="cta-section section" id="cta" aria-label="Purchase Solary">
      <div
        className="cta-bg"
        style={{
          background: 'radial-gradient(circle at 50% 100%, var(--glow-color) 0%, transparent 60%)',
          transitionProperty: 'opacity, background',
          transitionDuration: 'var(--transition-normal), var(--transition-slow)',
        }}
        aria-hidden="true"
      />

      <div className="cta-inner container">
        <ScrollReveal className="cta-content" y={40}>
          <h2 className="cta-title">
            Your space deserves this.
          </h2>
          <p className="cta-description">
            Solary is available now. Free shipping. 30-day returns.
          </p>
          <div className="cta-actions">
            <button
              type="button"
              className="cta-button"
            >
              Order Solary - €349
            </button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
