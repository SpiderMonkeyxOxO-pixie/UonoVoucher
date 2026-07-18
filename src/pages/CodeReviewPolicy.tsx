import { StaticPage } from '../components/StaticPage';

export function CodeReviewPolicy() {
  return (
    <StaticPage
      title="Code Review Policy"
      description="How promo codes and vouchers are checked, labelled and retired on UonoVoucher."
      path="/code-review-policy/"
      crumbLabel="Code Review Policy"
    >
      <p>
        This policy explains how promo codes and voucher records move through our review process
        and how their status labels are assigned.
      </p>
      <h2>Status labels</h2>
      <ul>
        <li><strong>Checked / Active</strong> — confirmed directly by our team at the listed review date.</li>
        <li><strong>Reported</strong> — submitted by one or more readers, not yet independently confirmed.</li>
        <li><strong>Limited / Scheduled</strong> — time-bound records, either currently running within a limited window or expected to begin soon.</li>
        <li><strong>Unconfirmed</strong> — could not be verified either way at the time of review.</li>
        <li><strong>Expired / Withdrawn</strong> — no longer redeemable; kept visible for transparency, copy action disabled.</li>
      </ul>
      <h2>Review cadence</h2>
      <p>
        Records are re-checked on a recurring basis, and the "last checked" or "last reviewed"
        date reflects when a record was most recently examined — not when it was first added.
      </p>
      <h2>Limitations</h2>
      <p>
        We rely on public information and reader reports, so redemption cannot be guaranteed for
        any code or voucher listed on this site. Always confirm details in the game&apos;s own
        official channels before relying on a listed record.
      </p>
    </StaticPage>
  );
}
