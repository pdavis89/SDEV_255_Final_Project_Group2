import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

const CoursesContext = createContext(null);

export function CoursesProvider({ children }) {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [cartCourseIds, setCartCourseIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  function getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  function normalizeCourse(course) {
    return {
      ...course,
      id: course.id || course._id,
    };
  }

  const loadCourses = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE_URL}/api/courses`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to load courses.');
      }

      setCourses((data.courses || []).map(normalizeCourse));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL]);

  useEffect(() => {
    let ignore = false;

    async function loadInitialCourses() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/courses`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Failed to load courses.');
        }

        if (!ignore) {
          setCourses((data.courses || []).map(normalizeCourse));
          setError('');
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadInitialCourses();

    return () => {
      ignore = true;
    };
  }, [API_BASE_URL]);

  async function addCourse(data) {
    const res = await fetch(`${API_BASE_URL}/api/courses`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.message || 'Failed to create course.');
    }

    const created = normalizeCourse(result.course);
    setCourses(prev => [...prev, created]);
    return created;
  }

  async function updateCourse(id, updates) {
    const res = await fetch(`${API_BASE_URL}/api/courses/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates),
    });

    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.message || 'Failed to update course.');
    }

    const updated = normalizeCourse(result.course);
    setCourses(prev => prev.map(c => (c.id === updated.id ? updated : c)));
    return updated;
  }

  async function deleteCourse(id) {
    const res = await fetch(`${API_BASE_URL}/api/courses/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.message || 'Failed to delete course.');
    }

    setCourses(prev => prev.filter(c => c.id !== id));
  }

  async function enrollInCourse(id) {
    const res = await fetch(`${API_BASE_URL}/api/courses/${id}/enroll`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });

    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.message || 'Failed to enroll in course.');
    }

    const updated = normalizeCourse(result.course);
    setCourses(prev => prev.map(c => (c.id === updated.id ? updated : c)));
    return updated;
  }

  async function dropCourse(id) {
    const res = await fetch(`${API_BASE_URL}/api/courses/${id}/enroll`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.message || 'Failed to drop course.');
    }

    const updated = normalizeCourse(result.course);
    setCourses(prev => prev.map(c => (c.id === updated.id ? updated : c)));
    return updated;
  }

  function addToCart(courseId) {
    setCartCourseIds(prev => {
      if (prev.includes(courseId)) return prev;
      return [...prev, courseId];
    });
  }

  function removeFromCart(courseId) {
    setCartCourseIds(prev => prev.filter(id => id !== courseId));
  }

  function clearCart() {
    setCartCourseIds([]);
  }

  function getCourseById(id) {
    return courses.find(c => c.id === id);
  }

  function isEnrolled(course) {
    return Boolean(
      user &&
      course?.enrolledStudents?.some(student => (student.id || student._id || student) === user.id)
    );
  }

  function getStudentSchedule() {
    if (!user) return [];
    return courses.filter(course => isEnrolled(course));
  }

  function isInCart(courseId) {
    return cartCourseIds.includes(courseId);
  }

  function getCartCourses() {
    return cartCourseIds
      .map(courseId => getCourseById(courseId))
      .filter(Boolean);
  }

  async function checkoutCart() {
    const cartCourses = getCartCourses();
    const results = [];

    for (const course of cartCourses) {
      if (!isEnrolled(course)) {
        const updated = await enrollInCourse(course.id);
        results.push(updated);
      }
    }

    clearCart();
    return results;
  }

  return (
    <CoursesContext.Provider
      value={{
        courses,
        loading,
        error,
        loadCourses,
        addCourse,
        updateCourse,
        deleteCourse,
        enrollInCourse,
        dropCourse,
        addToCart,
        removeFromCart,
        clearCart,
        checkoutCart,
        getCourseById,
        getStudentSchedule,
        getCartCourses,
        isEnrolled,
        isInCart,
        cartCount: cartCourseIds.length,
      }}
    >
      {children}
    </CoursesContext.Provider>
  );
}

export function useCourses() {
  return useContext(CoursesContext);
}
