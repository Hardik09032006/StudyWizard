import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiLogIn, FiAlertCircle } from 'react-icons/fi';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    navigate('/dashboard', { replace: true });
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="auth-page">
      <div className="hero-bg">
        <div className="hero-gradient-orb" style={{ width: 300, height: 300, background: 'var(--primary)', top: '-5%', right: '-5%', position: 'absolute', borderRadius: '50%', filter: 'blur(80px)', opacity: 0.2 }} />
        <div className="hero-gradient-orb" style={{ width: 250, height: 250, background: 'var(--secondary)', bottom: '-5%', left: '-5%', position: 'absolute', borderRadius: '50%', filter: 'blur(80px)', opacity: 0.15 }} />
      </div>

      <motion.div
        className="auth-card"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Sign in to continue your learning journey</p>
        </div>

        {error && (
          <div className="auth-error">
            <FiAlertCircle />
            {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">
              <FiMail style={{ marginRight: 6, verticalAlign: 'middle' }} />
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">
              <FiLock style={{ marginRight: 6, verticalAlign: 'middle' }} />
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="loading-spinner" />
                Signing in...
              </>
            ) : (
              <>
                <FiLogIn />
                Sign In
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          Don&apos;t have an account?{' '}
          <Link to="/register">Create one</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
