import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCourses } from '../context/CoursesContext';
import CourseForm from '../components/CourseForm';

export default function EditCoursePage() {
  const { id } = useParams();
  const courseId = Number(id);
  const { getCourseById, updateCourse } = useCourses();
  const navigate = useNavigate();

  const course = getCourseById(courseId);

  // If someone hits /courses/99999/edit for a non-existent id, handle gracefully.
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

  function handleSubmit(data) {
    updateCourse(courseId, data);
    navigate(`/courses/${courseId}`);
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <h1 className="mb-1">Edit Course</h1>
          <p className="text-muted mb-4">Update the course details below.</p>

          <CourseForm
            initialValues={course}
            onSubmit={handleSubmit}
            submitLabel="Save Changes"
            cancelTo={`/courses/${courseId}`}
          />
        </div>
      </div>
    </div>
  );
}
