import ScrollReveal from './ScrollReveal';

export default function CraftSection() {
  return (
    <section className="craft-section section" id="craft" aria-label="Craftsmanship">
      <div className="craft-container container max-w-(--max-width)">
        <ScrollReveal className="craft-header mb-(--space-xl)">
          <p className="section-kicker">Design Language</p>
          <h2 className="craft-title">The arc is the architecture.</h2>
        </ScrollReveal>

        <div className="craft-grid grid grid-cols-2 gap-(--space-sm) max-md:grid-cols-1">
          <ScrollReveal className="craft-block">
            <div className="craft-block-inner">
              <h3 className="craft-block-title">
                Continuous Curve
              </h3>
              <p className="craft-block-body">
                A single unbroken sweep of aerospace-grade aluminum, finished by hand. Every radius was prototyped seventy-three times before we found the one that felt inevitable.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal className="craft-block">
            <div className="craft-block-inner">
              <h3 className="craft-block-title">
                Diffusion Membrane
              </h3>
              <p className="craft-block-body">
                Light scatters without hotspots - soft enough for a bedside, bright enough for a workspace. No glare, only glow.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal className="craft-block">
            <div className="craft-block-inner">
              <h3 className="craft-block-title">
                Weighted Base
              </h3>
              <p className="craft-block-body">
                450g of precision-milled aluminum. The lamp stays exactly where you place it - balanced, grounded, permanent.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal className="craft-block">
            <div className="craft-block-inner">
              <h3 className="craft-block-title">
                Touch Interface
              </h3>
              <p className="craft-block-body">
                A capacitive strip hidden along the inner arc. Slide to dim, tap to switch scenes. No buttons, no seams - just the surface responding to your intention.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
