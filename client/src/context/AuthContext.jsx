import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

// keeps track of the logged in user
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://sdev-255-final-project-group2.onrender.com';

  // reloads the user if a token is still saved
  useEffect(() => {
    // asks the backend if the saved token is still valid
    async function restoreSession() {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setAuthLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/status`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (!res.ok) {
          localStorage.removeItem('authToken');
          setUser(null);
          return;
        }

        setUser(data.user);
      } catch {
        setUser(null);
      } finally {
        setAuthLoading(false);
      }
    }

    restoreSession();
  }, [API_BASE_URL]);

  // logs a user in with email and password
  async function login(email, password) {
    if (!email || !password) {
      return { success: false, message: 'Invalid credentials.' };
    }

    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      return { success: false, message: data.message || 'Login failed.' };
    }

    setUser(data.user);
    localStorage.setItem('authToken', data.token);
    return { success: true };
  }

  // creates a user account and stores the returned token
  async function register(email, password, role = 'student', firstName = '', lastName = '') {
    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();

    if (!email || !password || !fullName) {
      return { success: false, message: 'Please fill in all fields.' };
    }

    const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password,
        name: fullName,
        role,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      return { success: false, message: data.message || 'Registration failed.' };
    }

    setUser(data.user);
    localStorage.setItem('authToken', data.token);
    return { success: true };
  }

  // logs out locally and tells the backend when possible
  async function logout() {
    const token = localStorage.getItem('authToken');

    try {
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({}),
      });
    } catch {
      // still clear local state if the request fails
    }

    setUser(null);
    localStorage.removeItem('authToken');
  }

  return (
    <AuthContext.Provider value={{ user, authLoading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

// gives components access to auth state and actions
export function useAuth() {
  return useContext(AuthContext);
}
