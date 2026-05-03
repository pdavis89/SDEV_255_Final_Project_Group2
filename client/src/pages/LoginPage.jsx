import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Hero from '../components/Hero';

// shows the sign in form
export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // updates form state when an input changes
  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  // sends login credentials to auth context
  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!form.email || !form.password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    const result = await login(form.email, form.password);
    setLoading(false);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.message || 'Login failed.');
    }
  }

  
  return (
  <>
    <Hero
      title="COURSE REGISTRATION PORTAL"
      subtitle="Sign in to access your schedule and manage your courses"
    />

    <div className="login-page">
      <div className="login-card">

        <h2 className="mb-1">Sign In</h2>
        <p className="text-muted mb-4">Access your course schedule</p>

        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>

          <input
            type="email"
            className="login-input"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />

          <input
            type="password"
            className="login-input"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />

          <button
            type="submit"
            className="btn-teal w-100"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

        </form>

        <hr className="my-4" />

        <p className="text-center mb-0">
          Don&apos;t have an account?{' '}
          <Link to="/register">Create one</Link>
        </p>

      </div>
    </div>
  </>
);
}
