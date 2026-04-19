import { useNavigate } from 'react-router-dom';
import { useCourses } from '../context/CoursesContext';
import CourseForm from '../components/CourseForm';

export default function NewCoursePage() {
  const { addCourse } = useCourses();
  const navigate = useNavigate();

  function handleSubmit(data) {
    const created = addCourse(data);
    // Send the user to the new course's detail page so they can see the result.
    navigate(`/courses/${created.id}`);
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <h1 className="mb-1">Add New Course</h1>
          <p className="text-muted mb-4">Fill in the course details below.</p>

          <CourseForm
            onSubmit={handleSubmit}
            submitLabel="Create Course"
            cancelTo="/"
          />
        </div>
      </div>
    </div>
  );
}
