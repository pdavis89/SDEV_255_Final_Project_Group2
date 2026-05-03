import { Link, NavLink } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import BsNavbar from 'react-bootstrap/Navbar';
import brandLogo from '../assets/brand.png';
import { useAuth } from '../context/AuthContext';
import { useCourses } from '../context/CoursesContext';

// shows navigation based on the current user role
function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCourses();
  const displayName = user?.name || user?.email || 'there';
  const roleLabel = user?.role === 'professor' ? 'Professor' : 'Student';

  return (
    <BsNavbar expand="lg" className="bg-body-tertiary" sticky="top">
      <Container fluid>
        <BsNavbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <img
            src={brandLogo}
            alt="Logo"
            width="30"
            height="30"
            className="me-2"
          />
          <span className="fw-bold">Course Registration System</span>
        </BsNavbar.Brand>
        <BsNavbar.Toggle aria-controls="navbarScroll" />
        <BsNavbar.Collapse id="navbarScroll">
          <Nav className="me-auto my-2 my-lg-0" navbarScroll>
            <Nav.Link as={NavLink} to="/">Home</Nav.Link>
            {user?.role === 'student' && (
              <>
                <Nav.Link as={NavLink} to="/cart">
                  Cart{cartCount > 0 ? ` (${cartCount})` : ''}
                </Nav.Link>
                <Nav.Link as={NavLink} to="/schedule">My Schedule</Nav.Link>
              </>
            )}
            {user?.role === 'professor' && (
              <Nav.Link as={NavLink} to="/courses/new">Create Course</Nav.Link>
            )}
          </Nav>
          <Nav>
            {user ? (
              <>
                <span className="navbar-text me-3">Hi, {displayName}</span>
                <span className="badge bg-info text-dark align-self-center me-3">
                  {roleLabel}
                </span>
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
                  onClick={logout}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Nav.Link as={NavLink} to="/login">Sign In</Nav.Link>
                <Nav.Link as={NavLink} to="/register">Register</Nav.Link>
              </>
            )}
          </Nav>
        </BsNavbar.Collapse>
      </Container>
    </BsNavbar>
  );
}

export default Navbar;
