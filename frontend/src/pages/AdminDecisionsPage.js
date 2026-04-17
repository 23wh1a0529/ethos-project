import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import API from '../utils/api';
import toast from 'react-hot-toast';

export default function AdminDecisionsPage() {
  const [decisions, setDecisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [reviewModal, setReviewModal] = useState(null);
  const [reviewNotes, setReviewNotes] = useState('');

  const load = () => {
    const params = {};
    if (filter !== 'all') params.status = filter;
    API.get('/admin/decisions', { params })
      .then(res => setDecisions(res.data.data))
      .catch(() => toast.error('Failed to load decisions'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { setLoading(true); load(); }, [filter]);

  const submitReview = async () => {
    try {
      await API.put(`/admin/decisions/${reviewModal.decisionId}/review`, { reviewNotes });
      toast.success('Decision reviewed');
      setReviewModal(null);
      setReviewNotes('');
      load();
    } catch { toast.error('Failed to submit review'); }
  };

  return (
    <DashboardLayout
      title="All Decisions"
      subtitle="Monitor and review all AI governance decisions"
      actions={<Link to="/admin" className="btn btn-secondary btn-sm">← Dashboard</Link>}
    >
      {/* Filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {['all', 'processed', 'flagged', 'reviewed'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: '7px 16px', borderRadius: 99, border: '1px solid', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', transition: 'var(--transition)', borderColor: filter === f ? 'var(--navy)' : 'var(--gray-200)', background: filter === f ? 'var(--navy)' : 'white', color: filter === f ? 'white' : 'var(--gray-400)' }}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[1,2,3,4,5].map(i => <div key={i} className="skeleton" style={{ height: 72, borderRadius: 'var(--radius-md)' }} />)}
        </div>
      ) : !decisions.length ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--gray-400)' }}>No decisions found.</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--gray-50)' }}>
                {['Decision ID', 'Customer', 'Type', 'Amount', 'Outcome', 'Fairness', 'Status', 'Date', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 14px', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.75rem', color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {decisions.map((d, i) => (
                <tr key={d.decisionId} style={{ borderBottom: '1px solid var(--gray-100)', background: i % 2 === 0 ? 'white' : 'var(--gray-50)', transition: 'var(--transition)' }}
                  onMouseOver={e => e.currentTarget.style.background = 'var(--blue-50)'}
                  onMouseOut={e => e.currentTarget.style.background = i % 2 === 0 ? 'white' : 'var(--gray-50)'}>
                  <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--gray-400)' }}>{d.decisionId?.slice(0, 18)}...</td>
                  <td style={{ padding: '12px 14px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--navy)' }}>{d.userId?.name || 'N/A'}</td>
                  <td style={{ padding: '12px 14px', fontSize: '0.82rem', color: 'var(--gray-500)', textTransform: 'capitalize' }}>{d.applicationType?.replace('_', ' ')}</td>
                  <td style={{ padding: '12px 14px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--navy)' }}>₹{(d.applicationData?.loanAmount || 0).toLocaleString('en-IN')}</td>
                  <td style={{ padding: '12px 14px' }}><span className={`badge badge-${d.trustCard?.decision}`}>{d.trustCard?.decision}</span></td>
                  <td style={{ padding: '12px 14px', fontSize: '0.85rem', fontWeight: 700, color: (d.trustCard?.fairnessScore || 0) > 0.8 ? 'var(--mint)' : 'var(--coral)' }}>{((d.trustCard?.fairnessScore || 0) * 100).toFixed(0)}%</td>
                  <td style={{ padding: '12px 14px' }}><span className={`badge badge-${d.status}`}>{d.status}</span></td>
                  <td style={{ padding: '12px 14px', fontSize: '0.78rem', color: 'var(--gray-400)' }}>{new Date(d.createdAt).toLocaleDateString('en-IN')}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <Link to={`/decisions/${d.decisionId}`} className="btn btn-ghost btn-sm" style={{ fontSize: '0.75rem', padding: '5px 10px' }}>View</Link>
                      {d.status === 'flagged' && (
                        <button onClick={() => setReviewModal(d)} className="btn btn-sm" style={{ fontSize: '0.75rem', padding: '5px 10px', background: 'var(--gold-light)', color: 'var(--gold)', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 600 }}>
                          Review
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Review Modal */}
      {reviewModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(10,36,99,0.5)', backdropFilter: 'blur(4px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', padding: 36, maxWidth: 500, width: '100%', boxShadow: 'var(--shadow-xl)', animation: 'slideUp 0.3s ease' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 800, color: 'var(--navy)', marginBottom: 8 }}>Review Decision</h3>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--gray-400)', marginBottom: 20 }}>{reviewModal.decisionId}</div>
            <div className="form-group">
              <label className="form-label">Review Notes</label>
              <textarea className="form-textarea" placeholder="Enter your review notes and findings..." value={reviewNotes} onChange={e => setReviewNotes(e.target.value)} rows={4} />
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 20, justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary btn-sm" onClick={() => setReviewModal(null)}>Cancel</button>
              <button className="btn btn-primary btn-sm" onClick={submitReview}>Submit Review</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
