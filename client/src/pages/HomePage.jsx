import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCourses } from '../context/CoursesContext';
import { useAuth } from '../context/AuthContext';
import CourseCard from '../components/CourseCard';
import SearchBar from '../components/SearchBar';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Hero from "../components/Hero";


export default function Courses() {
  const { courses, loading, error } = useCourses();
  const { user } = useAuth();
  const [search, setSearch] = useState('');

  const filtered = courses.filter(course => {
    const q = search.toLowerCase();
    return (
      course.name.toLowerCase().includes(q) ||
      (course.courseNumber && course.courseNumber.toLowerCase().includes(q))
    );
  });

  return (
    <>
      {/* HERO (NEW DESIGN) */}
      <Hero
        title="HOME PAGE"
        subtitle="Welcome to the Course Registration System. Browse courses, register for classes, and manage your schedule."
        subtext="Use the navigation above or the buttons below to get started with your academic planning."
      />

      <div className="home-cta-row container my-4 d-flex flex-wrap gap-3 justify-content-center">
        {!user && <Link to="/register" className="btn btn-teal btn-lg">Register Now</Link>}
        {!user && <Link to="/login" className="btn btn-teal btn-lg">Login</Link>}
        {user?.role === 'student' && <Link to="/schedule" className="btn btn-teal btn-lg">Manage Schedule</Link>}
        {user?.role === 'professor' && <Link to="/courses/new" className="btn btn-teal btn-lg">Create Course</Link>}
      </div>

      <div className="home-content py-4">
        <Container className="my-4 home-header-section">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <div>
              <h2 className="fw-bold text-white">Available Courses</h2>
              <p className="text-white-60 mb-0">
                {courses.length} course{courses.length !== 1 ? 's' : ''} available this semester
              </p>
            </div>

            {user?.role === 'professor' && (
              <Link to="/courses/new">
                <Button className="btn btn-teal px-4">+ Add Course</Button>
              </Link>
            )}
          </div>
        </Container>

        <Container className="my-4">
          <SearchBar value={search} onChange={setSearch} />
        </Container>

        {loading ? (
        <div className="text-center py-5">
          <p className="text-muted mb-0">Loading courses...</p>
        </div>
      ) : error ? (
        <div className="text-center py-5">
          <p className="text-muted mb-0">{error}</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-5">
          {courses.length === 0 ? (
            <>
              <p className="text-muted mb-3">No courses have been added yet.</p>
              {user?.role === 'professor' && (
                <Link to="/courses/new" className="add-course-btn">
                  Add the first course
                </Link>
              )}
            </>
          ) : (
            <>
              <p className="text-muted mb-3">
                No courses match &ldquo;{search}&rdquo;.
              </p>
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
        <Container className="my-4">
          <Row className="g-4">
            {filtered.map(course => (
              <Col md={4} key={course.id}>
                <CourseCard course={course} />
              </Col>
            ))}
          </Row>
        </Container>
      )}
      </div>
    </>
  );
}
