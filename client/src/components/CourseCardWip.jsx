import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function CourseCard({ course }) {
  const { user, addCourse } = useAuth();
  const navigate = useNavigate();

  const isAdded = user?.schedule.includes(course.id);

  function handleAdd() {
    if (!user) {
      // Send them to login if they try to add without being signed in
      navigate('/login');
      return;
    }
    addCourse(course.id);
  }

  return (
    <div className="card h-100">
      <div className="card-body d-flex flex-column">
        <h5 className="card-title mb-2">
          <Link
            to={`/courses/${course.id}`}
            className="text-decoration-none text-dark"
          >
            {course.name}
          </Link>
        </h5>

        <div className="mb-2 small">
          {course.courseNumber && (
            <span className="badge bg-secondary me-1">{course.courseNumber}</span>
          )}
          {course.subject && (
            <span className="badge bg-info text-dark me-1">{course.subject}</span>
          )}
          {course.credits != null && (
            <span className="badge bg-primary">{course.credits} cr</span>
          )}
        </div>

        {course.description && (
          <p className="card-text text-muted small flex-grow-1">
            {course.description.length > 120
              ? course.description.slice(0, 120).trim() + '…'
              : course.description}
          </p>
        )}

        <div className="mt-auto">
          {isAdded ? (
            <button type="button" className="btn btn-success w-100" disabled>
              &#10003; Added to Schedule
            </button>
          ) : (
            <button type="button" className="btn btn-primary w-100" onClick={handleAdd}>
              {user ? 'Add to Schedule' : 'Sign In to Enroll'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
