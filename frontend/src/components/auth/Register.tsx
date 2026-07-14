import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAppDispatch } from '@/hooks';
import { setCredentials } from '@/store/authSlice';
import { api, AUTH } from '@/services/api';

const ORG_TYPES = [
  { value: 'RESTAURANT', label: '🍽️ Restaurant' },
  { value: 'BAKERY', label: '🥐 Bakery' },
  { value: 'CAFE', label: '☕ Café' },
  { value: 'QUICK_SERVICE', label: '⚡ Quick Service' },
];

export const Register: React.FC = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    organizationName: '',
    orgType: 'RESTAURANT',
  });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const update = (field: string, value: string) => setForm(f => ({ ...f, [field]: value }));

  const nextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) { toast.error('Please fill all fields'); return; }
    if (form.password !== form.confirmPassword) { toast.error('Passwords do not match'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.organizationName) { toast.error('Organization name is required'); return; }
    setLoading(true);
    try {
      const data = await api.mutation(AUTH.REGISTER, {
        email: form.email,
        password: form.password,
        name: form.name,
        organizationName: form.organizationName,
        orgType: form.orgType,
      });
      dispatch(setCredentials({ user: data.register.user, token: data.register.token }));
      toast.success('Welcome to NexusPOS! Your workspace is ready 🎉');
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: 480 }}>
        <div className="auth-logo">
          <div className="auth-logo-icon">⚡</div>
          <div>
            <div className="auth-logo-text">NexusPOS</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          {[1, 2].map(s => (
            <div
              key={s}
              style={{
                flex: 1,
                height: 4,
                borderRadius: 2,
                background: step >= s ? 'var(--gradient-primary)' : 'rgba(255,255,255,0.1)',
                transition: 'all 0.3s',
              }}
            />
          ))}
        </div>

        {step === 1 ? (
          <>
            <h2 className="auth-title">Create your account</h2>
            <p className="auth-subtitle">Step 1 of 2 — Personal details</p>

            <form onSubmit={nextStep} id="register-step1">
              <div className="form-group">
                <label className="form-label" htmlFor="reg-name">Full name</label>
                <input
                  id="reg-name"
                  type="text"
                  className="form-input"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={e => update('name', e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="reg-email">Email address</label>
                <input
                  id="reg-email"
                  type="email"
                  className="form-input"
                  placeholder="you@company.com"
                  value={form.email}
                  onChange={e => update('email', e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="reg-password">Password</label>
                <input
                  id="reg-password"
                  type="password"
                  className="form-input"
                  placeholder="Min 6 characters"
                  value={form.password}
                  onChange={e => update('password', e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="reg-confirm">Confirm password</label>
                <input
                  id="reg-confirm"
                  type="password"
                  className="form-input"
                  placeholder="Repeat password"
                  value={form.confirmPassword}
                  onChange={e => update('confirmPassword', e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} id="reg-next">
                Continue →
              </button>
            </form>
          </>
        ) : (
          <>
            <h2 className="auth-title">Setup your business</h2>
            <p className="auth-subtitle">Step 2 of 2 — Organization details</p>

            <form onSubmit={handleSubmit} id="register-step2">
              <div className="form-group">
                <label className="form-label" htmlFor="reg-org-name">Organization name</label>
                <input
                  id="reg-org-name"
                  type="text"
                  className="form-input"
                  placeholder="My Restaurant Group"
                  value={form.organizationName}
                  onChange={e => update('organizationName', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Business type</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {ORG_TYPES.map(type => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => update('orgType', type.value)}
                      style={{
                        padding: '12px',
                        border: `2px solid ${form.orgType === type.value ? 'var(--color-primary)' : 'var(--color-border)'}`,
                        borderRadius: 'var(--radius-md)',
                        background: form.orgType === type.value ? 'rgba(124, 58, 237, 0.15)' : 'transparent',
                        color: form.orgType === type.value ? 'var(--color-primary-light)' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-family)',
                        fontSize: 'var(--font-size-sm)',
                        fontWeight: 600,
                        transition: 'all 0.2s',
                      }}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setStep(1)} style={{ flex: 1 }}>
                  ← Back
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 2 }}
                  disabled={loading}
                  id="reg-submit"
                >
                  {loading ? (
                    <><span className="spinner" style={{ width: 18, height: 18 }} /> Creating...</>
                  ) : '🚀 Create Workspace'}
                </button>
              </div>
            </form>
          </>
        )}

        <div className="auth-divider">or</div>
        <p className="text-center text-sm text-secondary">
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--color-primary-light)', fontWeight: 600 }}>
            Sign in →
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
