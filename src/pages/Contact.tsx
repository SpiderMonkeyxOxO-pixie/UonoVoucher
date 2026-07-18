import { useState, type FormEvent } from 'react';
import { StaticPage } from '../components/StaticPage';

export function Contact() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <StaticPage
      title="Contact Us"
      description="Get in touch with the UonoVoucher team to report a correction, ask a question, or flag an issue."
      path="/contact/"
      crumbLabel="Contact"
      intro="Use this form to report a correction, ask a question, or flag an issue with a record."
    >
      {submitted ? (
        <div className="empty-state" role="status">
          <p>Thanks — this is a local demo form, so nothing was sent, but in production your message would reach the UonoVoucher team here.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16, maxWidth: 480 }} noValidate>
          <label style={{ display: 'grid', gap: 6, fontSize: '0.88rem', fontWeight: 600 }}>
            Name
            <input
              type="text"
              name="name"
              required
              style={{ height: 44, borderRadius: 12, border: '1px solid var(--line)', padding: '0 14px' }}
            />
          </label>
          <label style={{ display: 'grid', gap: 6, fontSize: '0.88rem', fontWeight: 600 }}>
            Email
            <input
              type="email"
              name="email"
              required
              style={{ height: 44, borderRadius: 12, border: '1px solid var(--line)', padding: '0 14px' }}
            />
          </label>
          <label style={{ display: 'grid', gap: 6, fontSize: '0.88rem', fontWeight: 600 }}>
            Message
            <textarea
              name="message"
              required
              rows={5}
              style={{ borderRadius: 12, border: '1px solid var(--line)', padding: '12px 14px', resize: 'vertical' }}
            />
          </label>
          <button type="submit" className="btn btn-primary" style={{ justifySelf: 'start' }}>
            Send message
          </button>
        </form>
      )}
    </StaticPage>
  );
}
