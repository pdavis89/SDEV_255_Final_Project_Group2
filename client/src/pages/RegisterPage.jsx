import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Hero from '../components/Hero';

// shows the account registration form
export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirm: '',
    role: 'student',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // updates form state when an input changes
  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  // validates and submits a new account
  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!form.firstName.trim() || !form.lastName.trim() || !form.email || !form.password || !form.confirm) {
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
    const result = await register(
      form.email,
      form.password,
      form.role,
      form.firstName,
      form.lastName
    );
    setLoading(false);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.message || 'Registration failed. Please try again.');
    }
  }

  return (
  <>
    <Hero
      title="CREATE ACCOUNT"
      subtitle="Register to start enrolling in courses"
    />

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

          <label>First Name</label>
          <input
            type="text"
            className="register-input"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
          />

          <label>Last Name</label>
          <input
            type="text"
            className="register-input"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
          />

          <label>Email</label>
          <input
            type="email"
            className="register-input"
            name="email"
            value={form.email}
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
          <small className="register-help-text">Minimum 6 characters</small>

          <label>Confirm Password</label>
          <input
            type="password"
            className="register-input"
            name="confirm"
            value={form.confirm}
            onChange={handleChange}
          />

          <label>Role</label>
          <select
            className="register-input"
            name="role"
            value={form.role}
            onChange={handleChange}
          >
            <option value="student">Student</option>
            <option value="professor">Professor</option>
          </select>

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
