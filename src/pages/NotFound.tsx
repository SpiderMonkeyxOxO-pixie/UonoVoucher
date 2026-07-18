import { Link } from 'react-router-dom';
import { Seo } from '../components/Seo';

export function NotFound() {
  return (
    <>
      <Seo title="Page not found" description="This page could not be found on UonoVoucher." path="/404/" />
      <section className="section">
        <div className="container">
          <div className="empty-state">
            <h1 style={{ fontSize: '1.6rem', marginBottom: 10 }}>Page not found</h1>
            <p>The page you were looking for doesn&apos;t exist or may have moved.</p>
            <div style={{ marginTop: 20 }}>
              <Link to="/" className="btn btn-primary">
                Back to homepage
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
