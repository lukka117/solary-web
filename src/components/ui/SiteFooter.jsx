export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer-row">
          <div className="max-w-sm">
            <span className="site-footer-brand">
              PHILIPS
            </span>
            <p className="site-footer-lede">
              Innovation and you. Solary is a conceptual project exploring the boundaries of premium smart lighting and immersive web design.
            </p>
          </div>

          <div className="site-footer-columns">
            <div className="site-footer-column">
              <span className="site-footer-column-title">
                Product
              </span>
              <a href="#color-range" className="site-footer-link">
                Features
              </a>
              <a href="#craft" className="site-footer-link">
                Craftsmanship
              </a>
              <a href="#ecosystem" className="site-footer-link">
                Smart Ecosystem
              </a>
              <a href="#sustainability" className="site-footer-link">
                Sustainability
              </a>
            </div>
            <div className="site-footer-column">
              <span className="site-footer-column-title">
                Support
              </span>
              <a href="#" className="site-footer-link">
                Help Center
              </a>
              <a href="#" className="site-footer-link">
                Warranty
              </a>
              <a href="#" className="site-footer-link">
                Returns
              </a>
              <a href="#" className="site-footer-link">
                Contact
              </a>
            </div>
          </div>
        </div>

        <div className="site-footer-bar">
          <p>© {new Date().getFullYear()} Koninklijke Philips N.V. All rights reserved.</p>
          <div className="site-footer-legal-links">
            <a href="#" className="site-footer-legal-link">
              Privacy
            </a>
            <a href="#" className="site-footer-legal-link">
              Terms
            </a>
            <a href="#" className="site-footer-legal-link">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
