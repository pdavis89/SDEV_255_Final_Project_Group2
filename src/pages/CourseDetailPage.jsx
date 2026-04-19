import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCourses } from '../context/CoursesContext';
import { useAuth } from '../context/AuthContext';

export default function CourseDetailPage() {
  const { id } = useParams();
  const courseId = Number(id);
  const { getCourseById, deleteCourse } = useCourses();
  const { user, addCourse: addCourseToSchedule } = useAuth();
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

  function handleDelete() {
    const confirmed = window.confirm(
      `Delete "${course.name}"? This cannot be undone.`
    );
    if (!confirmed) return;
    deleteCourse(courseId);
    navigate('/');
  }

  const isInSchedule = user?.schedule.includes(courseId);

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

        {/* Teacher actions. In Stage 2 these will only show for the teacher
            who owns the course. */}
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

      {/* Student "add to schedule" action, only visible when signed in. */}
      {user && (
        isInSchedule ? (
          <button type="button" className="btn btn-success" disabled>
            &#10003; Added to your schedule
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => addCourseToSchedule(courseId)}
          >
            Add to Schedule
          </button>
        )
      )}
    </div>
  );
}
