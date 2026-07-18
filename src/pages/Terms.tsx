import { StaticPage } from '../components/StaticPage';

export function Terms() {
  return (
    <StaticPage
      title="Terms"
      description="Terms of use for browsing and using the UonoVoucher website."
      path="/terms/"
      crumbLabel="Terms"
    >
      <p>By using UonoVoucher, you agree to the following terms.</p>
      <h2>Informational use only</h2>
      <p>
        Content on this site — including game entries, promo codes, and voucher records — is
        provided for general informational purposes only, without warranty of accuracy,
        completeness, or current validity.
      </p>
      <h2>No affiliation</h2>
      <p>
        UonoVoucher is independently operated and is not affiliated with, endorsed by, or
        responsible for any game, developer, or brand referenced on this site.
      </p>
      <h2>Your responsibility</h2>
      <p>
        You are responsible for reviewing any application&apos;s own terms, permissions, and
        regional availability before installing or using it. UonoVoucher is not responsible for
        outcomes resulting from your use of third-party applications.
      </p>
      <h2>Changes</h2>
      <p>We may update these terms from time to time; continued use of the site constitutes acceptance of the current version.</p>
    </StaticPage>
  );
}
