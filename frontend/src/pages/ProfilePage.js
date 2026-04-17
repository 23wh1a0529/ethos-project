import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../hooks/useAuth';
import API from '../utils/api';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '', phone: user?.phone || '', address: user?.address || '',
    annualIncome: user?.annualIncome || '', employmentStatus: user?.employmentStatus || 'employed'
  });
  const [saving, setSaving] = useState(false);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await API.put('/auth/profile', form);
      updateUser(res.data.user);
      toast.success('Profile updated!');
    } catch { toast.error('Update failed'); }
    finally { setSaving(false); }
  };

  return (
    <DashboardLayout title="Profile Settings" subtitle="Manage your account information">
      <div style={{ maxWidth: 600 }}>
        {/* Avatar card */}
        <div className="card p-6" style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.8rem', flexShrink: 0 }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.2rem', color: 'var(--navy)' }}>{user?.name}</div>
            <div style={{ color: 'var(--gray-400)', fontSize: '0.88rem' }}>{user?.email}</div>
            <div style={{ marginTop: 6 }}>
              <span className={`badge badge-${user?.role === 'admin' ? 'navy' : 'mint'}`}>{user?.role === 'admin' ? '⚙️ Admin' : '👤 Customer'}</span>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--navy)', marginBottom: 24 }}>Personal Information</h3>
          <form onSubmit={save}>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className="form-input" value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} required />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input className="form-input" value={form.phone} onChange={e => setForm(p => ({...p, phone: e.target.value}))} placeholder="+91 00000 00000" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Address</label>
              <input className="form-input" value={form.address} onChange={e => setForm(p => ({...p, address: e.target.value}))} placeholder="Your address" />
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Annual Income (₹)</label>
                <input type="number" className="form-input" value={form.annualIncome} onChange={e => setForm(p => ({...p, annualIncome: e.target.value}))} />
              </div>
              <div className="form-group">
                <label className="form-label">Employment Status</label>
                <select className="form-select" value={form.employmentStatus} onChange={e => setForm(p => ({...p, employmentStatus: e.target.value}))}>
                  <option value="employed">Employed</option>
                  <option value="self-employed">Self-Employed</option>
                  <option value="unemployed">Unemployed</option>
                  <option value="retired">Retired</option>
                </select>
              </div>
            </div>

            {/* Read-only info */}
            <div style={{ background: 'var(--gray-50)', borderRadius: 'var(--radius-md)', padding: '16px', marginBottom: 20 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--navy)', fontSize: '0.88rem', marginBottom: 12 }}>Account Details (Read-only)</div>
              <div className="grid-2">
                {[
                  { label: 'Email', value: user?.email },
                  { label: 'Credit Score', value: user?.creditScore || 'N/A' },
                  { label: 'Member Since', value: new Date(user?.createdAt || Date.now()).toLocaleDateString('en-IN') },
                  { label: 'Last Login', value: user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString('en-IN') : 'N/A' },
                ].map(item => (
                  <div key={item.label}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--gray-400)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{item.label}</div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--navy)', marginTop: 2 }}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>

            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} /> : '💾'} Save Changes
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
