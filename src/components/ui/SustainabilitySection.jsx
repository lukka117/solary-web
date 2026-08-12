import ScrollReveal from './ScrollReveal';

const metrics = [
  { value: '62%', label: 'Recycled materials in every unit' },
  { value: '34%', label: 'Reduction in manufacturing CO₂' },
  { value: '2%', label: 'Of revenue to environmental causes' },
  { value: '50,000h', label: 'LED lifespan - zero replacements' },
];

export default function SustainabilitySection() {
  return (
    <section className="sustain-section section" id="sustainability" aria-label="Sustainability">
      <div className="sustain-container container max-w-(--max-width)">
        <ScrollReveal className="sustain-header mb-(--space-xl) max-w-152">
          <p className="section-kicker">Our Commitment</p>
          <h2 className="sustain-title">
            Designed to last. 
            <br />
            Built to account.
          </h2>
          <p className="sustain-lede">
            We don&apos;t call ourselves green - we call ourselves accountable. Every Solary uses recycled aluminum and low-impact packaging.
            Our factory energy comes from certified renewables. And a portion of every sale funds ocean cleanup through The Ocean Cleanup Foundation.
          </p>
        </ScrollReveal>

        <ScrollReveal className="sustain-metrics" stagger={0.1}>
          {metrics.map((m) => (
            <div className="sustain-metric" key={m.value}>
              <span className="sustain-metric-value">
                {m.value}
              </span>
              <span className="sustain-metric-label">{m.label}</span>
            </div>
          ))}
        </ScrollReveal>

        <ScrollReveal className="sustain-footer-note">
          <p className="sustain-note">
            Figures based on 2024 lifecycle assessment vs. 2020 baseline. Full transparency report available at philips.com/sustainability.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
