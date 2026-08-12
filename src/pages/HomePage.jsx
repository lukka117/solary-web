import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gsap from 'gsap';

import Preloader from '../components/ui/Preloader';
import HeroSection from '../components/ui/HeroSection';
import ProductScrollSection from '../components/ui/ProductScrollSection';
import ColorRangeSection from '../components/ui/ColorRangeSection';
import CraftSection from '../components/ui/CraftSection';
import EcosystemSection from '../components/ui/EcosystemSection';
import SustainabilitySection from '../components/ui/SustainabilitySection';
import PresetsSection from '../components/ui/PresetsSection';
import CTASection from '../components/ui/CTASection';
import { DEFAULT_LAMP_HEX, LAMP_PALETTE } from '../data/lampPalette';
import {
  hexToRgbUnit,
  LAMP_COLOR_DURATION_SEC,
  LAMP_COLOR_EASE,
  LAMP_GLOW_ALPHA,
} from '../utils/lampColorTransition';
import { useHeroLampVisibility } from '../hooks/useHeroLampVisibility';

const SolaryCanvas = lazy(() => import('../components/canvas/SolaryCanvas'));

const CYCLE_INTERVAL_MS = 4300;

export default function HomePage() {
  const heroSectionRef = useRef(null);
  const userPickedRef = useRef(false);
  const homeShellRef = useRef(null);
  const glowRgbRef = useRef(hexToRgbUnit(DEFAULT_LAMP_HEX));

  const [activeColor, setActiveColor] = useState(DEFAULT_LAMP_HEX);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const lampVisibleBehindHero = useHeroLampVisibility(heroSectionRef);

  const handleIntroComplete = () => {
    setRevealed(true);
    window.dispatchEvent(new Event('solary:ready'));
    ScrollTrigger.refresh();
  };

  useEffect(() => {
    if (paletteOpen) return undefined;

    const id = window.setInterval(() => {
      if (userPickedRef.current) {
        userPickedRef.current = false;
        return;
      }
      setActiveColor((prev) => {
        const idx = LAMP_PALETTE.findIndex((p) => p.hex.toLowerCase() === prev.toLowerCase());
        const safe = idx === -1 ? 0 : idx;
        return LAMP_PALETTE[(safe + 1) % LAMP_PALETTE.length].hex;
      });
    }, CYCLE_INTERVAL_MS);

    return () => window.clearInterval(id);
  }, [paletteOpen]);

  useEffect(() => {
    ScrollTrigger.refresh();
  }, [lampVisibleBehindHero]);

  useLayoutEffect(() => {
    const shell = homeShellRef.current;
    if (!shell) return;

    const target = hexToRgbUnit(activeColor);
    const rgb = glowRgbRef.current;

    const applyShellGlow = () => {
      const { r, g, b } = rgb;
      const rr = Math.round(Math.max(0, Math.min(255, r * 255)));
      const gg = Math.round(Math.max(0, Math.min(255, g * 255)));
      const bb = Math.round(Math.max(0, Math.min(255, b * 255)));
      shell.style.setProperty('--glow-color', `rgba(${rr},${gg},${bb},${LAMP_GLOW_ALPHA})`);
    };

    applyShellGlow();
    gsap.killTweensOf(rgb);
    gsap.to(rgb, {
      r: target.r,
      g: target.g,
      b: target.b,
      duration: LAMP_COLOR_DURATION_SEC,
      ease: LAMP_COLOR_EASE,
      onUpdate: applyShellGlow,
    });
  }, [activeColor]);

  const handleSelectColorFromHero = (hex) => {
    userPickedRef.current = true;
    setActiveColor(hex);
    setPaletteOpen(false);
  };

  return (
    <>
      {!revealed && <Preloader onComplete={handleIntroComplete} />}

      <div className="fx-vignette" aria-hidden />
      <div className="fx-grain" aria-hidden />

      <div
        className={`pointer-events-none fixed inset-0 z-[1] transition-[opacity,visibility] duration-[450ms] ease-in-out [&_canvas]:block [&_canvas]:h-full [&_canvas]:w-full ${
          lampVisibleBehindHero ? 'visible opacity-100 [transition-delay:0s]' : 'invisible opacity-0 [transition-delay:0s,450ms]'
        }`}
        aria-hidden={!lampVisibleBehindHero}
      >
        <Suspense fallback={null}>
          <SolaryCanvas
            activeColor={activeColor}
            sceneActive={lampVisibleBehindHero}
            intro={revealed}
          />
        </Suspense>
      </div>

      <div
        ref={homeShellRef}
        className="home-page relative min-h-screen w-full [&_.product-scroll-drive]:bg-black [&_.section:not(.hero-section)]:bg-black"
      >
        <div className="content-overlay relative z-10 flex w-full flex-col pt-(--header-height)">
          <HeroSection
            ref={heroSectionRef}
            ready={revealed}
            activeColorHex={activeColor}
            palette={LAMP_PALETTE}
            paletteOpen={paletteOpen}
            onPaletteOpenChange={setPaletteOpen}
            onSelectColor={handleSelectColorFromHero}
          />
          <ProductScrollSection />

          <ColorRangeSection />
          <CraftSection />
          <EcosystemSection />
          <SustainabilitySection />

          <PresetsSection
            activeHex={activeColor}
            onPresetChange={(hex) => {
              userPickedRef.current = true;
              setActiveColor(hex);
            }}
          />
          <CTASection />
        </div>
      </div>
    </>
  );
}
