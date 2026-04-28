import { Card, Button } from 'react-bootstrap';

function CourseCard({ course, onDrop }) {
  return (
    <Card className="mb-3 shadow-sm">
      <Card.Body>
        <Card.Title>{course.name}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          {course.code}
        </Card.Subtitle>
        <Card.Text>
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