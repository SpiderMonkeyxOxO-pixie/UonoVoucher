import { useState, type CSSProperties, type FormEvent } from 'react';
import { Seo } from '../components/Seo';
import { Breadcrumbs } from '../components/Breadcrumbs';

const TELEGRAM_CHANNEL_URL = 'https://t.me/OfficialUonovoucher';
const FORM_ENDPOINT = 'https://formsubmit.co/ajax/requestuonovoucher@gmail.com';

const fieldStyle: CSSProperties = {
  height: 44,
  borderRadius: 12,
  border: '1px solid var(--line)',
  padding: '0 14px',
};

export function VouchersList() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(false);

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: data,
      });
      if (!res.ok) throw new Error('Request failed');
      setSubmitted(true);
    } catch {
      setError(true);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Seo
        title="Uono Vouchers — Join Telegram & Request a Voucher"
        description="Join the UonoVoucher Telegram channel for the latest Uono and Uono Play voucher drops, or submit an agent request for voucher codes for your members."
        path="/vouchers/"
      />
      <div className="page-hero">
        <div className="container">
          <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Vouchers' }]} />
          <h1>Get the latest vouchers on Telegram</h1>
          <p>
            Join our Telegram channel for the newest voucher drops as soon as they're posted, or
            submit an agent request below if you manage a group and need voucher codes for your
            members.
          </p>
        </div>
      </div>

      <section className="section">
        <div className="container" style={{ display: 'grid', gap: 32, maxWidth: 640 }}>
          <div className="card" style={{ padding: 32, textAlign: 'center', display: 'grid', gap: 16, justifyItems: 'center' }}>
            <span className="eyebrow">Stay updated</span>
            <h2 style={{ fontSize: '1.4rem', margin: 0 }}>Join the UonoVoucher Telegram channel</h2>
            <p style={{ color: 'var(--muted)', maxWidth: 440 }}>
              New vouchers, promo drops and status updates are posted there first.
            </p>
            <a href={TELEGRAM_CHANNEL_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              Join Telegram Channel
            </a>
          </div>

          <div className="card" style={{ padding: 32 }}>
            <span className="eyebrow">For agents</span>
            <h2 style={{ fontSize: '1.4rem', margin: '0 0 8px' }}>Request a voucher for your members</h2>
            <p style={{ color: 'var(--muted)', marginBottom: 24 }}>
              If you run a group or channel, submit your details below. An agent can request a
              voucher code for its members after validation.
            </p>

            {submitted ? (
              <div className="empty-state" role="status">
                <p>Thanks — your request has been sent. The UonoVoucher team will review it and get back to you.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16 }} noValidate>
                <input type="hidden" name="_subject" value="New voucher request — UonoVoucher" />
                <input type="hidden" name="_template" value="table" />
                <input type="hidden" name="_captcha" value="false" />
                <label style={{ display: 'grid', gap: 6, fontSize: '0.88rem', fontWeight: 600 }}>
                  Username
                  <input type="text" name="username" required style={fieldStyle} />
                </label>
                <label style={{ display: 'grid', gap: 6, fontSize: '0.88rem', fontWeight: 600 }}>
                  Channel link
                  <input type="url" name="channelLink" required placeholder="https://t.me/yourchannel" style={fieldStyle} />
                </label>
                <label style={{ display: 'grid', gap: 6, fontSize: '0.88rem', fontWeight: 600 }}>
                  How many members
                  <input type="number" name="memberCount" min={1} required style={fieldStyle} />
                </label>
                <label style={{ display: 'grid', gap: 6, fontSize: '0.88rem', fontWeight: 600 }}>
                  Which social media platform
                  <input type="text" name="platform" required placeholder="e.g. Telegram, WhatsApp, Facebook" style={fieldStyle} />
                </label>
                {error && (
                  <p style={{ color: 'var(--negative-fg)', fontSize: '0.88rem', margin: 0 }}>
                    Something went wrong sending your request. Please try again.
                  </p>
                )}
                <button type="submit" className="btn btn-primary" style={{ justifySelf: 'start' }} disabled={submitting}>
                  {submitting ? 'Sending…' : 'Send'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
