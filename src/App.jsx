import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import { Container, Row, Col, Button } from 'react-bootstrap'
import CourseList from './components/CourseList'
import AddCourseButton from './components/AddCourseButton'

function App() {const [courses, setCourses] = useState([
  { id: 1, name: "Web Development", code: "SDEV 255", instructor: "Prof. Davis" },
  { id: 2, name: "Database Systems", code: "SDEV 260", instructor: "Prof. Smith" }
]);

const handleAddCourse = () => {
  const newCourse = {
    id: Date.now(),
    name: "New Course",
    code: "NEW 101",
    instructor: "TBD"
  };
  setCourses([...courses, newCourse]);
};

const handleDropCourse = (id) => {
  setCourses(courses.filter(course => course.id !== id));
};

 return (
  <>
    <Navbar />

    <Container className="py-5">
      <Row className="mb-4 text-center">
        <Col>
          <h1 className="display-4">Bookish Systems</h1>
          <p className="lead">
            Manage your course registrations
          </p>
        </Col>
      </Row>

      <Row>
        <Col className="text-center">
          <AddCourseButton onAdd={handleAddCourse} />
        </Col>
      </Row>

      <Row className="mt-4">
        <Col md={8} className="mx-auto">
          <CourseList courses={courses} onDrop={handleDropCourse} />
        </Col>
      </Row>
    </Container>
  </>
)
}

export default App
