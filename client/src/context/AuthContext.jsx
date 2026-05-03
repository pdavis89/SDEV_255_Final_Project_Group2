import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // null means not logged in
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // -----------------------------------------------------------------
  // Replace mock auth calls with real backend API requests.
  // The rest of the app does not need to change.
  // -----------------------------------------------------------------

  async function login(username, password) {
    if (!username || !password) {
      return { success: false, message: 'Invalid credentials.' };
    }

    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: username, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      return { success: false, message: data.message || 'Login failed.' };
    }

    setUser(data.user);
    localStorage.setItem('authToken', data.token);
    return { success: true };
  }

  async function register(username, password) {
    if (!username || !password) {
      return { success: false, message: 'Please fill in all fields.' };
    }

    const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: username,
        password,
        name: username,
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

  async function logout() {
    try {
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
    } catch (error) {
      // ignore logout network failures and clear local state anyway
    }

    setUser(null);
    localStorage.removeItem('authToken');
  }

  function addCourse(courseId) {
    if (!user) return;
    if (user.schedule.includes(courseId)) return; // prevent duplicates
    setUser(prev => ({ ...prev, schedule: [...prev.schedule, courseId] }));
  }

  function removeCourse(courseId) {
    if (!user) return;
    setUser(prev => ({
      ...prev,
      schedule: prev.schedule.filter(id => id !== courseId),
    }));
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, register, addCourse, removeCourse }}>
      {children}
    </AuthContext.Provider>
  );
}

// Call this hook inside any component to access auth state and actions
export function useAuth() {
  return useContext(AuthContext);
}
