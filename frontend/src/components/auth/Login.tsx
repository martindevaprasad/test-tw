import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAppDispatch } from '@/hooks';
import { setCredentials } from '@/store/authSlice';
import { api, AUTH } from '@/services/api';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { toast.error('Please fill in all fields'); return; }
    setLoading(true);
    try {
      const data = await api.mutation(AUTH.LOGIN, { email, password });
      dispatch(setCredentials({ user: data.login.user, token: data.login.token }));
      toast.success(`Welcome back, ${data.login.user.name}!`);
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">⚡</div>
          <div>
            <div className="auth-logo-text">NexusPOS</div>
          </div>
        </div>

        <h2 className="auth-title">Welcome back</h2>
        <p className="auth-subtitle">Sign in to your account to continue</p>

        <form onSubmit={handleSubmit} id="login-form">
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">Email address</label>
            <input
              id="login-email"
              type="email"
              className="form-input"
              placeholder="you@company.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              className="form-input"
              placeholder="Your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: '8px' }}
            disabled={loading}
            id="login-submit"
          >
            {loading ? (
              <><span className="spinner" style={{ width: 18, height: 18 }} /> Signing in...</>
            ) : 'Sign In'}
          </button>
        </form>

        <div className="auth-divider">or</div>

        <p className="text-center text-sm text-secondary">
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--color-primary-light)', fontWeight: 600 }}>
            Create one →
          </Link>
        </p>

        <div style={{
          marginTop: '24px',
          padding: '16px',
          background: 'rgba(124, 58, 237, 0.08)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid rgba(124, 58, 237, 0.2)',
        }}>
          <p className="text-xs text-secondary" style={{ marginBottom: 4, fontWeight: 600 }}>
            🔑 Demo credentials
          </p>
          <p className="text-xs text-muted">Register a new account to get started</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
