import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import API from '../utils/api';
import toast from 'react-hot-toast';

export default function MyDecisionsPage() {
  const [decisions, setDecisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    API.get('/decisions/my')
      .then(res => setDecisions(res.data.data))
      .catch(() => toast.error('Failed to load decisions'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'all' ? decisions : decisions.filter(d => d.trustCard?.decision === filter || d.status === filter);

  return (
    <DashboardLayout
      title="My Decisions"
      subtitle="All your AI-governed loan and credit applications"
      actions={<Link to="/apply" className="btn btn-primary btn-sm"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>New Application</Link>}
    >
      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {['all', 'approved', 'rejected', 'review', 'flagged'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: '7px 16px', borderRadius: 99, border: '1px solid', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', transition: 'var(--transition)', borderColor: filter === f ? 'var(--navy)' : 'var(--gray-200)', background: filter === f ? 'var(--navy)' : 'white', color: filter === f ? 'white' : 'var(--gray-400)' }}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: 80, borderRadius: 'var(--radius-md)' }} />)}
        </div>
      ) : !filtered.length ? (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>📭</div>
          <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--navy)', marginBottom: 8 }}>No decisions found</h3>
          <p style={{ color: 'var(--gray-400)', marginBottom: 24 }}>Start by submitting a loan application</p>
          <Link to="/apply" className="btn btn-primary">Apply Now</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(d => (
            <Link key={d.decisionId} to={`/decisions/${d.decisionId}`}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 22px', background: 'white', borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-100)', textDecoration: 'none', transition: 'var(--transition)', boxShadow: 'var(--shadow-sm)' }}
              onMouseOver={e => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseOut={e => { e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.transform = 'none'; }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: d.trustCard?.decision === 'approved' ? 'var(--mint-light)' : d.trustCard?.decision === 'rejected' ? 'var(--coral-light)' : 'var(--gold-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>
                  {d.trustCard?.decision === 'approved' ? '✅' : d.trustCard?.decision === 'rejected' ? '❌' : '⏳'}
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--navy)', fontSize: '0.95rem', textTransform: 'capitalize' }}>{d.applicationType?.replace('_', ' ')} — {d.applicationData?.loanPurpose}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--gray-400)', marginTop: 2, fontFamily: 'var(--font-mono)' }}>{d.decisionId}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--navy)', fontSize: '1rem' }}>₹{(d.applicationData?.loanAmount || 0).toLocaleString('en-IN')}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>{new Date(d.createdAt).toLocaleDateString('en-IN')}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className={`badge badge-${d.trustCard?.decision || 'pending'}`}>{d.trustCard?.decision || 'pending'}</span>
                  <div style={{ fontSize: '0.72rem', color: 'var(--gray-400)', marginTop: 4 }}>Fairness: {((d.trustCard?.fairnessScore || 0) * 100).toFixed(0)}%</div>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gray-300)" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
              </div>
            </Link>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
