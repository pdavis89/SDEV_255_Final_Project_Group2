import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Hero from '../components/Hero';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!form.username || !form.password || !form.confirm) {
      setError('Please fill in all fields.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    const result = await register(form.username, form.password);
    setLoading(false);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.message || 'Registration failed. Please try again.');
    }
  }

  return (
  <>
    {/* HERO */}
    <Hero
      title="CREATE ACCOUNT"
      subtitle="Register to start enrolling in courses"
    />

    {/* TEAL BACKGROUND SECTION */}
    <div className="register-section">
      <div className="register-card">

        <h2>Create Account</h2>
        <p className="register-subtext">
          Register to start enrolling in courses
        </p>

        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>

          <label>Username</label>
          <input
            type="text"
            className="register-input"
            name="username"
            value={form.username}
            onChange={handleChange}
          />

          <label>Password</label>
          <input
            type="password"
            className="register-input"
            name="password"
            value={form.password}
            onChange={handleChange}
          />
          <small>Minimum 6 characters</small>

          <label>Confirm Password</label>
          <input
            type="password"
            className="register-input"
            name="confirm"
            value={form.confirm}
            onChange={handleChange}
          />

          <button
            type="submit"
            className="btn-teal"
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>

        </form>

        <hr />

        <p className="text-center">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>

      </div>
    </div>
  </>
);
}
