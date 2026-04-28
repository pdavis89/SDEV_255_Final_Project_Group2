import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCourses } from '../context/CoursesContext';
import CourseCard from '../components/CourseCard';
import SearchBar from '../components/SearchBar';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Hero from "../components/Hero";

export default function Courses() {
  const { courses } = useCourses();
  const [search, setSearch] = useState('');

  const filtered = courses.filter(course => {
    const q = search.toLowerCase();
    return (
      course.name.toLowerCase().includes(q) ||
      (course.code && course.code.toLowerCase().includes(q))
    );
  });

  return (
    <>
      {/* HERO (NEW DESIGN) */}
      <Hero
        title="AVAILABLE COURSES"
        subtitle="Browse and manage your registered courses"
      />

      {/* HEADER */}
      <Container className="my-4">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <div>
            <h2 className="fw-bold">Available Courses</h2>
            <p className="text-muted mb-0">
              {courses.length} course{courses.length !== 1 ? 's' : ''} available this semester
            </p>
          </div>

          <Link to="/courses/new">
            <Button className="add-course-btn">+ Add Course</Button>
          </Link>
        </div>
      </Container>

      {/* SEARCH */}
      <Container>
        <SearchBar value={search} onChange={setSearch} />
      </Container>

      {/* COURSE CONTENT */}
      {filtered.length === 0 ? (
        <div className="text-center py-5">
          {courses.length === 0 ? (
            <>
              <p className="text-muted mb-3">No courses have been added yet.</p>
              <Link to="/courses/new" className="add-course-btn">
                Add the first course
              </Link>
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
    </>
  );
}