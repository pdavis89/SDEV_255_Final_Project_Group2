import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCourses } from '../context/CoursesContext';
import CourseForm from '../components/CourseForm';
import Hero from '../components/Hero';

// shows the form for editing a course
export default function EditCoursePage() {
  const { id } = useParams();
  const courseId = id;
  const { getCourseById, updateCourse } = useCourses();
  const navigate = useNavigate();

  const course = getCourseById(courseId);

  // handles a bad course id in the url
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

  // saves updates and returns to the course page
  async function handleSubmit(data) {
    await updateCourse(courseId, data);
    navigate(`/courses/${courseId}`);
  }

  return (
    <>
      <Hero
        title="Edit Course"
        subtitle="Update the course details to keep your catalog accurate and complete."
      />
      <div className="course-form-page py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="form-card">
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
        </div>
      </div>
    </>
  );
}
