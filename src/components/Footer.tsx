import { Link } from 'react-router-dom';
import { BrandMark } from './BrandMark';
import './Footer.css';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <span className="brand">
              <BrandMark />
              UonoVoucher
            </span>
            <p>
              UonoVoucher is an independent information website covering Uono games, promo codes,
              vouchers, updates, and practical guides.
            </p>
          </div>

          <div className="footer-col">
            <h4>Explore</h4>
            <ul>
              <li>
                <Link to="/uono-games/">All Uono Games</Link>
              </li>
              <li>
                <Link to="/promo-codes/">Promo Codes</Link>
              </li>
              <li>
                <Link to="/vouchers/">Special Vouchers</Link>
              </li>
              <li>
                <Link to="/guides/">Guides</Link>
              </li>
              <li>
                <Link to="/blog/">Blog</Link>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Information</h4>
            <ul>
              <li>
                <Link to="/about/">About Us</Link>
              </li>
              <li>
                <Link to="/editorial-policy/">Editorial Policy</Link>
              </li>
              <li>
                <Link to="/code-review-policy/">Code Review Policy</Link>
              </li>
              <li>
                <Link to="/corrections-policy/">Corrections Policy</Link>
              </li>
              <li>
                <Link to="/contact/">Contact Us</Link>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Legal</h4>
            <ul>
              <li>
                <Link to="/disclaimer/">Disclaimer</Link>
              </li>
              <li>
                <Link to="/privacy-policy/">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms/">Terms</Link>
              </li>
              <li>
                <Link to="/sitemap/">Sitemap</Link>
              </li>
            </ul>
          </div>
        </div>

        <p className="footer-disclaimer">
          UonoVoucher is an independent informational website and is not affiliated with or
          endorsed by UonoPlay. Game names and trademarks belong to their respective owners.
          Codes and vouchers may change or expire without notice.
        </p>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} UonoVoucher. Independent information portal.</span>
          <span>Not an official UonoPlay property.</span>
        </div>
      </div>
    </footer>
  );
}
