import { Link } from 'react-router-dom';
import { StaticPage } from '../components/StaticPage';

export function CorrectionsPolicy() {
  return (
    <StaticPage
      title="Corrections Policy"
      description="How UonoVoucher handles corrections to games, promo-code and voucher records."
      path="/corrections-policy/"
      crumbLabel="Corrections Policy"
    >
      <p>
        We aim to keep every record on UonoVoucher accurate and current, but mistakes and
        out-of-date information can happen. This policy explains how we handle corrections.
      </p>
      <h2>How to report an issue</h2>
      <p>
        If you notice an inaccurate name, date, status, or code, please let us know via our{' '}
        <Link to="/contact/">Contact page</Link>. Include a link to the specific record where
        possible.
      </p>
      <h2>What happens next</h2>
      <p>
        We re-check the record against available sources. If a correction is confirmed, we update
        the record and its "last reviewed" date. We do not silently delete records — corrected
        history is reflected transparently, including on our <Link to="/blog/">blog</Link> for
        notable corrections.
      </p>
      <h2>No guarantee of instant updates</h2>
      <p>
        Corrections are processed manually and may take time to reflect on the site, particularly
        for records requiring cross-checking against multiple reports.
      </p>
    </StaticPage>
  );
}
