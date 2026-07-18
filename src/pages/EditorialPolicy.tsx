import { Link } from 'react-router-dom';
import { StaticPage } from '../components/StaticPage';

export function EditorialPolicy() {
  return (
    <StaticPage
      title="Editorial Policy"
      description="How UonoVoucher sources, writes and labels information about Uono games, promo codes and vouchers."
      path="/editorial-policy/"
      crumbLabel="Editorial Policy"
    >
      <p>
        UonoVoucher publishes independent, informational content about Uono games, promo codes,
        and vouchers. This policy explains how that content is produced.
      </p>
      <h2>Independence</h2>
      <p>
        We are not affiliated with, sponsored by, or endorsed by UonoPlay or any game developer
        named on this site. Our coverage is not paid for or directed by any game operator.
      </p>
      <h2>Sourcing</h2>
      <p>
        Game entries, promo codes and vouchers are compiled from public information, in-app
        observations, and reader-submitted reports. Where a record has not been independently
        verified, it is labelled "Reported" or "Unconfirmed" rather than presented as confirmed
        fact.
      </p>
      <h2>Neutral language</h2>
      <p>
        We avoid promotional or exaggerated claims such as guaranteed winnings or instant
        earnings. Descriptions aim to be factual and neutral, and sample or seed content is
        labelled as such where relevant.
      </p>
      <h2>Updates</h2>
      <p>
        This policy may be updated as our review process evolves. Material changes will be
        reflected in our <Link to="/blog/">blog</Link>.
      </p>
    </StaticPage>
  );
}
