import { useEffect, useState } from 'react';

export default function SiteHeader() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const onReady = () => setReady(true);
    window.addEventListener('solary:ready', onReady);
    return () => window.removeEventListener('solary:ready', onReady);
  }, []);

  return (
    <header
      className="site-header"
      id="site-header"
      data-ready={ready ? 'true' : 'false'}
    >
      <div className="container flex w-full items-center justify-between">
        <span className="site-header-brand" aria-label="Philips">
          PHILIPS
        </span>
        <a
          href="#cta"
          className="site-header-cta"
          aria-label="Buy Solary now"
        >
          Buy Now
        </a>
      </div>
    </header>
  );
}
