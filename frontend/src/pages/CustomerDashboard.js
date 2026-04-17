import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../hooks/useAuth';
import API from '../utils/api';
import toast from 'react-hot-toast';

const StatCard = ({ value, label, color, icon }) => (
  <div className="stat-card" style={{ '--accent-color': color }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
      </div>
      <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>{icon}</div>
    </div>
  </div>
);

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/decisions/stats/summary')
      .then(res => setStats(res.data.data))
      .catch(() => toast.error('Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  const pieData = stats ? [
    { name: 'Approved', value: stats.approved, color: '#00C2A8' },
    { name: 'Rejected', value: stats.rejected, color: '#E85D4A' },
    { name: 'Review', value: stats.review, color: '#E8B84B' },
  ].filter(d => d.value > 0) : [];

  if (loading) return (
    <DashboardLayout title="Dashboard">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
        {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: 100, borderRadius: 'var(--radius-lg)' }} />)}
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout
      title={`Welcome back, ${user?.name?.split(' ')[0]} 👋`}
      subtitle="Your AI decision governance overview"
      actions={<Link to="/apply" className="btn btn-primary"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>New Application</Link>}
    >
      {/* Stats */}
      <div className="grid-4" style={{ marginBottom: 28 }}>
        <StatCard value={stats?.total || 0} label="Total Applications" color="var(--royal)" icon="📋" />
        <StatCard value={stats?.approved || 0} label="Approved" color="var(--mint)" icon="✅" />
        <StatCard value={stats?.rejected || 0} label="Rejected" color="var(--coral)" icon="❌" />
        <StatCard value={stats?.flagged || 0} label="Flagged" color="var(--gold)" icon="⚠️" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, marginBottom: 24 }}>
        {/* Recent Decisions */}
        <div className="card p-6">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--navy)', fontSize: '1rem' }}>Recent Decisions</h3>
            <Link to="/decisions" style={{ fontSize: '0.82rem', color: 'var(--royal)', fontWeight: 600, textDecoration: 'none' }}>View all →</Link>
          </div>
          {!stats?.recent?.length ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>📭</div>
              <p style={{ color: 'var(--gray-400)', fontSize: '0.9rem' }}>No decisions yet</p>
              <Link to="/apply" className="btn btn-primary btn-sm" style={{ marginTop: 16 }}>Apply Now</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {stats.recent.map(d => (
                <Link key={d.decisionId} to={`/decisions/${d.decisionId}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: 'var(--gray-50)', borderRadius: 'var(--radius-md)', textDecoration: 'none', transition: 'var(--transition)' }}
                  onMouseOver={e => e.currentTarget.style.background = 'var(--gray-100)'}
                  onMouseOut={e => e.currentTarget.style.background = 'var(--gray-50)'}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-sm)', background: d.trustCard?.decision === 'approved' ? 'var(--mint-light)' : d.trustCard?.decision === 'rejected' ? 'var(--coral-light)' : 'var(--gold-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>
                      {d.trustCard?.decision === 'approved' ? '✓' : d.trustCard?.decision === 'rejected' ? '✕' : '⟳'}
                    </div>
                    <div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--gray-400)' }}>{d.decisionId}</div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--navy)', textTransform: 'capitalize' }}>{d.applicationType?.replace('_', ' ')}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className={`badge badge-${d.trustCard?.decision}`}>{d.trustCard?.decision}</span>
                    <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', marginTop: 4 }}>Fairness: {((d.trustCard?.fairnessScore || 0) * 100).toFixed(0)}%</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Pie chart */}
        <div className="card p-6">
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--navy)', fontSize: '1rem', marginBottom: 20 }}>Decision Distribution</h3>
          {pieData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value">
                    {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip formatter={(v, n) => [v, n]} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
                {pieData.map(d => (
                  <div key={d.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: d.color }} />
                      <span style={{ fontSize: '0.82rem', color: 'var(--gray-500)' }}>{d.name}</span>
                    </div>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--navy)' }}>{d.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', paddingTop: 60, color: 'var(--gray-400)', fontSize: '0.85rem' }}>No data yet</div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="card p-6">
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--navy)', fontSize: '1rem', marginBottom: 20 }}>Quick Actions</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          {[
            { to: '/apply', icon: '📝', label: 'New Loan Application', color: 'var(--royal)' },
            { to: '/decisions', icon: '📋', label: 'View All Decisions', color: 'var(--mint)' },
            { to: '/consent', icon: '🛡️', label: 'Manage Consent', color: 'var(--gold)' },
            { to: '/profile', icon: '👤', label: 'Update Profile', color: 'var(--sky)' },
          ].map(item => (
            <Link key={item.to} to={item.to} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: '20px 16px', background: 'var(--gray-50)', borderRadius: 'var(--radius-md)', textDecoration: 'none', border: '1px solid var(--gray-100)', transition: 'var(--transition)' }}
              onMouseOver={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseOut={e => { e.currentTarget.style.background = 'var(--gray-50)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}>
              <div style={{ fontSize: '1.8rem' }}>{item.icon}</div>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--navy)', textAlign: 'center', lineHeight: 1.4 }}>{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
