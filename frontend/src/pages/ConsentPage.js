import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import API from '../utils/api';
import toast from 'react-hot-toast';

const CONSENT_ITEMS = [
  { key: 'financialData', label: 'Financial Transaction Data', desc: 'Bank statements, transaction history, and account balances used to evaluate your spending patterns and financial stability.', icon: '💳', risk: 'Required for core processing' },
  { key: 'creditHistory', label: 'Credit History', desc: 'Past loan repayments, credit card usage, and credit bureau records used to assess your repayment reliability.', icon: '📊', risk: 'Strongly recommended' },
  { key: 'employmentData', label: 'Employment Information', desc: 'Your employer details, job title, years employed, and salary information used to verify income stability.', icon: '💼', risk: 'Recommended' },
  { key: 'personalData', label: 'Personal Demographics', desc: 'Age, address, and identification information required by regulatory compliance and identity verification.', icon: '👤', risk: 'Required by law' },
  { key: 'locationData', label: 'Location Data', desc: 'Geographic information used to tailor loan products to your region. Optional and not used in core scoring.', icon: '📍', risk: 'Optional' },
  { key: 'behavioralData', label: 'Behavioral Analytics', desc: 'App usage patterns and navigation behavior used for fraud detection. Stored separately and anonymized.', icon: '📈', risk: 'Optional - privacy sensitive' },
];

export default function ConsentPage() {
  const [prefs, setPrefs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    API.get('/consent')
      .then(res => setPrefs(res.data.data))
      .catch(() => toast.error('Failed to load consent preferences'))
      .finally(() => setLoading(false));
  }, []);

  const toggle = (key) => setPrefs(p => ({ ...p, [key]: !p[key] }));

  const save = async () => {
    setSaving(true);
    try {
      await API.put('/consent', prefs);
      toast.success('Consent preferences saved!');
    } catch { toast.error('Failed to save preferences'); }
    finally { setSaving(false); }
  };

  if (loading) return <DashboardLayout title="Consent Studio"><div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>{[1,2,3,4,5,6].map(i => <div key={i} className="skeleton" style={{ height: 100, borderRadius: 'var(--radius-lg)' }} />)}</div></DashboardLayout>;

  return (
    <DashboardLayout
      title="Consent Studio"
      subtitle="Control exactly which data categories power your AI decisions"
      actions={
        <button className="btn btn-primary" onClick={save} disabled={saving}>
          {saving ? <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} /> : '💾'} Save Preferences
        </button>
      }
    >
      <div className="alert alert-info" style={{ marginBottom: 28 }}>
        <strong>🔒 Your Data, Your Control</strong> — ETHOS validates consent before every AI decision. Disabling a data category will prevent it from being used in future decisions, though some categories may affect the quality of your application assessment.
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {CONSENT_ITEMS.map(item => (
          <div key={item.key} style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: `2px solid ${prefs?.[item.key] ? 'var(--mint)' : 'var(--gray-100)'}`, padding: '20px 24px', transition: 'var(--transition)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1 }}>
                <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: prefs?.[item.key] ? 'var(--mint-light)' : 'var(--gray-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0, transition: 'var(--transition)' }}>
                  {item.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--navy)', fontSize: '0.95rem' }}>{item.label}</span>
                    <span style={{ background: 'var(--gray-50)', color: 'var(--gray-400)', fontSize: '0.7rem', padding: '2px 8px', borderRadius: 99, fontWeight: 600 }}>{item.risk}</span>
                  </div>
                  <p style={{ fontSize: '0.83rem', color: 'var(--gray-400)', lineHeight: 1.5 }}>{item.desc}</p>
                </div>
              </div>

              {/* Toggle switch */}
              <div onClick={() => toggle(item.key)} style={{ width: 52, height: 28, borderRadius: 14, background: prefs?.[item.key] ? 'var(--mint)' : 'var(--gray-200)', position: 'relative', cursor: 'pointer', transition: 'background 0.3s ease', flexShrink: 0, marginLeft: 20 }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'white', position: 'absolute', top: 3, left: prefs?.[item.key] ? 27 : 3, transition: 'left 0.3s ease', boxShadow: '0 2px 6px rgba(0,0,0,0.15)' }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div style={{ marginTop: 28, background: 'var(--gray-50)', borderRadius: 'var(--radius-lg)', padding: '20px 24px', border: '1px solid var(--gray-100)' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--navy)', marginBottom: 12 }}>Consent Summary</div>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.6rem', color: 'var(--mint)' }}>
              {Object.values(prefs || {}).filter(Boolean).length}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', fontWeight: 600 }}>Categories Enabled</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.6rem', color: 'var(--coral)' }}>
              {Object.values(prefs || {}).filter(v => !v).length}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', fontWeight: 600 }}>Categories Disabled</div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
