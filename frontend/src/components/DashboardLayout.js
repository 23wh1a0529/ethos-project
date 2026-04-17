import React from 'react';
import Navbar from './Navbar';

export default function DashboardLayout({ children, title, subtitle, actions }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--off-white)' }}>
      <Navbar />
      <div style={{ paddingTop: 68 }}>
        <div className="container" style={{ paddingTop: 36, paddingBottom: 60 }}>
          {(title || actions) && (
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32 }}>
              <div>
                {title && <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.9rem', fontWeight: 800, color: 'var(--navy)', letterSpacing: '-0.02em' }}>{title}</h1>}
                {subtitle && <p style={{ color: 'var(--gray-400)', marginTop: 4, fontSize: '0.92rem' }}>{subtitle}</p>}
              </div>
              {actions && <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>{actions}</div>}
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
