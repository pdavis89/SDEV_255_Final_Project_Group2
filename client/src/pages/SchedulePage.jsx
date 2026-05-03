import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCourses } from '../context/CoursesContext';

export default function SchedulePage() {
  const { user, removeCourse } = useAuth();
  const { courses } = useCourses();

  const scheduledCourses = courses.filter(c => user.schedule.includes(c.id));

  if (scheduledCourses.length === 0) {
    return (
      <div className="schedule-page py-5">
        <div className="container">
          <div className="schedule-card p-4 text-white">
            <h1 className="mb-4">My Schedule</h1>
            <div className="text-center py-5">
              <p className="text-muted mb-4">You haven't added any courses yet.</p>
              <Link to="/" className="btn btn-teal">Browse Courses</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const totalCredits = scheduledCourses.reduce(
    (sum, c) => sum + (Number(c.credits) || 0),
    0
  );

  return (
    <div className="schedule-page py-5">
      <div className="container">
        <div className="schedule-card p-4">
          <div className="mb-4">
            <h1 className="mb-1">My Schedule</h1>
            <p className="text-muted">
              {scheduledCourses.length} course{scheduledCourses.length !== 1 ? 's' : ''} enrolled
              {' · '}
              {totalCredits} credit{totalCredits !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="table-responsive schedule-table-wrapper">
            <table className="table table-hover align-middle schedule-table">
              <thead>
                <tr>
                  <th>Course Name</th>
                  <th>Course Number</th>
                  <th>Credits</th>
                  <th>CRN</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {scheduledCourses.map(course => (
                  <tr key={course.id}>
                    <td className="fw-semibold">
                      <Link
                        to={`/courses/${course.id}`}
                        className="text-decoration-none text-white"
                      >
                        {course.name}
                      </Link>
                    </td>
                    <td>
                      {course.courseNumber
                        ? <span className="badge schedule-badge">{course.courseNumber}</span>
                        : <span className="text-muted">&mdash;</span>}
                    </td>
                    <td>{course.credits ?? <span className="text-muted">&mdash;</span>}</td>
                    <td className="text-muted">{course.crn || '—'}</td>
                    <td className="text-end">
                      <button
                        type="button"
                        className="btn btn-sm btn-teal"
                        onClick={() => removeCourse(course.id)}
                      >
                        Drop Course
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-3">
            <Link to="/" className="btn btn-teal btn-sm">
              ← Back to Courses
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
