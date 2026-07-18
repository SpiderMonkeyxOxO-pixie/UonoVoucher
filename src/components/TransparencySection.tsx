import { Link } from 'react-router-dom';
import './TransparencySection.css';

export function TransparencySection() {
  return (
    <section className="section">
      <div className="container">
        <div className="transparency-panel">
          <div>
            <span className="eyebrow" style={{ color: 'var(--lime)' }}>
              Trust &amp; transparency
            </span>
            <h2>Independent information, clearly labelled</h2>
            <p>
              UonoVoucher does not operate the games listed or issue their vouchers. Review dates
              and expired records remain visible for transparency.
            </p>
          </div>
          <div className="transparency-links">
            <Link to="/editorial-policy/">Editorial Policy</Link>
            <Link to="/code-review-policy/">Code Review Policy</Link>
            <Link to="/corrections-policy/">Corrections Policy</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
