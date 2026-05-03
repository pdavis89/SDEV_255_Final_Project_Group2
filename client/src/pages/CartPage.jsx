import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useCourses } from '../context/CoursesContext';

export default function CartPage() {
  const {
    getCartCourses,
    removeFromCart,
    clearCart,
    checkoutCart,
    isEnrolled,
  } = useCourses();
  const [error, setError] = useState('');
  const [checkingOut, setCheckingOut] = useState(false);
  const navigate = useNavigate();
  const cartCourses = getCartCourses();
  const totalCredits = cartCourses.reduce((sum, course) => sum + (Number(course.credits) || 0), 0);

  async function handleCheckout() {
    setError('');
    setCheckingOut(true);

    try {
      await checkoutCart();
      navigate('/schedule');
    } catch (checkoutError) {
      setError(checkoutError.message || 'Unable to enroll in selected courses.');
    } finally {
      setCheckingOut(false);
    }
  }

  return (
    <div className="schedule-page py-5">
      <div className="container">
        <div className="schedule-card p-4">
          <div className="d-flex justify-content-between align-items-start gap-3 flex-wrap mb-4">
            <div>
              <h1 className="mb-1">Registration Cart</h1>
              <p className="text-muted mb-0">
                {cartCourses.length} course{cartCourses.length !== 1 ? 's' : ''} selected
                {' - '}
                {totalCredits} credit{totalCredits !== 1 ? 's' : ''}
              </p>
            </div>

            {cartCourses.length > 0 && (
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={clearCart}
              >
                Clear Cart
              </button>
            )}
          </div>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {cartCourses.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-muted mb-4">Your registration cart is empty.</p>
              <Link to="/" className="btn btn-teal">Browse Courses</Link>
            </div>
          ) : (
            <>
              <div className="table-responsive schedule-table-wrapper">
                <table className="table table-hover align-middle schedule-table">
                  <thead>
                    <tr>
                      <th>Course Name</th>
                      <th>Course Number</th>
                      <th>Professor</th>
                      <th>Credits</th>
                      <th>Status</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartCourses.map(course => (
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
                            : <span className="text-muted">-</span>}
                        </td>
                        <td className="text-muted">
                          {course.professor?.name || course.professor?.email || '-'}
                        </td>
                        <td>{course.credits ?? <span className="text-muted">-</span>}</td>
                        <td>
                          {isEnrolled(course) ? (
                            <span className="badge bg-success">Already enrolled</span>
                          ) : (
                            <span className="badge bg-primary">Ready</span>
                          )}
                        </td>
                        <td className="text-end">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-light"
                            onClick={() => removeFromCart(course.id)}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="d-flex justify-content-between align-items-center gap-3 flex-wrap mt-4">
                <Link to="/" className="btn btn-outline-light">
                  Continue Browsing
                </Link>
                <button
                  type="button"
                  className="btn btn-teal"
                  onClick={handleCheckout}
                  disabled={checkingOut}
                >
                  {checkingOut ? 'Submitting...' : 'Submit Registration'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
