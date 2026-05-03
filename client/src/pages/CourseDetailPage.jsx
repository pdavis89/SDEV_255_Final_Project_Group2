import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCourses } from '../context/CoursesContext';
import { useAuth } from '../context/AuthContext';

export default function CourseDetailPage() {
  const { id } = useParams();
  const courseId = id;
  const {
    getCourseById,
    deleteCourse,
    dropCourse,
    addToCart,
    removeFromCart,
    isEnrolled,
    isInCart,
  } = useCourses();
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

  function handleAddToCart() {
    addToCart(courseId);
  }

  async function handleDrop() {
    try {
      await dropCourse(courseId);
    } catch (error) {
      window.alert(error.message);
    }
  }

  const isProfessor = user?.role === 'professor';
  const isStudent = user?.role === 'student';
  const isInSchedule = isEnrolled(course);
  const courseIsInCart = isInCart(courseId);
  const professorName = course.professor?.name || course.professor?.email || 'Unassigned';

  return (
    <div className="course-detail-page py-5">
      <div className="container">
        <Link to="/" className="course-detail-back">
          &larr; Back to courses
        </Link>

        <section className="course-detail-shell mt-3">
          <div className="course-detail-header">
            <div>
              <p className="course-detail-eyebrow mb-2">{course.subject || 'Course Catalog'}</p>
              <h1>{course.name}</h1>
              <div className="course-detail-badges">
                {course.courseNumber && (
                  <span>{course.courseNumber}</span>
                )}
                <span>{course.credits} credit{course.credits !== 1 ? 's' : ''}</span>
                {course.crn && (
                  <span>CRN {course.crn}</span>
                )}
              </div>
            </div>

            {isProfessor && (
              <div className="course-detail-actions">
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

          <div className="course-detail-grid">
            <section className="course-detail-panel course-detail-description">
              <h2>Description</h2>
              <p>{course.description}</p>
            </section>

            <aside className="course-detail-panel">
              <h2>Course Info</h2>
              <dl className="course-detail-meta">
                <div>
                  <dt>Professor</dt>
                  <dd>{professorName}</dd>
                </div>
                <div>
                  <dt>Subject</dt>
                  <dd>{course.subject || '-'}</dd>
                </div>
                <div>
                  <dt>Course Number</dt>
                  <dd>{course.courseNumber || '-'}</dd>
                </div>
                <div>
                  <dt>CRN</dt>
                  <dd>{course.crn || '-'}</dd>
                </div>
                <div>
                  <dt>Credits</dt>
                  <dd>{course.credits ?? '-'}</dd>
                </div>
              </dl>
            </aside>
          </div>

          {isStudent && (
            <section className="course-detail-register">
              <div>
                <h2>Registration</h2>
                <p>
                  {isInSchedule
                    ? 'You are enrolled in this course.'
                    : courseIsInCart
                      ? 'This course is waiting in your registration cart.'
                      : 'Add this course to your cart before submitting registration.'}
                </p>
              </div>

              {isInSchedule ? (
                <button type="button" className="btn btn-outline-danger" onClick={handleDrop}>
                  Drop Course
                </button>
              ) : courseIsInCart ? (
                <div className="d-flex gap-2 flex-wrap">
                  <Link to="/cart" className="btn btn-success">
                    View Registration Cart
                  </Link>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => removeFromCart(courseId)}
                  >
                    Remove from Cart
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="btn btn-teal"
                  onClick={handleAddToCart}
                >
                  Add to Registration Cart
                </button>
              )}
            </section>
          )}
        </section>
      </div>
    </div>
  );
}
