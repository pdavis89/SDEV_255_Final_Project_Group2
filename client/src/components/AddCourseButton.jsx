import { Button } from 'react-bootstrap';
import './App.css';


// shows a button for adding a new course
function AddCourseButton({ onAdd }) {
  return (
    <Button className="btn-teal mb-4" onClick={onAdd}>
      + Add New Course
    </Button>
  );
}

export default AddCourseButton;
