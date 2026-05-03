import { Container, Row, Col } from 'react-bootstrap';
import CourseCard from './CourseCard';

function CourseList({ courses, onDrop }) {
  return (
    <Container className="my-5">
      <Row className="g-4">
        {courses.map((course) => (
          <Col md={4} key={course.id}>
            <CourseCard
              course={course}
              onDrop={onDrop}
            />
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default CourseList;