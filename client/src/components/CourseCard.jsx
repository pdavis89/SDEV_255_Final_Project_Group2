import { Card, Button } from 'react-bootstrap';

function CourseCard({ course, onDrop }) {
  return (
    <Card className="mb-3 shadow-sm course-card-theme">
      <Card.Body>
        <Card.Title className="text-white">{course.name}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted text-white-60">
          {course.code}
        </Card.Subtitle>
        <Card.Text className="text-white-70">
          Instructor: {course.instructor}
        </Card.Text>

        <Button
          className="btn-drop"
          onClick={() => onDrop && onDrop(course.id)}
        >
          Drop Course
        </Button>
      </Card.Body>
    </Card>
  );
}

export default CourseCard;