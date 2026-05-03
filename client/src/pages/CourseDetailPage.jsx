import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCourses } from '../context/CoursesContext';
import { useAuth } from '../context/AuthContext';

export default function CourseDetailPage() {
  const { id } = useParams();
  const courseId = id;
  const { getCourseById, deleteCourse, enrollInCourse, dropCourse, isEnrolled } = useCourses();
  const { user } = useAuth();
  const navigate = useNavigate();

  const course = getCourseById(courseId);

  if (!course) {
    return (
      <div className="container py-5">
        <h1 className="mb-2">Course not found</h1>
        <p className="text-muted mb-4">
          We couldn&apos;t find a course with ID {id}.
        </p>
        <Link to="/" className="btn btn-primary">Back to Courses</Link>
      </div>
    );
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      `Delete "${course.name}"? This cannot be undone.`
    );
    if (!confirmed) return;
    try {
      await deleteCourse(courseId);
      navigate('/');
    } catch (error) {
      window.alert(error.message);
    }
  }

  async function handleEnroll() {
    try {
      await enrollInCourse(courseId);
    } catch (error) {
      window.alert(error.message);
    }
  }

  async function handleDrop() {
    try {
      await dropCourse(courseId);
    } catch (error) {
      window.alert(error.message);
    }
  }

  const professorId = course.professor?.id || course.professor?._id || course.professor;
  const isProfessorOwner = user?.role === 'professor' && professorId === user.id;
  const isStudent = user?.role === 'student';
  const isInSchedule = isEnrolled(course);

  return (
    <div className="container py-5">
      <Link to="/" className="text-decoration-none text-muted small">
        &larr; Back to courses
      </Link>

      <div className="d-flex justify-content-between align-items-start mt-2 mb-4 flex-wrap gap-3">
        <div>
          <h1 className="mb-2">{course.name}</h1>
          <div>
            {course.courseNumber && (
              <span className="badge bg-secondary me-2">{course.courseNumber}</span>
            )}
            {course.subject && (
              <span className="badge bg-info text-dark me-2">{course.subject}</span>
            )}
            <span className="badge bg-primary">
              {course.credits} credit{course.credits !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {isProfessorOwner && (
          <div className="d-flex gap-2">
            <Link
              to={`/courses/${courseId}/edit`}
              className="btn btn-outline-secondary btn-sm"
            >
              Edit
            </Link>
            <button
              type="button"
              className="btn btn-outline-danger btn-sm"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        )}
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Description</h5>
          <p className="card-text mb-0" style={{ whiteSpace: 'pre-wrap' }}>
            {course.description}
          </p>
        </div>
      </div>

      {course.crn && (
        <p className="text-muted small mb-4">CRN: {course.crn}</p>
      )}

      {course.professor && (
        <p className="text-muted small mb-4">
          Professor: {course.professor.name || course.professor.email}
        </p>
      )}

      {isStudent && (
        isInSchedule ? (
          <button type="button" className="btn btn-outline-danger" onClick={handleDrop}>
            Drop Course
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleEnroll}
          >
            Enroll in Course
          </button>
        )
      )}
    </div>
  );
}
