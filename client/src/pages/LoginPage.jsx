// KEEP THIS PART
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Hero from '../components/Hero';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!form.username || !form.password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    const result = await login(form.username, form.password);
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
            type="text"
            className="login-input"
            name="username"
            placeholder="Username"
            value={form.username}
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