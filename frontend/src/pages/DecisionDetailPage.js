import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import DashboardLayout from '../components/DashboardLayout';
import API from '../utils/api';
import toast from 'react-hot-toast';

function TrustCardBadge({ decision }) {
  const cfg = {
    approved: { bg: '#E6FAF6', color: '#00A882', icon: '✓', label: 'Approved' },
    rejected: { bg: '#FDECEA', color: '#E85D4A', icon: '✕', label: 'Rejected' },
    review: { bg: '#FBF0D0', color: '#B8860B', icon: '⟳', label: 'Under Review' },
  }[decision] || { bg: '#EEF4FF', color: 'var(--royal)', icon: '?', label: 'Unknown' };

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: cfg.bg, border: `1.5px solid ${cfg.color}30`, borderRadius: 'var(--radius-lg)', padding: '10px 20px' }}>
      <div style={{ width: 36, height: 36, borderRadius: '50%', background: cfg.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '1rem' }}>{cfg.icon}</div>
      <div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.1rem', color: cfg.color }}>{cfg.label}</div>
        <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>AI Decision Outcome</div>
      </div>
    </div>
  );
}

function ScoreRing({ value, label, color }) {
  const r = 40, c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <div style={{ textAlign: 'center' }}>
      <svg width="100" height="100" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke="var(--gray-100)" strokeWidth="8" />
        <circle cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="8" strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round" transform="rotate(-90 50 50)" style={{ transition: 'stroke-dashoffset 1s ease' }} />
        <text x="50" y="46" textAnchor="middle" fill="var(--navy)" fontSize="15" fontFamily="Syne" fontWeight="800">{value}%</text>
        <text x="50" y="60" textAnchor="middle" fill="var(--gray-400)" fontSize="8" fontFamily="DM Sans">{label}</text>
      </svg>
    </div>
  );
}

export default function DecisionDetailPage() {
  const { id } = useParams();
  const [decision, setDecision] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/decisions/${id}`)
      .then(res => setDecision(res.data.data))
      .catch(() => toast.error('Failed to load decision'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <DashboardLayout title="Loading..."><div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}><span style={{ width: 40, height: 40, border: '3px solid var(--gray-100)', borderTopColor: 'var(--royal)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} /></div></DashboardLayout>;
  if (!decision) return <DashboardLayout title="Not Found"><div className="alert alert-error">Decision not found.</div></DashboardLayout>;

  const tc = decision.trustCard || {};
  const featureData = (tc.keyFactors || []).map(f => ({ name: f.name, importance: parseFloat((Math.abs(f.importance) * 100).toFixed(1)), impact: f.impact }));

  return (
    <DashboardLayout
      title="TrustCard™ Report"
      subtitle={`Decision ID: ${decision.decisionId}`}
      actions={<Link to="/decisions" className="btn btn-secondary btn-sm">← All Decisions</Link>}
    >
      {/* Header banner */}
      <div style={{ background: 'linear-gradient(135deg, var(--navy) 0%, var(--navy-light) 100%)', borderRadius: 'var(--radius-xl)', padding: 32, marginBottom: 24, color: 'white', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -30, right: -30, width: 200, height: 200, borderRadius: '50%', background: 'rgba(0,194,168,0.08)' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
          <div>
            <TrustCardBadge decision={tc.decision} />
            <div style={{ marginTop: 16 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>{decision.decisionId}</div>
              <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', textTransform: 'capitalize' }}>
                {decision.applicationType?.replace('_', ' ')} — {decision.applicationData?.loanPurpose}
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>Loan Amount</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.6rem', color: 'white' }}>₹{(decision.applicationData?.loanAmount || 0).toLocaleString('en-IN')}</div>
            <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>Processing: {decision.processingTime}ms</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
        {/* Score rings */}
        <div className="card p-6">
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--navy)', marginBottom: 20 }}>Governance Scores</h3>
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <ScoreRing value={Math.round((tc.confidenceScore || 0) * 100)} label="Confidence" color="var(--royal)" />
            <ScoreRing value={Math.round((tc.fairnessScore || 0) * 100)} label="Fairness" color="var(--mint)" />
            <ScoreRing value={tc.consentValidated ? 100 : 40} label="Consent" color={tc.consentValidated ? 'var(--mint)' : 'var(--coral)'} />
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 16 }}>
            {(tc.riskFlags || []).length === 0 ? (
              <span style={{ background: 'var(--mint-light)', color: 'var(--mint)', fontSize: '0.75rem', fontWeight: 600, padding: '5px 12px', borderRadius: 99 }}>✓ No Risk Flags</span>
            ) : (tc.riskFlags || []).map(flag => (
              <span key={flag} style={{ background: 'var(--coral-light)', color: 'var(--coral)', fontSize: '0.75rem', fontWeight: 600, padding: '5px 12px', borderRadius: 99 }}>⚠ {flag}</span>
            ))}
          </div>
        </div>

        {/* Explanation */}
        <div className="card p-6">
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--navy)', marginBottom: 16 }}>Explanation</h3>
          <div style={{ background: 'var(--gray-50)', borderRadius: 'var(--radius-md)', padding: '16px', borderLeft: '3px solid var(--royal)', marginBottom: 16 }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--gray-500)', lineHeight: 1.7 }}>{tc.explanation}</p>
          </div>
          {(tc.suggestions || []).length > 0 && (
            <>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--navy)', fontSize: '0.88rem', marginBottom: 10 }}>💡 Suggestions</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {tc.suggestions.map((s, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--gold-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', color: 'var(--gold)', fontWeight: 800, flexShrink: 0, marginTop: 1 }}>{i+1}</div>
                    <span style={{ fontSize: '0.82rem', color: 'var(--gray-500)', lineHeight: 1.5 }}>{s}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Feature importance chart */}
      <div className="card p-6" style={{ marginBottom: 24 }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--navy)', marginBottom: 20 }}>Feature Importance (SHAP Analysis)</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={featureData} layout="vertical" margin={{ left: 130 }}>
            <XAxis type="number" tickFormatter={v => `${v}%`} tick={{ fontSize: 11, fill: 'var(--gray-400)' }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: 'var(--gray-500)', fontWeight: 500 }} axisLine={false} tickLine={false} width={130} />
            <Tooltip formatter={(v, n, props) => [`${v}%`, 'Importance']} contentStyle={{ fontFamily: 'var(--font-body)', fontSize: 12, borderRadius: 8, border: '1px solid var(--gray-100)' }} />
            <Bar dataKey="importance" radius={[0, 4, 4, 0]} maxBarSize={20}>
              {featureData.map((entry, i) => (
                <Cell key={i} fill={entry.impact === 'positive' ? 'var(--mint)' : entry.impact === 'negative' ? 'var(--coral)' : 'var(--sky)'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
          {[['Positive Impact', 'var(--mint)'], ['Negative Impact', 'var(--coral)'], ['Neutral', 'var(--sky)']].map(([l, c]) => (
            <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: 'var(--gray-400)' }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: c }} />
              {l}
            </div>
          ))}
        </div>
      </div>

      {/* Consent & Bias */}
      <div className="grid-2">
        <div className="card p-6">
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--navy)', marginBottom: 16 }}>Consent Validation</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: tc.consentValidated ? 'var(--mint-light)' : 'var(--coral-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {tc.consentValidated ? '✓' : '!'}
            </div>
            <div>
              <div style={{ fontWeight: 700, color: tc.consentValidated ? 'var(--mint)' : 'var(--coral)', fontSize: '0.9rem' }}>{tc.consentValidated ? 'All Data Consented' : 'Consent Violations Detected'}</div>
            </div>
          </div>
          {(tc.consentViolations || []).length > 0 && tc.consentViolations.map((v, i) => (
            <div key={i} className="alert alert-error" style={{ fontSize: '0.82rem', marginBottom: 8 }}>⚠ {v}</div>
          ))}
          {tc.consentValidated && <div className="alert alert-success" style={{ fontSize: '0.82rem' }}>✓ Decision used only data categories you have consented to.</div>}
        </div>

        <div className="card p-6">
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--navy)', marginBottom: 16 }}>Bias Analysis</h3>
          {decision.biasAnalysis && ['genderBias', 'ageBias', 'incomeBias'].map(key => (
            <div key={key} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--gray-500)', textTransform: 'capitalize' }}>{key.replace('Bias', ' Bias')}</span>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: decision.biasAnalysis[key] > 0.1 ? 'var(--coral)' : 'var(--mint)' }}>{(decision.biasAnalysis[key] * 100).toFixed(1)}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${decision.biasAnalysis[key] * 100}%`, background: decision.biasAnalysis[key] > 0.1 ? 'var(--coral)' : 'var(--mint)' }} />
              </div>
            </div>
          ))}
          {decision.biasAnalysis?.isFlagged && <div className="alert alert-warning" style={{ fontSize: '0.82rem', marginTop: 12 }}>⚠ Elevated bias detected and flagged for admin review.</div>}
          {!decision.biasAnalysis?.isFlagged && <div className="alert alert-success" style={{ fontSize: '0.82rem', marginTop: 12 }}>✓ Bias levels within acceptable thresholds.</div>}
        </div>
      </div>
    </DashboardLayout>
  );
}
