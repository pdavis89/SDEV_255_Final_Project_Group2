import CourseCard from './CourseCard';

function CourseList({ courses, onDrop }) {
  return (
    <>
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} onDrop={onDrop} />
      ))}
    </>
  );
}

export default CourseList;