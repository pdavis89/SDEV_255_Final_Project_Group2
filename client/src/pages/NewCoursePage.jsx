import { useNavigate } from 'react-router-dom';
import { useCourses } from '../context/CoursesContext';
import CourseForm from '../components/CourseForm';
import Hero from '../components/Hero';

// shows the form for creating a course
export default function NewCoursePage() {
  const { addCourse } = useCourses();
  const navigate = useNavigate();

  // creates the course and opens its detail page
  async function handleSubmit(data) {
    const created = await addCourse(data);
    navigate(`/courses/${created.id}`);
  }

  return (
    <>
      <Hero
        title="Add New Course"
        subtitle="Complete the fields below to add a new course to the catalog."
      />
      <div className="course-form-page py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="form-card">
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
        </div>
      </div>
    </>
  );
}
