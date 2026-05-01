import { Button } from 'react-bootstrap';
import './App.css';



function AddCourseButton({ onAdd }) {
  return (
    <Button className="btn-teal mb-4" onClick={onAdd}>
      + Add New Course
    </Button>
  );
}

export default AddCourseButton;