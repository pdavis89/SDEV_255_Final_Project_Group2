import { createContext, useContext, useState } from 'react';
import { initialCourses } from '../data/courses';

const CoursesContext = createContext(null);

export function CoursesProvider({ children }) {
  const [courses, setCourses] = useState(initialCourses);

  // -----------------------------------------------------------------
  // When the Express/Mongo backend is ready (Stage 2), replace the
  // in-memory logic inside each function with fetch() calls, e.g.:
  //
  //   async function addCourse(data) {
  //     const res = await fetch('/api/courses', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify(data),
  //     });
  //     const created = await res.json();
  //     setCourses(prev => [...prev, created]);
  //     return created;
  //   }
  //
  // The components calling useCourses() won't need to change.
  // -----------------------------------------------------------------

  function addCourse(data) {
    const newCourse = {
      ...data,
      id: Date.now(), // Stage 1 only; Mongo will assign _id later
    };
    setCourses(prev => [...prev, newCourse]);
    return newCourse;
  }

  function updateCourse(id, updates) {
    setCourses(prev => prev.map(c => (c.id === id ? { ...c, ...updates, id } : c)));
  }

  function deleteCourse(id) {
    setCourses(prev => prev.filter(c => c.id !== id));
  }

  function getCourseById(id) {
    return courses.find(c => c.id === id);
  }

  return (
    <CoursesContext.Provider
      value={{ courses, addCourse, updateCourse, deleteCourse, getCourseById }}
    >
      {children}
    </CoursesContext.Provider>
  );
}

export function useCourses() {
  return useContext(CoursesContext);
}
