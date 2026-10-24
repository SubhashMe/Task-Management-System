import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3,
  Lock,
  User,
  Eye,
  EyeOff,
  AlertCircle,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { useAnalytics } from '../context/AnalyticsContext';

export const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAnalytics();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // If already authenticated, redirect
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Fast enterprise auth check
    setTimeout(() => {
      const result = login(username, password);
      if (result.success) {
        navigate('/', { replace: true });
      } else {
        setError(result.message);
        setLoading(false);
      }
    }, 350);
  };

  return (
    <div
      className="min-vh-100 d-flex flex-column justify-content-center align-items-center p-3"
      style={{
        backgroundColor: '#12131a',
        backgroundImage: 'radial-gradient(circle at 50% 20%, rgba(255, 90, 95, 0.08) 0%, transparent 60%)',
        backgroundSize: '100% 100%'
      }}
    >
      <div
        className="card w-100 overflow-hidden"
        style={{
          maxWidth: '440px',
          borderRadius: '24px',
          backgroundColor: '#1e202c',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)'
        }}
      >
        <div className="p-4 p-sm-5">
          {/* Brand Header */}
          <div className="text-center mb-4">
            <div
              className="d-inline-flex align-items-center justify-content-center rounded-3 mb-3"
              style={{
                width: '52px',
                height: '52px',
                backgroundColor: 'var(--primary)',
                color: '#ffffff',
                boxShadow: '0 6px 20px rgba(255, 90, 95, 0.4)',
                borderRadius: '16px'
              }}
            >
              <BarChart3 size={28} />
            </div>

            <h1
              className="h3 fw-bold mb-1"
              style={{
                fontFamily: 'var(--font-display)',
                color: '#ffffff',
                letterSpacing: '-0.03em',
                fontWeight: 800
              }}
            >
              Insight<span style={{ color: 'var(--primary)' }}>IQ</span>
            </h1>

            <p
              className="text-secondary small mb-0"
              style={{ fontWeight: 600, letterSpacing: '0.04em', fontSize: '0.74rem' }}
            >
              ENTERPRISE ANALYTICS & INTELLIGENCE
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div
              className="p-3 rounded-3 mb-3 d-flex align-items-start gap-2"
              style={{
                fontSize: '0.82rem',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                color: '#f87171',
                fontWeight: 600
              }}
              role="alert"
            >
              <AlertCircle size={18} className="flex-shrink-0 mt-0.5 text-danger" />
              <div>{error}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
            {/* Username Field */}
            <div>
              <label
                htmlFor="usernameInput"
                className="form-label d-flex justify-content-between mb-1.5"
                style={{ color: '#e2e8f0', fontWeight: 600, fontSize: '0.82rem' }}
              >
                <span>Username / Operator ID</span>
                <span
                  className="badge rounded-pill"
                  style={{
                    backgroundColor: 'rgba(255, 90, 95, 0.15)',
                    color: '#ff7e82',
                    fontSize: '0.65rem'
                  }}
                >
                  Required
                </span>
              </label>
              <div
                className="input-group"
                style={{
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  backgroundColor: '#161824'
                }}
              >
                <span
                  className="input-group-text border-0 ps-3"
                  style={{ backgroundColor: 'transparent', color: '#94a3b8' }}
                >
                  <User size={16} />
                </span>
                <input
                  id="usernameInput"
                  type="text"
                  className="form-control border-0 ps-2"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{
                    fontSize: '0.88rem',
                    fontWeight: 500,
                    color: '#ffffff',
                    backgroundColor: 'transparent'
                  }}
                  required
                  autoFocus
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="passwordInput"
                className="form-label d-flex justify-content-between mb-1.5"
                style={{ color: '#e2e8f0', fontWeight: 600, fontSize: '0.82rem' }}
              >
                <span>Password</span>
                <span
                  className="badge rounded-pill"
                  style={{
                    backgroundColor: 'rgba(255, 90, 95, 0.15)',
                    color: '#ff7e82',
                    fontSize: '0.65rem'
                  }}
                >
                  Required
                </span>
              </label>
              <div
                className="input-group"
                style={{
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  backgroundColor: '#161824'
                }}
              >
                <span
                  className="input-group-text border-0 ps-3"
                  style={{ backgroundColor: 'transparent', color: '#94a3b8' }}
                >
                  <Lock size={16} />
                </span>
                <input
                  id="passwordInput"
                  type={showPassword ? 'text' : 'password'}
                  className="form-control border-0 ps-2"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    fontSize: '0.88rem',
                    fontWeight: 500,
                    color: '#ffffff',
                    backgroundColor: 'transparent'
                  }}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="btn border-0 text-secondary pe-3"
                  style={{
                    backgroundColor: 'transparent',
                    boxShadow: 'none',
                    borderRadius: 0
                  }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="d-flex justify-content-between align-items-center mt-1">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="rememberMe"
                  defaultChecked
                  style={{
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    backgroundColor: '#161824'
                  }}
                />
                <label
                  className="form-check-label ms-1"
                  htmlFor="rememberMe"
                  style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-secondary)' }}
                >
                  Remember session
                </label>
              </div>

              <span
                className="badge rounded-pill"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  color: 'var(--text-secondary)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  fontSize: '0.72rem',
                  fontWeight: 600
                }}
              >
                SSO Enabled
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary d-flex align-items-center justify-content-center gap-2 py-2.5 text-white mt-2"
              style={{
                fontSize: '0.92rem',
                fontWeight: 700,
                borderRadius: '12px',
                border: 'none',
                backgroundColor: 'var(--primary)',
                boxShadow: '0 4px 18px rgba(255, 90, 95, 0.4)'
              }}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  />
                  <span>Authenticating Session...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Analytics Platform</span>
                  <ArrowRight size={17} />
                </>
              )}
            </button>
          </form>

          {/* Security & Compliance Footer */}
          <div className="mt-4 pt-3 text-center" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div
              className="d-inline-flex align-items-center justify-content-center gap-1.5 mb-2 px-3 py-1 rounded-pill"
              style={{
                backgroundColor: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                fontSize: '0.74rem',
                fontWeight: 600,
                color: '#34d399'
              }}
            >
              <ShieldCheck size={14} />
              <span>TLS 1.3 End-to-End Encrypted Session</span>
            </div>
            <div className="text-muted" style={{ fontSize: '0.72rem' }}>
              InsightIQ Enterprise Data Center #1 • Node Active
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
