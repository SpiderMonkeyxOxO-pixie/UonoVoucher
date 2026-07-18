import { StaticPage } from '../components/StaticPage';

export function Disclaimer() {
  return (
    <StaticPage
      title="Disclaimer"
      description="UonoVoucher is an independent informational website and is not affiliated with or endorsed by UonoPlay."
      path="/disclaimer/"
      crumbLabel="Disclaimer"
    >
      <p>
        UonoVoucher is an independent informational website and is not affiliated with or
        endorsed by UonoPlay. Game names and trademarks belong to their respective owners. Codes
        and vouchers may change or expire without notice.
      </p>
      <h2>No official affiliation</h2>
      <p>
        Nothing on this site should be interpreted as an official statement, guarantee, or
        endorsement from UonoPlay or any game developer named here. We do not operate the games
        listed, and we do not issue their promo codes or vouchers.
      </p>
      <h2>No guarantee of accuracy</h2>
      <p>
        Records are compiled from public information and community reports and are reviewed
        periodically, but availability, terms, and eligibility for any code or voucher rest
        entirely with the relevant game operator. Status labels reflect our best assessment at
        the time of review, not a guarantee of current validity.
      </p>
      <h2>Not financial or gambling advice</h2>
      <p>
        Content on this site is provided for informational purposes only and does not constitute
        advice to install, use, or spend money within any application. Review app permissions and
        your local regulations before installing any game referenced here.
      </p>
    </StaticPage>
  );
}
