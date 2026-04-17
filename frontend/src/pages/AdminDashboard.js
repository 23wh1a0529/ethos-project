import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, PieChart, Pie, Cell, Legend } from 'recharts';
import DashboardLayout from '../components/DashboardLayout';
import API from '../utils/api';
import toast from 'react-hot-toast';

const StatCard = ({ value, label, color, icon, sub }) => (
  <div className="stat-card" style={{ '--accent-color': color }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
        {sub && <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', marginTop: 6 }}>{sub}</div>}
      </div>
      <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>{icon}</div>
    </div>
  </div>
);

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/admin/dashboard')
      .then(res => setData(res.data.data))
      .catch(() => toast.error('Failed to load admin dashboard'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <DashboardLayout title="Governance Dashboard">
      <div className="grid-4" style={{ marginBottom: 24 }}>
        {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: 100, borderRadius: 'var(--radius-lg)' }} />)}
      </div>
    </DashboardLayout>
  );

  const pieData = [
    { name: 'Approved', value: data?.decisions?.approved || 0, color: 'var(--mint)' },
    { name: 'Rejected', value: data?.decisions?.rejected || 0, color: 'var(--coral)' },
    { name: 'Review', value: data?.decisions?.review || 0, color: 'var(--gold)' },
  ];

  const biasData = data?.bias ? [
    { name: 'Gender', value: +(data.bias.avgGenderBias * 100).toFixed(1) },
    { name: 'Age', value: +(data.bias.avgAgeBias * 100).toFixed(1) },
    { name: 'Income', value: +(data.bias.avgIncomeBias * 100).toFixed(1) },
  ] : [];

  return (
    <DashboardLayout
      title="Governance Dashboard"
      subtitle="AI system health, fairness metrics, and decision analytics"
      actions={
        <div style={{ display: 'flex', gap: 10 }}>
          <Link to="/admin/decisions" className="btn btn-secondary btn-sm">View Decisions</Link>
          <Link to="/admin/audit" className="btn btn-primary btn-sm">Audit Logs</Link>
        </div>
      }
    >
      {/* KPI Stats */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        <StatCard value={data?.decisions?.total || 0} label="Total Decisions" color="var(--royal)" icon="📋" sub={`${data?.decisions?.flagged || 0} flagged`} />
        <StatCard value={`${((data?.fairness?.avgFairness || 0) * 100).toFixed(1)}%`} label="Avg Fairness Score" color="var(--mint)" icon="⚖️" />
        <StatCard value={data?.decisions?.flagged || 0} label="Flagged Decisions" color="var(--coral)" icon="🚩" sub="Require review" />
        <StatCard value={data?.consentViolations || 0} label="Consent Violations" color="var(--gold)" icon="🛡️" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, marginBottom: 24 }}>
        {/* Decision trend */}
        <div className="card p-6">
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--navy)', marginBottom: 20 }}>Decision Trends (Last 7 Days)</h3>
          {data?.last7Days?.length ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={data.last7Days}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--gray-100)" />
                <XAxis dataKey="_id" tick={{ fontSize: 11, fill: 'var(--gray-400)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--gray-400)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontFamily: 'var(--font-body)', fontSize: 12, borderRadius: 8, border: '1px solid var(--gray-100)' }} />
                <Bar dataKey="approved" fill="var(--mint)" radius={[4,4,0,0]} name="Approved" maxBarSize={30} />
                <Bar dataKey="rejected" fill="var(--coral)" radius={[4,4,0,0]} name="Rejected" maxBarSize={30} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gray-400)', fontSize: '0.9rem' }}>No decision data yet</div>
          )}
        </div>

        {/* Outcome pie */}
        <div className="card p-6">
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--navy)', marginBottom: 20 }}>Decision Outcomes</h3>
          {pieData.some(d => d.value > 0) ? (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" outerRadius={65} paddingAngle={3} dataKey="value">
                    {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              {pieData.map(d => (
                <div key={d.name} style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem', color: 'var(--gray-500)' }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: d.color }} />
                    {d.name}
                  </div>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--navy)' }}>{d.value}</span>
                </div>
              ))}
            </>
          ) : <div style={{ textAlign: 'center', paddingTop: 60, color: 'var(--gray-400)', fontSize: '0.9rem' }}>No data yet</div>}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
        {/* Bias analysis */}
        <div className="card p-6">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--navy)' }}>Bias Analysis</h3>
            {biasData.some(d => d.value > 10) && <span className="badge badge-rejected">⚠ Bias Alert</span>}
          </div>
          {biasData.length ? (
            biasData.map(b => (
              <div key={b.name} style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--gray-500)' }}>{b.name} Bias</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: b.value > 10 ? 'var(--coral)' : 'var(--mint)' }}>{b.value}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${Math.min(b.value, 100)}%`, background: b.value > 10 ? 'var(--coral)' : 'var(--mint)' }} />
                </div>
              </div>
            ))
          ) : <div style={{ color: 'var(--gray-400)', fontSize: '0.9rem' }}>No bias data available</div>}
          <div style={{ marginTop: 8 }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>Threshold: &lt;10% acceptable. &gt;10% triggers alert</div>
          </div>
        </div>

        {/* Recent decisions */}
        <div className="card p-6">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--navy)' }}>Recent Activity</h3>
            <Link to="/admin/decisions" style={{ fontSize: '0.8rem', color: 'var(--royal)', fontWeight: 600, textDecoration: 'none' }}>View all →</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {(data?.recentDecisions || []).slice(0, 5).map(d => (
              <Link key={d.decisionId} to={`/decisions/${d.decisionId}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: 'var(--gray-50)', borderRadius: 'var(--radius-sm)', textDecoration: 'none', transition: 'var(--transition)' }}
                onMouseOver={e => e.currentTarget.style.background = 'var(--gray-100)'}
                onMouseOut={e => e.currentTarget.style.background = 'var(--gray-50)'}>
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--navy)' }}>{d.userId?.name || 'Unknown'}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--gray-400)', fontFamily: 'var(--font-mono)' }}>{d.decisionId}</div>
                </div>
                <span className={`badge badge-${d.trustCard?.decision || 'pending'}`} style={{ fontSize: '0.72rem' }}>{d.trustCard?.decision}</span>
              </Link>
            ))}
            {!data?.recentDecisions?.length && <div style={{ color: 'var(--gray-400)', fontSize: '0.9rem', textAlign: 'center', padding: '20px 0' }}>No decisions yet</div>}
          </div>
        </div>
      </div>

      {/* System health */}
      <div className="card p-6">
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--navy)', marginBottom: 20 }}>System Health</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {[
            { label: 'AI Model', status: 'Operational', color: 'var(--mint)' },
            { label: 'Consent Engine', status: 'Operational', color: 'var(--mint)' },
            { label: 'Bias Detector', status: 'Active', color: 'var(--mint)' },
            { label: 'Audit Logger', status: 'Logging', color: 'var(--royal)' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center', padding: '16px', background: 'var(--gray-50)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: s.color, margin: '0 auto 8px', animation: 'pulse 2s infinite' }} />
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--navy)' }}>{s.label}</div>
              <div style={{ fontSize: '0.72rem', color: s.color, fontWeight: 600 }}>{s.status}</div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
