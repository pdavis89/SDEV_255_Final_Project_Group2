import { Button } from 'react-bootstrap';

function AddCourseButton({ onAdd }) {
  return (
    <Button variant="success" className="mb-4" onClick={onAdd}>
      + Add New Course
    </Button>
  );
}

export default AddCourseButton;