import { Link } from 'react-router-dom';
import { StaticPage } from '../components/StaticPage';
import { games } from '../data/games';

export function About() {
  return (
    <StaticPage
      title="About UonoVoucher"
      description="UonoVoucher is an independent Uono and Uono Play information website covering promo codes, vouchers, updates, and practical guides."
      path="/about/"
      crumbLabel="About"
      intro="An independent Uono and Uono Play information portal, built to keep one clearly labelled record of Uono-related codes and vouchers."
    >
      <p>
        UonoVoucher is an independent information website covering Uono, Uono Play and its games,
        promo codes, vouchers, updates, and practical guides. We are not affiliated with,
        endorsed by, or responsible for issuing codes on behalf of UonoPlay or any game developer
        named on this site.
      </p>
      <h2>What we do</h2>
      <p>
        We track a structured catalogue of {games.length} documented Uono games, compile promo-code and
        voucher records reported by our community, and manually review those records on a
        recurring basis. Every record carries a status label and a review date so readers can
        judge how current it is.
      </p>
      <h2>What we don&apos;t do</h2>
      <ul>
        <li>We do not operate, publish, or distribute any of the games listed.</li>
        <li>We do not issue, generate, or guarantee any promo code or voucher.</li>
        <li>We do not claim official affiliation with UonoPlay or any game brand.</li>
      </ul>
      <h2>How records are maintained</h2>
      <p>
        Details on how we source, check and correct records are covered in our{' '}
        <Link to="/editorial-policy/">Editorial Policy</Link>,{' '}
        <Link to="/code-review-policy/">Code Review Policy</Link>, and{' '}
        <Link to="/corrections-policy/">Corrections Policy</Link>.
      </p>
    </StaticPage>
  );
}
