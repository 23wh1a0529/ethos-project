import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import API from '../utils/api';
import toast from 'react-hot-toast';

const STEPS = ['Loan Details', 'Financial Profile', 'Review & Submit'];

export default function ApplyPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    loanAmount: '', loanPurpose: 'personal', loanTerm: 36,
    annualIncome: '', employmentStatus: 'employed', yearsEmployed: '',
    creditScore: 650, creditUtilization: 0.3, debtToIncomeRatio: 0.25,
    paymentHistory: 'good', existingLoans: 0
  });

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await API.post('/decisions/apply', {
        applicationType: 'loan',
        applicationData: { ...form, loanAmount: Number(form.loanAmount), annualIncome: Number(form.annualIncome), yearsEmployed: Number(form.yearsEmployed) }
      });
      toast.success('Application submitted! Processing your TrustCard...');
      navigate(`/decisions/${res.data.data.decisionId}`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Submission failed');
    } finally { setLoading(false); }
  };

  return (
    <DashboardLayout title="New Application" subtitle="Apply for a loan with full AI transparency">
      {/* Stepper */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 40, maxWidth: 600 }}>
        {STEPS.map((s, i) => (
          <React.Fragment key={s}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: i <= step ? 'var(--navy)' : 'var(--gray-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'var(--transition)' }}>
                {i < step ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
                ) : (
                  <span style={{ color: i === step ? 'white' : 'var(--gray-400)', fontSize: '0.82rem', fontWeight: 700, fontFamily: 'var(--font-display)' }}>{i + 1}</span>
                )}
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: i === step ? 'var(--navy)' : 'var(--gray-400)', fontFamily: 'var(--font-display)', whiteSpace: 'nowrap' }}>{s}</span>
            </div>
            {i < STEPS.length - 1 && <div style={{ flex: 1, height: 2, background: i < step ? 'var(--navy)' : 'var(--gray-100)', margin: '0 8px', marginBottom: 24, transition: 'var(--transition)' }} />}
          </React.Fragment>
        ))}
      </div>

      <div style={{ maxWidth: 680 }}>
        <div className="card p-8">
          {step === 0 && (
            <div className="slide-in-right">
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--navy)', marginBottom: 24 }}>Loan Details</h3>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Loan Amount (₹)</label>
                  <input type="number" className="form-input" placeholder="500000" value={form.loanAmount} onChange={e => set('loanAmount', e.target.value)} required min={1000} />
                </div>
                <div className="form-group">
                  <label className="form-label">Loan Term (Months)</label>
                  <select className="form-select" value={form.loanTerm} onChange={e => set('loanTerm', Number(e.target.value))}>
                    {[12, 24, 36, 48, 60, 84, 120].map(t => <option key={t} value={t}>{t} months ({Math.round(t/12)}yr{t > 12 ? 's' : ''})</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Loan Purpose</label>
                <select className="form-select" value={form.loanPurpose} onChange={e => set('loanPurpose', e.target.value)}>
                  {[['personal','Personal Loan'],['home','Home Purchase'],['education','Education'],['vehicle','Vehicle'],['medical','Medical'],['business','Business'],['debt_consolidation','Debt Consolidation']].map(([v,l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
              <div style={{ background: 'var(--gray-50)', borderRadius: 'var(--radius-md)', padding: '16px', marginTop: 8 }}>
                <div style={{ fontSize: '0.82rem', color: 'var(--gray-400)', lineHeight: 1.6 }}>
                  <strong style={{ color: 'var(--navy)' }}>🔒 ETHOS Guarantee:</strong> Your application will be processed through our 6-layer AI governance pipeline. You'll receive a full TrustCard explanation regardless of outcome.
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="slide-in-right">
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--navy)', marginBottom: 24 }}>Financial Profile</h3>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Annual Income (₹)</label>
                  <input type="number" className="form-input" placeholder="600000" value={form.annualIncome} onChange={e => set('annualIncome', e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Employment Status</label>
                  <select className="form-select" value={form.employmentStatus} onChange={e => set('employmentStatus', e.target.value)}>
                    <option value="employed">Employed</option>
                    <option value="self-employed">Self-Employed</option>
                    <option value="unemployed">Unemployed</option>
                    <option value="retired">Retired</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Years Employed</label>
                  <input type="number" className="form-input" placeholder="3" value={form.yearsEmployed} onChange={e => set('yearsEmployed', e.target.value)} min={0} max={50} />
                </div>
                <div className="form-group">
                  <label className="form-label">Credit Score (300–850)</label>
                  <input type="number" className="form-input" value={form.creditScore} onChange={e => set('creditScore', Number(e.target.value))} min={300} max={850} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Credit Utilization: {(form.creditUtilization * 100).toFixed(0)}%</label>
                <input type="range" min={0} max={1} step={0.01} value={form.creditUtilization} onChange={e => set('creditUtilization', Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--royal)' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--gray-400)', marginTop: 4 }}>
                  <span>0% (Best)</span><span>100% (Worst)</span>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Debt-to-Income Ratio: {(form.debtToIncomeRatio * 100).toFixed(0)}%</label>
                <input type="range" min={0} max={0.8} step={0.01} value={form.debtToIncomeRatio} onChange={e => set('debtToIncomeRatio', Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--royal)' }} />
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Payment History</label>
                  <select className="form-select" value={form.paymentHistory} onChange={e => set('paymentHistory', e.target.value)}>
                    <option value="excellent">Excellent</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="poor">Poor</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Existing Loans</label>
                  <input type="number" className="form-input" value={form.existingLoans} onChange={e => set('existingLoans', Number(e.target.value))} min={0} max={10} />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="slide-in-right">
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--navy)', marginBottom: 24 }}>Review & Submit</h3>
              {[
                { label: 'Loan Amount', value: `₹${Number(form.loanAmount).toLocaleString('en-IN')}` },
                { label: 'Purpose', value: form.loanPurpose },
                { label: 'Term', value: `${form.loanTerm} months` },
                { label: 'Annual Income', value: `₹${Number(form.annualIncome).toLocaleString('en-IN')}` },
                { label: 'Employment', value: form.employmentStatus },
                { label: 'Credit Score', value: form.creditScore },
                { label: 'Credit Utilization', value: `${(form.creditUtilization * 100).toFixed(0)}%` },
                { label: 'Debt-to-Income', value: `${(form.debtToIncomeRatio * 100).toFixed(0)}%` },
                { label: 'Payment History', value: form.paymentHistory },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--gray-100)' }}>
                  <span style={{ fontSize: '0.88rem', color: 'var(--gray-400)', fontWeight: 500 }}>{item.label}</span>
                  <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--navy)', textTransform: 'capitalize' }}>{item.value}</span>
                </div>
              ))}
              <div className="alert alert-info" style={{ marginTop: 20 }}>
                By submitting, you authorize ETHOS to process your application through our AI governance pipeline and generate a TrustCard decision report.
              </div>
            </div>
          )}

          {/* Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32 }}>
            <button className="btn btn-secondary" onClick={() => setStep(s => s - 1)} disabled={step === 0} style={{ opacity: step === 0 ? 0.4 : 1 }}>← Back</button>
            {step < 2 ? (
              <button className="btn btn-primary" onClick={() => setStep(s => s + 1)} disabled={step === 0 && !form.loanAmount}>
                Continue →
              </button>
            ) : (
              <button className="btn btn-accent" onClick={handleSubmit} disabled={loading}>
                {loading ? <>
                  <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
                  Processing...
                </> : '🚀 Submit Application'}
              </button>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
