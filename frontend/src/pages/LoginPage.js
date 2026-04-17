import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

const AuthLayout = ({ children, title, subtitle }) => (
  <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr', background: 'var(--off-white)' }}>
    <div style={{ background: 'linear-gradient(135deg, var(--navy) 0%, var(--navy-light) 50%, var(--royal) 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 64, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 30% 70%, rgba(0,194,168,0.15) 0%, transparent 50%), radial-gradient(circle at 70% 30%, rgba(62,146,204,0.1) 0%, transparent 50%)' }} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 48 }}>
          <svg width="40" height="40" viewBox="0 0 36 36" fill="none"><rect width="36" height="36" rx="10" fill="rgba(255,255,255,0.15)" /><path d="M10 18 L18 10 L26 18 L18 26 Z" fill="none" stroke="var(--mint)" strokeWidth="2.5" strokeLinejoin="round"/><circle cx="18" cy="18" r="3" fill="white" /></svg>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.4rem', color: 'white' }}>ETHOS</span>
        </Link>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: 'white', lineHeight: 1.2, marginBottom: 16 }}>{title}</h1>
        <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '1rem', lineHeight: 1.7, marginBottom: 40 }}>{subtitle}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {['Explainable AI Decisions', 'Bias & Fairness Monitoring', 'Consent-Driven Data Control', 'Full Audit Trail'].map(feat => (
            <div key={feat} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--mint)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
              </div>
              <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem', fontWeight: 500 }}>{feat}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ position: 'absolute', bottom: 24, left: 64, fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)' }}>
        © 2026 ETHOS Platform
      </div>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 48 }}>
      <div style={{ width: '100%', maxWidth: 440 }}>{children}</div>
    </div>
  </div>
);

export function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name.split(' ')[0]}!`);
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Invalid email or password');
    } finally { setLoading(false); }
  };

  const fillDemo = (type) => {
    if (type === 'customer') setForm({ email: 'demo@ethos.com', password: 'demo123' });
    else setForm({ email: 'admin@ethos.com', password: 'admin123' });
  };

  return (
    <AuthLayout title="Welcome Back" subtitle="Sign in to your ETHOS account to manage AI decisions, review TrustCards, and control your data consent.">
      <div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, color: 'var(--navy)', marginBottom: 8 }}>Sign In</h2>
        <p style={{ color: 'var(--gray-400)', fontSize: '0.9rem', marginBottom: 28 }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--royal)', fontWeight: 600 }}>Create one free</Link>
        </p>

        {/* Demo buttons */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Quick Demo Access</div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="button" onClick={() => fillDemo('customer')}
              style={{ flex: 1, padding: '10px 14px', border: '2px solid var(--gray-100)', borderRadius: 'var(--radius-md)', background: 'var(--gray-50)', cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.82rem', color: 'var(--navy)', transition: 'var(--transition)' }}
              onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--royal)'; e.currentTarget.style.background = '#EEF4FF'; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--gray-100)'; e.currentTarget.style.background = 'var(--gray-50)'; }}>
              👤 Customer Demo
            </button>
            <button type="button" onClick={() => fillDemo('admin')}
              style={{ flex: 1, padding: '10px 14px', border: '2px solid var(--gray-100)', borderRadius: 'var(--radius-md)', background: 'var(--gray-50)', cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.82rem', color: 'var(--navy)', transition: 'var(--transition)' }}
              onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--mint)'; e.currentTarget.style.background = 'var(--mint-light)'; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--gray-100)'; e.currentTarget.style.background = 'var(--gray-50)'; }}>
              ⚙️ Admin Demo
            </button>
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--gray-300)', marginTop: 6, textAlign: 'center' }}>
            Click a button to auto-fill, then press Sign In
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <div style={{ flex: 1, height: 1, background: 'var(--gray-100)' }} />
          <span style={{ fontSize: '0.72rem', color: 'var(--gray-300)', fontWeight: 600, whiteSpace: 'nowrap' }}>OR ENTER MANUALLY</span>
          <div style={{ flex: 1, height: 1, background: 'var(--gray-100)' }} />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" className="form-input" placeholder="you@example.com" value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" className="form-input" placeholder="••••••••" value={form.password}
              onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required />
          </div>
          <button type="submit" className="btn btn-primary w-full" style={{ marginTop: 8, justifyContent: 'center' }} disabled={loading}>
            {loading
              ? <span style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
              : 'Sign In →'}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
}

export function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'customer', annualIncome: '', creditScore: 650, employmentStatus: 'employed' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await register(form);
      toast.success('Account created successfully!');
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <AuthLayout title="Join ETHOS" subtitle="Create your account to start experiencing transparent, explainable AI decisions in banking.">
      <div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, color: 'var(--navy)', marginBottom: 8 }}>Create Account</h2>
        <p style={{ color: 'var(--gray-400)', fontSize: '0.9rem', marginBottom: 28 }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--royal)', fontWeight: 600 }}>Sign in</Link>
        </p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="form-input" placeholder="John Doe" value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" className="form-input" placeholder="you@example.com" value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" className="form-input" placeholder="Min 6 characters" value={form.password}
              onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required minLength={6} />
          </div>

          {/* Account type shown before conditional fields */}
          <div className="form-group">
            <label className="form-label">Account Type</label>
            <select className="form-select" value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))}>
              <option value="customer">Customer</option>
              <option value="admin">Admin / Governance Officer</option>
            </select>
          </div>

          {/* Financial fields only for customers */}
          {form.role === 'customer' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Annual Income (₹)</label>
                <input type="number" className="form-input" placeholder="600000" value={form.annualIncome}
                  onChange={e => setForm(p => ({ ...p, annualIncome: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Employment</label>
                <select className="form-select" value={form.employmentStatus}
                  onChange={e => setForm(p => ({ ...p, employmentStatus: e.target.value }))}>
                  <option value="employed">Employed</option>
                  <option value="self-employed">Self-Employed</option>
                  <option value="unemployed">Unemployed</option>
                  <option value="retired">Retired</option>
                </select>
              </div>
            </div>
          )}

          <button type="submit" className="btn btn-primary w-full"
            style={{ marginTop: 8, justifyContent: 'center' }} disabled={loading}>
            {loading
              ? <span style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
              : 'Create Account →'}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
}

export default LoginPage;
