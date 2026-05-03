import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function CourseCard({ course }) {
  const professorName = course.professor?.name || course.professor?.email || 'Unassigned';
  const enrolledCount = course.enrolledStudents?.length || 0;

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

        <Button
          as={Link}
          to={`/courses/${course.id}`}
          className="btn-drop"
        >
          View Course
        </Button>
      </Card.Body>
    </Card>
  );
}

export default CourseCard;
