import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const EthosLogo = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
    <rect width="36" height="36" rx="10" fill="var(--navy)" />
    <path d="M10 18 L18 10 L26 18 L18 26 Z" fill="none" stroke="var(--mint)" strokeWidth="2.5" strokeLinejoin="round"/>
    <circle cx="18" cy="18" r="3" fill="var(--sky-light)" />
    <path d="M18 10 L18 6M18 26 L18 30M10 18 L6 18M26 18 L30 18" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); setProfileOpen(false); }, [location]);

  const handleLogout = () => { logout(); navigate('/'); };

  const customerLinks = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/apply', label: 'Apply' },
    { to: '/decisions', label: 'My Decisions' },
    { to: '/consent', label: 'Consent Studio' },
  ];

  const adminLinks = [
    { to: '/admin', label: 'Dashboard' },
    { to: '/admin/decisions', label: 'Decisions' },
    { to: '/admin/audit', label: 'Audit Logs' },
  ];

  const links = user?.role === 'admin' ? adminLinks : customerLinks;
  const isLanding = location.pathname === '/';

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      background: scrolled || !isLanding ? 'rgba(255,255,255,0.95)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid var(--gray-100)' : '1px solid transparent',
      transition: 'all 0.3s ease',
      boxShadow: scrolled ? 'var(--shadow-sm)' : 'none'
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68 }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <EthosLogo />
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.2rem', color: 'var(--navy)', letterSpacing: '-0.02em' }}>
            ETHOS
            <span style={{ color: 'var(--mint)', fontWeight: 400 }}>.</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {links.map(link => (
              <Link key={link.to} to={link.to} style={{
                padding: '7px 16px', borderRadius: 'var(--radius-md)',
                fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.88rem',
                color: location.pathname === link.to ? 'var(--navy)' : 'var(--gray-400)',
                background: location.pathname === link.to ? 'var(--gray-50)' : 'transparent',
                textDecoration: 'none', transition: 'var(--transition)'
              }}>
                {link.label}
              </Link>
            ))}
          </div>
        )}

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {!user ? (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">Sign In</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
            </>
          ) : (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 14px', borderRadius: 'var(--radius-md)', background: 'var(--gray-50)', border: '1px solid var(--gray-100)', cursor: 'pointer', transition: 'var(--transition)' }}
              >
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.8rem' }}>
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.88rem', color: 'var(--navy)', maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name?.split(' ')[0]}</span>
                {user.role === 'admin' && <span className="badge badge-navy" style={{ padding: '2px 8px', fontSize: '0.65rem' }}>Admin</span>}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--gray-400)" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
              </button>

              {profileOpen && (
                <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, background: 'white', border: '1px solid var(--gray-100)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)', minWidth: 200, overflow: 'hidden', animation: 'slideUp 0.2s ease' }}>
                  <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--gray-100)' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem', color: 'var(--navy)' }}>{user.name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--gray-400)', marginTop: 2 }}>{user.email}</div>
                  </div>
                  <Link to="/profile" style={{ display: 'block', padding: '10px 16px', textDecoration: 'none', color: 'var(--gray-500)', fontSize: '0.88rem', fontWeight: 500, transition: 'var(--transition)' }} onMouseOver={e => e.target.style.background='var(--gray-50)'} onMouseOut={e => e.target.style.background='transparent'}>
                    Profile Settings
                  </Link>
                  {user.role !== 'admin' && (
                    <Link to="/consent" style={{ display: 'block', padding: '10px 16px', textDecoration: 'none', color: 'var(--gray-500)', fontSize: '0.88rem', fontWeight: 500, transition: 'var(--transition)' }} onMouseOver={e => e.target.style.background='var(--gray-50)'} onMouseOut={e => e.target.style.background='transparent'}>
                      Consent Preferences
                    </Link>
                  )}
                  <div style={{ borderTop: '1px solid var(--gray-100)', padding: '8px' }}>
                    <button onClick={handleLogout} style={{ width: '100%', padding: '9px 16px', borderRadius: 'var(--radius-sm)', background: 'transparent', border: 'none', color: 'var(--coral)', fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer', textAlign: 'left', fontFamily: 'var(--font-body)', transition: 'var(--transition)' }} onMouseOver={e => e.target.style.background='var(--coral-light)'} onMouseOut={e => e.target.style.background='transparent'}>
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
