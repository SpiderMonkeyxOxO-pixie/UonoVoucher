import { Fragment, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { BrandMark } from './BrandMark';
import './Header.css';

const NAV_LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/promo-codes/', label: 'Promo Codes' },
  { to: '/vouchers/', label: 'Vouchers' },
  { to: '/uono-games/', label: 'Uono Games' },
  { to: '/guides/', label: 'Guides' },
  { to: '/blog/', label: 'Blog' },
];

export function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawerOpen]);

  return (
    <Fragment>
      <header className="site-header">
        <div className="container">
          <NavLink to="/" className="brand" aria-label="UonoVoucher home">
            <BrandMark />
            <span>UonoVoucher</span>
          </NavLink>

          <nav className="main-nav" aria-label="Primary">
            {NAV_LINKS.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.end}>
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="header-actions">
            <NavLink to="/blog/" className="btn btn-primary btn-sm">
              Latest Updates
            </NavLink>
            <button
              type="button"
              className="menu-toggle"
              aria-label="Open menu"
              aria-expanded={drawerOpen}
              aria-controls="mobile-nav-drawer"
              onClick={() => setDrawerOpen(true)}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <div id="mobile-nav-drawer" className={`nav-drawer ${drawerOpen ? 'open' : ''}`}>
        <div className="nav-drawer-backdrop" onClick={() => setDrawerOpen(false)} />
        <div className="nav-drawer-panel" role="dialog" aria-modal="true" aria-label="Mobile navigation">
          <div className="nav-drawer-header">
            <span className="brand">
              <BrandMark size={32} />
              UonoVoucher
            </span>
            <button type="button" className="close-drawer" aria-label="Close menu" onClick={() => setDrawerOpen(false)}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          {NAV_LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} onClick={() => setDrawerOpen(false)}>
              {link.label}
            </NavLink>
          ))}
          <NavLink to="/blog/" onClick={() => setDrawerOpen(false)} style={{ color: 'var(--violet)' }}>
            Latest Updates
          </NavLink>
        </div>
      </div>
    </Fragment>
  );
}
