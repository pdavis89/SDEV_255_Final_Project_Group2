import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // null means not logged in

  // -----------------------------------------------------------------
  // When backend is ready, replace the mock logic inside each
  // function with a real fetch() call to Express API.
  // The rest of the app does not need to change.
  // -----------------------------------------------------------------

  async function login(username, password) {
    // TODO: replace with ->
    // const res = await fetch('/api/auth/login', {
    //   method: 'POST',
    //   credentials: 'include',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ username, password }),
    // });
    // const data = await res.json();
    // if (!res.ok) return { success: false, message: data.message };
    // setUser(data.user);
    // return { success: true };

    // Mock: accepts any non-empty username + password
    if (!username || !password) {
      return { success: false, message: 'Invalid credentials.' };
    }
    setUser({ id: 1, username, schedule: [] });
    return { success: true };
  }

  async function register(username, password) {
    // TODO: replace with ->
    // const res = await fetch('/api/auth/register', {
    //   method: 'POST',
    //   credentials: 'include',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ username, password }),
    // });
    // const data = await res.json();
    // if (!res.ok) return { success: false, message: data.message };
    // setUser(data.user);
    // return { success: true };

    // Mock: accepts any non-empty username + password
    if (!username || !password) {
      return { success: false, message: 'Please fill in all fields.' };
    }
    setUser({ id: 1, username, schedule: [] });
    return { success: true };
  }

  function logout() {
    // TODO: add ->
    // await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    setUser(null);
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
