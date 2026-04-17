import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import API from '../utils/api';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';

export default function AuditLogPage() {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const endpoint = user?.role === 'admin' ? '/audit/all' : '/audit/my';
    const params = filter !== 'all' ? { severity: filter } : {};
    API.get(endpoint, { params })
      .then(res => setLogs(res.data.data))
      .catch(() => toast.error('Failed to load audit logs'))
      .finally(() => setLoading(false));
  }, [filter, user]);

  const severityColor = { low: 'var(--mint)', medium: 'var(--gold)', high: 'var(--coral)', critical: '#8B0000' };
  const actionIcon = { decision_processed: '⚙️', decision_created: '📝', consent_updated: '🛡️', user_login: '🔑', user_register: '👤', decision_flagged: '🚩', decision_reviewed: '✅', data_accessed: '👁️' };

  return (
    <DashboardLayout
      title="Audit Log"
      subtitle="Immutable trail of all AI governance events"
    >
      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {['all', 'low', 'medium', 'high', 'critical'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: '7px 16px', borderRadius: 99, border: '1px solid', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', transition: 'var(--transition)', borderColor: filter === f ? 'var(--navy)' : 'var(--gray-200)', background: filter === f ? 'var(--navy)' : 'white', color: filter === f ? 'white' : 'var(--gray-400)' }}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[1,2,3,4,5].map(i => <div key={i} className="skeleton" style={{ height: 64, borderRadius: 'var(--radius-md)' }} />)}
        </div>
      ) : !logs.length ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--gray-400)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>📋</div>
          <p>No audit logs found.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {logs.map(log => (
            <div key={log.logId} style={{ background: 'white', borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-100)', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 16, boxShadow: 'var(--shadow-sm)' }}>
              {/* Severity indicator */}
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: severityColor[log.severity] || 'var(--gray-300)', flexShrink: 0 }} />

              {/* Action icon */}
              <div style={{ fontSize: '1.2rem', flexShrink: 0 }}>{actionIcon[log.action] || '📌'}</div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 2 }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.88rem', color: 'var(--navy)', textTransform: 'capitalize' }}>{log.action?.replace(/_/g, ' ')}</span>
                  {log.outcome && <span className={`badge badge-${log.outcome === 'success' ? 'approved' : log.outcome === 'failure' ? 'rejected' : log.outcome}`} style={{ fontSize: '0.7rem' }}>{log.outcome}</span>}
                  <span style={{ fontSize: '0.7rem', fontWeight: 600, padding: '2px 8px', borderRadius: 99, background: `${severityColor[log.severity]}20`, color: severityColor[log.severity] }}>
                    {log.severity}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 16, fontSize: '0.75rem', color: 'var(--gray-400)' }}>
                  {log.decisionId && <span style={{ fontFamily: 'var(--font-mono)' }}>{log.decisionId}</span>}
                  {log.userId?.name && <span>👤 {log.userId.name}</span>}
                  {log.consentStatus !== 'n/a' && <span>🛡️ Consent: {log.consentStatus}</span>}
                  {log.fairnessScore && <span>⚖️ Fairness: {(log.fairnessScore * 100).toFixed(0)}%</span>}
                  {(log.riskFlags || []).length > 0 && <span style={{ color: 'var(--coral)' }}>⚠ {log.riskFlags.join(', ')}</span>}
                </div>
              </div>

              <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', textAlign: 'right', flexShrink: 0 }}>
                <div>{new Date(log.createdAt).toLocaleDateString('en-IN')}</div>
                <div style={{ fontFamily: 'var(--font-mono)' }}>{new Date(log.createdAt).toLocaleTimeString('en-IN')}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
