import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCourses } from '../context/CoursesContext';
import CourseCard from '../components/CourseCard';
import SearchBar from '../components/SearchBar';

export default function HomePage() {
  const { courses } = useCourses();
  const [search, setSearch] = useState('');

  const filtered = courses.filter(course => {
    const q = search.toLowerCase();
    return (
      course.name.toLowerCase().includes(q) ||
      (course.courseNumber && course.courseNumber.toLowerCase().includes(q))
    );
  });

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-start mb-5 flex-wrap gap-2">
        <div>
          <h1 className="mb-1">Available Courses</h1>
          <p className="text-muted mb-0">
            {courses.length} course{courses.length !== 1 ? 's' : ''} available this semester
          </p>
        </div>
        <Link to="/courses/new" className="btn btn-primary">
          + Add Course
        </Link>
      </div>

      <SearchBar value={search} onChange={setSearch} />

      {filtered.length === 0 ? (
        <div className="text-center py-5">
          {courses.length === 0 ? (
            <>
              <p className="text-muted mb-3">No courses have been added yet.</p>
              <Link to="/courses/new" className="btn btn-primary">
                Add the first course
              </Link>
            </>
          ) : (
            <>
              <p className="text-muted mb-3">No courses match &ldquo;{search}&rdquo;.</p>
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={() => setSearch('')}
              >
                Clear search
              </button>
            </>
          )}
        </div>
      ) : (
        <>
          {search && (
            <p className="text-muted mb-3">
              Showing {filtered.length} result{filtered.length !== 1 ? 's' : ''} for &ldquo;{search}&rdquo;
            </p>
          )}
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {filtered.map(course => (
              <div className="col" key={course.id}>
                <CourseCard course={course} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
