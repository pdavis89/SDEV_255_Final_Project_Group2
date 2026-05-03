import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCourses } from '../context/CoursesContext';

// shows a course summary and registration cart actions
function CourseCard({ course }) {
  const { user } = useAuth();
  const { addToCart, removeFromCart, isEnrolled, isInCart } = useCourses();
  const professorName = course.professor?.name || course.professor?.email || 'Unassigned';
  const enrolledCount = course.enrolledStudents?.length || 0;
  const studentCanRegister = user?.role === 'student' && !isEnrolled(course);
  const courseIsInCart = isInCart(course.id);

  return (
    <Card className="mb-3 shadow-sm course-card-theme">
      <Card.Body>
        <Card.Title className="text-white">{course.name}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted text-white-60">
          {course.courseNumber}
        </Card.Subtitle>
        <Card.Text className="text-white-70">
          Professor: {professorName}
          <br />
          {enrolledCount} student{enrolledCount !== 1 ? 's' : ''} enrolled
        </Card.Text>

        <div className="d-flex gap-2 flex-wrap">
          <Button
            as={Link}
            to={`/courses/${course.id}`}
            className="btn-drop"
          >
            View Course
          </Button>

          {studentCanRegister && (
            <Button
              variant={courseIsInCart ? 'outline-light' : 'primary'}
              onClick={() => (
                courseIsInCart ? removeFromCart(course.id) : addToCart(course.id)
              )}
            >
              {courseIsInCart ? 'Remove from Cart' : 'Add to Cart'}
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}

export default CourseCard;
