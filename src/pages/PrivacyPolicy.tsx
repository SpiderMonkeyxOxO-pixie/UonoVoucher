import { StaticPage } from '../components/StaticPage';

export function PrivacyPolicy() {
  return (
    <StaticPage
      title="Privacy Policy"
      description="How UonoVoucher handles information submitted through this site."
      path="/privacy-policy/"
      crumbLabel="Privacy Policy"
    >
      <p>
        This Privacy Policy explains what information UonoVoucher collects and how it is used.
        This is a local preview build and the contact form does not currently transmit data
        anywhere.
      </p>
      <h2>Information you provide</h2>
      <p>
        If you contact us through the site, we may receive the name, email address, and message
        content you choose to submit. This information is used only to respond to your enquiry or
        correction report.
      </p>
      <h2>Automatically collected information</h2>
      <p>
        Standard technical information such as browser type and page views may be collected for
        site reliability and analytics purposes, without identifying you personally.
      </p>
      <h2>Third parties</h2>
      <p>
        We do not sell personal information. We do not operate the games referenced on this site
        and are not responsible for their own data practices — review each app&apos;s own privacy
        policy before installing it.
      </p>
      <h2>Contact</h2>
      <p>Questions about this policy can be sent through our Contact page.</p>
    </StaticPage>
  );
}
