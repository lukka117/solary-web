import { useMemo, lazy, Suspense } from 'react';
import ScrollReveal from './ScrollReveal';
import { LAMP_PALETTE } from '../../data/lampPalette';

const PresetsModelCanvas = lazy(() => import('../canvas/PresetsModelCanvas'));

export default function PresetsSection({ activeHex, onPresetChange }) {
  const activeId = useMemo(() => {
    const match = LAMP_PALETTE.find((p) => p.hex.toLowerCase() === activeHex?.toLowerCase());
    return match?.id ?? LAMP_PALETTE[0].id;
  }, [activeHex]);

  const handleHover = (preset) => {
    onPresetChange?.(preset.hex);
  };

  return (
    <section className="presets-section section" id="presets" aria-label="Curated Presets">
      <div className="presets-container">
        <div className="presets-content min-w-0 flex-1">
          <ScrollReveal className="presets-header mb-(--space-xl)">
            <p className="section-kicker">Atmospheres</p>
            <h2 className="presets-title">Set the mood.</h2>
          </ScrollReveal>

          <ScrollReveal className="presets-list" start="top 75%">
            {LAMP_PALETTE.map((preset) => {
              const active = activeId === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  className="group preset-btn"
                  data-active={active ? 'true' : 'false'}
                  onMouseEnter={() => handleHover(preset)}
                  onClick={() => handleHover(preset)}
                >
                  <span className="preset-name">{preset.label}</span>
                  <span
                    className="preset-indicator"
                    data-active={active ? 'true' : 'false'}
                    style={{
                      backgroundColor: preset.hex,
                      boxShadow: `0 0 16px ${preset.hex}`,
                    }}
                  />
                </button>
              );
            })}
          </ScrollReveal>
        </div>

        <Suspense fallback={null}>
          <PresetsModelCanvas activeColor={activeHex} />
        </Suspense>
      </div>
    </section>
  );
}
