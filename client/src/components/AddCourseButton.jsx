import { Button } from 'react-bootstrap';
import './App.css';



function AddCourseButton({ onAdd }) {
  return (
    <Button variant="success" className="mb-4" onClick={onAdd}>
      + Add New Course
    </Button>
  );
}

export default AddCourseButton;