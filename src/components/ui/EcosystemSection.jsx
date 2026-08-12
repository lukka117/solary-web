import ScrollReveal from './ScrollReveal';

const features = [
  {
    id: 'hue',
    label: 'Hue & Matter',
    detail: 'Connects seamlessly to your existing smart home - Philips Hue, Apple HomeKit, Google Home, Amazon Alexa.',
  },
  {
    id: 'circadian',
    label: 'Adaptive Rhythm',
    detail: 'Light that follows your circadian cycle. Cool and bright at noon, warm and dim by evening - automatically.',
  },
  {
    id: 'scenes',
    label: 'Scene Memory',
    detail: 'Save and recall your favorite atmospheres. One tap to shift from focus mode to cinema night.',
  },
  {
    id: 'voice',
    label: 'Voice & App',
    detail: '"Hey Siri, set Solary to sunset." Control from anywhere - your phone, your watch, or just your voice.',
  },
];

export default function EcosystemSection() {
  return (
    <section className="ecosystem-section section" id="ecosystem" aria-label="Smart features">
      <div className="ecosystem-container container max-w-(--max-width)">
        <ScrollReveal className="ecosystem-header mb-(--space-xl) max-w-[36rem]">
          <p className="section-kicker">Smart Ecosystem</p>
          <h2 className="ecosystem-title">Quietly intelligent.</h2>
          <p className="ecosystem-lede">
            Solary integrates with the systems you already use. No new apps to learn, no hubs to buy. Just light that understands your routine.
          </p>
        </ScrollReveal>

        <div className="ecosystem-features">
          {features.map((f, i) => (
            <ScrollReveal key={f.id} className="ecosystem-feature" stagger={0}>
              <div className="ecosystem-feature-inner">
                <span className="ecosystem-feature-index">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="ecosystem-feature-content flex-1">
                  <h3 className="ecosystem-feature-label">
                    {f.label}
                  </h3>
                  <p className="ecosystem-feature-detail">
                    {f.detail}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
